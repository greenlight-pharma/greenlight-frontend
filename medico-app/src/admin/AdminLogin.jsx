import { useState } from "react";
import { useAdminAuth } from "./AdminAuth.jsx";
import Message from "../components/Message.jsx";

export default function AdminLogin() {
  const { login, expiredNotice } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setBusy(true);
    try {
      await login(email.trim(), senha);
    } catch (err) {
      setErro(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="loginScreen">
      <form className="login-card" onSubmit={enviar}>
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
        </div>
        <div className="subtitle">Painel Administrativo</div>

        {expiredNotice && <Message type="warning">{expiredNotice}</Message>}

        <label htmlFor="admEmail">Email</label>
        <input
          id="admEmail"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="admSenha">Senha</label>
        <input
          id="admSenha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button className="primary" style={{ width: "100%" }} disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>

        <Message type="error">{erro}</Message>
      </form>
    </div>
  );
}
