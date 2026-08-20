// [SCREENING] CONTEÚDO CLÍNICO — dados portados verbatim do medico.html,
// onde já haviam sido revisados. Alterar só com validação de RT médico.
//
// É APOIO: lista o que tipicamente se considera para a faixa/sexo, com fonte
// e — importante — com as DIVERGÊNCIAS entre diretrizes explícitas. Não
// decide nada e não comunica nada ao paciente.
export const SCREENING_GUIDELINES = [
  {
    nome: "Câncer de colo do útero",
    sexo: "feminino",
    faixaTexto: "25 a 64 anos (após início da atividade sexual)",
    idadeMin: 25,
    idadeMax: 64,
    fonte: "INCA — Diretrizes brasileiras (rastreamento do colo do útero)",
    nota: "Citopatológico; periodicidade conforme diretriz após exames normais.",
  },
  {
    nome: "Câncer de mama",
    sexo: "feminino",
    faixaTexto: "50 a 69 anos (posição INCA)",
    idadeMin: 50,
    idadeMax: 69,
    fonte: "INCA — posicionamento jan/2025",
    divergencia:
      "O Ministério da Saúde ampliou o acesso à mamografia no SUS para 40–74 anos (fev/2026). INCA mantém maior benefício consistente em 50–69. Confirme conforme a diretriz que você adota e o caso.",
  },
  {
    nome: "Câncer colorretal",
    sexo: "ambos",
    faixaTexto: "faixa de maior incidência: 50 a 75 anos",
    idadeMin: 50,
    idadeMax: 75,
    fonte: "INCA / Ministério da Saúde (Brasil)",
    divergencia:
      "Não há idade nacional fechada — o INCA tem projeto de detecção precoce em elaboração; sociedades brasileiras divergem entre 45 e 50 anos para início. Avalie histórico familiar e o caso.",
  },
  {
    nome: "Pressão arterial (rastreio de hipertensão)",
    sexo: "ambos",
    faixaTexto: "adultos, aferição periódica",
    idadeMin: 18,
    idadeMax: 120,
    fonte: "Ministério da Saúde (Brasil) — atenção básica",
    nota: "Aferição periódica conforme rotina clínica e fatores de risco.",
  },
  {
    nome: "Glicemia (rastreio de diabetes)",
    sexo: "ambos",
    faixaTexto: "adultos, conforme fatores de risco",
    idadeMin: 18,
    idadeMax: 120,
    fonte: "Ministério da Saúde (Brasil) — atenção básica",
    nota: "Indicação e periodicidade dependem de fatores de risco; avaliar caso.",
  },
];

/**
 * Devolve os rastreios aplicáveis, ou o motivo de não dar para calcular.
 * Sem idade ou sem sexo, NÃO adivinha: a ausência é dito explícito.
 */
export function rastreiosAplicaveis(patient) {
  const idadeBruta = parseInt(patient?.patientAge, 10);
  const idade = Number.isFinite(idadeBruta) ? idadeBruta : null;
  const sexo =
    patient?.biologicalSex === "feminino" || patient?.biologicalSex === "masculino"
      ? patient.biologicalSex
      : null;

  if (idade === null || sexo === null) {
    const faltando = [];
    if (idade === null) faltando.push("idade");
    if (sexo === null) faltando.push("sexo biológico");
    return { ok: false, faltando };
  }

  return {
    ok: true,
    idade,
    sexo,
    itens: SCREENING_GUIDELINES.filter(
      (g) =>
        (g.sexo === "ambos" || g.sexo === sexo) &&
        idade >= g.idadeMin &&
        idade <= g.idadeMax
    ),
  };
}
