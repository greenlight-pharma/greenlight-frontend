import { useState } from "react";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Loading } from "../../components/Loading.jsx";
import Icone from "../../components/Icone.jsx";
import TimesEditor from "../../components/TimesEditor.jsx";
import { serializeScheduleTimes, endDateFromDuration } from "../../lib/schedule.js";
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

  // [MESMO-DESENHO-DA-MEDICACAO] Horários pelo mesmo editor (com atalhos de
  // frequência) e duração pela mesma escolha de duas opções. São a mesma
  // decisão clínica — "com que frequência e por quanto tempo" — e ver duas
  // interfaces diferentes para ela no mesmo painel é o que faz o médico
  // desconfiar de qual delas está certa.
  const [novo, setNovo] = useState({
    tipo: TIPO.PRESSAO,
    times: ["08:00"],
    duracaoModo: "",
    duracaoDias: "",
  });
  const [medida, setMedida] = useState({ tipo: TIPO.PRESSAO, texto: "" });
  const [erroAgendar, setErroAgendar] = useState("");
  const [erroMedida, setErroMedida] = useState("");
  const [okMedida, setOkMedida] = useState("");
  const [removendo, setRemovendo] = useState(null);

  const dias = Number(novo.duracaoDias);
  const inicio = hojeISO();
  const fimCalculado =
    novo.duracaoModo === "dias" && dias > 0 ? endDateFromDuration(inicio, dias) : "";

  async function salvarAgendamento(e) {
    e.preventDefault();
    setErroAgendar("");

    const horarios = serializeScheduleTimes(novo.times);
    if (!horarios) {
      setErroAgendar("Informe ao menos um horário válido.");
      return;
    }
    // Mesma exigência da medicação, pelo mesmo motivo: nenhum padrão é
    // seguro. Assumir contínuo faz a série de 7 dias perguntar para sempre;
    // assumir prazo encerra em silêncio o acompanhamento do hipertenso.
    if (novo.duracaoModo !== "continuo" && !(dias > 0)) {
      setErroAgendar("Informe por quantos dias, ou marque acompanhamento contínuo.");
      return;
    }

    try {
      await agendar.mutateAsync({
        tipo: novo.tipo,
        scheduleTimes: horarios,
        patientName,
        startDate: inicio,
        // Contínuo é ausência de fim — é assim que o cron entende "não para".
        endDate: novo.duracaoModo === "continuo" ? null : fimCalculado,
      });
      setNovo({ tipo: TIPO.PRESSAO, times: ["08:00"], duracaoModo: "", duracaoDias: "" });
    } catch (err) {
      setErroAgendar(err.message);
    }
  }

  async function salvarMedida(e) {
    e.preventDefault();
    setErroMedida(""); setOkMedida("");
    try {
      const r = await registrar.mutateAsync({ tipo: medida.tipo, texto: medida.texto });
      // Não diz "a equipe foi avisada": o alerta não sai mais por WhatsApp
      // (ver [SO-NO-PAINEL] no backend). Dizer isso faria a recepção supor
      // que alguém já foi acionado, e ninguém foi.
      setOkMedida(
        r.alerta
          ? `Registrado. ⚠️ Fora do limiar (${r.alerta}) — fica destacado no histórico abaixo.`
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
              {/* Mostrar o fim é o que deixa visível que o pedido PARA. Sem
                  isso ninguém sabe se aquilo vai perguntar para sempre. */}
              <span className="small">
                {" · "}
                {a.endDate
                  ? `até ${formatarDataBR(String(a.endDate).slice(0, 10))}`
                  : "acompanhamento contínuo"}
              </span>
            </span>
            <button className="btn-icon btn-archive" onClick={() => setRemovendo(a)}>
              <Icone nome="lixeira" tamanho={15} />
              <span>Encerrar</span>
            </button>
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
          <div className="medicoes-agendar">
            <label>Horários</label>
            <TimesEditor
              times={novo.times}
              onChange={(t) => setNovo({ ...novo, times: t })}
            />

            <label>Por quanto tempo</label>
            <div className="duracao-escolha">
              <button
                type="button"
                className={novo.duracaoModo === "continuo" ? "duracao-opcao ativa" : "duracao-opcao"}
                aria-pressed={novo.duracaoModo === "continuo"}
                onClick={() => setNovo({ ...novo, duracaoModo: "continuo", duracaoDias: "" })}
              >
                Acompanhamento contínuo
              </button>
              <button
                type="button"
                className={novo.duracaoModo === "dias" ? "duracao-opcao ativa" : "duracao-opcao"}
                aria-pressed={novo.duracaoModo === "dias"}
                onClick={() => setNovo({ ...novo, duracaoModo: "dias" })}
              >
                Por alguns dias
              </button>
            </div>

            {novo.duracaoModo === "dias" && (
              <div className="duracao-dias-linha">
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  aria-label="Quantidade de dias"
                  value={novo.duracaoDias}
                  onChange={(e) =>
                    setNovo({ ...novo, duracaoDias: e.target.value.replace(/\D/g, "").slice(0, 3) })
                  }
                />
                <span>dias</span>
                {[3, 5, 7, 14, 30].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className="duracao-atalho"
                    onClick={() => setNovo({ ...novo, duracaoDias: String(n) })}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {!novo.duracaoModo && (
              <div className="small texto-alerta">
                Escolha uma das duas — sem isso o pedido de aferição não sabe quando parar.
              </div>
            )}
            {!!fimCalculado && (
              <div className="small">
                Os pedidos terminam em <strong>{formatarDataBR(fimCalculado)}</strong>.
              </div>
            )}

            <button className="primary" disabled={agendar.isPending}>
              {agendar.isPending ? "Salvando..." : "Agendar lembrete"}
            </button>
          </div>
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


function hojeISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function formatarDataBR(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}
