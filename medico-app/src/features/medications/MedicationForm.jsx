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
  // [DURACAO-EXPLICITA] Porte do app: a duração deixa de ser um <select> cujo
  // valor vazio significava "contínuo" e vira uma ESCOLHA de duas opções.
  //
  // Não é preferência de estilo. O padrão anterior era inseguro: quem não
  // mexia no campo cadastrava uso contínuo sem saber, e um antibiótico de 7
  // dias virava lembrete eterno. Nenhum default é seguro aqui — assumir
  // contínuo faz o antibiótico tocar para sempre; assumir um prazo cala em
  // silêncio o remédio de pressão. Por isso o formulário cobra a escolha.
  //
  // Ao EDITAR, o modo vem do que está gravado: com endDate é prazo, sem é
  // contínuo — quem já cadastrou não precisa reescolher.
  const [duracaoModo, setDuracaoModo] = useState(() => {
    if (!medication) return "";
    return (medication.endDate || "").slice(0, 10) ? "dias" : "continuo";
  });
  const [duracaoDias, setDuracaoDias] = useState(() =>
    diasEntre(medication?.startDate, medication?.endDate)
  );
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

  // "por 7 dias" é como o médico pensa; endDate é como o banco guarda. A
  // tradução acontece aqui, e não na cabeça dele com um calendário aberto.
  const fimCalculado = useMemo(
    () =>
      duracaoModo === "dias" && Number(duracaoDias) > 0
        ? endDateFromDuration(form.startDate, Number(duracaoDias))
        : "",
    [duracaoModo, duracaoDias, form.startDate]
  );

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    const horarios = serializeScheduleTimes(times);
    if (!form.medicationName.trim() || !form.dose.trim() || !horarios) {
      setErro("Medicação, dose e pelo menos um horário válido são obrigatórios.");
      return;
    }
    if (duracaoModo !== "continuo" && !(Number(duracaoDias) > 0)) {
      setErro("Informe por quantos dias, ou marque uso contínuo.");
      return;
    }

    // Contínuo é ausência de fim — é assim que o cron entende "não para".
    const endDate = duracaoModo === "continuo" ? "" : fimCalculado;
    if (endDate && endDate < form.startDate) {
      setErro("A data de término não pode ser anterior à data de início.");
      return;
    }

    const payload = { ...form, endDate, patientName, times };
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

        <label>Duração do tratamento</label>
        <div className="duracao-escolha">
          <button
            type="button"
            className={duracaoModo === "continuo" ? "duracao-opcao ativa" : "duracao-opcao"}
            aria-pressed={duracaoModo === "continuo"}
            onClick={() => {
              setDuracaoModo("continuo");
              setDuracaoDias("");
            }}
          >
            Uso contínuo
          </button>
          <button
            type="button"
            className={duracaoModo === "dias" ? "duracao-opcao ativa" : "duracao-opcao"}
            aria-pressed={duracaoModo === "dias"}
            onClick={() => setDuracaoModo("dias")}
          >
            Por alguns dias
          </button>
        </div>

        {duracaoModo === "dias" && (
          <div className="duracao-dias-linha">
            <input
              type="number"
              min="1"
              inputMode="numeric"
              aria-label="Quantidade de dias"
              value={duracaoDias}
              onChange={(e) => setDuracaoDias(e.target.value.replace(/\D/g, "").slice(0, 3))}
            />
            <span>dias</span>
            {[5, 7, 10, 14, 30].map((n) => (
              <button
                type="button"
                key={n}
                className="duracao-atalho"
                onClick={() => setDuracaoDias(String(n))}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {!duracaoModo && (
          <div className="small texto-alerta">
            Escolha uma das duas — sem isso o lembrete não sabe quando parar.
          </div>
        )}
        {!!fimCalculado && (
          <div className="small">
            Os lembretes terminam em <strong>{formatarDataBR(fimCalculado)}</strong>.
          </div>
        )}
        {duracaoModo === "continuo" && (
          <div className="small">Os lembretes seguem até alguém encerrar.</div>
        )}

        <details className="avancado">
          <summary>Ajustar data de início</summary>
          <label htmlFor="medStart">Data de início</label>
          <input
            id="medStart"
            type="date"
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
          />
          <div className="small">
            Por padrão é hoje. Mude só se a prescrição começar em outro dia.
          </div>
        </details>

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

function formatarDataBR(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

// Quantos dias o tratamento gravado tem, para reabrir a edição já no modo
// certo. Inclusivo: 08 a 14 são 7 dias, não 6.
function diasEntre(inicio, fim) {
  const a = String(inicio || "").slice(0, 10);
  const b = String(fim || "").slice(0, 10);
  if (!a || !b) return "";
  const d = Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000) + 1;
  return d > 0 ? String(d) : "";
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}
