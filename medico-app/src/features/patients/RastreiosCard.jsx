import { rastreiosAplicaveis } from "../../lib/screening.js";

// [PRONTUARIO] Card "🔎 Rastreios por faixa". APOIO ao médico: não decide,
// não prescreve e nada é enviado ao paciente automaticamente.
export default function RastreiosCard({ patient }) {
  const r = rastreiosAplicaveis(patient);

  return (
    <div className="card" id="card-rastreios">
      <h3>🔎 Rastreios por faixa</h3>
      <div className="card-subtitle">
        Referência geral por idade e sexo biológico, como apoio à decisão.{" "}
        <strong>Não é prescrição</strong> — o médico confirma conforme a diretriz
        vigente e o caso individual. Nada é enviado ao paciente automaticamente.
      </div>

      {!r.ok ? (
        <div className="state-msg">
          Sem {r.faltando.join(" e ")} registrado(s). Os rastreios por faixa
          aparecem quando esses dados existem.
        </div>
      ) : (
        <>
          <div className="rastreio-intro">
            Para sexo biológico <strong>{r.sexo}</strong>, <strong>{r.idade} anos</strong> —
            rastreios geralmente considerados nesta faixa:
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
              {/* Divergência entre diretrizes aparece em vez de o sistema
                  escolher uma por conta própria. */}
              {g.divergencia && (
                <div className="rastreio-divergencia">
                  ⚠️ <strong>Diretrizes divergem:</strong> {g.divergencia}
                </div>
              )}
              <div className="rastreio-fonte">Fonte: {g.fonte}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
