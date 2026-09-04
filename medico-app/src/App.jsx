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
import AssinaturaPage from "./features/assinatura/AssinaturaPage.jsx";
import AgendaUbsPage from "./features/agendaUbs/AgendaUbsPage.jsx";
import MedicoesPacientePage from "./features/medicoes/MedicoesPacientePage.jsx";

function Shell() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <LoginPage permiteCadastro />;

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
        {/* [MEDICOES] Fluxo próprio no menu. No prontuário o card continua,
            porque prontuário agrega tudo do paciente; aqui é o caminho de
            quem vai aferir, que não passa pelo prontuário inteiro. */}
        <Route
          path="/medicoes"
          element={
            <PatientsPage
              title="Pressão e glicemia"
              subtitle="Escolha o paciente para agendar as medições ou registrar um valor"
              linkBase="/medicoes"
            />
          }
        />
        <Route path="/medicoes/:phone" element={<MedicoesPacientePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/assistente" element={<AssistantPage />} />
        <Route path="/calculadoras" element={<CalculatorsPage />} />
        {/* [AGENDA-UBS] Maquete do módulo 2 — dados fictícios, sem backend. */}
        <Route path="/agenda-unidade" element={<AgendaUbsPage />} />
        <Route path="/assinatura" element={<AssinaturaPage />} />
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
