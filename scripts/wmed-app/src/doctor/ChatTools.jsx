import React, { useId, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Box, Calculator, ChevronDown, FileText, FlaskConical, Search, Wrench } from 'lucide-react';
import { useI18n } from './I18n';
import './chat-tools.css';

// Fixed destinations only. This component never receives conversation text or attachments.
const tools = [
  { id: 'scribe', icon: FileText,
    name: ['Scribe · demonstração', 'Scribe · demo', 'Scribe · demostración'],
    detail: ['Notas SOAP e SBAR com exemplos fictícios', 'SOAP and SBAR notes with fictional examples', 'Notas SOAP y SBAR con ejemplos ficticios'] },
  { id: 'fontes-oficiais', icon: BookOpen,
    name: ['Fontes oficiais', 'Official sources', 'Fuentes oficiales'],
    detail: ['Medicamentos e diretrizes por país', 'Medicines and guidelines by country', 'Medicamentos y guías por país'] },
  { id: 'pesquisa', icon: Search,
    name: ['Artigos e ensaios', 'Papers and trials', 'Artículos y ensayos'],
    detail: ['Buscar publicações e registros de estudos', 'Search publications and study records', 'Buscar publicaciones y registros de estudios'] },
  { id: 'exames-laboratoriais', icon: FlaskConical,
    name: ['Exames · protótipo', 'Lab tests · prototype', 'Pruebas · prototipo'],
    detail: ['Comparar com o intervalo do laudo', 'Compare with the report’s range', 'Comparar con el intervalo del informe'] },
  { id: 'scores', icon: Calculator,
    name: ['Scores e calculadoras', 'Scores and calculators', 'Escalas y calculadoras'],
    detail: ['Consultar critérios e cálculos', 'Look up criteria and calculations', 'Consultar criterios y cálculos'] },
  { id: 'anatomia', icon: Box,
    name: ['Anatomia 3D', '3D anatomy', 'Anatomía 3D'],
    detail: ['Explorar estruturas do corpo', 'Explore body structures', 'Explorar estructuras del cuerpo'] },
];
export default function ChatTools({ navigate }) {
  const { locale } = useI18n();
  const index = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
  const title = ['Ferramentas da conversa', 'Conversation tools', 'Herramientas de la conversación'][index];
  const [open, setOpen] = useState(false);
  const panelId = useId(), trigger = useRef(null);
  function close() { setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  return <section className="doctor-chat-tools" aria-label={title} onKeyDown={event => {
    if (event.key === 'Escape' && open) { event.stopPropagation(); close(); }
  }}>
    <button ref={trigger} type="button" className="chat-tools-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>
      <Wrench size={16} aria-hidden="true"/><span>{title}</span><ChevronDown size={16} aria-hidden="true"/>
    </button>
    <div id={panelId} hidden={!open} className="chat-tools-panel">
      <p>{['Abra uma ferramenta. Seu texto continua no chat, sem envio automático.', 'Open a tool. Your text stays in the chat and is not sent automatically.', 'Abre una herramienta. Tu texto sigue en el chat, sin envío automático.'][index]}</p>
      <div className="chat-tools-grid">{tools.map(({ id, icon: Icon, name, detail }) => <button key={id} type="button" onClick={() => { setOpen(false); navigate(id); }}>
        <Icon size={19} aria-hidden="true"/><span><strong>{name[index]}</strong><small>{detail[index]}</small></span><ArrowUpRight size={15} aria-hidden="true"/>
      </button>)}</div>
    </div>
  </section>;
}
