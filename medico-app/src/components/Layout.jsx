import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";

const NAV = [
  { to: "/", icon: "🏠", label: "Início", end: true },
  { to: "/pacientes", icon: "👥", label: "Meus Pacientes" },
  { to: "/agenda", icon: "📅", label: "Agenda" },
  { to: "/consultas", icon: "🩺", label: "Consultas" },
  { to: "/assistente", icon: "💬", label: "Assistente" },
  { to: "/calculadoras", icon: "🧮", label: "Calculadoras" },
  { to: "/conta", icon: "🔐", label: "Alterar Senha" },
];

export default function Layout({ children }) {
  const { doctor, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Em mobile a sidebar é drawer. Trocar de página tem que fechá-lo —
  // no painel antigo cada botão de navegação chamava closeSidebar() na mão,
  // e quem esquecia deixava o menu aberto por cima do conteúdo.
  useEffect(() => setMenuOpen(false), [location.pathname]);

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
            <img src="./vytalsaude.png" alt="Vytal" />
            <div className="brand-text">
              <div className="brand">Vytal</div>
              <div className="brand-sub">Painel Médico</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-btn active" : "nav-btn")}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="doctor-name">{doctor?.name || "Médico"}</div>
          <div className="doctor-email">{doctor?.email || ""}</div>
          <button onClick={() => logout()}>Sair</button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
