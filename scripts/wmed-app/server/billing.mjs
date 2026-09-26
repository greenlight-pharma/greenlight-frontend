// Assinatura 2Doctor Pro pelo Stripe (Checkout hospedado + Portal do cliente + webhook).
// Plano de integração: stripe_implementation_planner (26/09/2026), sandbox da Vytal Saude Tecnologia.
// Variáveis: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET. Preços pelos lookup_keys abaixo.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { q } from './db.mjs';
import { requireUser, reply, readJson, publicOrigin, lang } from './accounts.mjs';

export const PRICES = { mensal: '2doctor_pro_mensal', anual: '2doctor_pro_anual' };
const ATIVOS = new Set(['active', 'trialing', 'past_due']);
const API = 'https://api.stripe.com/v1';

// Corpo x-www-form-urlencoded no formato do Stripe (objetos e listas com colchetes).
export function form(obj, prefix = '', out = new URLSearchParams()) {
 for (const [k, v] of Object.entries(obj)) {
  if (v === undefined || v === null) continue;
  const key = prefix ? `${prefix}[${k}]` : k;
  if (Array.isArray(v)) v.forEach((item, i) => (typeof item === 'object' ? form(item, `${key}[${i}]`, out) : out.append(`${key}[${i}]`, String(item))));
  else if (typeof v === 'object') form(v, key, out);
  else out.append(key, String(v));
 }
 return out;
}
async function stripe(path, { method = 'GET', body, fetchImpl = fetch } = {}) {
 const key = process.env.STRIPE_SECRET_KEY;
 if (!key) throw Object.assign(Error('Stripe não configurado.'), { status: 503 });
 const r = await fetchImpl(API + path, {
  method, headers: { Authorization: `Bearer ${key}`, ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) },
  ...(body ? { body: form(body).toString() } : {}), signal: AbortSignal.timeout(20000),
 });
 const data = await r.json();
 if (!r.ok) throw Object.assign(Error(data?.error?.message || 'Stripe error'), { status: r.status });
 return data;
}

// Plano efetivo de uma linha de usuarios.
export const isPro = (u) => u?.plano === 'pro' && ATIVOS.has(u?.assinatura_status);

async function customerFor(user, fetchImpl) {
 const { rows } = await q('select stripe_customer_id, email, nome from usuarios where id = $1', [user.id]);
 if (rows[0]?.stripe_customer_id) return rows[0].stripe_customer_id;
 const c = await stripe('/customers', { method: 'POST', fetchImpl, body: { email: rows[0].email, name: rows[0].nome || undefined, metadata: { usuario_id: user.id, produto: '2doctor' } } });
 // Duas abas ao mesmo tempo: fica o primeiro cliente gravado.
 const { rows: saved } = await q('update usuarios set stripe_customer_id = coalesce(stripe_customer_id, $2) where id = $1 returning stripe_customer_id', [user.id, c.id]);
 return saved[0].stripe_customer_id;
}

const MSG = {
 off: { pt: 'Assinaturas indisponíveis no momento.', en: 'Subscriptions are unavailable right now.', es: 'Las suscripciones no están disponibles en este momento.' },
 fail: { pt: 'Não foi possível abrir o pagamento. Tente novamente.', en: 'Could not open checkout. Try again.', es: 'No se pudo abrir el pago. Inténtalo de nuevo.' },
 already: { pt: 'Você já é assinante Pro. Use "Gerenciar assinatura".', en: 'You already have Pro. Use "Manage subscription".', es: 'Ya tienes Pro. Usa "Gestionar suscripción".' },
};
const m = (req, k) => MSG[k][lang(req)] || MSG[k].en;

// /api/wmed/billing  GET: situação do plano · POST {action:'checkout', intervalo} | {action:'portal'}
export async function billing(req, res, { fetchImpl = fetch } = {}) {
 const user = await requireUser(req, res);
 if (!user) return;
 try {
  const { rows } = await q('select plano, assinatura_status, assinatura_fim, stripe_customer_id from usuarios where id = $1', [user.id]);
  const u = rows[0];
  if (req.method === 'GET') return reply(res, 200, { plano: isPro(u) ? 'pro' : 'gratis', status: u.assinatura_status, fim: u.assinatura_fim, stripe: !!process.env.STRIPE_SECRET_KEY, cliente: !!u.stripe_customer_id });
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
  if (!process.env.STRIPE_SECRET_KEY) return reply(res, 503, { error: m(req, 'off') });
  const b = await readJson(req);
  if (b.action === 'portal') {
   if (!u.stripe_customer_id) return reply(res, 400, { error: m(req, 'fail') });
   const s = await stripe('/billing_portal/sessions', { method: 'POST', fetchImpl, body: { customer: u.stripe_customer_id, return_url: `${publicOrigin()}/#conta` } });
   return reply(res, 200, { url: s.url });
  }
  if (b.action !== 'checkout' || !PRICES[b.intervalo]) return reply(res, 400, { error: m(req, 'fail') });
  if (isPro(u)) return reply(res, 409, { error: m(req, 'already') });
  const prices = await stripe(`/prices?lookup_keys[]=${PRICES[b.intervalo]}&active=true`, { fetchImpl });
  const price = prices.data?.[0]?.id;
  if (!price) return reply(res, 503, { error: m(req, 'off') });
  const customer = await customerFor(user, fetchImpl);
  const s = await stripe('/checkout/sessions', { method: 'POST', fetchImpl, body: {
   mode: 'subscription', customer, client_reference_id: user.id,
   line_items: [{ price, quantity: 1 }],
   // Stripe Tax não existe para contas do Brasil (erro "not supported for your account country").
   // Liga só com STRIPE_TAX=1, numa conta de país suportado.
   ...(process.env.STRIPE_TAX === '1' ? { automatic_tax: { enabled: true }, customer_update: { address: 'auto', name: 'auto' }, billing_address_collection: 'required' } : { billing_address_collection: 'auto' }),
   allow_promotion_codes: true,
   locale: ['pt', 'es', 'en'].includes(lang(req)) ? (lang(req) === 'pt' ? 'pt-BR' : lang(req)) : 'auto',
   subscription_data: { billing_mode: { type: 'flexible' }, metadata: { usuario_id: user.id, produto: '2doctor' } },
   success_url: `${publicOrigin()}/#assinatura-ok`,
   cancel_url: `${publicOrigin()}/#planos`,
  } });
  return reply(res, 200, { url: s.url });
 } catch (e) {
  console.error('[2doctor] billing', e?.message);
  return reply(res, e?.status === 503 ? 503 : 502, { error: m(req, 'fail') });
 }
}

// ---- webhook ----
export function verifySignature(raw, header, secret, now = Date.now(), tolerance = 300) {
 if (!secret || !header) return false;
 const parts = Object.fromEntries(String(header).split(',').map((p) => p.split('=')).filter((p) => p.length === 2).map(([k, v]) => [k, v]).filter(([k]) => k === 't'));
 const t = Number(parts.t);
 if (!Number.isFinite(t) || Math.abs(now / 1000 - t) > tolerance) return false;
 const expected = createHmac('sha256', secret).update(`${t}.${raw}`).digest();
 return String(header).split(',').filter((p) => p.startsWith('v1=')).some((p) => {
  const got = Buffer.from(p.slice(3), 'hex');
  return got.length === expected.length && timingSafeEqual(got, expected);
 });
}
async function applySubscription(sub) {
 const status = sub.status;
 const fim = sub.items?.data?.[0]?.current_period_end || sub.current_period_end || null;
 const usuario = sub.metadata?.usuario_id || null;
 const params = [sub.customer, ATIVOS.has(status) ? 'pro' : 'gratis', status, fim ? new Date(fim * 1000) : null, sub.id];
 const { rowCount } = await q(`update usuarios set plano = $2, assinatura_status = $3, assinatura_fim = $4, stripe_subscription_id = $5 where stripe_customer_id = $1`, params);
 // Cliente criado fora do app (ex.: pelo painel): liga pelo usuario_id da assinatura.
 if (!rowCount && usuario && /^[0-9a-f-]{36}$/i.test(usuario))
  await q(`update usuarios set stripe_customer_id = coalesce(stripe_customer_id, $1), plano = $2, assinatura_status = $3, assinatura_fim = $4, stripe_subscription_id = $5 where id = $6`, [...params, usuario]);
}
export async function stripeWebhook(req, res) {
 if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
 let raw = '';
 try { for await (const c of req) { raw += c; if (raw.length > 1_000_000) throw Error(); } } catch { return reply(res, 400, { error: 'Invalid body.' }); }
 if (!verifySignature(raw, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)) return reply(res, 400, { error: 'Invalid signature.' });
 let event;
 try { event = JSON.parse(raw); } catch { return reply(res, 400, { error: 'Invalid JSON.' }); }
 try {
  const o = event.data?.object || {};
  if (event.type === 'checkout.session.completed' && o.mode === 'subscription' && o.client_reference_id && o.customer)
   await q('update usuarios set stripe_customer_id = coalesce(stripe_customer_id, $2) where id = $1', [o.client_reference_id, o.customer]);
  if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.paused', 'customer.subscription.resumed'].includes(event.type))
   await applySubscription(o);
  return reply(res, 200, { received: true });
 } catch (e) {
  console.error('[2doctor] webhook', event?.type, e?.message);
  return reply(res, 500, { error: 'Retry later.' });
 }
}
