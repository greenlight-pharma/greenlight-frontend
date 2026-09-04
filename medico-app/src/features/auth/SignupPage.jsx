import { useState } from "react";
import Message from "../../components/Message.jsx";
import { useAuth } from "./AuthContext.jsx";
import { useCriarConta } from "../assinatura/api.js";

// [CADASTRO] Criação de conta pelo próprio médico.
//
// Depois de criar, faz login na sequência com as mesmas credenciais em vez
// de aproveitar o token do cadastro. É um round-trip a mais e vale: o
// caminho de entrada passa a ser um só, então uma quebra no login aparece
// aqui na hora, e não só para quem volta no dia seguinte.
export default function SignupPage({ onVoltar }) {
  const criar = useCriarConta();
  const { login } = useAuth();
  const [f, setF] = useState({
    name: "", email: "", crm: "", password: "", aceitouTermos: false,
  });
  const [erro, setErro] = useState("");
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    try {
      await criar.mutateAsync(f);
      await login(f.email.trim(), f.password);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div id="loginScreen">
      <form className="login-card" onSubmit={enviar}>
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}vytalsaude.png`} alt="Vytal" />
        </div>
        <div className="subtitle">Criar conta</div>

        <label htmlFor="suNome">Nome</label>
        <input id="suNome" value={f.name} onChange={(e) => set("name", e.target.value)} />

        <label htmlFor="suCrm">CRM</label>
        <input
          id="suCrm"
          placeholder="CRM/SP 123456"
          value={f.crm}
          onChange={(e) => set("crm", e.target.value)}
        />

        <label htmlFor="suEmail">E-mail</label>
        <input
          id="suEmail"
          type="email"
          autoComplete="username"
          value={f.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <label htmlFor="suSenha">Senha</label>
        <input
          id="suSenha"
          type="password"
          autoComplete="new-password"
          placeholder="Ao menos 8 caracteres"
          value={f.password}
          onChange={(e) => set("password", e.target.value)}
        />

        <label className="checkbox-linha">
          <input
            type="checkbox"
            checked={f.aceitouTermos}
            onChange={(e) => set("aceitouTermos", e.target.checked)}
          />
          <span>
            Li e aceito os <a href="/termos" target="_blank" rel="noreferrer">termos de uso</a>.
          </span>
        </label>

        <div className="small">
          Você começa no plano gratuito, com até 5 pacientes. Sem cartão.
        </div>

        <Message type="error">{erro}</Message>

        <button className="primary" style={{ width: "100%" }} disabled={criar.isPending}>
          {criar.isPending ? "Criando..." : "Criar conta"}
        </button>

        <button type="button" className="link-botao" onClick={onVoltar}>
          Já tenho conta
        </button>
      </form>
    </div>
  );
}
