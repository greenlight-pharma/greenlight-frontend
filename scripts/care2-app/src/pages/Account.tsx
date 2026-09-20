import { useState } from "react";
import { api, errorText, session } from "../api";
import { findProfession, initials } from "../models";
import { Avatar, Button, Dialog, Field, Icon, Notice, Spinner, Surface, useLoad } from "../ui";
import { useApp } from "../App";
import { ProfileDialog } from "./Profile";
import { PlanCard } from "./Plans";

export default function Account() {
  const { session: s, plan, reload } = useApp();
  const [editing, setEditing] = useState(false), [deleting, setDeleting] = useState(false);
  const role = [findProfession(s.doctor.profissao)?.name ?? "Profissional de saúde", s.doctor.crm].filter(Boolean).join(" · ");
  return <div className="page narrow">
    <h1>Sua conta</h1>
    <Surface><div className="row"><Avatar text={initials(s.doctor.name ?? "") || "VC"} size={64} /><div className="grow"><h2>{s.doctor.name || "Sua conta"}</h2><div className="muted">{s.doctor.email}</div></div></div>
      <div className="muted" style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>{role}</div>
      <div className="row wrap between"><button className="link row" onClick={() => setEditing(true)}><Icon name="edit" size={16} />Editar nome e registro</button>
        <Button className="plain" icon="logout" onClick={() => session.logout()}>Sair da conta</Button></div>
      <p className="muted small">Ao sair, seus dados de acesso são removidos deste navegador. Os lembretes dos pacientes continuam ativos.</p></Surface>
    {plan && <PlanCard plan={plan} onChanged={reload} />}
    <Surface><div className="row wrap" style={{ gap: 20 }}><a href="https://www.vytalsaude.com.br/termos" target="_blank" rel="noreferrer">Termos de uso</a><a href="https://www.vytalsaude.com.br/privacidade" target="_blank" rel="noreferrer">Política de privacidade</a></div>
      <button className="link danger" style={{ alignSelf: "flex-start" }} onClick={() => setDeleting(true)}>Excluir minha conta</button></Surface>
    <p className="muted small" style={{ textAlign: "center" }}>Vytal Care<br />Tecnologia para estar mais perto.</p>
    {editing && <ProfileDialog onClose={() => setEditing(false)} />}
    {deleting && <DeleteAccount onClose={() => setDeleting(false)} />}
  </div>;
}

export function DeleteAccount({ onClose, pessoal = false }: { onClose: () => void; pessoal?: boolean }) {
  const [requiresPassword, setRequiresPassword] = useState<boolean | null>(null);
  const [password, setPassword] = useState(""), [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => { let needs = true; try { needs = (await api<{ exigeSenha?: boolean }>("/auth/conta/requisitos")).exigeSenha !== false; } catch { /* na dúvida, pede a senha */ } if (alive()) setRequiresPassword(needs); }, []);
  async function remove() {
    if (busy) return; setBusy(true); setError(null);
    try { await api("/auth/conta", { method: "DELETE", body: { confirmacao: confirmation, ...(requiresPassword ? { password } : {}) } }); session.logout(); }
    catch (e) { setError(errorText(e)); setBusy(false); setPassword(""); }
  }
  return <Dialog title="Antes de excluir" onClose={onClose} locked={busy}>
    <b>Esta ação é permanente.</b>
    {pessoal ? <ul className="muted" style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}><li>Os lembretes cadastrados por você deixam de ser enviados.</li><li>As pessoas que você cadastrou são avisadas pelo WhatsApp.</li><li>Uma assinatura ativa é cancelada.</li></ul> : <ul className="muted" style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}><li>Os lembretes cadastrados por você deixam de ser enviados.</li><li>Os pacientes são avisados pelo WhatsApp. O tratamento prescrito não muda.</li><li>Medicações de outros profissionais continuam normalmente.</li><li>O histórico de respostas dos pacientes permanece preservado.</li></ul>}
    {requiresPassword === null ? <div className="row muted"><Spinner />Verificando sua conta…</div> : <>
      {requiresPassword && <Field label="Sua senha" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
      <Field label="Digite EXCLUIR para confirmar" autoComplete="off" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
      <Notice>{error}</Notice>
      <Button className="big danger" busy={busy} disabled={confirmation !== "EXCLUIR" || (requiresPassword && !password)} onClick={remove}>Excluir conta definitivamente</Button></>}
  </Dialog>;
}
