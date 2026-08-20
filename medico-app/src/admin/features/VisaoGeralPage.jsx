import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { useDoctors, useVerticais, useAgendamentos, VERTICAIS } from "../api.js";

export default function VisaoGeralPage() {
  const medicos = useDoctors();
  const verticais = useVerticais();
  const abertos = useAgendamentos("abertos");
  const expirados = useAgendamentos("expirados");
  const concluidas = useAgendamentos("concluidas");
  const historico = useAgendamentos("historico");

  const listaMedicos = medicos.data || [];
  const ativos = listaMedicos.filter((d) => d.active !== false).length;

  return (
    <>
      <PageHeader title="Início" subtitle="Visão geral do sistema" />

      <div className="stats-grid">
        <StatCard
          rotulo="Médicos cadastrados"
          valor={listaMedicos.length}
          sub={`${ativos} ativos`}
          carregando={medicos.isLoading}
        />
        <StatCard
          rotulo="Agendamentos em aberto"
          valor={abertos.data?.length}
          sub="aguardando médico"
          carregando={abertos.isLoading}
        />
        <StatCard
          rotulo="Agendamentos expirados"
          valor={expirados.data?.length}
          sub="sem médico aceitando"
          carregando={expirados.isLoading}
        />
        <StatCard
          rotulo="Concluídas"
          valor={concluidas.data?.length}
          sub="com SOAP registrado"
          carregando={concluidas.isLoading}
        />
        <StatCard
          rotulo="Histórico"
          valor={historico.data?.length}
          sub="aceitas, canceladas"
          carregando={historico.isLoading}
        />
      </div>

      <div className="card">
        <h3>Origem dos Pacientes</h3>
        <div className="card-subtitle">
          Vertical pela qual o paciente entrou na plataforma (landing page).
        </div>

        {verticais.isLoading && <Loading />}
        {verticais.error && <ErrorState error={verticais.error} onRetry={verticais.refetch} />}
        {!verticais.isLoading && !verticais.error && !verticais.data?.length && (
          <div className="state-msg">
            Nenhuma entrada registrada ainda. Quando pacientes começarem a chegar
            pela landing, os dados aparecem aqui.
          </div>
        )}

        {!!verticais.data?.length && (
          <div className="tabela-scroll">
            <table>
              <thead>
                <tr>
                  <th>Vertical</th>
                  <th>Entradas</th>
                  <th>Agendamentos</th>
                  <th>Concluídas</th>
                </tr>
              </thead>
              <tbody>
                {verticais.data.map((r) => (
                  <tr key={r.vertical || "—"}>
                    <td>{VERTICAIS[r.vertical] || r.vertical || "—"}</td>
                    <td>{r.entries || 0}</td>
                    <td>{r.appointments || 0}</td>
                    <td>{r.concluded || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ rotulo, valor, sub, carregando }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{rotulo}</div>
      {/* Traço enquanto carrega, nunca zero: "0 médicos" e "ainda não sei"
          são coisas diferentes, e mostrar zero por engano assusta. */}
      <div className="stat-value">{carregando || valor == null ? "—" : valor}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}
