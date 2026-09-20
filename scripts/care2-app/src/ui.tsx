import { useEffect, useRef, type ReactNode } from "react";
import { PROFESSIONS, UFS, findProfession, type Registration } from "./models";

const ICONS: Record<string, string> = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-6 8-6s7 1 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  pill: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-7"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  gauge: '<path d="M4 18a8 8 0 1116 0"/><path d="M12 18l4-6"/>',
  drop: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  wa: '<path d="M4 20l1.5-4.5A8 8 0 1112 20a8 8 0 01-3.8-1z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  repeat: '<path d="M4 9a5 5 0 015-5h9l-3-3M20 15a5 5 0 01-5 5H6l3 3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6.5 15h4"/>',
  pix: '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M8.4 12L12 8.4l3.6 3.6-3.6 3.6z"/>',
  logout: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
};
export function Icon({ name, size = 20, stroke = 1.8 }: { name: string; size?: number; stroke?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }} />;
}
/** Logo do Vytal Care (public/logo.png, fundo transparente). `tile` põe um fundo branco para ficar legível sobre azul. */
export function Logo({ size = 36, tile = false }: { size?: number; tile?: boolean }) {
  const img = <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={size} height={size} style={{ display: "block", width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  return tile ? <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.24), background: "#FFFFFF", padding: Math.round(size * 0.1), flexShrink: 0 }}><img src={`${import.meta.env.BASE_URL}logo.png`} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} /></div> : img;
}
export const Brand = () => <div className="brand"><Logo /><span>Vytal <b>Care</b></span></div>;
export const Surface = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => <section className={`surface ${className}`} style={style}>{children}</section>;
export const Eyebrow = ({ children }: { children: ReactNode }) => <div className="eyebrow">{children}</div>;
export const Avatar = ({ text, size = 44 }: { text: string; size?: number }) => <div className="avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}>{text}</div>;
export const Chip = ({ children, tone = "" }: { children: ReactNode; tone?: "" | "ok" | "bad" | "warn" | "info" }) => <span className={`chip ${tone}`}>{children}</span>;
export const Spinner = () => <span className="spinner" role="status" aria-label="Carregando" />;
export function Notice({ tone = "error", children }: { tone?: "error" | "warn" | "info" | "ok"; children?: ReactNode }) {
  if (!children) return null;
  return <div className={`notice ${tone}`} role={tone === "error" ? "alert" : "status"}><Icon name={tone === "ok" ? "check" : "alert"} size={18} /><div style={{ whiteSpace: "pre-line" }}>{children}</div></div>;
}
export function Button({ children, icon, busy, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string; busy?: boolean }) {
  return <button type="button" className={`btn ${className}`} {...rest} disabled={busy || rest.disabled}>{busy ? <Spinner /> : <>{icon && <Icon name={icon} size={18} />}<span>{children}</span></>}</button>;
}
export function Field({ label, hint, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <label className="field"><span>{label}</span><input {...rest} />{hint && <span className="muted small" style={{ fontWeight: 400 }}>{hint}</span>}</label>;
}
export function TextArea({ label, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="field"><span>{label}</span><textarea {...rest} /></label>;
}
export function Segmented<T extends string | number>({ value, options, onChange, label, icons = false }: { value: T | null; options: { value: T; label: string; icon?: string }[]; onChange: (v: T) => void; label: string; icons?: boolean }) {
  return <div className={`segmented ${icons ? "icons" : ""}`} role="tablist" aria-label={label}>
    {options.map((o) => <button key={String(o.value)} type="button" role="tab" aria-selected={o.value === value} className={o.value === value ? "on" : ""} onClick={() => onChange(o.value)}>{o.icon && <Icon name={o.icon} size={18} />}<span>{o.label}</span></button>)}
  </div>;
}
export function Option({ on, icon, children, onClick }: { on: boolean; icon: string; children: ReactNode; onClick: () => void }) {
  return <button type="button" className={`option ${on ? "on" : ""}`} aria-pressed={on} onClick={onClick}><Icon name={icon} size={22} /><span>{children}</span></button>;
}
const openDialogs: object[] = [];
/** Folha do app vira diálogo central na tela larga e folha de baixo no celular. */
export function Dialog({ title, eyebrow, onClose, children, wide = false, locked = false }: { title: string; eyebrow?: string; onClose: () => void; children: ReactNode; wide?: boolean; locked?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // onClose muda a cada render de quem abre: fica em ref para o foco inicial não se repetir e roubar o cursor dos campos.
  const close = useRef(onClose); close.current = onClose;
  const isLocked = useRef(locked); isLocked.current = locked;
  useEffect(() => {
    // Pilha: com dois diálogos abertos (editor + prévia), Esc fecha só o de cima.
    const me = {}; openDialogs.push(me);
    const before = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== me) return;
      if (e.key === "Escape" && !isLocked.current) { close.current(); return; }
      // Foco preso no diálogo: Tab no último volta ao primeiro, e vice-versa.
      if (e.key === "Tab" && ref.current) {
        const all = [...ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
        if (!all.length) { e.preventDefault(); return; }
        const first = all[0], last = all[all.length - 1], at = document.activeElement;
        if (e.shiftKey && (at === first || at === ref.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey); ref.current?.focus();
    // Ao fechar, o foco volta para o botão que abriu o diálogo.
    return () => { document.removeEventListener("keydown", onKey); openDialogs.splice(openDialogs.indexOf(me), 1); if (before && document.contains(before)) before.focus(); };
  }, []);
  return <div className="backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !locked) onClose(); }}>
    <div className={`dialog ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 style={{ fontSize: 24 }}>{title}</h2></div>
        <button type="button" className="btn plain icon" style={{ borderRadius: 23, border: 0, background: "var(--bg)" }} aria-label="Fechar" onClick={onClose} disabled={locked}><Icon name="x" size={18} /></button>
      </div>
      {children}
    </div>
  </div>;
}
export function Confirm({ title, message, action, onCancel, onConfirm, busy }: { title: string; message: string; action: string; onCancel: () => void; onConfirm: () => void; busy?: boolean }) {
  return <Dialog title={title} onClose={onCancel} locked={busy}>
    <p className="muted" style={{ whiteSpace: "pre-line" }}>{message}</p>
    <div className="row" style={{ justifyContent: "flex-end" }}><Button className="plain" onClick={onCancel} disabled={busy}>Cancelar</Button><Button className="danger" onClick={onConfirm} busy={busy}>{action}</Button></div>
  </Dialog>;
}
/** Profissão, número e estado do registro no conselho. O rótulo do número acompanha a profissão. */
export function RegistrationFields({ value, onChange }: { value: Registration; onChange: (r: Registration) => void }) {
  const council = findProfession(value.profession)?.council ?? "Registro";
  return <div className="row wrap" style={{ alignItems: "flex-end" }}>
    <label className="field" style={{ flex: "2 1 180px" }}><span>Profissão</span>
      <select value={value.profession} onChange={(e) => onChange({ ...value, profession: e.target.value })}><option value="">Escolha</option>{PROFESSIONS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label className="field" style={{ flex: "1 1 110px" }}><span>{council}</span><input inputMode="numeric" value={value.number} onChange={(e) => onChange({ ...value, number: e.target.value })} placeholder="Número" /></label>
    <label className="field" style={{ flex: "0 1 90px" }}><span>UF</span>
      <select value={value.uf} onChange={(e) => onChange({ ...value, uf: e.target.value })}><option value="">UF</option>{UFS.map((u) => <option key={u}>{u}</option>)}</select></label>
  </div>;
}
/** Carrega ao montar e quando `deps` muda; ignora resposta atrasada. */
export function useLoad(fn: (alive: () => boolean) => Promise<void>, deps: unknown[]) {
  useEffect(() => { let on = true; void fn(() => on); return () => { on = false; }; }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
/** Menu de ações: Esc e clique fora fecham; setas percorrem os itens; o foco entra no primeiro. */
export function Menu({ items, onClose }: { items: { label: string; danger?: boolean; onSelect: () => void }[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const buttons = () => [...(ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
    buttons()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); const b = buttons(); const i = b.indexOf(document.activeElement as HTMLButtonElement);
        b[(i + (e.key === "ArrowDown" ? 1 : -1) + b.length) % b.length]?.focus();
      }
    };
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose(); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [onClose]);
  return <div className="menu" role="menu" ref={ref}>{items.map((it) => <button key={it.label} role="menuitem" style={it.danger ? { color: "var(--bad)" } : undefined} onClick={() => { onClose(); it.onSelect(); }}>{it.label}</button>)}</div>;
}
