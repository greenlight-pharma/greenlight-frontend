import { PRENOMES_COMUNS } from "./nomes.mjs";
function semAcentoPII(t) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const PII_PALAVRAS_NEUTRAS = /* @__PURE__ */ new Set([
  // Substantivos comuns para o paciente
  "paciente",
  "pacientes",
  "pessoa",
  "homem",
  "mulher",
  "adulto",
  "adulta",
  // Grafias erradas que o Whisper produz para "paciente" ao transcrever a voz.
  // [2026-07-15, a pedido do Dilson] Sem isto, "Patiente, 45 anos" era flagrado
  // como nome próprio (Padrão 3) e travava o registro por voz. São variações da
  // MESMA palavra neutra, não nomes — adição segura, não altera regex/heurística.
  "patiente",
  "patientes",
  "patient",
  "patients",
  "pasiente",
  "pasientes",
  "pacient",
  "pacients",
  "paci\xEAnte",
  "pacientte",
  "idoso",
  "idosa",
  "jovem",
  "crianca",
  "crian\xE7a",
  "lactente",
  "neonato",
  "gestante",
  "puerpera",
  "pu\xE9rpera",
  "vitima",
  "v\xEDtima",
  "menino",
  "menina",
  "rapaz",
  "moca",
  "mo\xE7a",
  "senhor",
  "senhora",
  "primigesta",
  "multipara",
  "mult\xEDpara",
  "nuligesta",
  // DESCRITORES CLÍNICOS QUE VÊM ANTES DE "X ANOS".
  // [2026-07-20] "Fumante 10 anos maço" era lido pelo Padrão 3 como um nome
  // próprio de alguém com 10 anos, e travava o caso do Rodrigo sem nenhum dado
  // identificável. É uma CLASSE inteira de falso positivo: hábito e comorbidade
  // aparecem quase sempre capitalizados no início da linha e seguidos de tempo
  // de evolução.
  "fumante",
  "fumantes",
  "tabagista",
  "tabagismo",
  "etilista",
  "etilismo",
  "alcoolista",
  "ex-fumante",
  "exfumante",
  "extabagista",
  "ex-tabagista",
  "hipertenso",
  "hipertensa",
  "diabetico",
  "diab\xE9tico",
  "diabetica",
  "diab\xE9tica",
  "obeso",
  "obesa",
  "sedentario",
  "sedent\xE1rio",
  "sedentaria",
  "sedent\xE1ria",
  "usuario",
  "usu\xE1rio",
  "usuaria",
  "usu\xE1ria",
  "portador",
  "portadora",
  "acompanhado",
  "acompanhada",
  "diagnosticado",
  "diagnosticada",
  "hipotireoidismo",
  "hipertireoidismo",
  "dislipidemia",
  "dislipidemico",
  // Abreviacoes medicas comuns que comecam com maiuscula e poderiam ser
  // confundidas com nome proprio pelas heuristicas (ex: "Ca de mama").
  "ca",
  "dx",
  "hx",
  "tx",
  "sx",
  "rx",
  "has",
  "dm",
  "dpoc",
  "icc",
  "iam",
  "avc",
  "tep",
  "ivas",
  "itu",
  "drge",
  "lra",
  "irc",
  "tce",
  // Preposicoes, artigos, conjuncoes comuns
  "do",
  "da",
  "de",
  "com",
  "sem",
  "que",
  "para",
  "por",
  "ate",
  "at\xE9",
  "ao",
  "aos",
  "na",
  "no",
  "nas",
  "nos",
  "em",
  "uma",
  "uns",
  "umas",
  "esta",
  "este",
  "estes",
  "estas",
  "isso",
  "isto",
  // Verbos clinicos comuns conjugados (3a pessoa singular/plural)
  "queixa",
  "queixou",
  "queixa-se",
  "apresenta",
  "apresentou",
  "apresentava",
  "refere",
  "referia",
  "referiu",
  "relata",
  "relatou",
  "relatava",
  "relatando",
  "nega",
  "negou",
  "negava",
  "tem",
  "teve",
  "tinha",
  "tive",
  "ha",
  "h\xE1",
  "havia",
  "encontra",
  "encontrou",
  "encontrava",
  "buscou",
  "busca",
  "buscava",
  "procura",
  "procurou",
  "procurava",
  "trazido",
  "trazida",
  "trazidos",
  "trazidas",
  "conduzido",
  "conduzida",
  "conduzidos",
  "conduzidas",
  "internado",
  "internada",
  "internados",
  "internadas",
  "veio",
  "vem",
  "vinha",
  "viera",
  "chegou",
  "chega",
  "chegava",
  "chegando",
  "evolui",
  "evoluiu",
  "evoluindo",
  "necessita",
  "necessitou",
  "necessitava",
  "passou",
  "passa",
  "passava",
  "passando",
  "deu",
  "dera",
  "dando",
  "dao",
  "d\xE3o",
  "deram",
  "entrou",
  "entra",
  "entrando",
  "saiu",
  "sai",
  "saindo",
  "iniciou",
  "inicia",
  "iniciava",
  "iniciando",
  "inicio",
  "comecou",
  "come\xE7ou",
  "comeca",
  "come\xE7a",
  "piorou",
  "piora",
  "piorando",
  "melhorou",
  "melhora",
  "melhorando",
  "manteve",
  "mantem",
  "mant\xE9m",
  "mantendo",
  "estava",
  "esta",
  "est\xE1",
  "estao",
  "est\xE3o",
  "estive",
  "foi",
  "fora",
  "sera",
  "ser\xE1",
  "sendo",
  "permaneceu",
  "permanece",
  "recebeu",
  "recebe",
  "recebendo",
  "fez",
  "faz",
  "fazendo",
  "feita",
  "feito",
  "realizou",
  "realiza",
  "realizando",
  "submetida",
  "submetido",
  "queixou-se",
  "evoluiu-se",
  // Marcadores de identificacao a checar (sao seguros por si so)
  "sr",
  "sra",
  "pcte",
  "doutor",
  "dr",
  "dra",
  // Adjetivos / particípios clinicos
  "hipotenso",
  "hipertensa",
  "taquicardico",
  "taquicardica",
  "febril",
  "consciente",
  "orientado",
  "orientada",
  "letargico",
  "letargica",
  "estavel",
  "est\xE1vel",
  "instavel",
  "inst\xE1vel",
  "previamente",
  "previo",
  "pr\xE9via"
]);
const PII_ABBREV_MEDICAS = /* @__PURE__ */ new Set([
  // 2 letras
  "I.M",
  "I.M.",
  "E.V",
  "E.V.",
  "V.O",
  "V.O.",
  "S.C",
  "S.C.",
  "P.A",
  "P.A.",
  "F.C",
  "F.C.",
  "F.R",
  "F.R.",
  "T.A",
  "T.A.",
  "M.V",
  "M.V.",
  "S.S",
  "S.S.",
  "P.O",
  "P.O.",
  "U.I",
  "U.I.",
  "F.A",
  "F.A.",
  "I.C",
  "I.C.",
  "I.R",
  "I.R.",
  "T.C",
  "T.C.",
  "R.M",
  "R.M.",
  "P.S",
  "P.S.",
  // 2 letras — abreviações de exame físico (E.C=Exame Cardiaco,
  // E.R=Exame Respiratorio, A.C=Ausculta Cardiaca, A.R=Ausculta
  // Respiratoria, A.P=Ausculta Pulmonar, E.G=Exame Geral, E.F=Exame
  // Fisico, E.N=Exame Neurologico, E.A=Exame Abdominal, B.E=Bom Estado,
  // R.N=Recem Nascido, V.D=Ventriculo Direito, V.E=Ventriculo Esquerdo,
  // A.D=Atrio Direito, A.E=Atrio Esquerdo). Comuns em anotações de
  // exame físico abreviadas.
  "E.C",
  "E.C.",
  "E.R",
  "E.R.",
  "E.G",
  "E.G.",
  "E.F",
  "E.F.",
  "E.N",
  "E.N.",
  "E.A",
  "E.A.",
  "A.C",
  "A.C.",
  "A.R",
  "A.R.",
  "A.P",
  "A.P.",
  "B.E",
  "B.E.",
  "R.N",
  "R.N.",
  "V.D",
  "V.D.",
  "V.E",
  "V.E.",
  "A.D",
  "A.D.",
  "A.E",
  "A.E.",
  // 3 letras
  "T.A.C",
  "T.A.C.",
  "S.O.S",
  "S.O.S.",
  "B.N.F",
  "B.N.F.",
  "B.R.A",
  "B.R.A.",
  "H.D.A",
  "H.D.A.",
  "H.M.A",
  "H.M.A.",
  "A.P.P",
  "A.P.P.",
  "U.T.I",
  "U.T.I.",
  "C.T.I",
  "C.T.I.",
  "P.C.R",
  "P.C.R.",
  "P.I.C",
  "P.I.C.",
  // 3 letras — exame físico (B.E.G=Bom Estado Geral, R.E.G=Regular
  // Estado Geral, M.E.G=Mau Estado Geral, M.V.B=Murmurio Vesicular
  // Bilateral, R.H.A=Ruidos Hidroaereos, T.E.C=Tempo de Enchimento
  // Capilar, F.I.D=Fossa Iliaca Direita, F.I.E=Fossa Iliaca Esquerda).
  "B.E.G",
  "B.E.G.",
  "R.E.G",
  "R.E.G.",
  "M.E.G",
  "M.E.G.",
  "M.V.B",
  "M.V.B.",
  "R.H.A",
  "R.H.A.",
  "T.E.C",
  "T.E.C.",
  "F.I.D",
  "F.I.D.",
  "F.I.E",
  "F.I.E."
]);
function detectNomeProprioDetalhado(text) {
  if (!text) return null;
  const s = String(text);
  let m = null;
  const re1 = /\b(paciente|pcte\.?|sr\.?|sra\.?)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇa-záéíóúâêôãõç]{2,})\b/gi;
  while ((m = re1.exec(s)) !== null) {
    if (PII_PALAVRAS_NEUTRAS.has(m[2].toLowerCase())) continue;
    const t = m[2];
    const capitalizado = t[0] === t[0].toUpperCase() && t[0] !== t[0].toLowerCase() && t.slice(1) === t.slice(1).toLowerCase();
    if (capitalizado) {
      return { tipo: "nome pr\xF3prio", trecho: m[0] };
    }
  }
  m = /\b(paciente|pcte\.?|sr\.?|sra\.?)\s+([A-Z]\.[A-Z](?:\.[A-Z])?(?:\.[A-Z])?\.?)\b/i.exec(s);
  if (m) {
    return { tipo: "nome pr\xF3prio", trecho: m[0] };
  }
  m = /\b[A-Z]\.[A-Z](?:\.[A-Z])?(?:\.[A-Z])?\.?\b/.exec(s);
  if (m) {
    const norm = m[0].toUpperCase();
    const semPonto = norm.replace(/\.$/, "");
    if (!PII_ABBREV_MEDICAS.has(norm) && !PII_ABBREV_MEDICAS.has(semPonto)) {
      return { tipo: "nome pr\xF3prio", trecho: m[0] };
    }
  }
  const re3 = /\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,})\b\s*,?\s*(?:de\s+)?\d{1,3}\s+anos?\b/g;
  while ((m = re3.exec(s)) !== null) {
    const palavra = semAcentoPII(m[1].toLowerCase());
    if (PII_PALAVRAS_NEUTRAS.has(m[1].toLowerCase())) continue;
    if (!PRENOMES_COMUNS.has(palavra)) continue;
    return { tipo: "nome pr\xF3prio", trecho: m[0] };
  }
  return null;
}
function detectNomeProprio(text) {
  return detectNomeProprioDetalhado(text)?.tipo ?? null;
}
function detectAcademicPIIDetalhado(text) {
  if (!text) return null;
  const s = String(text);
  const achar = (re, tipo) => {
    const m = re.exec(s);
    return m ? { tipo, trecho: m[0] } : null;
  };
  let r;
  r = achar(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, "CPF");
  if (r) return r;
  r = achar(/\b(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}-?\d{4}\b/, "telefone");
  if (r) return r;
  r = achar(/\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/(19|20)\d{2}\b/, "data exata");
  if (r) return r;
  r = achar(/\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{2}\b/, "data exata");
  if (r) return r;
  r = achar(/\b(0?[1-9]|[12]\d|3[01])-(0?[1-9]|1[0-2])-(19|20)\d{2}\b/, "data exata");
  if (r) return r;
  r = achar(/\b(19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])\b/, "data exata");
  if (r) return r;
  r = achar(/\b(prontu[aá]rio|registro|matr[ií]cula|rg|cart[aã]o\s+(do\s+)?sus|cns)\s*[:#nº.]*\s*\d/i, "prontu\xE1rio/RG/CNS");
  if (r) return r;
  r = achar(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/i, "e-mail");
  if (r) return r;
  return detectNomeProprioDetalhado(s);
}
function detectAcademicPII(text) {
  return detectAcademicPIIDetalhado(text)?.tipo ?? null;
}
function detectAcademicPIIVerbose(campos) {
  const hits = [];
  for (const { campo, valor } of campos) {
    const achado = detectAcademicPIIDetalhado(
      typeof valor === "string" ? valor : ""
    );
    if (achado) {
      hits.push({ campo, tipo: achado.tipo, trecho: achado.trecho });
    }
  }
  return hits;
}
export {
  PII_ABBREV_MEDICAS,
  PII_PALAVRAS_NEUTRAS,
  detectAcademicPII,
  detectAcademicPIIDetalhado,
  detectAcademicPIIVerbose,
  detectNomeProprio,
  detectNomeProprioDetalhado
};
