import { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Message from "../../components/Message.jsx";
import { api } from "../../lib/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AccountPage() {
  const { doctor } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setMsg(null);

    // Validação no cliente antes de gastar a ida ao servidor. A confirmação
    // não existia no painel antigo — errar a digitação da senha nova
    // trancava o médico fora do sistema sem aviso.
    if (form.newPassword.length < 8) {
      setMsg({ tipo: "error", texto: "A nova senha precisa ter pelo menos 8 caracteres." });
      return;
    }
    if (form.newPassword !== form.confirm) {
      setMsg({ tipo: "error", texto: "A confirmação não confere com a nova senha." });
      return;
    }

    setBusy(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ tipo: "success", texto: "✅ Senha alterada com sucesso." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setMsg({ tipo: "error", texto: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Minha conta" subtitle={doctor?.email} />
      <div className="card card-estreito">
        <form onSubmit={salvar}>
          <label htmlFor="pwAtual">Senha atual</label>
          <input
            id="pwAtual"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => set("currentPassword", e.target.value)}
          />

          <label htmlFor="pwNova">Nova senha</label>
          <input
            id="pwNova"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) => set("newPassword", e.target.value)}
          />
          <div className="small">Mínimo de 8 caracteres.</div>

          <label htmlFor="pwConfirma">Confirme a nova senha</label>
          <input
            id="pwConfirma"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
          />

          {msg && <Message type={msg.tipo}>{msg.texto}</Message>}

          <button className="primary" disabled={busy}>
            {busy ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </>
  );
}
