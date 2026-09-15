// Motor de direção de arte.
//
// O problema: paleta trocada não é personalização. Dois sites com o mesmo
// esqueleto e cores diferentes continuam sendo o mesmo site, e o cliente
// percebe no dia em que vê o do concorrente.
//
// A solução: o design não é escolhido de um catálogo — é DERIVADO do
// cliente. O place_id do Google (ou o slug) alimenta um gerador
// pseudoaleatório determinístico, e desse número saem oito eixos
// independentes: composição do primeiro quadro, par tipográfico, paleta,
// ornamento, ritmo de espaçamento, forma, estilo de lista e tratamento de
// imagem. O CSS é gerado, não configurado.
//
//   6 composições × 6 pares de fonte × 6 ornamentos × 3 ritmos
//   × 3 formas × 3 estilos de lista  =  5.832 estruturas distintas
//   × paleta contínua (matiz, esquema e luminosidade derivados do mesmo
//     número, com contraste validado)  =  repetição improvável.
//
// Determinístico de propósito: o mesmo cliente gera sempre o mesmo site.
// O link do preview não muda quando você roda de novo, e o cliente não
// abre amanhã um design diferente do que aprovou ontem.
//
// Restrição que atravessa tudo: nenhuma combinação sai sem passar no
// contraste. Design generativo costuma falhar exatamente aí — gera uma
// cor bonita e ilegível. Aqui a paleta é ajustada em laço até passar.

/* ------------------------------------------------------------------ *
 * Semente determinística (xmur3 + mulberry32)
 * ------------------------------------------------------------------ */

function xmur3(texto) {
  let h = 1779033703 ^ texto.length;
  for (let i = 0; i < texto.length; i++) {
    h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function semear(chave) {
  const semente = xmur3(String(chave || "sem-chave"));
  const rnd = mulberry32(semente());
  return {
    numero: () => rnd(),
    entre: (a, b) => a + rnd() * (b - a),
    inteiro: (a, b) => Math.floor(a + rnd() * (b - a + 1)),
    escolher: (lista) => lista[Math.floor(rnd() * lista.length)],
    // pesos: [[valor, peso], ...] — para o comum aparecer mais que o raro
    pesado: (pares) => {
      const total = pares.reduce((s, [, p]) => s + p, 0);
      let n = rnd() * total;
      for (const [v, p] of pares) { if ((n -= p) <= 0) return v; }
      return pares[pares.length - 1][0];
    },
    baralhar: (lista) => {
      const a = [...lista];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Cor: HSL, contraste e ajuste em laço
 * ------------------------------------------------------------------ */

const pinca = (v, a, b) => Math.max(a, Math.min(b, v));

function hslParaRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60  ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m].map((v) => Math.round(v * 255));
}

const paraHex = (h, s, l) =>
  "#" + hslParaRgb(h, s, l).map((v) => v.toString(16).padStart(2, "0")).join("");

const hexParaRgb = (hex) => {
  const c = String(hex).replace("#", "");
  const f = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
};

const linear = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

function luminancia(hex) {
  const [r, g, b] = hexParaRgb(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contraste(a, b) {
  const l1 = luminancia(a), l2 = luminancia(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Procura a luminosidade (no espaço HSL) que atinge o contraste pedido
// contra `alvo`, andando na direção indicada. Devolve o hex encontrado ou
// o extremo — e é o laço que garante que nenhuma paleta gerada saia
// ilegível, que é o modo clássico de falhar em design generativo.
function ajustarAte(h, s, lInicial, alvo, minimo, direcao) {
  let l = lInicial;
  for (let i = 0; i < 100; i++) {
    const hex = paraHex(h, s, l);
    if (contraste(hex, alvo) >= minimo) return hex;
    l = pinca(l + direcao, 0, 100);
    if (l === 0 || l === 100) break;
  }
  return paraHex(h, s, l);
}

/* ------------------------------------------------------------------ *
 * Paleta gerada
 * ------------------------------------------------------------------ */

// Matiz livre de 0 a 359 gera oliva, roxo e magenta — tecnicamente
// legível e visualmente errado para saúde. O gerador sorteia dentro de
// FAMÍLIAS curadas: é o que mantém o resultado generativo e, ao mesmo
// tempo, sempre plausível num consultório. Cada família traz também o
// teto de saturação, porque o mesmo número em azul e em vinho não produz
// o mesmo grau de sobriedade.
const FAMILIAS = [
  { nome: "petroleo",  peso: 5, matiz: [178, 196], sat: [26, 46] },
  { nome: "azul",      peso: 5, matiz: [202, 224], sat: [24, 44] },
  { nome: "ardosia",   peso: 4, matiz: [214, 240], sat: [12, 26] },
  { nome: "verde",     peso: 4, matiz: [140, 168], sat: [20, 38] },
  { nome: "salvia",    peso: 3, matiz: [100, 132], sat: [12, 26] },
  { nome: "vinho",     peso: 4, matiz: [338, 356], sat: [26, 44] },
  { nome: "terra",     peso: 3, matiz: [16, 32],   sat: [22, 40] },
  { nome: "grafite",   peso: 3, matiz: [200, 215], sat: [6, 14] },
];

// Esquemas de relação entre o matiz principal e o de destaque. Não é
// "pega duas cores": é a regra que faz a dupla parecer intencional.
// O âmbar/terra domina o sorteio porque é o que dá o ar de consultório
// caro — e porque combina com qualquer uma das famílias acima.
const ESQUEMAS = {
  // destaque em âmbar/terra, independente do matiz principal
  terroso: (h) => ({ hDestaque: 30 + ((h % 15) - 7), sDestaque: 44 }),
  // vizinho no círculo, dessaturado: discreto
  analogo: (h) => ({ hDestaque: h + 26, sDestaque: 26 }),
  // quase oposto e bem lavado: contraste de matiz sem virar bandeira
  complementarSuave: (h) => ({ hDestaque: h + 162, sDestaque: 20 }),
  // mesmo matiz, outra saturação: o mais silencioso
  monocromatico: (h) => ({ hDestaque: h + 4, sDestaque: 18 }),
};

export function gerarPaleta(sorte) {
  const familia = sorte.pesado(FAMILIAS.map((f) => [f, f.peso]));
  const matiz = sorte.inteiro(familia.matiz[0], familia.matiz[1]);
  const sPrincipal = sorte.inteiro(familia.sat[0], familia.sat[1]);

  const nomeEsquema = sorte.pesado([
    ["terroso", 6], ["monocromatico", 3], ["analogo", 2], ["complementarSuave", 1],
  ]);
  const { hDestaque, sDestaque } = ESQUEMAS[nomeEsquema](matiz);

  // Fundo: quase branco, com uma gota de matiz. É o que separa um site com
  // direção de arte de um site com fundo #fff.
  const temperatura = sorte.pesado([["quente", 4], ["proprio", 3], ["neutro", 2]]);
  const hFundo = temperatura === "quente" ? 34 : temperatura === "neutro" ? 220 : matiz;
  const sFundo = temperatura === "neutro" ? sorte.inteiro(3, 7) : sorte.inteiro(10, 24);
  const fundo = paraHex(hFundo, sFundo, sorte.inteiro(97, 99));
  const fundoSuave = paraHex(hFundo, pinca(sFundo + 8, 0, 40), sorte.inteiro(92, 96));

  // Principal precisa de 4.5:1 contra branco — texto branco vai por cima.
  const principal = ajustarAte(matiz, sPrincipal, sorte.inteiro(28, 38), "#ffffff", 5, -1);
  const escuro = ajustarAte(matiz, pinca(sPrincipal + 8, 0, 60),
                            sorte.inteiro(14, 22), "#ffffff", 9, -1);

  // Tinta com 8:1 de folga, não os 4.5 mínimos: texto corrido em celular
  // no sol precisa de mais que o mínimo da norma.
  //
  // Validado contra fundoSuave, não contra fundo. As seções alternadas
  // (.alt) usam o fundo suave, que é mais escuro — validar no fundo claro
  // deixava passar texto com 4.3:1 em cima do suave. Foi o auditor de
  // navegador que mostrou isso: no papel a conta fechava.
  const tinta = ajustarAte(matiz, sorte.inteiro(8, 16), 18, fundoSuave, 8, -1);
  const tintaSuave = ajustarAte(matiz, sorte.inteiro(6, 14), 42, fundoSuave, 4.8, -1);
  const borda = paraHex(hFundo, pinca(sFundo + 4, 0, 28), sorte.inteiro(86, 91));

  // Dois tons de destaque: um para o fundo claro (detalhes e texto grande)
  // e um clareado para o fundo escuro do hero.
  const destaque = ajustarAte(hDestaque, sDestaque, 46, fundoSuave, 3.6, -1);
  const destaqueEscuro = ajustarAte(hDestaque, pinca(sDestaque - 6, 0, 50), 74, escuro, 4.5, +1);

  return {
    familia: familia.nome, nomeEsquema, matiz, temperatura,
    principal, principalEscuro: escuro, destaque, destaqueHero: destaqueEscuro,
    fundo, fundoSuave, tinta, tintaSuave, borda,
  };
}

/* ------------------------------------------------------------------ *
 * Tipografia
 *
 * Par de fontes com ajuste próprio. Playfair em 300 e Fraunces em 400 não
 * são a mesma coisa: cada par traz o peso, o entreletra e o fator de
 * escala que fazem aquela combinação parecer desenhada, não sorteada.
 * ------------------------------------------------------------------ */

const TIPOGRAFIAS = [
  { nome: "garamond-jost",   peso: 4, titulo: "Cormorant Garamond", texto: "Jost",
    pesoTitulo: 300, entreletra: "-.015em", escala: 1.12, alturaTitulo: 1.06 },
  { nome: "newsreader-inter", peso: 4, titulo: "Newsreader", texto: "Inter",
    pesoTitulo: 400, entreletra: "-.02em", escala: 1, alturaTitulo: 1.1 },
  { nome: "fraunces-karla",  peso: 3, titulo: "Fraunces", texto: "Karla",
    pesoTitulo: 400, entreletra: "-.025em", escala: .98, alturaTitulo: 1.08 },
  { nome: "spectral-worksans", peso: 3, titulo: "Spectral", texto: "Work Sans",
    pesoTitulo: 300, entreletra: "-.01em", escala: 1.02, alturaTitulo: 1.14 },
  { nome: "playfair-manrope", peso: 3, titulo: "Playfair Display", texto: "Manrope",
    pesoTitulo: 400, entreletra: "-.022em", escala: 1, alturaTitulo: 1.06 },
  { nome: "ebgaramond-outfit", peso: 3, titulo: "EB Garamond", texto: "Outfit",
    pesoTitulo: 400, entreletra: "-.012em", escala: 1.1, alturaTitulo: 1.08 },
  { nome: "lora-barlow",     peso: 2, titulo: "Lora", texto: "Barlow",
    pesoTitulo: 400, entreletra: "-.018em", escala: .96, alturaTitulo: 1.12 },
];

/* ------------------------------------------------------------------ *
 * Eixos estruturais
 * ------------------------------------------------------------------ */

const COMPOSICOES = [
  ["divisao",   5],  // duas colunas, texto à esquerda, visual à direita
  ["deslocado", 4],  // visual recuado, texto invadindo por cima
  ["coluna",    3],  // coluna de texto estreita, visual em faixa alta
  ["centro",    3],  // texto centralizado, visual em banda embaixo
  ["moldura",   3],  // visual emoldurado com folga generosa
  ["faixa",     2],  // visual sangrando, cartão de texto sobreposto
];

const ORNAMENTOS = [
  ["nenhum", 4], ["fios", 4], ["arco", 3], ["trama", 3], ["pontos", 2], ["moldura", 2],
];

const RITMOS = [
  ["normal",  { secao: 1, escalaTipo: 1 },   5],
  ["arejado", { secao: 1.35, escalaTipo: 1.06 }, 4],
  ["compacto",{ secao: .78, escalaTipo: .96 }, 3],
];

const FORMAS = [
  ["pilula", { raio: "999px", raioCartao: "16px", raioImagem: "14px" }, 4],
  ["suave",  { raio: "10px",  raioCartao: "12px", raioImagem: "10px" }, 4],
  ["reto",   { raio: "2px",   raioCartao: "2px",  raioImagem: "2px"  }, 3],
];

const LISTAS = [["numerada", 4], ["fios", 4], ["cartoes", 3]];

const IMAGENS = [
  ["limpa", 4], ["mascara", 4], ["moldura", 3], ["duotone", 2],
];

/* ------------------------------------------------------------------ *
 * Direção de arte
 * ------------------------------------------------------------------ */

export function direcaoDeArte(briefing = {}) {
  // A chave é o que existe de único no cliente. O place_id do Google é o
  // ideal (imutável e global); o slug serve de reserva.
  const chave =
    briefing.arte?.semente ||
    briefing._prospeccao?.placeId ||
    briefing.slug ||
    briefing.nome ||
    "sem-chave";

  const sorte = semear(chave);

  // A ordem dos sorteios é parte do contrato: mexer nela muda o design de
  // todos os clientes já aprovados. Acrescente eixo novo no FIM.
  const cores = gerarPaleta(sorte);
  const tipo = sorte.pesado(TIPOGRAFIAS.map((t) => [t, t.peso]));
  const composicao = sorte.pesado(COMPOSICOES);
  let ornamento = sorte.pesado(ORNAMENTOS);
  // Restrições: nem toda combinação de eixos independentes funciona. Design
  // generativo sem restrição gera o improvável, não o bonito.
  //   • moldura + moldura empilha dois fios de contorno no mesmo quadro
  //   • faixa sangra de ponta a ponta: ornamento de fundo fica escondido
  //     atrás da imagem e só aparece como ruído nas beiradas
  if (composicao === "moldura" && ornamento === "moldura") ornamento = "fios";
  if (composicao === "faixa" && ornamento !== "nenhum") ornamento = "nenhum";
  const [nomeRitmo, ritmo] = sorte.pesado(RITMOS.map(([n, v, p]) => [[n, v], p]));
  const [nomeForma, forma] = sorte.pesado(FORMAS.map(([n, v, p]) => [[n, v], p]));
  const lista = sorte.pesado(LISTAS);
  const imagem = sorte.pesado(IMAGENS);
  const heroEscuro = sorte.pesado([[false, 6], [true, 4]]);
  const caixaOlho = sorte.pesado([["alta", 5], ["normal", 2]]);

  // Assinatura: identifica a combinação no comentário do HTML. Serve para
  // você olhar dois sites e provar que são desenhos diferentes.
  const assinatura = [
    cores.familia, cores.nomeEsquema, tipo.nome, composicao,
    ornamento, nomeRitmo, nomeForma, lista, imagem, heroEscuro ? "escuro" : "claro",
  ].join("/");

  return {
    chave, assinatura, cores, tipo, composicao, ornamento,
    ritmo: { nome: nomeRitmo, ...ritmo },
    forma: { nome: nomeForma, ...forma },
    lista, imagem, heroEscuro, caixaOlho,
  };
}

/* ------------------------------------------------------------------ *
 * URL das fontes
 * ------------------------------------------------------------------ */

export function urlFontes(tipo) {
  const fam = (nome, pesos) =>
    `family=${String(nome).trim().replace(/\s+/g, "+")}:wght@${pesos}`;
  const partes = [fam(tipo.titulo, "300;400;500;600")];
  if (tipo.texto !== tipo.titulo) partes.push(fam(tipo.texto, "300;400;500;600;700"));
  return `https://fonts.googleapis.com/css2?${partes.join("&")}&display=swap`;
}

/* ================================================================== *
 * Gerador de CSS
 *
 * Cada eixo emite apenas o seu bloco. O arquivo final sai com o CSS de
 * UMA composição, UM ornamento, UM estilo de lista — não com os 6 de cada
 * e classes desligadas. É o que mantém o site em ~30 KB sem build.
 * ================================================================== */

function base(d) {
  const c = d.cores, t = d.tipo, r = d.ritmo, f = d.forma;
  const e = (n) => (n * t.escala * r.escalaTipo).toFixed(3);
  return `
:root{
  --princ:${c.principal}; --escuro:${c.principalEscuro};
  --dest:${c.destaque}; --dest-hero:${c.destaqueHero};
  --fundo:${c.fundo}; --fundo2:${c.fundoSuave};
  --tinta:${c.tinta}; --tinta2:${c.tintaSuave}; --borda:${c.borda};
  --zap:#25d366;
  --serif:'${t.titulo}',Georgia,'Times New Roman',serif;
  --sans:'${t.texto}',system-ui,-apple-system,'Segoe UI',sans-serif;
  --raio:${f.raio}; --raio-cartao:${f.raioCartao}; --raio-img:${f.raioImagem};
  --secao:clamp(${(3.2 * r.secao).toFixed(2)}rem,${(7 * r.secao).toFixed(1)}vw,${(6.4 * r.secao).toFixed(2)}rem);
  --gutter:clamp(20px,5vw,${r.nome === "arejado" ? 64 : 48}px);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--sans);background:var(--fundo);color:var(--tinta);
  font-size:${e(16.6)}px;line-height:1.7;font-weight:${t.texto === "Jost" || t.texto === "Outfit" ? 300 : 400};
  overflow-x:hidden;-webkit-font-smoothing:antialiased;
  font-feature-settings:"kern" 1,"liga" 1}
img{max-width:100%;display:block;height:auto}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--princ);outline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:${t.pesoTitulo};
  letter-spacing:${t.entreletra};line-height:${t.alturaTitulo};color:var(--escuro);
  text-wrap:balance}
p{text-wrap:pretty}
.env{max-width:1180px;margin:0 auto;padding:0 var(--gutter)}
section{padding:var(--secao) 0}

/* sobrancelha de seção */
.olho{display:flex;align-items:center;gap:.85rem;font-size:${e(11.6)}px;
  letter-spacing:.22em;font-weight:500;color:var(--tinta2);margin-bottom:1.4rem;
  text-transform:${d.caixaOlho === "alta" ? "uppercase" : "none"}}
.olho::before{content:'';width:32px;height:1px;background:var(--dest);flex:0 0 32px}
.tit{font-size:clamp(${e(27)}px,3.7vw,${e(43)}px);max-width:23ch;margin-bottom:1rem}
.lead{color:var(--tinta2);max-width:60ch;font-size:${e(16.8)}px}
.serif-lead{font-family:var(--serif);font-size:clamp(${e(20)}px,2.2vw,${e(26)}px);
  line-height:1.48;color:var(--escuro);font-weight:${t.pesoTitulo};max-width:34ch}

/* botões */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.65rem;
  padding:.92rem 1.65rem;border-radius:var(--raio);font-family:var(--sans);
  font-size:${e(14.8)}px;font-weight:500;letter-spacing:.01em;border:1px solid transparent;
  cursor:pointer;white-space:nowrap;transition:background .25s,color .25s,border-color .25s,transform .25s}
.btn:hover{transform:translateY(-2px)}
.btn svg{width:16px;height:16px;flex:0 0 16px}
.btn-1{background:var(--princ);color:#fff}
.btn-1:hover{background:var(--escuro)}
.btn-2{border-color:var(--borda);color:var(--escuro)}
.btn-2:hover{border-color:var(--princ);color:var(--princ)}
.btn-zap{background:var(--zap);color:#062e1b}
.acoes{display:flex;gap:.75rem;flex-wrap:wrap}

/* topo */
.topo{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--fundo) 92%,transparent);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid transparent;transition:border-color .3s}
.topo.rolou{border-bottom-color:var(--borda)}
.topo-in{display:flex;align-items:center;justify-content:space-between;gap:1.4rem;
  max-width:1180px;margin:0 auto;padding:.9rem var(--gutter)}
.assin{display:flex;align-items:center;gap:.75rem}
.mono{width:42px;height:42px;flex:0 0 42px;border-radius:${f.nome === "reto" ? "2px" : "50%"};
  border:1px solid var(--borda);display:grid;place-items:center;font-family:var(--serif);
  font-size:${e(12)}px;letter-spacing:.06em;color:var(--princ)}
.assin .n{display:block;font-family:var(--serif);font-size:${e(17)}px;line-height:1.14;
  color:var(--escuro);white-space:nowrap}
.assin .p{display:block;font-size:${e(9.8)}px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--tinta2);margin-top:.2rem}
.menu{display:flex;align-items:center;gap:clamp(.9rem,1.7vw,1.6rem);list-style:none}
.menu a{font-size:${e(14)}px;color:var(--tinta2);white-space:nowrap;position:relative;padding-bottom:2px}
.menu a::after{content:'';position:absolute;left:0;bottom:0;width:0;height:1px;
  background:var(--dest);transition:width .25s}
.menu a:hover{color:var(--escuro)}
.menu a:hover::after{width:100%}
.topo .btn{padding:.58rem 1.15rem;font-size:${e(13.6)}px}
.abre{display:none;background:none;border:0;width:42px;height:42px;cursor:pointer}
.abre span{display:block;height:1px;background:var(--escuro);margin:7px 8px}

/* hero: partes comuns a todas as composições */
.hero{position:relative;overflow:hidden;
  ${d.heroEscuro ? "background:var(--escuro);color:#fff" : "background:var(--fundo)"}}
.hero em{font-style:normal;color:var(--dest)}
.hero h1{font-size:clamp(${e(34)}px,5.2vw,${e(64)}px);margin-bottom:.45rem}
.hero .papel{font-family:var(--serif);font-style:italic;font-weight:${t.pesoTitulo};
  font-size:clamp(${e(18)}px,2.3vw,${e(27)}px);color:var(--tinta2);margin-bottom:1.5rem}
.hero .promessa{font-size:${e(16.8)}px;color:var(--tinta2);max-width:42ch;margin-bottom:2.1rem}
.hero .promessa b{font-weight:600;color:var(--tinta)}
.hero .reg{margin-top:2rem;font-size:${e(12.8)}px;letter-spacing:.05em;color:var(--tinta2)}

/* Hero escuro: DEPOIS das regras acima, de propósito. Mesma
   especificidade — se viesse antes, perderia, e o trecho em negrito da
   promessa sairia em tinta escura sobre fundo escuro (invisível). */
${d.heroEscuro ? `
.hero h1,.hero h2{color:#fff}
.hero .olho{color:rgba(255,255,255,.74)}
.hero .olho::before{background:var(--dest-hero)}
.hero .papel{color:rgba(255,255,255,.78)}
.hero .promessa{color:rgba(255,255,255,.86)}
.hero .promessa b{color:#fff}
.hero .reg{color:rgba(255,255,255,.62)}
.hero em{color:var(--dest-hero)}
.hero .btn-2{border-color:rgba(255,255,255,.42);color:#fff}
.hero .btn-2:hover{background:rgba(255,255,255,.12);border-color:#fff;color:#fff}
` : ""}
.hero-vis{position:relative}
.hero-vis figure,.hero-vis .painel{position:relative;width:100%;height:100%;overflow:hidden}

/* Painel tipográfico: o quadro quando não há retrato autorizado.
   Não é um monograma solto no vazio — é uma placa composta (monograma,
   fio e legenda em caixa alta) que preenche o espaço de propósito. Ver
   FOTOS.md: não se publica rosto de banco no lugar de quem assina. */
.painel{background:${d.heroEscuro ? "rgba(255,255,255,.075)" : "var(--fundo2)"};
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:clamp(.9rem,1.6vw,1.4rem);border-radius:var(--raio-img);padding:2rem}
.painel .mg{font-family:var(--serif);font-size:clamp(3.4rem,8vw,6.4rem);font-weight:300;
  color:${d.heroEscuro ? "rgba(255,255,255,.34)" : "color-mix(in srgb,var(--princ) 26%,transparent)"};
  letter-spacing:.06em;line-height:1}
.painel .fio{width:clamp(44px,7vw,88px);height:1px;
  background:${d.heroEscuro ? "rgba(255,255,255,.26)" : "color-mix(in srgb,var(--princ) 20%,transparent)"}}
.painel .cap{font-size:clamp(9.6px,1vw,11.4px);letter-spacing:.2em;text-transform:uppercase;
  text-align:center;max-width:46ch;line-height:1.8;
  color:${d.heroEscuro ? "rgba(255,255,255,.5)" : "var(--tinta2)"}}

/* selo de credencial */
.selo{position:absolute;right:clamp(14px,2.6vw,32px);bottom:clamp(16px,3vw,36px);
  background:var(--fundo);border:1px solid var(--borda);border-radius:var(--raio-cartao);
  padding:.8rem 1.15rem;display:flex;align-items:center;gap:.75rem;max-width:262px;
  box-shadow:0 20px 46px -26px rgba(0,0,0,.34);z-index:3}
.selo .num{font-family:var(--serif);font-size:${e(29)}px;line-height:1;color:var(--princ);white-space:nowrap}
.selo .txt{font-size:${e(11.8)}px;line-height:1.35;color:var(--tinta2)}

/* blocos de conteúdo */
.duas{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,5rem);align-items:start}
.alt{background:var(--fundo2)}
.cred{list-style:none;border-top:1px solid var(--borda)}
.cred li{padding:.95rem 0;border-bottom:1px solid var(--borda);font-size:${e(15)}px;
  color:var(--tinta2);display:flex;gap:1rem}
.cred li .o{font-family:var(--serif);color:var(--dest);font-size:${e(13.6)}px;flex:0 0 1.5rem}
.caixa-reg{margin-top:1.7rem;padding:1.05rem 1.25rem;background:var(--fundo2);
  border-radius:var(--raio-cartao);font-size:${e(14)}px;line-height:1.55}
.caixa-reg b{display:block;font-weight:600;color:var(--escuro);margin-bottom:.15rem}
.pend{display:inline-block;background:#fff4d6;color:#7a5600;border:1px dashed #c99a2e;
  border-radius:6px;padding:.05rem .45rem;font-size:${e(12.8)}px;font-weight:500}

/* procedimentos, duas colunas com fio */
.proc{columns:2;column-gap:clamp(2rem,6vw,4.5rem);margin-top:2rem}
.proc li{list-style:none;break-inside:avoid;padding:.8rem 0;border-bottom:1px solid var(--borda);
  font-size:${e(15.4)}px;display:flex;justify-content:space-between;gap:1rem;align-items:baseline}
.proc li em{font-style:normal;font-size:${e(12.4)}px;color:var(--tinta2);text-align:right}

/* estrutura e galeria */
.estr{list-style:none;display:grid;gap:.85rem;margin-top:1.7rem}
.estr li{display:flex;gap:.75rem;font-size:${e(15.4)}px;color:var(--tinta2)}
.estr svg{width:17px;height:17px;flex:0 0 17px;margin-top:.42rem;color:var(--dest);
  stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.gal{display:grid;grid-template-columns:1.55fr 1fr;gap:.9rem;margin-top:2.2rem}
.gal figure{position:relative;overflow:hidden;border-radius:var(--raio-img);background:var(--fundo2)}
.gal figure:first-child{grid-row:span 2}
.gal img{width:100%;height:100%;object-fit:cover;aspect-ratio:4/3}
.gal figure:first-child img{aspect-ratio:1/1}
.gal figcaption{position:absolute;inset:auto 0 0;font-size:${e(10.6)}px;letter-spacing:.1em;
  text-transform:uppercase;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.6));
  padding:1.5rem .85rem .55rem}

/* atendimento */
.dados{list-style:none;border-top:1px solid var(--borda)}
.dados li{padding:1rem 0;border-bottom:1px solid var(--borda);display:grid;
  grid-template-columns:8.5rem 1fr;gap:1rem;font-size:${e(15)}px;align-items:baseline}
.dados .rot{font-size:${e(10.6)}px;letter-spacing:.16em;text-transform:uppercase;color:var(--tinta2)}
.conv{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.3rem}
.conv span{border:1px solid var(--borda);border-radius:${f.nome === "reto" ? "2px" : "8px"};
  padding:.42rem .8rem;font-size:${e(13.4)}px;color:var(--tinta2);background:var(--fundo)}
.fina{font-size:${e(12.8)}px;color:var(--tinta2);margin-top:1.1rem;line-height:1.55}
.mapa{border:1px solid var(--borda);border-radius:var(--raio-img);overflow:hidden;
  min-height:330px;background:var(--fundo)}
.mapa iframe{width:100%;height:100%;min-height:330px;border:0;display:block}

/* faq */
.faq{margin-top:2rem;border-top:1px solid var(--borda)}
details{border-bottom:1px solid var(--borda)}
summary{padding:1.15rem 0;cursor:pointer;list-style:none;display:flex;justify-content:space-between;
  gap:1.4rem;align-items:baseline;font-size:${e(16.4)}px;font-family:var(--serif);color:var(--escuro)}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';color:var(--dest);font-family:var(--sans);font-weight:300;
  font-size:${e(20)}px;line-height:1}
details[open] summary::after{content:'—';font-size:${e(14)}px}
details p{padding:0 0 1.3rem;color:var(--tinta2);font-size:${e(15.2)}px;max-width:66ch}

/* chamada final */
.cta{background:var(--escuro);color:#fff;text-align:center}
.cta h2{color:#fff;font-size:clamp(${e(26)}px,3.6vw,${e(40)}px);max-width:24ch;margin:0 auto 1rem}
.cta .lead{color:rgba(255,255,255,.78);margin:0 auto 2rem}
.cta .acoes{justify-content:center}
.cta .btn-2{border-color:rgba(255,255,255,.4);color:#fff}

/* rodapé */
footer{background:var(--fundo);padding:var(--secao) 0 6.5rem;border-top:1px solid var(--borda)}
.rod{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:2.4rem;font-size:${e(14.6)}px;color:var(--tinta2)}
footer h4{font-family:var(--sans);font-size:${e(10.6)}px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--escuro);font-weight:600;margin-bottom:.9rem}
footer a:hover{color:var(--princ)}
.resp{color:var(--escuro);font-weight:500}
.aviso{font-size:${e(12.6)}px;color:var(--tinta2);line-height:1.6;margin-top:2.4rem;
  padding-top:1.4rem;border-top:1px solid var(--borda);max-width:78ch}
.fim{margin-top:1.1rem;font-size:${e(12)}px;color:var(--tinta2);display:flex;
  justify-content:space-between;gap:1rem;flex-wrap:wrap}

/* tarja de rascunho */
.tarja{background:#3b2c05;color:#ffd98a;font-size:${e(13.2)}px;padding:.6rem 20px;
  text-align:center;line-height:1.45}
.tarja b{color:#ffe9b8}

/* barra fixa do celular */
.barra{position:fixed;inset:auto 0 0;z-index:60;display:none;gap:.55rem;
  padding:.6rem .8rem calc(.6rem + env(safe-area-inset-bottom,0px));
  background:color-mix(in srgb,var(--fundo) 96%,transparent);backdrop-filter:blur(12px);
  border-top:1px solid var(--borda)}
.barra .btn{flex:1;padding:.85rem .6rem}

@media (max-width:1080px){
  .menu{position:fixed;inset:78px 0 auto;flex-direction:column;gap:0;background:var(--fundo);
    padding:.5rem var(--gutter) 1.3rem;border-bottom:1px solid var(--borda);display:none}
  .menu.aberto{display:flex}
  .menu li{width:100%}
  .menu a{display:block;padding:.88rem 0;border-bottom:1px solid var(--borda);font-size:1rem}
  .abre{display:block}
  .topo .btn{display:none}
  .barra{display:flex}
  .duas{grid-template-columns:1fr}
  .proc{columns:1}
  .gal{grid-template-columns:1fr}
  .gal figure:first-child{grid-row:auto}
  .gal figure:first-child img{aspect-ratio:4/3}
  .dados li{grid-template-columns:1fr;gap:.15rem}
  .rod{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}
  html{scroll-behavior:auto}}
@media print{.topo,.barra,.cta,.mapa,.tarja{display:none}}
`;
}

/* ------------------------------------------------------------------ *
 * Composições do primeiro quadro
 *
 * Seis arranjos de verdade, não seis variações de gap. Cada um funciona
 * com retrato e sem retrato, porque o rascunho de prospecção sempre nasce
 * sem foto.
 * ------------------------------------------------------------------ */

const COMP_CSS = {
  // duas colunas, texto à esquerda, visual sangrando à direita
  divisao: () => `
.hero-in{max-width:1180px;margin:0 auto;padding-left:var(--gutter);
  display:grid;grid-template-columns:1.02fr .94fr;gap:clamp(2rem,5vw,4.2rem);
  align-items:center;min-height:clamp(520px,80vh,780px)}
.hero-txt{padding:clamp(2.4rem,6vw,4.2rem) 0}
.hero-vis{align-self:stretch;min-height:clamp(380px,62vh,780px)}
@media (max-width:1080px){
  .hero-in{grid-template-columns:1fr;padding-right:var(--gutter);min-height:0}
  .hero-vis{order:-1;min-height:clamp(300px,48vh,460px);margin:0 calc(var(--gutter) * -1)}
}`,

  // visual recuado; o texto invade por cima, num cartão
  deslocado: (d) => `
.hero-in{position:relative;max-width:1180px;margin:0 auto;padding:clamp(3rem,7vw,5.5rem) var(--gutter);
  min-height:clamp(560px,82vh,820px);display:flex;align-items:center}
.hero-vis{position:absolute;right:0;top:clamp(2rem,5vw,4rem);bottom:clamp(2rem,5vw,4rem);
  width:54%;z-index:1}
.hero-txt{position:relative;z-index:2;width:min(56ch,62%);
  background:${d.heroEscuro ? "var(--escuro)" : "var(--fundo)"};
  padding:clamp(1.8rem,3.5vw,3rem);border-radius:var(--raio-cartao);
  box-shadow:0 30px 70px -44px rgba(0,0,0,${d.heroEscuro ? ".8" : ".34"})}
.hero-txt .promessa{max-width:38ch}
@media (max-width:1080px){
  .hero-in{display:block;padding-top:0;min-height:0}
  .hero-vis{position:relative;inset:auto;width:auto;margin:0 calc(var(--gutter) * -1) 2rem;
    min-height:clamp(300px,46vh,440px)}
  .hero-txt{width:auto;background:none;backdrop-filter:none;padding:0 0 clamp(2rem,6vw,3rem)}
}`,

  // coluna de texto estreita e generosa, visual em faixa alta e estreita
  coluna: () => `
.hero-in{max-width:1180px;margin:0 auto;padding:0 var(--gutter);
  display:grid;grid-template-columns:minmax(0,1fr) clamp(240px,32vw,420px);
  gap:clamp(2rem,6vw,5rem);align-items:center;min-height:clamp(560px,84vh,840px)}
.hero-txt{padding:clamp(3rem,7vw,5rem) 0;max-width:46ch}
.hero-txt h1{max-width:14ch}
.hero-vis{align-self:stretch;min-height:clamp(420px,66vh,760px)}
.hero-vis figure,.hero-vis .painel{border-radius:var(--raio-img)}
@media (max-width:1080px){
  .hero-in{grid-template-columns:1fr;min-height:0}
  .hero-vis{order:-1;min-height:clamp(300px,44vh,420px)}
  .hero-txt{max-width:none;padding-top:2.2rem}
}`,

  // texto centralizado, visual em banda larga embaixo
  centro: () => `
.hero-in{max-width:1180px;margin:0 auto;padding:clamp(3.4rem,8vw,6rem) var(--gutter) 0;
  display:flex;flex-direction:column;align-items:center;text-align:center}
.hero-txt{max-width:44ch;display:flex;flex-direction:column;align-items:center}
.hero-txt .olho{justify-content:center}
.hero-txt h1{max-width:20ch}
.hero-txt .promessa{max-width:48ch}
.hero-txt .acoes{justify-content:center}
.hero-vis{width:100%;margin-top:clamp(2.6rem,6vw,4.2rem);
  height:clamp(300px,42vw,520px)}
.hero-vis figure,.hero-vis .painel{border-radius:var(--raio-img) var(--raio-img) 0 0}
@media (max-width:1080px){
  .hero-vis{height:clamp(260px,52vw,380px)}
}`,

  // visual emoldurado, com folga generosa e fio deslocado
  moldura: () => `
.hero-in{max-width:1180px;margin:0 auto;padding:clamp(3rem,7vw,5rem) var(--gutter) 0}
.hero-txt{max-width:52ch;padding-bottom:clamp(2.4rem,5vw,3.6rem)}
.hero-vis{position:relative;height:clamp(320px,44vw,560px);margin-bottom:clamp(1.6rem,3vw,2.4rem)}
.hero-vis::before{content:'';position:absolute;inset:clamp(10px,1.6vw,20px) calc(clamp(10px,1.6vw,20px) * -1)
  calc(clamp(10px,1.6vw,20px) * -1) clamp(10px,1.6vw,20px);
  border:1px solid var(--dest);border-radius:var(--raio-img);z-index:0;opacity:.55}
.hero-vis figure,.hero-vis .painel{position:relative;z-index:1;border-radius:var(--raio-img)}
@media (max-width:1080px){.hero-vis{height:clamp(240px,50vw,380px)}}`,

  // visual sangrando de ponta a ponta, cartão de texto sobreposto
  faixa: () => `
/* O esqueleto traz .hero-txt antes de .hero-vis. Aqui a ordem visual é a
   inversa, então o arranjo é flex com a propriedade order: margem negativa sobre um
   irmão que vem depois no DOM subiria por cima do cabeçalho. */
.hero-in{position:relative;display:flex;flex-direction:column;
  padding-bottom:clamp(2rem,4vw,3rem)}
.hero-vis{order:1;width:100%;height:clamp(380px,56vw,660px)}
.hero-txt{order:2;position:relative;z-index:2;max-width:min(62ch,86%);
  margin:clamp(-7rem,-9vw,-4rem) auto 0;
  background:var(--fundo);padding:clamp(1.9rem,4vw,3.2rem);
  border-radius:var(--raio-cartao);box-shadow:0 30px 70px -40px rgba(0,0,0,.4)}
.hero-txt h1,.hero-txt .olho,.hero-txt .papel,.hero-txt .promessa,.hero-txt .reg{color:var(--escuro)}
.hero-txt .olho,.hero-txt .papel,.hero-txt .promessa,.hero-txt .reg{color:var(--tinta2)}
.hero-txt em{color:var(--dest)}
.hero-txt .btn-2{border-color:var(--borda);color:var(--escuro)}
.hero-txt .promessa b{color:var(--tinta)}
@media (max-width:1080px){
  .hero-vis{height:clamp(260px,58vw,420px)}
  .hero-txt{max-width:none;margin:calc(var(--gutter) * -1.6) var(--gutter) 0}
}`,
};

/* ------------------------------------------------------------------ *
 * Ornamentos — a camada que faz o fundo não ser um retângulo branco
 * ------------------------------------------------------------------ */

const ORN_CSS = {
  nenhum: () => "",
  // fios horizontais finíssimos atravessando o primeiro quadro
  fios: () => `
.orn{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:repeating-linear-gradient(to bottom,transparent 0 63px,
    color-mix(in srgb,currentColor 7%,transparent) 63px 64px);
  mask-image:linear-gradient(to bottom,transparent,#000 35%,#000 65%,transparent)}
.hero-txt,.hero-vis{position:relative;z-index:1}`,
  // arco grande estourando o canto: o gesto mais "editorial" do conjunto
  arco: () => `
.orn{position:absolute;pointer-events:none;z-index:0;
  width:min(72vw,880px);aspect-ratio:1;right:-16%;top:-32%;border-radius:50%;
  border:1px solid color-mix(in srgb,currentColor 12%,transparent)}
.orn::after{content:'';position:absolute;inset:14%;border-radius:50%;
  border:1px solid color-mix(in srgb,currentColor 7%,transparent)}
.hero-txt,.hero-vis{position:relative;z-index:1}`,
  // trama diagonal discreta
  trama: () => `
.orn{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:repeating-linear-gradient(135deg,transparent 0 17px,
    color-mix(in srgb,currentColor 5%,transparent) 17px 18px);
  mask-image:radial-gradient(120% 90% at 78% 20%,#000 0%,transparent 72%)}
.hero-txt,.hero-vis{position:relative;z-index:1}`,
  // grade de pontos
  pontos: () => `
.orn{position:absolute;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(color-mix(in srgb,currentColor 16%,transparent) 1px,transparent 1px);
  background-size:26px 26px;
  mask-image:radial-gradient(90% 80% at 12% 82%,#000 0%,transparent 70%)}
.hero-txt,.hero-vis{position:relative;z-index:1}`,
  // fio de moldura recuado, correndo por dentro da borda do quadro
  moldura: () => `
.orn{position:absolute;inset:clamp(12px,2vw,26px);pointer-events:none;z-index:0;
  border:1px solid color-mix(in srgb,currentColor 13%,transparent);
  border-radius:var(--raio-img)}
.hero-txt,.hero-vis{position:relative;z-index:1}`,
};

/* ------------------------------------------------------------------ *
 * Estilo da lista de atuação
 * ------------------------------------------------------------------ */

const LISTA_CSS = {
  // numeração serifada em coluna própria, no registro de revista
  numerada: (e) => `
.atu{list-style:none;margin-top:2.3rem;border-top:1px solid var(--borda)}
.atu li{display:grid;grid-template-columns:4.2rem 1fr 1.15fr;gap:clamp(1rem,3vw,2.4rem);
  padding:1.6rem 0;border-bottom:1px solid var(--borda);align-items:baseline}
.atu .o{font-family:var(--serif);font-size:${e(16)}px;color:var(--dest);letter-spacing:.06em}
.atu h3{font-size:${e(19)}px}
.atu p{font-size:${e(14.8)}px;color:var(--tinta2)}
@media (max-width:1080px){
  .atu li{grid-template-columns:2.6rem 1fr;row-gap:.35rem}
  .atu p{grid-column:2}
}`,
  // só fios: título à esquerda, descrição à direita, nada mais
  fios: (e) => `
.atu{list-style:none;margin-top:2.3rem;border-top:1px solid var(--borda)}
.atu li{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(1.2rem,4vw,3rem);
  padding:1.5rem 0;border-bottom:1px solid var(--borda);align-items:baseline;
  transition:padding-left .25s}
.atu li:hover{padding-left:.5rem}
.atu .o{display:none}
.atu h3{font-size:${e(20)}px}
.atu p{font-size:${e(14.8)}px;color:var(--tinta2)}
@media (max-width:1080px){.atu li{grid-template-columns:1fr;row-gap:.3rem}}`,
  // cartões com contorno, para clínica com muitos serviços
  cartoes: (e) => `
.atu{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(262px,1fr));
  gap:1rem;margin-top:2.3rem}
.atu li{border:1px solid var(--borda);border-radius:var(--raio-cartao);padding:1.45rem;
  background:var(--fundo);transition:border-color .25s,transform .25s}
.atu li:hover{border-color:var(--princ);transform:translateY(-3px)}
.atu .o{display:block;font-family:var(--serif);font-size:${e(13)}px;color:var(--dest);
  letter-spacing:.1em;margin-bottom:.6rem}
.atu h3{font-size:${e(18)}px;margin-bottom:.4rem}
.atu p{font-size:${e(14.4)}px;color:var(--tinta2)}`,
};

/* ------------------------------------------------------------------ *
 * Tratamento da imagem
 * ------------------------------------------------------------------ */

const IMG_CSS = {
  limpa: () => `
.hero-vis img{width:100%;height:100%;object-fit:cover;object-position:top center}`,
  // esfuma a imagem no fundo: some a emenda entre foto e página
  mascara: (d) => `
.hero-vis img{width:100%;height:100%;object-fit:cover;object-position:top center}
.hero-vis figure::after{content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(90deg,${d.heroEscuro ? "var(--escuro)" : "var(--fundo)"} 0%,transparent 26%)}
@media (max-width:1080px){
  .hero-vis figure::after{background:linear-gradient(0deg,${d.heroEscuro ? "var(--escuro)" : "var(--fundo)"} 0%,transparent 30%)}
}`,
  // moldura interna com fio: a foto ganha peso de retrato
  moldura: () => `
.hero-vis img{width:100%;height:100%;object-fit:cover;object-position:top center;
  border-radius:var(--raio-img)}
.hero-vis figure{padding:clamp(8px,1.2vw,14px);border:1px solid var(--borda);
  border-radius:var(--raio-img);background:var(--fundo)}`,
  // duotone leve na cor da marca, sem descolorir a pele
  duotone: () => `
.hero-vis img{width:100%;height:100%;object-fit:cover;object-position:top center;
  filter:saturate(.78) contrast(1.04)}
.hero-vis figure::after{content:'';position:absolute;inset:0;pointer-events:none;
  background:var(--princ);mix-blend-mode:soft-light;opacity:.5}`,
};

/* ------------------------------------------------------------------ */

export function gerarCss(d, opcoes = {}) {
  const e = (n) => (n * d.tipo.escala * d.ritmo.escalaTipo).toFixed(3);

  // Composições desenhadas para fotografia sangrando (faixa, centro) ficam
  // com uma faixa enorme e quase vazia quando não há retrato. A correção é
  // de ALTURA, não de composição: trocar a composição faria o cliente abrir
  // amanhã um desenho diferente do que aprovou hoje, só porque mandou a foto.
  const semFoto = !opcoes.temRetrato && ["faixa", "centro"].includes(d.composicao);
  const ajusteSemFoto = semFoto
    ? `
/* sem retrato: a faixa encurta para não virar um vão vazio */
.hero-vis{height:clamp(200px,24vw,300px)}
${d.composicao === "faixa" ? ".hero-txt{margin-top:clamp(-3.4rem,-4vw,-2rem)}" : ""}
.painel .mg{font-size:clamp(2.4rem,5vw,3.8rem)}
@media (max-width:1080px){.hero-vis{height:clamp(170px,30vw,240px)}}`
    : "";

  return [
    `/* Direção de arte gerada — assinatura: ${d.assinatura}
   semente: ${d.chave}
   Este CSS é derivado do cliente. Outro cliente gera outro desenho;
   o MESMO cliente gera sempre este. Ver clinicas/arte.mjs. */`,
    base(d),
    `/* composição: ${d.composicao} */`,
    COMP_CSS[d.composicao](d),
    `/* ornamento: ${d.ornamento} */`,
    ORN_CSS[d.ornamento](d),
    `/* lista de atuação: ${d.lista} */`,
    LISTA_CSS[d.lista](e),
    `/* imagem: ${d.imagem} */`,
    IMG_CSS[d.imagem](d),
    ajusteSemFoto,
  ].join("\n");
}

export const EIXOS = {
  composicoes: COMPOSICOES.map(([n]) => n),
  ornamentos: ORNAMENTOS.map(([n]) => n),
  listas: LISTAS.map(([n]) => n),
  imagens: IMAGENS.map(([n]) => n),
  tipografias: TIPOGRAFIAS.map((t) => t.nome),
  familias: FAMILIAS.map((f) => f.nome),
};
