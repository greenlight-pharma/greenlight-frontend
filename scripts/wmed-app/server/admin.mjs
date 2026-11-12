// Painel de administração do 2Doctor (/admin e /api/wmed/admin/*).
// Acesso só para e-mails verificados da lista ADMIN_EMAILS (padrão: dilsonpanisio@gmail.com).
// Quem não é admin recebe 404, como se a rota não existisse. Nunca devolve hashes de senha,
// tokens ou chaves; não apaga contas. Conversas: só leitura, e cada abertura fica na auditoria.
import { readFile } from 'node:fs/promises';
import { q } from './db.mjs';
import { currentUser, reply, readJson, sameSite, resendVerification } from './accounts.mjs';
import { stripe } from './billing.mjs';

const TZ = 'America/Sao_Paulo';
const ATIVOS = ['active', 'trialing', 'past_due'];
export const PRECO = { mensal: 9.99, anual: 79 };
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const adminEmails = () => String(process.env.ADMIN_EMAILS || 'dilsonpanisio@gmail.com').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
export async function adminUser(req) {
 const u = await currentUser(req).catch(() => null);
 return u && u.email_verificado && adminEmails().includes(String(u.email).toLowerCase()) ? u : null;
}
const notFound = (res) => reply(res, 404, { error: 'Recurso não encontrado.' });

// Início do dia (fuso de Brasília) há n dias, como timestamptz.
const dayStart = (n = 0) => `((date_trunc('day', now() at time zone '${TZ}') - interval '${Number(n)} days') at time zone '${TZ}')`;

// ---- Stripe (somente leitura), com cache curto ----
let stripeCache = { at: 0, data: null };
export async function stripeResumo({ fetchImpl = fetch, now = Date.now() } = {}) {
 if (!process.env.STRIPE_SECRET_KEY) return null;
 if (stripeCache.data && now - stripeCache.at < 5 * 60000) return stripeCache.data;
 const inicioMes = new Date(); inicioMes.setUTCDate(1); inicioMes.setUTCHours(3, 0, 0, 0); // 00h de Brasília
 if (inicioMes.getTime() > now) inicioMes.setUTCMonth(inicioMes.getUTCMonth() - 1);
 const receita = {}; let after = '';
 for (let i = 0; i < 10; i++) {
  const page = await stripe(`/invoices?status=paid&limit=100&created[gte]=${Math.floor(inicioMes / 1000)}${after}`, { fetchImpl });
  for (const inv of page.data || []) receita[inv.currency] = (receita[inv.currency] || 0) + (inv.amount_paid || 0) / 100;
  if (!page.has_more || !page.data?.length) break;
  after = `&starting_after=${page.data.at(-1).id}`;
 }
 const subs = { mensal: 0, anual: 0, teste: 0, atrasadas: 0, canceladas: 0, cancelaNoFim: 0, mrr: 0 }; after = '';
 for (let i = 0; i < 10; i++) {
  const page = await stripe(`/subscriptions?status=all&limit=100${after}`, { fetchImpl });
  for (const s of page.data || []) {
   const price = s.items?.data?.[0]?.price || {};
   const anual = price.recurring?.interval === 'year';
   const valor = (price.unit_amount || 0) / 100 * (s.items?.data?.[0]?.quantity || 1);
   if (s.status === 'canceled') { subs.canceladas++; continue; }
   if (s.status === 'trialing') { subs.teste++; continue; }
   if (!['active', 'past_due'].includes(s.status)) continue;
   if (s.status === 'past_due') subs.atrasadas++;
   if (s.cancel_at_period_end) subs.cancelaNoFim++;
   anual ? subs.anual++ : subs.mensal++;
   subs.mrr += anual ? valor / 12 : valor;
  }
  if (!page.has_more || !page.data?.length) break;
  after = `&starting_after=${page.data.at(-1).id}`;
 }
 subs.mrr = Math.round(subs.mrr * 100) / 100;
 const data = { receitaMes: receita, assinaturas: subs, teste: process.env.STRIPE_SECRET_KEY.startsWith('sk_test') || process.env.STRIPE_SECRET_KEY.startsWith('rk_test') };
 stripeCache = { at: now, data };
 return data;
}
export const _resetStripeCache = () => { stripeCache = { at: 0, data: null }; };

async function resumo({ fetchImpl }) {
 const one = async (sql, p) => (await q(sql, p)).rows[0];
 const all = async (sql, p) => (await q(sql, p)).rows;
 const [tot, hoje, ativos, assin, uso, serieCad, serieConv, serieCasos, top, paises, idiomas, origens, erros, errosRecentes] = await Promise.all([
  one(`select count(*)::int total,
     count(*) filter (where criado_em >= ${dayStart(0)})::int hoje,
     count(*) filter (where criado_em >= ${dayStart(6)})::int d7,
     count(*) filter (where criado_em >= ${dayStart(29)})::int d30,
     count(*) filter (where email_verificado)::int verificados from usuarios`),
  all(`select id, nome, email, pais, origem, to_char(criado_em at time zone '${TZ}', 'HH24:MI') hora, google_sub is not null google
     from usuarios where criado_em >= ${dayStart(0)} order by criado_em desc limit 100`),
  one(`with a as (
     select id, ultimo_acesso t from usuarios where ultimo_acesso >= ${dayStart(6)}
     union all select usuario_id, (dia::timestamp at time zone 'UTC') from uso_diario where dia >= (now() - interval '8 days')::date
     union all select usuario_id, atualizada_em from conversas where atualizada_em >= ${dayStart(6)}
     union all select usuario_id, criado_em from casos where criado_em >= ${dayStart(6)})
   select count(distinct id) filter (where t >= ${dayStart(0)})::int hoje, count(distinct id) filter (where t >= ${dayStart(6)})::int d7 from a`),
  one(`select
     count(*) filter (where plano = 'pro' and assinatura_status in ('active','past_due') and coalesce(assinatura_intervalo,'mensal') = 'mensal')::int mensal,
     count(*) filter (where plano = 'pro' and assinatura_status in ('active','past_due') and assinatura_intervalo = 'anual')::int anual,
     count(*) filter (where assinatura_status = 'trialing')::int teste,
     count(*) filter (where assinatura_status = 'past_due')::int atrasadas,
     count(*) filter (where assinatura_status = 'canceled')::int canceladas,
     count(*) filter (where assinatura_cancela and assinatura_status in ('active','trialing','past_due'))::int cancela_no_fim,
     count(*) filter (where cortesia_ate > now())::int cortesias from usuarios`),
  one(`select
     (select count(*) from conversas where criada_em >= ${dayStart(0)})::int conversas_hoje,
     (select count(*) from conversas where criada_em >= ${dayStart(6)})::int conversas_7d,
     (select count(*) from casos where criado_em >= ${dayStart(0)})::int casos_hoje,
     (select count(*) from casos where criado_em >= ${dayStart(6)})::int casos_7d,
     (select coalesce(sum(n),0) from uso_diario where tipo = 'chat' and dia = (now() at time zone 'UTC')::date)::int mensagens_hoje,
     (select coalesce(sum(n),0) from uso_diario where tipo = 'chat' and dia >= (now() at time zone 'UTC')::date - 6)::int mensagens_7d`),
  all(`select to_char(d, 'YYYY-MM-DD') dia, (select count(*) from usuarios where (criado_em at time zone '${TZ}')::date = d)::int n
     from generate_series((now() at time zone '${TZ}')::date - 29, (now() at time zone '${TZ}')::date, interval '1 day') d order by d`),
  all(`select to_char(d, 'YYYY-MM-DD') dia, (select count(*) from conversas where (criada_em at time zone '${TZ}')::date = d)::int n
     from generate_series((now() at time zone '${TZ}')::date - 29, (now() at time zone '${TZ}')::date, interval '1 day') d order by d`),
  all(`select to_char(d, 'YYYY-MM-DD') dia, (select count(*) from casos where (criado_em at time zone '${TZ}')::date = d)::int n
     from generate_series((now() at time zone '${TZ}')::date - 29, (now() at time zone '${TZ}')::date, interval '1 day') d order by d`),
  all(`select u.id, u.nome, u.email, sum(d.n)::int mensagens,
     (select count(*) from conversas c where c.usuario_id = u.id)::int conversas,
     (select count(*) from casos c where c.usuario_id = u.id)::int casos
     from uso_diario d join usuarios u on u.id = d.usuario_id
     where d.tipo = 'chat' and d.dia >= (now() at time zone 'UTC')::date - 29
     group by u.id order by mensagens desc limit 10`),
  all(`select coalesce(pais, '—') chave, count(*)::int n from usuarios group by 1 order by n desc limit 15`),
  all(`select coalesce(idioma, '—') chave, count(*)::int n from usuarios group by 1 order by n desc limit 10`),
  all(`select coalesce(origem, case when google_sub is not null then 'google (sem origem)' else 'direto/sem origem' end) chave, count(*)::int n
     from usuarios where criado_em >= ${dayStart(29)} group by 1 order by n desc limit 15`),
  all(`select codigo, count(*) filter (where criado_em >= now() - interval '24 hours')::int h24, count(*)::int d7
     from erros_servico where criado_em >= now() - interval '7 days' group by codigo order by d7 desc`),
  all(`select rota, codigo, http, to_char(criado_em at time zone '${TZ}', 'DD/MM HH24:MI') quando from erros_servico order by criado_em desc limit 10`),
 ]);
 const mrrBanco = Math.round((assin.mensal * PRECO.mensal + assin.anual * PRECO.anual / 12) * 100) / 100;
 let stripeInfo = null, stripeErro = null;
 try { stripeInfo = await stripeResumo({ fetchImpl }); } catch (e) { stripeErro = 'Não foi possível ler o Stripe agora.'; console.error('[2doctor] admin stripe', e?.message); }
 return {
  geradoEm: new Date().toISOString(), fuso: TZ,
  usuarios: tot, cadastrosHoje: hoje, ativos,
  assinaturas: { ...assin, mrrBanco, precos: PRECO },
  stripe: stripeInfo, stripeErro, stripeLigado: !!process.env.STRIPE_SECRET_KEY,
  uso, series: { cadastros: serieCad, conversas: serieConv, casos: serieCasos },
  topMensagens: top, paises, idiomas, origens, erros, errosRecentes,
 };
}

const USER_COLS = `u.id, u.nome, u.email, u.pais, u.idioma, u.origem, u.email_verificado, u.google_sub is not null google, u.senha_hash is not null tem_senha,
 u.plano, u.assinatura_status, u.assinatura_intervalo, u.assinatura_fim, u.assinatura_cancela, u.stripe_customer_id, u.cortesia_ate, u.cortesia_por,
 u.criado_em, u.ultimo_acesso,
 (select count(*) from conversas c where c.usuario_id = u.id)::int conversas,
 (select count(*) from casos c where c.usuario_id = u.id)::int casos`;

async function usuarios(url) {
 const busca = (url.searchParams.get('busca') || '').trim().slice(0, 100);
 const pagina = Math.max(1, Math.min(1000, parseInt(url.searchParams.get('pagina') || '1', 10) || 1));
 const filtro = url.searchParams.get('filtro') || '';
 const size = 30, where = [], params = [];
 if (busca) { params.push('%' + busca.replace(/[%_\\]/g, (x) => '\\' + x) + '%'); where.push(`(u.nome ilike $${params.length} or u.email ilike $${params.length} or u.pais ilike $${params.length} or u.origem ilike $${params.length})`); }
 if (filtro === 'pro') where.push(`((u.plano = 'pro' and u.assinatura_status = any('{${ATIVOS}}')) or u.cortesia_ate > now())`);
 if (filtro === 'teste') where.push(`u.assinatura_status = 'trialing'`);
 if (filtro === 'cortesia') where.push(`u.cortesia_ate > now()`);
 if (filtro === 'hoje') where.push(`u.criado_em >= ${dayStart(0)}`);
 const { rows } = await q(`select ${USER_COLS}, count(*) over () total from usuarios u ${where.length ? 'where ' + where.join(' and ') : ''}
   order by u.criado_em desc limit ${size} offset ${(pagina - 1) * size}`, params);
 const total = Number(rows[0]?.total || 0);
 return { usuarios: rows.map(({ total: _t, stripe_customer_id, ...u }) => ({ ...u, stripe: !!stripe_customer_id })), pagina, total, paginas: Math.max(1, Math.ceil(total / size)) };
}

const stripeLink = (id) => id && `https://dashboard.stripe.com/${String(process.env.STRIPE_SECRET_KEY || '').includes('_test_') ? 'test/' : ''}customers/${encodeURIComponent(id)}`;

async function ficha(id) {
 const { rows } = await q(`select ${USER_COLS} from usuarios u where u.id = $1`, [id]);
 if (!rows[0]) return null;
 const u = rows[0];
 const [uso, auditoria, mensagens] = await Promise.all([
  q(`select tipo, sum(n)::int n from uso_diario where usuario_id = $1 and dia >= (now() at time zone 'UTC')::date - 29 group by tipo order by n desc`, [id]),
  q(`select admin_email, acao, detalhe, to_char(criado_em at time zone '${TZ}', 'DD/MM/YYYY HH24:MI') quando from admin_auditoria where usuario_id = $1 order by criado_em desc limit 20`, [id]),
  q(`select coalesce(sum(jsonb_array_length(mensagens)),0)::int n from conversas where usuario_id = $1`, [id]),
 ]);
 const { stripe_customer_id, ...rest } = u;
 return { usuario: { ...rest, mensagensSalvas: mensagens.rows[0].n, stripeUrl: stripeLink(stripe_customer_id) }, uso30d: uso.rows, auditoria: auditoria.rows };
}

async function audit(admin, acao, usuarioId, detalhe) {
 await q('insert into admin_auditoria (admin_email, acao, usuario_id, detalhe) values ($1, $2, $3, $4)', [admin.email, acao, usuarioId, detalhe ? JSON.stringify(detalhe) : null]);
}

// ---- Conversas (somente leitura) ----
async function conversasDe(id, url) {
 const pagina = Math.max(1, Math.min(10000, parseInt(url.searchParams.get('pagina'), 10) || 1)); const size = 20;
 const u = await q('select id, nome, email from usuarios where id = $1', [id]);
 if (!u.rows[0]) return null;
 const { rows } = await q(`select id, titulo, criada_em, atualizada_em, jsonb_array_length(mensagens)::int mensagens, count(*) over () total
   from conversas where usuario_id = $1 order by atualizada_em desc limit ${size} offset ${(pagina - 1) * size}`, [id]);
 const total = Number(rows[0]?.total || 0);
 return { usuario: u.rows[0], conversas: rows.map(({ total: _t, ...c }) => c), pagina, total, paginas: Math.max(1, Math.ceil(total / size)) };
}

async function conversa(admin, id, url) {
 const pagina = Math.max(1, Math.min(10000, parseInt(url.searchParams.get('pagina'), 10) || 1)); const size = 50;
 const { rows } = await q(`select c.id, c.usuario_id, c.titulo, c.criada_em, c.atualizada_em, jsonb_array_length(c.mensagens)::int total,
   (select coalesce(jsonb_agg(m order by i), '[]') from jsonb_array_elements(c.mensagens) with ordinality x(m, i) where i > $2 and i <= $2 + ${size}) mensagens,
   u.email usuario_email, u.nome usuario_nome
   from conversas c join usuarios u on u.id = c.usuario_id where c.id = $1`, [id, (pagina - 1) * size]);
 const c = rows[0];
 if (!c) return null;
 await audit(admin, 'ver_conversa', c.usuario_id, { conversa: c.id, titulo: String(c.titulo).slice(0, 80), pagina });
 const mensagens = c.mensagens.map((m, i) => ({ n: (pagina - 1) * size + i + 1, papel: m?.papel === 'assistant' ? 'assistant' : 'user', conteudo: String(m?.conteudo ?? ''), em: m?.em || m?.criadoEm || null }));
 return { conversa: { id: c.id, titulo: c.titulo, criada_em: c.criada_em, atualizada_em: c.atualizada_em, usuario: { id: c.usuario_id, email: c.usuario_email, nome: c.usuario_nome } },
  mensagens, pagina, total: c.total, paginas: Math.max(1, Math.ceil(c.total / size)) };
}

async function acao(req, admin, { fetchImpl }) {
 const b = await readJson(req, 4000);
 if (!ID.test(b.id || '')) return [400, { error: 'Usuário inválido.' }];
 const { rows } = await q('select id, email, cortesia_ate from usuarios where id = $1', [b.id]);
 if (!rows[0]) return [404, { error: 'Usuário não encontrado.' }];
 if (b.acao === 'cortesia') {
  const dias = Number(b.dias);
  if (!Number.isInteger(dias) || dias < 1 || dias > 400) return [400, { error: 'Prazo de 1 a 400 dias.' }];
  const motivo = typeof b.motivo === 'string' ? b.motivo.trim().slice(0, 200) : '';
  const { rows: r } = await q(`update usuarios set cortesia_ate = now() + make_interval(days => $2::int), cortesia_por = $3 where id = $1 returning cortesia_ate`, [b.id, dias, admin.email]);
  await audit(admin, 'cortesia_pro', b.id, { dias, ate: r[0].cortesia_ate, ...(motivo ? { motivo } : {}) });
  return [200, { ok: true, cortesia_ate: r[0].cortesia_ate }];
 }
 if (b.acao === 'remover-cortesia') {
  await q('update usuarios set cortesia_ate = null, cortesia_por = null where id = $1', [b.id]);
  await audit(admin, 'remover_cortesia', b.id, { tinha_ate: rows[0].cortesia_ate });
  return [200, { ok: true }];
 }
 if (b.acao === 'reenviar-verificacao') {
  const r = await resendVerification(b.id, { fetchImpl });
  await audit(admin, 'reenviar_verificacao', b.id, r);
  const msg = { 'ja-verificado': 'O e-mail já está verificado.', 'email-desligado': 'Envio de e-mail desligado (sem chave do Resend).', 'falha-envio': 'O provedor de e-mail recusou o envio.' };
  return [r.ok ? 200 : 409, r.ok ? { ok: true } : { error: msg[r.motivo] || 'Não foi possível enviar.' }];
 }
 return [400, { error: 'Ação inválida.' }];
}

// /api/wmed/admin/<sub>
export async function adminApi(req, res, { sub = '', fetchImpl = fetch } = {}) {
 const admin = await adminUser(req);
 if (!admin) return notFound(res);
 const url = new URL(req.url || '/', 'http://x');
 try {
  if (req.method === 'GET') {
   if (sub === 'resumo') return reply(res, 200, await resumo({ fetchImpl }));
   if (sub === 'usuarios') return reply(res, 200, await usuarios(url));
   if (sub.startsWith('usuario/')) {
    const id = sub.slice('usuario/'.length);
    if (!ID.test(id)) return notFound(res);
    const f = await ficha(id);
    return f ? reply(res, 200, f) : notFound(res);
   }
   if (sub.startsWith('conversas/')) {
    const id = sub.slice('conversas/'.length);
    if (!ID.test(id)) return notFound(res);
    const r = await conversasDe(id, url);
    return r ? reply(res, 200, r) : notFound(res);
   }
   if (sub.startsWith('conversa/')) {
    const id = sub.slice('conversa/'.length);
    if (!ID.test(id)) return notFound(res);
    const r = await conversa(admin, id, url);
    return r ? reply(res, 200, r) : notFound(res);
   }
   if (sub === 'auditoria') {
    const { rows } = await q(`select a.admin_email, a.acao, a.detalhe, a.usuario_id, u.email usuario_email, to_char(a.criado_em at time zone '${TZ}', 'DD/MM/YYYY HH24:MI') quando
      from admin_auditoria a left join usuarios u on u.id = a.usuario_id order by a.criado_em desc limit 200`);
    return reply(res, 200, { auditoria: rows });
   }
   if (sub === 'eu') return reply(res, 200, { email: admin.email });
   return notFound(res);
  }
  if (req.method === 'POST' && sub === 'acao') {
   if (!sameSite(req)) return reply(res, 403, { error: 'Atualize a página antes de continuar.' });
   const [status, data] = await acao(req, admin, { fetchImpl });
   return reply(res, status, data);
  }
  return notFound(res);
 } catch (e) {
  console.error('[2doctor] admin', sub, e?.message);
  return reply(res, 503, { error: 'Não foi possível carregar. Tente novamente.' });
 }
}

// /admin e /painel: a página só é entregue para admin; os demais recebem 404.
const PAGE = new URL('./admin-page.html', import.meta.url);
export async function adminPage(req, res) {
 const admin = await adminUser(req);
 if (!admin) return notFound(res);
 const html = await readFile(PAGE);
 res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" });
 res.end(req.method === 'HEAD' ? undefined : html);
}

// Registro de falhas do serviço de IA (só código, rota e http).
export function reportError(rota) {
 return (codigo, http, usuarioId) => q('insert into erros_servico (rota, codigo, http, usuario_id) values ($1, $2, $3, $4)',
  [rota, String(codigo).slice(0, 40), http ?? null, usuarioId && ID.test(usuarioId) ? usuarioId : null]).catch(() => {});
}
