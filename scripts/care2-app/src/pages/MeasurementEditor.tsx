import { useState } from "react";
import { api, errorText } from "../api";
import { Schedule, type Patient } from "../models";
import { Button, Dialog, Field, Icon, Notice, Option, Segmented, useLoad } from "../ui";

// [PEDIR-AFERICAO] Mesmo padrão da medicação: o que medir, quantas vezes por dia, por quanto tempo, e a prévia do que o paciente recebe.
export default function MeasurementEditor({ patient, onClose, programType }: { patient: Patient; onClose: (saved: boolean) => void; programType?: "pressao"|"glicemia" }) {
  const [delivery, setDelivery] = useState<boolean | null>(null);
  const [type, setType] = useState(programType??"pressao");
  const [times, setTimes] = useState<string[]>(programType?[""]:[]);
  const [duration, setDuration] = useState(programType?"continuous":""), [days, setDays] = useState(""), [endDate, setEndDate] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => { try { const c = await api<{ measurementDelivery: boolean }>("/care-capabilities"); if (alive()) setDelivery(c.measurementDelivery); } catch { /* sem aviso */ } }, []);
  async function save() {
    if (busy) return;
    if (!times.length || !times.every(Schedule.valid) || new Set(times).size !== times.length) return setError(programType?"Preencha os horários sem repetir nenhum.":"Escolha quantas vezes por dia e confira os horários.");
    let end = "";
    if (duration === "days") { const d = Number(days); if (!Number.isInteger(d) || d < 1 || d > 999) return setError("Informe de 1 a 999 dias."); end = Schedule.end(Schedule.today(), d); }
    else if (duration === "date") { if (!Schedule.validDate(endDate) || endDate < Schedule.today()) return setError("Escolha uma data final de hoje em diante."); end = endDate; }
    else if (duration !== "continuous") return setError("Escolha por quanto tempo.");
    setBusy(true); setError(null);
    try { await api(`/patients/${patient.phone}/medicoes-agendadas`, { method: "POST", body: { tipo: type, patientName: patient.name, scheduleTimes: [...times].sort().join(","), startDate: Schedule.today(), endDate: end } }); onClose(true); }
    catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  const first = patient.name.split(" ")[0] || "paciente";
  return <Dialog wide title={programType?`Horários ${programType==='glicemia'?'da glicemia':'da pressão'}`:"Pedir aferição"} eyebrow={patient.name} onClose={() => onClose(false)} locked={busy}>
    {delivery === false && <Notice tone="warn">O pedido fica salvo, mas o envio pelo WhatsApp depende de configuração da clínica.</Notice>}
    {programType?<><p>Use os horários orientados pela sua equipe de saúde.</p>{times.map((t,i)=><div className="row" key={i}><Field label={`Horário ${i+1}`} type="time" value={t} onChange={e=>setTimes(times.map((x,j)=>j===i?e.target.value:x))}/>{times.length>1&&<button className="link" onClick={()=>setTimes(times.filter((_,j)=>j!==i))}>Remover</button>}</div>)}<Button className="plain" disabled={times.length>=6} onClick={()=>setTimes([...times,""])}>Adicionar outro horário</Button><Field label="Até quando? (opcional)" type="date" min={Schedule.today()} value={endDate} onChange={e=>{setEndDate(e.target.value);setDuration(e.target.value?'date':'continuous');}}/><p className="muted small">O lembrete se repete todos os dias nesses horários. Sem data final, continua até você pausar.</p></>:<>
    <b>O que medir?</b>
    <div className="row"><Option on={type === "pressao"} icon="heart" onClick={() => setType("pressao")}>Pressão arterial</Option><Option on={type === "glicemia"} icon="drop" onClick={() => setType("glicemia")}>Glicemia</Option></div>
    <b>Quantas vezes por dia?</b>
    <Segmented label="Vezes por dia" value={times.length || null} onChange={(n) => setTimes(Schedule.measurementTimes(n))} options={[1, 2, 3].map((n) => ({ value: n, label: `${n}×` }))} />
    {times.length === 0 ? <span className="muted small">Escolha a frequência. Os horários aparecem em seguida.</span>
      : <><div className="row wrap">{times.map((t, i) => <label key={i} className="field" style={{ flex: "0 1 130px" }}><span className="muted small">Horário {i + 1}</span><input type="time" value={t} onChange={(e) => setTimes(times.map((x, j) => (j === i ? e.target.value : x)))} /></label>)}</div><span className="muted small">Horários sugeridos, no horário de Brasília.</span></>}
    <b>Por quanto tempo?</b>
    <div className="row"><Option on={duration === "continuous"} icon="repeat" onClick={() => setDuration("continuous")}>Uso contínuo</Option><Option on={duration === "days"} icon="calendar" onClick={() => setDuration("days")}>Por alguns dias</Option><Option on={duration === "date"} icon="check" onClick={() => setDuration("date")}>Até uma data</Option></div>
    {duration === "days" && <><div className="row wrap">{Schedule.quickDays.map((n) => <button key={n} type="button" className={`pill ${days === String(n) ? "on" : ""}`} onClick={() => setDays(String(n))}>{n} dias</button>)}</div>
      <Field label="Quantidade de dias" placeholder="De 1 a 999" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, "").slice(0, 3))} hint={Number(days) >= 1 ? `Até ${Schedule.display(Schedule.end(Schedule.today(), Number(days)))}` : undefined} /></>}
    {duration === "date" && <Field label="Último dia" type="date" min={Schedule.today()} value={endDate} onChange={(e) => setEndDate(e.target.value)} />}
    </>}
    <div className="stack" style={{ gap: 8, background: "var(--bg)", borderRadius: 18, padding: 16 }}>
      <div className="row muted small" style={{ fontWeight: 600 }}><Icon name="wa" size={16} />O paciente recebe, em cada horário</div>
      <div style={{ background: "var(--surface)", borderRadius: 12, padding: 12, fontSize: 14 }}>Olá, {first}. Está na hora de medir sua {type === "pressao" ? "pressão" : "glicemia"}. {type === "pressao" ? "Por exemplo: 12 por 8 ou 120/80." : "Por exemplo: 110."}</div>
      <span className="muted small">A resposta vale por 6 horas depois do pedido e fica registrada em Acompanhar. Valor fora da faixa gera aviso ao paciente para procurar atendimento, sem diagnóstico.</span>
    </div>
    <Notice>{error}</Notice>
    <Button className="big" icon="send" busy={busy} onClick={save}>{programType?"Salvar horários":"Pedir aferição"}</Button>
  </Dialog>;
}
