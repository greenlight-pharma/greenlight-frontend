import { PatientItem, Badge, ItemHeader, ItemMeta, ItemBody, dataHoraBR } from "./PatientItem.jsx";

// [PRONTUARIO] Card "🩺 Consultas" — este card não existia na primeira versão
// do refactor; é do medico.html e faz falta: é onde o médico vê o histórico
// de atendimentos do paciente sem sair do prontuário.
export default function ConsultasCard({ appointments = [] }) {
  return (
    <div className="card" id="card-consultas">
      <h3>🩺 Consultas</h3>
      <div className="card-subtitle">
        Aceitas e concluídas. Canceladas/expiradas ficam no painel do administrador.
      </div>

      {!appointments.length && <div className="state-msg">Nenhuma consulta registrada.</div>}

      {appointments.map((apt) => {
        const statusTxt = apt.status === "concluida" ? "Concluída" : "Em atendimento";
        const quando = apt.concludedAt
          ? `concluída em ${dataHoraBR(apt.concludedAt)}`
          : apt.acceptedAt
            ? `aceita em ${dataHoraBR(apt.acceptedAt)}`
            : "sem data";

        return (
          <PatientItem isMine={apt.isMine} key={apt.id}>
            <ItemHeader title={`${statusTxt} — ${quando}`}>
              <Badge isMine={apt.isMine} />
            </ItemHeader>
            <ItemMeta>Médico: {apt.doctorName || "—"}</ItemMeta>
            <ItemBody>{apt.reason || "Sem motivo registrado."}</ItemBody>

            {/* Plano do SOAP em destaque: é a parte da consulta encerrada que
                o próximo atendimento precisa ler primeiro. */}
            {apt.status === "concluida" && apt.closingNotes?.plan && (
              <>
                <div className="plano-soap-label">Plano (SOAP):</div>
                <ItemBody preserveLineBreaks>{apt.closingNotes.plan}</ItemBody>
              </>
            )}
          </PatientItem>
        );
      })}
    </div>
  );
}
