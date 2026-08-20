import { useState } from "react";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import ExamAnalysisModal from "./ExamAnalysisModal.jsx";
import { useUploadExam, useDeleteExam, downloadExam } from "./api.js";

export default function ExamsCard({ phone, exams = [] }) {
  const upload = useUploadExam(phone);
  const remover = useDeleteExam(phone);
  const [erro, setErro] = useState("");
  const [removendo, setRemovendo] = useState(null);
  const [analisando, setAnalisando] = useState(null);

  async function aoEscolherArquivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");
    try {
      await upload.mutateAsync({ file });
    } catch (err) {
      setErro(err.message);
    } finally {
      e.target.value = ""; // permite reenviar o mesmo arquivo depois de erro
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>📄 Exames</h3>
        <label className="btn-secondary-outline arquivo-btn">
          {upload.isPending ? "Enviando..." : "+ Anexar PDF"}
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={aoEscolherArquivo}
            disabled={upload.isPending}
          />
        </label>
      </div>

      <Message type="error">{erro}</Message>

      {!exams.length && <div className="state-msg">Nenhum exame anexado.</div>}

      {exams.map((ex) => (
        <div className="exam-row" key={ex.id}>
          <div>
            <div className="exam-name">{ex.fileName}</div>
            <div className="exam-meta">
              {formatarData(ex.examDate || ex.uploadedAt)}
              {ex.doctorName && ` · enviado por ${ex.doctorName}`}
              {ex.fileSize ? ` · ${(ex.fileSize / 1024).toFixed(0)} KB` : ""}
            </div>
          </div>
          <div className="row-actions">
            <button
              className="btn-icon"
              title={ex.hasAnalysis ? "Ver análise estruturada" : "Estruturar o laudo"}
              onClick={() => setAnalisando(ex)}
            >
              {ex.hasAnalysis ? "📊" : "🔬"}
            </button>
            <button
              className="btn-icon"
              title="Baixar PDF"
              onClick={() => downloadExam(phone, ex).catch((e) => setErro(e.message))}
            >
              ⬇️
            </button>
            {ex.isMine && (
              <button
                className="btn-icon btn-archive"
                title="Remover exame"
                onClick={() => setRemovendo(ex)}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}

      {analisando && (
        <ExamAnalysisModal phone={phone} exam={analisando} onClose={() => setAnalisando(null)} />
      )}

      <ConfirmDialog
        open={!!removendo}
        title="Remover exame"
        confirmLabel="Remover"
        danger
        onCancel={() => setRemovendo(null)}
        onConfirm={async () => {
          await remover.mutateAsync(removendo.id);
          setRemovendo(null);
        }}
      >
        <p>
          Remover <strong>{removendo?.fileName}</strong> do prontuário? O arquivo
          é apagado e não há como recuperar pelo painel.
        </p>
      </ConfirmDialog>
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}
