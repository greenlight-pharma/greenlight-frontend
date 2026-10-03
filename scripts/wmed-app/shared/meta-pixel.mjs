// Meta Pixel: regras puras (sem DOM), usadas pelo servidor e pelo front.
// O ID do pixel nunca fica no código: vem de META_PIXEL_ID (Railway).
export const PIXEL_PRICES = { mensal: 9.99, anual: 79 };
export const CONSENT_KEY = '2doctor-cookie-consent';
export const PURCHASE_KEY = '2doctor-pixel-purchase';
export const CHECKOUT_KEY = '2doctor-pixel-checkout';

// Aceita só IDs numéricos plausíveis; qualquer outra coisa é ignorada (nada carrega).
export function cleanPixelId(value) {
 const id = String(value ?? '').trim();
 return /^\d{5,20}$/.test(id) ? id : '';
}

// Insere <meta name="meta-pixel-id"> no HTML servido. Sem ID válido, devolve o HTML intacto.
export function injectPixelMeta(html, value) {
 const id = cleanPixelId(value);
 if (!id || !/<\/head>/i.test(html)) return html;
 return html.replace(/<\/head>/i, `<meta name="meta-pixel-id" content="${id}"/></head>`);
}

export function readConsent(storage) {
 try { const v = storage?.getItem(CONSENT_KEY); return v === 'accepted' || v === 'declined' ? v : null; } catch { return null; }
}
export function saveConsent(storage, value) {
 try { storage?.setItem(CONSENT_KEY, value); } catch { /* sem armazenamento: a escolha vale só nesta página */ }
}

// Dispara o Purchase uma única vez por assinatura (chave = fim do período atual).
export function purchaseOnce(storage, subscriptionKey, fire) {
 const key = String(subscriptionKey || 'pro');
 try { if (storage?.getItem(PURCHASE_KEY) === key) return false; } catch { /* segue */ }
 fire();
 try { storage?.setItem(PURCHASE_KEY, key); } catch { /* sem armazenamento */ }
 return true;
}
