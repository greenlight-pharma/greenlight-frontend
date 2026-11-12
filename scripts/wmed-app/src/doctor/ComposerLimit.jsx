import React from 'react';
import { useI18n } from './I18n';
import { composerLength, MAX_CHAT_CHARACTERS } from '../../shared/composer-length.mjs';
import './composer-limit.css';

export default function ComposerLimit({ text }) {
  const { locale } = useI18n();
  const { used, remaining, over, visible } = composerLength(text);
  if (!visible) return null;
  const index = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
  const amount = Math.abs(remaining).toLocaleString(locale);
  const message = over
    ? [`Reduza ${amount} caracteres para enviar. Seu texto foi mantido.`, `Remove ${amount} characters to send. Your text has been kept.`, `Reduce ${amount} caracteres para enviar. Tu texto se ha conservado.`][index]
    : ['Limite por mensagem.', 'Limit per message.', 'Límite por mensaje.'][index];
  return <p id="composer-limit" className={`composer-limit${over ? ' over' : ''}`}>
    <strong>{used.toLocaleString(locale)} / {MAX_CHAT_CHARACTERS.toLocaleString(locale)}</strong>
    <span>{message}</span>
  </p>;
}
