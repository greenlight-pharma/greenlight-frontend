// Casos compartilhados do 2Doctor: link público (bom para o X) e feed "Casos da comunidade".
// O que vai a público é uma cópia do caso salvo SEM o relato original: só os campos revisados,
// o feedback de orientação e a nota. O autor escolhe aparecer com o nome ou como anônimo.
// Três denúncias de pessoas diferentes tiram o caso do ar até revisão.
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fields } from '../shared/case-contract.mjs';
import { detectAcademicPII } from '../shared/pii.mjs';
import { q } from './db.mjs';
import { requireUser, currentUser, reply, readJson, lang, publicOrigin, throttle } from './accounts.mjs';

const ID = /^[A-Za-z0-9]{10}$/, UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LIMITE_DENUNCIAS = 3, POR_PAGINA = 12;
const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const novoId = () => Array.from(randomBytes(10), (b) => ABC[b % ABC.length]).join('');
const MSG = {
 invalid: { pt: 'Confira os dados.', en: 'Check the data.', es: 'Revisa los datos.' },
 notFound: { pt: 'Caso não encontrado ou removido.', en: 'Case not found or removed.', es: 'Caso no encontrado o eliminado.' },
 confirm: { pt: 'Confirme que o caso não identifica o paciente.', en: 'Confirm the case does not identify the patient.', es: 'Confirma que el caso no identifica al paciente.' },
 pii: { pt: 'Remova os dados que identificam o paciente antes de compartilhar.', en: 'Remove data that identifies the patient before sharing.', es: 'Elimina los datos que identifican al paciente antes de compartir.' },
 tooMany: { pt: 'Muitas tentativas. Aguarde um minuto.', en: 'Too many attempts. Wait a minute.', es: 'Demasiados intentos. Espera un minuto.' },
 fail: { pt: 'Não foi possível concluir. Tente novamente.', en: 'Could not complete. Try again.', es: 'No se pudo completar. Inténtalo de nuevo.' },
};
const m = (req, k) => MSG[k][lang(req)] || MSG[k].en;
const visivel = `removido_em is null and denuncias < ${LIMITE_DENUNCIAS}`;
const linkDe = (id) => `${publicOrigin()}/c/${id}`;
function publico(r, dono = false) {
 return { id: r.id, url: linkDe(r.id), titulo: r.titulo, autor: r.autor, campos: r.campos, feedback: r.feedback, score: r.score, idioma: r.idioma,
  respostas: r.respostas, criadoEm: r.criado_em, ...(dono ? { dono: true } : {}) };
}

// GET /api/wmed/compartilhados?id=…  ·  ?pagina=n  ·  POST {action: criar|remover|responder|denunciar}
export async function sharedCases(req, res) {
 const url = new URL(req.url || '/', 'http://x');
 try {
  if (req.method === 'GET') {
   const id = url.searchParams.get('id');
   if (id) {
    if (!ID.test(id)) return reply(res, 400, { error: m(req, 'invalid') });
    const { rows } = await q(`update casos_publicos set visitas = visitas + 1 where id = $1 and ${visivel} returning *`, [id]);
    if (!rows[0]) return reply(res, 404, { error: m(req, 'notFound') });
    const user = await currentUser(req).catch(() => null);
    return reply(res, 200, { caso: publico(rows[0], user?.id === rows[0].usuario_id) });
   }
   const pagina = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get('pagina') || '1', 10) || 1));
   const { rows } = await q(`select id, titulo, autor, score, idioma, respostas, criado_em, count(*) over () as total
     from casos_publicos where ${visivel} order by criado_em desc limit ${POR_PAGINA} offset ${(pagina - 1) * POR_PAGINA}`);
   const total = Number(rows[0]?.total || 0);
   return reply(res, 200, { casos: rows.map((r) => ({ id: r.id, titulo: r.titulo, autor: r.autor, score: r.score, idioma: r.idioma, respostas: r.respostas, criadoEm: r.criado_em })),
    pagina, paginas: Math.max(1, Math.ceil(total / POR_PAGINA)) });
  }
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
  let b;
  try { b = await readJson(req, 20000); } catch { return reply(res, 400, { error: m(req, 'invalid') }); }
  if (b.action === 'responder') {
   // Conta quem tentou o desafio (sem guardar a resposta).
   const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
   if (!ID.test(b.id || '')) return reply(res, 400, { error: m(req, 'invalid') });
   if (throttle(`resp:${ip}:${b.id}`, 1)) await q(`update casos_publicos set respostas = respostas + 1 where id = $1 and ${visivel}`, [b.id]);
   return reply(res, 200, { ok: true });
  }
  const user = await requireUser(req, res);
  if (!user) return;
  if (!throttle('comp:' + user.id, 20)) return reply(res, 429, { error: m(req, 'tooMany') });
  if (b.action === 'criar') {
   if (!UUID.test(b.casoId || '')) return reply(res, 400, { error: m(req, 'invalid') });
   if (b.confirmo !== true) return reply(res, 400, { error: m(req, 'confirm') });
   const { rows } = await q('select c.titulo, c.payload, c.feedback, u.nome from casos c join usuarios u on u.id = c.usuario_id where c.id = $1 and c.usuario_id = $2', [b.casoId, user.id]);
   if (!rows[0]) return reply(res, 404, { error: m(req, 'notFound') });
   const p = rows[0].payload || {};
   const campos = Object.fromEntries(fields.map(([k]) => [k, typeof p[k] === 'string' ? p[k].slice(0, 5000) : '']));
   if (detectAcademicPII(Object.values(campos).join('\n'))) return reply(res, 422, { error: m(req, 'pii') });
   const autor = b.anonimo === false ? String(rows[0].nome || '').trim().slice(0, 80) || null : null;
   const score = Number.isInteger(p.wmed?.quality?.score) ? p.wmed.quality.score : null;
   const idioma = ['pt', 'en', 'es'].includes(b.idioma) ? b.idioma : lang(req);
   const { rows: out } = await q(`insert into casos_publicos (id, caso_id, usuario_id, autor, titulo, campos, feedback, score, idioma) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict (caso_id) do update set autor = excluded.autor, idioma = excluded.idioma, removido_em = null returning *`,
    [novoId(), b.casoId, user.id, autor, String(rows[0].titulo).slice(0, 160), campos, rows[0].feedback, score, idioma]);
   return reply(res, 200, { caso: publico(out[0], true) });
  }
  if (!ID.test(b.id || '')) return reply(res, 400, { error: m(req, 'invalid') });
  if (b.action === 'remover') {
   const { rowCount } = await q('update casos_publicos set removido_em = now() where id = $1 and usuario_id = $2', [b.id, user.id]);
   return rowCount ? reply(res, 200, { ok: true }) : reply(res, 404, { error: m(req, 'notFound') });
  }
  if (b.action === 'denunciar') {
   await q('insert into denuncias_caso (caso_publico, usuario_id) values ($1, $2) on conflict do nothing', [b.id, user.id]);
   await q('update casos_publicos set denuncias = (select count(*) from denuncias_caso where caso_publico = $1) where id = $1', [b.id]);
   return reply(res, 200, { ok: true });
  }
  return reply(res, 400, { error: m(req, 'invalid') });
 } catch (e) {
  console.error('[2doctor] compartilhados', e?.message);
  return reply(res, 503, { error: m(req, 'fail') });
 }
}

// /c/<id>: página com as etiquetas de prévia (X, WhatsApp, LinkedIn) que leva ao desafio no app.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const CHAMADA = {
 pt: ['Desafio clínico', 'Qual é o seu diagnóstico? Resolva no 2Doctor e veja o feedback da IA.'],
 en: ['Case challenge', "What's your diagnosis? Solve it on 2Doctor and see the AI feedback."],
 es: ['Desafío clínico', '¿Cuál es tu diagnóstico? Resuélvelo en 2Doctor y mira el feedback de la IA.'],
};
export async function sharePage(req, res, { id, root }) {
 const { rows } = ID.test(id) ? await q(`select titulo, idioma from casos_publicos where id = $1 and ${visivel}`, [id]) : { rows: [] };
 const alvo = `/#comunidade?caso=${rows[0] ? id : ''}`;
 const [rotulo, desc] = CHAMADA[rows[0]?.idioma] || CHAMADA.en;
 const titulo = rows[0] ? `${rotulo}: ${rows[0].titulo}` : '2Doctor';
 const img = `${publicOrigin()}/brand/2doctor/og-caso.png`;
 const meta = `<meta property="og:type" content="article"><meta property="og:site_name" content="2Doctor"><meta property="og:url" content="${esc(linkDe(id))}">`
  + `<meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${esc(img)}">`
  + `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`
  + `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(titulo)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(img)}">`;
 let html = await readFile(resolve(root, 'index.html'), 'utf8');
 html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(titulo)} · 2Doctor</title>`).replace('</head>', `${meta}<script>location.replace(${JSON.stringify(alvo)})</script></head>`);
 res.writeHead(rows[0] ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' });
 return res.end(req.method === 'HEAD' ? undefined : html);
}
