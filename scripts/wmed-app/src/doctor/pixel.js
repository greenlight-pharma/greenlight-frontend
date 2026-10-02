// Meta Pixel com consentimento. Nada é carregado sem META_PIXEL_ID no servidor e sem "Accept".
// Nenhum dado pessoal (e-mail, nome) é enviado: só nome do evento, valor e moeda.
import { cleanPixelId, readConsent, saveConsent, purchaseOnce, PIXEL_PRICES, CHECKOUT_KEY } from '../../shared/meta-pixel.mjs';

let loaded = false;
const store = () => { try { return window.localStorage; } catch { return null; } };

export function pixelId() {
 return cleanPixelId(document.querySelector('meta[name="meta-pixel-id"]')?.content);
}
export const consent = () => readConsent(store());
export const pixelActive = () => !!pixelId() && consent() === 'accepted' && loaded;

function loadScript(id) {
 if (loaded) return;
 loaded = true;
 /* eslint-disable */
 !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
 /* eslint-enable */
 // Sem correspondência avançada automática nem captura automática de botões/formulários.
 window.fbq('set', 'autoConfig', false, id);
 window.fbq('init', id);
 window.fbq('track', 'PageView');
}

// Chamado ao iniciar e quando o usuário aceita.
export function startPixel() {
 const id = pixelId();
 if (!id || consent() !== 'accepted') return false;
 loadScript(id);
 return true;
}
export function choose(value) {
 saveConsent(store(), value);
 if (value === 'accepted') startPixel();
}
export function track(event, params) {
 if (!pixelActive() || typeof window.fbq !== 'function') return false;
 params ? window.fbq('track', event, params) : window.fbq('track', event);
 return true;
}
export const trackRegistration = () => track('CompleteRegistration');
export function trackCheckout(intervalo) {
 const value = PIXEL_PRICES[intervalo];
 if (!value) return;
 try { sessionStorage.setItem(CHECKOUT_KEY, intervalo); } catch { /* segue */ }
 track('InitiateCheckout', { value, currency: 'USD' });
}
// Chamado quando a conta aparece como Pro logo após a volta do Stripe.
export function trackPurchase(subscriptionKey) {
 if (!pixelActive()) return false;
 let intervalo = 'mensal';
 try { intervalo = sessionStorage.getItem(CHECKOUT_KEY) || 'mensal'; } catch { /* segue */ }
 return purchaseOnce(store(), subscriptionKey, () => track('Purchase', { value: PIXEL_PRICES[intervalo] ?? PIXEL_PRICES.mensal, currency: 'USD' }));
}

// Sinais de retorno (lidos antes de o app limpar o hash): volta do Stripe e cadastro pelo Google.
export const RETURN_KEY = '2doctor-pixel-return';
export function captureReturn() {
 try {
  const h = location.hash.slice(1);
  if (h === 'assinatura-ok') sessionStorage.setItem(RETURN_KEY, 'purchase');
  else if (h === 'entrou-novo') sessionStorage.setItem(RETURN_KEY, 'registration');
 } catch { /* segue */ }
}
export function takeReturn(kind) {
 try { if (sessionStorage.getItem(RETURN_KEY) === kind) { sessionStorage.removeItem(RETURN_KEY); return true; } } catch { /* segue */ }
 return false;
}
export function hasReturn(kind) {
 try { return sessionStorage.getItem(RETURN_KEY) === kind; } catch { return false; }
}
