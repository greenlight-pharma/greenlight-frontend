// Páginas públicas e estáticas do 2Doctor: política de privacidade e termos para pacientes.
// HTML simples gerado no servidor a partir do mesmo texto que o app usa (shared/).
import { privacyPolicy, CONTACT_EMAIL } from '../shared/legal.mjs';
import { patientTerms } from '../shared/patient-mode.mjs';

export const LEGAL_ROUTES = {
 '/privacy': 'privacy', '/privacidade': 'privacy', '/privacidad': 'privacy',
 '/terms/patients': 'patient-terms', '/termos-paciente': 'patient-terms', '/terminos-paciente': 'patient-terms',
};
const LOCALES = { en: 'en', es: 'es', pt: 'pt-BR' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const UI = {
 en: { back: 'Open 2Doctor', other: 'Also in', privacy: 'Privacy policy', terms: 'Terms for patients' },
 es: { back: 'Abrir 2Doctor', other: 'También en', privacy: 'Política de privacidad', terms: 'Términos para pacientes' },
 'pt-BR': { back: 'Abrir o 2Doctor', other: 'Também em', privacy: 'Política de privacidade', terms: 'Termos para pacientes' },
};
export function pickLocale(url, acceptLanguage = '') {
 const q = new URL(url || '/', 'http://x').searchParams.get('lang');
 if (q && LOCALES[q]) return LOCALES[q];
 const first = String(acceptLanguage).split(',').map((p) => p.trim().slice(0, 2).toLowerCase()).find((l) => LOCALES[l]);
 return first ? LOCALES[first] : 'en';
}
export function legalHtml(kind, locale = 'en', path = '/privacy') {
 const ui = UI[locale] || UI.en;
 let title, updated = '', intro = '', body;
 if (kind === 'privacy') {
  const p = privacyPolicy(locale);
  ({ title, updated, intro } = p);
  body = p.sections.map(([h, items]) => `<h2>${esc(h)}</h2>${items.map((x) => `<p>${esc(x).replace(esc(CONTACT_EMAIL), `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)}</p>`).join('')}`).join('');
 } else {
  const t = patientTerms(locale);
  title = t.title;
  body = `<ul>${t.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p><a href="/privacy?lang=${locale.slice(0, 2)}">${esc(ui.privacy)}</a></p>`;
 }
 const others = Object.entries(LOCALES).filter(([, l]) => l !== locale).map(([k, l]) => `<a href="${path}?lang=${k}" hreflang="${l}">${{ en: 'English', es: 'Español', pt: 'Português' }[k]}</a>`).join(' · ');
 return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · 2Doctor</title><link rel="icon" href="/brand/2doctor/favicon.svg"><style>
:root{--bg:#f7faf9;--ink:#10201f;--muted:#4f6260;--accent:#005d5b;--line:#d9e3e1}
@media (prefers-color-scheme:dark){:root{--bg:#0d1716;--ink:#e6efed;--muted:#a3b5b2;--accent:#5fc7c1;--line:#25403d}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:720px;margin:0 auto;padding:32px 16px 64px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:24px}
header strong{font-size:18px}a{color:var(--accent)}h1{font-size:28px;line-height:1.25;margin:0 0 6px}h2{font-size:18px;margin:28px 0 6px}
.updated,.langs{color:var(--muted);font-size:14px}li{margin:0 0 10px}
</style></head><body><main><header><strong>2Doctor</strong><a href="/">${esc(ui.back)}</a></header><h1>${esc(title)}</h1>${updated ? `<p class="updated">${esc(updated)}</p>` : ''}${intro ? `<p>${esc(intro)}</p>` : ''}${body}<p class="langs">${esc(ui.other)}: ${others}</p></main></body></html>`;
}
