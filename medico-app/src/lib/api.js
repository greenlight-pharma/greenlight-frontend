import { API_URL } from "./config.js";
import { getToken, emitSessionExpired } from "./auth.js";

// Erro de API com o status junto, pra quem chama poder distinguir
// "não encontrado" de "sem permissão" sem parsear string de mensagem.
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// [API-UNICA] Toda chamada ao backend passa por aqui. O medico.html repetia
// em 36 lugares: montar header, checar response.ok, ler .error do corpo,
// montar throw. Qualquer um desses pontos que esquecesse um passo virava bug
// silencioso — e todos esqueciam o 401.
//
// Regras centralizadas:
// - Authorization: Bearer <token> automático (quando há token).
// - 401 -> dispara sessão expirada UMA vez e lança erro claro.
// - Corpo não-JSON (proxy caindo, HTML de erro do Railway) não estoura
//   "Unexpected token < in JSON" — vira mensagem legível.
// - 204/corpo vazio devolve null em vez de explodir no .json().
async function request(path, { method = "GET", body, signal, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    // AbortError é cancelamento nosso (troca de tela, debounce) — não é falha
    // de rede e não deve virar mensagem de erro pro médico.
    if (err.name === "AbortError") throw err;
    throw new ApiError(
      "Sem conexão com o servidor. Verifique a internet e tente de novo.",
      0,
      null
    );
  }

  // [401] O backend usa 401 pra DUAS coisas diferentes: token vencido e
  // credencial errada no /auth/login. Se derrubássemos a sessão nos dois,
  // errar a senha na tela de login dispararia "sua sessão expirou" — que
  // não faz sentido pra quem nem entrou ainda. Chamadas sem auth (login)
  // só devolvem o erro; as autenticadas é que derrubam a sessão.
  if (response.status === 401 && auth) {
    emitSessionExpired();
    throw new ApiError("Sua sessão expirou. Entre novamente.", 401, null);
  }

  const raw = await response.text();
  let data = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Erro ${response.status} ao falar com o servidor.`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

// Upload de arquivo (exames). Não usa JSON: o browser precisa montar o
// boundary do multipart sozinho, então NÃO setamos Content-Type aqui.
export async function apiUpload(path, formData) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  // [401] O backend usa 401 pra DUAS coisas diferentes: token vencido e
  // credencial errada no /auth/login. Se derrubássemos a sessão nos dois,
  // errar a senha na tela de login dispararia "sua sessão expirou" — que
  // não faz sentido pra quem nem entrou ainda. Chamadas sem auth (login)
  // só devolvem o erro; as autenticadas é que derrubam a sessão.
  if (response.status === 401 && auth) {
    emitSessionExpired();
    throw new ApiError("Sua sessão expirou. Entre novamente.", 401, null);
  }

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      (data && data.error) || "Erro ao enviar arquivo.",
      response.status,
      data
    );
  }
  return data;
}
