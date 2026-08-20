import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import MedicationsCard from "../medications/MedicationsCard.jsx";
import AdherencePanel from "../medications/AdherencePanel.jsx";
import ExamsCard from "../exams/ExamsCard.jsx";
import TimelineCard from "../timeline/TimelineCard.jsx";
import DocumentsModal from "../documents/DocumentsModal.jsx";
import CaseSummaryModal from "../caseSummary/CaseSummaryModal.jsx";
import ClinicalProfileCard from "./ClinicalProfileCard.jsx";
import ScreeningCard from "./ScreeningCard.jsx";
import AnthroCard from "./AnthroCard.jsx";
import EditBasicModal from "./EditBasicModal.jsx";
import { usePatientSummary, usePatientHistory } from "./api.js";
import { formatBRPhone } from "../../lib/phone.js";
import { extrairRespostas, resumoPorMedicacao } from "../../lib/adherence.js";

export default function PatientDetailPage() {
  const { phone } = useParams();
  const summary = usePatientSummary(phone);
  const history = usePatientHistory(phone);
  const [editando, setEditando] = useState(false);
  const [documentos, setDocumentos] = useState(false);
  const [resumo, setResumo] = useState(false);

  // A adesão é DERIVADA dos eventos a cada render, não guardada em estado.
  // Assim ela não sai de sincronia com o histórico depois de um refetch —
  // problema que o painel antigo tinha com as variáveis cached* soltas.
  const respostas = useMemo(() => extrairRespostas(history.data?.events), [history.data]);
  const resumoAdesao = useMemo(() => resumoPorMedicacao(history.data?.events), [history.data]);

  if (summary.isLoading) return <Loading label="Carregando prontuário..." />;
  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.refetch} />;

  const { patient, medications = [], exams = [], appointments = [] } = summary.data || {};
  const nome = patient?.name || "(sem nome)";

  return (
    <>
      <PageHeader
        title={nome}
        subtitle={
          <>
            {formatBRPhone(phone)}
            {patient?.patientAge ? ` · ${patient.patientAge} anos` : ""}
            {patient?.biologicalSex ? ` · ${patient.biologicalSex}` : ""}
          </>
        }
        actions={
          <>
            <Link to="/pacientes" className="btn-secondary-outline">
              ← Voltar
            </Link>
            <button className="btn-secondary-outline" onClick={() => setEditando(true)}>
              Editar dados
            </button>
            <button className="btn-secondary-outline" onClick={() => setDocumentos(true)}>
              📄 Documentos
            </button>
            <button className="btn-secondary-outline" onClick={() => setResumo(true)}>
              📋 Resumo do caso
            </button>
          </>
        }
      />

      <MedicationsCard
        phone={phone}
        patientName={nome}
        medications={medications}
        adesaoPorMed={resumoAdesao}
      />

      <AdherencePanel resumo={resumoAdesao} respostas={respostas} />

      <ClinicalProfileCard phone={phone} />

      <AnthroCard phone={phone} />

      <ScreeningCard patient={patient} />

      <ExamsCard phone={phone} exams={exams} />

      <TimelineCard
        appointments={appointments}
        events={history.data?.events || []}
        loading={history.isLoading}
      />

      {editando && (
        <EditBasicModal phone={phone} patient={patient} onClose={() => setEditando(false)} />
      )}

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
