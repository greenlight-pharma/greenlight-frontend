import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import Layout from "./components/Layout.jsx";
import OverviewPage from "./features/overview/OverviewPage.jsx";
import PatientsPage from "./features/patients/PatientsPage.jsx";
import PatientDetailPage from "./features/patients/PatientDetailPage.jsx";
import TimelinePage from "./features/timeline/TimelinePage.jsx";
import AgendaPage from "./features/agenda/AgendaPage.jsx";
import ConsultasPage from "./features/consultas/ConsultasPage.jsx";
import AssistantPage from "./features/assistant/AssistantPage.jsx";
import CalculatorsPage from "./features/calculators/CalculatorsPage.jsx";
import AccountPage from "./features/account/AccountPage.jsx";

function Shell() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/pacientes" element={<PatientsPage />} />
        {/* O telefone é a identidade do paciente no sistema inteiro
            (é a chave que o WhatsApp entrega), por isso é ele na rota. */}
        <Route path="/pacientes/:phone" element={<PatientDetailPage />} />
        {/* Linha do tempo é página própria, como no medico.html */}
        <Route path="/pacientes/:phone/linha-do-tempo" element={<TimelinePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/assistente" element={<AssistantPage />} />
        <Route path="/calculadoras" element={<CalculatorsPage />} />
        <Route path="/conta" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </HashRouter>
  );
}
