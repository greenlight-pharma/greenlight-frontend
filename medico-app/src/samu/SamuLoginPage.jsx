import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext.jsx";
import Message from "../components/Message.jsx";

// Mesma casca visual do login do médico, mas a credencial é outra: no SAMU
// a pessoa é identificada pelo registro do conselho, não por e-mail.
export default function SamuLoginPage() {
  const { login, expiredNotice } = useAuth();
  const [registro, setRegistro] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    setEntrando(true);
    try {
      await login(registro.trim(), senha);
    } catch (ex) {
      setErro(ex.message);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div id="loginScreen">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
        </div>
        <div className="subtitle">Passagem de plantão</div>

        {expiredNotice && <Message type="warning">{expiredNotice}</Message>}

        <label htmlFor="registro">Registro profissional</label>
        <input
          id="registro"
          autoFocus
          autoComplete="username"
          placeholder="COREN-RJ 000000"
          value={registro}
          onChange={(e) => setRegistro(e.target.value)}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <Message type="error">{erro}</Message>}

        <button className="primary" type="submit" disabled={entrando || !registro || !senha}>
          {entrando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
