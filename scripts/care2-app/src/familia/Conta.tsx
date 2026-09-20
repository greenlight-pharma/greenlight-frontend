import { useContext, useEffect, useState } from "react";
import { api, errorText, session } from "../api";
import { AppContext } from "../App";
import { formatPhone, initials } from "../models";
import { Avatar, Button, Dialog, Field, Icon, Notice, Segmented, Surface, useLoad } from "../ui";
import { PlanCard } from "../pages/Plans";
import { DeleteAccount } from "../pages/Account";

type Config = { naoConfirmou: boolean; esperaMin: number; tomou: boolean; medicao: boolean; receita: boolean; email: boolean };
type ConfigResposta = { config: Config; phone: string | null; emailAtivo: boolean; whatsappAtivo: boolean };

export default function Conta() {
  const { session: s, plan, reload } = useContext(AppContext)!;
  const [editando, setEditando] = useState(false), [excluir, setExcluir] = useState(false);
  // O link "Configurar avisos" chega com #avisos.
  useEffect(() => { if (location.hash === "#avisos") setTimeout(() => document.getElementById("avisos")?.scrollIntoView({ behavior: "smooth" }), 300); }, []);
  return <div className="page narrow">
    <h1>Sua conta</h1>
    <Surface><div className="row"><Avatar text={initials(s.doctor.name ?? "") || "VC"} size={64} /><div className="grow"><h2>{s.doctor.name || "Sua conta"}</h2><div className="muted">{s.doctor.email}</div>{s.doctor.phone && <div className="muted small">WhatsApp {formatPhone(s.doctor.phone)}</div>}</div></div>
      <div className="row wrap between"><button className="link row" onClick={() => setEditando(true)}><Icon name="edit" size={16} />Editar nome e WhatsApp</button>
        <Button className="plain" icon="logout" onClick={() => session.logout()}>Sair da conta</Button></div></Surface>
    {plan && <PlanCard plan={plan} onChanged={reload} />}
    <ConfigAvisos />
    <Surface><div className="row wrap" style={{ gap: 20 }}><a href="https://www.vytalsaude.com.br/termos" target="_blank" rel="noreferrer">Termos de uso</a><a href="https://www.vytalsaude.com.br/privacidade" target="_blank" rel="noreferrer">Política de privacidade</a></div>
      <button className="link danger" style={{ alignSelf: "flex-start" }} onClick={() => setExcluir(true)}>Excluir minha conta</button></Surface>
    <p className="muted small" style={{ textAlign: "center" }}>Vytal Care<br />O cuidado que continua em casa.</p>
    {editando && <Perfil onClose={() => setEditando(false)} />}
    {excluir && <DeleteAccount pessoal onClose={() => setExcluir(false)} />}
  </div>;
}

function ConfigAvisos() {
  const [r, setR] = useState<ConfigResposta | null>(null), [salvo, setSalvo] = useState<string | null>(null), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => { try { const x = await api<ConfigResposta>("/familia/config"); if (alive()) setR(x); } catch (e) { if (alive()) setError(errorText(e)); } }, []);
  async function mudar(parcial: Partial<Config>) {
    if (!r) return;
    setR({ ...r, config: { ...r.config, ...parcial } }); setError(null);
    try { const x = await api<{ config: Config }>("/familia/config", { method: "PUT", body: parcial }); setR((a) => (a ? { ...a, config: x.config } : a)); setSalvo("Salvo."); setTimeout(() => setSalvo(null), 1500); }
    catch (e) { setError(errorText(e)); }
  }
  const Opcao = ({ k, titulo, texto }: { k: keyof Config; titulo: string; texto: string }) => <label className="row" style={{ alignItems: "flex-start", padding: "8px 0" }}>
    <input type="checkbox" checked={Boolean(r?.config[k])} onChange={(e) => mudar({ [k]: e.target.checked })} style={{ width: 22, height: 22, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
    <span><span style={{ fontWeight: 600 }}>{titulo}</span><br /><span className="muted small">{texto}</span></span></label>;
  return <Surface><div id="avisos" className="row between"><h2>Avisos para você</h2>{salvo && <span className="small" style={{ color: "var(--ok)" }}>{salvo}</span>}</div>
    {!r ? <Notice>{error}</Notice> : <>
      <Opcao k="naoConfirmou" titulo="Dose sem confirmação" texto="Quando o horário passa e ninguém toca em “Já tomei”, ou a pessoa responde que ainda não tomou." />
      {r.config.naoConfirmou && <div style={{ paddingLeft: 34 }}><Segmented label="Esperar antes de avisar" value={r.config.esperaMin} onChange={(v) => mudar({ esperaMin: v })} options={[{ value: 30, label: "30 min" }, { value: 60, label: "1 hora" }, { value: 120, label: "2 horas" }]} /></div>}
      <Opcao k="medicao" titulo="Medição fora da faixa" texto="Pressão ou glicemia fora da faixa combinada com o médico." />
      <Opcao k="receita" titulo="Tratamento terminando" texto="5 dias antes da data de fim de um remédio." />
      <Opcao k="tomou" titulo="Cada dose confirmada" texto="Um aviso a cada “Já tomei”. Aparece aqui no Vytal Care (não vai por e-mail)." />
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 6 }}><Opcao k="email" titulo="Receber por e-mail" texto="Os avisos também chegam no seu e-mail." /></div>
      <p className="muted small">Relatos de algo diferente depois de um remédio sempre geram aviso. {r.whatsappAtivo ? (r.phone ? `Os avisos também chegam no seu WhatsApp (${formatPhone(r.phone)}).` : "Informe seu WhatsApp em Editar para receber os avisos por lá.") : "Em breve os avisos também vão chegar pelo WhatsApp."}</p>
      <Notice>{error}</Notice></>}
  </Surface>;
}

function Perfil({ onClose }: { onClose: () => void }) {
  const d = session.get()?.doctor;
  const [nome, setNome] = useState(d?.name ?? ""), [fone, setFone] = useState((d?.phone ?? "").replace(/^55/, ""));
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  async function salvar() {
    setBusy(true); setError(null);
    try { const r = await api<{ doctor: { name: string; phone: string | null } }>("/auth/perfil", { method: "PATCH", body: { name: nome.trim(), phone: fone } }); session.updateDoctor({ name: r.doctor.name, phone: r.doctor.phone }); onClose(); }
    catch (e) { setError(errorText(e)); setBusy(false); }
  }
  return <Dialog title="Seus dados" onClose={onClose} locked={busy}>
    <Field label="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} hint="É o nome que aparece na mensagem de boas-vindas de quem você cadastrar." />
    <Field label="Seu WhatsApp (opcional)" inputMode="tel" placeholder="DDD + número" value={fone} onChange={(e) => setFone(e.target.value.replace(/\D/g, "").slice(0, 11))} hint="Para receber os avisos pelo WhatsApp quando essa opção estiver disponível." />
    <Notice>{error}</Notice>
    <Button className="big" icon="check" busy={busy} disabled={nome.trim().length < 2} onClick={salvar}>Salvar</Button>
  </Dialog>;
}
