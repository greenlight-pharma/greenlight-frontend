import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import useDebounced from "../medications/useDebounced.js";
import { useCreateManualPatient, usePatientLookup } from "./api.js";
import { normalizeBRPhone, formatBRPhone } from "../../lib/phone.js";

// [MANUAL-PATIENT] Cadastro de paciente que ainda não falou com o bot.
// Fluxo real em UBS: paciente chega ao balcão, nunca mandou WhatsApp.
//
// [CADASTRO-ENXUTO] `enxuto` é o modo do painel da UBS, onde cadastrar
// paciente serve a UM fim: mandar o lembrete de medicação. Ali o formulário
// pede só o que a mensagem precisa — nome (a mensagem chama pelo nome) e
// telefone (é a identidade no WhatsApp).
//
// Queixa principal, HMA, idade e sexo saem porque são campos de PRONTUÁRIO.
// Quem opera na recepção não tem essa informação e não está numa consulta;
// obrigá-la a preencher produz dado inventado, que é pior que dado ausente
// porque parece informação para quem ler depois.
//
// No modo normal (painel médico) nada muda — inclusive a queixa continua
// obrigatória, agora validada aqui em vez de voltar como erro 400 do
// servidor.
export default function ManualPatientModal({ open, onClose, enxuto = false }) {
  const navigate = useNavigate();
  const criar = useCreateManualPatient();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    biologicalSex: "",
    mainComplaint: "",
    hma: "",
    notifyPatient: true,
  });
  const [erro, setErro] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const norm = normalizeBRPhone(form.phone);
  const telefoneCanonico = norm.ok ? norm.phone : "";
  const telefoneDebounced = useDebounced(telefoneCanonico, 400);
  const { data: lookup } = usePatientLookup(telefoneDebounced);

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    // Mesma normalização usada na consulta acima. Se fossem duas funções,
    // dava pra verificar um número e cadastrar outro.
    if (!norm.ok) {
      setErro(norm.reason);
      return;
    }
    if (!enxuto && !form.mainComplaint.trim()) {
      setErro("Queixa principal é obrigatória.");
      return;
    }
    try {
      await criar.mutateAsync({ ...form, phone: norm.phone });
      onClose();
      // No modo enxuto o cadastro é meio, não fim: o objetivo era a
      // medicação. Abrir o formulário dela já aberto evita que a atendente
      // cadastre a pessoa e feche a tela achando que terminou — que é como
      // se acumula paciente cadastrado sem nenhum lembrete configurado.
      navigate(`/pacientes/${norm.phone}`, {
        state: enxuto ? { novaMedicacao: true } : undefined,
      });
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <Modal open={open} title="Cadastrar paciente" onClose={onClose}>
      <form onSubmit={salvar}>
        <div className="modal-context">
          {enxuto ? (
            <>
              💡 Cadastre o paciente para <strong>receber os lembretes</strong>. Na
              tela seguinte você adiciona a medicação e os horários.
            </>
          ) : (
            <>
              💡 Use este cadastro quando o paciente{" "}
              <strong>ainda não interagiu</strong> com a Vytal pelo WhatsApp.
            </>
          )}
        </div>

        <label htmlFor="mpName">Nome do paciente</label>
        <input id="mpName" value={form.name} onChange={(e) => set("name", e.target.value)} />

        <label htmlFor="mpPhone">Telefone (WhatsApp)</label>
        <input
          id="mpPhone"
          inputMode="numeric"
          placeholder="11999998888"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <div className="small">
          {form.phone && !norm.ok ? (
            <span className="texto-alerta">{norm.reason}</span>
          ) : (
            telefoneCanonico && <>Será salvo como {formatBRPhone(telefoneCanonico)}</>
          )}
        </div>

        {lookup?.principal && (
          <Message type="warning">
            ℹ️ Já existe cadastro para este número
            {lookup.principal.patient?.name ? `: ${lookup.principal.patient.name}` : ""}.
            Ao continuar, você será vinculado(a) a ele.
          </Message>
        )}

        {/* [BR-PHONE-9DIG] O caso que cria paciente-fantasma: o mesmo número
            já existe na outra grafia (com/sem o nono dígito). Se cadastrar
            assim mesmo, viram dois registros e o lembrete vai para o número
            que o WhatsApp do paciente não usa. */}
        {lookup?.emOutraGrafia && (
          <Message type="warning">
            ⚠️ <strong>Atenção:</strong> já existe cadastro para{" "}
            {formatBRPhone(lookup.emOutraGrafia.phoneConsultado)} — o{" "}
            <strong>mesmo número</strong> na outra grafia (com/sem o 9). Cadastrar
            este vai criar um paciente duplicado, e só um dos dois recebe o
            lembrete no WhatsApp. Confirme com o paciente qual número ele usa.
          </Message>
        )}

        {!enxuto && (
        <div className="grid-2">
          <div>
            <label htmlFor="mpAge">Idade</label>
            <input
              id="mpAge"
              type="number"
              min="0"
              max="120"
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="mpSex">Sexo biológico</label>
            <select
              id="mpSex"
              value={form.biologicalSex}
              onChange={(e) => set("biologicalSex", e.target.value)}
            >
              <option value="">Não informado</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>
        </div>
        )}

        {!enxuto && (
          <>
            <label htmlFor="mpQueixa">Queixa principal</label>
            <input
              id="mpQueixa"
              value={form.mainComplaint}
              onChange={(e) => set("mainComplaint", e.target.value)}
            />

            <label htmlFor="mpHma">História da moléstia atual (opcional)</label>
            <textarea
              id="mpHma"
              value={form.hma}
              onChange={(e) => set("hma", e.target.value)}
            />
          </>
        )}

        <label className="checkbox-linha">
          <input
            type="checkbox"
            checked={form.notifyPatient}
            onChange={(e) => set("notifyPatient", e.target.checked)}
          />
          <span>
            <strong>Avisar paciente por WhatsApp</strong> — envia mensagem de
            boas-vindas explicando o serviço.
          </span>
        </label>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" disabled={criar.isPending}>
            {criar.isPending
              ? "Cadastrando..."
              : enxuto
                ? "Cadastrar e adicionar medicação"
                : "Cadastrar e abrir prontuário"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
