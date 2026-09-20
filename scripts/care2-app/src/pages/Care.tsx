import { useCallback, useEffect, useState } from "react";
import { api, errorText } from "../api";
import { CARE_AUTHORSHIP, Weekdays, careCopyForPatient, careScheduleValidation, hasWeeklyRoutines, newCareDraft, newRoutine, patientReads, readCareDraft, type CareDraft, type CarePlan, type CareRoutine, type Patient } from "../models";
import { Button, Confirm, Dialog, Eyebrow, Field, Icon, Notice, Surface, TextArea } from "../ui";
import { useApp } from "../App";

type List = { items: { id: number; data: unknown; isTemplate: boolean }[]; deliveryAvailable: boolean };
type Editing = { plan?: CarePlan; source?: CareDraft; template: boolean };
const summary = (r: CareRoutine) => `${r.name} · ${r.time} · ${Weekdays.summary(r.weekdays)}`;

/** Protocolos do paciente e a biblioteca privada de modelos, dentro da aba Cuidados. */
export function CareSection({ patient, openNew, onConsumed }: { patient: Patient; openNew: number; onConsumed: () => void }) {
  const [plans, setPlans] = useState<CarePlan[]>([]), [templates, setTemplates] = useState<CarePlan[]>([]);
  const [available, setAvailable] = useState(true), [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [deleting, setDeleting] = useState<CarePlan | null>(null), [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const read = (l: List) => l.items.map((i) => ({ id: i.id, isTemplate: i.isTemplate, data: readCareDraft(i.data) }));
      const p = await api<List>(`/care-protocols?phone=${patient.phone}&supportsWeekdays=true`), t = await api<List>("/care-protocols?templates=true&supportsWeekdays=true");
      setPlans(read(p)); setTemplates(read(t)); setAvailable(p.deliveryAvailable); setError(null);
    } catch (e) { setError(errorText(e)); }
  }, [patient.phone]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (openNew > 0) { setEditing({ template: false }); onConsumed(); } }, [openNew]); // eslint-disable-line react-hooks/exhaustive-deps
  async function remove(p: CarePlan) { setBusy(true); try { await api(`/care-protocols/${p.id}`, { method: "DELETE" }); await load(); } catch (e) { setError(errorText(e)); } setDeleting(null); setBusy(false); }
  const card = (p: CarePlan, actions: React.ReactNode) => <Surface key={p.id} style={{ gap: 10 }}><b>{p.data.name}</b><div className="muted" style={{ fontSize: 14, whiteSpace: "pre-line" }}>{p.data.routines.map(summary).join("\n")}</div><div className="row wrap" style={{ gap: 18 }}>{actions}</div></Surface>;
  return <>
    <div className="row between wrap" style={{ marginTop: 8 }}><Eyebrow>Protocolos de cuidados</Eyebrow><Button icon="plus" onClick={() => setEditing({ template: false })}>Criar protocolo</Button></div>
    <Notice>{error}</Notice>
    {!available && <Notice tone="warn">Envio pelo WhatsApp aguardando configuração do modelo de mensagem. Os protocolos ficam salvos, mas ainda não serão enviados.</Notice>}
    {plans.length === 0 && <p className="muted">Nenhum protocolo cadastrado para este paciente.</p>}
    <div className="grid2">{plans.map((p) => card(p, <><button className="link" onClick={() => setEditing({ plan: p, template: false })}>Editar</button><button className="link danger" onClick={() => setDeleting(p)}>Excluir</button></>))}</div>
    <div className="row between wrap" style={{ marginTop: 8 }}><Eyebrow>Sua biblioteca de modelos</Eyebrow><button className="link" onClick={() => setEditing({ template: true })}>Criar modelo na biblioteca</button></div>
    <p className="muted small">Sua biblioteca é privada. Aplicar cria uma cópia para personalizar neste paciente.</p>
    {templates.length === 0 && <p className="muted">Salve seu primeiro modelo para reutilizar as rotinas.</p>}
    <div className="grid2">{templates.map((p) => card(p, <><button className="link" onClick={() => setEditing({ source: p.data, template: false })}>Aplicar e personalizar</button><button className="link" onClick={() => setEditing({ plan: p, template: true })}>Editar modelo</button><button className="link danger" onClick={() => setDeleting(p)}>Excluir</button></>))}</div>
    {editing && <CareEditor patient={patient} {...editing} onClose={(saved) => { setEditing(null); if (saved) void load(); }} />}
    {deleting && <Confirm title={`Excluir ${deleting.isTemplate ? "modelo" : "protocolo"}?`} message="Os próximos envios deste protocolo serão interrompidos. Excluir um modelo não altera os protocolos já aplicados." action="Excluir" busy={busy} onCancel={() => setDeleting(null)} onConfirm={() => remove(deleting)} />}
  </>;
}

function CareEditor({ patient, plan, source, template, onClose }: Editing & { patient: Patient; onClose: (saved: boolean) => void }) {
  const { session } = useApp();
  const [draft, setDraft] = useState<CareDraft>(() => (plan ? structuredClone(plan.data) : source ? careCopyForPatient(source) : newCareDraft()));
  const [saveTemplate, setSaveTemplate] = useState(false), [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const routine = (i: number, patch: Partial<CareRoutine>) => setDraft({ ...draft, routines: draft.routines.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const moveStep = (i: number, j: number, to: number) => { const steps = [...draft.routines[i].steps]; [steps[j], steps[to]] = [steps[to], steps[j]]; routine(i, { steps }); };
  async function save() {
    if (busy) return;
    const invalid = careScheduleValidation(draft); if (invalid) return setError(invalid);
    setBusy(true); setError(null);
    try { await api(plan ? `/care-protocols/${plan.id}` : "/care-protocols", { method: plan ? "PATCH" : "POST", body: { ...draft, phone: patient.phone, isTemplate: template, saveAsTemplate: saveTemplate } }); onClose(true); }
    catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  const author = patientReads(session.doctor.name ?? "", session.doctor.profissao);
  return <>
    <Dialog wide title={plan ? (template ? "Editar modelo" : "Editar protocolo") : template ? "Novo modelo" : "Novo protocolo"} eyebrow={template ? "Sua biblioteca" : patient.name} onClose={() => onClose(false)} locked={busy}>
      <Field label="Nome do protocolo" placeholder="Ex.: Rotina de skincare" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} hint="Escreva apenas os cuidados definidos por você." />
      {draft.routines.map((r, i) => <div key={r.id} className="stack" style={{ background: "var(--bg)", borderRadius: 20, padding: 16, gap: 12 }}>
        <div className="row between"><b>Rotina {i + 1}</b>{draft.routines.length > 1 && <button className="link danger" onClick={() => setDraft({ ...draft, routines: draft.routines.filter((_, j) => j !== i) })}>Excluir rotina</button>}</div>
        <div className="row wrap" style={{ alignItems: "flex-start" }}><div style={{ flex: "2 1 220px" }}><label className="field"><span>Nome da rotina</span><input className="input" style={{ background: "var(--surface)" }} placeholder="Ex.: Rotina da manhã" value={r.name} onChange={(e) => routine(i, { name: e.target.value })} /></label></div>
          <label className="field" style={{ flex: "0 1 140px" }}><span>Horário</span><input type="time" style={{ background: "var(--surface)" }} value={r.time} onChange={(e) => routine(i, { time: e.target.value })} /></label></div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend className="row between" style={{ width: "100%", fontSize: 14, fontWeight: 500, marginBottom: 8 }}><span>Repetir</span><span style={{ color: "var(--blue)" }}>{Weekdays.summary(r.weekdays)}</span></legend>
          <div className="row wrap" style={{ gap: 6 }}>{[1, 2, 3, 4, 5, 6, 0].map((d) => { const on = r.weekdays.includes(d); return <button key={d} type="button" className={`pill ${on ? "on" : ""}`} aria-pressed={on} aria-label={Weekdays.labels[d]} onClick={() => routine(i, { weekdays: (on ? r.weekdays.filter((x) => x !== d) : [...r.weekdays, d]).sort() })}>{Weekdays.labels[d].slice(0, 3)}</button>; })}</div>
          {r.weekdays.length === 0 && <div className="small" style={{ color: "var(--warn)", marginTop: 6 }}>Selecione pelo menos um dia para esta rotina.</div>}</fieldset>
        {r.steps.map((s, j) => <div key={j} className="row" style={{ alignItems: "flex-start", gap: 6 }}><span className="muted tnum" style={{ width: 20, paddingTop: 14 }}>{j + 1}</span>
          <textarea className="input grow" style={{ background: "var(--surface)", minHeight: 48, resize: "vertical" }} rows={2} placeholder={`Etapa ${j + 1}`} aria-label={`Etapa ${j + 1}`} value={s} onChange={(e) => routine(i, { steps: r.steps.map((x, k) => (k === j ? e.target.value : x)) })} />
          <button className="btn plain icon" style={{ width: 44, minHeight: 44 }} aria-label="Mover etapa para cima" disabled={j === 0} onClick={() => moveStep(i, j, j - 1)}><Icon name="up" size={16} /></button>
          <button className="btn plain icon" style={{ width: 44, minHeight: 44 }} aria-label="Mover etapa para baixo" disabled={j === r.steps.length - 1} onClick={() => moveStep(i, j, j + 1)}><Icon name="down" size={16} /></button>
          <button className="btn plain icon" style={{ width: 44, minHeight: 44, color: "var(--bad)" }} aria-label="Excluir etapa" disabled={r.steps.length === 1} onClick={() => routine(i, { steps: r.steps.filter((_, k) => k !== j) })}><Icon name="trash" size={16} /></button></div>)}
        <button className="link" style={{ alignSelf: "flex-start" }} disabled={r.steps.length >= 20} onClick={() => routine(i, { steps: [...r.steps, ""] })}>Adicionar etapa</button>
      </div>)}
      <button className="link" style={{ alignSelf: "flex-start" }} disabled={draft.routines.length >= 12} onClick={() => setDraft({ ...draft, routines: [...draft.routines, newRoutine()] })}>Adicionar rotina</button>
      <label className="field"><span>Duração</span><select value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })}><option value="">Escolha</option><option value="continuous">Contínuo</option><option value="days">Quantidade de dias</option><option value="date">Data final</option></select></label>
      {draft.duration === "days" && <Field label={hasWeeklyRoutines(draft) ? "Quantidade de dias corridos" : "Quantidade de dias"} placeholder="1 a 999" inputMode="numeric" value={draft.days ?? ""} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 3); setDraft({ ...draft, days: d ? Number(d) : null }); }} hint={hasWeeklyRoutines(draft) ? "A duração conta dias corridos a partir do início. Os lembretes serão enviados somente nos dias da semana selecionados." : undefined} />}
      {draft.duration === "date" && <Field label="Último dia" type="date" value={draft.endDate ?? ""} onChange={(e) => setDraft({ ...draft, endDate: e.target.value || null })} />}
      <span className="muted small">Horários de Brasília. O término inclui o último dia.</span>
      <TextArea label="Orientação ao paciente" placeholder="Será incluída em cada mensagem" value={draft.instructions} onChange={(e) => setDraft({ ...draft, instructions: e.target.value })} />
      {!template && <TextArea label="Observação interna (opcional)" placeholder="Visível somente para você. Não é enviada ao paciente nem copiada para o modelo." value={draft.internalNote} onChange={(e) => setDraft({ ...draft, internalNote: e.target.value })} />}
      {!plan && !template && <label className="row"><input type="checkbox" checked={saveTemplate} onChange={(e) => setSaveTemplate(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)" }} />Salvar também como modelo</label>}
      <p className="muted small">{CARE_AUTHORSHIP}</p>
      <Notice>{error}</Notice>
      <div className="row wrap"><Button className="plain" onClick={() => setPreview(true)}>Prévia das mensagens</Button><div className="grow"><Button className="big" icon="check" busy={busy} onClick={save}>{template ? "Salvar modelo" : "Salvar protocolo"}</Button></div></div>
    </Dialog>
    {preview && <Dialog title="Mensagem ao paciente" onClose={() => setPreview(false)}>{draft.routines.map((r) => <div key={r.id} className="stack" style={{ background: "var(--bg)", borderRadius: 18, padding: 16, gap: 6 }}>
      <b>{r.time} · {r.name}</b><span className="muted small">{Weekdays.summary(r.weekdays)}</span>
      <p>Olá, {patient.name}. Este é o momento do seu protocolo de cuidados <b>{draft.name}</b> — {r.name}, cadastrado por <b>{author}</b>.</p>
      {r.steps.map((s, i) => <div key={i}>{i + 1}. {s}</div>)}{draft.instructions && <p>{draft.instructions}</p>}
      <span className="muted small">Realizei · Não consegui realizar · Tive alguma reação</span></div>)}</Dialog>}
  </>;
}
