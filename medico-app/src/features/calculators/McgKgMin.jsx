import { useState } from "react";
import CalcShell from "./CalcShell.jsx";
import { calcMcgKgMin } from "../../lib/calculators.js";

export default function McgKgMin() {
  const [direcao, setDirecao] = useState("dose2ml");
  const [campos, setCampos] = useState({ valor: "", peso: "", diluicao: "" });
  const [r, setR] = useState(null);

  const set = (k, v) => setCampos((c) => ({ ...c, [k]: v }));

  return (
    <CalcShell
      onSubmit={() => setR(calcMcgKgMin({ direcao, ...campos }))}
      erro={r && !r.ok ? r.erro : ""}
      resultado={
        r?.ok && (
          <>
            <div className="calc-rotulo">{r.rotulo}</div>
            <div className="calc-valor">
              {r.valor.toFixed(2)} <span>{r.unidade}</span>
            </div>
          </>
        )
      }
      fonte="mL/h = (dose × peso × 60) ÷ (diluição mg/mL × 1000)"
    >
      <div className="radio-linha">
        <label>
          <input
            type="radio"
            name="mcgDir"
            checked={direcao === "dose2ml"}
            onChange={() => setDirecao("dose2ml")}
          />
          Dose → mL/h
        </label>
        <label>
          <input
            type="radio"
            name="mcgDir"
            checked={direcao === "ml2dose"}
            onChange={() => setDirecao("ml2dose")}
          />
          mL/h → Dose
        </label>
      </div>

      <label htmlFor="mcgValor">
        {direcao === "dose2ml" ? "Dose (mcg/kg/min)" : "Taxa de infusão (mL/h)"}
      </label>
      <input
        id="mcgValor"
        inputMode="decimal"
        value={campos.valor}
        onChange={(e) => set("valor", e.target.value)}
      />

      <label htmlFor="mcgPeso">Peso (kg)</label>
      <input
        id="mcgPeso"
        inputMode="decimal"
        value={campos.peso}
        onChange={(e) => set("peso", e.target.value)}
      />

      <label htmlFor="mcgDil">Diluição (mg/mL)</label>
      <input
        id="mcgDil"
        inputMode="decimal"
        value={campos.diluicao}
        onChange={(e) => set("diluicao", e.target.value)}
      />
    </CalcShell>
  );
}
