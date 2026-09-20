import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorText } from "../api";
import { Schedule, type AdherenceMedication, type CareReply, type Followup, type Patient } from "../models";
import { Button, Chip, Eyebrow, Icon, Notice, Segmented, Spinner, Surface } from "../ui";
import { PatientMissing, usePatient } from "./Patient";
import { useApp } from "../App";

const PERIODS = [7, 30, 90].map((n) => ({ value: n, label: `${n} dias` }));
function Header({ patient, title, text }: { patient: Patient; title: string; text: string }) {
  return <><Link to={`/p/${patient.phone}?aba=acompanhar`} className="row small" style={{ gap: 4, fontWeight: 600 }}><Icon name="back" size={16} />{patient.name}</Link><h1>{title}</h1><p className="muted">{text}</p></>;
}
/** Carrega por período, descarta resposta de período antigo e atualiza a cada minuto com a aba visível. */
function usePeriodic<T>(path: (days: number) => string, days: number) {
  const [data, setData] = useState<T | null>(null), [error, setError] = useState<string | null>(null), [loading, setLoading] = useState(true);
  const load = useCallback(async (alive: () => boolean = () => true) => {
    setLoading(true);
    try { const r = await api<T>(path(days)); if (alive()) { setData(r); setError(null); } } catch (e) { if (alive()) setError(errorText(e)); }
    if (alive()) setLoading(false);
  }, [days]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let on = true; setData(null); void load(() => on);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void load(() => on); }, 60000);
    return () => { on = false; clearInterval(timer); };
  }, [load]);
  return { data, error, loading, reload: () => load() };
}

export function AdherencePage() { const p = usePatient(); return p ? <Adherence key={p.phone} patient={p} /> : <PatientMissing />; }
function Adherence({ patient }: { patient: Patient }) {
  const [days, setDays] = useState(30);
  const { data, error, loading, reload } = usePeriodic<{ resumo: AdherenceMedication[] }>((d) => `/patients/${patient.phone}/adesao?dias=${d}`, days);
  const reply = (v?: string) => (v === "tomou" ? "Tomou" : v === "nao_tomou" ? "Não tomou" : v === "efeito_colateral" ? "Efeito colateral" : "Resposta registrada");
  return <div className="page">
    <Header patient={patient} title="Cada resposta conta." text="Acompanhe o que o paciente informa ao responder aos lembretes." />
    <Segmented label="Período" value={days} onChange={setDays} options={PERIODS} />
    {loading && !data && <div className="row muted"><Spinner />Carregando respostas…</div>}
    <Notice>{error}</Notice>{error && <button className="link" onClick={reload}>Tentar novamente</button>}
    {data && data.resumo.length === 0 && <Surface><b>Sem dados neste período</b><p className="muted">Os resultados aparecem conforme os lembretes são programados e o paciente responde.</p></Surface>}
    <div className="grid2">{data?.resumo.map((m, i) => { const max = Math.max(1, m.esperadas, m.tomou, m.nao_tomou, m.semResposta); return <Surface key={i}>
      <div><b style={{ fontSize: 17 }}>{m.medicationName || "Medicação"}</b><div className="muted" style={{ fontSize: 14 }}>{m.esperadas} doses esperadas no período</div></div>
      {([["Tomou", m.tomou, "var(--teal)"], ["Não tomou", m.nao_tomou, "var(--warn)"], ["Sem resposta", m.semResposta, "var(--muted)"]] as [string, number, string][]).map(([label, n, color]) => <div key={label} className="row" style={{ gap: 10 }}><span className="small" style={{ width: 92 }}>{label}</span><div className="bar grow" role="img" aria-label={`${label}: ${n}`}><div style={{ width: `${(n / max) * 100}%`, background: color }} /></div><b className="tnum" style={{ width: 32, textAlign: "right", color }}>{n}</b></div>)}
      {m.efeito_colateral > 0 && <div className="row" style={{ color: "var(--warn)", fontWeight: 600, fontSize: 14 }}><Icon name="alert" size={18} />{m.efeito_colateral} relato(s) de efeito colateral</div>}
      {m.ultima?.createdAt && <div className="small" style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>Resposta mais recente: {reply(m.ultima.resposta)}<div className="muted">{Schedule.dateTime(m.ultima.createdAt)} · Brasília</div></div>}
    </Surface>; })}</div>
    {data && <><p className="muted small">Sem resposta significa que não houve confirmação registrada; não significa que o paciente deixou de tomar. Relatos de efeitos colaterais são contabilizados separadamente.</p>
      <p className="muted small">Contagens calculadas pelo servidor, com até 500 eventos disponíveis por paciente. Esta visão não é monitoramento em tempo real.</p></>}
  </div>;
}

export function MeasurementsPage() { const p = usePatient(); return p ? <Measurements key={p.phone} patient={p} /> : <PatientMissing />; }
const LEVEL: Record<string, string> = { normal: "var(--teal)", alterada: "var(--warn)", alerta: "var(--bad)" };
function Measurements({ patient }: { patient: Patient }) {
  const [days, setDays] = useState(30);
  const { data, error, loading } = usePeriodic<Followup>((d) => `/patients/${patient.phone}/acompanhamento?dias=${d}`, days);
  const f = data?.faixa;
  // Sistólica por registro, do mais antigo ao mais novo: só desenha o que o paciente respondeu.
  const systolic = (data?.porDia ?? []).flatMap((d) => d.itens.filter((i) => i.tipo === "pressao").map((i) => ({ day: d.data, v: Number(i.valor.match(/^(\d{2,3})/)?.[1]) }))).filter((p) => p.v > 0).reverse();
  return <div className="page">
    <Header patient={patient} title="Pressão e glicemia" text="O que o paciente registrou pelo WhatsApp, por dia. Os dias em que algum valor saiu da faixa ficam marcados." />
    <Segmented label="Período" value={days} onChange={setDays} options={PERIODS} />
    {loading && !data && <div className="row muted"><Spinner />Carregando registros…</div>}
    <Notice>{error}</Notice>
    {data && <>
      <div className="row wrap" style={{ alignItems: "stretch" }}>{([["Pressão", data.resumo?.pressao], ["Glicemia", data.resumo?.glicemia]] as const).map(([title, k]) => <div key={title} className="tile"><span className="eyebrow">{title}</span><b>{k?.total ?? 0}</b><span className="muted small">registros · {k?.alteradas ?? 0} fora da faixa{k?.alertas ? ` · ${k.alertas} em alerta` : ""}</span>{k?.ultima && <span className="small">Último: {k.ultima.valor}</span>}</div>)}</div>
      {!!data.diasComAlteracao?.length && <Notice tone="warn"><b>{data.diasComAlteracao.length === 1 ? "1 dia com valor fora da faixa" : `${data.diasComAlteracao.length} dias com valor fora da faixa`}</b>{"\n"}{data.diasComAlteracao.slice(0, 12).map(Schedule.display).join(" · ")}</Notice>}
      <div className="split">
        <div className="grow stack">
          {data.porDia.length === 0 && <Surface><b>Sem registros neste período</b><p className="muted">Os valores aparecem conforme o paciente responde às aferições pedidas.</p></Surface>}
          {data.porDia.map((d) => <Surface key={d.data} style={{ gap: 8, padding: 16, background: d.alterado ? "var(--warn-soft)" : undefined }}>
            <div className="row"><b className="tnum">{Schedule.display(d.data)}</b>{d.alterado && <Chip tone="warn">Dia alterado</Chip>}</div>
            {d.itens.map((i) => <div key={i.id} className="row" style={{ gap: 10 }}><span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 5, background: LEVEL[i.nivel ?? ""] ?? "var(--muted)", flexShrink: 0 }} />
              <span style={{ fontWeight: 600, width: 76 }}>{i.tipo === "glicemia" ? "Glicemia" : "Pressão"}</span><span className="tnum grow">{i.valor}</span>
              {i.motivo && <span className="small" style={{ color: LEVEL[i.nivel ?? ""] }}>{i.motivo}</span>}{i.medidoEm && <span className="muted small tnum">{Schedule.time(i.medidoEm)}</span>}</div>)}
          </Surface>)}
        </div>
        <div className="side stack">
          {systolic.length >= 2 && <Surface><Eyebrow>Pressão sistólica</Eyebrow><SystolicChart points={systolic} limit={f?.pressaoSistolica ?? 140} /></Surface>}
          {f && <Surface><Eyebrow>Faixa de acompanhamento</Eyebrow><p className="small">Pressão até {f.pressaoSistolica}/{f.pressaoDiastolica} mmHg. Glicemia entre {f.glicemiaBaixa} e {f.glicemiaAlta} mg/dL.</p><p className="muted small">Os limites vêm do servidor e só marcam o dia. Esta tela não interpreta nem diagnostica.</p></Surface>}
        </div>
      </div></>}
  </div>;
}
function SystolicChart({ points, limit }: { points: { day: string; v: number }[]; limit: number }) {
  const W = 300, H = 160, pad = 12, lo = Math.min(90, ...points.map((p) => p.v)) - 5, hi = Math.max(limit + 20, ...points.map((p) => p.v)) + 5;
  const x = (i: number) => pad + (i * (W - 2 * pad)) / (points.length - 1), y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - 2 * pad);
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Pressão sistólica em ${points.length} registros; ${points.filter((p) => p.v >= limit).length} a partir de ${limit}`}>
    <rect x={pad} y={y(hi)} width={W - 2 * pad} height={y(limit) - y(hi)} fill="var(--bad-soft)" />
    <line x1={pad} x2={W - pad} y1={y(limit)} y2={y(limit)} stroke="var(--bad)" strokeDasharray="4 4" /><text x={W - pad} y={y(limit) - 5} fontSize="11" textAnchor="end" fill="var(--bad)">{limit} mmHg</text>
    <polyline points={points.map((p, i) => `${x(i)},${y(p.v)}`).join(" ")} fill="none" stroke="var(--blue)" strokeWidth="2.5" />
    {points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.v)} r="4.5" fill={p.v >= limit ? "var(--bad)" : "var(--blue)"}><title>{Schedule.display(p.day)}: {p.v}</title></circle>)}
  </svg>;
}

export function CareResponsesPage() { const p = usePatient(); return p ? <CareResponses key={p.phone} patient={p} /> : <PatientMissing />; }
function CareResponses({ patient }: { patient: Patient }) {
  const { reload: reloadPatients } = useApp();
  const [days, setDays] = useState(30);
  const { data, error, loading, reload } = usePeriodic<{ items: CareReply[]; alerts: CareReply[]; deliveryAvailable: boolean }>((d) => `/patients/${patient.phone}/care-responses?days=${d}`, days);
  const [failure, setFailure] = useState<string | null>(null);
  const label = (r: CareReply) => (r.status !== "sent" ? ({ blocked: "Envio bloqueado: configuração pendente", failed: "Falha no envio", sending: "Envio sem confirmação" } as Record<string, string>)[r.status] ?? r.status : ({ realizei: "Realizei", nao_realizei: "Não consegui realizar", reacao: "Tive alguma reação" } as Record<string, string>)[r.response ?? ""] ?? "Sem resposta");
  const [reviewing, setReviewing] = useState<string | null>(null);
  async function review(r: CareReply) { if (reviewing) return; setReviewing(r.id); try { await api(`/care-responses/${r.id}/review`, { method: "POST", body: {} }); setFailure(null); await reload(); void reloadPatients(); } catch (e) { setFailure(errorText(e)); } setReviewing(null); }
  return <div className="page">
    <Header patient={patient} title="Adesão por protocolo" text="Rotinas de cuidados realizadas e relatos de reação a avaliar." />
    <Notice>{error ?? failure}</Notice>
    {loading && !data && <div className="row muted"><Spinner />Carregando respostas…</div>}
    {data && <>
      {!data.deliveryAvailable && <Notice tone="warn">Envios aguardando configuração do WhatsApp.</Notice>}
      {data.alerts.map((r) => <Surface key={r.id} style={{ background: "var(--warn-soft)" }}><div className="row" style={{ color: "var(--warn)", fontWeight: 600 }}><Icon name="alert" />Reação relatada · avaliar</div><div>{r.snapshot.name} · {r.snapshot.routineName}</div>{r.reactionAt && <div className="muted small">{Schedule.dateTime(r.reactionAt)} · Brasília</div>}<Button className="plain" style={{ alignSelf: "flex-start" }} busy={reviewing === r.id} onClick={() => review(r)}>Marcar como avaliado</Button></Surface>)}
      <Segmented label="Período" value={days} onChange={setDays} options={PERIODS} />
      <b>{data.items.filter((i) => i.response === "realizei").length} realizadas · {data.items.filter((i) => i.response === "nao_realizei").length} não realizadas</b>
      <p className="muted small">Até 500 envios no período. Sem resposta não significa que a rotina não foi realizada. Reações permanecem destacadas até sua avaliação.</p>
      {data.items.length === 0 && <p className="muted">As respostas aparecerão após os envios das rotinas.</p>}
      <div className="grid2">{data.items.map((r) => <Surface key={r.id} style={{ gap: 6 }}><b>{r.snapshot.name} · {r.snapshot.routineName}</b><div className="muted small tnum">{Schedule.display(r.scheduledAt.slice(0, 10))} · {r.scheduledAt.slice(11, 16)} · Brasília</div><div style={{ color: r.reactionAt ? "var(--warn)" : "var(--muted)", fontWeight: 600 }}>{label(r)}</div>{r.snapshot.steps.map((s, i) => <div key={i} className="small">{i + 1}. {s}</div>)}</Surface>)}</div></>}
  </div>;
}
