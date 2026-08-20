// [PDF] O painel antigo baixava o jsPDF de um CDN no primeiro clique. Em UBS
// com internet instável isso é o pior lugar pra depender da rede: o médico
// só descobre que não dá pra imprimir a receita quando o paciente já está
// na frente dele. Agora a biblioteca vai no bundle — o PDF sai offline.
const A4 = { largura: 595, altura: 842 }; // pontos
const MARGEM_X = 40;
const MARGEM_Y = 48;
const ALTURA_LINHA = 13;

/**
 * Gera um PDF monoespaçado a partir de texto puro, quebrando páginas.
 *
 * O jsPDF entra por import() dinâmico: ele sozinho é maior que todo o resto
 * do painel, e a maioria das sessões nunca abre Documentos. Assim o médico
 * que só vai ver medicação não paga o download — o que importa numa UBS com
 * conexão ruim. A biblioteca continua no bundle (não em CDN), então uma vez
 * carregada o PDF sai mesmo sem internet.
 */
export async function textoParaPDF(texto, nomeArquivo) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  let y = MARGEM_Y;
  for (const linha of String(texto).split("\n")) {
    for (const parte of doc.splitTextToSize(linha, A4.largura - MARGEM_X * 2)) {
      if (y > A4.altura - MARGEM_Y) {
        doc.addPage();
        y = MARGEM_Y;
      }
      doc.text(parte, MARGEM_X, y);
      y += ALTURA_LINHA;
    }
  }

  doc.save(nomeArquivo);
}

/** Nome de arquivo seguro: sem acento, sem espaço, sem caractere de path. */
export function nomeArquivoSeguro(prefixo, nomePaciente) {
  const limpo = String(nomePaciente || "paciente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .slice(0, 40);
  return `${prefixo}_${limpo}_${new Date().toISOString().slice(0, 10)}.pdf`;
}

/** Copia para a área de transferência, com aviso honesto se não der. */
export async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}
