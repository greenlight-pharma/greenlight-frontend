import { useState } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { useUpdateBasicData } from "./api.js";

// [PATIENT-OVERRIDE] Corrige nome, idade e sexo biológico do paciente.
// Importa mais do que parece: idade e sexo são o que habilita o card de
// rastreios, e o nome é o que aparece na mensagem do WhatsApp.
export default function EditBasicModal({ phone, patient, onClose }) {
  const salvar = useUpdateBasicData(phone);
  const [f, setF] = useState({
    name: patient?.name || "",
    patientAge: patient?.patientAge ?? "",
    biologicalSex: patient?.biologicalSex || "",
  });
  const [erro, setErro] = useState("");

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  async function submeter(e) {
    e.preventDefault();
    setErro("");
    if (!f.name.trim()) {
      setErro("O nome do paciente é obrigatório.");
      return;
    }
    try {
      await salvar.mutateAsync({
        name: f.name.trim(),
        patientAge: f.patientAge === "" ? null : Number(f.patientAge),
        biologicalSex: f.biologicalSex || null,
      });
      onClose();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <Modal open title="Editar dados do paciente" onClose={onClose}>
      <form onSubmit={submeter}>
        <label htmlFor="ebNome">Nome</label>
        <input id="ebNome" value={f.name} onChange={(e) => set("name", e.target.value)} />

        <div className="grid-2">
          <div>
            <label htmlFor="ebIdade">Idade</label>
            <input
              id="ebIdade"
              type="number"
              min="0"
              max="120"
              value={f.patientAge}
              onChange={(e) => set("patientAge", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ebSexo">Sexo biológico</label>
            <select
              id="ebSexo"
              value={f.biologicalSex}
              onChange={(e) => set("biologicalSex", e.target.value)}
            >
              <option value="">Não informado</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>
        </div>
        <div className="small">
          Idade e sexo biológico habilitam o card de rastreios por faixa etária.
        </div>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
