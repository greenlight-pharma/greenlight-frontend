import { useState } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { useAnalyzeExam } from "./api.js";
import { agruparPorPainel, getExamDescription, EXAM_STATUS_STYLE } from "../../lib/examPanels.js";

// [EXAM-ANALYSIS] Mostra a estruturação do laudo: organiza os valores por
// painel e diz se cada um está dentro ou fora da faixa DO PRÓPRIO LAUDO.
//
// Limite deliberado, mantido do original: isto NÃO classifica clinicamente.
// "Fora da referência" é comparação com a faixa impressa no papel, não
// diagnóstico. A descrição de cada exame diz o que ele MEDE — nunca o que
// significa estar alterado.
export default function ExamAnalysisModal({ phone, exam, onClose }) {
  const analisar = useAnalyzeExam(phone);
  const [analise, setAnalise] = useState(exam.analysis || null);
  const [erro, setErro] = useState("");

  async function gerar() {
    setErro("");
    try {
      const r = await analisar.mutateAsync(exam.id);
      setAnalise(r?.content || r);
    } catch (e) {
      setErro(e.message);
    }
  }

  const info = analise?.dataInfo;
  const grupos = agruparPorPainel(analise?.exams || []);
  const alterados = (analise?.exams || []).filter((e) => e.status === "alterado").length;

  return (
    <Modal open wide title="Análise estruturada do laudo" onClose={onClose}>
      <div className="modal-context">
        📄 {exam.fileName}
      </div>

      {!analise && (
        <>
          <p className="texto-suave">
            A análise lê o PDF e organiza os valores por painel. Não classifica
            clinicamente — só estrutura o que está no laudo.
          </p>
          <button className="primary" onClick={gerar} disabled={analisar.isPending}>
            {analisar.isPending ? "Analisando o laudo…" : "Gerar análise"}
          </button>
        </>
      )}

      <Message type="error">{erro}</Message>

      {/* O laudo pode não ser legível ou nem ser laudo. Nesse caso o backend
          devolve dataInfo.error — mostrar isso é melhor que uma tela vazia. */}
      {info?.error && (
        <Message type="warning">
          Não foi possível estruturar este laudo: {info.error}
        </Message>
      )}

      {analise && !info?.error && (
        <>
          <div className="analise-cabecalho">
            {info?.examDate && <span>Realizado em {formatarData(info.examDate)}</span>}
            {info?.laboratory && <span>Laboratório: {info.laboratory}</span>}
            {info?.patientName && <span>Paciente no laudo: {info.patientName}</span>}
          </div>

          <div className={alterados ? "analise-resumo alterado" : "analise-resumo"}>
            {alterados
              ? `${alterados} valor(es) fora da faixa de referência do laudo`
              : "Todos os valores dentro da faixa de referência do laudo"}
          </div>

          {grupos.map((g) => (
            <div className="painel" key={g.key}>
              <div className="painel-titulo">{g.label}</div>
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Exame</th>
                    <th>Valor</th>
                    <th>Referência</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {g.exams.map((e, i) => {
                    const estilo = EXAM_STATUS_STYLE[e.status] || EXAM_STATUS_STYLE.sem_referencia;
                    const descricao = getExamDescription(e.name);
                    return (
                      <tr key={`${e.name}-${i}`}>
                        <td>
                          <span title={descricao || undefined} className={descricao ? "com-dica" : ""}>
                            {e.name}
                          </span>
                        </td>
                        <td>
                          {e.value} {e.unit}
                        </td>
                        <td className="texto-suave">{e.reference || "—"}</td>
                        <td>
                          <span
                            className="status-exame"
                            style={{ background: estilo.bg, color: estilo.color }}
                          >
                            {estilo.icon} {estilo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}

          <div className="calc-aviso">
            Organização dos dados do laudo, sem classificação clínica.
            “Fora da referência” compara com a faixa impressa no próprio exame.
          </div>
        </>
      )}

      <div className="modal-actions">
        <button className="btn-secondary-outline" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}

function formatarData(iso) {
  if (!iso) return "—";
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}
