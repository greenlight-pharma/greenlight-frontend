import { useCallback, useEffect, useState, type ReactNode } from "react";
import { api, errorText, session } from "../api";
import { Button, Logo, Notice, Spinner, Surface } from "../ui";

type Estado = { email?: string | null; emailVerificado?: boolean; confirmacaoPendente?: boolean };

/**
 * [CONFIRMAR-EMAIL] Sem e-mail confirmado, a conta não entra no app: fica
 * nesta tela até confirmar (pedido do Dilson, 19/09/2026). A tela verifica
 * sozinha a cada poucos segundos e quando a aba volta ao foco, porque a
 * pessoa confirma no e-mail do celular e volta aqui.
 * Se a consulta falhar (rede), deixa entrar: erro de conexão não pode
 * trancar ninguém do lado de fora. O servidor continua barrando o envio de
 * WhatsApp para conta sem confirmação.
 */
export default function EmailGate({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<"carregando" | "pendente" | "ok">("carregando");
  const [email, setEmail] = useState<string | null>(session.get()?.doctor.email ?? null);
  const [aviso, setAviso] = useState<string | null>(null), [erro, setErro] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const verificar = useCallback(async (manual = false) => {
    try {
      const r = await api<Estado>("/auth/email/estado");
      if (r.email) setEmail(r.email);
      if (r.confirmacaoPendente) { setEstado("pendente"); if (manual) setAviso("Ainda não recebemos a confirmação. Abra o link do e-mail e tente de novo."); }
      else setEstado("ok");
    } catch { setEstado((e) => (e === "carregando" ? "ok" : e)); }
  }, []);
  useEffect(() => { void verificar(); }, [verificar]);
  useEffect(() => {
    if (estado !== "pendente") return;
    const t = setInterval(() => { if (document.visibilityState === "visible") void verificar(); }, 5000);
    const onVisible = () => { if (document.visibilityState === "visible") void verificar(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", onVisible); };
  }, [estado, verificar]);
  async function reenviar() {
    setBusy(true); setErro(null); setAviso(null);
    try { await api("/auth/email/reenviar", { method: "POST", body: {} }); setAviso(`Enviamos o link de novo para ${email}. Confira também a caixa de spam.`); }
    catch (e) { setErro(errorText(e)); } finally { setBusy(false); }
  }
  if (estado === "carregando") return <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}><div className="row muted"><Spinner />Carregando…</div></div>;
  if (estado === "ok") return <>{children}</>;
  return <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
    <Surface style={{ width: "100%", maxWidth: 460, gap: 18, textAlign: "center", alignItems: "center", padding: 28 }}>
      <Logo size={64} tile />
      <h1 style={{ fontSize: 28 }}>Confirme seu e-mail</h1>
      <p className="muted" style={{ fontSize: 16 }}>Enviamos um link para <b style={{ color: "var(--ink)" }}>{email}</b>. Abra o e-mail e toque em <b style={{ color: "var(--ink)" }}>Confirmar meu e-mail</b>.</p>
      <div className="row muted small" style={{ justifyContent: "center" }}><Spinner />Esta tela continua sozinha assim que você confirmar.</div>
      <Notice tone="info">{aviso}</Notice>
      <Notice>{erro}</Notice>
      <Button className="big" style={{ width: "100%" }} icon="check" onClick={() => verificar(true)}>Já confirmei</Button>
      <Button className="plain big" style={{ width: "100%" }} busy={busy} onClick={reenviar}>Reenviar o e-mail</Button>
      <p className="muted small">Não chegou? Confira a caixa de spam ou de promoções. O remetente é o Vytal Care.</p>
      <button type="button" className="link" onClick={() => session.logout()}>Entrar com outra conta</button>
    </Surface>
  </div>;
}
