import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import ProntuarioNav from "./ProntuarioNav.jsx";
import DadosCard from "./DadosCard.jsx";
import AlergiasCard from "./AlergiasCard.jsx";
import RastreiosCard from "./RastreiosCard.jsx";
import ConsultasCard from "./ConsultasCard.jsx";
import AnalisesCard from "./AnalisesCard.jsx";
import MedicacoesCard from "../medications/MedicacoesCard.jsx";
import ExamesCard from "../exams/ExamesCard.jsx";
import DocumentsModal from "../documents/DocumentsModal.jsx";
import CaseSummaryModal from "../caseSummary/CaseSummaryModal.jsx";
import { usePatientSummary, usePatientHistory } from "./api.js";
import { formatBRPhone } from "../../lib/phone.js";
import {
  extrairRespostas,
  resumoPorMedicacao,
  mapaDeFalhas,
  evolucaoSemanal,
} from "../../lib/adherence.js";

// [PRONTUARIO] A ordem dos cards é a MESMA do medico.html e não é arbitrária:
//   Dados -> Alergias -> Rastreios -> Consultas -> Medicações
//        -> Exames laboratoriais -> Exames de imagem -> Análises
// Identificação primeiro, segurança (alergia) logo em seguida, e só então o
// que se faz com o paciente. A primeira versão deste refactor reordenou por
// conta própria e perdeu os cards de Consultas e Análises.
export default function PatientDetailPage() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const summary = usePatientSummary(phone);
  const history = usePatientHistory(phone);
  const [documentos, setDocumentos] = useState(false);
  const [resumo, setResumo] = useState(false);

  // Derivado dos eventos a cada render, não guardado em estado: assim não
  // sai de sincronia com o histórico depois de um refetch.
  const eventos = history.data?.events;
  const medicacoes = summary.data?.medications;

  const respostas = useMemo(() => extrairRespostas(eventos), [eventos]);
  // [TRES-ESTADOS] O resumo agora precisa das medicações: é delas que sai o
  // denominador real (doses esperadas). Sem isso a adesão seria calculada
  // sobre as respostas, o que infla o número e esconde quem parou de responder.
  const resumoAdesao = useMemo(
    () => resumoPorMedicacao(eventos, medicacoes),
    [eventos, medicacoes]
  );
  const falhas = useMemo(() => mapaDeFalhas(eventos, medicacoes), [eventos, medicacoes]);
  const evolucao = useMemo(
    () => evolucaoSemanal(eventos, medicacoes),
    [eventos, medicacoes]
  );

  if (summary.isLoading) return <Loading label="Carregando prontuário..." />;
  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.refetch} />;

  const {
    patient,
    medications = [],
    exams = [],
    appointments = [],
    analyses = [],
    linkedToMe,
  } = summary.data || {};

  const idade = patient?.patientAge ? `, ${patient.patientAge} anos` : "";

  return (
    <>
      <div className="page-header prontuario-header">
        <button className="btn-secondary-outline" onClick={() => navigate("/pacientes")}>
          ← Voltar
        </button>
        <div style={{ flex: 1 }}>
          <h2>{patient?.name || "Prontuário do Paciente"}</h2>
          <div className="page-subtitle">
            {formatBRPhone(patient?.phone || phone)}
            {idade}
          </div>
        </div>
        <button className="primary btn-nowrap" onClick={() => setResumo(true)}>
          📋 Resumo do caso
        </button>
        <button className="primary btn-nowrap btn-docs" onClick={() => setDocumentos(true)}>
          📄 Documentos
        </button>
      </div>

      {/* O prontuário mistura registros de vários médicos. A legenda explica
          a marcação antes de o médico topar com ela na lista. */}
      <div className="patient-legend">
        <span className="legend-item">
          <span className="badge-mine">Meu</span> registros que você fez
        </span>
        <span className="legend-item">
          <span className="badge-other">Outro médico</span> registros de outros profissionais
        </span>
      </div>

      <ProntuarioNav onTimeline={() => navigate(`/pacientes/${phone}/linha-do-tempo`)} />

      <DadosCard phone={phone} patient={patient} linkedToMe={linkedToMe} />

      <AlergiasCard phone={phone} />

      <RastreiosCard patient={patient} />

      <ConsultasCard appointments={appointments} />

      <MedicacoesCard
        phone={phone}
        patientName={patient?.name || ""}
        medications={medications}
        adesaoPorMed={resumoAdesao}
        respostasAdesao={respostas}
        falhas={falhas}
        evolucao={evolucao}
      />

      <ExamesCard phone={phone} exams={exams} tipo="lab" />

      <ExamesCard phone={phone} exams={exams} tipo="imaging" />

      <AnalisesCard analyses={analyses} />

      {resumo && (
        <CaseSummaryModal phone={phone} summary={summary.data} onClose={() => setResumo(false)} />
      )}

      {documentos && (
        <DocumentsModal
          paciente={patient}
          medications={medications}
          onClose={() => setDocumentos(false)}
        />
      )}
    </>
  );
}
