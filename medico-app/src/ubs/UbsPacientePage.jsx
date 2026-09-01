import { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loading, ErrorState } from "../components/Loading.jsx";
import DadosCard from "../features/patients/DadosCard.jsx";
import MedicacoesCard from "../features/medications/MedicacoesCard.jsx";
import { usePatientSummary, usePatientHistory } from "../features/patients/api.js";
import { formatBRPhone } from "../lib/phone.js";
import {
  extrairRespostas,
  resumoPorMedicacao,
  mapaDeFalhas,
  evolucaoSemanal,
} from "../lib/adherence.js";

// [PAINEL-UBS] O prontuário enxuto: identificação e medicações, nada mais.
//
// Os cards são os MESMOS componentes do painel médico, importados. Não são
// versões paralelas: se a adesão for corrigida, os dois painéis melhoram
// juntos. Um clone divergiria na primeira correção que alguém esquecesse de
// aplicar dos dois lados — e divergência silenciosa em cálculo de adesão é
// exatamente o tipo de erro que ninguém percebe até a reunião de prestação
// de contas.
//
// O que ficou de fora (alergias, rastreios, consultas, exames, análises,
// documentos, resumo de caso) não é limitação técnica: é o escopo do que a
// prefeitura contrata. O prontuário completo continua em /painel-medico.
export default function UbsPacientePage() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const summary = usePatientSummary(phone);
  const history = usePatientHistory(phone);

  const eventos = history.data?.events;
  const medicacoes = summary.data?.medications;

  // [TRES-ESTADOS] O denominador da adesão vem da prescrição (horários ×
  // dias), não das respostas recebidas. Por isso o resumo precisa das
  // medicações, e não só dos eventos.
  const respostas = useMemo(() => extrairRespostas(eventos), [eventos]);
  const resumoAdesao = useMemo(
    () => resumoPorMedicacao(eventos, medicacoes),
    [eventos, medicacoes]
  );
  const falhas = useMemo(() => mapaDeFalhas(eventos, medicacoes), [eventos, medicacoes]);
  const evolucao = useMemo(
    () => evolucaoSemanal(eventos, medicacoes),
    [eventos, medicacoes]
  );

  if (summary.isLoading) return <Loading label="Carregando paciente..." />;
  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.refetch} />;

  const { patient, medications = [], linkedToMe } = summary.data || {};
  const idade = patient?.patientAge ? `, ${patient.patientAge} anos` : "";

  return (
    <>
      <div className="page-header prontuario-header">
        <button className="btn-secondary-outline" onClick={() => navigate("/pacientes")}>
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

      <DadosCard phone={phone} patient={patient} linkedToMe={linkedToMe} />

      <MedicacoesCard
        phone={phone}
        patientName={patient?.name || ""}
        medications={medications}
        adesaoPorMed={resumoAdesao}
        respostasAdesao={respostas}
        falhas={falhas}
        evolucao={evolucao}
        abrirNovoAoMontar={!!location.state?.novaMedicacao}
      />
    </>
  );
}
