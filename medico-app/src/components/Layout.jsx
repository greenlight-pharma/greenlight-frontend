import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";
import Icone from "./Icone.jsx";
import AvisoEmail from "../features/auth/AvisoEmail.jsx";

const NAV = [
  { to: "/", icon: "inicio", label: "Início", end: true },
  { to: "/pacientes", icon: "pacientes", label: "Meus Pacientes" },
  { to: "/medicoes", icon: "medicoes", label: "Pressão e glicemia" },
  { to: "/agenda", icon: "agenda", label: "Agenda" },
  { to: "/agenda-unidade", icon: "unidade", label: "Agenda da unidade" },
  { to: "/consultas", icon: "consultas", label: "Consultas" },
  { to: "/assistente", icon: "assistente", label: "Assistente" },
  { to: "/calculadoras", icon: "calculadoras", label: "Calculadoras" },
  { to: "/assinatura", icon: "plano", label: "Meu plano" },
  { to: "/conta", icon: "senha", label: "Alterar Senha" },
];

// [TRES-PAINEIS] O menu e o subtítulo são parâmetros porque o painel UBS
// reusa esta mesma casca com outro conjunto de itens. Duplicar o Layout
// significaria manter duas vezes o drawer, o overlay e o fecha-ao-navegar —
// e a segunda cópia é sempre a que esquece uma correção.
export default function Layout({ children, nav = NAV, brandSub = "Painel Médico" }) {
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
            <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
            <div className="brand-text">
              <div className="brand">Vytal</div>
              <div className="brand-sub">{brandSub}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-btn active" : "nav-btn")}
            >
              <Icone nome={item.icon} />
              <span>{item.label}</span>
              {item.previa && <span className="nav-previa">prévia</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="doctor-name">{doctor?.name || "Médico"}</div>
          <div className="doctor-email">{doctor?.email || ""}</div>
          <button onClick={() => logout()}>Sair</button>
        </div>
      </aside>

      <main className="content">
        <AvisoEmail />
        {children}
      </main>
    </div>
  );
}
