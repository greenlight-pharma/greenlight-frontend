import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EditBasicModal from "./EditBasicModal.jsx";
import { dataHoraBR } from "./PatientItem.jsx";
import { api } from "../../lib/api.js";
import { calcBMI } from "../../lib/calculators.js";
import { formatBRPhone } from "../../lib/phone.js";

// [PRONTUARIO] Card "📋 Dados" — primeiro do prontuário, igual ao medico.html:
// identificação do paciente e, no mesmo card (separado por linha), o histórico
// de antropometria e sinais vitais.
export default function DadosCard({ phone, patient, linkedToMe }) {
  const [editando, setEditando] = useState(false);

  const sexoLabel =
    patient?.biologicalSex === "feminino"
      ? "Feminino"
      : patient?.biologicalSex === "masculino"
        ? "Masculino"
        : "Não informado";

  const campos = [
    { label: "Nome", value: patient?.name || "—" },
    { label: "Telefone", value: patient?.phone ? formatBRPhone(patient.phone) : formatBRPhone(phone) },
    { label: "Idade", value: patient?.patientAge ? `${patient.patientAge} anos` : "—" },
    { label: "Sexo biológico", value: sexoLabel },
    {
      label: "Vínculo",
      value: linkedToMe ? "Sim, vinculado a você" : "Não vinculado (acesso por consulta)",
    },
  ];

  return (
    <div className="card" id="card-dados">
      <h3>📋 Dados</h3>

      <div className="patient-data-grid">
        {campos.map((f) => (
          <div className="data-field" key={f.label}>
            <div className="data-label">{f.label}</div>
            <div className="data-value">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Telefone fica fora da edição de propósito: é a chave do histórico
          e a identidade do paciente no WhatsApp. */}
      <div style={{ marginTop: 12 }}>
        <button className="primary btn-compacto" onClick={() => setEditando(true)}>
          Editar dados
        </button>
      </div>

      <AnthroSecao phone={phone} />

      {editando && (
        <EditBasicModal phone={phone} patient={patient} onClose={() => setEditando(false)} />
      )}
    </div>
  );
}

// [ANTHRO] Antropometria vive DENTRO do card de Dados, como no medico.html —
// é dado de identificação/acompanhamento, não card próprio.
function AnthroSecao({ phone }) {
  const qc = useQueryClient();
  const [aberto, setAberto] = useState(false);
  const [removendo, setRemovendo] = useState(null);

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ["paciente", phone, "anthro"],
    queryFn: () => api.get(`/patients/${phone}/anthropometrics`),
    enabled: !!phone,
  });

  const remover = useMutation({
    mutationFn: (id) => api.del(`/patients/${phone}/anthropometrics/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone, "anthro"] }),
  });

  return (
    <div className="anthro-secao">
      <div className="anthro-cabecalho">
        <strong>Antropometria e sinais vitais</strong>
        <button className="primary btn-compacto" onClick={() => setAberto(true)}>
          ➕ Registrar medida
        </button>
      </div>
      <div className="card-subtitle">
        Histórico de medidas. Cada registro guarda a data — útil pra acompanhar
        evolução.
      </div>

      {isLoading && <div className="state-msg">Carregando...</div>}
      {!isLoading && !registros.length && (
        <div className="state-msg">Nenhuma medida registrada.</div>
      )}

      {registros.map((r) => {
        // O IMC é calculado na hora a partir de peso e altura, nunca gravado:
        // um IMC persistido pode ficar em desacordo com os valores que o geraram.
        const imc = calcBMI(r.weightKg, r.heightCm);
        return (
          <div className="anthro-linha" key={r.id}>
            <div>
              <div className="anthro-valores">
                {r.weightKg != null && <span>Peso {r.weightKg} kg</span>}
                {r.heightCm != null && <span>Altura {r.heightCm} cm</span>}
                {imc && <span className="anthro-imc">IMC {imc.toFixed(1)}</span>}
                {r.waistCm != null && <span>Circ. abd. {r.waistCm} cm</span>}
                {(r.systolicBP != null || r.diastolicBP != null) && (
                  <span>
                    PA {r.systolicBP ?? "?"}/{r.diastolicBP ?? "?"} mmHg
                  </span>
                )}
                {r.heartRate != null && <span>FC {r.heartRate} bpm</span>}
              </div>
              {r.notes && <div className="texto-suave">{r.notes}</div>}
              <div className="anthro-data">
                {dataHoraBR(r.measuredAt || r.createdAt)}
                {r.doctorName && ` · ${r.doctorName}`}
              </div>
            </div>
            <button
              className="btn-icon btn-archive"
              title="Remover registro"
              onClick={() => setRemovendo(r)}
            >
              🗑️
            </button>
          </div>
        );
      })}

      {aberto && <AnthroForm phone={phone} onClose={() => setAberto(false)} />}

      <ConfirmDialog
        open={!!removendo}
        title="Remover medida"
        confirmLabel="Remover"
        danger
        onCancel={() => setRemovendo(null)}
        onConfirm={async () => {
          await remover.mutateAsync(removendo.id);
          setRemovendo(null);
        }}
      >
        <p>Remover este registro de antropometria do prontuário?</p>
      </ConfirmDialog>
    </div>
  );
}

function AnthroForm({ phone, onClose }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    weightKg: "",
    heightCm: "",
    waistCm: "",
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    notes: "",
  });
  const [erro, setErro] = useState("");

  const salvar = useMutation({
    mutationFn: (body) => api.post(`/patients/${phone}/anthropometrics`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paciente", phone, "anthro"] });
      onClose();
    },
  });

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const imc = calcBMI(f.weightKg, f.heightCm);

  async function submeter(e) {
    e.preventDefault();
    setErro("");
    // Campo vazio vira null: o backend distingue "não medido" de zero.
    const body = Object.fromEntries(
      Object.entries(f).map(([k, v]) => [k, v === "" ? null : v])
    );
    try {
      await salvar.mutateAsync(body);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <Modal open title="Registrar medidas" onClose={onClose}>
      <form onSubmit={submeter}>
        <div className="grid-2">
          <div>
            <label htmlFor="anPeso">Peso (kg)</label>
            <input id="anPeso" inputMode="decimal" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
          </div>
          <div>
            <label htmlFor="anAlt">Altura (cm)</label>
            <input id="anAlt" inputMode="decimal" value={f.heightCm} onChange={(e) => set("heightCm", e.target.value)} />
          </div>
        </div>

        {imc && (
          <div className="dose-hint">
            <strong>IMC calculado:</strong> {imc.toFixed(1)} kg/m²
          </div>
        )}

        <div className="grid-3">
          <div>
            <label htmlFor="anCint">Cintura (cm)</label>
            <input id="anCint" inputMode="decimal" value={f.waistCm} onChange={(e) => set("waistCm", e.target.value)} />
          </div>
          <div>
            <label htmlFor="anSis">PA sistólica</label>
            <input id="anSis" inputMode="numeric" value={f.systolicBP} onChange={(e) => set("systolicBP", e.target.value)} />
          </div>
          <div>
            <label htmlFor="anDia">PA diastólica</label>
            <input id="anDia" inputMode="numeric" value={f.diastolicBP} onChange={(e) => set("diastolicBP", e.target.value)} />
          </div>
        </div>

        <label htmlFor="anFc">Frequência cardíaca (bpm)</label>
        <input id="anFc" inputMode="numeric" value={f.heartRate} onChange={(e) => set("heartRate", e.target.value)} />

        <label htmlFor="anObs">Observações</label>
        <textarea id="anObs" value={f.notes} onChange={(e) => set("notes", e.target.value)} />

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando..." : "Registrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
