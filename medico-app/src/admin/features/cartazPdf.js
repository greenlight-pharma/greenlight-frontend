// Geração do cartaz de autorização como PDF, desenhado ponto a ponto.
//
// [POR-QUE-PDF] A primeira versão era `window.print()` com `@media print` e
// `@page { size: A4 landscape }`. Não funciona na prática:
//   - o Safari IGNORA `size` no @page e imprime sempre em retrato;
//   - o Chrome honra, mas a orientação escolhida no diálogo sobrepõe o CSS —
//     e ela fica salva da última impressão, então "sai retrato" sem que
//     ninguém tenha mexido em nada;
//   - margem, escala e cabeçalho/rodapé do navegador variam por máquina.
// Em retrato o layout paisagem estourava a largura e era cortado: sumia
// justamente a coluna das orientações. Desenhando o PDF aqui, o resultado é
// o mesmo em qualquer navegador e é o arquivo que a gráfica quer receber
// para imprimir e plastificar as 47 cópias.
//
// O módulo não importa jsPDF nem toca no DOM: as dependências entram por
// parâmetro. É o que torna o layout testável sem navegador.

export const TEXTO_CARTAZ = {
  titulo: "Lembretes de medicação no WhatsApp",
  subtitulo: "Um serviço gratuito para você não esquecer seus remédios",
  passos: [
    "Aponte a câmera do celular para o código",
    "O WhatsApp abre com uma mensagem pronta",
    "Toque em enviar para autorizar",
  ],
  // [CONSENTIMENTO] Este texto é o que sustenta a autorização informada:
  // o que a pessoa vai receber, quando, como sair e o que é feito com o
  // dado (LGPD art. 8º §5º — sair tem que ser tão fácil quanto entrar).
  // Não é decoração de cartaz. Não encurte para "caber".
  blocos: [
    {
      titulo: "O que você vai receber",
      texto:
        "Uma mensagem no horário de cada medicação que seu médico cadastrar, " +
        "com o nome do remédio e a orientação dele. Você responde se tomou ou " +
        "não — e isso ajuda seu médico a acompanhar seu tratamento.",
    },
    {
      titulo: "Quando",
      texto: "Somente nos horários da sua receita. Nada de propaganda.",
    },
    {
      titulo: "Para parar",
      // [SAIDA-VISIVEL] Sai da coluna e vira faixa destacada no pé do cartaz.
      // A LGPD (art. 8º §5º) exige que revogar seja tão fácil quanto
      // autorizar: se a palavra PARAR estiver do mesmo tamanho do resto,
      // "fácil" é só o que a gente diz, não o que o cartaz mostra.
      destaque: true,
      palavra: "PARAR",
      texto:
        "Envie essa palavra a qualquer momento. Você deixa de receber na " +
        "hora, sem precisar vir até a unidade.",
    },
    {
      titulo: "Seus dados",
      texto:
        "Suas respostas ficam no seu prontuário e são usadas pelo seu médico " +
        "no acompanhamento do tratamento.",
    },
  ],
  rodape: "Vytal Saúde · autorização registrada no seu WhatsApp",
};

// Proporção do vytalsaude.png (396x334). Fixa aqui para o desenho não
// depender de medir a imagem em tempo de execução.
const PROPORCAO_LOGO = 396 / 334;

const MEDIDAS = {
  paisagem: {
    formato: [297, 210],
    margem: 12,
    qr: 96,
    tituloPt: 24,
    subtituloPt: 12.5,
    corpoPt: 13,
    passoPt: 12.5,
    colunas: [[0], [1, 3]], // índices de TEXTO_CARTAZ.blocos por coluna
  },
  retrato: {
    formato: [210, 297],
    margem: 12,
    qr: 86,
    tituloPt: 18,
    subtituloPt: 11,
    corpoPt: 12.5,
    passoPt: 12,
    colunas: [[0, 1, 3]],
  },
};

export function medidasDoCartaz(orientacao) {
  return MEDIDAS[orientacao] || MEDIDAS.retrato;
}

/**
 * Desenha o cartaz e devolve o documento jsPDF (sem salvar).
 *
 * @param {Function} JsPDF        construtor do jsPDF (injetado)
 * @param {string}   qrDataUrl    PNG do QR em data: URL, já em alta resolução
 * @param {string}   [logoDataUrl] PNG do logo em data: URL; sem ele, só o texto
 * @param {string}   [unidade]    nome da UBS, impresso no rodapé
 * @param {string}   [orientacao] "paisagem" (padrão) ou "retrato"
 */
export function montarCartazPdf({
  JsPDF,
  qrDataUrl,
  logoDataUrl,
  unidade = "",
  orientacao = "paisagem",
}) {
  if (typeof JsPDF !== "function") throw new Error("JsPDF é obrigatório");
  if (!qrDataUrl) throw new Error("qrDataUrl é obrigatório");

  const m = medidasDoCartaz(orientacao);
  const [largura, altura] = m.formato;
  const doc = new JsPDF({
    orientation: orientacao === "paisagem" ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const esq = m.margem;
  const dir = largura - m.margem;

  // ---- cabeçalho ----
  let x = esq;
  if (logoDataUrl) {
    const h = 15;
    doc.addImage(logoDataUrl, "PNG", esq, 11, h * PROPORCAO_LOGO, h);
    x = esq + h * PROPORCAO_LOGO + 6;
  }
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold").setFontSize(m.tituloPt);
  doc.text(TEXTO_CARTAZ.titulo, x, 21);
  doc.setFont("helvetica", "normal").setFontSize(m.subtituloPt);
  doc.setTextColor(60);
  doc.text(TEXTO_CARTAZ.subtitulo, x, 28.5);
  doc.setDrawColor(20).setLineWidth(0.7);
  doc.line(esq, 34, dir, 34);

  // ---- QR ----
  const topo = 42;
  doc.addImage(qrDataUrl, "PNG", esq, topo, m.qr, m.qr);

  // ---- passos 1-2-3, logo abaixo do QR ----
  // O número em círculo preto existe para o passo ser achado de relance por
  // quem está de pé no balcão, não para enfeitar.
  let y = topo + m.qr + 13;
  TEXTO_CARTAZ.passos.forEach((passo, i) => {
    doc.setFillColor(20);
    doc.circle(esq + 4, y - 1.5, 4, "F");
    doc.setTextColor(255).setFont("helvetica", "bold").setFontSize(m.passoPt - 2);
    doc.text(String(i + 1), esq + 4, y + 0.3, { align: "center" });
    doc.setTextColor(20).setFont("helvetica", "normal").setFontSize(m.passoPt);
    const linhas = doc.splitTextToSize(passo, m.qr - 11);
    doc.text(linhas, esq + 11, y);
    y += 5.6 * linhas.length + 4.4;
  });
  const fimDosPassos = y;

  // ---- blocos do consentimento ----
  const inicioTexto = esq + m.qr + 11;
  const larguraTotal = dir - inicioTexto;
  const vao = 10;
  const nCols = m.colunas.length;
  const larguraCol = (larguraTotal - vao * (nCols - 1)) / nCols;
  // 1pt = 0.3528mm. Errar essa conversão não quebra nada visível de imediato:
  // só abre buracos entre os blocos, porque o cursor anda mais que o texto.
  const FATOR_LINHA = 1.35;
  const alturaLinha = m.corpoPt * 0.3528 * FATOR_LINHA;

  // A distribuição dos blocos por coluna é FIXA (não calculada): 47 unidades
  // recebem a mesma folha, e um cartaz que se rearranja sozinho é um cartaz
  // que ninguém consegue conferir antes de mandar para a gráfica.
  let baseDasColunas = topo;
  m.colunas.forEach((indices, col) => {
    let cy = topo + 4;
    const cx = inicioTexto + col * (larguraCol + vao);
    indices.forEach((i) => {
      const bloco = TEXTO_CARTAZ.blocos[i];
      doc.setFont("helvetica", "bold").setFontSize(m.corpoPt + 0.5);
      doc.setTextColor(20);
      doc.text(bloco.titulo.toUpperCase(), cx, cy);
      cy += 7;
      doc.setFont("helvetica", "normal").setFontSize(m.corpoPt);
      doc.setTextColor(40);
      const linhas = doc.splitTextToSize(bloco.texto, larguraCol);
      doc.text(linhas, cx, cy, { lineHeightFactor: FATOR_LINHA });
      cy += linhas.length * alturaLinha + 8;
    });
    baseDasColunas = Math.max(baseDasColunas, cy);
  });

  // ---- faixa da saída (PARAR) ----
  const saida = TEXTO_CARTAZ.blocos.find((b) => b.destaque);
  let faixa = null;
  if (saida) {
    // No retrato a coluna de texto é estreita demais para a pastilha mais a
    // frase ao lado: a faixa atravessa a folha inteira, abaixo de tudo.
    // No paisagem ela ocupa a área de texto, ao lado dos passos.
    const larga = nCols === 1;
    const xFaixa = larga ? esq : inicioTexto;
    const wFaixa = larga ? dir - esq : larguraTotal;
    const hFaixa = 30;
    const pisoTexto = larga
      ? Math.max(fimDosPassos, baseDasColunas) + 6
      : baseDasColunas + 4;
    const yFaixa = Math.max(pisoTexto, altura - m.margem - 22 - hFaixa);
    faixa = { x: xFaixa, y: yFaixa, w: wFaixa, h: hFaixa };

    doc.setFillColor(244).setDrawColor(20).setLineWidth(0.5);
    doc.roundedRect(xFaixa, yFaixa, wFaixa, hFaixa, 2.5, 2.5, "FD");

    // A palavra fica numa pastilha preta, do mesmo jeito que os números dos
    // passos: é o elemento que a pessoa precisa achar sem ler o resto.
    const wPilula = 40;
    doc.setFillColor(20);
    doc.roundedRect(xFaixa + 6, yFaixa + 8, wPilula, 14, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(255);
    doc.text(saida.palavra, xFaixa + 6 + wPilula / 2, yFaixa + 17.6, {
      align: "center",
    });

    const xTexto = xFaixa + 6 + wPilula + 8;
    const wTexto = wFaixa - (xTexto - xFaixa) - 6;
    doc.setFont("helvetica", "bold").setFontSize(m.corpoPt).setTextColor(20);
    doc.text(saida.titulo.toUpperCase(), xTexto, yFaixa + 10.5);
    doc.setFont("helvetica", "normal").setFontSize(m.corpoPt - 1).setTextColor(40);
    doc.text(doc.splitTextToSize(saida.texto, wTexto), xTexto, yFaixa + 17.5, {
      lineHeightFactor: 1.3,
    });
  }

  // ---- rodapé ----
  const yRodape = altura - m.margem - 4;
  doc.setDrawColor(200).setLineWidth(0.3);
  doc.line(esq, yRodape - 5, dir, yRodape - 5);
  doc.setFontSize(9).setTextColor(60);
  if (unidade) {
    doc.setFont("helvetica", "bold").text(String(unidade), esq, yRodape);
  }
  doc.setFont("helvetica", "normal");
  doc.text(TEXTO_CARTAZ.rodape, dir, yRodape, { align: "right" });

  // Geometria exposta para teste: o cartaz é impresso e plastificado, então
  // "vazou da folha" precisa falhar no CI, não na gráfica.
  doc.layoutCartaz = { pagina: { largura, altura }, margem: m.margem, faixa };
  return doc;
}

export function nomeDoArquivo(unidade, orientacao) {
  const base = String(unidade || "cartaz")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `cartaz-${base || "vytal"}-${orientacao}.pdf`;
}

// O logo é um PNG servido junto com o painel. Vira data: URL porque o jsPDF
// precisa dos bytes, não de uma URL — e porque assim o PDF fica autocontido.
// Se falhar (offline, 404), o cartaz sai só com o texto: melhor um cartaz
// sem logo do que nenhum cartaz.
export async function carregarLogoDataUrl(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
