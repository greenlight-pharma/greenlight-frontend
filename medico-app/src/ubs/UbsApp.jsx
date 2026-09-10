import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../features/auth/AuthContext.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import Layout from "../components/Layout.jsx";
import PatientsPage from "../features/patients/PatientsPage.jsx";
import UbsPacientePage from "./UbsPacientePage.jsx";
import AgendaUbsPage from "../features/agendaUbs/AgendaUbsPage.jsx";
import MedicoesPacientePage from "../features/medicoes/MedicoesPacientePage.jsx";

// [PAINEL-UBS] O produto que vai à Secretaria de Saúde: lembrete de
// medicação com acompanhamento de adesão, e agenda com reaproveitamento de
// vagas. Só isso.
//
// Por que é um painel SEPARADO e não um perfil dentro do painel médico:
//
// 1. É outro comprador. A prefeitura contrata adesão e agenda; não contrata
//    prontuário, exames, calculadoras nem assistente de IA. Mostrar tudo e
//    dizer "essa parte não faz parte do contrato" enfraquece a proposta e
//    ainda levanta pergunta sobre preço do resto.
// 2. É outro usuário. Quem opera na UBS não é necessariamente o mesmo médico
//    que usa o prontuário completo, e a tela precisa caber no treinamento de
//    uma tarde.
// 3. Reduz superfície de dado sensível. O que não está na tela não vaza em
//    computador compartilhado de recepção.
//
// O que ele NÃO é: uma cópia. As telas são as mesmas do painel médico,
// importadas daqui — corrigir a adesão conserta os dois.
const NAV = [
  { to: "/pacientes", icon: "medicacoes", label: "Medicações" },
  // Item próprio, e não um card dentro de Medicações: prescrever remédio e
  // aferir pressão são rotinas diferentes, de pessoas diferentes, em
  // momentos diferentes.
  { to: "/medicoes", icon: "medicoes", label: "Pressão e glicemia" },
  { to: "/agenda-unidade", icon: "unidade", label: "Agenda da unidade" },
];

function Shell() {
  const { isLoggedIn } = useAuth();
  // [CADASTRO-NA-UBS] Aberto em 10/09/2026 para a demonstração ao Secretário
  // de Saúde: sem isto, não dá para mostrar o fluxo do começo.
  //
  // Não é a configuração final. Falta o papel `ubs` de verdade — hoje quem
  // opera a recepção usa conta de MÉDICO, e o backend grava
  // `prescribedBy || req.user.name`, ou seja, a medicação fica atribuída a
  // quem está logado. Num contrato com a Secretaria, "quem prescreveu" tem de
  // ser o médico, não quem digitou. Trocar papel depois, com contas em uso, é
  // caro — então isto é dívida assumida com data, não descuido.
  //
  // O que impede abuso hoje NÃO é este botão: é o portão de confirmação de
  // e-mail em POST /patients/manual. Conta sem e-mail confirmado não cadastra
  // paciente, e é ali que a mensagem de WhatsApp sairia.
  if (!isLoggedIn) {
    return <LoginPage subtitle="Infraestrutura de Saúde Contínua" permiteCadastro />;
  }

  return (
    <Layout nav={NAV} brandSub="Infraestrutura de Saúde Contínua">
      <Routes>
        <Route
          path="/pacientes"
          element={
            <PatientsPage
              title="Medicações"
              subtitle="Escolha o paciente para cadastrar ou revisar as medicações"
              cadastroEnxuto
            />
          }
        />
        {/* O telefone é a identidade do paciente — é a chave que o WhatsApp
            entrega de volta na resposta do lembrete. */}
        <Route path="/pacientes/:phone" element={<UbsPacientePage />} />
        <Route
          path="/medicoes"
          element={
            <PatientsPage
              title="Pressão e glicemia"
              subtitle="Escolha o paciente para agendar as medições ou registrar um valor"
              cadastroEnxuto
              linkBase="/medicoes"
            />
          }
        />
        <Route path="/medicoes/:phone" element={<MedicoesPacientePage />} />
        <Route path="/agenda-unidade" element={<AgendaUbsPage />} />
        <Route path="*" element={<Navigate to="/pacientes" replace />} />
      </Routes>
    </Layout>
  );
}

export default function UbsApp() {
  return (
    <HashRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </HashRouter>
  );
}
