import { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import {
  useDoctors,
  useCriarMedico,
  useAlternarMedico,
  useRemoverMedico,
  useVincularPaciente,
} from "../api.js";
import { normalizeBRPhone, formatBRPhone } from "../../lib/phone.js";

export default function MedicosPage() {
  const { data: medicos = [], isLoading, error, refetch } = useDoctors();

  return (
    <>
      <PageHeader
        title="Médicos"
        subtitle="Gerencie médicos cadastrados e vínculos com pacientes"
      />

      <div className="grid-2">
        <CadastrarMedico />
        <VincularPaciente medicos={medicos} />
      </div>

      <div className="card">
        <h3>Médicos Cadastrados</h3>
        <div className="card-subtitle">
          Médicos inativos não recebem ofertas de consulta mas mantêm vínculo
          histórico com pacientes.
        </div>

        {isLoading && <Loading />}
        {error && <ErrorState error={error} onRetry={refetch} />}
        {!isLoading && !error && !medicos.length && (
          <div className="state-msg">Nenhum médico cadastrado.</div>
        )}

        {!!medicos.length && <TabelaMedicos medicos={medicos} />}
      </div>
    </>
  );
}

function CadastrarMedico() {
  const criar = useCriarMedico();
  const [f, setF] = useState({ name: "", email: "", phone: "", crm: "", password: "" });
  const [msg, setMsg] = useState(null);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  async function enviar(e) {
    e.preventDefault();
    setMsg(null);

    // Mesma normalização do painel médico: o telefone é a identidade no
    // WhatsApp, e duas regras diferentes criariam cadastros divergentes.
    const norm = normalizeBRPhone(f.phone);
    if (!norm.ok) {
      setMsg({ tipo: "error", texto: norm.reason });
      return;
    }
    if (f.password.length < 8) {
      setMsg({ tipo: "error", texto: "A senha provisória precisa ter pelo menos 8 caracteres." });
      return;
    }

    try {
      await criar.mutateAsync({ ...f, phone: norm.phone });
      setMsg({ tipo: "success", texto: `✅ ${f.name} cadastrado(a).` });
      setF({ name: "", email: "", phone: "", crm: "", password: "" });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  return (
    <div className="card">
      <h3>Cadastrar Médico</h3>
      <form onSubmit={enviar}>
        <label htmlFor="mdNome">Nome</label>
        <input id="mdNome" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome completo do médico" />

        <label htmlFor="mdEmail">Email</label>
        <input id="mdEmail" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" />

        <label htmlFor="mdTel">Telefone (WhatsApp)</label>
        <input id="mdTel" inputMode="numeric" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ex: 12999999999" />

        <label htmlFor="mdCrm">CRM</label>
        <input id="mdCrm" value={f.crm} onChange={(e) => set("crm", e.target.value)} placeholder="Ex: CRM/SP 123456" />

        <label htmlFor="mdSenha">Senha provisória</label>
        <input id="mdSenha" type="password" autoComplete="new-password" value={f.password} onChange={(e) => set("password", e.target.value)} />
        <div className="small">Mínimo de 8 caracteres. O médico troca depois em “Alterar Senha”.</div>

        {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

        <button className="primary" disabled={criar.isPending}>
          {criar.isPending ? "Cadastrando..." : "Cadastrar Médico"}
        </button>
      </form>
    </div>
  );
}

function VincularPaciente({ medicos }) {
  const vincular = useVincularPaciente();
  const [f, setF] = useState({ doctorId: "", patientPhone: "", patientName: "" });
  const [msg, setMsg] = useState(null);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  async function enviar(e) {
    e.preventDefault();
    setMsg(null);

    if (!f.doctorId) {
      setMsg({ tipo: "error", texto: "Selecione um médico." });
      return;
    }
    const norm = normalizeBRPhone(f.patientPhone);
    if (!norm.ok) {
      setMsg({ tipo: "error", texto: norm.reason });
      return;
    }

    try {
      await vincular.mutateAsync({ ...f, patientPhone: norm.phone });
      setMsg({ tipo: "success", texto: "✅ Paciente vinculado." });
      setF({ doctorId: f.doctorId, patientPhone: "", patientName: "" });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    }
  }

  return (
    <div className="card">
      <h3>Vincular Paciente ao Médico</h3>
      <div className="card-subtitle">
        Depois de vinculado, o médico passa a ver o paciente no painel dele e
        pode cadastrar medicações.
      </div>

      <form onSubmit={enviar}>
        <label htmlFor="vpMedico">Médico</label>
        <select id="vpMedico" value={f.doctorId} onChange={(e) => set("doctorId", e.target.value)}>
          <option value="">Selecione um médico</option>
          {medicos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} {d.crm ? `— ${d.crm}` : ""}
            </option>
          ))}
        </select>

        <label htmlFor="vpTel">Telefone do paciente</label>
        <input id="vpTel" inputMode="numeric" value={f.patientPhone} onChange={(e) => set("patientPhone", e.target.value)} placeholder="Ex: 12999998888" />

        <label htmlFor="vpNome">Nome do paciente (opcional)</label>
        <input id="vpNome" value={f.patientName} onChange={(e) => set("patientName", e.target.value)} />

        {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

        <button className="primary" disabled={vincular.isPending}>
          {vincular.isPending ? "Vinculando..." : "Vincular Paciente"}
        </button>
      </form>
    </div>
  );
}

function TabelaMedicos({ medicos }) {
  const alternar = useAlternarMedico();
  const remover = useRemoverMedico();
  const [removendo, setRemovendo] = useState(null);

  return (
    <>
      <div className="tabela-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CRM</th>
              <th>Função</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((d) => {
              const ativo = d.active !== false;
              return (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{formatBRPhone(d.phone)}</td>
                  <td>{d.crm || "—"}</td>
                  <td>{d.role || "medico"}</td>
                  <td>
                    <span className={ativo ? "status-pill status-ativa" : "status-pill status-arquivada"}>
                      {ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="item-actions">
                      <button
                        className="btn-soap"
                        onClick={() => alternar.mutate({ id: d.id, desativar: ativo })}
                      >
                        {ativo ? "Desativar" : "Reativar"}
                      </button>
                      <button className="btn-soap btn-soap-danger" onClick={() => setRemovendo(d)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!removendo}
        title="Excluir médico"
        confirmLabel="Excluir"
        danger
        onCancel={() => setRemovendo(null)}
        onConfirm={async () => {
          await remover.mutateAsync(removendo.id);
          setRemovendo(null);
        }}
      >
        <p>
          Excluir <strong>{removendo?.name}</strong> do sistema?
        </p>
        <p className="confirm-warn">
          Se a intenção é só tirar de circulação, use <strong>Desativar</strong>:
          o médico para de receber ofertas mas o histórico com os pacientes
          continua legível.
        </p>
      </ConfirmDialog>
    </>
  );
}
