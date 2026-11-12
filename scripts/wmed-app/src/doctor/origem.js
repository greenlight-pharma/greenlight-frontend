// Origem do cadastro (primeiro toque): utm_source/utm_campaign ou ?ref=, senão o site que trouxe a pessoa.
// Fica só no navegador até o cadastro, quando vai junto (sem dado pessoal).
const KEY = '2d_origem';
export function captureOrigin() {
 try {
  if (localStorage.getItem(KEY)) return;
  const p = new URLSearchParams(location.search);
  const utm = p.get('utm_source') || p.get('ref');
  let v = utm ? [utm, p.get('utm_medium'), p.get('utm_campaign')].filter(Boolean).join('/') : '';
  if (!v && document.referrer) { const h = new URL(document.referrer).hostname.replace(/^www\./, ''); if (h && h !== location.hostname.replace(/^www\./, '')) v = 'ref:' + h; }
  if (v) localStorage.setItem(KEY, v.slice(0, 80));
 } catch { /* sem armazenamento: segue sem origem */ }
}
export function signupOrigin() { try { return localStorage.getItem(KEY) || ''; } catch { return ''; } }
