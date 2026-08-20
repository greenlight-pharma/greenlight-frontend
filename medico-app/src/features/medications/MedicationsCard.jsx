import { useState } from "react";
import MedicationForm from "./MedicationForm.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { useArchiveMedication } from "./api.js";
import { parseScheduleTimes, isExpired } from "../../lib/schedule.js";

// Lista de medicações dentro do prontuário. Substitui as DUAS listas do
// painel antigo (a da página global de Medicações, já removida mas com código
// vivo, e a do prontuário) e o par archiveMedication /
// archiveMedicationFromProntuario, que eram a mesma função com textos
// ligeiramente diferentes.
export default function MedicationsCard({ phone, patientName, medications = [], adesaoPorMed = [] }) {
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [arquivando, setArquivando] = useState(null);
  const arquivar = useArchiveMedication(phone);

  const ativas = medications.filter((m) => m.status !== "encerrado" && !m.archivedAt);
  const encerradas = medications.filter((m) => m.status === "encerrado" || m.archivedAt);

  async function confirmarArquivar() {
    await arquivar.mutateAsync(arquivando.id);
    setArquivando(null);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>💊 Medicações</h3>
        <button
          className="primary"
          onClick={() => {
            setEditando(null);
            setFormAberto(true);
          }}
        >
          + Adicionar
        </button>
      </div>

      {!medications.length && (
        <div className="state-msg">Nenhuma medicação cadastrada para este paciente.</div>
      )}

      {ativas.map((med) => (
        <MedicationRow
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

      {encerradas.length > 0 && (
        <details className="med-encerradas">
          <summary>{encerradas.length} medicação(ões) encerrada(s)</summary>
          {encerradas.map((med) => (
            <MedicationRow key={med.id} med={med} readOnly />
          ))}
        </details>
      )}

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
        onConfirm={confirmarArquivar}
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

function MedicationRow({ med, adesao, onEdit, onArchive, readOnly }) {
  const horarios = parseScheduleTimes(med.scheduleTimes);
  const vencida = isExpired(med);
  const inativa = med.status !== "ativo";

  return (
    <div className="med-row">
      <div className="med-main">
        <div className="med-name">
          {med.medicationName} {med.dose && <span className="med-dose">{med.dose}</span>}
          <span className={`status-pill status-${med.status || "ativo"}`}>
            {med.status || "ativo"}
          </span>
        </div>

        <div className="med-times">
          {horarios.ok && horarios.times.length ? (
            <>⏰ {horarios.times.join(" · ")}</>
          ) : (
            <span className="med-alert">
              ⚠ Horário em formato antigo ({med.scheduleTimes || "vazio"}) — o
              lembrete não dispara até ser corrigido.
            </span>
          )}
        </div>

        {/* [FIM-TRATAMENTO] O cron não olha endDate: ele lembra enquanto o
            status for 'ativo'. Uma prescrição vencida e ainda ativa segue
            mandando mensagem. O painel antigo não mostrava isso em lugar
            nenhum — aqui vira aviso explícito com a ação ao lado. */}
        {vencida && med.status === "ativo" && (
          <div className="med-alert">
            ⚠ Tratamento terminou em {formatarData(med.endDate)} e a medicação
            continua ativa — o paciente ainda está recebendo lembrete. Encerre
            ou arquive.
          </div>
        )}

        {med.instructions && <div className="med-instr">📋 {med.instructions}</div>}

        {adesao && <AdesaoInline adesao={adesao} />}

        <div className="med-meta">
          {med.startDate && <>Início: {formatarData(med.startDate)} </>}
          {med.endDate && <>· Término: {formatarData(med.endDate)} </>}
          {med.prescribedBy && <>· Prescrito por: {med.prescribedBy}</>}
        </div>
      </div>

      {!readOnly && (
        <div className="row-actions">
          <button className="btn-icon btn-edit" title="Editar medicação" onClick={onEdit}>
            ✏️
          </button>
          <button className="btn-icon btn-archive" title="Arquivar medicação" onClick={onArchive}>
            🗑️
          </button>
        </div>
      )}
      {inativa && !readOnly && (
        <div className="med-inativa-nota">Sem lembrete (status {med.status})</div>
      )}
    </div>
  );
}

function AdesaoInline({ adesao }) {
  if (!adesao?.total) return null;
  const critico = adesao.efeito_colateral > 0;
  return (
    <div className={critico ? "adesao-inline adesao-erro" : "adesao-inline"}>
      {critico && <strong>🚨 {adesao.efeito_colateral} relato(s) de efeito colateral. </strong>}
      Respondeu {adesao.total} lembrete(s) nos últimos 30 dias — {adesao.tomou} tomou,{" "}
      {adesao.nao_tomou} não tomou.
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return "—";
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}
