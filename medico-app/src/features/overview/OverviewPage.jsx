import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../components/PageHeader.jsx";
import ManualPatientModal from "../patients/ManualPatientModal.jsx";
import { api } from "../../lib/api.js";
import { usePatients } from "../patients/api.js";
import { useMyAppointments } from "../consultas/api.js";
import { formatBRPhone } from "../../lib/phone.js";
import { parseScheduleTimes, isExpired } from "../../lib/schedule.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function OverviewPage() {
  const { doctor } = useAuth();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const { data: pacientes = [] } = usePatients();
  const { data: consultas = [] } = useMyAppointments();
  const { data: medicacoes = [] } = useQuery({
    queryKey: ["medicacoes", "minhas"],
    queryFn: () => api.get("/medications"),
  });

  const emAtendimento = consultas.filter((c) => c.status === "aceita").length;

  // [LEMBRETE-QUEBRADO] Duas situações fazem o lembrete falhar em silêncio,
  // e nenhuma aparecia no painel antigo:
  //   1. horário em formato legado -> o cron compara string e nunca casa;
  //   2. tratamento vencido e ainda ativo -> o cron ignora endDate e segue
  //      mandando mensagem depois do fim da prescrição.
  // Aqui elas viram uma lista de pendências acionável na abertura do dia.
  const problemas = useMemo(() => {
    const ativas = medicacoes.filter((m) => m.status === "ativo");
    return {
      horarioInvalido: ativas.filter((m) => !parseScheduleTimes(m.scheduleTimes).ok),
      vencidas: ativas.filter((m) => isExpired(m)),
    };
  }, [medicacoes]);

  const resultados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo.length < 2) return [];
    const digitos = termo.replace(/\D/g, "");
    return pacientes
      .filter(
        (p) =>
          (p.patientName || "").toLowerCase().includes(termo) ||
          (digitos && String(p.patientPhone || "").includes(digitos))
      )
      .slice(0, 8);
  }, [pacientes, busca]);

  return (
    <>
      <PageHeader
        title={`Olá, ${primeiroNome(doctor?.name)}`}
        subtitle="Visão geral do seu atendimento"
      />

      <div className="card">
        <input
          className="busca"
          placeholder="🔍 Buscar paciente por nome ou telefone…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {resultados.length > 0 && (
          <div className="busca-resultados">
            {resultados.map((p) => (
              <button
                key={p.id}
                className="busca-item"
                onClick={() => navigate(`/pacientes/${p.patientPhone}`)}
              >
                <strong>{p.patientName || "(sem nome)"}</strong>
                <span className="texto-suave"> · {formatBRPhone(p.patientPhone)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="stats">
        <Stat valor={pacientes.length} rotulo="Pacientes vinculados" para="/pacientes" />
        <Stat valor={emAtendimento} rotulo="Consultas em atendimento" para="/consultas" />
        <Stat
          valor={medicacoes.filter((m) => m.status === "ativo").length}
          rotulo="Medicações com lembrete ativo"
        />
      </div>

      {(problemas.horarioInvalido.length > 0 || problemas.vencidas.length > 0) && (
        <div className="card card-atencao">
          <h3>⚠️ Lembretes que precisam de atenção</h3>

          {problemas.horarioInvalido.map((m) => (
            <PendenciaRow
              key={`h-${m.id}`}
              med={m}
              texto={`horário em formato antigo ("${m.scheduleTimes || "vazio"}") — o lembrete não está sendo enviado`}
            />
          ))}

          {problemas.vencidas.map((m) => (
            <PendenciaRow
              key={`v-${m.id}`}
              med={m}
              texto="tratamento terminou e a medicação continua ativa — o paciente ainda recebe lembrete"
            />
          ))}
        </div>
      )}

      <div className="card card-cta">
        <div>
          <strong>Atender paciente que não veio pelo WhatsApp</strong>
          <div className="texto-suave">
            Cadastre e abra o prontuário sem depender de o paciente iniciar
            conversa com o bot.
          </div>
        </div>
        <button className="primary" onClick={() => setCadastroAberto(true)}>
          + Cadastrar paciente
        </button>
      </div>

      {cadastroAberto && (
        <ManualPatientModal open onClose={() => setCadastroAberto(false)} />
      )}
    </>
  );
}

function PendenciaRow({ med, texto }) {
  return (
    <div className="pendencia">
      <Link to={`/pacientes/${med.phone}`} className="link-forte">
        {med.patientName || formatBRPhone(med.phone)}
      </Link>
      : <strong>{med.medicationName}</strong> — {texto}.
    </div>
  );
}

function Stat({ valor, rotulo, para }) {
  const conteudo = (
    <div className="stat-card">
      <div className="stat-valor">{valor}</div>
      <div className="stat-rotulo">{rotulo}</div>
    </div>
  );
  return para ? <Link to={para}>{conteudo}</Link> : conteudo;
}

function primeiroNome(nome) {
  return String(nome || "doutor(a)").trim().split(/\s+/)[0];
}
