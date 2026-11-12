import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useI18n } from './I18n';
import './account-dialog.css';

export default function AccountDialog({ doctor, productName, onClose, children }) {
  const { t } = useI18n();
  const dialog = useRef(null), closeButton = useRef(null);
  useEffect(() => {
    if (!doctor) return;
    // The mobile menu restores body position and focus before this effect runs.
    const previous = document.activeElement, root = document.documentElement;
    const saved = { overflow: root.style.overflow, scrollbarGutter: root.style.scrollbarGutter };
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      Object.assign(root.style, saved);
      if (previous?.isConnected && !previous.matches('input,textarea,select')) previous.focus({ preventScroll: true });
    };
  }, [doctor]);
  function keys(event) {
    if (!doctor) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (event.key === 'Tab') {
      const controls = [...dialog.current.querySelectorAll('button:not(:disabled),a[href]')].filter(node => node.getClientRects().length);
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus(); }
    }
  }
  const close = <button ref={closeButton} autoFocus={!doctor} className="icon-btn close" aria-label={t('Fechar conexões')} onClick={onClose}><X /></button>;
  const heading = <><span className="eyebrow blue">{productName}</span><h2 id="connections-title">{doctor ? t('Minha conta') : t('Conexões da plataforma')}</h2></>;
  return <div className="modal-shade" onClick={onClose}>
    <section ref={dialog} className={`modal${doctor ? ' doctor-account-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="connections-title" onClick={event => event.stopPropagation()} onKeyDown={keys}>
      {doctor ? <><header className="account-titlebar"><div>{heading}</div>{close}</header><div className="account-scroll">{children}</div></> : <>{close}{heading}{children}</>}
    </section>
  </div>;
}
