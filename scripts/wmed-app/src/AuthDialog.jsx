import './doctor/auth-dialog.css';
import { useI18n } from './doctor/I18n';
import { useState, useEffect, useRef } from 'react';
import { X, LockKeyhole, ArrowRight } from 'lucide-react';
export default function AuthDialog({ product = { name: "WMed" }, api, onClose, onSuccess }) {const { t, locale } = useI18n();
  const [email, setEmail] = useState(''),[password, setPassword] = useState(''),[busy, setBusy] = useState(false),[error, setError] = useState('');const root = useRef(null),controller = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    // Run after the mobile drawer restores its focus and body position.
    const previous = document.activeElement, page = document.documentElement;
    const saved = { overflow: page.style.overflow, scrollbarGutter: page.style.scrollbarGutter };
    if (product.doctor) {
      page.style.scrollbarGutter = 'stable';
      page.style.overflow = 'hidden';
    }
    return () => {
      controller.current?.abort();
      if (product.doctor) {
        Object.assign(page.style, saved);
        if (previous?.isConnected && !previous.matches('input,textarea,select')) previous.focus({ preventScroll: true });
      } else previous?.focus?.();
    };
  }, []);
  useEffect(() => {
    if (product.doctor) (busy ? root.current : closeButton.current)?.focus({ preventScroll: true });
  }, [busy]);
  function keys(e) {if (e.key === 'Escape' && !busy) {e.preventDefault();e.stopPropagation();onClose();}if (e.key === 'Tab') {const all = [...root.current.querySelectorAll('button,input,a')].filter((el) => !el.disabled && el.getClientRects().length);if (e.shiftKey && (document.activeElement === all[0] || product.doctor && document.activeElement === root.current)) {e.preventDefault();all.at(-1)?.focus();} else if (!e.shiftKey && (document.activeElement === all.at(-1) || product.doctor && document.activeElement === root.current)) {e.preventDefault();all[0]?.focus();}}}
  async function submit(e) {e.preventDefault();if (busy) return;setBusy(true);setError('');controller.current = new AbortController();try {const r = await fetch(`${api}/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1' }, body: JSON.stringify({ email: email.trim(), password }), signal: controller.current.signal });const data = await r.json();if (!r.ok || !data.authenticated) throw Error(data.error || t("N\xE3o foi poss\xEDvel entrar."));setPassword('');onSuccess(data);} catch (e) {if (e.name !== 'AbortError') setError(e.message);} finally {setBusy(false);}}
  const close = <button ref={closeButton} className="icon-btn close" disabled={busy} aria-label={t("Fechar entrada")} onClick={onClose}><X /></button>;
  const heading = <><span className="eyebrow blue">{t("SUA CONTA VYTAL")}</span><h2 id="login-title">{t("Entre para continuar.")}</h2></>;
  const content = <><p>{t("Use o mesmo e-mail e senha do Vytal Acad\xEAmico. Seu acesso e os limites do assistente continuam os mesmos.")}</p><form onSubmit={submit}><label htmlFor="wmed-email">{t("E-mail")}</label><input autoFocus={!product.doctor} id="wmed-email" name="username" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /><label htmlFor="wmed-password">{t("Senha")}</label><input id="wmed-password" name="password" type="password" autoComplete="current-password" required maxLength={512} value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />{error && <p role="alert" className="error">{t(error)}</p>}<button className="auth-submit" disabled={busy}>{busy ? t("Entrando\u2026") : product.doctor ? t("Entrar na 2Doctor") : 'Entrar no WMed'}<ArrowRight size={17} /></button></form><a className="auth-help" href="https://app.vytalsaude.com.br/estudante" target="_blank" rel="noopener noreferrer">{t("Criar conta ou recuperar acesso no Vytal \u2197")}</a><p className="modal-note">{t("A senha n\xE3o fica salva na")} {product.name}{t(". A sess\xE3o usa um cookie protegido.")} {product.doctor ? t("Entre para retomar suas conversas e casos.") : 'A pesquisa de artigos pode ser usada sem entrar.'}</p></>;
  return <div className="modal-shade" onClick={() => {if (!busy) onClose();}}><section ref={root} tabIndex={product.doctor ? -1 : undefined} onKeyDown={keys} className={`modal auth-modal${product.doctor ? ' doctor-auth-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(e) => e.stopPropagation()}>{product.doctor ? <><header className="auth-titlebar"><div>{heading}</div>{close}</header><div className="auth-scroll">{content}</div></> : <>{close}<div className="auth-icon"><LockKeyhole size={22} /></div>{heading}{content}</>}</section></div>;
}
