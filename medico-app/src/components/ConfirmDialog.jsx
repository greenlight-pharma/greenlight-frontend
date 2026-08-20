import Modal from "./Modal.jsx";

// Substitui window.confirm(). O confirm nativo não deixa formatar nada, some
// atrás da janela em alguns navegadores e, em mobile, aparece como alerta do
// navegador (o médico não associa ao sistema). Aqui a consequência da ação
// pode ser mostrada em lista, com destaque no que é irreversível.
export default function ConfirmDialog({
  open,
  title,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  danger,
  children,
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="confirm-body">{children}</div>
      <div className="modal-actions">
        <button className="btn-secondary-outline" onClick={onCancel}>
          Cancelar
        </button>
        <button className={danger ? "btn-danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
