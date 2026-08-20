import Message from "../../components/Message.jsx";

// Casca comum das calculadoras: formulário, erro e resultado no mesmo lugar.
// Garante que o resultado NUNCA fique visível junto de um erro — no painel
// antigo, cada função tinha que lembrar de esconder o resultado antes de
// validar, e esquecer isso deixava número velho na tela ao lado de um erro
// novo (o médico lia o número errado).
export default function CalcShell({ onSubmit, resultado, erro, fonte, children }) {
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
        <button className="primary">Calcular</button>
      </form>

      {erro && <Message type="error">{erro}</Message>}
      {!erro && resultado && <div className="calc-resultado">{resultado}</div>}
      {fonte && <div className="calc-fonte">{fonte}</div>}
    </>
  );
}
