import { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Message from "../../components/Message.jsx";
import { streamAssistant } from "../../lib/stream.js";
import { renderMarkdown, renderMarkdownParcial } from "../../lib/markdown.js";

// [ASSISTENTE] Apoio ao raciocínio do MÉDICO — não atende paciente e não tem
// memória entre perguntas (é assim no backend: cada pergunta é avulsa).
export default function AssistantPage() {
  const [pergunta, setPergunta] = useState("");
  const [conversa, setConversa] = useState([]);
  const [parcial, setParcial] = useState("");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef(null);

  // Cancela o stream se o médico sair da tela no meio — senão a resposta
  // continua chegando para um componente que já não existe.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function perguntar(e) {
    e?.preventDefault();
    const texto = pergunta.trim();
    if (busy) return;

    // Mesmos limites do backend, checados antes de gastar a chamada à IA.
    if (texto.length < 10) {
      setErro("Descreva o caso com um pouco mais de detalhe (mínimo 10 caracteres).");
      return;
    }
    if (texto.length > 1500) {
      setErro("Pergunta muito longa (máximo 1500 caracteres).");
      return;
    }

    setErro("");
    setBusy(true);
    setParcial("");
    setConversa((c) => [...c, { papel: "medico", texto }]);
    setPergunta("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { texto: resposta, completo, erro: erroStream } = await streamAssistant({
        question: texto,
        onDelta: setParcial,
        signal: controller.signal,
      });

      setConversa((c) => [
        ...c,
        { papel: "assistente", texto: resposta, completo, erroStream },
      ]);
    } catch (err) {
      if (err.name !== "AbortError") {
        setErro(err.message);
        // Devolve a pergunta ao campo: o médico não perde o que escreveu
        // quando a rede falha.
        setPergunta(texto);
        setConversa((c) => c.slice(0, -1));
      }
    } finally {
      setParcial("");
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <PageHeader
        title="Assistente clínico"
        subtitle="Apoio ao raciocínio. Não substitui seu julgamento nem atende pacientes."
      />

      <div className="card assistente">
        <div className="assistente-conversa">
          {!conversa.length && !busy && (
            <div className="state-msg">
              Faça uma pergunta clínica pontual. Ex: “quais diferenciais considerar
              em dispneia súbita em paciente de 60 anos, tabagista?”
            </div>
          )}

          {conversa.map((m, i) =>
            m.papel === "medico" ? (
              <div key={i} className="balao balao-medico">
                {m.texto}
              </div>
            ) : (
              <div key={i} className="balao balao-assistente">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(m.texto) }} />
                {/* Aviso de resposta truncada. Sem ele, o médico pode ler um
                    diferencial cortado no meio achando que terminou. */}
                {!m.completo && (
                  <Message type="warning">
                    ⚠️ A resposta foi interrompida antes de terminar
                    {m.erroStream ? ` (${m.erroStream})` : ""}. Pergunte de novo
                    antes de considerar o conteúdo completo.
                  </Message>
                )}
              </div>
            )
          )}

          {busy && (
            <div className="balao balao-assistente">
              {parcial ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdownParcial(parcial) }} />
              ) : (
                "Consultando o assistente…"
              )}
            </div>
          )}
        </div>

        <Message type="error">{erro}</Message>

        <form onSubmit={perguntar} className="assistente-form">
          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Sua dúvida clínica…"
            maxLength={1500}
            onKeyDown={(e) => {
              // Enter envia, Shift+Enter quebra linha.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                perguntar(e);
              }
            }}
          />
          <button className="primary" disabled={busy || pergunta.trim().length < 10}>
            {busy ? "Consultando…" : "Perguntar"}
          </button>
        </form>

        <div className="small">
          O assistente organiza raciocínio: levanta hipóteses, lembra
          diferenciais e sinais de alarme. A decisão é sua.
        </div>
      </div>
    </>
  );
}
