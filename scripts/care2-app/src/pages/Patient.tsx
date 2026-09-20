import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, errorText } from "../api";
import { CARE_AUTHORSHIP, Schedule, Weekdays, formatPhone, initials, medicationState, timesOf, type AdherenceMedication, type DayGrid, type DayItem, type Medication, type Patient, type ScheduledMeasurement, type SharedMedication, type WeekDay, parseWeekdays } from "../models";
import { Avatar, Button, Chip, Confirm, Dialog, Eyebrow, Icon, Menu, Notice, Segmented, Spinner, Surface } from "../ui";
import { useApp } from "../App";
import MedicationEditor from "./MedicationEditor";
import MeasurementEditor from "./MeasurementEditor";
import { CareSection } from "./Care";

export const REMOVAL_MESSAGE = "Os lembretes, aferições e protocolos cadastrados por você para este paciente param de ser enviados. Os de outros profissionais continuam. O histórico de respostas é preservado.";
const TABS = [{ value: "hoje", label: "Hoje", icon: "sun" }, { value: "medicacoes", label: "Medicações", icon: "pill" }, { value: "cuidados", label: "Cuidados", icon: "heart" }, { value: "acompanhar", label: "Acompanhar", icon: "chart" }];
const STATUS: Record<string, [string, "" | "ok" | "bad" | "warn" | "info"]> = { tomou: ["Tomou", "ok"], nao_tomou: ["Não tomou", "bad"], efeito_colateral: ["Teve reação", "warn"], sem_resposta: ["Sem resposta", ""], futuro: ["Mais tarde", "info"] };

export function usePatient(): Patient | null {
  const { phone = "" } = useParams();
  const { patients } = useApp();
  return patients.find((p) => p.phone === phone) ?? null;
}
export function PatientMissing() {
  const { loading } = useApp();
  return <div className="page narrow">{loading ? <div className="row muted"><Spinner />Carregando…</div> : <Surface><b>Paciente não encontrado</b><p className="muted">Ele pode ter sido removido da sua lista.</p><Link to="/">Voltar ao início</Link></Surface>}</div>;
}

export default function PatientPage() {
  const patient = usePatient();
  if (!patient) return <PatientMissing />;
  return <Detail key={patient.phone} patient={patient} />;
}

function Detail({ patient }: { patient: Patient }) {
  const { reload } = useApp();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.value === params.get("aba")) ? params.get("aba")! : "hoje";
  const [medications, setMedications] = useState<Medication[]>([]);
  const [shared, setShared] = useState<SharedMedication[]>([]);
  const [measurements, setMeasurements] = useState<ScheduledMeasurement[]>([]);
  const [grid, setGrid] = useState<DayGrid | null>(null);
  const [week, setWeek] = useState<WeekDay[] | null>(null);
  const [adherence, setAdherence] = useState<AdherenceMedication[] | null>(null);
  const [filter, setFilter] = useState("todas");
  const [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false), [menu, setMenu] = useState(false);
  const [editor, setEditor] = useState<{ medication?: Medication } | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [careNew, setCareNew] = useState(0);
  const [deleting, setDeleting] = useState<Medication | null>(null);
  const [canceling, setCanceling] = useState<ScheduledMeasurement | null>(null);
  const [removing, setRemoving] = useState(false), [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const base = `/patients/${patient.phone}`;
    try { const s = await api<{ medications?: Medication[] }>(`${base}/summary`); setMedications((s.medications ?? []).filter((m) => m.isMine === true && !m.archivedAt)); setError(null); } catch (e) { setError(errorText(e)); }
    setLoading(false);
    // Falhas abaixo não escondem o tratamento do próprio profissional: cada seção só deixa de aparecer.
    api<DayGrid>(`${base}/hoje`).then(setGrid).catch(() => {});
    api<{ dias: WeekDay[] }>(`${base}/semana`).then((r) => setWeek(r.dias ?? [])).catch(() => {});
    api<{ items: SharedMedication[] }>(`${base}/shared-medications`).then((r) => setShared(r.items ?? [])).catch(() => {});
    api<ScheduledMeasurement[]>(`${base}/medicoes-agendadas`).then((r) => setMeasurements(Array.isArray(r) ? r : [])).catch(() => {});
    api<{ resumo: AdherenceMedication[] }>(`${base}/adesao?dias=30`).then((r) => setAdherence(r.resumo ?? [])).catch(() => {});
  }, [patient.phone]);
  useEffect(() => { void load(); }, [load]);

  const expected = adherence?.reduce((n, m) => n + m.esperadas, 0) ?? 0;
  const percent = adherence && expected > 0 ? Math.round((adherence.reduce((n, m) => n + m.tomou, 0) / expected) * 100) : null;
  const selected = medications.filter((m) => filter === "todas" || (filter === "curso") === (medicationState(m) === "Em acompanhamento"));
  async function removeMedication(m: Medication) { setBusy(true); try { await api(`/medications/${m.id}`, { method: "DELETE" }); setDeleting(null); await load(); void reload(); } catch (e) { setError(errorText(e)); setDeleting(null); } setBusy(false); }
  async function removePatient() {
    setBusy(true);
    try { if (!patient.linkId) throw new Error("Atualize a lista de pacientes e tente novamente."); await api(`/doctor-patients/${patient.linkId}`, { method: "DELETE" }); await reload(); navigate("/"); }
    catch (e) { setError(errorText(e)); setRemoving(false); setBusy(false); }
  }
  async function cancelMeasurement(m: ScheduledMeasurement) { setBusy(true); try { await api(`/medicoes-agendadas/${m.id}`, { method: "DELETE" }); await load(); } catch (e) { setError(errorText(e)); } setCanceling(null); setBusy(false); }
  const choose = (action: string) => { setAdding(false); if (action === "receita") navigate(`/p/${patient.phone}/receita`); if (action === "medicacao") setEditor({}); if (action === "afericao") setMeasuring(true); if (action === "protocolo") { setParams({ aba: "cuidados" }); setCareNew((n) => n + 1); } };

  return <div className="page">
    <Link to="/" className="row small" style={{ gap: 4, fontWeight: 600 }}><Icon name="back" size={16} />Pacientes</Link>
    <div className="row wrap">
      <Avatar text={initials(patient.name)} size={60} />
      <div className="grow" style={{ minWidth: 200 }}><h1>{patient.name}</h1>
        <div className="row wrap muted" style={{ fontSize: 14, gap: 8 }}><Icon name="wa" size={15} /><a href={`https://wa.me/${patient.phone}`} target="_blank" rel="noreferrer" title="Abrir conversa no WhatsApp">{formatPhone(patient.phone)}</a>{percent != null && <span className="chip" style={{ color: "var(--teal)", background: "var(--teal-soft)" }}>adesão {percent}% em 30 dias</span>}</div></div>
      <Button icon="plus" onClick={() => setAdding(true)}>Adicionar</Button>
      <div style={{ position: "relative" }}>
        <Button className="plain icon" aria-label="Mais opções do paciente" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)} icon="dots">{""}</Button>
        {menu && <Menu onClose={() => setMenu(false)} items={[{ label: "Remover paciente", danger: true, onSelect: () => setRemoving(true) }]} />}
      </div>
    </div>
    {patient.optOut && <Notice tone="warn"><b>Este paciente pediu para não receber mensagens.</b>{"\n"}Os lembretes cadastrados ficam salvos, mas nada é enviado enquanto ele não pedir para voltar pelo WhatsApp.</Notice>}
    {patient.remindersPaused && !patient.optOut && <Notice tone="error"><b>Lembretes pausados: o plano venceu.</b>{"\n"}Este paciente passou do limite do plano gratuito e parou de receber lembretes, aferições e cuidados. Nada foi apagado: ao pagar o plano em Conta, tudo volta sozinho.</Notice>}
    <Segmented icons label="Seções da ficha" value={tab} options={TABS} onChange={(v) => setParams(v === "hoje" ? {} : { aba: v })} />
    <Notice>{error}</Notice>
    {loading && <div className="row muted"><Spinner />Carregando…</div>}

    {tab === "hoje" && !grid && !loading && <Notice tone="warn">Não foi possível carregar a grade do dia. Recarregue a página.</Notice>}
    {tab === "hoje" && grid && (grid.horarios.length === 0
      ? <Surface style={{ alignItems: "center", textAlign: "center", padding: 36 }}><span className="muted"><Icon name="calendar" size={36} /></span><b>Nada programado para hoje</b><span className="muted">Adicione uma receita ou uma medicação para ver a grade do dia.</span></Surface>
      : <div className="split"><Surface className="grow" style={{ minWidth: 0 }}><Eyebrow>Grade do dia · {grid.totalMedicacoes ?? 0} {grid.totalMedicacoes === 1 ? "medicação" : "medicações"}, {grid.totalDoses ?? 0} doses suas</Eyebrow>
        <div>{grid.horarios.map((h) => h.itens.map((item, i) => <DoseRow key={h.time + i} time={i === 0 ? h.time : ""} item={item} onEdit={item.mine ? () => { const m = medications.find((x) => x.id === item.medicationId); if (m) setEditor({ medication: m }); } : undefined} />))}</div>
        <p className="muted small">Silêncio não é dose perdida: o estado só muda quando o paciente responde. Clique em uma linha sua para editar.</p></Surface>
        {week && week.length > 0 && <div className="side"><WeekStrip days={week} /></div>}</div>)}

    {tab === "medicacoes" && <>
      <Segmented label="Mostrar medicações" value={filter} onChange={setFilter} options={[{ value: "todas", label: "Todas" }, { value: "curso", label: "Em curso" }, { value: "outras", label: "Outras" }]} />
      {!loading && selected.length === 0 && <Surface style={{ alignItems: "center", textAlign: "center", padding: 36 }}><span className="muted"><Icon name="pill" size={36} /></span><b>Nenhuma medicação aqui</b><span className="muted">Use Adicionar para enviar a foto da receita ou cadastrar a orientação prescrita.</span></Surface>}
      <div className="grid2">{selected.map((m) => <Surface key={m.id} style={{ gap: 12 }}>
        <div className="row between" style={{ alignItems: "flex-start" }}><div><div style={{ fontWeight: 600, fontSize: 17 }}>{m.medicationName}</div><div className="muted" style={{ fontSize: 14 }}>{m.dose}</div></div><Chip tone={medicationState(m) === "Em acompanhamento" ? "ok" : ""}>{medicationState(m)}</Chip></div>
        <div className="row wrap" style={{ gap: 6 }}>{timesOf(m).map((t) => <span key={t} className="time">{t}</span>)}</div>
        <div className="muted small">{parseWeekdays(m.weekdays).length < 7 ? `${Weekdays.summary(parseWeekdays(m.weekdays))} · ` : ""}{m.endDate ? `Até ${Schedule.display(m.endDate)}` : "Uso contínuo"}{m.instructions ? ` · ${m.instructions}` : ""}</div>
        <div className="row" style={{ gap: 18 }}><button className="link" aria-label={`Editar ${m.medicationName}`} onClick={() => setEditor({ medication: m })}>Editar</button><button className="link danger" aria-label={`Excluir lembrete de ${m.medicationName}`} onClick={() => setDeleting(m)}>Excluir lembrete</button></div>
      </Surface>)}</div>
      {shared.length > 0 && <><Eyebrow>Cadastrado por outros profissionais</Eyebrow><p className="muted small">Somente leitura. Ajuda a evitar remédio duplicado e interação.</p>
        <div className="grid2">{shared.map((s, i) => <Surface key={i} style={{ gap: 10 }}><div><div style={{ fontWeight: 600, fontSize: 17 }}>{s.medicationName}</div><div className="muted" style={{ fontSize: 14 }}>{s.dose}</div></div>
          <div className="row wrap" style={{ gap: 6 }}>{timesOf(s).map((t) => <span key={t} className="time">{t}</span>)}</div>
          {parseWeekdays(s.weekdays).length < 7 && <div className="muted small">{Weekdays.summary(parseWeekdays(s.weekdays))}</div>}<div className="row small" style={{ color: "var(--teal)", gap: 6 }}><Icon name="shield" size={15} />{s.doctorName ?? "Outro profissional"}</div></Surface>)}</div></>}
    </>}

    {tab === "cuidados" && <>
      <Eyebrow>Aferições solicitadas</Eyebrow>
      {measurements.length === 0 && <p className="muted">Nenhuma aferição pedida. Use Adicionar para pedir pressão ou glicemia.</p>}
      <div className="grid2">{measurements.map((m) => <Surface key={m.id} style={{ gap: 8 }}><div className="row between"><div className="row"><span style={{ color: "var(--teal)" }}><Icon name={m.tipo === "glicemia" ? "drop" : "heart"} /></span><b>{m.tipo === "glicemia" ? "Glicemia" : "Pressão arterial"}</b></div><button className="link danger" aria-label={`Cancelar aferição de ${m.tipo === "glicemia" ? "glicemia" : "pressão arterial"}`} onClick={() => setCanceling(m)}>Cancelar</button></div>
        <div className="row wrap" style={{ gap: 6 }}>{timesOf(m).map((t) => <span key={t} className="time">{t}</span>)}</div><div className="muted small">{m.endDate ? `Até ${Schedule.display(m.endDate)}` : "Acompanhamento contínuo"}</div></Surface>)}</div>
      <CareSection patient={patient} openNew={careNew} onConsumed={() => setCareNew(0)} />
      <p className="muted small">{CARE_AUTHORSHIP}</p>
    </>}

    {tab === "acompanhar" && <>
      {adherence && <Surface><b>Últimos 30 dias</b><div className="row wrap" style={{ gap: 32 }}>
        <Metric n={adherence.reduce((n, m) => n + m.tomou, 0)} label="Tomou" color="var(--teal)" /><Metric n={adherence.reduce((n, m) => n + m.nao_tomou, 0)} label="Não tomou" color="var(--warn)" /><Metric n={adherence.reduce((n, m) => n + m.semResposta, 0)} label="Sem resposta" color="var(--muted)" /></div>
        {adherence.reduce((n, m) => n + m.efeito_colateral, 0) > 0 && <div className="row" style={{ color: "var(--warn)", fontWeight: 600 }}><Icon name="alert" size={18} />{adherence.reduce((n, m) => n + m.efeito_colateral, 0)} relato(s) de efeito colateral</div>}</Surface>}
      <NavCard to={`/p/${patient.phone}/adesao`} icon="pill" title="Adesão por medicação" text="Gráfico por remédio e as respostas mais recentes." />
      <NavCard to={`/p/${patient.phone}/respostas-cuidados`} icon="list" title="Adesão por protocolo" text="Rotinas realizadas e relatos de reação a avaliar." badge={patient.pendingReactions} />
      <NavCard to={`/p/${patient.phone}/afericoes`} icon="gauge" title="Pressão arterial e glicemia" text="Registros por dia e os dias com valor fora da faixa." />
    </>}

    {adding && <Dialog title="O que você quer adicionar?" eyebrow={patient.name} onClose={() => setAdding(false)}>
      <Action icon="camera" title="Receita por foto" text="Envie a foto ou o PDF. Você confere antes de salvar." onClick={() => choose("receita")} />
      <Action icon="pill" title="Medicação" text="Cadastre à mão: nome, dose, horários e duração." onClick={() => choose("medicacao")} />
      <Action teal icon="gauge" title="Pedir aferição" text="Pressão arterial ou glicemia, de 1 a 3 vezes ao dia." onClick={() => choose("afericao")} />
      <Action teal icon="list" title="Protocolo de cuidados" text="Rotina com etapas escritas por você." onClick={() => choose("protocolo")} />
    </Dialog>}
    {editor && <MedicationEditor patient={patient} medication={editor.medication} onClose={(saved) => { setEditor(null); if (saved) { void load(); void reload(); } }} />}
    {measuring && <MeasurementEditor patient={patient} onClose={(saved) => { setMeasuring(false); if (saved) { setParams({ aba: "cuidados" }); void load(); } }} />}
    {deleting && <Confirm title="Excluir lembrete?" message={`Os próximos envios de ${deleting.medicationName} serão interrompidos. O registro será preservado no histórico.`} action="Excluir lembrete" busy={busy} onCancel={() => setDeleting(null)} onConfirm={() => removeMedication(deleting)} />}
    {canceling && <Confirm title="Cancelar aferição?" message="O paciente deixa de receber os pedidos de medir. Os valores já registrados continuam no acompanhamento." action="Cancelar aferição" busy={busy} onCancel={() => setCanceling(null)} onConfirm={() => cancelMeasurement(canceling)} />}
    {removing && <Confirm title={`Remover ${patient.name}?`} message={REMOVAL_MESSAGE} action="Remover paciente" busy={busy} onCancel={() => setRemoving(false)} onConfirm={removePatient} />}
  </div>;
}

export function DoseRow({ time, item, onEdit }: { time: string; item: DayItem; onEdit?: () => void }) {
  const [label, tone] = item.mine ? STATUS[item.status ?? "sem_resposta"] ?? STATUS.sem_resposta : ["Outro profissional", "" as const];
  const body = <><span className="round tnum" style={{ width: 52, fontSize: 16, color: "var(--blue)" }}>{time}</span>
    <div className="grow"><div style={{ fontWeight: 600 }}>{item.medicationName}</div><div className="muted small">{[item.dose, !item.mine ? item.doctorName : item.endDate ? `até ${Schedule.display(item.endDate)}` : null].filter(Boolean).join(" · ")}</div></div><Chip tone={tone}>{label}</Chip></>;
  return onEdit ? <button type="button" className="dose" onClick={onEdit} style={{ width: "100%", background: "none", border: 0, borderBottom: "1px solid var(--line)", textAlign: "left" }} aria-label={`Editar ${item.medicationName}`}>{body}</button> : <div className="dose">{body}</div>;
}
const WEEK_TONE: Record<WeekDay["estado"], [string, string, string]> = {
  ok: ["var(--ok-soft)", "var(--ok)", "tomou tudo"], parcial: ["var(--warn-soft)", "var(--warn)", "parte confirmada"], falhou: ["var(--bad-soft)", "var(--bad)", "nenhuma dose confirmada"],
  reacao: ["var(--bad-soft)", "var(--bad)", "relatou reação"], sem_doses: ["var(--fill)", "var(--muted)", "sem dose prevista"], pendente: ["var(--blue-soft)", "var(--blue)", "doses mais tarde"],
};
/** Últimos 7 dias. Cada quadrado diz, em texto para leitor de tela, o que a cor mostra. */
export function WeekStrip({ days }: { days: WeekDay[] }) {
  const weekday = (iso: string) => new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" }).format(new Date(iso + "T12:00:00Z")).replace(".", "");
  return <Surface><Eyebrow>Últimos 7 dias</Eyebrow>
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 6 }}>{days.map((d) => { const [bg, fg, text] = WEEK_TONE[d.estado];
      const detail = d.previstas ? `${d.tomou} de ${d.previstas - d.futuro} confirmadas${d.sem_resposta ? `, ${d.sem_resposta} sem resposta` : ""}` : "";
      return <li key={d.data} title={`${Schedule.display(d.data)}: ${text}${detail ? ` (${detail})` : ""}`} style={{ flex: "1 1 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", borderRadius: 14, background: bg, outline: d.hoje ? `2px solid ${fg}` : undefined }}>
        <span className="small muted" style={{ textTransform: "capitalize" }}>{weekday(d.data)}</span><span className="round tnum" style={{ fontSize: 17, color: fg }}>{d.data.slice(8)}</span>
        <span className="sr-only">{`${Schedule.display(d.data)}${d.hoje ? " (hoje)" : ""}: ${text}${detail ? `, ${detail}` : ""}`}</span></li>; })}</ul>
    <p className="muted small">Verde: tomou tudo. Laranja: parte. Vermelho: nenhuma dose confirmada ou reação. Cinza: sem dose prevista.</p>
  </Surface>;
}
const Metric = ({ n, label, color }: { n: number; label: string; color: string }) => <div><div className="round tnum" style={{ fontSize: 26, color }}>{n}</div><div className="small">{label}</div></div>;
function NavCard({ to, icon, title, text, badge }: { to: string; icon: string; title: string; text: string; badge?: number }) {
  return <Link to={to} className="surface" style={{ flexDirection: "row", alignItems: "center", color: "var(--ink)" }}>
    <div className="action" style={{ padding: 0, width: "auto", background: "none" }}><div className="ico"><Icon name={icon} size={22} /></div></div>
    <div className="grow"><div className="row" style={{ gap: 8 }}><b>{title}</b>{!!badge && <Chip tone="warn">{badge}</Chip>}</div><div className="muted" style={{ fontSize: 14 }}>{text}</div></div><span className="muted"><Icon name="chev" size={16} /></span></Link>;
}
function Action({ icon, title, text, onClick, teal }: { icon: string; title: string; text: string; onClick: () => void; teal?: boolean }) {
  return <button type="button" className="action" onClick={onClick}><div className={`ico ${teal ? "teal" : ""}`}><Icon name={icon} size={22} /></div><div className="grow"><div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div><div className="muted small">{text}</div></div><span className="muted"><Icon name="chev" size={16} /></span></button>;
}
