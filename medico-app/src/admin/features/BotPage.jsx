import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Message from "../../components/Message.jsx";
import { Loading } from "../../components/Loading.jsx";
import {
  useBotConfig,
  useSalvarBotConfig,
  useMensagemPaciente,
  useContarDestinatarios,
  useBroadcast,
} from "../api.js";
import { normalizeBRPhone, formatBRPhone } from "../../lib/phone.js";

const LIMITE = 2000;

export default function BotPage() {
  return (
    <>
      <PageHeader
        title="Bot & Mensagens"
        subtitle="Controle como o assistente do WhatsApp trabalha e envie mensagens aos pacientes."
      />
      <ComportamentoDoBot />
      <MensagemParaUm />
      <MensagemParaTodos />
    </>
  );
}

function ComportamentoDoBot() {
  const { data, isLoading } = useBotConfig();
  const salvar = useSalvarBotConfig();
  const [cfg, setCfg] = useState({ schedulingEnabled: false, checkinEnabled: false });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (data) {
      setCfg({
        schedulingEnabled: !!data.schedulingEnabled,
        checkinEnabled: !!data.checkinEnabled,
      });
    }
  }, [data]);

  async function enviar() {
    setMsg(null);
    try {
      await salvar.mutateAsync(cfg);
      setMsg({ tipo: "success", texto: "✅ Configuração salva." });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  if (isLoading) return <div className="card"><Loading /></div>;

  return (
    <div className="card">
      <h3>Comportamento do bot</h3>
      <div className="card-subtitle">
        Mudanças valem para novas conversas. O bot continua tirando dúvidas e
        orientando normalmente — estes controles afetam apenas as funções abaixo.
      </div>

      <Chave
        titulo="Agendamento de consultas"
        descricao="Quando desligado, o bot não marca consultas (orienta procurar a clínica)."
        valor={cfg.schedulingEnabled}
        onChange={(v) => setCfg((c) => ({ ...c, schedulingEnabled: v }))}
      />

      <Chave
        titulo="Check-in diário"
        descricao="Quando desligado, nenhum paciente recebe a pergunta diária de acompanhamento. O lembrete de medicação NÃO é afetado."
        valor={cfg.checkinEnabled}
        onChange={(v) => setCfg((c) => ({ ...c, checkinEnabled: v }))}
      />

      {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

      <button className="primary" onClick={enviar} disabled={salvar.isPending}>
        {salvar.isPending ? "Salvando..." : "Salvar configuração"}
      </button>
    </div>
  );
}

function Chave({ titulo, descricao, valor, onChange }) {
  return (
    <label className="chave-linha">
      <span>
        <strong>{titulo}</strong>
        <span className="chave-descricao">{descricao}</span>
      </span>
      <span className="switch">
        <input type="checkbox" checked={valor} onChange={(e) => onChange(e.target.checked)} />
        <span className="slider" />
      </span>
    </label>
  );
}

function MensagemParaUm() {
  const enviar = useMensagemPaciente();
  const [telefone, setTelefone] = useState("");
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState(null);

  async function submeter(e) {
    e.preventDefault();
    setMsg(null);

    const norm = normalizeBRPhone(telefone);
    if (!norm.ok) {
      setMsg({ tipo: "error", texto: norm.reason });
      return;
    }
    if (!texto.trim()) {
      setMsg({ tipo: "error", texto: "Escreva a mensagem antes de enviar." });
      return;
    }

    try {
      await enviar.mutateAsync({ phone: norm.phone, message: texto.trim() });
      setMsg({ tipo: "success", texto: `✅ Mensagem enviada para ${formatBRPhone(norm.phone)}.` });
      setTexto("");
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  return (
    <div className="card">
      <h3>Mensagem para um paciente</h3>
      <form onSubmit={submeter}>
        <label htmlFor="msgTel">Telefone do paciente</label>
        <input id="msgTel" inputMode="numeric" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Ex: 12999998888" />

        <label htmlFor="msgTexto">Mensagem</label>
        <textarea
          id="msgTexto"
          rows={4}
          maxLength={LIMITE}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Texto que será enviado ao paciente via WhatsApp"
        />
        <div className="small">{texto.length} / {LIMITE}</div>

        {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

        <button className="primary" disabled={enviar.isPending}>
          {enviar.isPending ? "Enviando..." : "Enviar ao paciente"}
        </button>
      </form>
    </div>
  );
}

// [BROADCAST] Disparo para TODA a base. A confirmação em dois passos —
// contar destinatários e digitar ENVIAR — é do admin.html e é mantida de
// propósito: é a única ação do sistema que atinge todos os pacientes de uma
// vez, é irreversível, e disparo indevido pode derrubar o número do WhatsApp.
function MensagemParaTodos() {
  const contar = useContarDestinatarios();
  const disparar = useBroadcast();
  const [texto, setTexto] = useState("");
  const [total, setTotal] = useState(null);
  const [confirmacao, setConfirmacao] = useState("");
  const [msg, setMsg] = useState(null);

  const liberado = confirmacao.trim().toUpperCase() === "ENVIAR";

  async function verificar() {
    setMsg(null);
    if (!texto.trim()) {
      setMsg({ tipo: "error", texto: "Escreva a mensagem antes de verificar." });
      return;
    }
    try {
      const r = await contar.mutateAsync();
      setTotal(r?.count ?? r?.total ?? 0);
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  function cancelar() {
    setTotal(null);
    setConfirmacao("");
  }

  async function enviarTudo() {
    setMsg(null);
    try {
      await disparar.mutateAsync({ message: texto.trim() });
      setMsg({ tipo: "success", texto: `✅ Mensagem disparada para ${total} paciente(s).` });
      setTexto("");
      cancelar();
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  return (
    <div className="card">
      <h3>Mensagem para TODOS os pacientes</h3>

      <div className="modal-warning">
        ⚠️ <strong>Ação irreversível e em massa.</strong> Envia a mesma mensagem para
        todos os pacientes da base. Use só para avisos operacionais legítimos.
        Disparo em massa indevido pode bloquear o número do WhatsApp e tem
        implicações de privacidade.
      </div>

      <label htmlFor="bcTexto">Mensagem</label>
      <textarea
        id="bcTexto"
        rows={4}
        maxLength={LIMITE}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          // Mudou o texto? A confirmação anterior não vale mais — senão dá
          // para verificar um texto e disparar outro.
          if (total !== null) cancelar();
        }}
        placeholder="Texto que será enviado a TODOS os pacientes"
      />
      <div className="small">{texto.length} / {LIMITE}</div>

      {total === null ? (
        <button className="btn-secondary-outline" onClick={verificar} disabled={contar.isPending}>
          {contar.isPending ? "Verificando..." : "Verificar destinatários"}
        </button>
      ) : (
        <div className="broadcast-confirma">
          <div className="broadcast-total">
            Esta mensagem será enviada para <strong>{total} paciente(s)</strong>.
          </div>
          <label htmlFor="bcConfirma">
            Para confirmar, digite <strong>ENVIAR</strong> abaixo:
          </label>
          <input
            id="bcConfirma"
            autoComplete="off"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            placeholder="ENVIAR"
          />
          <div className="item-actions">
            <button
              className="btn-danger"
              onClick={enviarTudo}
              disabled={!liberado || disparar.isPending}
            >
              {disparar.isPending ? "Disparando..." : "Disparar para todos"}
            </button>
            <button className="btn-secondary-outline" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {msg && <Message type={msg.tipo}>{msg.texto}</Message>}
    </div>
  );
}
