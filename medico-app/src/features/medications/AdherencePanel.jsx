import { RESPOSTA } from "../../lib/adherence.js";

// [ADESAO] O dado sempre existiu no backend (patient_events) e nunca teve
// tela. Para UBS é o número que a coordenação vai pedir: quem está
// abandonando o tratamento antes de descompensar.
//
// Renderiza como SEÇÃO dentro do card de Medicações, não como card próprio —
// card dentro de card duplica borda e padding, e a adesão fala justamente
// sobre as medicações listadas acima dela.
export default function AdherencePanel({ resumo = [], respostas = [] }) {
  if (!resumo.length) {
    return (
      <div className="adesao-secao">
        <strong>📊 Adesão ao tratamento</strong>
        <div className="state-msg">
          Nenhuma resposta do paciente registrada nos últimos 30 dias. O
          lembrete pode estar sendo enviado sem retorno — vale confirmar o
          número de WhatsApp.
        </div>
      </div>
    );
  }

  return (
    <div className="adesao-secao">
      <strong>📊 Adesão ao tratamento (30 dias)</strong>

      <div className="adesao-grid">
        {resumo.map((r) => (
          <div key={r.medicationId ?? r.medicationName} className="adesao-card">
            <div className="adesao-med">{r.medicationName || "Medicação"}</div>
            <div className={`adesao-taxa ${r.taxa < 60 ? "baixa" : "boa"}`}>
              {r.taxa}%
            </div>
            <div className="adesao-detalhe">
              {r.tomou} tomou · {r.nao_tomou} não tomou
              {r.efeito_colateral > 0 && ` · ${r.efeito_colateral} efeito colateral`}
            </div>
          </div>
        ))}
      </div>

      {/* Este aviso não é decoração. Sem ele, o médico lê "40%" como
          "tomou 40% das doses", que é falso: o paciente que ignora o
          lembrete não gera evento nenhum. O denominador é resposta. */}
      <div className="adesao-nota">
        ℹ️ O percentual é sobre os lembretes que o paciente <strong>respondeu</strong>,
        não sobre as doses prescritas. Quem não responde não entra na conta.
      </div>

      {respostas.length > 0 && (
        <details className="adesao-historico">
          <summary>Ver respostas ({respostas.length})</summary>
          <table className="tabela">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Medicação</th>
                <th>Horário</th>
                <th>Resposta</th>
              </tr>
            </thead>
            <tbody>
              {respostas.map((r) => {
                const info = RESPOSTA[r.resposta] || {};
                return (
                  <tr key={r.id}>
                    <td>{formatarDataHora(r.createdAt)}</td>
                    <td>{r.medicationName}</td>
                    <td>{r.scheduleTime}</td>
                    <td className={`resposta-${info.tipo || ""}`}>
                      {info.icone} {info.label || r.resposta}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}

function formatarDataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
