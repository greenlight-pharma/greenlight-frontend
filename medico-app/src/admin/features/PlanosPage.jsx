import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { useAssinaturas, useAtualizarAssinatura, STATUS_ASSINATURA } from "../api.js";
import { formatBRPhone } from "../../lib/phone.js";
import { dataBR } from "../../features/patients/PatientItem.jsx";

export default function PlanosPage() {
  const { data = [], isLoading, error, refetch } = useAssinaturas();
  const atualizar = useAtualizarAssinatura();

  return (
    <>
      <PageHeader
        title="Planos de Acompanhamento"
        subtitle="Assinaturas mensais oferecidas a pacientes com condições crônicas"
      />

      {/* Aviso mantido do admin.html: o pagamento NÃO está integrado, e quem
          opera precisa saber disso antes de marcar alguém como ativo. */}
      <div className="aviso-preparacao">
        ⚠️ <strong>Funcionalidade em preparação — não está cobrando ainda.</strong> O
        bot só envia ofertas se a env <code>ENABLE_PLAN_OFFER=true</code> estiver
        setada. Em qualquer caso, o pagamento não está integrado: quando o paciente
        diz SIM, o status vira “accepted”, e você marca manualmente como “active”
        depois de confirmar o pagamento por outro canal.
      </div>

      <div className="card">
        <h3>Ofertas e assinaturas</h3>
        <div className="card-subtitle">
          Status: oferecida (oferta enviada), aceita (paciente respondeu SIM),
          ativa (pagamento confirmado manualmente), cancelada.
        </div>

        <div className="item-actions" style={{ marginBottom: 12 }}>
          <button className="primary btn-compacto" onClick={() => refetch()}>
            Atualizar Lista
          </button>
        </div>

        {isLoading && <Loading />}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {!isLoading && !error && !data.length && (
          <div className="state-msg">
            Nenhuma assinatura registrada. Ofertas só são geradas quando o médico
            encerra consulta de paciente com vertical crônica E{" "}
            <code>ENABLE_PLAN_OFFER=true</code>.
          </div>
        )}

        {!!data.length && (
          <div className="tabela-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Status</th>
                  <th>Oferecida em</th>
                  <th>Preço (R$)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => {
                  const info = STATUS_ASSINATURA[s.status] || { label: s.status, classe: "" };
                  return (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>
                        {s.patientName || "—"}
                        <div className="texto-suave">{formatBRPhone(s.phone)}</div>
                      </td>
                      <td>{s.doctorName || "—"}</td>
                      <td>
                        <span className={`status-pill ${info.classe}`}>{info.label}</span>
                      </td>
                      <td>{dataBR(s.offeredAt || s.createdAt)}</td>
                      <td>{s.price != null ? Number(s.price).toFixed(2) : "—"}</td>
                      <td>
                        <select
                          value={s.status}
                          onChange={(e) =>
                            atualizar.mutate({ id: s.id, status: e.target.value })
                          }
                          aria-label={`Status da assinatura ${s.id}`}
                        >
                          {Object.entries(STATUS_ASSINATURA).map(([v, i]) => (
                            <option key={v} value={v}>
                              {i.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
