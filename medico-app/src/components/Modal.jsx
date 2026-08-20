import { useEffect, useRef } from "react";

// [MODAL] O medico.html tinha 13 modais, cada um com seu par
// open.../close...OnBackdrop duplicado à mão (26 funções quase idênticas).
// Aqui é um componente só. De brinde ganha o que faltava em todos eles:
// fechar no Esc, foco inicial dentro do modal e trava de scroll do fundo.
export default function Modal({ open, title, onClose, children, actions, wide }) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        // Só fecha se o clique foi no fundo, não em algo dentro do modal.
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={wide ? "modal-content modal-soap" : "modal-content"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={boxRef}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
