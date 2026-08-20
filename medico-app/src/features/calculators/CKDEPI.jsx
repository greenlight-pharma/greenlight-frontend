import { useState } from "react";
import CalcShell from "./CalcShell.jsx";
import { calcCKDEPI } from "../../lib/calculators.js";

export default function CKDEPI() {
  const [campos, setCampos] = useState({ sexo: "", idade: "", creatinina: "" });
  const [r, setR] = useState(null);
  const set = (k, v) => setCampos((c) => ({ ...c, [k]: v }));

  return (
    <CalcShell
      onSubmit={() => setR(calcCKDEPI(campos))}
      erro={r && !r.ok ? r.erro : ""}
      resultado={
        r?.ok && (
          <>
            <div className="calc-rotulo">TFG estimada</div>
            <div className="calc-valor">
              {r.egfr.toFixed(1)} <span>mL/min/1,73m²</span>
            </div>
            <div className="calc-estagio">{r.estagio}</div>
          </>
        )
      }
      fonte="CKD-EPI 2021 (Inker LA et al., NEJM 2021) — sem variável de raça. Estágios KDIGO."
    >
      <div className="radio-linha">
        <label>
          <input type="radio" name="ckdSexo" checked={campos.sexo === "f"} onChange={() => set("sexo", "f")} />
          Feminino
        </label>
        <label>
          <input type="radio" name="ckdSexo" checked={campos.sexo === "m"} onChange={() => set("sexo", "m")} />
          Masculino
        </label>
      </div>

      <label htmlFor="ckdIdade">Idade (anos)</label>
      <input id="ckdIdade" inputMode="numeric" value={campos.idade} onChange={(e) => set("idade", e.target.value)} />

      <label htmlFor="ckdCr">Creatinina sérica (mg/dL)</label>
      <input
        id="ckdCr"
        inputMode="decimal"
        value={campos.creatinina}
        onChange={(e) => set("creatinina", e.target.value)}
      />
    </CalcShell>
  );
}
