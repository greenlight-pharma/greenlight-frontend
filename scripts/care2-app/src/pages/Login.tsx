import { useEffect, useRef, useState } from "react";
import { api, errorText, session, ServiceError } from "../api";
import { registrationBody, registrationComplete, type Doctor, type Registration } from "../models";
import { Button, Field, Icon, Logo, Notice, RegistrationFields, Segmented, Surface } from "../ui";
import { ForgotPassword } from "./ResetPassword";

type LoginResponse = { token: string; doctor?: Doctor; name?: string };
const GOOGLE_ID = import.meta.env.VITE_CARE2_GOOGLE_CLIENT_ID as string | undefined;
const BENEFITS = [
  ["user", "Cadastre o paciente pelo WhatsApp", "Nome e número. Ele recebe o aviso de que os lembretes chegam por ali."],
  ["camera", "Uma foto, e a receita vira lembrete", "Você confere cada item antes de salvar."],
  ["chart", "As respostas chegam para você", "Tomou, não tomou, teve reação, pressão e glicemia por dia."],
];

// [PESSOAL] Conta para você e sua família. care.vytalsaude.com.br/familia abre direto nesse modo (é o link dos vídeos).
const BENEFITS_FAMILIA = [
  ["camera", "Fotografe a receita", "O Vytal Care organiza cada remédio no horário certo."],
  ["wa", "O lembrete chega no WhatsApp", "Sem instalar nada. É só tocar em “Já tomei”."],
  ["alert", "Você fica sabendo", "Se uma dose não for confirmada ou a pressão sair da faixa, você recebe um aviso."],
];
const abrirComoFamilia = () => location.pathname.endsWith("/familia") || new URLSearchParams(location.search).get("para") === "familia";

export default function Login({ message }: { message?: string }) {
  const [familia, setFamilia] = useState(true);
  const [create, setCreate] = useState(abrirComoFamilia);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [registration, setRegistration] = useState<Registration>({ profession: "", number: "", uf: "" });
  const [accepted, setAccepted] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [google, setGoogle] = useState<string | null>(null); // token do Google à espera de registro e aceite (428)
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(message ?? null);
  const googleSlot = useRef<HTMLDivElement>(null);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return; setBusy(true); setError(null);
    try {
      if (google) { await sendGoogle(google); return; }
      const body: Record<string, unknown> = { email: email.trim(), password };
      if (create && familia) Object.assign(body, { name: name.trim(), phone, aceitouTermos: accepted });
      else if (create) Object.assign(body, registrationBody(registration), { name: name.trim(), aceitouTermos: accepted });
      const r = await api<LoginResponse>(create ? (familia ? "/auth/signup-pessoal" : "/auth/signup") : "/auth/login", { method: "POST", body, authenticated: false });
      session.save(r.token, r.doctor ?? { name: r.name ?? name, email });
    } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  // Conta nova pelo Google exige registro e aceite, igual ao app: o 428 é a segunda metade do cadastro.
  async function sendGoogle(idToken: string) {
    const body: Record<string, unknown> = { idToken };
    if (registrationComplete(registration)) Object.assign(body, registrationBody(registration), { aceitouTermos: accepted });
    try { const r = await api<LoginResponse>("/auth/google", { method: "POST", body, authenticated: false }); session.save(r.token, r.doctor ?? { name: r.name }); }
    catch (err) {
      if (err instanceof ServiceError && err.status === 428) { setGoogle(idToken); setCreate(true); setError("Informe seu registro profissional e aceite os termos para concluir."); }
      else { setGoogle(null); setError(errorText(err)); }
    } finally { setBusy(false); }
  }
  // O botão do Google só existe com client ID configurado: melhor não existir do que existir quebrado.
  useEffect(() => {
    if (!GOOGLE_ID || !googleSlot.current) return;
    const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true;
    s.onload = () => { const g = (window as any).google?.accounts?.id; if (!g || !googleSlot.current) return; g.initialize({ client_id: GOOGLE_ID, callback: (r: { credential: string }) => { setBusy(true); void sendGoogle(r.credential); } }); g.renderButton(googleSlot.current, { theme: "outline", size: "large", shape: "pill", text: "continue_with", locale: "pt-BR", width: 320 }); };
    document.head.appendChild(s);
    return () => { s.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canSubmit = google ? registrationComplete(registration) && accepted : create ? !!name.trim() && !!email.trim() && password.length >= 8 && (familia || registrationComplete(registration)) && accepted : !!email.trim() && !!password;
  const beneficios = familia ? BENEFITS_FAMILIA : BENEFITS;
  return <div className="login">
    <div className="hero">
      <a className="care2-back" href="/vytal-care2/">← Conhecer o Vytal Care</a>
      <div className="row"><Logo size={56} tile /><span className="round" style={{ fontSize: 26 }}>Vytal Care</span></div>
      <h1 style={{ fontSize: 38, lineHeight: 1.12 }}>{familia ? "O cuidado que continua em casa." : "O cuidado que continua entre as consultas."}</h1>
      <div className="stack benefits" style={{ gap: 20 }}>{beneficios.map(([icon, title, text]) => <div key={title} className="row" style={{ alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={icon} size={22} /></div>
        <div><div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div><div style={{ fontSize: 14, opacity: 0.85 }}>{text}</div></div></div>)}</div>
    </div>
    <div className="form"><form className="stack" style={{ width: "100%", maxWidth: 440 }} onSubmit={submit}>
      <div className="care2-form-heading"><span className="eyebrow">SEU CUIDADO, MAIS ORGANIZADO</span><h2>{create ? "Vamos cuidar de quem importa." : "Bom ter você por aqui."}</h2><p className="muted">{create ? "Crie sua conta e experimente por 7 dias." : "Entre para acompanhar sua família."}</p></div>
      {!google && <Segmented label="Entrar ou criar conta" value={create ? "criar" : "entrar"} onChange={(v) => { setCreate(v === "criar"); setError(null); }} options={[{ value: "entrar", label: "Entrar" }, { value: "criar", label: "Criar conta" }]} />}
      {create && !google && <Segmented label="Para quem é a conta" value={familia ? "familia" : "pro"} onChange={(v) => { setFamilia(v === "familia"); setError(null); }} options={[{ value: "familia", label: "Para mim e minha família" }, { value: "pro", label: "Sou profissional de saúde" }]} />}
      {create && familia && !google && <Notice tone="info">7 dias grátis, com tudo liberado. Depois, a partir de R$ 14,90 por mês. Sem cartão para começar.</Notice>}
      <Surface>
        {google ? <p className="muted">Falta pouco. Informe seu registro profissional para concluir a conta com o Google.</p> : <>
          {create && <Field label={familia ? "Seu nome" : "Nome completo"} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />}
          <Field label="E-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field label="Senha" type="password" autoComplete={create ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} hint={create ? "Pelo menos 8 caracteres." : undefined} />
        </>}
        {create && familia && !google && <Field label="Seu WhatsApp (opcional)" inputMode="tel" placeholder="DDD + número" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} hint="Se os lembretes forem para você mesmo, é este número." />}
        {(create || google) && <>
          {!(create && familia && !google) && <RegistrationFields value={registration} onChange={setRegistration} />}
          <label className="row small muted" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0 }} />
            <span>Li e aceito os <a href="https://www.vytalsaude.com.br/termos" target="_blank" rel="noreferrer">termos de uso</a> e a <a href="https://www.vytalsaude.com.br/privacidade" target="_blank" rel="noreferrer">política de privacidade</a>.</span></label>
        </>}
        <Notice>{error}</Notice>
        <Button type="submit" className="big" icon={create || google ? "check" : "chev"} busy={busy} disabled={!canSubmit}>{google ? "Concluir cadastro" : create ? "Criar conta" : "Entrar"}</Button>
        {google && <button type="button" className="link" onClick={() => { setGoogle(null); setCreate(false); setError(null); }}>Cancelar</button>}
        {!create && !google && <button type="button" className="link" style={{ alignSelf: "center" }} onClick={() => setForgot(true)}>Esqueci minha senha</button>}
      </Surface>
      {GOOGLE_ID && !google && !(create && familia) && <div className="stack" style={{ alignItems: "center", gap: 12 }}><span className="muted small">ou</span><div ref={googleSlot} /></div>}
    </form></div>
    {forgot && <ForgotPassword initialEmail={email} onClose={() => setForgot(false)} />}
  </div>;
}
