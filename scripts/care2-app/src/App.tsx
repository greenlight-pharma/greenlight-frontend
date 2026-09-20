import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation, useMatch } from "react-router-dom";
import { api, errorText, session } from "./api";
import { formatPhone, initials, patientMatches, readPatient, findProfession, type Patient, type Session, type SubscriptionStatus } from "./models";
import { Avatar, Brand, Button, Chip, Eyebrow, Icon } from "./ui";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PatientPage from "./pages/Patient";
import Recipe from "./pages/Recipe";
import { AdherencePage, MeasurementsPage, CareResponsesPage } from "./pages/Followup";
import Account from "./pages/Account";
import { ProfileDialog } from "./pages/Profile";
import NewPatient from "./pages/NewPatient";
import Onboarding, { onboardingSeen } from "./pages/Onboarding";
import ResetPassword from "./pages/ResetPassword";
import FamilyWorkspace from "./familia/Familia";
import EmailGate from "./pages/ConfirmEmail";
import { lazy, Suspense } from "react";
// [ADMIN] Carregado à parte: quem usa o Vytal Care não baixa o painel.
const Admin = lazy(() => import("./admin/Admin"));

type Ctx = { session: Session; patients: Patient[]; loading: boolean; error: string | null; reload: () => Promise<void>; plan: SubscriptionStatus | null; openNewPatient: () => void };
export const AppContext = createContext<Ctx | null>(null);
export type AppCtx = Ctx;
export const useApp = () => { const c = useContext(AppContext); if (!c) throw new Error("fora do app"); return c; };

export default function App() {
  const [current, setCurrent] = useState(session.get());
  const [message, setMessage] = useState<string | undefined>();
  useEffect(() => session.subscribe((s, m) => { setCurrent(s); setMessage(m); }), []);
  // O link do e-mail abre esta página mesmo com alguém logado neste navegador.
  if (location.pathname === "/vytal-care2/app/redefinir-senha") return <ResetPassword />;
  if (location.pathname === "/vytal-care2/app/admin" || location.pathname.startsWith("/vytal-care2/app/admin/")) return <Suspense fallback={null}><Admin /></Suspense>;
  if (!current) return <Login message={message} />;
  // [PESSOAL] Conta de família tem as próprias telas (src/familia).
  // [CONFIRMAR-EMAIL] Sem e-mail confirmado, fica na tela de confirmação.
  if (current.doctor.tipoConta === "pessoal") return <EmailGate key={current.token}><FamilyWorkspace session={current} /></EmailGate>;
  return <EmailGate key={current.token}><Workspace session={current} /></EmailGate>;
}

function Workspace({ session: current }: { session: Session }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionStatus | null>(null);
  const [adding, setAdding] = useState(false);
  const [profileRequired, setProfileRequired] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const reload = useCallback(async () => {
    try { const list = await api<unknown[]>("/my-patients"); setPatients((Array.isArray(list) ? list : []).map(readPatient)); setError(null); }
    catch (e) { setError(errorText(e)); }
    setLoading(false);
    api<SubscriptionStatus>("/minha-assinatura").then(setPlan).catch(() => {});
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  // Quem deixa a aba aberta o dia todo vê reações novas: recarrega ao voltar para a aba e a cada minuto.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") void reload(); };
    document.addEventListener("visibilitychange", onVisible);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void reload(); }, 60000);
    return () => { document.removeEventListener("visibilitychange", onVisible); clearInterval(timer); };
  }, [reload]);
  // Conta antiga sem nome ou registro completa o perfil antes de usar; depois, o primeiro acesso.
  useEffect(() => {
    api<{ incompleto?: boolean; doctor?: { tipoConta?: "profissional" | "pessoal" } }>("/auth/perfil").then((p) => { if (p.doctor?.tipoConta === "pessoal") { session.updateDoctor({ tipoConta: "pessoal" }); return; } if (p.incompleto) setProfileRequired(true); else if (!onboardingSeen()) setOnboarding(true); }).catch(() => { if (!onboardingSeen()) setOnboarding(true); });
  }, []);
  const ctx: Ctx = { session: current, patients, loading, error, reload, plan, openNewPatient: () => setAdding(true) };
  const onPatient = useMatch("/p/:phone/*");
  return <AppContext.Provider value={ctx}>
    <div className="shell">
      <Sidebar />
      {onPatient && <PatientColumn active={onPatient.params.phone ?? ""} />}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p/:phone" element={<PatientPage />} />
          <Route path="/p/:phone/receita" element={<Recipe />} />
          <Route path="/p/:phone/adesao" element={<AdherencePage />} />
          <Route path="/p/:phone/afericoes" element={<MeasurementsPage />} />
          <Route path="/p/:phone/respostas-cuidados" element={<CareResponsesPage />} />
          <Route path="/conta" element={<Account />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <nav className="tabbar" aria-label="Principal"><NavLink to="/" end><Icon name="home" />Início</NavLink><NavLink to="/conta"><Icon name="user" />Conta</NavLink></nav>
    </div>
    {adding && <NewPatient onClose={() => { setAdding(false); void reload(); }} />}
    {profileRequired && <ProfileDialog required onClose={() => { setProfileRequired(false); if (!onboardingSeen()) setOnboarding(true); }} />}
    {onboarding && !profileRequired && <Onboarding onDone={() => setOnboarding(false)} />}
  </AppContext.Provider>;
}

function Sidebar() {
  const { session: s, plan } = useApp();
  const used = plan?.usados ?? 0, limit = plan?.limite ?? plan?.plano.limitePacientes ?? 0;
  const role = [findProfession(s.doctor.profissao)?.name, s.doctor.crm].filter(Boolean).join(" · ");
  return <aside className="sidebar">
    <Brand />
    <nav className="nav" aria-label="Principal"><NavLink to="/" end><Icon name="home" />Início</NavLink><NavLink to="/conta"><Icon name="user" />Conta</NavLink></nav>
    <div style={{ flexGrow: 1 }} />
    {plan && <NavLink to="/conta" className="plan-card"><Eyebrow>Seu plano</Eyebrow><b>{plan.plano.nome}</b><span className="muted small">{used} de {limit} pacientes</span><div className="meter"><div style={{ width: `${limit ? Math.min(100, (used / limit) * 100) : 0}%` }} /></div>{plan.franquia?.aviso && <span className="small" style={{ color: plan.franquia.aviso === "excedida" ? "var(--bad)" : "var(--warn)" }}>{plan.franquia.aviso === "excedida" ? "Franquia de mensagens excedida" : "Franquia de mensagens perto do limite"}</span>}</NavLink>}
    <div className="row" style={{ gap: 10 }}><Avatar text={initials(s.doctor.name ?? "") || "VC"} size={38} /><div className="grow"><div style={{ fontWeight: 600, fontSize: 14 }}>{s.doctor.name || "Sua conta"}</div><div className="muted" style={{ fontSize: 12 }}>{role || s.doctor.email}</div></div></div>
    <button type="button" className="link row" style={{ gap: 8, color: "var(--muted)", fontWeight: 500 }} onClick={() => session.logout()}><Icon name="logout" size={18} />Sair</button>
  </aside>;
}

/** Na tela larga a lista fica fixa ao lado da ficha: trocar de paciente não exige voltar. */
function PatientColumn({ active }: { active: string }) {
  const { patients, openNewPatient } = useApp();
  const [query, setQuery] = useState("");
  const location = useLocation();
  useEffect(() => { setQuery(""); }, [location.pathname]);
  return <div className="listcol">
    <div className="row between" style={{ padding: "0 8px" }}><h2>Pacientes</h2><Button className="icon" aria-label="Novo paciente" onClick={openNewPatient} style={{ width: 44, minHeight: 44, borderRadius: 14 }} icon="plus">{""}</Button></div>
    <label className="search"><Icon name="search" size={16} /><input placeholder="Buscar paciente" aria-label="Buscar paciente" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{patients.filter((p) => patientMatches(p, query)).map((p) => <PatientRow key={p.phone} patient={p} compact active={p.phone === active} />)}</div>
  </div>;
}

export function PatientRow({ patient: p, compact = false, active = false }: { patient: Patient; compact?: boolean; active?: boolean }) {
  const meds = p.activeMedications;
  const detail = [formatPhone(p.phone), !compact && meds != null ? (meds === 1 ? "1 medicação" : `${meds} medicações`) : null].filter(Boolean).join(" · ");
  return <NavLink to={`/p/${p.phone}`} className={`prow ${active ? "active" : ""}`}>
    <Avatar text={initials(p.name)} size={compact ? 40 : 44} />
    <div className="grow"><div style={{ fontWeight: 600 }}>{p.name}</div><div className="muted small">{detail}</div></div>
    {!!p.pendingReactions && <Chip tone="bad">{p.pendingReactions === 1 ? "1 reação" : `${p.pendingReactions} reações`}</Chip>}
    {p.optOut && !compact && <Chip>Pausou os lembretes</Chip>}
    {p.remindersPaused && !p.optOut && !compact && <Chip tone="bad">Plano vencido</Chip>}
    {!compact && <span className="muted"><Icon name="chev" size={16} /></span>}
  </NavLink>;
}
