import { useState } from "react";
import CalcShell from "./CalcShell.jsx";
import { calcGotejamento } from "../../lib/calculators.js";

export default function Gotejamento() {
  const [campos, setCampos] = useState({ gotas: "", tempoSegundos: "60", relacao: "20" });
  const [r, setR] = useState(null);
  const set = (k, v) => setCampos((c) => ({ ...c, [k]: v }));

  return (
    <CalcShell
      onSubmit={() => setR(calcGotejamento(campos))}
      erro={r && !r.ok ? r.erro : ""}
      resultado={
        r?.ok && (
          <>
            <div className="calc-valor">
              {r.gotasMin.toFixed(1)} <span>gotas/min</span>
            </div>
            <div className="calc-valor">
              {r.mlh.toFixed(1)} <span>mL/h</span>
            </div>
          </>
        )
      }
      fonte="gotas/min = gotas ÷ (tempo_s ÷ 60) · mL/h = (gotas/min ÷ gotas/mL) × 60"
    >
      <label htmlFor="gtQtd">Número de gotas contadas</label>
      <input id="gtQtd" inputMode="decimal" value={campos.gotas} onChange={(e) => set("gotas", e.target.value)} />

      <label htmlFor="gtTempo">Tempo da contagem (segundos)</label>
      <input
        id="gtTempo"
        inputMode="decimal"
        value={campos.tempoSegundos}
        onChange={(e) => set("tempoSegundos", e.target.value)}
      />

      <label htmlFor="gtRel">Equipo (gotas/mL)</label>
      <input id="gtRel" inputMode="decimal" value={campos.relacao} onChange={(e) => set("relacao", e.target.value)} />
      <div className="small">Macrogotas costuma ser 20; microgotas, 60. Confira o equipo.</div>
    </CalcShell>
  );
}
