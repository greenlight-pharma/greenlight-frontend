// Campo de formulário com rótulo e dica. Existe pra que rótulo e input
// fiquem sempre associados (htmlFor/id) — acessibilidade que o HTML antigo
// não tinha em nenhum dos ~60 campos.
let seq = 0;

export default function Field({ label, hint, error, children, id }) {
  const fieldId = id || `f${++seq}`;
  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      {typeof children === "function" ? children(fieldId) : children}
      {hint && <div className="small">{hint}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
