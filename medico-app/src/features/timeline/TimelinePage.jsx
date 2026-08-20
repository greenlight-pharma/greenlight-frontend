import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { usePatientSummary, usePatientHistory } from "../patients/api.js";
import { dataHoraBR } from "../patients/PatientItem.jsx";
import { RESPOSTA } from "../../lib/adherence.js";

// [TIMELINE] No medico.html a linha do tempo é PÁGINA própria, aberta pelo
// menu do prontuário — não um card no meio dele. Mantido assim: o prontuário
// já é longo, e a linha do tempo é uma leitura diferente dos mesmos dados.
export default function TimelinePage() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const summary = usePatientSummary(phone);
  const history = usePatientHistory(phone);

  const itens = useMemo(() => {
    const consultas = (summary.data?.appointments || []).map((a) => ({
      id: `apt-${a.id}`,
      quando: a.concludedAt || a.acceptedAt || a.createdAt,
      icone: "🩺",
      titulo: a.reason || "Consulta",
      detalhe: [
        a.status === "concluida" ? "Concluída" : "Em atendimento",
        a.doctorName && `Médico: ${a.doctorName}`,
      ]
        .filter(Boolean)
        .join(" · "),
    }));

    const exames = (summary.data?.exams || []).map((e) => ({
      id: `ex-${e.id}`,
      quando: e.uploadedAt,
      icone: (e.examType || "lab") === "imaging" ? "🩻" : "🧪",
      titulo: e.fileName || "Exame",
      detalhe: e.doctorName ? `Anexado por ${e.doctorName}` : "Exame anexado",
    }));

    const eventos = (history.data?.events || []).map((e) => {
      const payload = typeof e.payload === "string" ? seguro(e.payload) : e.payload || {};
      if (e.type === "medication_response") {
        const info = RESPOSTA[payload.response] || {};
        return {
          id: `ev-${e.id}`,
          quando: e.createdAt,
          icone: info.icone || "💊",
          titulo: `${payload.medicationName || "Medicação"} — ${info.label || payload.response}`,
          detalhe: `Lembrete das ${payload.scheduleTime || "—"} · informado pelo paciente (WhatsApp)`,
        };
      }
      return {
        id: `ev-${e.id}`,
        quando: e.createdAt,
        icone: "💬",
        titulo: rotulo(e.type),
        detalhe: String(payload.text || payload.mensagem || payload.summary || "").slice(0, 180),
      };
    });

    return [...consultas, ...exames, ...eventos]
      .filter((i) => i.quando)
      .sort((a, b) => new Date(b.quando) - new Date(a.quando));
  }, [summary.data, history.data]);

  if (summary.isLoading) return <Loading label="Carregando linha do tempo..." />;
  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.refetch} />;

  const p = summary.data?.patient || {};

  return (
    <>
      <PageHeader
        title="📈 Linha do tempo"
        subtitle={`${p.name || "—"}${p.patientAge ? `, ${p.patientAge} anos` : ""}`}
        actions={
          <button className="btn-secondary-outline" onClick={() => navigate(`/pacientes/${phone}`)}>
            ← Voltar ao prontuário
          </button>
        }
      />

      <div className="card">
        <div className="card-subtitle">
          Todos os eventos do paciente em ordem cronológica (mais recente
          primeiro). Reúne consultas, medicações, exames e medidas — apenas
          reorganiza o que já está no prontuário.
        </div>

        {history.isLoading && <div className="state-msg">Carregando histórico...</div>}
        {!history.isLoading && !itens.length && (
          <div className="state-msg">Nenhum evento registrado para este paciente.</div>
        )}

        <ul className="timeline">
          {itens.map((i) => (
            <li key={i.id}>
              <span className="tl-icone">{i.icone}</span>
              <div>
                <div className="tl-titulo">{i.titulo}</div>
                {i.detalhe && <div className="tl-detalhe">{i.detalhe}</div>}
                <div className="tl-quando">{dataHoraBR(i.quando)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function seguro(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

function rotulo(type) {
  return (
    { checkin: "Check-in diário", triagem: "Triagem pelo bot", weekly_summary: "Resumo semanal" }[
      type
    ] || type
  );
}
