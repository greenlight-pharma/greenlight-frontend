import { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import SoapViewModal from "./SoapViewModal.jsx";
import { useAgendamentos, useCancelarAgendamento, useArquivarLote } from "../api.js";
import { formatBRPhone } from "../../lib/phone.js";
import { dataHoraBR } from "../../features/patients/PatientItem.jsx";

// As quatro fases do medico administrativo, na mesma ordem do admin.html.
// `scope` é o que a rota de arquivamento em lote espera.
const BLOCOS = [
  {
    fase: "abertos",
    escopo: "future",
    titulo: "Em Aberto",
    subtitulo:
      "Consultas pendentes ou oferecidas, com horário ainda no futuro. Aguardando médico aceitar.",
    colunas: ["ID", "Paciente", "Idade", "Telefone", "Motivo", "Horário", "Status", "Médico Aceito"],
    podeCancelar: true,
  },
  {
    fase: "expirados",
    escopo: "expired",
    titulo: "Expirados",
    subtitulo: "Passaram do horário sem médico aceitar.",
    colunas: ["ID", "Paciente", "Idade", "Telefone", "Motivo", "Horário Marcado", "Status"],
  },
  {
    fase: "concluidas",
    escopo: "concluded",
    titulo: "Concluídas",
    subtitulo: "Atendimentos encerrados com evolução SOAP registrada.",
    colunas: ["ID", "Paciente", "Idade", "Motivo", "Médico", "Concluída em", "SOAP"],
    temSoap: true,
  },
  {
    fase: "historico",
    escopo: "history",
    titulo: "Aceitas e Histórico",
    subtitulo: "Todas as consultas, incluindo aceitas e canceladas.",
    colunas: ["ID", "Paciente", "Idade", "Telefone", "Motivo", "Status"],
  },
];

export default function AgendamentosPage() {
  const [soap, setSoap] = useState(null);

  return (
    <>
      <PageHeader title="Agendamentos" subtitle="Consultas em todas as fases" />
      {BLOCOS.map((b) => (
        <Bloco key={b.fase} bloco={b} onVerSoap={setSoap} />
      ))}
      {soap && <SoapViewModal appointment={soap} onClose={() => setSoap(null)} />}
    </>
  );
}

function Bloco({ bloco, onVerSoap }) {
  const { data = [], isLoading, error, refetch } = useAgendamentos(bloco.fase);
  const cancelar = useCancelarAgendamento();
  const arquivar = useArquivarLote();
  const [cancelando, setCancelando] = useState(null);
  const [arquivandoLote, setArquivandoLote] = useState(false);

  return (
    <div className="card">
      <h3>{bloco.titulo}</h3>
      <div className="card-subtitle">{bloco.subtitulo}</div>

      <div className="item-actions" style={{ marginBottom: 12 }}>
        <button className="primary btn-compacto" onClick={() => refetch()}>
          Atualizar
        </button>
        <button
          className="btn-danger btn-compacto"
          onClick={() => setArquivandoLote(true)}
          disabled={!data.length}
        >
          Arquivar todos ({data.length})
        </button>
      </div>

      {isLoading && <Loading />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && !data.length && (
        <div className="state-msg">Nenhum agendamento nesta fase.</div>
      )}

      {!!data.length && (
        <div className="tabela-scroll">
          <table>
            <thead>
              <tr>
                {bloco.colunas.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                {(bloco.podeCancelar || bloco.temSoap) && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.name || "—"}</td>
                  <td>{a.patientAge ?? "—"}</td>
                  {bloco.fase !== "concluidas" && <td>{formatBRPhone(a.phone)}</td>}
                  <td>{a.reason || "—"}</td>
                  {bloco.fase === "concluidas" && <td>{a.acceptedDoctorName || "—"}</td>}
                  {bloco.fase === "concluidas" ? (
                    <td>{dataHoraBR(a.concludedAt)}</td>
                  ) : bloco.fase === "historico" ? null : (
                    <td>{a.preferredTime || dataHoraBR(a.appointmentAt)}</td>
                  )}
                  {bloco.fase === "concluidas" ? (
                    <td>{a.closingNotes ? "registrado" : "—"}</td>
                  ) : (
                    <td>
                      <span className={`status-pill status-${a.status}`}>{a.status}</span>
                    </td>
                  )}
                  {bloco.fase === "abertos" && <td>{a.acceptedDoctorName || "—"}</td>}

                  {(bloco.podeCancelar || bloco.temSoap) && (
                    <td>
                      <div className="item-actions">
                        {bloco.temSoap && a.closingNotes && (
                          <button className="btn-soap" onClick={() => onVerSoap(a)}>
                            Ver SOAP
                          </button>
                        )}
                        {bloco.podeCancelar && (
                          <button
                            className="btn-soap btn-soap-danger"
                            onClick={() => setCancelando(a)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelando}
        title="Cancelar agendamento"
        confirmLabel="Cancelar agendamento"
        danger
        onCancel={() => setCancelando(null)}
        onConfirm={async () => {
          await cancelar.mutateAsync(cancelando.id);
          setCancelando(null);
        }}
      >
        <p>
          Cancelar a consulta <strong>#{cancelando?.id}</strong> de{" "}
          <strong>{cancelando?.name}</strong>? A oferta pendente para os médicos
          também é removida.
        </p>
      </ConfirmDialog>

      {/* Arquivamento em lote mexe em TODAS as linhas da fase de uma vez.
          O número entra no texto pra que ninguém confirme no automático. */}
      <ConfirmDialog
        open={arquivandoLote}
        title={`Arquivar ${bloco.titulo.toLowerCase()}`}
        confirmLabel={`Arquivar ${data.length}`}
        danger
        onCancel={() => setArquivandoLote(false)}
        onConfirm={async () => {
          await arquivar.mutateAsync(bloco.escopo);
          setArquivandoLote(false);
        }}
      >
        <p>
          Arquivar <strong>{data.length} agendamento(s)</strong> da fase “
          {bloco.titulo}”?
        </p>
        <p className="confirm-warn">
          Ação em lote. Os registros somem desta lista e não voltam pelo painel.
        </p>
      </ConfirmDialog>
    </div>
  );
}
