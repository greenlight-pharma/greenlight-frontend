import { useState } from "react";
import MedicationForm from "./MedicationForm.jsx";
import AdherencePanel from "./AdherencePanel.jsx";
import useMedicationClass from "./useMedicationClass.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { PatientItem, Badge, ItemHeader, ItemMeta, ItemBody } from "../patients/PatientItem.jsx";
import { useArchiveMedication } from "./api.js";
import { parseScheduleTimes, isExpired } from "../../lib/schedule.js";

// [PRONTUARIO] Card "💊 Medicações", no padrão do medico.html: lista única
// (ativas e arquivadas), item com badge de propriedade, ações só nas próprias
// e não arquivadas.
//
// A adesão entra como seção DENTRO deste card — não como card solto no meio
// do prontuário, que foi o que bagunçou a ordem original. O lugar dela é
// junto das medicações, porque é sobre elas que ela fala.
export default function MedicacoesCard({
  phone,
  patientName,
  medications = [],
  adesaoPorMed = [],
  respostasAdesao = [],
  falhas,
  evolucao = [],
}) {
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [arquivando, setArquivando] = useState(null);
  const arquivar = useArchiveMedication(phone);

  return (
    <div className="card" id="card-medicacoes">
      <h3>💊 Medicações</h3>
      <div className="card-subtitle">
        Ativas e arquivadas. Inclui prescrições de outros médicos.
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          className="primary btn-compacto"
          onClick={() => {
            setEditando(null);
            setFormAberto(true);
          }}
        >
          ➕ Adicionar medicação
        </button>
      </div>

      {!medications.length && <div className="state-msg">Nenhuma medicação registrada.</div>}

      {medications.map((med) => (
        <MedicacaoItem
          key={med.id}
          med={med}
          adesao={adesaoPorMed.find((a) => a.medicationId === med.id)}
          onEdit={() => {
            setEditando(med);
            setFormAberto(true);
          }}
          onArchive={() => setArquivando(med)}
        />
      ))}

      <AdherencePanel
        resumo={adesaoPorMed}
        respostas={respostasAdesao}
        falhas={falhas}
        evolucao={evolucao}
      />

      {formAberto && (
        <MedicationForm
          open
          phone={phone}
          patientName={patientName}
          medication={editando}
          onClose={() => {
            setFormAberto(false);
            setEditando(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!arquivando}
        title="Arquivar medicação"
        confirmLabel="Arquivar"
        danger
        onCancel={() => setArquivando(null)}
        onConfirm={async () => {
          await arquivar.mutateAsync(arquivando.id);
          setArquivando(null);
        }}
      >
        <p>
          Arquivar <strong>{arquivando?.medicationName}</strong> de{" "}
          <strong>{patientName || "este paciente"}</strong>?
        </p>
        <ul>
          <li>Sai desta lista</li>
          <li>
            <strong>Para de enviar lembretes ao paciente</strong>
          </li>
          <li>Continua no banco para histórico clínico</li>
        </ul>
        <p className="confirm-warn">Não é possível desfazer pelo painel.</p>
      </ConfirmDialog>
    </div>
  );
}

function MedicacaoItem({ med, adesao, onEdit, onArchive }) {
  const classe = useMedicationClass(med.medicationName);
  const horarios = parseScheduleTimes(med.scheduleTimes);
  const arquivada = !!med.archivedAt;
  const vencida = isExpired(med);

  const meta = [
    classe,
    med.doctorName && `Prescrita por: ${med.doctorName}`,
    med.scheduleTimes && `Horários: ${med.scheduleTimes}`,
  ].filter(Boolean);

  return (
    <PatientItem isMine={med.isMine}>
      <ItemHeader
        title={`${med.medicationName || "—"} ${med.dose ? `(${med.dose})` : ""}`.trim()}
      >
        <div className="item-header-right">
          <span className={arquivada ? "status-pill status-arquivada" : "status-pill status-ativa"}>
            {arquivada ? "Arquivada" : med.status || "Ativa"}
          </span>
          <Badge isMine={med.isMine} />
        </div>
      </ItemHeader>

      <ItemMeta>{meta.join(" • ") || "—"}</ItemMeta>

      {/* Avisos de lembrete que não dispara. O médico não tem como
          descobrir isso de outro jeito pelo painel. */}
      {!arquivada && !horarios.ok && (
        <div className="med-alert">
          ⚠ Horário em formato antigo ({med.scheduleTimes || "vazio"}) — o
          lembrete não está sendo enviado até ser corrigido.
        </div>
      )}
      {!arquivada && vencida && med.status === "ativo" && (
        <div className="med-alert">
          ⚠ O tratamento terminou e a medicação continua ativa — o paciente
          ainda recebe lembrete. Encerre ou arquive.
        </div>
      )}

      {med.instructions && <ItemBody preserveLineBreaks>{med.instructions}</ItemBody>}

      {adesao?.esperadas > 0 && (
        <div className={adesao.efeito_colateral > 0 ? "adesao-inline adesao-erro" : "adesao-inline"}>
          {adesao.efeito_colateral > 0 && (
            <strong>🚨 {adesao.efeito_colateral} relato(s) de efeito colateral. </strong>
          )}
          {adesao.tomou} de {adesao.esperadas} doses confirmadas · {adesao.nao_tomou} não tomadas ·{" "}
          {adesao.semResposta} sem resposta.
        </div>
      )}

      {/* Só edita/arquiva o que é seu e não está arquivado — regra do
          medico.html, mantida. */}
      {med.isMine && !arquivada && (
        <div className="item-actions">
          <button className="btn-soap" onClick={onEdit}>
            ✏️ Editar
          </button>
          <button className="btn-soap btn-soap-danger" onClick={onArchive}>
            🗑️ Arquivar
          </button>
        </div>
      )}
    </PatientItem>
  );
}
