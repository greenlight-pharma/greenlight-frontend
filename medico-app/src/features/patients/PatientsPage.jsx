import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState, Empty } from "../../components/Loading.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import ManualPatientModal from "./ManualPatientModal.jsx";
import { usePatients, useUnlinkPatient } from "./api.js";
import { formatBRPhone } from "../../lib/phone.js";

// Os títulos são parâmetros porque o painel UBS mostra esta mesma lista
// com outro enquadramento ("Medicações"), mas o comportamento é idêntico:
// buscar, cadastrar e abrir o paciente. Só o texto muda.
export default function PatientsPage({
  title = "Meus Pacientes",
  subtitle = "Pacientes vinculados a você",
  // No painel da UBS o cadastro é enxuto — ver [CADASTRO-ENXUTO].
  cadastroEnxuto = false,
  // Para onde a linha do paciente leva. A mesma lista serve a fluxos
  // diferentes (prontuário, medicações, pressão e glicemia) — o que muda
  // é só o destino, não o comportamento de buscar e cadastrar.
  linkBase = "/pacientes",
}) {
  const { data: patients, isLoading, error, refetch } = usePatients();
  const [busca, setBusca] = useState("");
  const [removendo, setRemovendo] = useState(null);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const desvincular = useUnlinkPatient();

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = patients || [];
    if (!termo) return lista;
    // Busca por nome OU telefone. Só dígitos no lado do telefone, senão
    // digitar "(11)" não acha ninguém.
    const digitos = termo.replace(/\D/g, "");
    return lista.filter(
      (p) =>
        (p.patientName || "").toLowerCase().includes(termo) ||
        (digitos && String(p.patientPhone || "").includes(digitos))
    );
  }, [patients, busca]);

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <button className="primary" onClick={() => setCadastroAberto(true)}>
            + Cadastrar paciente
          </button>
        }
      />

      <div className="card">
        <input
          className="busca"
          placeholder="🔍 Buscar por nome ou telefone…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {isLoading && <Loading />}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {!isLoading && !error && !filtrados.length && (
          <Empty
            label={
              busca
                ? "Nenhum paciente encontrado para essa busca."
                : "Nenhum paciente vinculado ainda."
            }
          />
        )}

        {filtrados.length > 0 && (
          <table className="tabela">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`${linkBase}/${p.patientPhone}`} className="link-forte">
                      {p.patientName || "(sem nome)"}
                    </Link>
                  </td>
                  <td>{formatBRPhone(p.patientPhone)}</td>
                  <td className="col-acoes">
                    <button
                      className="btn-icon btn-archive"
                      title="Remover vínculo"
                      onClick={() => setRemovendo(p)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!removendo}
        title="Remover vínculo"
        confirmLabel="Remover vínculo"
        danger
        onCancel={() => setRemovendo(null)}
        onConfirm={async () => {
          await desvincular.mutateAsync(removendo.id);
          setRemovendo(null);
        }}
      >
        <p>
          Remover o vínculo com <strong>{removendo?.patientName}</strong>?
        </p>
        <ul>
          <li>O paciente sai da sua lista</li>
          <li>Prontuário, consultas e exames são preservados</li>
          <li>Recriar o vínculo traz o histórico de volta</li>
        </ul>
      </ConfirmDialog>

      {cadastroAberto && (
        <ManualPatientModal
          open
          enxuto={cadastroEnxuto}
          onClose={() => setCadastroAberto(false)}
        />
      )}
    </>
  );
}
