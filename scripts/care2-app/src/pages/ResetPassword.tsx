import { useEffect, useState } from "react";
import { api, errorText, session } from "../api";
import type { Doctor } from "../models";
import { Button, Dialog, Field, Logo, Notice, Spinner, Surface } from "../ui";

// [ESQUECI-A-SENHA] Duas peças: o diálogo que pede o link por e-mail e a
// página aberta pelo link. Também é a porta para quem criou a conta pela
// Apple ou pelo Google no celular e nunca teve senha.

export function ForgotPassword({ initialEmail = "", onClose }: { initialEmail?: string; onClose: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false), [sent, setSent] = useState(false), [error, setError] = useState<string | null>(null);
  async function send(e: React.FormEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setError(null);
    try { await api("/auth/senha/esqueci", { method: "POST", body: { email: email.trim() }, authenticated: false }); setSent(true); }
    catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  if (sent) return <Dialog title="Confira seu e-mail" onClose={onClose}>
    <p className="muted">Se houver uma conta com <b style={{ color: "var(--ink)" }}>{email.trim()}</b>, enviamos um link para criar uma nova senha. Ele vale por 1 hora.</p>
    <p className="muted small">Não chegou? Veja a caixa de spam. Se você entrou pela Apple com "Ocultar meu e-mail", o link vai para o endereço que a Apple repassa ao seu e-mail pessoal.</p>
    <Button className="big" icon="check" onClick={onClose}>Entendi</Button>
  </Dialog>;
  return <Dialog title="Esqueci minha senha" onClose={onClose} locked={busy}>
    <form className="stack" onSubmit={send}>
      <p className="muted">Enviamos um link para você criar uma senha nova. Serve também para quem entrou pela Apple ou pelo Google e quer usar a web.</p>
      <Field label="E-mail da conta" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Notice>{error}</Notice>
      <Button type="submit" className="big" icon="send" busy={busy} disabled={!email.includes("@")}>Enviar link</Button>
    </form>
  </Dialog>;
}

/** Página aberta pelo link do e-mail: /redefinir-senha?token=... */
export default function ResetPassword() {
  const token = new URLSearchParams(location.search).get("token") ?? "";
  const [state, setState] = useState<"checking" | "ok" | "invalid">("checking");
  const [reason, setReason] = useState<string | null>(null);
  const [password, setPassword] = useState(""), [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!token) { setState("invalid"); setReason("Abra o link completo que chegou no seu e-mail."); return; }
    api<{ valido: boolean; motivo?: string }>(`/auth/senha/token?token=${encodeURIComponent(token)}`, { authenticated: false })
      .then((r) => { setState(r.valido ? "ok" : "invalid"); setReason(r.motivo ?? null); })
      .catch((e) => { setState("invalid"); setReason(errorText(e)); });
  }, [token]);
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (busy) return;
    if (password.length < 8) return setError("A senha precisa de ao menos 8 caracteres.");
    if (password !== again) return setError("As duas senhas não são iguais.");
    setBusy(true); setError(null);
    try {
      const r = await api<{ email: string }>("/auth/senha/redefinir", { method: "POST", body: { token, password }, authenticated: false });
      // Entra em seguida com a senha nova: o token de sessão nasce no login, num lugar só.
      const login = await api<{ token: string; doctor?: Doctor }>("/auth/login", { method: "POST", body: { email: r.email, password }, authenticated: false });
      history.replaceState(null, "", "/");
      session.save(login.token, login.doctor ?? { email: r.email });
    } catch (err) { setError(errorText(err)); setBusy(false); }
  }
  return <div className="login" style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
    <form className="stack" style={{ width: "100%", maxWidth: 440 }} onSubmit={save}>
      <div className="row"><Logo size={44} /><span className="round" style={{ fontSize: 22 }}>Vytal Care</span></div>
      <h1>Criar nova senha</h1>
      <Surface>
        {state === "checking" && <div className="row muted"><Spinner />Verificando o link…</div>}
        {state === "invalid" && <><Notice tone="warn">{reason}</Notice><a className="btn big" href="/vytal-care2/app/">Voltar para a entrada</a></>}
        {state === "ok" && <>
          <Field label="Nova senha" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Pelo menos 8 caracteres." />
          <Field label="Repita a nova senha" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} />
          <Notice>{error}</Notice>
          <Button type="submit" className="big" icon="check" busy={busy} disabled={!password || !again}>Salvar e entrar</Button>
          <p className="muted small">Depois disso, a mesma senha vale no app e na web.</p>
        </>}
      </Surface>
    </form>
  </div>;
}
