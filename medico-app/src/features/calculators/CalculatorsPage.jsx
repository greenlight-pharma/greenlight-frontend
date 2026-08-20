import { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import McgKgMin from "./McgKgMin.jsx";
import Gotejamento from "./Gotejamento.jsx";
import Gasometria from "./Gasometria.jsx";
import IOT from "./IOT.jsx";
import CKDEPI from "./CKDEPI.jsx";

// [CALCULADORAS] Cada calculadora é um componente que só apresenta; a conta
// vive em lib/calculators.js, testada. Adicionar uma nova: escrever a função
// pura + o teste, e registrar aqui.
const CALCULADORAS = [
  { id: "mcgkgmin", titulo: "Dose vasoativa ⇄ mL/h", Componente: McgKgMin, categoria: "Bomba de infusão" },
  { id: "gotejamento", titulo: "Gotejamento", Componente: Gotejamento, categoria: "Bomba de infusão" },
  { id: "gasometria", titulo: "Gasometria arterial", Componente: Gasometria, categoria: "Gasometria" },
  { id: "iot", titulo: "Doses de IOT", Componente: IOT, categoria: "Via aérea" },
  { id: "ckdepi", titulo: "CKD-EPI 2021 (TFG)", Componente: CKDEPI, categoria: "Função renal" },
];

export default function CalculatorsPage() {
  const [ativa, setAtiva] = useState(CALCULADORAS[0].id);
  const atual = CALCULADORAS.find((c) => c.id === ativa);
  const Componente = atual.Componente;

  const categorias = [...new Set(CALCULADORAS.map((c) => c.categoria))];

  return (
    <>
      <PageHeader
        title="Calculadoras"
        subtitle="Apoio ao cálculo. Confira sempre o resultado antes de aplicar."
      />

      <div className="calc-layout">
        <nav className="calc-menu">
          {categorias.map((cat) => (
            <div key={cat}>
              <div className="calc-categoria">{cat}</div>
              {CALCULADORAS.filter((c) => c.categoria === cat).map((c) => (
                <button
                  key={c.id}
                  className={c.id === ativa ? "calc-btn active" : "calc-btn"}
                  onClick={() => setAtiva(c.id)}
                >
                  {c.titulo}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="card calc-painel">
          <h3>{atual.titulo}</h3>
          <Componente />
        </div>
      </div>
    </>
  );
}
