import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { jsPDF as JsPDF } from "jspdf";
import QRCode from "qrcode";
import {
  montarCartazPdf,
  nomeDoArquivo,
  medidasDoCartaz,
  TEXTO_CARTAZ,
} from "./cartazPdf.js";

const LINK =
  "https://wa.me/5512996527434?text=" +
  encodeURIComponent(
    "Autorizo receber os lembretes de medicações da Vytal Saúde [UBS-JARDIM-ORIENTE]"
  );

async function fazerCartaz(orientacao, unidade = "UBS Jardim Oriente") {
  const qrDataUrl = await QRCode.toDataURL(LINK, {
    width: 1200,
    margin: 0,
    errorCorrectionLevel: "H",
  });
  const logo = readFileSync("public/vytalsaude.png").toString("base64");
  return montarCartazPdf({
    JsPDF,
    qrDataUrl,
    logoDataUrl: `data:image/png;base64,${logo}`,
    unidade,
    orientacao,
  });
}

// O PDF é o produto: se sair em duas folhas ou em retrato, o cartaz não
// serve. Estas asserções olham o arquivo gerado, não o código.
describe("cartaz em PDF", () => {
  it("paisagem sai em UMA folha A4 deitada", async () => {
    const doc = await fazerCartaz("paisagem");
    expect(doc.getNumberOfPages()).toBe(1);
    const { width, height } = doc.internal.pageSize;
    expect(Math.round(width)).toBe(297);
    expect(Math.round(height)).toBe(210);
    expect(width).toBeGreaterThan(height);
  });

  it("retrato sai em UMA folha A4 em pé", async () => {
    const doc = await fazerCartaz("retrato");
    expect(doc.getNumberOfPages()).toBe(1);
    const { width, height } = doc.internal.pageSize;
    expect(Math.round(width)).toBe(210);
    expect(Math.round(height)).toBe(297);
  });

  // [CONSENTIMENTO] Se um destes textos sumir do cartaz, a autorização deixa
  // de ser informada. Foi exatamente o que aconteceu quando o layout
  // paisagem era cortado numa folha retrato: sumiram as orientações.
  it("imprime os quatro blocos do consentimento e os três passos", async () => {
    const doc = await fazerCartaz("paisagem");
    const bruto = doc.output();
    for (const bloco of TEXTO_CARTAZ.blocos) {
      expect(bruto).toContain(bloco.titulo.toUpperCase().slice(0, 8));
    }
    expect(TEXTO_CARTAZ.passos).toHaveLength(3);
    // Títulos do Anexo II-A dos Termos. Se alguém mexer aqui, é porque mexeu
    // no texto jurídico — e aí o teste deve mesmo quebrar para forçar a
    // pergunta "o advogado aprovou esta redação?".
    expect(TEXTO_CARTAZ.blocos.map((b) => b.titulo)).toEqual([
      "O que é este serviço",
      "Não altere seu tratamento",
      "Seus dados",
      "Como parar",
    ]);
    // A saída precisa estar escrita no papel, e em destaque: é o bloco que
    // torna a revogação tão fácil quanto a autorização (LGPD art. 8º §5º).
    const saida = TEXTO_CARTAZ.blocos.find((b) => b.destaque);
    expect(saida).toBeDefined();
    expect(saida.palavra).toBe("PARAR");
    expect(saida.titulo).toBe("Como parar");
  });

  // O retrato quebrou exatamente aqui na primeira versão: a faixa do PARAR
  // ficou mais estreita que o seu conteúdo e vazou pelo pé da folha, por
  // baixo do rodapé. Num PDF isso não dá erro — só sai errado na gráfica.
  it.each(["paisagem", "retrato"])(
    "em %s a faixa do PARAR cabe dentro das margens",
    async (orientacao) => {
      const doc = await fazerCartaz(orientacao);
      const { pagina, margem, faixa } = doc.layoutCartaz;
      expect(faixa).not.toBeNull();
      expect(faixa.x).toBeGreaterThanOrEqual(margem);
      expect(faixa.x + faixa.w).toBeLessThanOrEqual(pagina.largura - margem);
      expect(faixa.y + faixa.h).toBeLessThanOrEqual(pagina.altura - margem);
      // largura útil para a frase, depois da pastilha de 40mm e das bordas
      expect(faixa.w - 60).toBeGreaterThanOrEqual(60);
    }
  );

  it("exige o QR — cartaz sem código não é cartaz", async () => {
    expect(() => montarCartazPdf({ JsPDF, qrDataUrl: "" })).toThrow(/qrDataUrl/);
    expect(() => montarCartazPdf({ qrDataUrl: "x" })).toThrow(/JsPDF/);
  });

  it("o QR continua legível à distância de um balcão", () => {
    // O piso era 80mm e caiu para 70 quando o texto do advogado entrou —
    // 2,5x mais longo que o meu rascunho. A troca é deliberada: o texto do
    // consentimento não é ajustável, o QR é.
    //
    // 70mm ainda é folgado. A regra prática de leitura de QR é distância
    // útil ≈ 10x a largura do código: 76mm lê a ~76cm, mais que o vão de um
    // balcão. Abaixo de 70mm começa a apertar para quem lê em pé.
    for (const o of ["paisagem", "retrato"]) {
      expect(medidasDoCartaz(o).qr).toBeGreaterThanOrEqual(70);
    }
  });

  it("nomeia o arquivo pela unidade, sem acento nem espaço", () => {
    expect(nomeDoArquivo("UBS Jardim Oriente", "paisagem")).toBe(
      "cartaz-ubs-jardim-oriente-paisagem.pdf"
    );
    expect(nomeDoArquivo("São José", "retrato")).toBe(
      "cartaz-sao-jose-retrato.pdf"
    );
    expect(nomeDoArquivo("", "paisagem")).toBe("cartaz-cartaz-paisagem.pdf");
  });

  // Não é asserção: deixa os PDFs num diretório para conferência visual.
  it("grava amostras para conferência", async () => {
    const dir = process.env.CARTAZ_OUT;
    if (!dir) return;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    for (const o of ["paisagem", "retrato"]) {
      const doc = await fazerCartaz(o);
      writeFileSync(`${dir}/pdf-${o}.pdf`, Buffer.from(doc.output("arraybuffer")));
    }
    expect(existsSync(`${dir}/pdf-paisagem.pdf`)).toBe(true);
  });
});
