// Faixa de mensagem (erro / sucesso / aviso). Substitui os pares
// setMessage/clearMessage + getElementById espalhados pelo arquivo antigo.
export default function Message({ type = "error", children }) {
  if (!children) return null;
  return <div className={`message message-${type}`}>{children}</div>;
}
