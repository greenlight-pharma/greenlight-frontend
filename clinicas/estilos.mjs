// Paletas e pares tipográficos nomeados.
//
// O briefing pede um nome ("nude", "oceano"), não seis hexadecimais. Isso
// existe para que dois sites gerados no mesmo dia não pareçam o mesmo site
// com a cor trocada: paleta e layout mudam junto, e cada praça/nicho ganha
// um visual próprio.
//
// Regra de contraste: `tinta` sobre `fundo` e branco sobre `principal`
// passam de 4.5:1. Se você criar uma paleta nova, confira antes — site de
// clínica é lido por gente de 70 anos no celular, no sol.

export const PALETAS = {
  // Consultório particular, dermatologia e estética médica. É o visual da
  // referência: off-white quente, bordô profundo, serifa de alto contraste.
  nude: {
    principal: "#5c2033",
    principalEscuro: "#3d1522",
    destaque: "#a67c5b",
    fundo: "#fbf8f6",
    fundoSuave: "#f4ece6",
    tinta: "#2a2422",
    tintaSuave: "#6b5e58",
    borda: "#e8ddd5",
    fonteTitulo: "Cormorant Garamond",
    fonteTexto: "Jost",
  },
  // Litoral: Angra, Paraty, Ilhabela. Verde-mar e areia.
  oceano: {
    principal: "#14596b",
    principalEscuro: "#0e3d49",
    destaque: "#d98f3f",
    fundo: "#ffffff",
    fundoSuave: "#f1f7f8",
    tinta: "#1b2733",
    tintaSuave: "#54626f",
    borda: "#dde8ea",
    fonteTitulo: "Newsreader",
    fonteTexto: "Inter",
  },
  // Pediatria, nutrição, psicologia: verde sálvia, tom acolhedor.
  salvia: {
    principal: "#3f5f4e",
    principalEscuro: "#2a4234",
    destaque: "#c08a4a",
    fundo: "#fcfbf7",
    fundoSuave: "#eef2ea",
    tinta: "#26302a",
    tintaSuave: "#5d6b62",
    borda: "#dfe6da",
    fonteTitulo: "Fraunces",
    fonteTexto: "Karla",
  },
  // Ortopedia, fisioterapia, medicina do trabalho: grafite e cobre.
  grafite: {
    principal: "#2b3136",
    principalEscuro: "#1a1e21",
    destaque: "#b4794a",
    fundo: "#fcfcfb",
    fundoSuave: "#f0f1f0",
    tinta: "#20262a",
    tintaSuave: "#5a646a",
    borda: "#e0e3e4",
    fonteTitulo: "Spectral",
    fonteTexto: "Inter",
  },
  // Clínica multiespecialidade, laboratório, convênio: azul institucional.
  clinico: {
    principal: "#0f5f8a",
    principalEscuro: "#0a4260",
    destaque: "#e0a33c",
    fundo: "#ffffff",
    fundoSuave: "#f2f7fa",
    tinta: "#1b2733",
    tintaSuave: "#54626f",
    borda: "#dfe9ef",
    fonteTitulo: "Newsreader",
    fonteTexto: "Inter",
  },
  // Odontologia e estética: rosé discreto, sem infantilizar.
  rose: {
    principal: "#8d4a5c",
    principalEscuro: "#63313f",
    destaque: "#b98a63",
    fundo: "#fdfafa",
    fundoSuave: "#f7edee",
    tinta: "#2c2528",
    tintaSuave: "#6d5f63",
    borda: "#ecdcde",
    fonteTitulo: "Cormorant Garamond",
    fonteTexto: "Jost",
  },
};

// Layouts são estruturas de página diferentes, não temas de cor.
export const LAYOUTS = {
  // Profissional único, consultório particular. Hero claro dividido, com
  // retrato à direita, serifa grande, muito branco. Vende consulta.
  editorial: "editorial.html",
  // Clínica com várias especialidades e convênios. Hero escuro, cartão de
  // atendimento, grade de serviços. Vende praticidade e informação.
  clinico: "clinico.html",
  // Desenho derivado do cliente: paleta, tipografia, composição do primeiro
  // quadro, ornamento, ritmo, forma e estilo de lista saem todos da semente
  // (place_id do Google). Nenhum eixo é escolhido de catálogo. Ver arte.mjs.
  "sob-medida": "sob-medida.html",
};

export function resolverEstilo(b = {}) {
  const nomePaleta = b.paleta || (b.marca && b.marca.paleta) || "oceano";
  const base = PALETAS[nomePaleta];
  if (!base) {
    throw new Error(
      `paleta "${nomePaleta}" não existe. Disponíveis: ${Object.keys(PALETAS).join(", ")}`
    );
  }
  const layout = b.layout || "clinico";
  if (!LAYOUTS[layout]) {
    throw new Error(
      `layout "${layout}" não existe. Disponíveis: ${Object.keys(LAYOUTS).join(", ")}`
    );
  }
  // `marca` no briefing sobrescreve ponto a ponto, para o caso em que o
  // cliente já tem identidade visual e manda o hexadecimal da marca dele.
  return {
    nomePaleta,
    layout,
    arquivo: LAYOUTS[layout],
    cores: { ...base, ...normalizarMarca(b.marca) },
  };
}

// Antes das paletas nomeadas, o briefing trazia marca.corPrincipal,
// corPrincipalEscuro, corDestaque e corFundoSuave. Os nomes novos são
// principal, principalEscuro, destaque e fundoSuave. Aceitar os dois evita
// o pior defeito possível numa migração destas: a chave antiga deixar de
// casar, ser ignorada em silêncio e o site sair com a cor errada sem que
// nada reclame.
const APELIDOS = {
  corPrincipal: "principal",
  corPrincipalEscuro: "principalEscuro",
  corDestaque: "destaque",
  corFundo: "fundo",
  corFundoSuave: "fundoSuave",
  corTinta: "tinta",
  corBorda: "borda",
  sigla: null,   // monograma, tratado fora das cores
  paleta: null,  // já resolvido acima
};

function normalizarMarca(marca) {
  const saida = {};
  for (const [chave, valor] of Object.entries(marca || {})) {
    if (chave in APELIDOS) {
      const novo = APELIDOS[chave];
      if (novo) saida[novo] = valor;
    } else {
      saida[chave] = valor;
    }
  }
  return saida;
}
