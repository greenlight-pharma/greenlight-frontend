// [PRONTUARIO] Item de lista do prontuário, no mesmo padrão do medico.html:
// borda destacada quando o registro é seu, cabeçalho com título + badge de
// propriedade, meta e corpo.
//
// A badge "Meu / Outro médico" não é enfeite: o prontuário mistura registros
// de vários profissionais, e saber de quem é cada um muda a leitura clínica
// (e é o que decide quais ações aparecem).
export function PatientItem({ isMine, children }) {
  return <div className={isMine ? "patient-item mine" : "patient-item"}>{children}</div>;
}

export function Badge({ isMine }) {
  return (
    <span className={isMine ? "badge-mine" : "badge-other"}>
      {isMine ? "Meu" : "Outro médico"}
    </span>
  );
}

export function ItemHeader({ title, children }) {
  return (
    <div className="item-header">
      <div className="item-title">{title}</div>
      {children}
    </div>
  );
}

export function ItemMeta({ children }) {
  return <div className="item-meta">{children}</div>;
}

export function ItemBody({ children, preserveLineBreaks }) {
  return (
    <div className="item-body" style={preserveLineBreaks ? { whiteSpace: "pre-wrap" } : undefined}>
      {children}
    </div>
  );
}

/** Data e hora no fuso de São Paulo — o mesmo do cron de lembretes. */
export function dataHoraBR(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function dataBR(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
