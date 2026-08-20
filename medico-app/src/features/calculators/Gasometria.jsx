import { useState } from "react";
import CalcShell from "./CalcShell.jsx";
import { calcGasometria } from "../../lib/calculators.js";

export default function Gasometria() {
  const [c, setC] = useState({ ph: "", pco2: "", hco3: "", na: "", cl: "", albumina: "" });
  const [r, setR] = useState(null);
  const set = (k, v) => setC((x) => ({ ...x, [k]: v }));

  // [PROGRESSIVO] Revela os campos conforme o médico preenche, como no
  // painel antigo — pedir 6 valores de uma vez trava quem está com a
  // gasometria na mão.
  const temPh = c.ph !== "";
  const temPco2 = temPh && c.pco2 !== "";
  const temHco3 = temPco2 && c.hco3 !== "";

  return (
    <CalcShell
      onSubmit={() => setR(calcGasometria(c))}
      erro={r && !r.ok ? r.erro : ""}
      resultado={r?.ok && <Resultado r={r} />}
      fonte={r?.ok ? r.fonte : "Algoritmo ATS de 6 passos (Kaufman DA)."}
    >
      <label htmlFor="gsPh">pH</label>
      <input id="gsPh" inputMode="decimal" value={c.ph} onChange={(e) => set("ph", e.target.value)} />

      {temPh && (
        <>
          <label htmlFor="gsPco2">PCO₂ (mmHg)</label>
          <input id="gsPco2" inputMode="decimal" value={c.pco2} onChange={(e) => set("pco2", e.target.value)} />
        </>
      )}

      {temPco2 && (
        <>
          <label htmlFor="gsHco3">HCO₃⁻ (mEq/L)</label>
          <input id="gsHco3" inputMode="decimal" value={c.hco3} onChange={(e) => set("hco3", e.target.value)} />
        </>
      )}

      {temHco3 && (
        <>
          <div className="calc-secao">Opcional — habilita ânion gap (passos 5–6)</div>
          <div className="grid-3">
            <div>
              <label htmlFor="gsNa">Na⁺ (mEq/L)</label>
              <input id="gsNa" inputMode="decimal" value={c.na} onChange={(e) => set("na", e.target.value)} />
            </div>
            <div>
              <label htmlFor="gsCl">Cl⁻ (mEq/L)</label>
              <input id="gsCl" inputMode="decimal" value={c.cl} onChange={(e) => set("cl", e.target.value)} />
            </div>
            <div>
              <label htmlFor="gsAlb">Albumina (g/dL)</label>
              <input
                id="gsAlb"
                inputMode="decimal"
                value={c.albumina}
                onChange={(e) => set("albumina", e.target.value)}
              />
            </div>
          </div>
        </>
      )}
    </CalcShell>
  );
}

function Resultado({ r }) {
  const { componentes: k } = r;
  return (
    <>
      <div className="gaso-bloco">
        <strong>Componentes</strong>
        <ul>
          <li>pH: {k.ph.toFixed(2)}</li>
          <li>PCO₂: {k.pco2.toFixed(1)} mmHg</li>
          <li>HCO₃⁻: {k.hco3.toFixed(1)} mEq/L</li>
          {k.ag !== null ? (
            <>
              <li>Ânion gap: {k.ag.toFixed(1)} mEq/L</li>
              {k.agCorrigido !== null && (
                <li>Ânion gap corrigido p/ albumina: {k.agCorrigido.toFixed(1)} mEq/L</li>
              )}
              {k.relacaoDelta !== null && <li>Relação delta: {k.relacaoDelta.toFixed(2)}</li>}
            </>
          ) : (
            <li className="texto-suave">(Ânion gap não calculado — informe Na e Cl)</li>
          )}
          <li>
            PCO₂ esperado (Winter, p/ acidose metabólica): {k.winterFaixa[0].toFixed(1)} a{" "}
            {k.winterFaixa[1].toFixed(1)} mmHg
          </li>
        </ul>
      </div>

      <div className="gaso-bloco">
        <strong>Distúrbio primário (passos 2–3 ATS)</strong>
        <div>{r.primario}</div>
      </div>

      {r.compensacao && (
        <div className="gaso-bloco">
          <strong>Compensação (passo 4 ATS)</strong>
          <div>{r.compensacao}</div>
        </div>
      )}

      <div className="gaso-bloco">
        <strong>Ânion gap (passo 5 ATS)</strong>
        <div>{r.anionGapTexto}</div>
        {r.deltaTexto && (
          <div style={{ marginTop: 6 }}>
            <strong>Relação delta ΔAG/ΔHCO3 (passo 6):</strong> {r.deltaTexto}
          </div>
        )}
      </div>

      <div className="calc-aviso">
        Apoio à interpretação. A conclusão diagnóstica é do médico.
      </div>
    </>
  );
}
