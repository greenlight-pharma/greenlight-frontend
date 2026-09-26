import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { chatContent } from './chat-content.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const safeLink = url => /^https?:\/\//i.test(url || '') ? url : undefined;
const plain = node => node.value || node.alt || (node.children || []).map(plain).join('');
function inline(nodes, marks = {}, definitions = {}) {
  return nodes.flatMap(node => {
    if (node.type === 'strong') return inline(node.children, { ...marks, bold: true }, definitions);
    if (node.type === 'emphasis') return inline(node.children, { ...marks, italics: true }, definitions);
    if (node.type === 'delete') return inline(node.children, { ...marks, decoration: 'lineThrough' }, definitions);
    if (node.type === 'link' || node.type === 'linkReference') {
      const link = safeLink(node.url || definitions[node.identifier]);
      return inline(node.children, link ? { ...marks, link, color: '#17635e', decoration: 'underline' } : marks, definitions);
    }
    if (node.type === 'html' || node.type === 'image') return [];
    return (node.type === 'break' ? '\n' : plain(node)).split(/([\u2190-\u2bff])/u).filter(Boolean).map(text => ({ text, ...marks, ...(/[\u2190-\u2bff]/u.test(text) ? { font: 'Symbols' } : {}) }));
  });
}
function blocks(nodes, definitions) {
  return nodes.flatMap(node => {
    const text = () => inline(node.children || [], {}, definitions);
    switch (node.type) {
      case 'heading': return [{ text: text(), style: `h${Math.min(node.depth, 3)}`, headlineLevel: node.depth }];
      case 'paragraph': return [{ text: text(), margin: [0, 0, 0, 9] }];
      case 'list': return [{ [node.ordered ? 'ol' : 'ul']: node.children.map(item => ({ stack: blocks(item.children, definitions) })), ...(node.ordered ? { start: node.start || 1 } : {}), margin: [0, 2, 0, 9] }];
      case 'blockquote': return [{ stack: blocks(node.children, definitions), margin: [12, 4, 0, 9], color: '#53616b' }];
      case 'code': return [{ text: node.value, fontSize: 9, background: '#f0f3f5', margin: [0, 4, 0, 12] }];
      case 'thematicBreak': return [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 507, y2: 0, lineWidth: 0.5, lineColor: '#d8e1e5' }], margin: [0, 7, 0, 12] }];
      case 'table': {
        const count = node.children[0]?.children.length || 0;
        if (!count) return [];
        // Wide tables become labeled records so no column is cropped on A4.
        if (count > 4) return node.children.slice(1).map(row => ({ stack: row.children.map((cell, i) => ({ text: [{ text: `${plain(node.children[0].children[i])}: `, bold: true }, ...inline(cell.children, {}, definitions)], margin: [0, 0, 0, 5] })), margin: [0, 4, 0, 12] }));
        return [{ table: { headerRows: 1, widths: Array(count).fill('*'), body: node.children.map((row, i) => row.children.map(cell => ({ text: inline(cell.children, {}, definitions), bold: i === 0, fillColor: i === 0 ? '#edf4f3' : null, margin: [3, 5, 3, 5] }))) }, layout: 'lightHorizontalLines', fontSize: 9, margin: [0, 4, 0, 14] }];
      }
      default: return [];
    }
  });
}
export function chatPdfDefinition({ text, mode = 'chat', sources = [], locale = 'pt-BR', date = new Date() }) {
  let prepared = chatContent(text).text;
  if (mode !== 'chat') prepared = prepared.replace(/\[(\d+)\](?!\()/g, (match, n) => safeLink(sources[n - 1]?.url) ? `[${n}](${sources[n - 1].url})` : match);
  const tree = parser.parse(prepared);
  const definitions = Object.fromEntries(tree.children.filter(n => n.type === 'definition').map(n => [n.identifier, n.url]));
  const en = locale.startsWith('en'), es = locale.startsWith('es');
  const title = en ? 'Chat response' : es ? 'Respuesta del chat' : 'Resposta do chat';
  const refs = sources.filter(s => safeLink(s.url));
  return {
    pageSize: 'A4', pageMargins: [44, 62, 44, 52],
    info: { title: `2Doctor · ${title}`, author: '2Doctor', subject: title },
    defaultStyle: { font: 'Roboto', fontSize: 10.5, lineHeight: 1.25, color: '#24333f' },
    header: { columns: [{ text: '2Doctor', bold: true, fontSize: 15, color: '#17635e' }, { text: '2doctor.ai', alignment: 'right', fontSize: 9, color: '#697780' }], margin: [44, 24, 44, 0] },
    footer: (page, total) => ({ columns: [{ text: en ? 'AI-generated response. Verify the sources.' : es ? 'Respuesta de IA. Consulta las fuentes.' : 'Resposta gerada por IA. Confira as fontes.', fontSize: 8, color: '#697780' }, { text: `${page} / ${total}`, alignment: 'right', fontSize: 8 }], margin: [44, 18, 44, 0] }),
    content: [
      { text: `${title} · ${date.toLocaleDateString(locale)}`, fontSize: 9, color: '#697780', margin: [0, 0, 0, 16] },
      ...blocks(tree.children, definitions),
      ...(refs.length ? [{ text: en ? 'Sources' : es ? 'Fuentes' : 'Fontes', style: 'h2' }, ...refs.map((s, i) => ({ text: [{ text: `${i + 1}. ${s.title || s.url}\n`, bold: true }, { text: s.url, link: s.url, color: '#17635e' }], fontSize: 9, margin: [0, 0, 0, 10] }))] : []),
    ],
    styles: { h1: { fontSize: 21, bold: true, margin: [0, 14, 0, 10] }, h2: { fontSize: 15, bold: true, margin: [0, 12, 0, 8] }, h3: { fontSize: 12, bold: true, margin: [0, 10, 0, 7] } },
    pageBreakBefore: (current, following, next, previous) => Boolean(current.headlineLevel && !following.length && previous.length),
  };
}
