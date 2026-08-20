import Modal from "../../components/Modal.jsx";
import { dataHoraBR } from "../../features/patients/PatientItem.jsx";
import { formatBRPhone } from "../../lib/phone.js";

const CAMPOS = [
  ["subjective", "S — Subjetivo"],
  ["objective", "O — Objetivo"],
  ["assessment", "A — Avaliação"],
  ["plan", "P — Plano"],
];

// Visualização administrativa do SOAP. O aviso de LGPD é parte do produto,
// não decoração: é acesso de administrador a dado clínico de paciente.
export default function SoapViewModal({ appointment, onClose }) {
  const notas = appointment.closingNotes || {};

  return (
    <Modal open wide title="Evolução SOAP" onClose={onClose}>
      <div className="modal-warning">
        ⚠️ <strong>Dados clínicos sensíveis (LGPD).</strong> Acesso administrativo
        registrado para auditoria. Não compartilhe externamente.
      </div>

      <div className="soap-view-header">
        <div>
          <strong>{appointment.name || "—"}</strong>
          {appointment.patientAge ? `, ${appointment.patientAge} anos` : ""}
        </div>
        <div className="texto-suave">
          {formatBRPhone(appointment.phone)} · Médico:{" "}
          {appointment.acceptedDoctorName || "—"} · Concluída em{" "}
          {dataHoraBR(appointment.concludedAt)}
        </div>
        {appointment.reason && <div className="texto-suave">Motivo: {appointment.reason}</div>}
      </div>

      {CAMPOS.map(([chave, rotulo]) => (
        <div className="soap-view-section" key={chave}>
          <h4>{rotulo}</h4>
          <div className="soap-view-content">
            {notas[chave]?.trim() || <span className="texto-suave">não preenchido</span>}
          </div>
        </div>
      ))}

      <div className="modal-actions">
        <button className="btn-secondary-outline" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}
