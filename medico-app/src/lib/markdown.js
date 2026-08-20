// [MD-RENDER] Conversor markdown->HTML mínimo, cobrindo só o que a IA usa
// (títulos #, **negrito**, listas -, regra ---, parágrafos). Sem biblioteca
// externa de propósito: menos dependência e menos superfície de risco.
//
// A ordem aqui é a peça de segurança: escapa PRIMEIRO, formata DEPOIS.
// O texto vem de um modelo de linguagem e vai para dangerouslySetInnerHTML;
// se a ordem invertesse, marcação vinda da resposta seria executada.
//
// Diferença em relação ao original: as tags saem com classe em vez de style
// inline, então a aparência vive no CSS junto com o resto.
function escapar(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function negrito(s) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function renderMarkdown(md) {
  if (!md) return "";
  const linhas = escapar(md).split("\n");
  let html = "";
  let emLista = false;

  const fecharLista = () => {
    if (emLista) {
      html += "</ul>";
      emLista = false;
    }
  };

  for (const bruta of linhas) {
    const l = bruta.trimEnd();

    if (/^\s*---\s*$/.test(l)) {
      fecharLista();
      html += '<hr class="md-hr">';
      continue;
    }

    const titulo = l.match(/^(#{1,4})\s+(.*)$/);
    if (titulo) {
      fecharLista();
      html += `<div class="md-h md-h${titulo[1].length}">${negrito(titulo[2])}</div>`;
      continue;
    }

    const item = l.match(/^\s*[-*]\s+(.*)$/);
    if (item) {
      if (!emLista) {
        html += '<ul class="md-ul">';
        emLista = true;
      }
      html += `<li>${negrito(item[1])}</li>`;
      continue;
    }

    fecharLista();
    if (!l.trim()) {
      html += '<div class="md-espaco"></div>';
      continue;
    }
    html += `<div class="md-p">${negrito(l)}</div>`;
  }

  fecharLista();
  return html;
}

/**
 * [B-PROGRESSIVO] Durante o streaming, formata só até a última linha
 * COMPLETA. A linha ainda em formação fica como texto cru, senão um título
 * ou um negrito se reformata a cada token e o texto "salta" na tela
 * enquanto o médico lê.
 */
export function renderMarkdownParcial(acumulado) {
  const ultimaQuebra = acumulado.lastIndexOf("\n");
  if (ultimaQuebra === -1) return `<div class="md-p">${escapar(acumulado)}</div>`;
  const completo = acumulado.slice(0, ultimaQuebra);
  const cauda = acumulado.slice(ultimaQuebra + 1);
  return (
    renderMarkdown(completo) +
    (cauda ? `<div class="md-p md-parcial">${escapar(cauda)}</div>` : "")
  );
}
