import { useEffect, useRef, useState } from 'react';
import { useI18n } from './I18n';
import { choose } from './pixel';
import './cookie-banner.css';

// Política de privacidade existente (a 2Doctor ainda não tem página própria).
const PRIVACY_URL = '/privacy';
const text = {
 pt: { msg: 'Usamos cookies de marketing (Meta) para medir nossos anúncios. Só carregam se você aceitar.', accept: 'Aceitar', decline: 'Recusar', link: 'Política de privacidade', label: 'Cookies' },
 en: { msg: 'We use marketing cookies (Meta) to measure our ads. They load only if you accept.', accept: 'Accept', decline: 'Decline', link: 'Privacy policy', label: 'Cookies' },
 es: { msg: 'Usamos cookies de marketing (Meta) para medir nuestros anuncios. Solo se cargan si aceptas.', accept: 'Aceptar', decline: 'Rechazar', link: 'Política de privacidad', label: 'Cookies' },
};
export default function CookieBanner({ onDone }) {
 const { locale } = useI18n();
 const [open, setOpen] = useState(true);
 const c = text[String(locale).slice(0, 2)] || text.en;
 // Informa a altura do aviso ao CSS: no celular a barra inferior e os diálogos sobem esse tanto,
 // para o aviso não tapar formulário nem navegação.
 const box = useRef(null);
 useEffect(() => {
  const el = box.current, root = document.documentElement;
  if (!open || !el) return;
  const set = () => root.style.setProperty('--cookie-banner-h', Math.ceil(el.getBoundingClientRect().height) + 'px');
  set();
  const watch = typeof ResizeObserver === 'function' ? new ResizeObserver(set) : null;
  watch?.observe(el);
  return () => { watch?.disconnect(); root.style.removeProperty('--cookie-banner-h'); };
 }, [open]);
 if (!open) return null;
 const pick = (v) => { choose(v); setOpen(false); if (v === 'accepted') onDone?.(); };
 return <aside ref={box} className="cookie-banner" role="region" aria-label={c.label}>
  <p>{c.msg} <a href={PRIVACY_URL} >{c.link}</a></p>
  <div><button type="button" className="cookie-decline" onClick={() => pick('declined')}>{c.decline}</button><button type="button" className="cookie-accept" onClick={() => pick('accepted')}>{c.accept}</button></div>
 </aside>;
}
