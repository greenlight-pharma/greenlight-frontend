import { useState } from "react";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Loading } from "../../components/Loading.jsx";
import {
  TIPO, ROTULO, EXEMPLO,
  useMedicoes, useMedicoesAgendadas, useAgendarMedicao,
  useArquivarMedicaoAgendada, useRegistrarMedicao,
} from "./api.js";

// [MEDICOES] Card "🩺 Pressão e glicemia".
//
// O card mostra o valor e, quando houve, o motivo do alerta — que é
// FACTUAL ("sistólica 220 ≥ 180"), não clínico. Classificar o valor
// ("hipertensão estágio 2") é do médico que está lendo, e a tela não faz
// isso por ele. Mesmo limite que o resto do sistema respeita.
export default function MedicoesCard({ phone, patientName }) {
  const medicoes = useMedicoes(phone);
  const agendadas = useMedicoesAgendadas(phone);
  const agendar = useAgendarMedicao(phone);
  const arquivar = useArquivarMedicaoAgendada(phone);
  const registrar = useRegistrarMedicao(phone);

  const [novo, setNovo] = useState({ tipo: TIPO.PRESSAO, horarios: "08:00" });
  const [medida, setMedida] = useState({ tipo: TIPO.PRESSAO, texto: "" });
  const [erroAgendar, setErroAgendar] = useState("");
  const [erroMedida, setErroMedida] = useState("");
  const [okMedida, setOkMedida] = useState("");
  const [removendo, setRemovendo] = useState(null);

  async function salvarAgendamento(e) {
    e.preventDefault();
    setErroAgendar("");
    try {
      await agendar.mutateAsync({
        tipo: novo.tipo,
        scheduleTimes: novo.horarios,
        patientName,
      });
      setNovo({ tipo: TIPO.PRESSAO, horarios: "08:00" });
    } catch (err) {
      setErroAgendar(err.message);
    }
  }

  async function salvarMedida(e) {
    e.preventDefault();
    setErroMedida(""); setOkMedida("");
    try {
      const r = await registrar.mutateAsync({ tipo: medida.tipo, texto: medida.texto });
      setOkMedida(
        r.alerta
          ? `Registrado. ⚠️ Fora do limiar (${r.alerta}) — a equipe foi avisada.`
          : "Registrado."
      );
      setMedida((m) => ({ ...m, texto: "" }));
    } catch (err) {
      setErroMedida(err.message);
    }
  }

  const lista = medicoes.data || [];
  const alertas = lista.filter((m) => m.alerta).length;

  return (
    <div className="card" id="card-medicoes">
      <h3>🩺 Pressão e glicemia</h3>
      <div className="card-subtitle">
        Valores informados pelo paciente no WhatsApp ou registrados pela equipe.
        {alertas > 0 && (
          <>
            {" "}<strong className="texto-erro">{alertas} fora do limiar</strong> nos últimos 90 dias.
          </>
        )}
      </div>

      {/* ---- lembretes ---- */}
      <div className="medicoes-bloco">
        <strong>Lembretes de medição</strong>
        {agendadas.isLoading && <Loading />}
        {(agendadas.data || []).map((a) => (
          <div key={a.id} className="medicoes-linha">
            <span>
              <strong>{ROTULO[a.tipo]}</strong> às {a.scheduleTimes.split(",").join(", ")}
            </span>
            <button className="btn-icon btn-archive" title="Encerrar lembrete"
              onClick={() => setRemovendo(a)}>🗑️</button>
          </div>
        ))}
        {!agendadas.isLoading && !(agendadas.data || []).length && (
          <div className="small texto-suave">Nenhum lembrete ativo.</div>
        )}

        <form onSubmit={salvarAgendamento} className="medicoes-form">
          <select value={novo.tipo} onChange={(e) => setNovo({ ...novo, tipo: e.target.value })}>
            <option value={TIPO.PRESSAO}>Pressão</option>
            <option value={TIPO.GLICEMIA}>Glicemia</option>
          </select>
          <input
            placeholder="08:00, 20:00"
            value={novo.horarios}
            onChange={(e) => setNovo({ ...novo, horarios: e.target.value })}
          />
          <button className="primary btn-compacto" disabled={agendar.isPending}>
            {agendar.isPending ? "Salvando..." : "➕ Agendar lembrete"}
          </button>
        </form>
        <Message type="error">{erroAgendar}</Message>
      </div>

      {/* ---- registrar agora ---- */}
      <div className="medicoes-bloco">
        <strong>Registrar medida agora</strong>
        <div className="small">
          Passa pela mesma validação e pelo mesmo limiar do WhatsApp.
        </div>
        <form onSubmit={salvarMedida} className="medicoes-form">
          <select value={medida.tipo} onChange={(e) => setMedida({ ...medida, tipo: e.target.value })}>
            <option value={TIPO.PRESSAO}>Pressão</option>
            <option value={TIPO.GLICEMIA}>Glicemia</option>
          </select>
          <input
            placeholder={EXEMPLO[medida.tipo]}
            value={medida.texto}
            onChange={(e) => setMedida({ ...medida, texto: e.target.value })}
          />
          <button className="primary btn-compacto" disabled={registrar.isPending || !medida.texto.trim()}>
            {registrar.isPending ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <Message type="error">{erroMedida}</Message>
        {okMedida && <Message type={okMedida.includes("⚠️") ? "warning" : "success"}>{okMedida}</Message>}
      </div>

      {/* ---- histórico ---- */}
      <div className="medicoes-bloco">
        <strong>Últimos 90 dias</strong>
        {medicoes.isLoading && <Loading />}
        {!medicoes.isLoading && !lista.length && (
          <div className="state-msg">Nenhuma medida registrada.</div>
        )}
        {lista.length > 0 && (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr><th>Quando</th><th>Tipo</th><th>Valor</th><th>Origem</th><th>Alerta</th></tr>
              </thead>
              <tbody>
                {lista.map((m) => (
                  <tr key={m.id} className={m.alerta ? "medicao-alerta" : ""}>
                    <td>{formatarDataHora(m.medidoEm)}</td>
                    <td>{ROTULO[m.tipo]}</td>
                    <td>
                      <strong>{valorLegivel(m)}</strong>
                      {/* O texto original fica visível ao passar o mouse:
                          é o registro; o número ao lado é a leitura. */}
                      <span className="small texto-suave" title={`Escrito pelo paciente: “${m.textoOriginal}”`}>
                        {" "}ⓘ
                      </span>
                    </td>
                    <td className="small">{m.origem === "equipe" ? "👤 equipe" : "📱 WhatsApp"}</td>
                    <td className="small">{m.alerta ? <span className="texto-erro">⚠️ {m.alerta}</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!removendo}
        title="Encerrar lembrete"
        confirmLabel="Encerrar"
        danger
        onCancel={() => setRemovendo(null)}
        onConfirm={async () => {
          await arquivar.mutateAsync(removendo.id);
          setRemovendo(null);
        }}
      >
        <p>
          Encerrar o lembrete de <strong>{removendo && ROTULO[removendo.tipo]}</strong>? As
          medidas já registradas continuam no histórico.
        </p>
      </ConfirmDialog>
    </div>
  );
}

function valorLegivel(m) {
  if (m.tipo === TIPO.PRESSAO) return `${m.sistolica}/${m.diastolica} mmHg`;
  return `${Number(m.valor)} mg/dL`;
}

function formatarDataHora(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}
