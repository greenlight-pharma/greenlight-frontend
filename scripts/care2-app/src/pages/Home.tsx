import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Schedule, patientMatches, type TodayTotals } from "../models";
import { Button, Eyebrow, Icon, Notice, Spinner, Surface, useLoad } from "../ui";
import { PatientRow, useApp } from "../App";
import { ExpiryNotice } from "./Plans";

const STEPS_KEY = "vytal-care.primeirosPassosDispensado";
function greeting() { const h = Number(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", hour12: false }).format(new Date())); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; }
const todayLabel = () => { const t = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "long", day: "numeric", month: "long" }).format(new Date()); return t[0].toUpperCase() + t.slice(1); };

export default function Home() {
  const { session, patients, loading, error, openNewPatient, plan } = useApp();
  const [query, setQuery] = useState("");
  const [today, setToday] = useState<TodayTotals | null>(null);
  const [emailPending, setEmailPending] = useState<boolean | null>(null);
  const [stepsHidden, setStepsHidden] = useState(() => { try { return localStorage.getItem(STEPS_KEY) === "1"; } catch { return false; } });
  const loadExtras = async (alive: () => boolean = () => true) => {
    api<TodayTotals>("/hoje").then((t) => alive() && setToday(t)).catch(() => {});
    api<{ confirmacaoPendente?: boolean }>("/auth/email/estado").then((s) => alive() && setEmailPending(s.confirmacaoPendente === true)).catch(() => {});
  };
  useLoad(loadExtras, []);
  const filtered = patients.filter((p) => patientMatches(p, query));
  const attention = patients.filter((p) => (p.pendingReactions ?? 0) > 0 || p.optOut);
  const measures = (today?.afericoesAlteradas ?? []).filter((a) => patients.some((p) => p.phone === a.phone));
  const hasMedication = patients.some((p) => (p.activeMedications ?? 0) > 0);
  const steps: [string, boolean][] = [["Conta criada", true], ["E-mail confirmado", emailPending === false], ["Adicionar o primeiro paciente", patients.length > 0], ["Cadastrar a primeira medicação", hasMedication]];
  const showSteps = !stepsHidden && !loading && !hasMedication;
  return <div className="page">
    <div className="row between wrap" style={{ alignItems: "flex-end" }}>
      <div><Eyebrow>{todayLabel()}</Eyebrow><h1 style={{ fontSize: 34 }}>{greeting()}{session.doctor.name ? `, ${session.doctor.name.split(" ")[0]}` : ""}</h1></div>
      <Button icon="plus" onClick={openNewPatient}>Novo paciente</Button>
    </div>
    <div className="row wrap" style={{ alignItems: "stretch" }}>
      <div className="tile"><b>{today?.pacientes ?? patients.length}</b><span className="muted small">pacientes acompanhados</span></div>
      <div className="tile"><b style={{ color: (today?.reacoesAAvaliar ?? 0) > 0 ? "var(--bad)" : undefined }}>{today?.reacoesAAvaliar ?? 0}</b><span className="muted small">{today?.reacoesAAvaliar === 1 ? "reação a avaliar" : "reações a avaliar"}</span></div>
      <div className="tile"><b>{today?.semRespostaOntem ?? 0}</b><span className="muted small">sem resposta ontem</span></div>
    </div>
    {plan?.vencimento && <Link to="/conta" style={{ color: "inherit", textDecoration: "none" }}><ExpiryNotice expiry={plan.vencimento} used={plan.usados ?? patients.length} /></Link>}
    <div className="split">
      <Surface className="grow" style={{ alignSelf: "stretch" }}>
        <div className="row between wrap"><h2>Pacientes</h2><label className="search" style={{ flex: "0 1 280px" }}><Icon name="search" size={16} /><input placeholder="Buscar por nome ou número" aria-label="Buscar por nome ou número" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div>
        <Notice>{error}</Notice>
        {loading ? <div className="row muted" style={{ justifyContent: "center", padding: 30 }}><Spinner />Carregando pacientes…</div>
          : filtered.length === 0 ? <div className="stack" style={{ alignItems: "center", textAlign: "center", padding: "36px 16px", gap: 8 }}><span className="muted"><Icon name={query ? "search" : "user"} size={36} /></span><b>{query ? "Nenhum resultado" : "Seu cuidado começa aqui"}</b><span className="muted">{query ? "Tente outro nome ou telefone." : "Adicione o primeiro paciente para começar."}</span>{!query && <Button icon="plus" onClick={openNewPatient}>Novo paciente</Button>}</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{filtered.map((p) => <PatientRow key={p.phone} patient={p} />)}</div>}
      </Surface>
      <div className="side stack">
        {showSteps && <Surface style={{ gap: 6 }}>
          <div className="row between"><b>Primeiros passos</b><span className="row muted small">{steps.filter((s) => s[1]).length} de {steps.length}<button className="link" aria-label="Ocultar primeiros passos" style={{ color: "var(--muted)", minHeight: 28 }} onClick={() => { setStepsHidden(true); try { localStorage.setItem(STEPS_KEY, "1"); } catch { /* sem armazenamento */ } }}><Icon name="x" size={14} /></button></span></div>
          {steps.map(([label, done]) => <div key={label} className="row" style={{ gap: 10, padding: "5px 0", color: done ? "var(--muted)" : "var(--ink)" }}><span style={{ color: done ? "var(--teal)" : "var(--muted)" }}><Icon name={done ? "check" : "clock"} size={18} /></span>{label}</div>)}
          <p className="muted small">Adicione o paciente. Na ficha dele, envie a foto da receita.</p>
        </Surface>}
        <Surface><Eyebrow>Precisa de atenção</Eyebrow>
          {measures.map((a) => <Link key={`m${a.phone}`} to={`/p/${a.phone}/afericoes`} className="row" style={{ alignItems: "flex-start", color: "var(--ink)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: a.nivel === "alerta" ? "var(--bad-soft)" : "var(--warn-soft)", color: a.nivel === "alerta" ? "var(--bad)" : "var(--warn)" }}><Icon name={a.tipo === "glicemia" ? "drop" : "gauge"} size={18} /></div>
            <div><div style={{ fontWeight: 600, fontSize: 14 }}>{a.patientName || "Paciente"}: {a.tipo === "glicemia" ? "glicemia" : "pressão"} {a.motivo ?? "fora da faixa"}</div><div className="muted small tnum">{a.valor} · {Schedule.dateTime(a.medidoEm)}</div></div></Link>)}
          {attention.length === 0 && measures.length === 0 ? <p className="muted">Nada pendente agora. Reações relatadas, pressão ou glicemia fora da faixa nas últimas 48 horas e pacientes que pausaram os lembretes aparecem aqui.</p>
            : attention.map((p) => <Link key={p.phone} to={p.pendingReactions ? `/p/${p.phone}/respostas-cuidados` : `/p/${p.phone}`} className="row" style={{ alignItems: "flex-start", color: "var(--ink)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: p.pendingReactions ? "var(--bad-soft)" : "var(--fill)", color: p.pendingReactions ? "var(--bad)" : "var(--muted)" }}><Icon name={p.pendingReactions ? "alert" : "clock"} size={18} /></div>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.pendingReactions ? `${p.name} relatou ${p.pendingReactions === 1 ? "uma reação" : `${p.pendingReactions} reações`}` : `${p.name} pausou os lembretes`}</div><div className="muted small">{p.pendingReactions ? "Abra para avaliar." : "Nenhuma mensagem é enviada enquanto ele não pedir para voltar."}</div></div></Link>)}
        </Surface>
      </div>
    </div>
  </div>;
}
