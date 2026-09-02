import { useNavigate, useParams } from "react-router-dom";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { usePatientSummary } from "../patients/api.js";
import { formatBRPhone } from "../../lib/phone.js";
import MedicoesCard from "./MedicoesCard.jsx";

// [MEDICOES] Página própria, alcançada pelo menu — e não mais um card
// dentro do fluxo de Medicações.
//
// São coisas diferentes na cabeça de quem opera: prescrever um remédio é
// ato do médico na consulta; aferir pressão e glicemia é rotina de
// acompanhamento, feita por outra pessoa, em outro momento. Ficando debaixo
// de "Medicações", a segunda dependia de lembrar que estava lá dentro.
export default function MedicoesPacientePage({ voltarPara = "/medicoes" }) {
  const { phone } = useParams();
  const navigate = useNavigate();
  const summary = usePatientSummary(phone);

  if (summary.isLoading) return <Loading label="Carregando paciente..." />;
  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.refetch} />;

  const { patient } = summary.data || {};
  const idade = patient?.patientAge ? `, ${patient.patientAge} anos` : "";

  return (
    <>
      <div className="page-header prontuario-header">
        <button className="btn-secondary-outline" onClick={() => navigate(voltarPara)}>
          ← Voltar
        </button>
        <div style={{ flex: 1 }}>
          <h2>{patient?.name || "Paciente"}</h2>
          <div className="page-subtitle">
            {formatBRPhone(patient?.phone || phone)}
            {idade}
          </div>
        </div>
      </div>

      <MedicoesCard phone={phone} patientName={patient?.name || ""} />
    </>
  );
}
