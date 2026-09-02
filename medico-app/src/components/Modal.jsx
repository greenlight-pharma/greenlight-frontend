import { useEffect, useRef } from "react";

// [MODAL] O medico.html tinha 13 modais, cada um com seu par
// open.../close...OnBackdrop duplicado à mão (26 funções quase idênticas).
// Aqui é um componente só. De brinde ganha o que faltava em todos eles:
// fechar no Esc, foco inicial dentro do modal e trava de scroll do fundo.
export default function Modal({ open, title, onClose, children, actions, wide }) {
  const boxRef = useRef(null);

  // [FOCO-ROUBADO] onClose fica num ref, e o efeito abaixo depende SÓ de
  // `open`. Antes ele dependia de `onClose` também — e quase todo chamador
  // passa `onClose={() => ...}`, uma função nova a cada render. Resultado: a
  // cada tecla digitada num campo do modal, o estado do formulário mudava,
  // o pai re-renderizava, `onClose` trocava de identidade, o efeito rodava
  // de novo e `focus()` puxava o foco para a caixa do modal. Entrava UMA
  // letra e o resto ia para o nada. Afetava todo modal com campo de texto.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Foco inicial só ao ABRIR — e só se o foco não estiver já dentro do
    // modal (o navegador pode ter focado um campo antes deste efeito).
    if (!boxRef.current?.contains(document.activeElement)) {
      boxRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
