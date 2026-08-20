import { useMemo } from "react";
import { RESPOSTA } from "../../lib/adherence.js";

// [TIMELINE] Consultas e eventos do paciente numa linha só, mais recente
// primeiro. O painel antigo montava isso com innerHTML e concatenação de
// string; aqui os dois fluxos viram uma lista tipada e ordenada.
export default function TimelineCard({ appointments = [], events = [], loading }) {
  const itens = useMemo(() => {
    const consultas = appointments.map((a) => ({
      id: `apt-${a.id}`,
      quando: a.createdAt,
      icone: "🩺",
      titulo: a.reason || "Consulta",
      detalhe: [a.status, a.acceptedDoctorName].filter(Boolean).join(" · "),
    }));

    const eventos = events.map((e) => {
      const payload = typeof e.payload === "string" ? safeParse(e.payload) : e.payload || {};
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
        titulo: rotuloEvento(e.type),
        detalhe: resumoPayload(payload),
      };
    });

    return [...consultas, ...eventos].sort(
      (a, b) => new Date(b.quando) - new Date(a.quando)
    );
  }, [appointments, events]);

  return (
    <div className="card">
      <h3>🕒 Linha do tempo</h3>
      {loading && <div className="state-msg">Carregando histórico...</div>}
      {!loading && !itens.length && (
        <div className="state-msg">Nenhum evento registrado para este paciente.</div>
      )}
      <ul className="timeline">
        {itens.map((i) => (
          <li key={i.id}>
            <span className="tl-icone">{i.icone}</span>
            <div>
              <div className="tl-titulo">{i.titulo}</div>
              <div className="tl-detalhe">{i.detalhe}</div>
              <div className="tl-quando">{formatarDataHora(i.quando)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

function rotuloEvento(type) {
  const mapa = {
    checkin: "Check-in diário",
    triagem: "Triagem pelo bot",
    weekly_summary: "Resumo semanal",
  };
  return mapa[type] || type;
}

function resumoPayload(payload) {
  if (!payload || typeof payload !== "object") return "";
  const texto = payload.text || payload.mensagem || payload.summary || "";
  return String(texto).slice(0, 180);
}

function formatarDataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
