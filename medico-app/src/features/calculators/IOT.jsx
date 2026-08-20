import { useState } from "react";
import CalcShell from "./CalcShell.jsx";
import { calcIOT } from "../../lib/calculators.js";

const fmt = (v) => parseFloat(v.toFixed(2)).toString().replace(".", ",");

export default function IOT() {
  const [peso, setPeso] = useState("");
  const [r, setR] = useState(null);

  return (
    <CalcShell
      onSubmit={() => setR(calcIOT({ peso }))}
      erro={r && !r.ok ? r.erro : ""}
      resultado={
        r?.ok && (
          <>
            {r.grupos.map((g) => (
              <div key={g.titulo}>
                <div className="iot-grupo">{g.titulo}</div>
                {g.drogas.map((d) => (
                  <div key={d.nome} className="iot-droga">
                    • <strong>{d.nome}</strong>: {fmt(d.doseMin)} a {fmt(d.doseMax)} {d.unidade}{" "}
                    <span className="texto-suave">
                      ({fmt(d.min)}–{fmt(d.max)} {d.unidade}/kg — {d.obs})
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {/* Este aviso é parte do cálculo, não rodapé: a conversão para mL
                é deixada de fora de propósito. */}
            <div className="calc-aviso">
              ⚠️ Resultado em mg/mcg. A conversão para mL é sua: a concentração
              da ampola varia por fabricante, e assumir uma seria o erro grave.
            </div>
          </>
        )
      }
      fonte="Doses: diretriz SBA/Amib/Abramede 2021."
    >
      <label htmlFor="iotPeso">Peso (kg)</label>
      <input id="iotPeso" inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value)} />
    </CalcShell>
  );
}
