import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState } from "../../components/Loading.jsx";
import { useMinhaAssinatura, reais } from "./api.js";

// [ASSINATURA] O que o médico vê do próprio plano.
//
// A tela responde três perguntas, nessa ordem: quantos pacientes eu tenho,
// quanto ainda cabe, e o que muda se eu subir. Quem abre isso está decidindo
// se paga mais — e a decisão depende do uso dele, não do nosso catálogo.
export default function AssinaturaPage() {
  const { data, isLoading, error, refetch } = useMinhaAssinatura();

  if (isLoading) return <Loading label="Carregando seu plano..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const { plano, usados, limite, restantes, excedente, catalogo = [] } = data || {};
  const pct = limite ? Math.min(100, Math.round((usados / limite) * 100)) : 0;
  const perto = restantes <= 3 && !excedente;

  return (
    <>
      <PageHeader
        title="Meu plano"
        subtitle="A cobrança acompanha quantos pacientes você acompanha"
      />

      <div className="card">
        <h3>
          {plano?.nome}{" "}
          <span className="texto-suave">
            · {plano?.precoCentavos ? `${reais(plano.precoCentavos)}/mês` : "sem custo"}
          </span>
        </h3>

        <div className="plano-uso">
          <div className="plano-barra">
            <span
              className={excedente ? "plano-preenchido excedido" : "plano-preenchido"}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="plano-numeros">
            <strong>{usados}</strong> de {limite} pacientes
            {restantes > 0 && <span className="texto-suave"> · cabem mais {restantes}</span>}
          </div>
        </div>

        {/* [NUNCA-CORTAR] Se o médico está acima do teto, a primeira coisa
            que ele precisa ler é que ninguém parou de receber. Sem isso ele
            liga para o paciente achando que houve corte. */}
        {excedente > 0 && (
          <div className="modal-warning">
            Você está com <strong>{excedente}</strong> pacientes acima do limite do plano.
            <strong> Todos continuam recebendo os lembretes normalmente</strong> — o que
            fica bloqueado é adicionar novos até você mudar de plano.
          </div>
        )}

        {perto && (
          <div className="modal-context">
            💡 Faltam <strong>{restantes}</strong> para o limite do plano {plano?.nome}.
          </div>
        )}
      </div>

      <div className="card">
        <h3>Planos</h3>
        <div className="card-subtitle">
          O que muda entre eles é quantos pacientes você acompanha ao mesmo tempo.
        </div>

        <div className="planos-grid">
          {catalogo.map((p) => {
            const atual = p.id === plano?.id;
            const comporta = p.limitePacientes >= usados;
            return (
              <div key={p.id} className={atual ? "plano-card atual" : "plano-card"}>
                <div className="plano-nome">{p.nome}</div>
                <div className="plano-preco">
                  {p.precoCentavos ? reais(p.precoCentavos) : "Grátis"}
                  {p.precoCentavos > 0 && <span className="texto-suave">/mês</span>}
                </div>
                <div className="plano-limite">até {p.limitePacientes} pacientes</div>
                <div className="small">{p.descricao}</div>
                {atual && <div className="plano-tag">seu plano</div>}
                {/* Não oferece plano que não comporta o que ele já tem —
                    seria vender uma mudança que o deixaria excedido. */}
                {!atual && !comporta && (
                  <div className="small texto-suave">
                    Não comporta seus {usados} pacientes.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="adesao-nota">
          ℹ️ A troca de plano ainda é feita com a gente — o pagamento no site está
          em preparação. Fale com o suporte para mudar.
        </div>
      </div>
    </>
  );
}
