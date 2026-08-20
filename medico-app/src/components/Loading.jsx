export function Loading({ label = "Carregando..." }) {
  return <div className="state-msg">{label}</div>;
}

export function Empty({ label }) {
  return <div className="state-msg">{label}</div>;
}

// Erro de carregamento COM botão de tentar de novo. No painel antigo, falha
// de rede deixava a tela em "Carregando..." pra sempre — o médico só
// descobria dando F5.
export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-msg state-error">
      <div>{error?.message || "Não foi possível carregar."}</div>
      {onRetry && (
        <button className="btn-secondary-outline" onClick={onRetry} style={{ marginTop: 8 }}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}
