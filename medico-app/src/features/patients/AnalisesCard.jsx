import { PatientItem, Badge, ItemHeader, ItemMeta, ItemBody, dataHoraBR } from "./PatientItem.jsx";

// [PRONTUARIO] Card "📊 Análises clínicas" — também faltava no refactor.
// Lista as análises de apoio geradas para consultas deste paciente.
export default function AnalisesCard({ analyses = [] }) {
  return (
    <div className="card" id="card-analises">
      <h3>📊 Análises clínicas</h3>
      <div className="card-subtitle">
        Análises de apoio geradas por IA para consultas deste paciente.
      </div>

      {!analyses.length && (
        <div className="state-msg">Nenhuma análise clínica gerada para este paciente.</div>
      )}

      {analyses.map((an) => {
        const meta = [
          an.doctorName && `Médico: ${an.doctorName}`,
          an.modelUsed && `Modelo: ${an.modelUsed}`,
        ].filter(Boolean);

        return (
          <PatientItem isMine={an.isMine} key={an.id}>
            <ItemHeader title={`Análise gerada em ${dataHoraBR(an.generatedAt)}`}>
              <Badge isMine={an.isMine} />
            </ItemHeader>
            <ItemMeta>{meta.join(" • ") || "—"}</ItemMeta>
            <ItemBody>
              {an.reason
                ? `Triagem: ${an.reason}`
                : "Sem motivo registrado na consulta vinculada."}
            </ItemBody>
          </PatientItem>
        );
      })}
    </div>
  );
}
