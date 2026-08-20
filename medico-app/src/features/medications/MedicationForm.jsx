import { useState, useMemo } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import TimesEditor from "../../components/TimesEditor.jsx";
import useDebounced from "./useDebounced.js";
import { useMedicationSearch, useMedicationDoses, useCreateMedication, useUpdateMedication } from "./api.js";
import { parseScheduleTimes, serializeScheduleTimes, endDateFromDuration } from "../../lib/schedule.js";

// [MED-FORM] Um formulário para cadastrar E editar.
//
// O medico.html tinha dois modais quase idênticos (addMedicationModal e
// editMedicationModal), duas funções de salvar, dois autocompletes e dois
// editores de horário. Divergiram na prática: só o de cadastro mostrava a
// dica de apresentações comerciais, e só o de edição tinha campo de status.
// Aqui é um componente; o modo edição só acrescenta o campo status.
export default function MedicationForm({ open, onClose, phone, patientName, medication }) {
  const editando = !!medication;
  const parsed = useMemo(
    () => parseScheduleTimes(medication?.scheduleTimes),
    [medication]
  );

  const [form, setForm] = useState(() => ({
    medicationName: medication?.medicationName || "",
    dose: medication?.dose || "",
    startDate: (medication?.startDate || "").slice(0, 10) || hoje(),
    endDate: (medication?.endDate || "").slice(0, 10) || "",
    instructions: medication?.instructions || "",
    status: medication?.status || "ativo",
  }));
  const [times, setTimes] = useState(() =>
    parsed.ok && parsed.times.length ? parsed.times : [""]
  );
  const [duracao, setDuracao] = useState("");
  const [erro, setErro] = useState("");

  const criar = useCreateMedication(phone);
  const atualizar = useUpdateMedication(phone);
  const salvando = criar.isPending || atualizar.isPending;

  const nomeDebounced = useDebounced(form.medicationName, 250);
  const { data: sugestoes = [] } = useMedicationSearch(nomeDebounced);
  const { data: dosesInfo } = useMedicationDoses(nomeDebounced);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // [FIM-TRATAMENTO] "por 7 dias" é como o médico pensa; endDate é como o
  // banco guarda. Traduzimos aqui pra ele não ter que contar no calendário —
  // e pra que tratamento curto não vire lembrete eterno por esquecimento.
  function aplicarDuracao(dias) {
    setDuracao(dias);
    const fim = endDateFromDuration(form.startDate, dias);
    if (fim) set("endDate", fim);
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    const horarios = serializeScheduleTimes(times);
    if (!form.medicationName.trim() || !form.dose.trim() || !horarios) {
      setErro("Medicação, dose e pelo menos um horário válido são obrigatórios.");
      return;
    }
    if (form.endDate && form.endDate < form.startDate) {
      setErro("A data de término não pode ser anterior à data de início.");
      return;
    }

    const payload = { ...form, patientName, times };
    try {
      if (editando) {
        await atualizar.mutateAsync({ id: medication.id, ...payload });
      } else {
        await criar.mutateAsync(payload);
      }
      onClose(true);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <Modal
      open={open}
      title={editando ? "Editar medicação" : "Adicionar medicação"}
      onClose={() => onClose(false)}
    >
      <form onSubmit={salvar}>
        <div className="modal-context">
          💊 {editando ? "Editando para" : "Cadastrando para"}:{" "}
          <strong>{patientName || "—"}</strong>
        </div>

        {editando && (
          <div className="modal-warning">
            ⚠️ A edição substitui os dados existentes. Se mudou o medicamento ou
            a dose principal, considere <strong>arquivar</strong> esta e cadastrar
            uma nova prescrição — preserva melhor o histórico clínico.
          </div>
        )}

        <label htmlFor="medName">Nome da medicação</label>
        <input
          id="medName"
          list="medOptions"
          autoComplete="off"
          placeholder="Comece a digitar... (ex: Losartana)"
          value={form.medicationName}
          onChange={(e) => set("medicationName", e.target.value)}
        />
        <datalist id="medOptions">
          {sugestoes.map((nome) => (
            <option key={nome} value={nome} />
          ))}
        </datalist>
        <div className="small">
          Sugestões baseadas na RENAME 2024. Se não encontrar, pode digitar livre.
        </div>

        {dosesInfo?.commonDoses && (
          <div className="dose-hint">
            <strong>💡 Apresentações comerciais comuns:</strong>{" "}
            {dosesInfo.commonDoses}
            <div className="dose-hint-note">
              Lista apenas informativa. A dose terapêutica depende do caso
              clínico — você decide.
            </div>
          </div>
        )}

        <label htmlFor="medDose">Dose</label>
        <input
          id="medDose"
          placeholder="Ex: 50mg, 5 gotas, conforme prescrição"
          value={form.dose}
          onChange={(e) => set("dose", e.target.value)}
        />

        <label>Horários dos lembretes</label>
        <TimesEditor
          times={times}
          onChange={setTimes}
          legacyValue={!parsed.ok ? medication?.scheduleTimes : ""}
        />

        <div className="grid-2">
          <div>
            <label htmlFor="medStart">Data de início</label>
            <input
              id="medStart"
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="medDuration">Duração</label>
            <select
              id="medDuration"
              value={duracao}
              onChange={(e) => aplicarDuracao(e.target.value)}
            >
              <option value="">Contínuo / definir data</option>
              <option value="5">5 dias</option>
              <option value="7">7 dias</option>
              <option value="10">10 dias</option>
              <option value="14">14 dias</option>
              <option value="30">30 dias</option>
            </select>
          </div>
        </div>

        <label htmlFor="medEnd">Data de término (opcional)</label>
        <input
          id="medEnd"
          type="date"
          value={form.endDate}
          onChange={(e) => {
            setDuracao("");
            set("endDate", e.target.value);
          }}
        />
        <div className="small">
          Sem data de término, o lembrete continua indefinidamente.
        </div>

        {editando && (
          <>
            <label htmlFor="medStatus">Status</label>
            <select
              id="medStatus"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
              <option value="encerrado">Encerrado</option>
            </select>
            <div className="small">
              Apenas medicações <strong>ativas</strong> geram lembrete no WhatsApp.
            </div>
          </>
        )}

        <label htmlFor="medInstr">Orientações ao paciente</label>
        <textarea
          id="medInstr"
          placeholder="Ex: Tomar 1 comprimido após o café da manhã. Pode causar sonolência."
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
        />
        <div className="small">
          Este texto vai literalmente na mensagem do WhatsApp, junto do lembrete.
        </div>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={() => onClose(false)}>
            Cancelar
          </button>
          <button className="primary" disabled={salvando}>
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar medicação"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}
