import React, { useEffect, useRef, useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { useI18n } from './I18n';
import './chat-pdf.css';

// Nome do arquivo a partir da pergunta: "2doctor-como-tratar-hipertensao.pdf". Evita o "(1)", "(2)"
// de quem salva vários PDFs com o mesmo nome.
export function pdfFileName(question) {
  const slug = String(question || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+[^-]*$/, (m) => (m.length > 1 && String(question).length > 60 ? '' : m)).replace(/-+$/, '');
  return `2doctor-${slug || 'resposta'}.pdf`;
}

export default function ChatPdfButton({ message, question = '' }) {
  const { locale } = useI18n();
  const [busy, setBusy] = useState(false), [url, setUrl] = useState(''), [error, setError] = useState(false);
  const working = useRef(false), alive = useRef(true), download = useRef(null), trigger = useRef(null), restoreFocus = useRef(false);
  const en = locale.startsWith('en'), es = locale.startsWith('es');
  const label = (pt, english, spanish) => en ? english : es ? spanish : pt;
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (!url) return;
    if (restoreFocus.current) download.current?.focus({ preventScroll: true });
    download.current?.click();
    return () => URL.revokeObjectURL(url);
  }, [url]);
  async function generate() {
    if (working.current) return;
    working.current = true; setBusy(true); setError(false);
    try {
      const [{ default: pdfMake }, { default: fonts }, { chatPdfDefinition }, { default: symbols }] = await Promise.all([
        import('pdfmake/build/pdfmake'), import('pdfmake/build/vfs_fonts'), import('../../shared/chat-pdf.mjs'), import('./pdf-fonts/symbols.mjs'),
      ]);
      pdfMake.addVirtualFileSystem({ ...fonts, ...symbols });
      pdfMake.fonts = { Roboto: { normal: 'Roboto-Regular.ttf', bold: 'Roboto-Medium.ttf', italics: 'Roboto-Italic.ttf', bolditalics: 'Roboto-MediumItalic.ttf' }, Symbols: { normal: 'DejaVuSans.ttf', bold: 'DejaVuSans.ttf', italics: 'DejaVuSans.ttf', bolditalics: 'DejaVuSans.ttf' } };
      const blob = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('PDF timeout')), 45000);
        pdfMake.createPdf(chatPdfDefinition({ ...message, locale })).getBlob(value => { clearTimeout(timer); resolve(value); });
      });
      if (alive.current) {
        restoreFocus.current = document.activeElement === trigger.current;
        setUrl(URL.createObjectURL(blob));
      }
    } catch { if (alive.current) setError(true); }
    finally { working.current = false; if (alive.current) setBusy(false); }
  }
  return <span className="chat-pdf-action">
    {url ? <a ref={download} className="copy" href={url} download={pdfFileName(question)}><FileDown size={15}/>{label('Baixar PDF', 'Download PDF', 'Descargar PDF')}</a> : <button ref={trigger} className="copy" type="button" aria-disabled={busy} aria-busy={busy} onClick={generate}>{busy ? <Loader2 size={15} className="chat-pdf-spin"/> : <FileDown size={15}/>}<span aria-live="polite">{busy ? label('Gerando PDF…', 'Generating PDF…', 'Generando PDF…') : label('Gerar PDF', 'Generate PDF', 'Generar PDF')}</span></button>}
    {error && <span className="chat-pdf-error" role="alert">{label('Não foi possível gerar. Tente novamente.', 'Could not generate. Try again.', 'No se pudo generar. Inténtalo de nuevo.')}</span>}
  </span>;
}
