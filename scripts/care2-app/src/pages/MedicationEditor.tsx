import { useState } from "react";
import { api, errorText } from "../api";
import { MedicationNames, Schedule, Weekdays, draftBody, draftFromMedication, draftPatch, emptyDraft, medicationState, timesOf, validateDraft, type Draft, type ExistingMedication, type Medication, type Patient, type SharedMedication } from "../models";
import { Button, Confirm, Dialog, Field, Notice, Option, Segmented, TextArea, useLoad } from "../ui";

/** Campos de uma medicação. Usados no cadastro à mão e na conferência da receita. */
export function MedicationFields({ draft, onChange, start = Schedule.today() }: { draft: Draft; onChange: (d: Draft) => void; start?: string }) {
  // Qualquer edição desfaz o "conferi": a conferência vale para o que está escrito agora.
  const set = (patch: Partial<Draft>) => onChange({ ...draft, ...patch, reviewed: false });
  const frequency = draft.times.filter(Boolean).length === draft.times.length ? draft.times.length : 0;
  return <div className="stack">
    {draft.source && <div className="notice info" style={{ display: "block" }}><div className="eyebrow" style={{ color: "inherit" }}>Como está na receita</div>{draft.source}</div>}
    {draft.motivos.length > 0 && <Notice tone="warn">{draft.motivos.join(" ")}</Notice>}
    <div className="row wrap" style={{ alignItems: "flex-start" }}>
      <div style={{ flex: "2 1 240px" }}><Field label="Medicação" placeholder="Nome como está na receita" value={draft.name} onChange={(e) => set({ name: e.target.value })} /></div>
      <div style={{ flex: "1 1 160px" }}><Field label="Dose" placeholder="Ex.: 1 comprimido" value={draft.dose} onChange={(e) => set({ dose: e.target.value })} /></div>
    </div>
    <div className="stack" style={{ gap: 8 }}><b>Quantas vezes ao dia?</b>
      <Segmented label="Vezes ao dia" value={frequency || null} onChange={(n) => { if (n !== draft.times.length || draft.times.includes("")) set({ times: Schedule.defaultTimes(n) }); }} options={[1, 2, 3, 4].map((n) => ({ value: n, label: `${n}×` }))} />
      <div className="row wrap" style={{ alignItems: "flex-end" }}>{draft.times.map((t, i) => <label key={i} className="field" style={{ flex: "0 1 130px" }}><span className="muted small">Horário {i + 1}</span>
        <input type="time" value={t} onChange={(e) => set({ times: draft.times.map((x, j) => (j === i ? e.target.value : x)) })} /></label>)}
        {draft.times.length < 8 && <button type="button" className="link" style={{ minHeight: 48 }} onClick={() => set({ times: [...draft.times, ""] })}>Outro horário</button>}
        {draft.times.length > 1 && <button type="button" className="link danger" style={{ minHeight: 48 }} onClick={() => set({ times: draft.times.slice(0, -1) })}>Remover último</button>}</div>
      <span className="muted small">Horários sugeridos, no horário de Brasília. Ajuste um a um se precisar.</span></div>
    <div className="stack" style={{ gap: 8 }}><div className="row between"><b>Em quais dias?</b><span className="small" style={{ color: "var(--blue)", fontWeight: 600 }}>{Weekdays.summary(draft.weekdays)}</span></div>
      <div className="row wrap" style={{ gap: 6 }}>{[1, 2, 3, 4, 5, 6, 0].map((d) => { const on = draft.weekdays.includes(d); return <button key={d} type="button" className={`pill ${on ? "on" : ""}`} aria-pressed={on} aria-label={Weekdays.labels[d]} onClick={() => set({ weekdays: (on ? draft.weekdays.filter((x) => x !== d) : [...draft.weekdays, d]).sort() })}>{Weekdays.labels[d].slice(0, 3)}</button>; })}
        {draft.weekdays.length < 7 && <button type="button" className="link" onClick={() => set({ weekdays: [0, 1, 2, 3, 4, 5, 6] })}>Todos os dias</button>}</div>
      <span className="muted small">Todos os dias é o padrão. Desmarque para "toda segunda", por exemplo.</span></div>
    <div className="stack" style={{ gap: 8 }}><b>Por quanto tempo?</b>
      <div className="row"><Option on={draft.duration === "continuous"} icon="repeat" onClick={() => set({ duration: "continuous" })}>Uso contínuo</Option><Option on={draft.duration === "days"} icon="calendar" onClick={() => set({ duration: "days" })}>Por alguns dias</Option><Option on={draft.duration === "date"} icon="check" onClick={() => set({ duration: "date" })}>Até uma data</Option></div>
      {draft.duration === "days" && <><div className="row wrap">{Schedule.quickDays.map((n) => <button key={n} type="button" className={`pill ${draft.days === String(n) ? "on" : ""}`} onClick={() => set({ days: String(n) })}>{n} dias</button>)}</div>
        <Field label="Quantidade de dias" placeholder="De 1 a 999" inputMode="numeric" value={draft.days} onChange={(e) => set({ days: e.target.value.replace(/\D/g, "").slice(0, 3) })} hint={Number(draft.days) >= 1 ? `Até ${Schedule.display(Schedule.end(start, Number(draft.days)))}${start === Schedule.today() ? ", contando hoje." : `, contando desde ${Schedule.display(start)}.`}` : undefined} /></>}
      {draft.duration === "date" && <Field label="Último dia" type="date" min={Schedule.today()} value={draft.endDate} onChange={(e) => set({ endDate: e.target.value })} />}</div>
    <TextArea label="Orientação (opcional)" placeholder="Ex.: tomar após o café" value={draft.instructions} onChange={(e) => set({ instructions: e.target.value })} />
    {draft.requiresReview && <label className="notice info" style={{ alignItems: "center", cursor: "pointer" }}><input type="checkbox" checked={draft.reviewed} onChange={(e) => onChange({ ...draft, reviewed: e.target.checked })} style={{ width: 22, height: 22, accentColor: "var(--blue)", flexShrink: 0 }} /><span style={{ fontWeight: 500 }}>Conferi nome, dose, horários e duração com a receita</span></label>}
    <Notice>{draft.error}</Notice>
  </div>;
}

/** O que já existe para o telefone, próprio ou de outro profissional: só para avisar duplicidade. */
export async function loadExisting(patient: Patient, exceptId?: number): Promise<ExistingMedication[]> {
  const out: ExistingMedication[] = [];
  try { const s = await api<{ medications?: Medication[] }>(`/patients/${patient.phone}/summary`); for (const m of s.medications ?? []) if (m.isMine && medicationState(m) === "Em acompanhamento" && m.id !== exceptId) out.push({ name: m.medicationName, times: timesOf(m) }); } catch { /* aviso é opcional */ }
  try { const o = await api<{ items: SharedMedication[] }>(`/patients/${patient.phone}/shared-medications`); for (const m of o.items ?? []) out.push({ name: m.medicationName, times: timesOf(m), owner: m.doctorName ?? "outro profissional" }); } catch { /* idem */ }
  return out;
}

export default function MedicationEditor({ patient, medication, onClose }: { patient: Patient; medication?: Medication; onClose: (saved: boolean) => void }) {
  const [draft, setDraft] = useState<Draft>(() => (medication ? draftFromMedication(medication) : emptyDraft()));
  const [existing, setExisting] = useState<ExistingMedication[]>([]);
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useLoad(async (alive) => { const e = await loadExisting(patient, medication?.id); if (alive()) setExisting(e); }, [patient.phone]);
  async function save(force = false) {
    if (busy) return;
    const invalid = validateDraft(draft); if (invalid) { setDraft({ ...draft, error: invalid }); return; }
    if (!force) { const dups = MedicationNames.duplicates(draft.name, existing); if (dups.length) { setDuplicate(dups.map((d) => MedicationNames.describe(d)).join("\n") + "\nO paciente receberia lembretes repetidos."); return; } }
    setBusy(true); setDuplicate(null);
    try {
      if (medication) await api(`/medications/${medication.id}`, { method: "PATCH", body: draftPatch(draft, medication) });
      else await api("/medications", { method: "POST", body: draftBody(draft, patient) });
      onClose(true);
    } catch (e) { setDraft({ ...draft, error: errorText(e) }); } finally { setBusy(false); }
  }
  return <>
    <Dialog wide title={medication ? "Editar medicação" : "Nova medicação"} eyebrow={patient.name} onClose={() => onClose(false)} locked={busy}>
      <p className="muted">Transcreva a orientação prescrita. O Vytal Care envia o lembrete; ele não sugere dose nem horário clínico.</p>
      <MedicationFields draft={draft} start={medication?.startDate ? medication.startDate.slice(0, 10) : undefined} onChange={(d) => setDraft({ ...d, error: undefined })} />
      <Button className="big" icon="check" busy={busy} onClick={() => save()}>{medication ? "Salvar alterações" : "Salvar medicação"}</Button>
    </Dialog>
    {duplicate && <Confirm title="Medicação já cadastrada" message={duplicate} action="Salvar mesmo assim" onCancel={() => setDuplicate(null)} onConfirm={() => save(true)} busy={busy} />}
  </>;
}
