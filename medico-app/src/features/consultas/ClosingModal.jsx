import { useState, useEffect, useRef } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { useDraftSoap, useConcludeAppointment } from "./api.js";

const CAMPOS = [
  {
    chave: "subjective",
    rotulo: "S — Subjetivo",
    dica: "O que o paciente relata: queixa, história, sintomas nas palavras dele.",
  },
  {
    chave: "objective",
    rotulo: "O — Objetivo",
    dica: "Exame físico, sinais vitais, resultados de exame.",
  },
  {
    chave: "assessment",
    rotulo: "A — Avaliação",
    dica: "Sua impressão clínica. Obrigatório para encerrar.",
    obrigatorio: true,
  },
  {
    chave: "plan",
    rotulo: "P — Plano",
    dica: "Conduta, prescrição, retorno, encaminhamento. Obrigatório para encerrar.",
    obrigatorio: true,
  },
];

const LIMITE = 10000; // igual ao do backend

// [SOAP] Encerramento de consulta.
export default function ClosingModal({ appointment, onClose }) {
  const [notas, setNotas] = useState(() => ({
    subjective: appointment.closingNotes?.subjective || "",
    objective: appointment.closingNotes?.objective || "",
    assessment: appointment.closingNotes?.assessment || "",
    plan: appointment.closingNotes?.plan || "",
  }));
  const [erro, setErro] = useState("");
  const [rascunhoEm, setRascunhoEm] = useState(null);

  const rascunho = useDraftSoap(appointment.id);
  const encerrar = useConcludeAppointment(appointment.id);
  const primeiraRenderizacao = useRef(true);

  // [RASCUNHO] Salva sozinho a cada 5s de pausa. No painel antigo, fechar o
  // modal sem querer (ou a sessão cair) perdia a nota inteira — e refazer
  // um SOAP de memória, depois do paciente ter saído, é perda clínica real.
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    const t = setTimeout(async () => {
      try {
        await rascunho.mutateAsync(notas);
        setRascunhoEm(new Date());
      } catch {
        // Falha de rascunho é silenciosa de propósito: não pode interromper
        // quem está escrevendo. O erro real aparece no encerrar.
      }
    }, 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notas]);

  function set(chave, valor) {
    setNotas((n) => ({ ...n, [chave]: valor.slice(0, LIMITE) }));
  }

  async function concluir(e) {
    e.preventDefault();
    setErro("");

    // Mesma regra do backend, verificada aqui pra não perder a ida ao
    // servidor com o médico esperando.
    const faltando = CAMPOS.filter((c) => c.obrigatorio && !notas[c.chave].trim());
    if (faltando.length) {
      setErro(`Preencha antes de encerrar: ${faltando.map((c) => c.rotulo).join(" e ")}.`);
      return;
    }

    try {
      await encerrar.mutateAsync(notas);
      onClose();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <Modal
      open
      wide
      title={`Encerrar consulta — ${appointment.name || "paciente"}`}
      onClose={onClose}
    >
      <form onSubmit={concluir}>
        <div className="modal-context">
          Motivo: <strong>{appointment.reason || "não informado"}</strong>
        </div>

        {CAMPOS.map((campo) => (
          <div key={campo.chave}>
            <label htmlFor={`soap-${campo.chave}`}>
              {campo.rotulo}
              {campo.obrigatorio && <span className="obrigatorio"> *</span>}
            </label>
            <textarea
              id={`soap-${campo.chave}`}
              className="soap-campo"
              value={notas[campo.chave]}
              onChange={(e) => set(campo.chave, e.target.value)}
            />
            <div className="small">
              {campo.dica}
              {notas[campo.chave].length > LIMITE * 0.9 && (
                <> · {LIMITE - notas[campo.chave].length} caracteres restantes</>
              )}
            </div>
          </div>
        ))}

        <div className="rascunho-status">
          {rascunho.isPending
            ? "Salvando rascunho…"
            : rascunhoEm
              ? `Rascunho salvo às ${rascunhoEm.toLocaleTimeString("pt-BR")}`
              : "O rascunho é salvo automaticamente."}
        </div>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Fechar sem encerrar
          </button>
          <button className="primary" disabled={encerrar.isPending}>
            {encerrar.isPending ? "Encerrando..." : "Encerrar consulta"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
