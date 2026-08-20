import { API_URL } from "./config.js";
import { getToken, emitSessionExpired } from "./auth.js";
import { ApiError } from "./api.js";

/**
 * [STREAMING] Consome o SSE do /assistant/ask.
 *
 * Protocolo do backend:
 *   data: {"delta":"..."}   pedaço de texto
 *   data: {"done":true}     terminou completo
 *   data: {"error":"..."}   interrompeu — o texto recebido pode estar cortado
 *
 * O `done` importa clinicamente: sem ele, o médico pode estar lendo uma
 * resposta truncada no meio de um diferencial e achar que acabou. Por isso
 * quem chama recebe `completo` e mostra aviso quando for false.
 */
export async function streamAssistant({ question, onDelta, signal }) {
  const response = await fetch(`${API_URL}/assistant/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ question }),
    signal,
  });

  if (response.status === 401) {
    emitSessionExpired();
    throw new ApiError("Sua sessão expirou. Entre novamente.", 401, null);
  }

  if (!response.ok || !response.body) {
    let erro = "Não foi possível obter resposta agora.";
    try {
      const data = JSON.parse(await response.text());
      erro = data.error || erro;
    } catch {
      /* corpo não-JSON: mantém a mensagem genérica */
    }
    throw new ApiError(erro, response.status, null);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let texto = "";
  let completo = false;
  let erroStream = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE separa eventos por linha em branco. Guardamos o resto no buffer:
    // um chunk da rede pode cortar um evento ao meio.
    const partes = buffer.split("\n\n");
    buffer = partes.pop() ?? "";

    for (const parte of partes) {
      const linha = parte.split("\n").find((l) => l.startsWith("data:"));
      if (!linha) continue;
      let payload;
      try {
        payload = JSON.parse(linha.slice(5).trim());
      } catch {
        continue;
      }
      if (payload.delta) {
        texto += payload.delta;
        onDelta?.(texto);
      } else if (payload.done) {
        completo = true;
      } else if (payload.error) {
        erroStream = payload.error;
      }
    }
  }

  return { texto, completo, erro: erroStream };
}
