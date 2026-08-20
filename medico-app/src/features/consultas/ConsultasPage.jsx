import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState, Empty } from "../../components/Loading.jsx";
import ClosingModal from "./ClosingModal.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { useMyAppointments, useReopenAppointment } from "./api.js";
import { formatBRPhone } from "../../lib/phone.js";

const DIAS_PARA_PARADA = 2;

export default function ConsultasPage() {
  const { data, isLoading, error, refetch } = useMyAppointments();
  const [aba, setAba] = useState("atendimento");
  const [encerrando, setEncerrando] = useState(null);
  const [reabrindo, setReabrindo] = useState(null);
  const reabrir = useReopenAppointment();

  const { emAtendimento, concluidas } = useMemo(() => {
    const lista = data || [];
    return {
      emAtendimento: lista.filter((a) => a.status === "aceita"),
      concluidas: lista.filter((a) => a.status === "concluida"),
    };
  }, [data]);

  const visiveis = aba === "atendimento" ? emAtendimento : concluidas;

  return (
    <>
      <PageHeader title="Consultas" subtitle="Atendimentos aceitos por você" />

      <div className="card">
        <div className="consultas-tabs">
          <button
            className={aba === "atendimento" ? "consultas-tab active" : "consultas-tab"}
            onClick={() => setAba("atendimento")}
          >
            Em atendimento ({emAtendimento.length})
          </button>
          <button
            className={aba === "concluidas" ? "consultas-tab active" : "consultas-tab"}
            onClick={() => setAba("concluidas")}
          >
            Concluídas ({concluidas.length})
          </button>
        </div>

        {isLoading && <Loading />}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {!isLoading && !error && !visiveis.length && (
          <Empty
            label={
              aba === "atendimento"
                ? "Nenhuma consulta em atendimento."
                : "Nenhuma consulta concluída ainda."
            }
          />
        )}

        {visiveis.map((apt) => (
          <div className="consulta-row" key={apt.id}>
            <div>
              <div className="consulta-nome">
                <Link to={`/pacientes/${apt.phone}`} className="link-forte">
                  {apt.name || "(sem nome)"}
                </Link>
                {apt.patientAge ? ` · ${apt.patientAge} anos` : ""}
              </div>
              <div className="consulta-motivo">{apt.reason || "Sem motivo informado"}</div>
              <div className="consulta-meta">
                {formatBRPhone(apt.phone)}
                {apt.acceptedAt && ` · aceita em ${formatarData(apt.acceptedAt)}`}
                {apt.concludedAt && ` · concluída em ${formatarData(apt.concludedAt)}`}
              </div>
              {/* Consulta aceita e parada há dias costuma ser esquecimento de
                  encerrar, não atendimento em curso. O painel antigo tinha
                  essa noção (STALE_APPOINTMENT_DAYS) e a mantemos. */}
              {aba === "atendimento" && estaParada(apt) && (
                <div className="med-alert">
                  ⚠ Aberta há mais de {DIAS_PARA_PARADA} dias — encerre se o
                  atendimento já terminou.
                </div>
              )}
            </div>

            <div className="row-actions">
              {apt.status === "aceita" ? (
                <button className="primary" onClick={() => setEncerrando(apt)}>
                  Encerrar consulta
                </button>
              ) : (
                <button className="btn-secondary-outline" onClick={() => setReabrindo(apt)}>
                  Reabrir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {encerrando && (
        <ClosingModal
          appointment={encerrando}
          onClose={() => setEncerrando(null)}
        />
      )}

      <ConfirmDialog
        open={!!reabrindo}
        title="Reabrir consulta"
        confirmLabel="Reabrir"
        onCancel={() => setReabrindo(null)}
        onConfirm={async () => {
          await reabrir.mutateAsync(reabrindo.id);
          setReabrindo(null);
        }}
      >
        <p>
          Reabrir a consulta de <strong>{reabrindo?.name}</strong>? Ela volta
          para “em atendimento” e pode ser encerrada de novo.
        </p>
      </ConfirmDialog>
    </>
  );
}

function estaParada(apt) {
  if (!apt.acceptedAt) return false;
  const dias = (Date.now() - new Date(apt.acceptedAt)) / 86400000;
  return dias > DIAS_PARA_PARADA;
}

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}
