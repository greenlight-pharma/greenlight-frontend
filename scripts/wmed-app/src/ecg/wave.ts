// Modelo temporal da condução cardíaca + traçado de estudo, compartilhado pelo
// coração ESQUEMÁTICO (EcgConducao, react-native-svg) e pelo coração 3D REAL
// (EcgCoracao3D, expo-gl). Um ciclo t normalizado em 0..1 é a JANELA desenhada
// na tela — que pode conter 1, 2, 3 ou 4 batimentos, conforme o achado.
//
// Antes isto era um punhado de `switch` com nove modos. Agora é um CATÁLOGO:
// cada achado que se vê num ECG tem a sua entrada, com a morfologia dos
// batimentos, o texto de cada faixa e a explicação didática. O coração é
// derivado DOS MESMOS batimentos, então a animação nunca contradiz o traçado.
//
// Achados que só existem ENTRE batimentos (Wenckebach, extrassístole,
// alternância elétrica, resposta irregular da fibrilação) precisam de mais de
// um batimento na janela: por isso `esc` = 1 / número de batimentos, e todas as
// larguras e intervalos são multiplicados por ela.

// ---- cores ----
export const BASE_CAM = "#1a2c48";
// QUATRO cores distintas, cada evento com a sua:
export const DESPOL_ATRIO = "#f4761f"; // despolarização atrial — laranja
export const DESPOL_VENT = "#c1121f"; // despolarização ventricular — vermelho
export const AZUL = "#2b6ca8"; // repolarização ventricular — azul
export const COND = "#e6b422"; // sistema de condução — dourado
export const OURO = DESPOL_ATRIO; // alias histórico
export const CINZA_ISQ = "#5a4a52"; // parede isquêmica (não acende normal)
const COND_OFF = "#6b5a2a";
const COND_ON = "#ffd54a";
const AV_BLOQ = "#8c3232"; // nó AV bloqueado: vermelho apagado

// Interpola duas cores hex "#rrggbb".
export function mistura(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) =>
    Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))),
  );
  return "#" + p.map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Gaussiana para as ondas do traçado.
function g(t: number, c: number, w: number, a: number): number {
  const x = (t - c) / w;
  return Math.abs(x) > 1 ? 0 : a * Math.exp(-(x * x) * 6);
}

// Rampa de ativação: acende e apaga suave. 0 a 1 dentro da janela.
export function fase(t: number, ini: number, fim: number): number {
  if (t < ini || t > fim) return 0;
  const x = (t - ini) / (fim - ini);
  return Math.sin(x * Math.PI);
}

// Ruído fibrilatório determinístico (soma de senos): não usa Math.random, então
// o traçado é sempre o mesmo e verificável.
function fibrilatorio(t: number, amp: number): number {
  return (
    amp *
    (0.5 * Math.sin(t * Math.PI * 44) +
      0.3 * Math.sin(t * Math.PI * 67 + 1.2) +
      0.2 * Math.sin(t * Math.PI * 91 + 2.7))
  );
}

// Dente de serra (flutter atrial), ondas F regulares e contínuas.
function serra(t: number, ondas: number, amp: number): number {
  const f = (t * ondas) % 1;
  return amp * (f - 0.5) * 2;
}

// ---- morfologia do QRS ----
// `tipo` escolhe o desenho; `largura` multiplica a duração; `amp` a altura.
// A versão antiga desenhava Q, R e S como blips separados por lacunas, o que
// dava aparência de complexo ALARGADO e entalhado mesmo em ritmos de QRS
// estreito (um preceptor pegou isso na fibrilação atrial). Todos os perfis
// abaixo são polilinhas CONTÍNUAS, sem lacuna.
export type TipoQRS =
  | "normal"
  | "rsr" // rSR' — bloqueio de ramo direito
  | "monofasico" // R largo e entalhado — bloqueio de ramo esquerdo
  | "delta" // subida lenta (onda delta) — pré-excitação
  | "bizarro" // largo e discordante — origem ventricular
  | "qpatologica"; // Q profunda e larga — área inativa

export type FormaQRS = {
  tipo?: TipoQRS;
  largura?: number;
  amp?: number;
  q?: number; // profundidade da Q (perfil normal)
  s?: number; // profundidade da S (perfil normal)
};

function perfilQRS(f: FormaQRS): [number, number][] {
  const amp = f.amp ?? 1;
  switch (f.tipo) {
    case "rsr":
      return [
        [-1, 0],
        [-0.72, -0.06 * amp],
        [-0.58, 0],
        [-0.36, 0.72 * amp], // r
        [-0.08, 0.12 * amp], // S
        [0.16, 0.6 * amp], // R'
        [0.48, -0.18 * amp],
        [0.76, 0],
        [1, 0],
      ];
    case "monofasico":
      return [
        [-1, 0],
        [-0.74, 0.04 * amp],
        [-0.42, 0.62 * amp],
        [-0.16, 0.92 * amp],
        [0.04, 0.76 * amp], // entalhe no topo
        [0.24, 0.98 * amp],
        [0.58, 0.22 * amp],
        [0.82, 0],
        [1, 0],
      ];
    case "delta":
      return [
        [-1, 0],
        [-0.78, 0.06 * amp], // início lento: a onda delta
        [-0.44, 0.26 * amp],
        [0, amp],
        [0.34, -0.24 * amp],
        [0.64, 0],
        [1, 0],
      ];
    case "bizarro":
      // Ocupa a largura INTEIRA, com subida e descida arrastadas: é assim que um
      // complexo de origem ventricular se lê como largo, e não como um pico fino
      // que apenas está mais espaçado dos vizinhos.
      return [
        [-1, 0],
        [-0.82, 0.16 * amp],
        [-0.48, 0.68 * amp],
        [-0.12, amp],
        [0.26, -0.5 * amp],
        [0.66, -0.22 * amp],
        [1, 0],
      ];
    case "qpatologica":
      return [
        [-1, 0],
        [-0.74, -0.05 * amp],
        [-0.52, -0.42 * amp], // Q larga e profunda
        [-0.22, -0.34 * amp],
        [0, 0.34 * amp], // R pequena
        [0.3, -0.1 * amp],
        [0.6, 0],
        [1, 0],
      ];
    default:
      return [
        [-1, 0],
        [-0.6, (f.q ?? -0.12) * amp],
        [-0.4, 0],
        [0, amp],
        [0.34, (f.s ?? -0.28) * amp],
        [0.62, 0],
        [1, 0],
      ];
  }
}

function qrsOnda(t: number, centro: number, f: FormaQRS, esc: number): number {
  const w = 0.04 * (f.largura ?? 1) * esc;
  const u = (t - centro) / w;
  if (u < -1 || u > 1) return 0;
  const pts = perfilQRS(f);
  for (let i = 0; i < pts.length - 1; i++) {
    const [u0, y0] = pts[i];
    const [u1, y1] = pts[i + 1];
    if (u >= u0 && u <= u1) {
      const k = u1 === u0 ? 0 : (u - u0) / (u1 - u0);
      return y0 + (y1 - y0) * k;
    }
  }
  return 0;
}

// ---- segmento ST ----
export type FormaST = "reto" | "concavo" | "convexo" | "descendente" | "colher";

function stOnda(
  t: number,
  ini: number,
  fim: number,
  nivel: number,
  forma: FormaST = "reto",
): number {
  if (fim <= ini) return 0;
  const r = (fim - ini) * 0.25; // rampas de entrada e saída
  if (t <= ini - r || t >= fim + r) return 0;
  const env = t < ini ? (t - (ini - r)) / r : t > fim ? (fim + r - t) / r : 1;
  const x = Math.max(0, Math.min(1, (t - ini) / (fim - ini)));
  let k = 1;
  if (forma === "concavo") k = 0.72 + 0.28 * Math.pow(2 * x - 1, 2);
  else if (forma === "convexo") k = 1 - 0.3 * Math.pow(2 * x - 1, 2);
  else if (forma === "descendente") k = 1 - 0.4 * x;
  else if (forma === "colher") k = 1 - 0.5 * Math.sin(Math.PI * x);
  return nivel * k * Math.max(0, env);
}

// Espícula de marcapasso: risco vertical e fino antes do QRS. É um TRIÂNGULO,
// não um degrau: um degrau estreito demais cai entre duas amostras do traçado e
// simplesmente não aparece na tela.
function espicula(t: number, c: number, esc: number): number {
  const w = 0.009 * esc;
  const d = Math.abs(t - c);
  return d < w ? 0.55 * (1 - d / w) : 0;
}

// ---- batimento ----
export type Bat = {
  c: number; // centro do QRS na janela (0..1)
  pOff?: number; // posição da P em relação ao QRS (padrão -0.225)
  p?: null; // null = batimento sem onda P
  pAmp?: number;
  pW?: number;
  pBifida?: boolean; // P mitrale (dois corcovos)
  pInvertida?: boolean; // P retrógrada (juncional)
  qrs?: FormaQRS | null; // null = P bloqueada, sem QRS
  // `funde`: o desnível NÃO volta à linha de base antes da onda T — ela é
  // desenhada EM CIMA do segmento deslocado, formando uma cúpula única. É assim
  // que um supra de ST se parece no papel; sem isso o ST voltava ao zero e o
  // batimento passava por sinusal.
  st?: { nivel: number; forma?: FormaST; funde?: boolean };
  tAmp?: number;
  tW?: number;
  tOff?: number;
  uAmp?: number; // onda U (hipocalemia)
  espicula?: boolean; // marcapasso
  osborn?: number; // entalhe J (hipotermia, repolarização precoce)
  prDep?: number; // depressão do segmento PR (pericardite)
};

export type Grupo =
  | "Ritmo"
  | "Condução AV"
  | "Condução intraventricular"
  | "Isquemia e infarto"
  | "Sobrecargas"
  | "Eletrólitos e QT"
  | "Outros padrões";

export type Faixa = { onda: string; texto: string; ini: number; fim: number };
export type Marca = { rotulo: string; t: number };

type Coracao =
  | "sinusal"
  | "fa"
  | "flutter"
  | "bavTotal"
  | "bavParcial"
  | "ramoD"
  | "ramoE"
  | "ventricular"
  | "fv"
  | "assistolia"
  | "juncional"
  | "wpw"
  | "isquemia";

type Def = {
  rotulo: string;
  grupo: Grupo;
  curto: string; // rótulo curto, para o chip
  pista: string; // o sinal que identifica o achado, numa linha
  ciclo: number; // duração da janela inteira, em ms
  bats: Bat[];
  fundo?: (t: number) => number;
  coracao?: Coracao;
  marcas?: Marca[];
  faixas: Faixa[];
  explicacao?: string;
  aliases?: string[];
  // Eixo elétrico médio do QRS, em graus. Convenção do ECG: 0° aponta para a
  // esquerda do paciente (DI) e o ângulo positivo desce (aVF = +90°). Só quem
  // foge do normal (+60°) declara.
  eixo?: number;
};

// Batimento com o QRS em `c`.
const bat = (c: number, extra: Partial<Bat> = {}): Bat => ({ c, ...extra });

// Trem regular de n batimentos dentro da janela.
const trem = (n: number, extra: (i: number) => Partial<Bat> = () => ({})): Bat[] =>
  Array.from({ length: n }, (_, i) => bat((i + 0.45) / n, extra(i)));

// Faixas e marcas de um batimento sinusal (janela de um batimento só).
const FAIXAS_BASE: Faixa[] = [
  { onda: "Onda P", texto: "despolarização dos átrios", ini: 0.08, fim: 0.26 },
  { onda: "Segmento PR", texto: "a pausa no nó AV, antes dos ventrículos", ini: 0.26, fim: 0.34 },
  { onda: "Complexo QRS", texto: "despolarização dos ventrículos", ini: 0.34, fim: 0.47 },
  { onda: "Segmento ST", texto: "linha de base após o QRS; sobe ou desce na isquemia", ini: 0.47, fim: 0.52 },
  { onda: "Onda T", texto: "repolarização dos ventrículos", ini: 0.52, fim: 0.8 },
];
const MARCAS_BASE: Marca[] = [
  { rotulo: "P", t: 0.16 },
  { rotulo: "QRS", t: 0.4 },
  { rotulo: "ST", t: 0.5 },
  { rotulo: "T", t: 0.62 },
];

// =====================================================================
// CATÁLOGO
// =====================================================================
const MODOS = {
  // ------------------------------ RITMO ------------------------------
  sinusal: {
    rotulo: "Ritmo sinusal",
    grupo: "Ritmo",
    curto: "Sinusal",
    pista: "P antes de cada QRS, R-R regular",
    ciclo: 2400,
    bats: [bat(0.385)],
    marcas: MARCAS_BASE,
    faixas: FAIXAS_BASE,
  },
  taquicardia_sinusal: {
    rotulo: "Taquicardia sinusal",
    grupo: "Ritmo",
    curto: "Taqui",
    pista: "acima de 100, com P preservada",
    ciclo: 1400,
    bats: trem(2),
    faixas: [
      { onda: "Onda P antes de cada QRS", texto: "o comando ainda é o nó sinusal", ini: 0, fim: 0.22 },
      { onda: "Complexo QRS", texto: "estreito: a condução abaixo do nó AV é normal", ini: 0.22, fim: 0.36 },
      { onda: "Ritmo rápido e regular", texto: "acima de 100 por minuto, com R-R constante", ini: 0.36, fim: 1 },
    ],
    explicacao:
      "A sequência elétrica é a mesma de sempre; só o marcapasso natural (nó sinusal) está disparando acima de 100 por minuto — em geral por febre, dor, ansiedade, exercício, anemia ou desidratação.",
    aliases: ["taquicardia", "taquicardia_sinusal_"],
  },
  bradicardia_sinusal: {
    rotulo: "Bradicardia sinusal",
    grupo: "Ritmo",
    curto: "Bradi",
    pista: "abaixo de 60, sequência normal",
    ciclo: 3800,
    bats: [bat(0.34)],
    marcas: [
      { rotulo: "P", t: 0.11 },
      { rotulo: "QRS", t: 0.35 },
      { rotulo: "T", t: 0.58 },
    ],
    faixas: [
      { onda: "Onda P", texto: "despolarização dos átrios, com formato normal", ini: 0.04, fim: 0.22 },
      { onda: "Complexo QRS", texto: "despolarização dos ventrículos", ini: 0.28, fim: 0.42 },
      { onda: "Onda T", texto: "repolarização dos ventrículos", ini: 0.46, fim: 0.72 },
      { onda: "Diástole longa", texto: "é a pausa entre os batimentos que deixa a frequência abaixo de 60", ini: 0.72, fim: 1 },
    ],
    explicacao:
      "A sequência elétrica é normal; o marcapasso natural (nó sinusal) só está mais lento, abaixo de 60 por minuto — comum em atletas e no sono, mas às vezes por problema no próprio nó ou por medicamento.",
    aliases: ["bradicardia"],
  },
  arritmia_sinusal: {
    rotulo: "Arritmia sinusal",
    grupo: "Ritmo",
    curto: "Arritmia sinusal",
    pista: "R-R varia com a respiração",
    ciclo: 3600,
    // Mesma morfologia em todos; o que muda é o ESPAÇO entre os batimentos.
    bats: [bat(0.16), bat(0.46), bat(0.83)],
    faixas: [
      { onda: "Onda P igual em todos", texto: "todo QRS tem a sua P, com o mesmo formato: o comando segue sinusal", ini: 0, fim: 0.33 },
      { onda: "R-R que varia", texto: "os intervalos encurtam e alongam de forma cíclica", ini: 0.33, fim: 0.66 },
      { onda: "Ligada à respiração", texto: "acelera na inspiração e desacelera na expiração", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "A respiração muda o tônus do nervo vago sobre o nó sinusal: ao inspirar o coração acelera um pouco, ao expirar desacelera. O ritmo continua sinusal, só que com o intervalo entre os batimentos variando. É um achado normal, sobretudo em pessoas jovens.",
  },
  fibrilacao_atrial: {
    rotulo: "Fibrilação atrial",
    grupo: "Ritmo",
    curto: "Fibrilação",
    pista: "sem onda P, R-R irregular",
    ciclo: 3000,
    // Sem P e com R-R IRREGULAR: três batimentos desigualmente espaçados.
    bats: [
      bat(0.14, { p: null }),
      bat(0.45, { p: null }),
      bat(0.82, { p: null }),
    ],
    fundo: (t) => fibrilatorio(t, 0.045),
    coracao: "fa",
    faixas: [
      { onda: "Sem onda P", texto: "no lugar dela, um tremor fino e contínuo (ondas f)", ini: 0, fim: 0.3 },
      { onda: "R-R irregular", texto: "os QRS aparecem em intervalos desiguais: é o sinal mais confiável", ini: 0.3, fim: 0.66 },
      { onda: "QRS estreito", texto: "abaixo do nó AV a condução é normal, então o complexo é fino", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "Em vez de um comando único vindo do nó sinusal, vários pontos dos átrios disparam ao mesmo tempo, de forma bagunçada. Os átrios tremem em vez de bater juntos, e o nó AV deixa passar esses impulsos de maneira irregular — por isso o pulso fica irregular e a onda P some.",
    aliases: ["fa"],
  },
  flutter_atrial: {
    rotulo: "Flutter atrial",
    grupo: "Ritmo",
    curto: "Flutter",
    pista: "dente de serra, R-R regular",
    ciclo: 2600,
    bats: [bat(0.3, { p: null }), bat(0.8, { p: null })],
    fundo: (t) => serra(t, 8, 0.1),
    coracao: "flutter",
    faixas: [
      { onda: "Ondas F", texto: "um circuito atrial regular desenha o dente de serra", ini: 0, fim: 0.3 },
      { onda: "Condução 2:1, 3:1...", texto: "o nó AV segura parte dos impulsos: só alguns viram QRS", ini: 0.3, fim: 0.66 },
      { onda: "R-R regular", texto: "diferente da fibrilação, aqui o intervalo costuma ser constante", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "Um curto-circuito faz o impulso girar em roda dentro do átrio, rápido e regular. Isso cria as ondas em dente de serra. O nó AV segura parte dos impulsos, deixando passar 1 a cada 2, 3 ou 4.",
  },
  taquicardia_supraventricular: {
    rotulo: "Taquicardia supraventricular",
    grupo: "Ritmo",
    curto: "TSV",
    pista: "rápida, estreita, P escondida",
    ciclo: 1300,
    bats: trem(3, () => ({ p: null, tAmp: 0.2 })),
    faixas: [
      { onda: "QRS estreito e rápido", texto: "acima de 150 por minuto, com R-R muito regular", ini: 0, fim: 0.34 },
      { onda: "Onda P não visível", texto: "fica escondida dentro do QRS ou da onda T", ini: 0.34, fim: 0.66 },
      { onda: "Início e fim súbitos", texto: "começa e termina de repente, diferente da taquicardia sinusal", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "O impulso entra num circuito curto acima dos ventrículos, em geral dentro do próprio nó AV, e fica girando nele. Como a volta é sempre igual, a frequência é alta e muito regular; como o caminho até os ventrículos é o normal, o QRS continua estreito.",
    aliases: ["tsv", "trn", "tpsv", "taquicardia_paroxistica"],
  },
  taquicardia_atrial_multifocal: {
    rotulo: "Taquicardia atrial multifocal",
    grupo: "Ritmo",
    curto: "TAM",
    pista: "ondas P de formatos diferentes",
    ciclo: 2400,
    bats: [
      bat(0.16, { pAmp: 0.17, pW: 0.02 }),
      bat(0.47, { pAmp: 0.1, pW: 0.03, pInvertida: true }),
      bat(0.83, { pAmp: 0.14, pW: 0.016 }),
    ],
    faixas: [
      { onda: "Ondas P diferentes entre si", texto: "pelo menos três formatos: cada batimento nasce num ponto do átrio", ini: 0, fim: 0.4 },
      { onda: "PR variável", texto: "como a origem muda, a distância até o QRS também muda", ini: 0.4, fim: 0.7 },
      { onda: "R-R irregular", texto: "lembra fibrilação atrial, mas aqui as ondas P existem e são visíveis", ini: 0.7, fim: 1 },
    ],
    explicacao:
      "Vários pontos diferentes do átrio assumem o comando, cada um com o seu formato de onda P. Como a origem muda a cada batimento, o traçado tem P de formatos distintos e ritmo irregular. É comum em doença pulmonar avançada.",
    aliases: ["tam"],
  },
  ritmo_juncional: {
    rotulo: "Ritmo juncional",
    grupo: "Ritmo",
    curto: "Juncional",
    pista: "P retrógrada, QRS estreito",
    ciclo: 3000,
    bats: [bat(0.4, { pOff: 0.14, pAmp: 0.1, pInvertida: true })],
    coracao: "juncional",
    faixas: [
      { onda: "Sem P antes do QRS", texto: "o comando não vem do nó sinusal", ini: 0, fim: 0.34 },
      { onda: "QRS estreito", texto: "nasce na junção AV e desce pelo caminho normal", ini: 0.34, fim: 0.5 },
      { onda: "P retrógrada", texto: "quando aparece, vem invertida e depois do QRS: os átrios ativam de baixo para cima", ini: 0.5, fim: 0.72 },
      { onda: "Ritmo de escape", texto: "costuma ficar entre 40 e 60 por minuto", ini: 0.72, fim: 1 },
    ],
    explicacao:
      "Quando o nó sinusal falha ou fica muito lento, a junção AV assume o comando como reserva. Ela fica logo acima dos ventrículos, então o QRS continua estreito; e como o impulso sobe para os átrios de baixo para cima, a onda P aparece invertida, colada ou depois do QRS.",
    aliases: ["escape_juncional", "juncional"],
  },
  taquicardia_ventricular: {
    rotulo: "Taquicardia ventricular",
    grupo: "Ritmo",
    curto: "TV",
    pista: "larga e rápida, sem P",
    ciclo: 1600,
    bats: trem(3, () => ({
      p: null,
      qrs: { tipo: "bizarro", largura: 3.4, amp: 1.05 },
      tAmp: -0.2,
      tOff: 0.16,
    })),
    coracao: "ventricular",
    eixo: -80,
    faixas: [
      { onda: "QRS largo", texto: "acima de 120 ms: o impulso nasce no ventrículo e caminha célula a célula", ini: 0, fim: 0.34 },
      { onda: "Sem P relacionada", texto: "os átrios seguem no seu ritmo, dissociados", ini: 0.34, fim: 0.66 },
      { onda: "Rápida e regular", texto: "três ou mais batimentos ventriculares seguidos acima de 100 por minuto", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "O comando é tomado por um ponto dentro do próprio ventrículo. Como o impulso não usa a fiação rápida (feixe de His e Purkinje), ele se espalha devagar, de célula em célula: o complexo fica largo e de formato estranho. É uma arritmia de emergência.",
    aliases: ["tv"],
  },
  fibrilacao_ventricular: {
    rotulo: "Fibrilação ventricular",
    grupo: "Ritmo",
    curto: "FV",
    pista: "caótico, sem QRS reconhecível",
    ciclo: 2000,
    bats: [],
    fundo: (t) =>
      0.4 * Math.sin(t * Math.PI * 21) +
      0.26 * Math.sin(t * Math.PI * 33 + 1.1) +
      0.16 * Math.sin(t * Math.PI * 47 + 2.3),
    coracao: "fv",
    marcas: [],
    faixas: [
      { onda: "Sem QRS reconhecível", texto: "não dá para identificar P, QRS nem T", ini: 0, fim: 0.4 },
      { onda: "Ondulação caótica", texto: "amplitude e intervalo mudam o tempo todo", ini: 0.4, fim: 0.7 },
      { onda: "Sem débito cardíaco", texto: "o coração treme e não ejeta sangue: é parada cardíaca", ini: 0.7, fim: 1 },
    ],
    explicacao:
      "Os ventrículos perdem qualquer coordenação: milhares de pontos disparam ao mesmo tempo e o músculo apenas treme, sem bombear. É o ritmo de parada cardíaca que responde à desfibrilação.",
    aliases: ["fv"],
  },
  ritmo_idioventricular: {
    rotulo: "Ritmo idioventricular",
    grupo: "Ritmo",
    curto: "Idioventricular",
    pista: "largo e muito lento",
    ciclo: 3600,
    bats: [
      bat(0.3, { p: null, qrs: { tipo: "bizarro", largura: 3.4, amp: 0.95 }, tAmp: -0.22, tOff: 0.2 }),
      bat(0.85, { p: null, qrs: { tipo: "bizarro", largura: 3.4, amp: 0.95 }, tAmp: -0.22, tOff: 0.2 }),
    ],
    coracao: "ventricular",
    eixo: -80,
    faixas: [
      { onda: "QRS largo e lento", texto: "o marcapasso de reserva está dentro do ventrículo", ini: 0, fim: 0.4 },
      { onda: "Sem onda P", texto: "não há comando vindo de cima", ini: 0.4, fim: 0.7 },
      { onda: "Frequência baixa", texto: "em geral entre 20 e 40 por minuto", ini: 0.7, fim: 1 },
    ],
    explicacao:
      "É a última reserva do coração: quando nem o nó sinusal nem a junção AV comandam, um ponto do ventrículo assume, muito devagar. Por nascer longe da fiação rápida, o complexo é largo.",
    aliases: ["escape_ventricular", "riva", "idioventricular"],
  },
  assistolia: {
    rotulo: "Assistolia",
    grupo: "Ritmo",
    curto: "Assistolia",
    pista: "linha quase reta",
    ciclo: 2400,
    bats: [],
    fundo: (t) => 0.012 * Math.sin(t * Math.PI * 9),
    coracao: "assistolia",
    marcas: [],
    faixas: [
      { onda: "Linha quase reta", texto: "sem atividade elétrica organizada", ini: 0, fim: 0.5 },
      { onda: "Confirmar em duas derivações", texto: "eletrodo solto e ganho baixo desenham a mesma linha", ini: 0.5, fim: 1 },
    ],
    explicacao:
      "Não há atividade elétrica: nenhum marcapasso do coração está disparando. Antes de assumir esse ritmo, confirma-se o traçado em mais de uma derivação, porque cabo solto e ganho baixo produzem a mesma imagem.",
  },
  ritmo_de_marcapasso: {
    rotulo: "Ritmo de marcapasso",
    grupo: "Ritmo",
    curto: "Marcapasso",
    pista: "espícula antes do complexo",
    ciclo: 2600,
    bats: [
      bat(0.28, { p: null, espicula: true, qrs: { tipo: "monofasico", largura: 2.6 }, tAmp: -0.2, tOff: 0.28 }),
      bat(0.78, { p: null, espicula: true, qrs: { tipo: "monofasico", largura: 2.6 }, tAmp: -0.2, tOff: 0.28 }),
    ],
    coracao: "ventricular",
    eixo: -70,
    faixas: [
      { onda: "Espícula", texto: "o risco fino e vertical é o disparo do aparelho", ini: 0, fim: 0.34 },
      { onda: "QRS largo depois da espícula", texto: "o estímulo entra pelo ventrículo, fora da fiação normal", ini: 0.34, fim: 0.66 },
      { onda: "Captura", texto: "toda espícula deve ser seguida de um complexo: é isso que se procura", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "Um marcapasso implantado envia o estímulo direto no músculo do coração. O risco fino que aparece antes do complexo é esse disparo. Como o estímulo não usa a fiação rápida, o QRS resultante é largo.",
    aliases: ["marcapasso", "pacemaker"],
  },
  extrassistole_ventricular: {
    rotulo: "Extrassístole ventricular",
    grupo: "Ritmo",
    curto: "ESV",
    pista: "batimento largo adiantado, com pausa",
    ciclo: 3400,
    bats: [
      bat(0.13),
      bat(0.4, { p: null, qrs: { tipo: "bizarro", largura: 3.0, amp: 1.1 }, tAmp: -0.26, tOff: 0.18 }),
      bat(0.85), // depois da pausa
    ],
    eixo: -75,
    faixas: [
      { onda: "Batimento adiantado", texto: "chega antes da hora, sem onda P própria", ini: 0.26, fim: 0.5 },
      { onda: "QRS largo e diferente", texto: "nasce no ventrículo, então se espalha devagar", ini: 0.5, fim: 0.66 },
      { onda: "Pausa compensatória", texto: "o intervalo seguinte é mais longo, e o ritmo normal retorna", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "Um ponto do ventrículo dispara antes da hora, por conta própria. Como esse impulso não usa a fiação rápida, o complexo sai largo e com formato diferente dos outros. Depois vem uma pausa, e o ritmo normal volta.",
    aliases: ["esv", "ev", "extrassistoles_ventriculares"],
  },
  extrassistole_supraventricular: {
    rotulo: "Extrassístole supraventricular",
    grupo: "Ritmo",
    curto: "ESSV",
    pista: "adiantado, estreito, com P diferente",
    ciclo: 3400,
    bats: [
      bat(0.14),
      bat(0.42, { pOff: -0.14, pAmp: 0.12, pW: 0.026 }),
      bat(0.84),
    ],
    faixas: [
      { onda: "Batimento adiantado", texto: "chega antes da hora, mas com onda P", ini: 0.26, fim: 0.5 },
      { onda: "P de formato diferente", texto: "nasce em outro ponto do átrio, não no nó sinusal", ini: 0.5, fim: 0.68 },
      { onda: "QRS estreito", texto: "desce pelo caminho normal: é isso que a separa da extrassístole ventricular", ini: 0.68, fim: 1 },
    ],
    explicacao:
      "Um ponto do átrio dispara antes da hora. Como o impulso ainda desce pelo nó AV e pela fiação normal, o complexo continua estreito; o que muda é o formato da onda P, que nasceu fora do nó sinusal.",
    aliases: ["essv", "esa", "extrassistole_atrial"],
  },

  // --------------------------- CONDUÇÃO AV ---------------------------
  bav_1grau: {
    rotulo: "BAV de 1º grau",
    grupo: "Condução AV",
    curto: "BAV 1º",
    pista: "PR acima de 200 ms, todo P conduz",
    ciclo: 2600,
    bats: [bat(0.5, { pOff: -0.36 })],
    coracao: "bavParcial",
    marcas: [
      { rotulo: "P", t: 0.14 },
      { rotulo: "PR", t: 0.31 },
      { rotulo: "QRS", t: 0.51 },
      { rotulo: "T", t: 0.74 },
    ],
    faixas: [
      { onda: "Onda P", texto: "os átrios despolarizam normalmente", ini: 0.04, fim: 0.24 },
      { onda: "PR alargado", texto: "acima de 200 ms: o impulso atravessa o nó AV com atraso", ini: 0.24, fim: 0.44 },
      { onda: "Toda P conduz", texto: "atrasa, mas nenhum batimento se perde", ini: 0.44, fim: 0.6 },
      { onda: "Onda T", texto: "repolarização dos ventrículos", ini: 0.6, fim: 0.88 },
    ],
    explicacao:
      "O sinal dos átrios passa pelo nó AV, mas demora mais do que deveria. Nenhum batimento se perde: apenas a distância entre a onda P e o QRS fica maior que o normal.",
    aliases: ["bav1", "bav_primeiro_grau", "bav_de_1_grau"],
  },
  bav_2grau_mobitz1: {
    rotulo: "BAV de 2º grau Mobitz I",
    grupo: "Condução AV",
    curto: "Mobitz I",
    pista: "PR aumenta até uma P falhar",
    ciclo: 4200,
    // PR que alonga a cada batimento até uma P bloquear (Wenckebach).
    // As ondas P ficam igualmente espaçadas (0,06 / 0,30 / 0,54 / 0,78) e o QRS
    // vai atrasando dentro desse intervalo: é isso que o aluno precisa enxergar.
    // pOff é RELATIVO e multiplicado por esc (aqui 1/4).
    bats: [
      bat(0.112, { pOff: -0.208 }), // PR curto
      bat(0.378, { pOff: -0.312 }), // PR maior
      bat(0.644, { pOff: -0.416 }), // PR maior ainda
      bat(0.86, { pOff: -0.32, qrs: null }), // a P que não conduz
    ],
    coracao: "bavParcial",
    marcas: [],
    faixas: [
      { onda: "PR que aumenta", texto: "a cada batimento, a distância entre P e QRS fica um pouco maior", ini: 0, fim: 0.66 },
      { onda: "Até uma P falhar", texto: "chega um momento em que a onda P não é seguida de QRS", ini: 0.66, fim: 0.97 },
      { onda: "E recomeça", texto: "depois da falha o ciclo se repete: é o fenômeno de Wenckebach", ini: 0.97, fim: 1 },
    ],
    explicacao:
      "O nó AV vai ficando cada vez mais lento a cada batimento, até que um impulso simplesmente não passa. Depois dessa falha ele se recupera e o ciclo recomeça. É o bloqueio de comportamento mais benigno.",
    aliases: ["wenckebach", "mobitz1", "bav2_mobitz1", "bav_2grau_mobitz_1"],
  },
  bav_2grau_mobitz2: {
    rotulo: "BAV de 2º grau Mobitz II",
    grupo: "Condução AV",
    curto: "Mobitz II",
    pista: "PR fixo, e uma falha sem aviso",
    ciclo: 4200,
    // P igualmente espaçadas (0,07 / 0,33 / 0,59 / 0,85) e PR SEMPRE igual; a
    // terceira simplesmente não conduz.
    bats: [
      bat(0.14, { pOff: -0.28 }),
      bat(0.4, { pOff: -0.28 }),
      bat(0.66, { pOff: -0.28, qrs: null }), // falha SEM aviso
      bat(0.92, { pOff: -0.28 }),
    ],
    coracao: "bavParcial",
    marcas: [],
    faixas: [
      { onda: "PR sempre igual", texto: "nos batimentos que conduzem, a distância entre P e QRS não muda", ini: 0, fim: 0.58 },
      { onda: "Falha súbita", texto: "de repente uma onda P não é seguida de QRS, sem aviso", ini: 0.58, fim: 0.86 },
      { onda: "Sinal de alerta", texto: "o bloqueio costuma estar abaixo do nó AV e pode evoluir para BAV total", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "Diferente do Mobitz I, aqui não há aviso: o intervalo PR é sempre o mesmo e, de repente, um batimento não passa. O problema costuma estar abaixo do nó AV, na própria fiação, e por isso é considerado mais grave.",
    aliases: ["mobitz2", "bav2_mobitz2", "bav_2grau_mobitz_2"],
  },
  bav_3grau: {
    rotulo: "BAV total (3º grau)",
    grupo: "Condução AV",
    curto: "BAV total",
    pista: "P e QRS independentes",
    ciclo: 3600,
    // Átrios e ventrículos em frequências próprias, sem relação entre si: as P
    // do fundo caminham por cima dos QRS de escape.
    bats: [
      bat(0.3, { p: null, qrs: { largura: 1.6 }, tAmp: 0.22, tOff: 0.16 }),
      bat(0.85, { p: null, qrs: { largura: 1.6 }, tAmp: 0.22, tOff: 0.16 }),
    ],
    fundo: (t) =>
      g(t, 0.07, 0.026, 0.14) +
      g(t, 0.31, 0.026, 0.14) +
      g(t, 0.55, 0.026, 0.14) +
      g(t, 0.79, 0.026, 0.14),
    coracao: "bavTotal",
    marcas: [],
    faixas: [
      { onda: "P no seu ritmo", texto: "as ondas P aparecem regulares, independentes do resto", ini: 0, fim: 0.34 },
      { onda: "QRS no ritmo dele", texto: "os ventrículos disparam sozinhos, mais devagar", ini: 0.34, fim: 0.66 },
      { onda: "Dissociação AV", texto: "nenhuma P tem relação fixa com o QRS: nada atravessa o nó AV", ini: 0.66, fim: 1 },
    ],
    explicacao:
      "Nenhum impulso dos átrios chega aos ventrículos. Cada andar do coração passa a bater no seu próprio ritmo: os átrios mais rápido, os ventrículos num ritmo de escape lento. Por isso as ondas P e os complexos QRS caminham sem relação entre si.",
    aliases: ["bav", "bavt", "bav_total", "bloqueio_av", "bav3", "bav_terceiro_grau"],
  },
  pre_excitacao: {
    rotulo: "Pré-excitação (WPW)",
    grupo: "Condução AV",
    curto: "WPW",
    pista: "PR curto com onda delta",
    ciclo: 2400,
    bats: [bat(0.4, { pOff: -0.16, qrs: { tipo: "delta", largura: 1.5 }, tAmp: -0.2, tOff: 0.26 })],
    coracao: "wpw",
    marcas: [
      { rotulo: "P", t: 0.24 },
      { rotulo: "delta", t: 0.365 },
      { rotulo: "QRS", t: 0.42 },
      { rotulo: "T", t: 0.66 },
    ],
    eixo: 30,
    faixas: [
      { onda: "PR curto", texto: "abaixo de 120 ms: o impulso chegou aos ventrículos por um atalho", ini: 0.1, fim: 0.33 },
      { onda: "Onda delta", texto: "a subida inicial do QRS fica lenta e arredondada", ini: 0.33, fim: 0.42 },
      { onda: "QRS alargado", texto: "parte do ventrículo é ativada fora da fiação normal", ini: 0.42, fim: 0.56 },
      { onda: "Repolarização alterada", texto: "ST e T costumam ir para o lado oposto ao QRS", ini: 0.56, fim: 0.88 },
    ],
    explicacao:
      "Existe um caminho extra ligando átrio e ventrículo, que desvia do nó AV. Como esse atalho não segura o impulso, parte do ventrículo começa a ativar cedo demais: daí o PR curto e a subida lenta no início do QRS, a onda delta.",
    aliases: ["wpw", "wolff_parkinson_white", "preexcitacao"],
  },

  // ------------------- CONDUÇÃO INTRAVENTRICULAR ---------------------
  bloqueio_ramo_direito: {
    rotulo: "Bloqueio de ramo direito",
    grupo: "Condução intraventricular",
    curto: "BRD",
    pista: "QRS largo, dois picos (rSR')",
    ciclo: 2400,
    bats: [bat(0.4, { qrs: { tipo: "rsr", largura: 1.9 }, tAmp: -0.2, tOff: 0.26 })],
    coracao: "ramoD",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "rSR'", t: 0.41 },
      { rotulo: "T", t: 0.66 },
    ],
    eixo: 95,
    faixas: [
      { onda: "Onda P", texto: "a condução atrial é normal", ini: 0.08, fim: 0.26 },
      { onda: "QRS alargado", texto: "acima de 120 ms, com dois picos (rSR' em V1)", ini: 0.3, fim: 0.54 },
      { onda: "T discordante", texto: "a onda T aponta para o lado oposto ao último pico do QRS", ini: 0.54, fim: 0.88 },
    ],
    explicacao:
      "Um dos fios que levam o sinal aos ventrículos, o ramo direito, está interrompido. O ventrículo direito então recebe o impulso com atraso, passando de célula em célula — e é por isso que o QRS fica largo, com dois picos.",
    aliases: ["brd", "bcrd"],
  },
  bloqueio_ramo_esquerdo: {
    rotulo: "Bloqueio de ramo esquerdo",
    grupo: "Condução intraventricular",
    curto: "BRE",
    pista: "QRS largo e entalhado",
    ciclo: 2400,
    bats: [bat(0.4, { qrs: { tipo: "monofasico", largura: 2 }, tAmp: -0.24, tOff: 0.28 })],
    coracao: "ramoE",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.41 },
      { rotulo: "T", t: 0.68 },
    ],
    eixo: -25,
    faixas: [
      { onda: "Onda P", texto: "a condução atrial é normal", ini: 0.08, fim: 0.26 },
      { onda: "QRS alargado e entalhado", texto: "acima de 120 ms, com o topo em platô ou com dois corcovos", ini: 0.3, fim: 0.56 },
      { onda: "T discordante", texto: "ST e T vão para o lado oposto ao QRS, o que dificulta a leitura de isquemia", ini: 0.56, fim: 0.9 },
    ],
    explicacao:
      "Um dos fios que levam o sinal aos ventrículos, o ramo esquerdo, está interrompido. O ventrículo esquerdo recebe o impulso com atraso, passando de célula em célula — e é por isso que o QRS fica largo. Um bloqueio novo, junto com dor no peito, merece atenção imediata.",
    aliases: ["bre", "bcre"],
  },
  bloqueio_divisional_anterossuperior: {
    rotulo: "Bloqueio divisional ântero-superior",
    grupo: "Condução intraventricular",
    curto: "BDAS",
    pista: "QRS estreito, eixo à esquerda",
    ciclo: 2400,
    bats: [bat(0.4, { qrs: { q: -0.2, s: -0.5 }, tAmp: 0.24, tOff: 0.24 })],
    eixo: -55,
    faixas: [
      { onda: "QRS estreito", texto: "diferente do bloqueio de ramo, aqui a duração quase não muda", ini: 0.3, fim: 0.5 },
      { onda: "Eixo desviado à esquerda", texto: "é o achado principal: além de -45 graus", ini: 0.5, fim: 0.72 },
      { onda: "S profunda em DII, DIII e aVF", texto: "com R dominante em DI e aVL", ini: 0.72, fim: 1 },
    ],
    explicacao:
      "O ramo esquerdo se divide em dois feixes. Quando o de cima (ântero-superior) para de conduzir, a ativação do ventrículo esquerdo passa a começar por baixo e subir, o que joga o eixo elétrico para a esquerda sem alargar muito o complexo.",
    aliases: ["hbae", "bdas", "hemibloqueio_anterior_esquerdo"],
  },

  // ----------------------- ISQUEMIA E INFARTO ------------------------
  supra_st: {
    rotulo: "Supradesnível de ST",
    grupo: "Isquemia e infarto",
    curto: "Supra de ST",
    pista: "ST sobe e funde com a T",
    ciclo: 2400,
    bats: [
      bat(0.385, { st: { nivel: 0.42, forma: "convexo", funde: true }, tAmp: 0.34, tW: 0.1, tOff: 0.27 }),
    ],
    coracao: "isquemia",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.4 },
      { rotulo: "ST↑", t: 0.51 },
      { rotulo: "T", t: 0.635 },
    ],
    faixas: [
      { onda: "Onda P", texto: "despolarização dos átrios", ini: 0.08, fim: 0.26 },
      { onda: "Complexo QRS", texto: "despolarização dos ventrículos; a condução em si segue normal", ini: 0.34, fim: 0.45 },
      { onda: "ST elevado", texto: "o segmento sobe acima da linha de base, muitas vezes em cúpula", ini: 0.45, fim: 0.58 },
      { onda: "Onda T", texto: "funde-se ao ST elevado", ini: 0.58, fim: 0.86 },
      { onda: "Derivações vizinhas", texto: "o padrão precisa aparecer em duas derivações da mesma parede", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "Quando uma parede do coração fica sem fluxo de sangue, as células daquela área não conseguem manter a carga elétrica em repouso. Essa diferença entre a área lesada e o resto do músculo empurra o segmento ST para cima. A condução continua normal: o que mudou foi a recarga do músculo.",
    aliases: ["iam", "infarto_agudo", "corrente_de_lesao", "stemi", "supra_de_st", "supradesnivel"],
  },
  infra_st: {
    rotulo: "Infradesnível de ST",
    grupo: "Isquemia e infarto",
    curto: "Infra de ST",
    pista: "ST desce abaixo da linha",
    ciclo: 2400,
    bats: [
      bat(0.385, { st: { nivel: -0.16, forma: "descendente" }, tAmp: 0.2, tOff: 0.26 }),
    ],
    coracao: "isquemia",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.4 },
      { rotulo: "ST↓", t: 0.51 },
      { rotulo: "T", t: 0.645 },
    ],
    faixas: [
      { onda: "Complexo QRS", texto: "a condução segue normal", ini: 0.34, fim: 0.45 },
      { onda: "ST abaixo da linha", texto: "o segmento afunda; a forma retificada ou descendente pesa mais", ini: 0.45, fim: 0.6 },
      { onda: "Onda T", texto: "pode ficar achatada junto com o ST", ini: 0.6, fim: 0.86 },
      { onda: "Onde comparar", texto: "a referência é a linha entre o fim da T e o começo da P seguinte", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "A camada mais interna do músculo é a primeira a sentir a falta de sangue, porque é a mais distante das artérias. Quando ela sofre, o segmento ST desce em vez de subir. É o padrão típico da isquemia sob esforço e da angina.",
    aliases: ["isquemia_subendocardica", "infra_de_st", "infradesnivel"],
  },
  t_invertida: {
    rotulo: "Onda T invertida",
    grupo: "Isquemia e infarto",
    curto: "T invertida",
    pista: "T negativa e simétrica",
    ciclo: 2400,
    bats: [bat(0.385, { tAmp: -0.3, tW: 0.1 })],
    coracao: "isquemia",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.4 },
      { rotulo: "T", t: 0.62 },
    ],
    faixas: [
      { onda: "Complexo QRS", texto: "normal: a ativação dos ventrículos não mudou", ini: 0.34, fim: 0.47 },
      { onda: "T negativa e simétrica", texto: "a simetria é o que sugere isquemia, e não variação normal", ini: 0.52, fim: 0.84 },
      { onda: "Onde é normal", texto: "T invertida em aVR, e em V1 ou DIII isolados, costuma ser normal", ini: 0.84, fim: 1 },
    ],
    explicacao:
      "A parede que passou por isquemia se recarrega fora de ordem: em vez de repolarizar de fora para dentro, ela inverte esse sentido. No papel, isso aparece como uma onda T negativa e simétrica, sobretudo nas derivações da parede afetada.",
    aliases: ["isquemia_subepicardica", "onda_t_invertida", "isquemia", "t_negativa"],
  },
  t_hiperaguda: {
    rotulo: "Onda T hiperaguda",
    grupo: "Isquemia e infarto",
    curto: "T hiperaguda",
    pista: "T alta e de base larga",
    ciclo: 2400,
    bats: [bat(0.385, { st: { nivel: 0.1, funde: true }, tAmp: 0.5, tW: 0.11, tOff: 0.26 })],
    coracao: "isquemia",
    faixas: [
      { onda: "Complexo QRS", texto: "ainda normal nessa fase", ini: 0.34, fim: 0.47 },
      { onda: "T alta e larga", texto: "pontiaguda e de base larga, muitas vezes maior que a própria R", ini: 0.5, fim: 0.84 },
      { onda: "Primeiro sinal", texto: "aparece nos primeiros minutos da oclusão, antes do supra de ST", ini: 0.84, fim: 1 },
    ],
    explicacao:
      "É a primeira reação elétrica quando uma artéria fecha: antes de o ST subir, a onda T fica alta e de base larga na parede afetada. Reconhecer essa fase permite agir muito cedo.",
    aliases: ["t_hiperagudas"],
  },
  onda_q_patologica: {
    rotulo: "Onda Q patológica",
    grupo: "Isquemia e infarto",
    curto: "Q patológica",
    pista: "Q larga e profunda, R pequena",
    ciclo: 2400,
    bats: [bat(0.4, { qrs: { tipo: "qpatologica", largura: 1.25 }, tAmp: -0.18, tOff: 0.26 })],
    coracao: "isquemia",
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "Q", t: 0.383 },
      { rotulo: "T", t: 0.66 },
    ],
    faixas: [
      { onda: "Q larga e profunda", texto: "acima de 40 ms de duração ou de um quarto da altura da R", ini: 0.32, fim: 0.46 },
      { onda: "R pequena", texto: "a área que morreu não gera mais corrente elétrica", ini: 0.46, fim: 0.56 },
      { onda: "Marca permanente", texto: "costuma indicar infarto antigo, e não evento agudo", ini: 0.56, fim: 1 },
    ],
    explicacao:
      "Onde o músculo morreu não há mais corrente elétrica saindo. O eletrodo daquela parede passa a enxergar a atividade do lado oposto, que se afasta dele: por isso aparece uma deflexão negativa logo no começo do complexo. É a cicatriz elétrica do infarto.",
    aliases: ["infarto_antigo", "area_inativa", "onda_q", "q_patologica"],
  },

  // --------------------------- SOBRECARGAS ---------------------------
  sobrecarga_ventricular_esquerda: {
    rotulo: "Sobrecarga ventricular esquerda",
    grupo: "Sobrecargas",
    curto: "SVE",
    pista: "R muito alta, com strain",
    ciclo: 2400,
    bats: [
      bat(0.4, {
        pAmp: 0.16,
        qrs: { amp: 1.45, s: -0.3, largura: 1.15 },
        st: { nivel: -0.14, forma: "descendente" },
        tAmp: -0.3,
        tOff: 0.28,
      }),
    ],
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "R", t: 0.41 },
      { rotulo: "ST", t: 0.53 },
      { rotulo: "T", t: 0.68 },
    ],
    eixo: -20,
    faixas: [
      { onda: "Onda P", texto: "condução atrial normal", ini: 0.08, fim: 0.26 },
      { onda: "R muito alta", texto: "mais músculo gera mais voltagem: é a base dos critérios de Sokolow e de Cornell", ini: 0.32, fim: 0.5 },
      { onda: "Padrão strain", texto: "ST descendente com T negativa e assimétrica nas derivações esquerdas", ini: 0.5, fim: 0.86 },
      { onda: "QRS quase normal", texto: "a duração muda pouco: o que chama atenção é a altura", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "A parede do ventrículo esquerdo fica mais espessa, em geral por anos de pressão alta ou por doença da valva aórtica. Mais músculo significa mais corrente elétrica, e a onda R cresce. Como esse músculo espesso também se recarrega de forma diferente, o ST e a onda T costumam vir alterados junto.",
    aliases: ["hve", "hipertrofia_ventricular_esquerda", "sobrecarga_ve", "sve"],
  },
  sobrecarga_ventricular_direita: {
    rotulo: "Sobrecarga ventricular direita",
    grupo: "Sobrecargas",
    curto: "SVD",
    pista: "R dominante à direita, eixo desviado",
    ciclo: 2400,
    bats: [
      bat(0.4, {
        pAmp: 0.24,
        pW: 0.032,
        qrs: { amp: 0.9, s: -0.7 },
        st: { nivel: -0.08, forma: "descendente" },
        tAmp: -0.24,
        tOff: 0.26,
      }),
    ],
    eixo: 115,
    faixas: [
      { onda: "R dominante em V1", texto: "o ventrículo direito passa a mandar mais corrente para a frente", ini: 0.3, fim: 0.5 },
      { onda: "S profunda à esquerda", texto: "em V5 e V6 a deflexão negativa se aprofunda", ini: 0.5, fim: 0.68 },
      { onda: "Eixo desviado à direita", texto: "acompanha o quadro", ini: 0.68, fim: 0.84 },
      { onda: "Strain direito", texto: "T negativa de V1 a V3 e nas derivações inferiores", ini: 0.84, fim: 1 },
    ],
    explicacao:
      "O ventrículo direito engrossa quando precisa vencer pressão alta no pulmão, por doença pulmonar crônica ou por valvopatia. Ele passa a pesar mais no traçado: a onda R cresce nas derivações da direita e o eixo se desvia para esse lado.",
    aliases: ["hvd", "hipertrofia_ventricular_direita", "sobrecarga_vd", "svd"],
  },
  sobrecarga_atrial_direita: {
    rotulo: "Sobrecarga atrial direita",
    grupo: "Sobrecargas",
    curto: "SAD",
    pista: "P alta e pontiaguda",
    ciclo: 2400,
    bats: [bat(0.385, { pAmp: 0.3, pW: 0.036 })],
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.4 },
      { rotulo: "T", t: 0.62 },
    ],
    faixas: [
      { onda: "P alta e pontiaguda", texto: "acima de 2,5 mm em DII: é a P pulmonale", ini: 0.06, fim: 0.28 },
      { onda: "Duração normal", texto: "a onda cresce em altura, não em largura", ini: 0.28, fim: 0.5 },
      { onda: "Resto do traçado", texto: "QRS e repolarização podem estar normais", ini: 0.5, fim: 1 },
    ],
    explicacao:
      "O átrio direito despolariza primeiro. Quando ele está sobrecarregado, essa primeira parte da onda P cresce em altura, deixando a onda pontiaguda. É o padrão clássico das doenças pulmonares.",
    aliases: ["p_pulmonale", "sad", "sobrecarga_ad"],
  },
  sobrecarga_atrial_esquerda: {
    rotulo: "Sobrecarga atrial esquerda",
    grupo: "Sobrecargas",
    curto: "SAE",
    pista: "P larga e bífida",
    ciclo: 2400,
    bats: [bat(0.4, { pAmp: 0.17, pW: 0.075, pBifida: true, pOff: -0.24 })],
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.41 },
      { rotulo: "T", t: 0.64 },
    ],
    faixas: [
      { onda: "P larga e bífida", texto: "acima de 120 ms, com dois corcovos: é a P mitrale", ini: 0.04, fim: 0.3 },
      { onda: "Dois tempos", texto: "o primeiro corcovo é o átrio direito, o segundo é o esquerdo, atrasado", ini: 0.3, fim: 0.5 },
      { onda: "Resto do traçado", texto: "QRS e repolarização podem estar normais", ini: 0.5, fim: 1 },
    ],
    explicacao:
      "O átrio esquerdo despolariza depois do direito. Quando ele está dilatado, essa segunda parte demora mais, e a onda P fica larga e com dois corcovos. É comum na doença da valva mitral e na pressão alta de longa data.",
    aliases: ["p_mitrale", "sae", "sobrecarga_ae"],
  },

  // ------------------------ ELETRÓLITOS E QT -------------------------
  hipercalemia: {
    rotulo: "Hipercalemia",
    grupo: "Eletrólitos e QT",
    curto: "Hipercalemia",
    pista: "T apiculada, P baixa, QRS largo",
    ciclo: 2400,
    bats: [
      bat(0.4, { pAmp: 0.04, qrs: { largura: 1.7 }, tAmp: 0.6, tW: 0.055, tOff: 0.25 }),
    ],
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.41 },
      { rotulo: "T", t: 0.65 },
    ],
    faixas: [
      { onda: "P achatada", texto: "conforme o potássio sobe, a onda P encolhe e pode sumir", ini: 0.06, fim: 0.3 },
      { onda: "QRS alargado", texto: "a condução fica lenta em todo o músculo", ini: 0.3, fim: 0.54 },
      { onda: "T alta e estreita", texto: "pontiaguda e de base fina, como uma tenda: é o primeiro sinal", ini: 0.54, fim: 0.82 },
      { onda: "Risco", texto: "no extremo o traçado vira uma onda sinusoidal — emergência", ini: 0.82, fim: 1 },
    ],
    explicacao:
      "O potássio alto no sangue deixa as células do coração mais difíceis de recarregar e de despolarizar. Primeiro a onda T fica alta e pontiaguda; depois a onda P encolhe e o QRS alarga, porque o impulso caminha cada vez mais devagar.",
    aliases: ["potassio_alto", "hiperpotassemia"],
  },
  hipocalemia: {
    rotulo: "Hipocalemia",
    grupo: "Eletrólitos e QT",
    curto: "Hipocalemia",
    pista: "T achatada e onda U",
    ciclo: 2600,
    bats: [
      bat(0.34, {
        st: { nivel: -0.09, forma: "descendente" },
        tAmp: 0.09,
        tW: 0.075,
        tOff: 0.24,
        uAmp: 0.17,
      }),
    ],
    marcas: [
      { rotulo: "P", t: 0.12 },
      { rotulo: "QRS", t: 0.35 },
      { rotulo: "T", t: 0.58 },
      { rotulo: "U", t: 0.72 },
    ],
    faixas: [
      { onda: "ST deprimido", texto: "o segmento afunda levemente", ini: 0.4, fim: 0.5 },
      { onda: "T achatada", texto: "a onda T perde altura", ini: 0.5, fim: 0.66 },
      { onda: "Onda U", texto: "surge uma onda extra logo depois da T: é a marca da hipocalemia", ini: 0.66, fim: 0.88 },
      { onda: "Risco", texto: "favorece extrassístoles e arritmias, ainda mais em quem usa digital", ini: 0.88, fim: 1 },
    ],
    explicacao:
      "Com pouco potássio, a recarga das células do coração fica lenta e incompleta. A onda T achata, o ST desce um pouco e aparece uma onda extra logo depois da T, a onda U. Em casos mais graves, T e U se fundem numa onda só.",
    aliases: ["potassio_baixo", "hipopotassemia"],
  },
  qt_longo: {
    rotulo: "QT longo",
    grupo: "Eletrólitos e QT",
    curto: "QT longo",
    pista: "do QRS ao fim da T, esticado",
    ciclo: 2800,
    bats: [bat(0.28, { st: { nivel: 0.01 }, tAmp: 0.26, tW: 0.1, tOff: 0.4 })],
    marcas: [
      { rotulo: "P", t: 0.06 },
      { rotulo: "QRS", t: 0.29 },
      { rotulo: "ST", t: 0.5 },
      { rotulo: "T", t: 0.68 },
    ],
    faixas: [
      { onda: "Do QRS ao fim da T", texto: "é esse trecho que se mede; corrigido pela frequência, vira o QTc", ini: 0.26, fim: 0.4 },
      { onda: "Segmento longo", texto: "a distância até a onda T aumenta", ini: 0.4, fim: 0.58 },
      { onda: "Onda T tardia", texto: "a recarga do ventrículo demora a terminar", ini: 0.58, fim: 0.82 },
      { onda: "Causas", texto: "medicamentos, cálcio ou magnésio baixos, e formas congênitas", ini: 0.82, fim: 1 },
    ],
    explicacao:
      "O QT mede quanto tempo o ventrículo leva para bater e se recarregar por completo. Quando esse tempo se estica, sobra uma janela em que um estímulo fora de hora pode disparar uma arritmia grave (torsades de pointes). Vários remédios comuns alongam o QT.",
    aliases: ["hipocalcemia", "qtc_longo", "qt_prolongado"],
  },
  qt_curto: {
    rotulo: "QT curto",
    grupo: "Eletrólitos e QT",
    curto: "QT curto",
    pista: "T quase colada no QRS",
    ciclo: 2400,
    bats: [bat(0.42, { tAmp: 0.3, tW: 0.07, tOff: 0.15 })],
    marcas: [
      { rotulo: "P", t: 0.2 },
      { rotulo: "QRS", t: 0.43 },
      { rotulo: "T", t: 0.57 },
    ],
    faixas: [
      { onda: "ST quase ausente", texto: "a onda T vem logo depois do QRS", ini: 0.44, fim: 0.54 },
      { onda: "QT curto", texto: "abaixo de 340 ms no QTc", ini: 0.54, fim: 0.7 },
      { onda: "Causas", texto: "cálcio alto, digital e formas congênitas", ini: 0.7, fim: 1 },
    ],
    explicacao:
      "A recarga do ventrículo termina mais rápido do que deveria, e a onda T aparece quase colada ao QRS. A causa mais comum é cálcio alto no sangue.",
    aliases: ["hipercalcemia", "qtc_curto"],
  },

  // -------------------------- OUTROS PADRÕES -------------------------
  pericardite: {
    rotulo: "Pericardite aguda",
    grupo: "Outros padrões",
    curto: "Pericardite",
    pista: "ST côncavo difuso, PR deprimido",
    ciclo: 2400,
    bats: [
      bat(0.4, { st: { nivel: 0.2, forma: "concavo", funde: true }, tAmp: 0.24, tOff: 0.27, prDep: 0.06 }),
    ],
    marcas: [
      { rotulo: "P", t: 0.16 },
      { rotulo: "QRS", t: 0.41 },
      { rotulo: "ST↑", t: 0.52 },
      { rotulo: "T", t: 0.66 },
    ],
    faixas: [
      { onda: "PR deprimido", texto: "o segmento antes do QRS desce — sinal bem específico", ini: 0.24, fim: 0.34 },
      { onda: "ST elevado e côncavo", texto: "sobe com a concavidade para cima, como um sorriso", ini: 0.45, fim: 0.6 },
      { onda: "Difuso", texto: "aparece em quase todas as derivações, não só numa parede", ini: 0.6, fim: 0.8 },
      { onda: "Sem imagem em espelho", texto: "não há infra recíproco, ao contrário do infarto", ini: 0.8, fim: 1 },
    ],
    explicacao:
      "A inflamação da membrana que envolve o coração irrita a superfície do músculo inteiro, e não uma parede só. Por isso o ST sobe em quase todas as derivações, com formato côncavo, e não existe a imagem em espelho que o infarto costuma deixar.",
    aliases: ["pericardite_aguda"],
  },
  alternancia_eletrica: {
    rotulo: "Alternância elétrica",
    grupo: "Outros padrões",
    curto: "Alternância",
    pista: "altura do QRS alterna",
    ciclo: 3200,
    bats: [
      bat(0.16, { qrs: { amp: 0.95 }, tAmp: 0.22 }),
      bat(0.45, { qrs: { amp: 0.45 }, tAmp: 0.12 }),
      bat(0.74, { qrs: { amp: 0.95 }, tAmp: 0.22 }),
    ],
    faixas: [
      { onda: "QRS que muda de tamanho", texto: "a altura alterna a cada batimento", ini: 0, fim: 0.45 },
      { onda: "Baixa voltagem", texto: "no conjunto, os complexos ficam pequenos", ini: 0.45, fim: 0.75 },
      { onda: "Suspeita", texto: "derrame pericárdico volumoso, que pode evoluir para tamponamento", ini: 0.75, fim: 1 },
    ],
    explicacao:
      "Com muito líquido em volta do coração, ele passa a balançar dentro dessa bolsa a cada batimento. Como a posição muda, a altura do complexo muda junto, alternando entre maior e menor.",
    aliases: ["derrame_pericardico", "tamponamento"],
  },
  brugada: {
    rotulo: "Padrão de Brugada",
    grupo: "Outros padrões",
    curto: "Brugada",
    pista: "ST em cúpula com T negativa",
    ciclo: 2400,
    bats: [
      bat(0.4, {
        qrs: { tipo: "rsr", largura: 1.35 },
        st: { nivel: 0.2, forma: "descendente" },
        tAmp: -0.24,
        tOff: 0.28,
      }),
    ],
    faixas: [
      { onda: "ST em cúpula", texto: "sobe em V1 e V2 e desce em rampa até a onda T", ini: 0.44, fim: 0.62 },
      { onda: "T negativa", texto: "fecha o padrão tipo 1", ini: 0.62, fim: 0.86 },
      { onda: "Só nas precordiais direitas", texto: "o padrão vive em V1 e V2, às vezes com os eletrodos um espaço acima", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "Uma alteração nos canais de sódio do coração faz a saída do complexo, em V1 e V2, subir em cúpula e descer até uma onda T negativa. É um padrão herdado, associado a risco de arritmia grave, e sempre precisa de avaliação especializada.",
    aliases: ["sindrome_de_brugada"],
  },
  repolarizacao_precoce: {
    rotulo: "Repolarização precoce",
    grupo: "Outros padrões",
    curto: "Repol. precoce",
    pista: "ponto J elevado, ST côncavo",
    ciclo: 2400,
    bats: [
      bat(0.4, { st: { nivel: 0.13, forma: "concavo", funde: true }, tAmp: 0.32, tOff: 0.27, osborn: 0.16 }),
    ],
    faixas: [
      { onda: "Entalhe no fim do QRS", texto: "o ponto J fica elevado, com um pequeno degrau", ini: 0.42, fim: 0.5 },
      { onda: "ST côncavo", texto: "sobe pouco, com a concavidade para cima", ini: 0.5, fim: 0.62 },
      { onda: "T alta", texto: "acompanha o ST, em geral em jovens e atletas", ini: 0.62, fim: 0.86 },
      { onda: "Variante normal", texto: "é achado benigno na maioria, mas exige o contexto clínico", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "Em muitas pessoas jovens e saudáveis, sobretudo atletas, a recarga do coração começa um pouco antes do habitual. Isso levanta discretamente o ponto onde o QRS termina e o ST começa, com um pequeno entalhe. É quase sempre benigno.",
    aliases: ["repol_precoce"],
  },
  digital: {
    rotulo: "Impregnação digitálica",
    grupo: "Outros padrões",
    curto: "Digital",
    pista: "ST escavado em colher",
    ciclo: 2600,
    bats: [
      bat(0.38, { st: { nivel: -0.12, forma: "colher" }, tAmp: 0.1, tOff: 0.26 }),
    ],
    faixas: [
      { onda: "ST em colher", texto: "o segmento desce com a concavidade escavada", ini: 0.4, fim: 0.58 },
      { onda: "T achatada", texto: "a onda T fica pequena, às vezes negativa", ini: 0.58, fim: 0.8 },
      { onda: "QT encurtado", texto: "acompanha o padrão", ini: 0.8, fim: 0.92 },
      { onda: "Efeito, não intoxicação", texto: "o desenho aparece já na dose certa; a intoxicação se mostra por arritmias", ini: 0.92, fim: 1 },
    ],
    explicacao:
      "O digital muda a forma como o coração se recarrega e desenha um segmento ST escavado, parecido com uma colher. Esse desenho aparece já na dose certa do remédio e não significa intoxicação por si só.",
    aliases: ["impregnacao_digitalica", "digoxina"],
  },
  s1q3t3: {
    rotulo: "Padrão S1Q3T3",
    grupo: "Outros padrões",
    curto: "S1Q3T3",
    pista: "S em DI, Q e T negativa em DIII",
    ciclo: 1800,
    bats: trem(2, () => ({ qrs: { q: -0.34, s: -0.5 }, tAmp: -0.24, tOff: 0.24 })),
    eixo: 105,
    faixas: [
      { onda: "Taquicardia", texto: "na prática é o achado mais frequente na embolia pulmonar", ini: 0, fim: 0.3 },
      { onda: "S em DI, Q em DIII", texto: "com T negativa em DIII: é o padrão que dá nome", ini: 0.3, fim: 0.6 },
      { onda: "Sobrecarga direita aguda", texto: "T negativa de V1 a V4 e bloqueio de ramo direito novo reforçam", ini: 0.6, fim: 0.86 },
      { onda: "Pouco sensível", texto: "um ECG normal não exclui embolia pulmonar", ini: 0.86, fim: 1 },
    ],
    explicacao:
      "Quando um coágulo bloqueia a circulação do pulmão, o ventrículo direito é forçado de repente e o eixo elétrico do coração gira. Esse giro deixa uma onda S em DI e uma onda Q com T negativa em DIII. É um padrão sugestivo, não uma prova: a maior parte dos casos mostra apenas taquicardia.",
    aliases: ["tep", "embolia_pulmonar"],
  },
  onda_j_osborn: {
    rotulo: "Onda J (Osborn)",
    grupo: "Outros padrões",
    curto: "Onda J",
    pista: "corcovo no fim do QRS",
    ciclo: 3400,
    bats: [bat(0.4, { osborn: 0.3, tAmp: 0.24, tOff: 0.28 })],
    faixas: [
      { onda: "Bradicardia", texto: "o ritmo fica lento conforme a temperatura cai", ini: 0, fim: 0.34 },
      { onda: "Onda J", texto: "um corcovo logo no fim do QRS, na junção com o segmento ST", ini: 0.42, fim: 0.56 },
      { onda: "Intervalos longos", texto: "PR, QRS e QT se alargam junto", ini: 0.56, fim: 0.82 },
      { onda: "Tremor de base", texto: "o tremor muscular do frio suja o traçado", ini: 0.82, fim: 1 },
    ],
    explicacao:
      "Na hipotermia, o fim da despolarização e o começo da recarga se descolam, e aparece um corcovo na junção entre o QRS e o segmento ST. Quanto mais baixa a temperatura, maior essa onda.",
    aliases: ["hipotermia", "osborn"],
  },
  baixa_voltagem: {
    rotulo: "Baixa voltagem",
    grupo: "Outros padrões",
    curto: "Baixa voltagem",
    pista: "complexos pequenos em tudo",
    ciclo: 2400,
    bats: [bat(0.4, { pAmp: 0.06, qrs: { amp: 0.34 }, tAmp: 0.1 })],
    faixas: [
      { onda: "Complexos pequenos", texto: "abaixo de 5 mm nas derivações dos membros", ini: 0.3, fim: 0.55 },
      { onda: "Causas de fora do coração", texto: "obesidade, enfisema, líquido no pericárdio ou no tórax", ini: 0.55, fim: 0.8 },
      { onda: "Conferir a calibração", texto: "antes de concluir, checar se o ganho está em 10 mm/mV", ini: 0.8, fim: 1 },
    ],
    explicacao:
      "A corrente do coração precisa atravessar o tórax até chegar ao eletrodo. Quando existe algo no caminho que atrapalha essa passagem, como ar, gordura ou líquido, tudo chega menor, e os complexos ficam baixos em todas as derivações.",
    aliases: ["microvoltagem"],
  },
} satisfies Record<string, Def>;

export type ModoEcg = keyof typeof MODOS;

const CHAVES = Object.keys(MODOS) as ModoEcg[];

// Mapa de sinônimos -> chave oficial. Cobre os nomes antigos (a IA e os apps
// já publicados mandam "bav", "taquicardia", "isquemia") e variações comuns.
const APELIDOS: Record<string, ModoEcg> = (() => {
  const m: Record<string, ModoEcg> = {};
  for (const k of CHAVES) {
    m[k] = k;
    for (const a of (MODOS[k] as Def).aliases || []) if (!m[a]) m[a] = k;
  }
  return m;
})();

export function normalizarModo(m?: string): ModoEcg {
  const s = String(m || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tira acentos
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return APELIDOS[s] || "sinusal";
}

const def = (modo: ModoEcg): Def => (MODOS[modo] ?? MODOS.sinusal) as Def;
const escalaDe = (d: Def): number => (d.bats.length > 1 ? 1 / d.bats.length : 1);

// ---- traçado do ECG por modo. y em unidades (para cima = positivo) ----
export function ecgY(modo: ModoEcg, t: number): number {
  const d = def(modo);
  const esc = escalaDe(d);
  let y = d.fundo ? d.fundo(t) : 0;
  for (const b of d.bats) {
    // onda P (podendo ser retrógrada, bífida, alta ou achatada)
    if (b.p !== null && (b.pAmp ?? 0.15) !== 0) {
      const pc = b.c + (b.pOff ?? -0.225) * esc;
      const amp = (b.pAmp ?? 0.15) * (b.pInvertida ? -1 : 1);
      const w = (b.pW ?? 0.045) * esc;
      if (b.pBifida) {
        y += g(t, pc - w * 0.4, w * 0.6, amp * 0.9);
        y += g(t, pc + w * 0.4, w * 0.6, amp);
      } else {
        y += g(t, pc, w, amp);
      }
    }
    if (b.qrs === null) continue; // P bloqueada: sem QRS, sem ST, sem T
    const f = b.qrs ?? {};
    // A espícula fica ANTES do começo do complexo. Fixá-la num deslocamento
    // constante a colocava dentro do QRS quando o complexo é largo.
    if (b.espicula)
      y += espicula(t, b.c - 0.04 * (f.largura ?? 1) * esc - 0.012 * esc, esc);
    if (b.prDep && b.p !== null) {
      const pc = b.c + (b.pOff ?? -0.225) * esc;
      const pw = (b.pW ?? 0.045) * esc;
      const iniQrs = b.c - 0.04 * (f.largura ?? 1) * esc;
      y += stOnda(t, pc + pw * 1.2, iniQrs, -Math.abs(b.prDep), "reto");
    }
    y += qrsOnda(t, b.c, f, esc);
    const fimQrs = b.c + 0.04 * (f.largura ?? 1) * esc;
    if (b.osborn) y += g(t, fimQrs + 0.01 * esc, 0.024 * esc, b.osborn);
    const tw = (b.tW ?? 0.09) * esc;
    const tc = b.c + (b.tOff ?? 0.235) * esc;
    if (b.st) {
      // Fundido: o desnível segue por baixo da onda T (cúpula única).
      const fimSt = b.st.funde ? tc + tw * 0.8 : tc - tw * 0.9;
      y += stOnda(t, fimQrs, fimSt, b.st.nivel, b.st.forma);
    }
    const ta = b.tAmp ?? 0.28;
    if (ta !== 0) y += g(t, tc, tw, ta);
    if (b.uAmp) y += g(t, tc + 0.145 * esc, 0.05 * esc, b.uAmp);
  }
  return y;
}

// Ciclo em milissegundos da JANELA inteira (que pode ter vários batimentos).
export function cicloDoModo(modo: ModoEcg): number {
  return def(modo).ciclo;
}

// Afasta rótulos que cairiam um em cima do outro. "QRS" e "ST" separados por
// 0,1 se sobrepunham na tela e saía "QRSST" — agora há uma folga mínima
// garantida, para qualquer achado do catálogo.
const FOLGA_MARCA = 0.085;
function semColisao(m: Marca[]): Marca[] {
  const ord = [...m].sort((a, b) => a.t - b.t);
  for (let i = 1; i < ord.length; i++) {
    const min = ord[i - 1].t + FOLGA_MARCA;
    if (ord[i].t < min) ord[i] = { ...ord[i], t: min };
  }
  return ord.map((x) => ({ ...x, t: Math.max(0.03, Math.min(0.97, x.t)) }));
}

// Rótulos fixos das ondas sobre o traçado.
export function marcasDoModo(modo: ModoEcg): Marca[] {
  const d = def(modo);
  if (d.marcas) return semColisao(d.marcas);
  const esc = escalaDe(d);
  const b = d.bats[0];
  if (!b) return [];
  const m: Marca[] = [];
  if (b.p !== null && (b.pAmp ?? 0.15) !== 0)
    m.push({ rotulo: "P", t: b.c + (b.pOff ?? -0.225) * esc });
  if (b.qrs !== null) {
    m.push({ rotulo: "QRS", t: b.c + 0.012 * esc });
    if ((b.tAmp ?? 0.28) !== 0)
      m.push({ rotulo: "T", t: b.c + (b.tOff ?? 0.235) * esc });
  }
  return semColisao(m);
}

export function rotuloDoModo(modo: ModoEcg): string {
  return def(modo).rotulo;
}

export function grupoDoModo(modo: ModoEcg): Grupo {
  return def(modo).grupo;
}

export function faixasDoModo(modo: ModoEcg): Faixa[] {
  return def(modo).faixas;
}

// Explicação PADRÃO e didática do "por que acontece", por modo. Padroniza a
// mensagem (em vez de vir uma diferente a cada análise) e garante o tom mais
// simples possível. Retorna null quando não há padrão (aí usa-se o texto da IA).
export function explicacaoPorModo(modo: ModoEcg): string | null {
  return def(modo).explicacao ?? null;
}

export const GRUPOS: Grupo[] = [
  "Ritmo",
  "Condução AV",
  "Condução intraventricular",
  "Isquemia e infarto",
  "Sobrecargas",
  "Eletrólitos e QT",
  "Outros padrões",
];

// Lista para o explorador de traçados, já agrupada.
export function modosPorGrupo(): {
  grupo: Grupo;
  modos: { modo: ModoEcg; curto: string; rotulo: string; pista: string }[];
}[] {
  return GRUPOS.map((grupo) => ({
    grupo,
    modos: CHAVES.filter((k) => def(k).grupo === grupo).map((k) => ({
      modo: k,
      curto: def(k).curto,
      rotulo: def(k).rotulo,
      pista: def(k).pista,
    })),
  }));
}

// O sinal que identifica o achado, numa linha. Alimenta a lista do atlas: o
// aluno aprende olhando, sem precisar abrir cada um.
export function pistaDoModo(modo: ModoEcg): string {
  return def(modo).pista;
}

// =====================================================================
// CORAÇÃO — derivado DOS MESMOS batimentos, para animação e traçado nunca
// se contradizerem.
// =====================================================================
const cam = (cor: string, i: number) => ({ cor, i });
export type Camara = { cor: string; i: number };

export type FaseCoracao = {
  ad: Camara; // átrio direito
  ae: Camara; // átrio esquerdo
  vd: Camara; // ventrículo direito
  ve: Camara; // ventrículo esquerdo
  corSA: string;
  corAV: string;
  corHis: string;
  iAtrios: number; // opacidade das vias internodais no 2D
  // intensidades numéricas (0..1) dos nós/feixe — acendem a geometria 3D do
  // sistema de condução em sequência (nó SA → nó AV → His).
  sa: number;
  av: number;
  his: number;
};

type Intensidades = {
  iAtrios: number;
  iAV: number;
  iVent: number;
  iT: number;
  iVentTardio: number; // segundo ventrículo, no bloqueio de ramo
};

function intensidades(d: Def, t: number): Intensidades {
  const esc = escalaDe(d);
  let iAtrios = 0,
    iAV = 0,
    iVent = 0,
    iT = 0,
    iVentTardio = 0;
  for (const b of d.bats) {
    const larg = (b.qrs?.largura ?? 1) * esc;
    if (b.p !== null && (b.pAmp ?? 0.15) !== 0) {
      const pc = b.c + (b.pOff ?? -0.225) * esc;
      iAtrios = Math.max(iAtrios, fase(t, pc - 0.055 * esc, pc + 0.075 * esc));
      if (b.qrs !== null && b.c > pc)
        iAV = Math.max(iAV, fase(t, pc + 0.05 * esc, b.c - 0.03 * esc));
    }
    if (b.qrs === null) continue;
    iVent = Math.max(iVent, fase(t, b.c - 0.05 * larg, b.c + 0.075 * larg));
    iVentTardio = Math.max(
      iVentTardio,
      fase(t, b.c - 0.005 * larg, b.c + 0.13 * larg),
    );
    const tw = (b.tW ?? 0.09) * esc;
    const tc = b.c + (b.tOff ?? 0.235) * esc;
    if ((b.tAmp ?? 0.28) !== 0)
      iT = Math.max(iT, fase(t, tc - tw * 1.3, tc + tw * 1.5));
  }
  return { iAtrios, iAV, iVent, iT, iVentTardio };
}

// Estado de cada câmara/nó no instante t, conforme o modo.
export function faseCoracao(modo: ModoEcg, t: number): FaseCoracao {
  const d = def(modo);
  const n = intensidades(d, t);
  const tipo: Coracao = d.coracao ?? "sinusal";
  const atrio = (i: number) => cam(DESPOL_ATRIO, i);
  const ventDe = (i: number, iT: number) =>
    iT > i ? cam(AZUL, iT) : cam(DESPOL_VENT, i);

  switch (tipo) {
    case "fa": {
      // Átrios em tremor caótico contínuo; AD e AE fora de fase.
      const tremorD = 0.35 + 0.3 * Math.abs(Math.sin(t * Math.PI * 23));
      const tremorE = 0.35 + 0.3 * Math.abs(Math.sin(t * Math.PI * 29 + 1));
      const vent = ventDe(n.iVent, n.iT);
      return {
        ad: cam(DESPOL_ATRIO, tremorD * 0.7),
        ae: cam(DESPOL_ATRIO, tremorE * 0.7),
        vd: vent,
        ve: vent,
        corSA: mistura(COND_OFF, COND_ON, tremorD * 0.5),
        corAV: mistura(COND_OFF, COND_ON, n.iVent * 0.6),
        corHis: mistura(COND_OFF, COND_ON, n.iVent),
        iAtrios: (tremorD + tremorE) / 2,
        sa: Math.max(tremorD, tremorE) * 0.4,
        av: n.iVent * 0.6,
        his: n.iVent,
      };
    }
    case "flutter": {
      // Átrios acendem em pulsos regulares (ondas F), mais rápidos que o QRS.
      const pulso = Math.max(0, Math.sin(((t * 8) % 1) * Math.PI));
      const vent = ventDe(n.iVent, n.iT);
      return {
        ad: atrio(pulso * 0.8),
        ae: atrio(pulso * 0.8),
        vd: vent,
        ve: vent,
        corSA: mistura(COND_ON, "#fff2c2", pulso),
        corAV: mistura(COND_OFF, COND_ON, Math.max(pulso * 0.3, n.iVent * 0.5)),
        corHis: mistura(COND_OFF, COND_ON, n.iVent),
        iAtrios: pulso,
        sa: pulso,
        av: Math.max(pulso * 0.3, n.iVent * 0.5),
        his: n.iVent,
      };
    }
    case "bavTotal": {
      // Átrios no ritmo das P do fundo; nó AV APAGADO; ventrículos por conta
      // própria. As duas frequências não têm relação.
      const pulso = Math.max(
        fase(t, 0.02, 0.12),
        fase(t, 0.26, 0.36),
        fase(t, 0.5, 0.6),
        fase(t, 0.74, 0.84),
      );
      const vent = ventDe(n.iVent, n.iT);
      return {
        ad: atrio(pulso),
        ae: atrio(pulso),
        vd: vent,
        ve: vent,
        corSA: mistura(COND_ON, "#fff2c2", pulso),
        corAV: AV_BLOQ, // bloqueado
        corHis: mistura(COND_OFF, COND_ON, n.iVent * 0.5),
        iAtrios: pulso,
        sa: pulso,
        av: 0.08,
        his: n.iVent * 0.4,
      };
    }
    case "bavParcial": {
      // O impulso passa, porém devagar (ou falha em alguns batimentos): o nó AV
      // fica aceso por MAIS tempo, e vermelho quando a P não conduz.
      const vent = ventDe(n.iVent, n.iT);
      const conduzindo = n.iAV > 0.04 || n.iVent > 0.04;
      const bloqueada = n.iAtrios > 0.3 && !conduzindo;
      return {
        ad: atrio(n.iAtrios),
        ae: atrio(n.iAtrios),
        vd: vent,
        ve: vent,
        corSA: mistura(COND_ON, "#fff2c2", n.iAtrios),
        corAV: bloqueada
          ? AV_BLOQ
          : mistura(COND_OFF, COND_ON, Math.max(n.iAV, n.iVent * 0.5)),
        corHis: mistura(COND_OFF, COND_ON, n.iVent),
        iAtrios: n.iAtrios,
        sa: n.iAtrios,
        av: bloqueada ? 0.08 : Math.max(n.iAV, n.iVent * 0.5),
        his: n.iVent,
      };
    }
    case "ramoD":
    case "ramoE": {
      // Um ventrículo ativa e o outro ATRASA: a assincronia é o QRS largo.
      const bom = ventDe(n.iVent, n.iT);
      const atrasado = ventDe(n.iVentTardio, n.iT);
      const direito = tipo === "ramoD";
      return {
        ad: atrio(n.iAtrios),
        ae: atrio(n.iAtrios),
        vd: direito ? atrasado : bom,
        ve: direito ? bom : atrasado,
        corSA: mistura(COND_ON, "#fff2c2", n.iAtrios),
        corAV: mistura(COND_OFF, COND_ON, Math.max(n.iAV, n.iVent * 0.6)),
        corHis: mistura(COND_OFF, COND_ON, n.iVent),
        iAtrios: n.iAtrios,
        sa: n.iAtrios,
        av: Math.max(n.iAV, n.iVent * 0.6),
        his: n.iVent,
      };
    }
    case "ventricular": {
      // Origem DENTRO do ventrículo: nada acende acima, e a fiação fica apagada.
      const vent = ventDe(n.iVent, n.iT);
      return {
        ad: atrio(0.05),
        ae: atrio(0.05),
        vd: vent,
        ve: ventDe(n.iVentTardio, n.iT),
        corSA: COND_OFF,
        corAV: COND_OFF,
        corHis: COND_OFF,
        iAtrios: 0.05,
        sa: 0.05,
        av: 0.05,
        his: 0.1,
      };
    }
    case "fv": {
      // Ventrículos tremendo, sem sequência alguma.
      const a = 0.3 + 0.35 * Math.abs(Math.sin(t * Math.PI * 31));
      const b = 0.3 + 0.35 * Math.abs(Math.sin(t * Math.PI * 43 + 2));
      return {
        ad: atrio(0.05),
        ae: atrio(0.05),
        vd: cam(DESPOL_VENT, a),
        ve: cam(DESPOL_VENT, b),
        corSA: COND_OFF,
        corAV: COND_OFF,
        corHis: COND_OFF,
        iAtrios: 0.05,
        sa: 0.05,
        av: 0.05,
        his: 0.05,
      };
    }
    case "assistolia":
      return {
        ad: atrio(0),
        ae: atrio(0),
        vd: cam(DESPOL_VENT, 0),
        ve: cam(DESPOL_VENT, 0),
        corSA: COND_OFF,
        corAV: COND_OFF,
        corHis: COND_OFF,
        iAtrios: 0,
        sa: 0,
        av: 0,
        his: 0,
      };
    case "juncional": {
      // Nasce na junção: o nó AV acende primeiro e os átrios depois (retrógrado).
      const vent = ventDe(n.iVent, n.iT);
      const iAV = fase(t, 0.28, 0.42);
      return {
        ad: atrio(n.iAtrios),
        ae: atrio(n.iAtrios * 0.8),
        vd: vent,
        ve: vent,
        corSA: COND_OFF,
        corAV: mistura(COND_OFF, COND_ON, Math.max(iAV, n.iVent)),
        corHis: mistura(COND_OFF, COND_ON, n.iVent),
        iAtrios: n.iAtrios,
        sa: 0.05,
        av: Math.max(iAV, n.iVent),
        his: n.iVent,
      };
    }
    case "wpw": {
      // Atalho: o ventrículo começa a acender ANTES de o nó AV terminar.
      const vent = ventDe(n.iVentTardio, n.iT);
      return {
        ad: atrio(n.iAtrios),
        ae: atrio(n.iAtrios),
        vd: vent,
        ve: vent,
        corSA: mistura(COND_ON, "#fff2c2", n.iAtrios),
        corAV: mistura(COND_OFF, COND_ON, n.iAV * 0.5),
        corHis: mistura(COND_OFF, COND_ON, n.iVent * 0.6),
        iAtrios: n.iAtrios,
        sa: n.iAtrios,
        av: n.iAV * 0.5,
        his: n.iVent * 0.6,
      };
    }
    case "isquemia": {
      // Sequência de ativação NORMAL (isquemia é história de repolarização).
      const s = sinusalDe(n);
      s.ve = n.iT > 0.1 ? cam(CINZA_ISQ, Math.max(s.ve.i, n.iT * 0.8)) : s.ve;
      return s;
    }
    default:
      return sinusalDe(n);
  }
}

function sinusalDe(n: Intensidades): FaseCoracao {
  const vent = n.iT > n.iVent ? cam(AZUL, n.iT) : cam(DESPOL_VENT, n.iVent);
  const atrio = (i: number) => cam(DESPOL_ATRIO, i);
  const av = Math.max(n.iAV, n.iVent * 0.4);
  return {
    ad: atrio(n.iAtrios),
    ae: atrio(n.iAtrios),
    vd: vent,
    ve: vent,
    corSA: mistura(COND_ON, "#fff2c2", n.iAtrios),
    corAV: mistura(COND_OFF, COND_ON, av),
    corHis: mistura(COND_OFF, COND_ON, n.iVent),
    iAtrios: n.iAtrios,
    sa: n.iAtrios,
    av,
    his: n.iVent,
  };
}

// =====================================================================
// VETOR ELÉTRICO — a seta que o ECG realmente enxerga.
//
// O aparelho não vê o coração: vê o vetor resultante da frente de
// despolarização, projetado em cada derivação. É por isso que a MESMA ativação
// sobe numa derivação e desce em outra. Este é o elo entre anatomia e traçado;
// sem ele, o aluno só decora.
//
// Convenção do ECG: 0° aponta para a esquerda do paciente (DI) e o ângulo
// positivo desce (aVF = +90°).
// =====================================================================
export type Vetor = {
  ang: number; // graus
  mag: number; // 0..1
  onda: "P" | "QRS" | "T" | null;
};

export const EIXO_NORMAL = 60;

export function eixoDoModo(modo: ModoEcg): number {
  return def(modo).eixo ?? EIXO_NORMAL;
}

export function vetorNoTempo(modo: ModoEcg, t: number): Vetor {
  const d = def(modo);
  const esc = escalaDe(d);
  const eixo = d.eixo ?? EIXO_NORMAL;
  let melhor: Vetor = { ang: eixo, mag: 0, onda: null };
  const guarda = (v: Vetor) => {
    if (v.mag > melhor.mag) melhor = v;
  };

  for (const b of d.bats) {
    // Átrios: vetor pequeno, para baixo e para a esquerda.
    if (b.p !== null && (b.pAmp ?? 0.15) !== 0) {
      const pc = b.c + (b.pOff ?? -0.225) * esc;
      const pw = (b.pW ?? 0.045) * esc;
      const f = fase(t, pc - pw, pc + pw);
      guarda({ ang: 60 + (b.pInvertida ? 180 : 0), mag: f * 0.3, onda: "P" });
    }
    if (b.qrs === null) continue;

    // Ventrículos: a seta VARRE. Começa pelo septo (da esquerda para a
    // direita), passa pelas paredes livres (o vetor grande, que define o eixo)
    // e termina nas porções basais. É essa varredura que desenha Q, R e S.
    const w = 0.04 * (b.qrs?.largura ?? 1) * esc;
    const u = (t - b.c) / w; // -1 .. 1 dentro do complexo
    if (u > -1 && u < 1) {
      const desvio = u < 0 ? 95 * -u : -45 * u;
      guarda({
        ang: eixo + desvio,
        mag: Math.max(0, Math.cos((u * Math.PI) / 2)),
        onda: "QRS",
      });
    }

    // Repolarização: mesmo sentido do QRS quando a onda T é positiva, e oposto
    // quando ela é negativa. É literalmente isso que "T discordante" quer dizer.
    const tw = (b.tW ?? 0.09) * esc;
    const tc = b.c + (b.tOff ?? 0.235) * esc;
    const ta = b.tAmp ?? 0.28;
    if (ta !== 0) {
      const f = fase(t, tc - tw, tc + tw);
      guarda({
        ang: ta < 0 ? eixo + 180 : eixo - 15,
        mag: f * Math.min(0.45, Math.abs(ta) + 0.1),
        onda: "T",
      });
    }
  }
  return melhor;
}

// Derivações do plano frontal e o ângulo de cada uma.
export const DERIVACOES_FRONTAIS: { nome: string; ang: number }[] = [
  { nome: "DI", ang: 0 },
  { nome: "DII", ang: 60 },
  { nome: "DIII", ang: 120 },
  { nome: "aVR", ang: -150 },
  { nome: "aVL", ang: -30 },
  { nome: "aVF", ang: 90 },
];

// Projeção do vetor numa derivação: é o que aquela derivação registra.
// Positivo = onda para cima. Esta linha sozinha explica toda a polaridade do ECG.
export function projecao(v: Vetor, angDerivacao: number): number {
  return v.mag * Math.cos(((v.ang - angDerivacao) * Math.PI) / 180);
}

// Legenda da fase atual: vem DA MESMA lista de faixas mostrada na tela, para
// não haver dois textos concorrentes descrevendo o mesmo instante.
export function legendaDaFase(
  modo: ModoEcg,
  t: number,
): { onda: string; texto: string } {
  const fx = faixasDoModo(modo).find((f) => t >= f.ini && t < f.fim);
  if (fx) return { onda: fx.onda, texto: fx.texto };
  return { onda: "Diástole", texto: "Repouso elétrico entre os batimentos." };
}
