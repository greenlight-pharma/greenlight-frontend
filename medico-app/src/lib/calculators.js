// ============================================================
// CALCULADORAS CLÍNICAS
//
// Todas as fórmulas abaixo são portadas VERBATIM do medico.html, que por sua
// vez as conferiu contra a fonte com o médico. Coeficiente e limiar não se
// mexe sem nova conferência contra a fonte citada em cada função.
//
// A mudança do refactor é estrutural, não clínica: no painel antigo cada
// cálculo lia getElementById, validava, calculava e escrevia no DOM na mesma
// função — impossível de testar. Aqui cada uma é função pura (entrada ->
// {ok, ...} ou {ok:false, erro}), e a tela só apresenta. É por isso que
// existe calculators.test.js: a conta agora é verificável.
//
// Princípio mantido de lá: NUNCA calcular com entrada inválida. Resultado
// errado com cara de certo é o pior caso numa calculadora de dose.
// ============================================================

const num = (v) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};

// ------------------------------------------------------------
// [CALC-MCGKGMIN] Conversão dose vasoativa <-> mL/h.
// Validada clinicamente (conferência numérica com caso real de
// noradrenalina). NÃO alterar sem nova validação.
//   mL/h       = (dose × peso × 60) ÷ (diluição_mg/mL × 1000)
//   mcg/kg/min = (mL/h × diluição_mg/mL × 1000) ÷ (peso × 60)
// ------------------------------------------------------------
export function calcMcgKgMin({ direcao = "dose2ml", valor, peso, diluicao }) {
  const v = num(valor);
  const p = num(peso);
  const d = num(diluicao);

  if (!Number.isFinite(v) || v < 0)
    return { ok: false, erro: "Informe um valor válido no campo de conversão." };
  if (!Number.isFinite(p) || p <= 0)
    return { ok: false, erro: "Informe um peso válido em kg (maior que zero)." };
  if (!Number.isFinite(d) || d <= 0)
    return { ok: false, erro: "Informe a diluição em mg/mL (maior que zero)." };

  if (direcao === "dose2ml") {
    return {
      ok: true,
      rotulo: "Taxa de infusão",
      valor: (v * p * 60) / (d * 1000),
      unidade: "mL/h",
    };
  }
  return {
    ok: true,
    rotulo: "Dose",
    valor: (v * d * 1000) / (p * 60),
    unidade: "mcg/kg/min",
  };
}

// ------------------------------------------------------------
// Gotejamento. Fórmulas confirmadas clinicamente:
//   gotas/min = nº de gotas ÷ (tempo_segundos ÷ 60)
//   mL/h      = (gotas/min ÷ relação gotas/mL) × 60
// ------------------------------------------------------------
export function calcGotejamento({ gotas, tempoSegundos, relacao }) {
  const q = num(gotas);
  const t = num(tempoSegundos);
  const r = num(relacao);

  if (!Number.isFinite(q) || q <= 0)
    return { ok: false, erro: "Informe um número de gotas válido (maior que zero)." };
  if (!Number.isFinite(t) || t <= 0)
    return { ok: false, erro: "Informe um tempo válido em segundos (maior que zero)." };
  if (!Number.isFinite(r) || r <= 0)
    return { ok: false, erro: "Informe a relação gotas/mL do equipo (maior que zero)." };

  const gotasMin = q / (t / 60);
  return { ok: true, gotasMin, mlh: (gotasMin / r) * 60 };
}

// ------------------------------------------------------------
// [CKD-EPI 2021] Inker LA et al. NEJM 2021 (sem variável de raça).
//   eGFR = 142 × min(SCr/κ,1)^α × max(SCr/κ,1)^-1.200
//          × 0.9938^idade × 1.012 [se feminino]
//   κ = 0,7 (F) / 0,9 (M);  α = -0,241 (F) / -0,302 (M)
// Estágios KDIGO.
// ------------------------------------------------------------
export function calcCKDEPI({ sexo, idade, creatinina }) {
  const i = num(idade);
  const cr = num(creatinina);

  if (sexo !== "f" && sexo !== "m") return { ok: false, erro: "Selecione o sexo." };
  if (!Number.isFinite(i) || i < 18 || i > 120)
    return {
      ok: false,
      erro: "A equação CKD-EPI 2021 é validada para adultos (≥ 18 anos). Informe uma idade válida.",
    };
  if (!Number.isFinite(cr) || cr <= 0)
    return { ok: false, erro: "Informe uma creatinina sérica válida em mg/dL (maior que zero)." };

  const feminino = sexo === "f";
  const kappa = feminino ? 0.7 : 0.9;
  const alpha = feminino ? -0.241 : -0.302;
  const r = cr / kappa;

  let egfr =
    142 *
    Math.pow(Math.min(r, 1), alpha) *
    Math.pow(Math.max(r, 1), -1.2) *
    Math.pow(0.9938, i);
  if (feminino) egfr *= 1.012;

  return { ok: true, egfr, estagio: estagioKDIGO(egfr) };
}

function estagioKDIGO(egfr) {
  if (egfr >= 90) return "G1 — normal ou alta (≥ 90)";
  if (egfr >= 60) return "G2 — levemente diminuída (60–89)";
  if (egfr >= 45) return "G3a — leve a moderadamente diminuída (45–59)";
  if (egfr >= 30) return "G3b — moderada a gravemente diminuída (30–44)";
  if (egfr >= 15) return "G4 — gravemente diminuída (15–29)";
  return "G5 — falência renal (< 15)";
}

// ------------------------------------------------------------
// [IOT] Doses de indução para sequência rápida.
// Doses VERBATIM da diretriz SBA/Amib/Abramede 2021.
// NÃO alterar dose sem nova conferência contra a fonte.
//
// Entrega faixa em mg/mcg (dose/kg × peso). A conversão para mL fica com o
// médico DE PROPÓSITO: a concentração da ampola varia por fabricante, e
// assumir uma é o erro que mata.
// ------------------------------------------------------------
export const IOT_GRUPOS = [
  {
    titulo: "Indução / sedação",
    drogas: [
      { nome: "Propofol", min: 1, max: 2.5, unidade: "mg", obs: "IV" },
      { nome: "Etomidato", min: 0.15, max: 0.3, unidade: "mg", obs: "IV (boa opção se instabilidade hemodinâmica)" },
      { nome: "Midazolam", min: 0.1, max: 0.3, unidade: "mg", obs: "IV" },
      { nome: "Dextrocetamina (cetamina S+)", min: 0.2, max: 0.4, unidade: "mg", obs: "IV (preferir se instabilidade)" },
    ],
  },
  {
    titulo: "Opioide",
    drogas: [
      { nome: "Fentanil", min: 2, max: 6, unidade: "mcg", obs: "IV em bólus lento" },
      { nome: "Alfentanil", min: 20, max: 40, unidade: "mcg", obs: "IV" },
      { nome: "Sufentanil", min: 0.5, max: 1, unidade: "mcg", obs: "IV" },
      { nome: "Remifentanil", min: 0.5, max: 2, unidade: "mcg", obs: "IV" },
    ],
  },
  {
    titulo: "Bloqueador neuromuscular",
    drogas: [
      { nome: "Succinilcolina", min: 0.5, max: 1.5, unidade: "mg", obs: "IV (priorizada p/ IOT)" },
      { nome: "Rocurônio", min: 0.6, max: 1.2, unidade: "mg", obs: "IV (priorizado p/ IOT; checar sugamadex)" },
    ],
  },
  {
    titulo: "Adjuvante",
    drogas: [
      { nome: "Lidocaína", min: 0.5, max: 1.5, unidade: "mg", obs: "IV — injetar 1–2 min antes da laringoscopia" },
    ],
  },
];

export function calcIOT({ peso }) {
  const p = num(peso);
  if (!Number.isFinite(p) || p <= 0)
    return { ok: false, erro: "Informe um peso válido em kg (maior que zero)." };

  return {
    ok: true,
    grupos: IOT_GRUPOS.map((g) => ({
      titulo: g.titulo,
      drogas: g.drogas.map((d) => ({ ...d, doseMin: d.min * p, doseMax: d.max * p })),
    })),
  };
}

// ------------------------------------------------------------
// [GASOMETRIA] Algoritmo ATS de 6 passos — "Interpretation of Arterial
// Blood Gases (ABGs)", Kaufman DA, American Thoracic Society.
// Constantes ATS: pH normal 7,35–7,45 | PaCO2 normal 35–45 | HCO3 normal 24
// AG normal ~12 | correção de albumina −2,5 por g/dL abaixo de 4.
//
// Devolve dados estruturados (não HTML). O texto de apoio continua sendo
// texto de APOIO: a conclusão final é do médico, e a UI diz isso.
// ------------------------------------------------------------
const PH_LO = 7.35;
const PH_HI = 7.45;
const HCO3_NL = 24;
const PACO2_NL = 40;
const AG_NL = 12;

export function calcGasometria({ ph, pco2, hco3, na, cl, albumina }) {
  const pH = num(ph);
  const pCO2 = num(pco2);
  const HCO3 = num(hco3);
  const Na = num(na);
  const Cl = num(cl);
  const alb = num(albumina);

  if (!Number.isFinite(pH) || pH <= 0 || pH > 14)
    return { ok: false, erro: "Informe um pH válido." };
  if (!Number.isFinite(pCO2) || pCO2 <= 0)
    return { ok: false, erro: "Informe um PCO₂ válido (mmHg)." };
  if (!Number.isFinite(HCO3) || HCO3 <= 0)
    return { ok: false, erro: "Informe um HCO₃⁻ válido (mEq/L)." };

  // --- Ânion gap e correção por albumina ---
  let ag = null;
  let agCorrigido = null;
  let relacaoDelta = null;

  if (Number.isFinite(Na) && Number.isFinite(Cl)) {
    ag = Na - (Cl + HCO3);
    if (Number.isFinite(alb) && alb > 0) agCorrigido = ag + 2.5 * (4 - alb);

    const denom = 24 - HCO3;
    if (denom !== 0) {
      const agUso = agCorrigido ?? ag;
      relacaoDelta = (agUso - 12) / denom;
    }
  }

  // --- PCO2 esperado por Winter (aplicável à acidose metabólica) ---
  const winter = 1.5 * HCO3 + 8;
  const winterFaixa = [winter - 2, winter + 2];

  // --- Passo 2: acidemia / alcalemia ---
  const lado = pH < PH_LO ? "acid" : pH > PH_HI ? "alc" : "normal";

  // --- Passo 3: respiratório vs metabólico ---
  // Respiratório: pH e PaCO2 em direções OPOSTAS.
  // Metabólico: pH e PaCO2 na MESMA direção.
  const pco2Alto = pCO2 > 45;
  const pco2Baixo = pCO2 < 35;
  let primario;
  if (lado === "acid") {
    primario = pco2Alto
      ? "Acidose respiratória"
      : pco2Baixo
        ? "Acidose metabólica"
        : "Acidose (padrão de PaCO2 indefinido — avalie clinicamente)";
  } else if (lado === "alc") {
    primario = pco2Baixo
      ? "Alcalose respiratória"
      : pco2Alto
        ? "Alcalose metabólica"
        : "Alcalose (padrão de PaCO2 indefinido — avalie clinicamente)";
  } else {
    primario =
      "pH na faixa normal — pode haver distúrbio compensado ou misto (avalie PaCO2, HCO3 e ânion gap)";
  }

  // --- Passo 4: compensação esperada conforme o distúrbio primário ---
  let compensacao = null;
  if (primario === "Acidose metabólica") {
    if (pCO2 < winterFaixa[0])
      compensacao = `PaCO2 abaixo do esperado por Winter (${winterFaixa[0].toFixed(1)}–${winterFaixa[1].toFixed(1)}) → provável alcalose respiratória associada.`;
    else if (pCO2 > winterFaixa[1])
      compensacao = `PaCO2 acima do esperado por Winter (${winterFaixa[0].toFixed(1)}–${winterFaixa[1].toFixed(1)}) → provável acidose respiratória associada.`;
    else
      compensacao = `Compensação respiratória adequada (Winter ${winterFaixa[0].toFixed(1)}–${winterFaixa[1].toFixed(1)}).`;
  } else if (primario === "Alcalose metabólica") {
    const esperado = 40 + 0.6 * (HCO3 - HCO3_NL);
    compensacao = `PaCO2 esperado ≈ ${esperado.toFixed(1)} (ATS: 40 + 0,6·ΔHCO3). Compare com o medido (${pCO2.toFixed(1)}) — divergência sugere distúrbio respiratório associado.`;
  } else if (primario === "Acidose respiratória") {
    const dPco2 = (pCO2 - PACO2_NL) / 10;
    compensacao = `HCO3 esperado — agudo ≈ ${(HCO3_NL + dPco2).toFixed(1)} (±3); crônico (3–5d) ≈ ${(HCO3_NL + 3.5 * dPco2).toFixed(1)}. Medido: ${HCO3.toFixed(1)}. Fora dessas faixas sugere componente metabólico associado.`;
  } else if (primario === "Alcalose respiratória") {
    const dPco2 = (PACO2_NL - pCO2) / 10;
    compensacao = `HCO3 esperado — agudo ≈ ${(HCO3_NL - 2 * dPco2).toFixed(1)}; crônico ≈ ${(HCO3_NL - 7 * dPco2).toFixed(1)}–${(HCO3_NL - 5 * dPco2).toFixed(1)}. Medido: ${HCO3.toFixed(1)}. Fora disso sugere componente metabólico associado.`;
  }

  // --- Passos 5–6: ânion gap e relação delta ---
  let anionGapTexto;
  let deltaTexto = null;
  if (ag !== null) {
    const agUso = agCorrigido ?? ag;
    const elevado = agUso > AG_NL;
    anionGapTexto = elevado
      ? `Aumentado (${agUso.toFixed(1)} > ~12) → considerar acidose metabólica com ânion gap aumentado.`
      : `Normal/não aumentado (${agUso.toFixed(1)}).`;

    if (elevado) {
      const dHCO3 = HCO3_NL - HCO3;
      if (dHCO3 !== 0) {
        const ratio = (agUso - AG_NL) / dHCO3;
        const interp =
          ratio < 1.0
            ? "< 1,0 → provável acidose metabólica de ânion gap normal (hiperclorêmica) concomitante."
            : ratio > 2.0
              ? "> 2,0 → provável alcalose metabólica concomitante."
              : "entre 1,0 e 2,0 → acidose metabólica de ânion gap aumentado não complicada.";
        deltaTexto = `${ratio.toFixed(2)} — ${interp}`;
      }
    }
  } else {
    anionGapTexto = "não calculado — informe Na e Cl para os passos 5–6.";
  }

  return {
    ok: true,
    componentes: { ph: pH, pco2: pCO2, hco3: HCO3, ag, agCorrigido, relacaoDelta, winterFaixa },
    primario,
    compensacao,
    anionGapTexto,
    deltaTexto,
    fonte:
      "American Thoracic Society — Interpretation of Arterial Blood Gases (6-step approach), Kaufman DA. Apoio à interpretação; a conclusão final é do médico.",
  };
}

// ------------------------------------------------------------
// IMC — usado na antropometria do prontuário.
// ------------------------------------------------------------
export function calcBMI(pesoKg, alturaCm) {
  const p = num(pesoKg);
  const a = num(alturaCm);
  if (!Number.isFinite(p) || p <= 0) return null;
  if (!Number.isFinite(a) || a <= 0) return null;
  const m = a / 100;
  return p / (m * m);
}
