import React, { useId, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatContent } from '../../shared/chat-content.mjs';
import { useI18n } from './I18n';
import './chat-notes.css';

const labels = {
  'pt-BR': { title: 'Notas', back: 'Voltar à referência' },
  en: { title: 'Notes', back: 'Back to reference' },
  es: { title: 'Notas', back: 'Volver a la referencia' },
};

export default function CitationText({ text, sources = [], mode, doctor = false }) {
  const { locale } = useI18n();
  const id = useId();
  const container = useRef(null);
  const prefix = `response-${id.replace(/:/g, '')}-`;
  const label = labels[locale] || labels['pt-BR'];
  const prepared = mode === 'chat' ? chatContent(text).text : text.replace(/\[(\d+)\](?!\()/g,
    (match, n) => sources[n - 1] ? `[${n}](${sources[n - 1].url})` : '[referência indisponível]');
  const urls = new Set(sources.map(s => s.url));

  function visitNote(event, href) {
    // The app uses URL hashes for routing. Keep note navigation inside this response.
    event.preventDefault();
    const target = [...(container.current?.querySelectorAll('[id]') || [])]
      .find(element => element.id === href.slice(1));
    if (!target) return;
    if (!target.matches('a[href]')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  const markdown = <ReactMarkdown remarkPlugins={[remarkGfm]}
    remarkRehypeOptions={doctor ? {
      clobberPrefix: prefix,
      footnoteLabel: label.title,
      footnoteLabelProperties: { className: [] },
      footnoteBackLabel: (index, occurrence) => `${label.back} ${index + 1}${occurrence > 1 ? ` (${occurrence})` : ''}`,
    } : undefined}
    components={{
      a: ({ node, href, children, ...props }) => {
        const isNote = doctor && (props['data-footnote-ref'] !== undefined || props['data-footnote-backref'] !== undefined)
          && (href?.startsWith(`#${prefix}fn-`) || href?.startsWith(`#${prefix}fnref-`));
        if (isNote) return <a {...props} href={href}
          aria-describedby={props['data-footnote-ref'] !== undefined ? `${prefix}label` : undefined}
          onClick={event => visitNote(event, href)}>{children}</a>;
        return urls.has(href) || mode === 'chat' && /^https:\/\//.test(href || '')
          ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
          : <span>{children}</span>;
      },
      h2: ({ node, id, children, ...props }) => <h2 {...props} id={doctor && id === 'footnote-label' ? `${prefix}label` : id}>{children}</h2>,
      img: () => null,
    }}>{prepared}</ReactMarkdown>;
  return doctor ? <div ref={container} className="doctor-response-text">{markdown}</div> : markdown;
}
