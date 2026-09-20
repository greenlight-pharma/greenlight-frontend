import PrimeiroCuidado from './PrimeiroCuidado';
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api, errorText, session } from "../api";
import { AppContext, type AppCtx } from "../App";
import { initials, readPatient, type Patient, type Session, type SubscriptionStatus } from "../models";
import { Avatar, Brand, Eyebrow, Icon } from "../ui";
import Recipe from "../pages/Recipe";
import Inicio from "./Inicio";
import PessoaPage from "./Pessoa";
import Resumo from "./Resumo";
import Avisos from "./Avisos";
import Conta from "./Conta";
import NovaPessoa from "./NovaPessoa";
import Programas from "../programas/Programas";
import ProgramaRoute from "../programas/Programa";


// ============================================================
// [PESSOAL] Vytal Care para você e sua família. Mesma conta e mesmo
// servidor do profissional (tipoConta = "pessoal"): quem assina cadastra a
// si mesmo ou até 3 pessoas, fotografa a receita e recebe avisos quando uma
// dose não é confirmada, quando uma medição sai da faixa ou quando o
// tratamento está terminando. Regras no servidor: familia.js.
// As telas reaproveitam o AppContext do profissional, então a receita por
// foto e os editores de medicação e medição funcionam iguais.
// ============================================================

export type Aviso = { id: string; phone: string; tipo: "dose" | "reacao" | "medicao" | "receita" | "tomou"; texto: string; criadoEm: string; lidoEm: string | null; pessoa?: string | null };
type FamiliaCtx = { avisos: Aviso[]; naoLidos: number; recarregarAvisos: () => Promise<void> };
const FamiliaContext = createContext<FamiliaCtx>({ avisos: [], naoLidos: 0, recarregarAvisos: async () => {} });
export const useFamilia = () => useContext(FamiliaContext);

export const diasRestantes = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

export default function FamilyWorkspace({ session: current }: { session: Session }) {
  const location=useLocation(),navigate=useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionStatus | null>(null);
  const [adding, setAdding] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]), [naoLidos, setNaoLidos] = useState(0);
  const recarregarAvisos = useCallback(async () => {
    try { const r = await api<{ avisos: Aviso[]; naoLidos: number }>("/familia/avisos"); setAvisos(r.avisos ?? []); setNaoLidos(r.naoLidos ?? 0); } catch { /* a lista é complementar */ }
  }, []);
  const reload = useCallback(async () => {
    try { const list = await api<unknown[]>("/my-patients"); setPatients((Array.isArray(list) ? list : []).map(readPatient)); setError(null); }
    catch (e) { setError(errorText(e)); }
    setLoading(false);
    api<SubscriptionStatus>("/minha-assinatura").then(setPlan).catch(() => {});
    void recarregarAvisos();
  }, [recarregarAvisos]);
  useEffect(() => { void reload(); }, [reload]);
  // Avisos novos aparecem sem recarregar: ao voltar para a aba e a cada minuto.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") void reload(); };
    document.addEventListener("visibilitychange", onVisible);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void reload(); }, 60000);
    return () => { document.removeEventListener("visibilitychange", onVisible); clearInterval(timer); };
  }, [reload]);
  const ctx: AppCtx = { session: current, patients, loading, error, reload, plan, openNewPatient: () => setAdding(true) };
  return <AppContext.Provider value={ctx}><FamiliaContext.Provider value={{ avisos, naoLidos, recarregarAvisos }}>
    <div className="shell">
      <Lateral />
      <main className="content">
        <header className="care2-topbar"><Brand /><p>O cuidado continua. Mesmo em casa.</p><a href="/vytal-care2/">Conhecer o Care ↗</a></header>
        {!loading&&!error&&patients.length===0&&location.pathname!=='/conta'?<PrimeiroCuidado/>:<Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/programas/:phone" element={<Programas />} />
          <Route path="/programas/:phone/:programa" element={<ProgramaRoute />} />
          <Route path="/gestacao" element={<Programas />} />
          <Route path="/p/:phone/gestacao" element={<ProgramaRoute />} />
          <Route path="/p/:phone" element={<PessoaPage />} />
          <Route path="/p/:phone/receita" element={<Recipe />} />
          <Route path="/p/:phone/resumo" element={<Resumo />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="*" element={<Inicio />} />
        </Routes>}
      </main>
      <nav className="tabbar" aria-label="Principal">
        <NavLink to="/" end><Icon name="home" />Início</NavLink>
        <ProgramasNav />
        <NavLink to="/avisos"><span style={{ position: "relative" }}><Icon name="alert" />{naoLidos > 0 && <span className="badge-dot" aria-label={`${naoLidos} avisos novos`} />}</span>Avisos</NavLink>
        <NavLink to="/conta"><Icon name="user" />Conta</NavLink>
      </nav>
    </div>
    {adding && <NovaPessoa onClose={() => { setAdding(false); void reload(); }} onSaved={async phone=>{setAdding(false);await reload();navigate(`/programas/${phone}?inicio=1`);}} />}
  </FamiliaContext.Provider></AppContext.Provider>;
}

function Lateral() {
  const { session: s, plan, patients } = useApp();
  const { naoLidos } = useFamilia();
  const limite = plan?.limite ?? plan?.plano.limitePacientes ?? 0;
  return <aside className="sidebar">
    <Brand />
    <nav className="nav" aria-label="Principal">
      <NavLink to="/" end><Icon name="home" />Início</NavLink>
      <ProgramasNav />
      <NavLink to="/avisos"><Icon name="alert" />Avisos{naoLidos > 0 && <span className="chip bad" style={{ marginLeft: "auto" }}>{naoLidos}</span>}</NavLink>
      <NavLink to="/conta"><Icon name="user" />Conta</NavLink>
    </nav>
    <div style={{ flexGrow: 1 }} />
    {plan && <NavLink to="/conta" className="plan-card"><Eyebrow>{plan.teste?.ativo ? "Teste grátis" : "Seu plano"}</Eyebrow>
      <b>{plan.teste?.ativo ? `${diasRestantes(plan.teste.ate)} ${diasRestantes(plan.teste.ate) === 1 ? "dia" : "dias"} restantes` : plan.plano.nome}</b>
      <span className="muted small">{patients.length} de {limite} {limite === 1 ? "pessoa" : "pessoas"}</span></NavLink>}
    <div className="row" style={{ gap: 10 }}><Avatar text={initials(s.doctor.name ?? "") || "VC"} size={38} /><div className="grow"><div style={{ fontWeight: 600, fontSize: 14 }}>{s.doctor.name || "Sua conta"}</div><div className="muted" style={{ fontSize: 12 }}>{s.doctor.email}</div></div></div>
    <button type="button" className="link row" style={{ gap: 8, color: "var(--muted)", fontWeight: 500 }} onClick={() => session.logout()}><Icon name="logout" size={18} />Sair</button>
  </aside>;
}

function useApp(): AppCtx {
  const c = useContext(AppContext);
  if (!c) throw new Error("fora do app");
  return c;
}

function ProgramasNav() {
  const {pathname}=useLocation();
  return <NavLink to="/programas" className={({isActive})=>isActive||pathname.endsWith("/gestacao")?"active":""}><Icon name="heart" />Saúde</NavLink>;
}
