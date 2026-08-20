import { describe, it, expect } from "vitest";
import {
  calcMcgKgMin,
  calcGotejamento,
  calcCKDEPI,
  calcIOT,
  calcGasometria,
  calcBMI,
} from "./calculators.js";

// Os números esperados aqui vêm das MESMAS fórmulas que o painel antigo já
// usava e que foram conferidas contra a fonte. O teste trava o comportamento:
// se alguém mexer num coeficiente sem querer, quebra aqui e não no plantão.

describe("calcMcgKgMin (dose vasoativa)", () => {
  it("dose -> mL/h (noradrenalina 0,1 mcg/kg/min, 70kg, 0,064 mg/mL)", () => {
    const r = calcMcgKgMin({ direcao: "dose2ml", valor: 0.1, peso: 70, diluicao: 0.064 });
    // (0,1 × 70 × 60) ÷ (0,064 × 1000) = 420 ÷ 64 = 6,5625
    expect(r.ok).toBe(true);
    expect(r.valor).toBeCloseTo(6.5625, 4);
    expect(r.unidade).toBe("mL/h");
  });

  it("mL/h -> dose é o inverso exato", () => {
    const r = calcMcgKgMin({ direcao: "ml2dose", valor: 6.5625, peso: 70, diluicao: 0.064 });
    expect(r.valor).toBeCloseTo(0.1, 6);
  });

  it("recusa peso zero em vez de devolver Infinity", () => {
    expect(calcMcgKgMin({ valor: 1, peso: 0, diluicao: 1 }).ok).toBe(false);
  });

  it("recusa diluição inválida", () => {
    expect(calcMcgKgMin({ valor: 1, peso: 70, diluicao: 0 }).ok).toBe(false);
  });

  it("aceita vírgula decimal (teclado brasileiro)", () => {
    expect(calcMcgKgMin({ valor: "0,1", peso: "70", diluicao: "0,064" }).ok).toBe(true);
  });
});

describe("calcGotejamento", () => {
  it("20 gotas em 60s com equipo 20 gotas/mL", () => {
    const r = calcGotejamento({ gotas: 20, tempoSegundos: 60, relacao: 20 });
    expect(r.gotasMin).toBeCloseTo(20, 6);
    expect(r.mlh).toBeCloseTo(60, 6);
  });

  it("recusa tempo zero", () => {
    expect(calcGotejamento({ gotas: 20, tempoSegundos: 0, relacao: 20 }).ok).toBe(false);
  });
});

describe("calcCKDEPI 2021", () => {
  it("homem 60 anos, creatinina 1,0", () => {
    const r = calcCKDEPI({ sexo: "m", idade: 60, creatinina: 1.0 });
    // 142 × max(1,111;1)^-1,2 × 0,9938^60 = 86,16 (conferido à mão)
    expect(r.egfr).toBeCloseTo(86.16, 1);
    expect(r.estagio).toMatch(/^G2/);
  });

  it("mulher 60 anos, creatinina 1,0", () => {
    const r = calcCKDEPI({ sexo: "f", idade: 60, creatinina: 1.0 });
    // κ=0,7 e α=-0,241, mais o fator 1,012 do sexo feminino
    expect(r.egfr).toBeCloseTo(64.50, 1);
    expect(r.estagio).toMatch(/^G2/);
  });

  it("creatinina abaixo de κ usa o ramo alpha", () => {
    const r = calcCKDEPI({ sexo: "f", idade: 30, creatinina: 0.5 });
    expect(r.ok).toBe(true);
    expect(r.egfr).toBeGreaterThan(100);
    expect(r.estagio).toMatch(/^G1/);
  });

  it("recusa menor de 18 anos — a equação não é validada para crianças", () => {
    expect(calcCKDEPI({ sexo: "m", idade: 12, creatinina: 0.6 }).ok).toBe(false);
  });

  it("recusa sexo não informado", () => {
    expect(calcCKDEPI({ sexo: "", idade: 40, creatinina: 1 }).ok).toBe(false);
  });

  it("estágios KDIGO nas bordas", () => {
    const faixa = (egfr) => calcCKDEPI({ sexo: "m", idade: 40, creatinina: egfr }).estagio;
    expect(faixa(5)).toMatch(/^G5/); // creatinina muito alta -> falência
  });
});

describe("calcIOT", () => {
  it("multiplica a faixa pelo peso", () => {
    const r = calcIOT({ peso: 70 });
    const propofol = r.grupos[0].drogas.find((d) => d.nome === "Propofol");
    expect(propofol.doseMin).toBe(70);
    expect(propofol.doseMax).toBe(175);
  });

  it("recusa peso inválido", () => {
    expect(calcIOT({ peso: -1 }).ok).toBe(false);
  });

  it("não converte para mL (concentração da ampola varia por fabricante)", () => {
    const r = calcIOT({ peso: 70 });
    const chaves = Object.keys(r.grupos[0].drogas[0]);
    expect(chaves).not.toContain("mL");
  });
});

describe("calcGasometria (ATS 6 passos)", () => {
  it("acidose metabólica com compensação adequada", () => {
    // pH 7,30 (acidemia) + PCO2 30 (baixo) -> mesma direção = metabólica
    const r = calcGasometria({ ph: 7.3, pco2: 30, hco3: 15 });
    expect(r.primario).toBe("Acidose metabólica");
    // Winter: 1,5×15+8 = 30,5 -> faixa 28,5–32,5; medido 30 está dentro
    expect(r.compensacao).toMatch(/adequada/);
  });

  it("acidose respiratória: pH e PCO2 em direções opostas", () => {
    const r = calcGasometria({ ph: 7.25, pco2: 60, hco3: 26 });
    expect(r.primario).toBe("Acidose respiratória");
  });

  it("alcalose respiratória", () => {
    const r = calcGasometria({ ph: 7.5, pco2: 28, hco3: 22 });
    expect(r.primario).toBe("Alcalose respiratória");
  });

  it("alcalose metabólica", () => {
    const r = calcGasometria({ ph: 7.52, pco2: 48, hco3: 34 });
    expect(r.primario).toBe("Alcalose metabólica");
  });

  it("pH normal não conclui distúrbio", () => {
    const r = calcGasometria({ ph: 7.4, pco2: 40, hco3: 24 });
    expect(r.primario).toMatch(/faixa normal/);
  });

  it("ânion gap e correção por albumina", () => {
    const r = calcGasometria({ ph: 7.3, pco2: 30, hco3: 15, na: 140, cl: 100, albumina: 2 });
    expect(r.componentes.ag).toBe(25); // 140 - (100 + 15)
    expect(r.componentes.agCorrigido).toBe(30); // 25 + 2,5×(4-2)
    expect(r.anionGapTexto).toMatch(/Aumentado/);
  });

  it("sem Na e Cl, não inventa ânion gap", () => {
    const r = calcGasometria({ ph: 7.3, pco2: 30, hco3: 15 });
    expect(r.componentes.ag).toBeNull();
    expect(r.anionGapTexto).toMatch(/não calculado/);
  });

  it("relação delta entre 1 e 2 = AG aumentado não complicado", () => {
    // AG 25, ΔAG = 13; HCO3 15, ΔHCO3 = 9 -> ratio 1,44
    const r = calcGasometria({ ph: 7.3, pco2: 30, hco3: 15, na: 140, cl: 100 });
    expect(r.deltaTexto).toMatch(/1\.44|1,44/);
    expect(r.deltaTexto).toMatch(/não complicada/);
  });

  it("recusa pH fora da escala", () => {
    expect(calcGasometria({ ph: 20, pco2: 40, hco3: 24 }).ok).toBe(false);
    expect(calcGasometria({ ph: 7.4, pco2: 0, hco3: 24 }).ok).toBe(false);
  });
});

describe("calcBMI", () => {
  it("70kg e 175cm", () => {
    expect(calcBMI(70, 175)).toBeCloseTo(22.86, 2);
  });
  it("entrada inválida devolve null em vez de NaN", () => {
    expect(calcBMI(70, 0)).toBeNull();
    expect(calcBMI("", 175)).toBeNull();
  });
});
