import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { useClinicalProfile, useSaveClinicalProfile } from "./api.js";

// Alergias e comorbidades. Fica em card próprio porque é o dado que o médico
// precisa ver ANTES de prescrever — e o lembrete de medicação depende de
// prescrição correta.
export default function ClinicalProfileCard({ phone }) {
  const { data, isLoading } = useClinicalProfile(phone);
  const salvar = useSaveClinicalProfile(phone);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ allergies: "", comorbidities: "" });
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        allergies: data.allergies || "",
        comorbidities: data.comorbidities || "",
      });
    }
  }, [data]);

  async function submeter(e) {
    e.preventDefault();
    setErro("");
    try {
      await salvar.mutateAsync(form);
      setAberto(false);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>🩺 Perfil clínico</h3>
        <button className="btn-secondary-outline" onClick={() => setAberto(true)}>
          Editar
        </button>
      </div>

      {isLoading ? (
        <div className="state-msg">Carregando...</div>
      ) : (
        <>
          <div className="perfil-linha">
            <strong>Alergias:</strong>{" "}
            {data?.allergies ? (
              <span className="destaque-alerta">{data.allergies}</span>
            ) : (
              <span className="texto-suave">não informado</span>
            )}
          </div>
          <div className="perfil-linha">
            <strong>Comorbidades:</strong>{" "}
            {data?.comorbidities || <span className="texto-suave">não informado</span>}
          </div>
        </>
      )}

      <Modal open={aberto} title="Perfil clínico" onClose={() => setAberto(false)}>
        <form onSubmit={submeter}>
          <label htmlFor="cpAlergias">Alergias</label>
          <textarea
            id="cpAlergias"
            value={form.allergies}
            onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
            placeholder="Ex: dipirona, penicilina"
          />

          <label htmlFor="cpComorb">Comorbidades</label>
          <textarea
            id="cpComorb"
            value={form.comorbidities}
            onChange={(e) => setForm((f) => ({ ...f, comorbidities: e.target.value }))}
            placeholder="Ex: HAS, DM2"
          />

          <Message type="error">{erro}</Message>

          <div className="modal-actions">
            <button type="button" className="btn-secondary-outline" onClick={() => setAberto(false)}>
              Cancelar
            </button>
            <button className="primary" disabled={salvar.isPending}>
              {salvar.isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
