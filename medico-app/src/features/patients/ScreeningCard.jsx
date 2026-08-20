import { rastreiosAplicaveis } from "../../lib/screening.js";

// Apoio a rastreios por faixa etária/sexo. Não decide nem comunica ao
// paciente — e mostra a divergência entre diretrizes quando existe, em vez
// de escolher uma por conta própria.
export default function ScreeningCard({ patient }) {
  const r = rastreiosAplicaveis(patient);

  return (
    <div className="card">
      <h3>🔎 Rastreios a considerar</h3>

      {!r.ok ? (
        <div className="state-msg">
          Sem {r.faltando.join(" e ")} registrado(s). Os rastreios por faixa
          aparecem quando esses dados existem.
        </div>
      ) : (
        <>
          <div className="perfil-linha">
            Para sexo biológico <strong>{r.sexo}</strong>,{" "}
            <strong>{r.idade} anos</strong> — rastreios geralmente considerados
            nesta faixa:
          </div>

          {!r.itens.length && (
            <div className="state-msg">
              Nenhum rastreio por faixa etária nesta combinação de idade e sexo.
            </div>
          )}

          {r.itens.map((g) => (
            <div className="rastreio" key={g.nome}>
              <div className="rastreio-nome">{g.nome}</div>
              <div className="rastreio-faixa">{g.faixaTexto}</div>
              {g.nota && <div className="rastreio-nota">{g.nota}</div>}
              {g.divergencia && (
                <div className="rastreio-divergencia">
                  ⚠️ <strong>Diretrizes divergem:</strong> {g.divergencia}
                </div>
              )}
              <div className="rastreio-fonte">Fonte: {g.fonte}</div>
            </div>
          ))}

          <div className="calc-aviso">
            Lista de apoio por faixa etária. A indicação é sua, considerando
            histórico e o caso.
          </div>
        </>
      )}
    </div>
  );
}
