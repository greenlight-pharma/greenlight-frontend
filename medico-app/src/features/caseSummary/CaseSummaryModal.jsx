import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { api } from "../../lib/api.js";
import { montarResumoDoCaso } from "./resumo.js";
import { textoParaPDF, nomeArquivoSeguro, copiarTexto } from "../../lib/pdf.js";

// Resumo do caso para transferência de cuidado: encaminhamento, plantão,
// referência/contrarreferência. Sai em texto (para colar) ou PDF.
export default function CaseSummaryModal({ phone, summary, onClose }) {
  const [msg, setMsg] = useState(null);
  const [gerando, setGerando] = useState(false);

  const { data: perfil } = useQuery({
    queryKey: ["paciente", phone, "clinical-profile"],
    queryFn: () => api.get(`/patients/${phone}/clinical-profile`),
  });
  const { data: anthro = [] } = useQuery({
    queryKey: ["paciente", phone, "anthro"],
    queryFn: () => api.get(`/patients/${phone}/anthropometrics`),
  });

  const texto = useMemo(
    () =>
      montarResumoDoCaso({
        patient: summary?.patient,
        phone,
        clinicalProfile: perfil,
        anthro,
        appointments: summary?.appointments || [],
        medications: summary?.medications || [],
        exams: summary?.exams || [],
      }),
    [summary, perfil, anthro, phone]
  );

  async function baixarPDF() {
    setMsg(null);
    setGerando(true);
    try {
      await textoParaPDF(texto, nomeArquivoSeguro("resumo_caso", summary?.patient?.name));
      setMsg({ tipo: "success", texto: "✅ PDF gerado." });
    } catch (e) {
      setMsg({ tipo: "error", texto: e.message || "Erro ao gerar PDF. O texto acima pode ser copiado." });
    } finally {
      setGerando(false);
    }
  }

  return (
    <Modal open wide title="Resumo do caso" onClose={onClose}>
      <div className="modal-context">
        Para encaminhamento, plantão ou contrarreferência. Confira o conteúdo
        antes de compartilhar — a responsabilidade é de quem compartilha.
      </div>

      <pre className="doc-preview" style={{ maxHeight: "50vh" }}>
        {texto}
      </pre>

      {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

      <div className="modal-actions">
        <button className="btn-secondary-outline" onClick={onClose}>
          Fechar
        </button>
        <button
          className="btn-secondary-outline"
          onClick={async () => {
            const ok = await copiarTexto(texto);
            setMsg(
              ok
                ? { tipo: "success", texto: "✅ Texto copiado." }
                : { tipo: "error", texto: "Não foi possível copiar — selecione o texto e copie manualmente." }
            );
          }}
        >
          Copiar texto
        </button>
        <button className="primary" onClick={baixarPDF} disabled={gerando}>
          {gerando ? "Gerando..." : "Baixar PDF"}
        </button>
      </div>
    </Modal>
  );
}
