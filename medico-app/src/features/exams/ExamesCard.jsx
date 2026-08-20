import { useState } from "react";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import ExamAnalysisModal from "./ExamAnalysisModal.jsx";
import { useUploadExam, useDeleteExam, downloadExam } from "./api.js";
import { PatientItem, Badge, ItemHeader, ItemMeta, dataBR, dataHoraBR } from "../patients/PatientItem.jsx";

// [PRONTUARIO] Exames. São DOIS cards no medico.html, e a separação é
// significativa: laboratorial tem estruturação automática do laudo; imagem
// não tem análise nenhuma — é só o laudo do radiologista.
//
// Na primeira versão do refactor os dois estavam num card só, o que apagava
// essa distinção e ainda deixava o botão de analisar aparecendo em laudo de
// imagem. Aqui o mesmo componente serve os dois casos, com `tipo` decidindo.
export default function ExamesCard({ phone, exams = [], tipo = "lab" }) {
  const upload = useUploadExam(phone);
  const remover = useDeleteExam(phone);
  const [erro, setErro] = useState("");
  const [removendo, setRemovendo] = useState(null);
  const [analisando, setAnalisando] = useState(null);

  const imagem = tipo === "imaging";
  const lista = exams.filter((e) => ((e.examType || "lab") === "imaging") === imagem);

  const cfg = imagem
    ? {
        id: "card-exames-imagem",
        titulo: "🩻 Exames de imagem",
        subtitulo:
          "Laudos de exames de imagem (raio-X, tomografia, ressonância, ultrassom, etc) em PDF. Sem análise automática — apenas o laudo do radiologista.",
        botao: "📎 Anexar Laudo de Imagem (PDF)",
        vazio: "Nenhum laudo de imagem anexado.",
      }
    : {
        id: "card-exames",
        titulo: "🧪 Exames laboratoriais",
        subtitulo:
          "Resultados de exames laboratoriais em PDF. Médicos vinculados podem visualizar; só quem anexou pode apagar.",
        botao: "📎 Anexar Exame (PDF)",
        vazio: "Nenhum exame laboratorial anexado.",
      };

  async function aoEscolherArquivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");
    try {
      await upload.mutateAsync({ file, examType: imagem ? "imaging" : "lab" });
    } catch (err) {
      setErro(err.message);
    } finally {
      e.target.value = ""; // permite reenviar o mesmo arquivo depois de erro
    }
  }

  return (
    <div className="card" id={cfg.id}>
      <h3>{cfg.titulo}</h3>
      <div className="card-subtitle">{cfg.subtitulo}</div>

      <div className="upload-linha">
        <label className="primary btn-compacto arquivo-btn">
          {upload.isPending ? "Enviando..." : cfg.botao}
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

      {!lista.length && <div className="state-msg">{cfg.vazio}</div>}

      {lista.map((ex) => {
        const realizado = dataBR(ex.examDate || ex.analysisExamDate);
        const meta = [
          ex.examDate || ex.analysisExamDate ? `Realizado em ${realizado}` : null,
          ex.doctorName && `Anexado por: ${ex.doctorName}`,
          ex.fileSize ? `${(ex.fileSize / 1024).toFixed(0)} KB` : null,
        ].filter(Boolean);

        return (
          <PatientItem isMine={ex.isMine} key={ex.id}>
            <ItemHeader title={ex.fileName || "Exame"}>
              <Badge isMine={ex.isMine} />
            </ItemHeader>
            <ItemMeta>
              {meta.join(" • ") || `Enviado em ${dataHoraBR(ex.uploadedAt)}`}
            </ItemMeta>

            <div className="item-actions">
              <button
                className="btn-soap"
                onClick={() => downloadExam(phone, ex).catch((e) => setErro(e.message))}
              >
                ⬇️ Baixar PDF
              </button>

              {/* Estruturação de laudo só existe para laboratorial. */}
              {!imagem && (
                <button className="btn-soap" onClick={() => setAnalisando(ex)}>
                  {ex.hasAnalysis ? "📊 Ver análise" : "🔬 Estruturar laudo"}
                </button>
              )}

              {ex.isMine && (
                <button className="btn-soap btn-soap-danger" onClick={() => setRemovendo(ex)}>
                  🗑️ Remover
                </button>
              )}
            </div>
          </PatientItem>
        );
      })}

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
