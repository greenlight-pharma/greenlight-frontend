// Vídeos educativos do 2Doctor: lista e player (arquivos servidos pelo próprio site, com avanço por faixa).
import { useState } from 'react';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { VIDEOS } from '../../shared/videos.mjs';
import { useI18n } from './I18n';
import './videos.css';

const base = import.meta.env.BASE_URL + 'videos/';
export default function Videos() {
  const { t } = useI18n();
  const [aberto, setAberto] = useState(() => new URLSearchParams(location.hash.split('?')[1] || '').get('v') || '');
  const v = VIDEOS.find((x) => x.id === aberto);
  if (v) return <section className="module-page videos-page">
    <button className="back-button" onClick={() => { setAberto(''); history.replaceState(null, '', '#videos'); }}><ArrowLeft size={17} /> {t('Vídeos')}</button>
    <video className="video-player" src={base + v.id + '.mp4'} poster={base + v.id + '.jpg'} controls playsInline preload="metadata" />
    <span className="eyebrow blue">{t(v.area)} · {v.duracao}</span>
    <h1>{t(v.titulo)}</h1>
    <p className="video-resumo">{t(v.resumo)}</p>
    <p className="module-note">{t('Conteúdo educativo, não é orientação médica. Animações e narração feitas com IA; conteúdo clínico conferido nas diretrizes citadas no vídeo.')}</p>
  </section>;
  return <section className="module-page videos-page">
    <header className="module-heading"><span className="eyebrow blue">{t('ESTUDOS')}</span><h1>{t('Vídeos')}</h1>
      <p>{t('Doenças explicadas em animação, com a conduta conferida nas diretrizes. Em inglês.')}</p></header>
    <div className="video-grid">{VIDEOS.map((x) => <button key={x.id} className="video-card" onClick={() => { setAberto(x.id); history.replaceState(null, '', `#videos?v=${x.id}`); }}>
      <span className="video-thumb"><img src={base + x.id + '.jpg'} alt="" loading="lazy" /><PlayCircle size={42} /><small>{x.duracao}</small></span>
      <span className="video-meta"><small>{t(x.area)}</small><strong>{t(x.titulo)}</strong><span>{t(x.resumo)}</span></span>
    </button>)}</div>
  </section>;
}
