import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, errorText } from "../api";
import { AppContext } from "../App";
import { Schedule, Weekdays, formatPhone, initials, parseWeekdays, timesOf, type DayGrid, type Medication, type Patient, type ScheduledMeasurement, type WeekDay } from "../models";
import { Avatar, Button, Confirm, Dialog, Eyebrow, Field, Icon, Menu, Notice, Spinner, Surface } from "../ui";
import { DoseRow, WeekStrip } from "../pages/Patient";
import MedicationEditor from "../pages/MedicationEditor";
import MeasurementEditor from "../pages/MeasurementEditor";
import { useFamilia } from "./Familia";
import { AvisoLinha } from "./Avisos";

export type Faixa = { pressaoSistolica: number; pressaoDiastolica: number; glicemiaAlta: number; glicemiaBaixa: number };
export type Medicao = { id: number; tipo: "pressao" | "glicemia"; sistolica?: number | null; diastolica?: number | null; valor?: number | string | null; medidoEm: string };
export type ResumoPessoa = { pessoa: string; hoje: string; sequencia: number; dias: WeekDay[]; medicacoes: Medication[]; medicoes: Medicao[]; faixa: Faixa; faixaCombinada: boolean; receitasTerminando: string[] };

export const foraDaFaixa = (m: Medicao, f: Faixa) => m.tipo === "pressao" ? Number(m.sistolica) >= f.pressaoSistolica || Number(m.diastolica) >= f.pressaoDiastolica : Number(m.valor) > f.glicemiaAlta || Number(m.valor) < f.glicemiaBaixa;
export const textoMedicao = (m: Medicao) => m.tipo === "pressao" ? `${m.sistolica}/${m.diastolica} mmHg` : `${Number(m.valor)} mg/dL`;

export default function PessoaPage() {
  const { phone = "" } = useParams();
  const app = useContext(AppContext)!;
  const pessoa = app.patients.find((p) => p.phone === phone);
  if (!pessoa) return <div className="page narrow">{app.loading ? <div className="row muted"><Spinner />Carregando…</div> : <Surface><b>Pessoa não encontrada</b><Link to="/">Voltar ao início</Link></Surface>}</div>;
  return <Detalhe key={pessoa.phone} pessoa={pessoa} />;
}

function Detalhe({ pessoa }: { pessoa: Patient }) {
  const { reload } = useContext(AppContext)!;
  const { avisos } = useFamilia();
  const navigate = useNavigate();
  const base = `/patients/${pessoa.phone}`;
  const primeiro = pessoa.name.split(/\s+/)[0];
  const [meds, setMeds] = useState<Medication[]>([]), [grade, setGrade] = useState<DayGrid | null>(null), [resumo, setResumo] = useState<ResumoPessoa | null>(null);
  const [pedidos, setPedidos] = useState<ScheduledMeasurement[]>([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
  const [adicionar, setAdicionar] = useState(false), [menu, setMenu] = useState(false), [editor, setEditor] = useState<{ medication?: Medication } | null>(null), [medir, setMedir] = useState(false);
  const [faixaAberta, setFaixaAberta] = useState(false), [apagar, setApagar] = useState<Medication | null>(null), [cancelar, setCancelar] = useState<ScheduledMeasurement | null>(null), [remover, setRemover] = useState(false), [busy, setBusy] = useState(false);
  const carregar = useCallback(async () => {
    try { const s = await api<{ medications?: Medication[] }>(`${base}/summary`); setMeds((s.medications ?? []).filter((m) => m.isMine === true && !m.archivedAt)); setError(null); } catch (e) { setError(errorText(e)); }
    setLoading(false);
    api<DayGrid>(`${base}/hoje`).then(setGrade).catch(() => {});
    api<ResumoPessoa>(`/familia/pessoas/${pessoa.phone}/resumo`).then(setResumo).catch(() => {});
    api<ScheduledMeasurement[]>(`${base}/medicoes-agendadas`).then((r) => setPedidos(Array.isArray(r) ? r : [])).catch(() => {});
  }, [base, pessoa.phone]);
  useEffect(() => { void carregar(); }, [carregar]);
  async function apagarMed(m: Medication) { setBusy(true); try { await api(`/medications/${m.id}`, { method: "DELETE" }); setApagar(null); await carregar(); } catch (e) { setError(errorText(e)); setApagar(null); } setBusy(false); }
  async function cancelarPedido(m: ScheduledMeasurement) { setBusy(true); try { await api(`/medicoes-agendadas/${m.id}`, { method: "DELETE" }); await carregar(); } catch (e) { setError(errorText(e)); } setCancelar(null); setBusy(false); }
  async function removerPessoa() {
    setBusy(true);
    try { if (!pessoa.linkId) throw new Error("Atualize a página e tente de novo."); await api(`/doctor-patients/${pessoa.linkId}`, { method: "DELETE" }); await reload(); navigate("/"); }
    catch (e) { setError(errorText(e)); setRemover(false); setBusy(false); }
  }
  const semana = resumo?.dias.slice(-7) ?? [];
  const meusAvisos = avisos.filter((a) => a.phone === pessoa.phone).slice(0, 4);
  const ultimas = resumo?.medicoes.slice(0, 6) ?? [];

  return <div className="page">
    <Link to="/" className="row small" style={{ gap: 4, fontWeight: 600 }}><Icon name="back" size={16} />Início</Link>
    <div className="row wrap">
      <Avatar text={initials(pessoa.name)} size={60} />
      <div className="grow" style={{ minWidth: 200 }}><h1>{pessoa.name}</h1><div className="row muted" style={{ fontSize: 14, gap: 6 }}><Icon name="wa" size={15} />{formatPhone(pessoa.phone)}</div></div>
      <Button icon="camera" onClick={() => navigate(`/p/${pessoa.phone}/receita`)}>Receita por foto</Button>
      <Button className="plain" icon="plus" onClick={() => setAdicionar(true)}>Adicionar</Button>
      <div style={{ position: "relative" }}>
        <Button className="plain icon" aria-label="Mais opções" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)} icon="dots">{""}</Button>
        {menu && <Menu onClose={() => setMenu(false)} items={[{ label: "Resumo para a consulta", onSelect: () => navigate(`/p/${pessoa.phone}/resumo`) }, { label: `Remover ${primeiro}`, danger: true, onSelect: () => setRemover(true) }]} />}
      </div>
    </div>
    {pessoa.optOut && <Notice tone="warn"><b>{primeiro} pediu para não receber mensagens.</b>{"\n"}Os lembretes ficam salvos, mas nada é enviado até {primeiro} pedir para voltar pelo WhatsApp.</Notice>}
    {pessoa.remindersPaused && !pessoa.optOut && <Notice tone="error"><b>Lembretes pausados.</b>{"\n"}O plano venceu. Nada foi apagado: ao assinar em Conta, tudo volta sozinho.</Notice>}
    {resumo?.receitasTerminando.map((t) => <Notice key={t} tone="info">{t}</Notice>)}
    <Notice>{error}</Notice>
    {loading && <div className="row muted"><Spinner />Carregando…</div>}

    {!loading && meds.length === 0 && <Surface style={{ alignItems: "center", textAlign: "center", padding: 32, gap: 10 }}><span className="muted"><Icon name="camera" size={36} /></span><b>Fotografe a receita de {primeiro}</b>
      <span className="muted">O Vytal Care lê cada remédio, a dose e o horário. Você confere antes de salvar.</span><Button icon="camera" onClick={() => navigate(`/p/${pessoa.phone}/receita`)}>Fotografar receita</Button></Surface>}

    {meds.length > 0 && <div className="split">
      <Surface className="grow" style={{ minWidth: 0 }}>
        <Eyebrow>Hoje</Eyebrow>
        {!grade ? <span className="muted">Carregando…</span> : grade.horarios.length === 0 ? <span className="muted">Nenhum remédio previsto para hoje.</span>
          : <div>{grade.horarios.map((h) => h.itens.filter((i) => i.mine).map((item, i) => <DoseRow key={h.time + i} time={i === 0 ? h.time : ""} item={item} onEdit={() => { const m = meds.find((x) => x.id === item.medicationId); if (m) setEditor({ medication: m }); }} />))}</div>}
        <p className="muted small">"Sem resposta" quer dizer que {primeiro} ainda não tocou em "Já tomei". Você recebe um aviso se passar do horário.</p>
      </Surface>
      <div className="side stack">
        <Surface style={{ alignItems: "center", textAlign: "center", gap: 4 }}><Eyebrow>Sequência</Eyebrow>
          <div className="round tnum" style={{ fontSize: 44, color: resumo?.sequencia ? "var(--ok)" : "var(--muted)" }}>{resumo ? resumo.sequencia : "–"}</div>
          <span className="muted small">{resumo?.sequencia === 1 ? "dia seguido com tudo confirmado" : "dias seguidos com tudo confirmado"}</span></Surface>
        {semana.length > 0 && <WeekStrip days={semana} />}
      </div>
    </div>}

    {meds.length > 0 && <Surface>
      <div className="row between"><h2>Remédios</h2><button className="link" onClick={() => setEditor({})}>Adicionar à mão</button></div>
      <div className="stack" style={{ gap: 0 }}>{meds.map((m) => <div key={m.id} className="row wrap" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
        <div className="grow" style={{ minWidth: 180 }}><div style={{ fontWeight: 600 }}>{m.medicationName} <span className="muted" style={{ fontWeight: 400 }}>{m.dose}</span></div>
          <div className="muted small">{parseWeekdays(m.weekdays).length < 7 ? `${Weekdays.summary(parseWeekdays(m.weekdays))} · ` : ""}{m.endDate ? `até ${Schedule.display(m.endDate)}` : "uso contínuo"}{m.instructions ? ` · ${m.instructions}` : ""}</div></div>
        <div className="row wrap" style={{ gap: 6 }}>{timesOf(m).map((t) => <span key={t} className="time">{t}</span>)}</div>
        <div className="row" style={{ gap: 14 }}><button className="link" onClick={() => setEditor({ medication: m })}>Editar</button><button className="link danger" onClick={() => setApagar(m)}>Excluir</button></div>
      </div>)}</div>
    </Surface>}

    <Surface>
      <div className="row between wrap"><h2>Pressão e glicemia</h2><button className="link" onClick={() => setMedir(true)}>Pedir medição</button></div>
      {pedidos.length > 0 ? <div className="row wrap" style={{ gap: 10 }}>{pedidos.map((m) => <div key={m.id} className="row" style={{ gap: 8, background: "var(--bg)", borderRadius: 14, padding: "8px 12px" }}><Icon name={m.tipo === "glicemia" ? "drop" : "heart"} size={16} /><b className="small">{m.tipo === "glicemia" ? "Glicemia" : "Pressão"}</b><span className="muted small">{timesOf(m).join(" · ")}</span><button className="link danger small" onClick={() => setCancelar(m)}>Cancelar</button></div>)}</div>
        : <p className="muted">Se o médico pediu para medir, o Vytal Care pede no horário e {primeiro} responde com o número.</p>}
      {ultimas.length > 0 && resumo && <div className="stack" style={{ gap: 0 }}>{ultimas.map((m) => { const fora = foraDaFaixa(m, resumo.faixa); return <div key={m.id} className="row" style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
        <span className="grow">{m.tipo === "pressao" ? "Pressão" : "Glicemia"}: <b className="tnum" style={{ color: fora ? "var(--bad)" : undefined }}>{textoMedicao(m)}</b>{fora && <span className="small" style={{ color: "var(--bad)" }}> · fora da faixa</span>}</span><span className="muted small">{Schedule.dateTime(m.medidoEm)}</span></div>; })}</div>}
      {resumo && <div className="row between wrap" style={{ background: "var(--bg)", borderRadius: 16, padding: "12px 14px" }}>
        <div><div className="small" style={{ fontWeight: 600 }}>{resumo.faixaCombinada ? "Faixa combinada com o médico" : "Faixa de referência"}</div>
          <div className="muted small">Pressão até {resumo.faixa.pressaoSistolica}/{resumo.faixa.pressaoDiastolica} · Glicemia de {resumo.faixa.glicemiaBaixa} a {resumo.faixa.glicemiaAlta} mg/dL</div></div>
        <button className="link" onClick={() => setFaixaAberta(true)}>{resumo.faixaCombinada ? "Mudar" : "Informar a faixa do médico"}</button></div>}
    </Surface>

    {meusAvisos.length > 0 && <Surface><div className="row between"><h2>Avisos de {primeiro}</h2><Link to="/avisos" className="small">Ver todos</Link></div><div>{meusAvisos.map((a) => <AvisoLinha key={a.id} aviso={a} />)}</div></Surface>}

    <Link to={`/p/${pessoa.phone}/resumo`} className="surface" style={{ flexDirection: "row", alignItems: "center", color: "var(--ink)" }}>
      <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--blue-soft)", color: "var(--blue)", display: "grid", placeItems: "center" }}><Icon name="list" size={22} /></div>
      <div className="grow"><b>Resumo para a consulta</b><div className="muted small">Remédios, doses confirmadas e medições dos últimos 30 dias, pronto para imprimir ou salvar em PDF.</div></div><span className="muted"><Icon name="chev" size={16} /></span></Link>

    {adicionar && <Dialog title="O que você quer adicionar?" eyebrow={pessoa.name} onClose={() => setAdicionar(false)}>
      <Acao icon="camera" titulo="Receita por foto" texto="Foto ou PDF. Você confere antes de salvar." onClick={() => { setAdicionar(false); navigate(`/p/${pessoa.phone}/receita`); }} />
      <Acao icon="pill" titulo="Remédio à mão" texto="Nome, dose, horários e por quanto tempo." onClick={() => { setAdicionar(false); setEditor({}); }} />
      <Acao icon="gauge" titulo="Pedido de medição" texto="Pressão ou glicemia, nos horários que o médico pediu." onClick={() => { setAdicionar(false); setMedir(true); }} />
    </Dialog>}
    {editor && <MedicationEditor patient={pessoa} medication={editor.medication} onClose={(salvo) => { setEditor(null); if (salvo) { void carregar(); void reload(); } }} />}
    {medir && <MeasurementEditor patient={pessoa} onClose={(salvo) => { setMedir(false); if (salvo) void carregar(); }} />}
    {faixaAberta && resumo && <FaixaDialog phone={pessoa.phone} faixa={resumo.faixa} combinada={resumo.faixaCombinada} onClose={(mudou) => { setFaixaAberta(false); if (mudou) void carregar(); }} />}
    {apagar && <Confirm title="Excluir este remédio?" message={`Os lembretes de ${apagar.medicationName} param. O histórico continua salvo.`} action="Excluir" busy={busy} onCancel={() => setApagar(null)} onConfirm={() => apagarMed(apagar)} />}
    {cancelar && <Confirm title="Cancelar o pedido de medição?" message={`${primeiro} deixa de receber o pedido. Os valores já registrados continuam salvos.`} action="Cancelar pedido" busy={busy} onCancel={() => setCancelar(null)} onConfirm={() => cancelarPedido(cancelar)} />}
    {remover && <Confirm title={`Remover ${pessoa.name}?`} message={`Os lembretes de ${primeiro} param de ser enviados. O histórico fica salvo e, se cadastrar de novo, volta.`} action="Remover" busy={busy} onCancel={() => setRemover(false)} onConfirm={removerPessoa} />}
  </div>;
}

function Acao({ icon, titulo, texto, onClick }: { icon: string; titulo: string; texto: string; onClick: () => void }) {
  return <button type="button" className="action" onClick={onClick}><div className="ico"><Icon name={icon} size={22} /></div><div className="grow"><div style={{ fontWeight: 600, fontSize: 16 }}>{titulo}</div><div className="muted small">{texto}</div></div><span className="muted"><Icon name="chev" size={16} /></span></button>;
}

/** A faixa que o médico combinou: é ela que decide quando o aviso sai. */
function FaixaDialog({ phone, faixa, combinada, onClose }: { phone: string; faixa: Faixa; combinada: boolean; onClose: (mudou: boolean) => void }) {
  const [f, setF] = useState({ pressaoSistolica: String(faixa.pressaoSistolica), pressaoDiastolica: String(faixa.pressaoDiastolica), glicemiaBaixa: String(faixa.glicemiaBaixa), glicemiaAlta: String(faixa.glicemiaAlta) });
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value.replace(/\D/g, "").slice(0, 3) });
  async function salvar(limpar = false) {
    setBusy(true); setError(null);
    try { await api(`/familia/pessoas/${phone}/faixa`, { method: "PUT", body: limpar ? { limpar: true } : Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Number(v)])) }); onClose(true); }
    catch (e) { setError(errorText(e)); setBusy(false); }
  }
  return <Dialog title="Faixa combinada com o médico" onClose={() => onClose(false)} locked={busy}>
    <p className="muted small">Use os valores que o médico passou. Quando uma medição sair desta faixa, você recebe um aviso. O Vytal Care não diz o que fazer: isso é com o médico.</p>
    <b>Pressão: avisar a partir de</b>
    <div className="row" style={{ alignItems: "flex-end" }}><div className="grow"><Field label="Máxima (sistólica)" inputMode="numeric" value={f.pressaoSistolica} onChange={set("pressaoSistolica")} /></div><span className="round" style={{ paddingBottom: 14 }}>/</span><div className="grow"><Field label="Mínima (diastólica)" inputMode="numeric" value={f.pressaoDiastolica} onChange={set("pressaoDiastolica")} /></div></div>
    <b>Glicemia: avisar fora de</b>
    <div className="row" style={{ alignItems: "flex-end" }}><div className="grow"><Field label="Mínimo (mg/dL)" inputMode="numeric" value={f.glicemiaBaixa} onChange={set("glicemiaBaixa")} /></div><span style={{ paddingBottom: 14 }}>a</span><div className="grow"><Field label="Máximo (mg/dL)" inputMode="numeric" value={f.glicemiaAlta} onChange={set("glicemiaAlta")} /></div></div>
    <Notice>{error}</Notice>
    <div className="row wrap" style={{ justifyContent: "flex-end" }}>{combinada && <Button className="plain" disabled={busy} onClick={() => salvar(true)}>Voltar à faixa de referência</Button>}<Button icon="check" busy={busy} onClick={() => salvar()}>Salvar</Button></div>
  </Dialog>;
}
