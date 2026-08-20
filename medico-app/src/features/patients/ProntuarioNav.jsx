// [PRONTUARIO-NAV] Menu horizontal sticky de navegação rápida entre os cards.
// O prontuário é longo; sem isso o médico rola procurando "Medicações".
const ITENS = [
  { id: "card-dados", rotulo: "📋 Dados" },
  { id: "card-alergias", rotulo: "⚠️ Alergias" },
  { id: "card-rastreios", rotulo: "🔎 Rastreios" },
  { id: "card-consultas", rotulo: "🩺 Consultas" },
  { id: "card-medicacoes", rotulo: "💊 Medicações" },
  { id: "card-exames", rotulo: "🧪 Exames" },
  { id: "card-exames-imagem", rotulo: "🩻 Imagem" },
  { id: "card-analises", rotulo: "📊 Análises" },
];

export default function ProntuarioNav({ onTimeline }) {
  function irPara(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="prontuario-nav">
      {ITENS.map((i) => (
        <button key={i.id} className="prontuario-nav-btn" onClick={() => irPara(i.id)}>
          {i.rotulo}
        </button>
      ))}
      <button className="prontuario-nav-btn" onClick={onTimeline}>
        📈 Linha do tempo
      </button>
    </div>
  );
}
