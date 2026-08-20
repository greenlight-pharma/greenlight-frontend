import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { useMyAppointments } from "../consultas/api.js";
import { formatBRPhone } from "../../lib/phone.js";

const DIAS = 7;

// [AGENDA] Visão de 7 dias. É LEITURA organizada das consultas aceitas —
// não agenda com marcação (marcar continua sendo pelo bot).
export default function AgendaPage() {
  const { data, isLoading, error, refetch } = useMyAppointments();

  const dias = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    const janela = Array.from({ length: DIAS }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return { data: d, chave: chaveDia(d), consultas: [] };
    });
    const porChave = new Map(janela.map((d) => [d.chave, d]));

    for (const apt of data || []) {
      const quando = apt.appointmentAt || apt.acceptedAt;
      if (!quando) continue;
      const dia = porChave.get(chaveDia(new Date(quando)));
      if (dia) dia.consultas.push(apt);
    }

    for (const d of janela) {
      d.consultas.sort(
        (a, b) =>
          new Date(a.appointmentAt || a.acceptedAt) -
          new Date(b.appointmentAt || b.acceptedAt)
      );
    }
    return janela;
  }, [data]);

  const semData = useMemo(
    () => (data || []).filter((a) => !a.appointmentAt && !a.acceptedAt),
    [data]
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      <PageHeader title="Agenda" subtitle="Próximos 7 dias" />

      <div className="agenda-grade">
        {dias.map((dia) => (
          <div className="card agenda-dia" key={dia.chave}>
            <div className="agenda-cabecalho">
              <strong>{rotuloDia(dia.data)}</strong>
              <span className="texto-suave">{dia.data.toLocaleDateString("pt-BR")}</span>
            </div>

            {!dia.consultas.length && (
              <div className="state-msg">Sem consultas neste dia.</div>
            )}

            {dia.consultas.map((apt) => (
              <div className="agenda-item" key={apt.id}>
                <div className="agenda-hora">
                  {formatarHora(apt.appointmentAt || apt.acceptedAt)}
                </div>
                <div>
                  <Link to={`/pacientes/${apt.phone}`} className="link-forte">
                    {apt.name || "(sem nome)"}
                  </Link>
                  <div className="agenda-motivo">{apt.reason || "—"}</div>
                  <div className="agenda-meta">
                    {formatBRPhone(apt.phone)} ·{" "}
                    <span className={`status-pill status-${apt.status}`}>{apt.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {semData.length > 0 && (
        <div className="card">
          <h3>Sem data definida ({semData.length})</h3>
          {semData.map((apt) => (
            <div className="agenda-item" key={apt.id}>
              <Link to={`/pacientes/${apt.phone}`} className="link-forte">
                {apt.name || "(sem nome)"}
              </Link>
              <span className="agenda-motivo"> — {apt.reason || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function chaveDia(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function rotuloDia(d) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diff = Math.round((d - hoje) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

function formatarHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
