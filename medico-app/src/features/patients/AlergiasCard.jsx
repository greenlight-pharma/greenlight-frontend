import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import { useClinicalProfile, useSaveClinicalProfile } from "./api.js";

// [PRONTUARIO] Card "⚠️ Alergias e comorbidades" — vem logo depois de Dados,
// como no medico.html. Posição é decisão de segurança: é o que o médico
// precisa ver ANTES de prescrever.
export default function AlergiasCard({ phone }) {
  const { data, isLoading } = useClinicalProfile(phone);
  const salvar = useSaveClinicalProfile(phone);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ allergies: "", chronicConditions: "" });
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        allergies: data.allergies || "",
        chronicConditions: data.chronicConditions || data.comorbidities || "",
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

  const alergias = data?.allergies?.trim();
  const comorbidades = (data?.chronicConditions || data?.comorbidities || "").trim();

  return (
    <div className="card" id="card-alergias">
      <h3>⚠️ Alergias e comorbidades</h3>
      <div className="card-subtitle">Informação de segurança. Confira antes de prescrever.</div>

      <div style={{ marginBottom: 12 }}>
        <button className="primary btn-compacto" onClick={() => setAberto(true)}>
          Editar
        </button>
      </div>

      {isLoading ? (
        <div className="state-msg">Carregando...</div>
      ) : (
        <div className="perfil-conteudo">
          <div className="perfil-linha">
            <strong>Alergias:</strong>{" "}
            {alergias ? (
              <span className="destaque-alerta">{alergias}</span>
            ) : (
              /* Campo em branco seria lido como "não tem alergia". Dizer que
                 não foi registrado é a diferença entre não saber e afirmar. */
              <span className="texto-suave">
                não registrado — não assumir ausência
              </span>
            )}
          </div>
          <div className="perfil-linha">
            <strong>Comorbidades:</strong>{" "}
            {comorbidades || <span className="texto-suave">não registrado</span>}
          </div>
        </div>
      )}

      <Modal open={aberto} title="Alergias e comorbidades" onClose={() => setAberto(false)}>
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
            value={form.chronicConditions}
            onChange={(e) => setForm((f) => ({ ...f, chronicConditions: e.target.value }))}
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
