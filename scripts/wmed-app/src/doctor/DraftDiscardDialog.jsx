import React, { useLayoutEffect, useRef } from 'react';
import { useI18n } from './I18n';
import './draft-discard.css';

export default function DraftDiscardDialog({ onCancel, onDiscard }) {
  const { t } = useI18n();
  const keep = useRef(null), discard = useRef(null);
  useLayoutEffect(() => {
    const previous = document.activeElement;
    keep.current?.focus({ preventScroll: true });
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault();event.stopPropagation();onCancel(); }
    if (event.key === 'Tab') {
      event.preventDefault();
      (document.activeElement === keep.current ? discard : keep).current?.focus();
    }
  }
  return <div className="modal-shade doctor-draft-shade" onClick={onCancel}>
    <section className="modal doctor-draft-dialog" role="alertdialog" aria-modal="true" aria-labelledby="draft-discard-title" aria-describedby="draft-discard-description" onClick={event => event.stopPropagation()} onKeyDown={keys}>
      <h2 id="draft-discard-title">{t('Mensagem não enviada')}</h2>
      <p id="draft-discard-description">{t('Trocar de conversa descarta o texto e os anexos que você ainda não enviou.')}</p>
      <div className="doctor-draft-actions">
        <button ref={keep} className="doctor-draft-keep" onClick={onCancel}>{t('Manter rascunho')}</button>
        <button ref={discard} onClick={onDiscard}>{t('Descartar e continuar')}</button>
      </div>
    </section>
  </div>;
}
