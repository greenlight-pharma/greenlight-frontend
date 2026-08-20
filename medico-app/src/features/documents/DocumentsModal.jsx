import { useState } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { montarDocumento, receitaDasMedicacoes, TIPOS } from "./documento.js";
import { textoParaPDF, nomeArquivoSeguro, copiarTexto } from "../../lib/pdf.js";
import { useAuth } from "../auth/AuthContext.jsx";

const ABAS = [
  { id: "receita", rotulo: "Receita" },
  { id: "atestado", rotulo: "Atestado" },
  { id: "pedido", rotulo: "Pedido de exames" },
];

export default function DocumentsModal({ paciente, medications = [], onClose }) {
  const { doctor } = useAuth();
  const [aba, setAba] = useState("receita");
  const [medico, setMedico] = useState({ nome: doctor?.name || "", crm: doctor?.crm || "" });
  const [corpos, setCorpos] = useState({
    // A receita já nasce preenchida com as medicações ativas do prontuário —
    // é o caso mais comum e evita redigitar o que o sistema já sabe.
    receita: receitaDasMedicacoes(medications),
    atestado: "",
    pedido: "",
  });
  const [cid, setCid] = useState("");
  const [indicacao, setIndicacao] = useState("");
  const [msg, setMsg] = useState(null);
  const [gerando, setGerando] = useState(false);

  function documentoAtual() {
    return montarDocumento({
      tipo: aba,
      medico,
      paciente,
      corpo: corpos[aba],
      cid,
      indicacao,
    });
  }

  async function baixarPDF() {
    setMsg(null);
    setGerando(true);
    try {
      const d = documentoAtual();
      await textoParaPDF(d.texto, nomeArquivoSeguro(d.arquivo, paciente?.name));
      setMsg({ tipo: "success", texto: "✅ PDF gerado." });
    } catch (e) {
      setMsg({
        tipo: "error",
        texto: e.message || "Erro ao gerar PDF. Você ainda pode copiar o texto.",
      });
    } finally {
      setGerando(false);
    }
  }

  async function copiar() {
    const ok = await copiarTexto(documentoAtual().texto);
    setMsg(
      ok
        ? { tipo: "success", texto: "✅ Texto copiado." }
        : { tipo: "error", texto: "Não foi possível copiar — selecione o texto e copie manualmente." }
    );
  }

  const set = (v) => setCorpos((c) => ({ ...c, [aba]: v }));

  return (
    <Modal open wide title="Documentos" onClose={onClose}>
      <div className="modal-warning">
        Documentos para <strong>imprimir, assinar e carimbar</strong>. O sistema
        não assina nada e não gera validade digital.
      </div>

      <div className="grid-2">
        <div>
          <label htmlFor="docNome">Médico(a)</label>
          <input
            id="docNome"
            value={medico.nome}
            onChange={(e) => setMedico((m) => ({ ...m, nome: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="docCrm">CRM</label>
          <input
            id="docCrm"
            value={medico.crm}
            placeholder="Ex: SP 123456"
            onChange={(e) => setMedico((m) => ({ ...m, crm: e.target.value }))}
          />
        </div>
      </div>

      <div className="consultas-tabs" style={{ marginTop: 14 }}>
        {ABAS.map((a) => (
          <button
            key={a.id}
            className={aba === a.id ? "consultas-tab active" : "consultas-tab"}
            onClick={() => setAba(a.id)}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      <label htmlFor="docCorpo">{TIPOS[aba].titulo}</label>
      <textarea
        id="docCorpo"
        className="soap-campo"
        value={corpos[aba]}
        placeholder={
          aba === "receita"
            ? "Um item por bloco. Ex: Losartana — 50mg\\n   1 comprimido pela manhã"
            : aba === "atestado"
              ? "Ex: Atesto para os devidos fins que o(a) paciente necessita de afastamento por 2 (dois) dias a partir desta data."
              : "Um exame por linha. Ex: Hemograma completo"
        }
        onChange={(e) => set(e.target.value)}
      />

      {aba === "atestado" && (
        <>
          <label htmlFor="docCid">CID (opcional)</label>
          <input id="docCid" value={cid} onChange={(e) => setCid(e.target.value)} />
          <div className="small">
            Informe o CID apenas com anuência do paciente — o diagnóstico é
            informação sigilosa.
          </div>
        </>
      )}

      {aba === "pedido" && (
        <>
          <label htmlFor="docInd">Indicação clínica (opcional)</label>
          <input id="docInd" value={indicacao} onChange={(e) => setIndicacao(e.target.value)} />
        </>
      )}

      <label>Pré-visualização</label>
      <pre className="doc-preview">{documentoAtual().texto}</pre>

      {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

      <div className="modal-actions">
        <button className="btn-secondary-outline" onClick={onClose}>
          Fechar
        </button>
        <button className="btn-secondary-outline" onClick={copiar}>
          Copiar texto
        </button>
        <button className="primary" onClick={baixarPDF} disabled={gerando}>
          {gerando ? "Gerando..." : "Baixar PDF"}
        </button>
      </div>
    </Modal>
  );
}
