// Ponto de entrada único: importado por main.jsx. Monta o banner em raiz própria (não mexe no App).
import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './I18n';
import CookieBanner from './CookieBanner';
import { pixelId, consent, startPixel, captureReturn, trackRegistration, takeReturn } from './pixel';

captureReturn();
if (typeof document !== 'undefined' && pixelId()) {
 if (consent() === 'accepted') { startPixel(); if (takeReturn('registration')) trackRegistration(); }
 else if (consent() === null) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  createRoot(host).render(<I18nProvider enabled><CookieBanner onDone={() => { if (takeReturn('registration')) trackRegistration(); }} /></I18nProvider>);
 }
}
