import { HashRouter, Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuth.jsx";
import AdminLogin from "./AdminLogin.jsx";
import VisaoGeralPage from "./features/VisaoGeralPage.jsx";
import AgendamentosPage from "./features/AgendamentosPage.jsx";
import MedicosPage from "./features/MedicosPage.jsx";
import PlanosPage from "./features/PlanosPage.jsx";
import BotPage from "./features/BotPage.jsx";

const NAV = [
  { to: "/", icon: "🏠", label: "Início", end: true },
  { to: "/agendamentos", icon: "📋", label: "Agendamentos" },
  { to: "/medicos", icon: "👨‍⚕️", label: "Médicos" },
  { to: "/planos", icon: "💳", label: "Planos" },
  { to: "/bot", icon: "🤖", label: "Bot & Mensagens" },
];

function Shell() {
  const { isLoggedIn, logout, admin } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  if (!isLoggedIn) return <AdminLogin />;

  return (
    <div id="appLayout">
      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
        <div className="mobile-brand">Vytal OS</div>
      </div>

      <div
        className={menuOpen ? "sidebar-overlay show" : "sidebar-overlay"}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
            <div className="brand-text">
              <div className="brand">Vytal</div>
              <div className="brand-sub">Administrativo</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) => (isActive ? "nav-btn active" : "nav-btn")}
            >
              <span className="nav-icon">{i.icon}</span>
              <span>{i.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="doctor-name">Administrador</div>
          <div className="doctor-email">{admin?.email || ""}</div>
          <button onClick={() => logout()}>Sair</button>
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<VisaoGeralPage />} />
          <Route path="/agendamentos" element={<AgendamentosPage />} />
          <Route path="/medicos" element={<MedicosPage />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/bot" element={<BotPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <HashRouter>
      <AdminAuthProvider>
        <Shell />
      </AdminAuthProvider>
    </HashRouter>
  );
}
