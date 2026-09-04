import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import Message from "../../components/Message.jsx";
import SignupPage from "./SignupPage.jsx";

export default function LoginPage({ subtitle = "Painel Médico", permiteCadastro = false }) {
  const { login, expiredNotice } = useAuth();
  // O cadastro só aparece onde faz sentido comercialmente. No painel da UBS
  // e no administrativo, quem cria conta é a organização — abrir cadastro
  // ali seria porta destrancada sem motivo.
  const [criandoConta, setCriandoConta] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (criandoConta) return <SignupPage onVoltar={() => setCriandoConta(false)} />;

  return (
    <div id="loginScreen">
      {/* <form> de verdade: Enter envia. No painel antigo o botão tinha
          onclick e digitar Enter na senha não fazia nada. */}
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
        </div>
        <div className="subtitle">{subtitle}</div>

        {expiredNotice && <Message type="warning">{expiredNotice}</Message>}

        <label htmlFor="loginEmail">Email</label>
        <input
          id="loginEmail"
          type="email"
          autoComplete="username"
          placeholder="Email cadastrado pelo administrador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="loginPassword">Senha</label>
        <input
          id="loginPassword"
          type="password"
          autoComplete="current-password"
          placeholder="Senha cadastrada pelo administrador"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary" style={{ width: "100%" }} disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>

        <Message type="error">{error}</Message>

        {permiteCadastro && (
          <button type="button" className="link-botao" onClick={() => setCriandoConta(true)}>
            Criar conta
          </button>
        )}
      </form>
    </div>
  );
}
