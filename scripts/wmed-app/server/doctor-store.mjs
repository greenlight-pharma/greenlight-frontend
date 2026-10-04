// Casos e conversas salvos no banco do 2Doctor (no lugar das rotas /estudante/casos e
// /estudante/tutor/conversas da Vytal). Mesmo formato de resposta que as telas já usam.
import { randomUUID } from 'node:crypto';
import { caseSaveBody } from '../shared/case-storage.mjs';
import { q } from './db.mjs';
import { requireUser, reply, readJson, lang } from './accounts.mjs';

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MSG = {
 invalid: { pt: 'Confira os dados do caso.', en: 'Check the case data.', es: 'Revisa los datos del caso.' },
 notFound: { pt: 'Caso não encontrado.', en: 'Case not found.', es: 'Caso no encontrado.' },
 chatInvalid: { pt: 'A conversa excedeu o limite de salvamento ou contém dados inválidos. Copie o texto antes de sair.', en: 'The conversation exceeded the save limit or has invalid data. Copy the text before leaving.', es: 'La conversación superó el límite de guardado o tiene datos inválidos. Copia el texto antes de salir.' },
 chatNotFound: { pt: 'Conversa não encontrada.', en: 'Conversation not found.', es: 'Conversación no encontrada.' },
 fail: { pt: 'Não foi possível salvar ou carregar. Tente novamente.', en: 'Could not save or load. Try again.', es: 'No se pudo guardar o cargar. Inténtalo de nuevo.' },
};
const m = (req, key) => MSG[key][lang(req)] || MSG[key].en;

export async function cases(req, res) {
 if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
 const user = await requireUser(req, res);
 if (!user) return;
 let b, body;
 try {
  b = await readJson(req, 500000);
  if (!['list', 'open', 'save'].includes(b.action)) throw Error();
  if (b.action === 'open' && !ID.test(b.id || '')) throw Error();
  if (b.action === 'list' && (!Number.isInteger(b.page || 1) || (b.page || 1) < 1 || typeof (b.search || '') !== 'string' || (b.search || '').length > 200)) throw Error();
  if (b.action === 'save') body = caseSaveBody(b.snapshot);
 } catch (e) { return reply(res, 400, { error: e?.message && e.message !== 'BODY' ? e.message : m(req, 'invalid') }); }
 try {
  if (b.action === 'open') {
   const { rows } = await q('select id, titulo, payload, feedback, criado_em from casos where id = $1 and usuario_id = $2', [b.id, user.id]);
   if (!rows[0]) return reply(res, 404, { error: m(req, 'notFound') });
   const c = rows[0];
   return reply(res, 200, { caso: { id: c.id, titulo: c.titulo, payload: c.payload, feedback: c.feedback, createdAt: c.criado_em } });
  }
  if (b.action === 'list') {
   const page = b.page || 1, size = 12, search = (b.search || '').trim();
   const where = search ? `and (titulo ilike $2 or request_id = $3)` : '';
   const params = search ? [user.id, '%' + search.replace(/[%_\\]/g, (x) => '\\' + x) + '%', search] : [user.id];
   const { rows } = await q(`select id, titulo, criado_em, payload->'wmed'->'quality'->'score' as score, count(*) over () as total
     from casos where usuario_id = $1 ${where} order by criado_em desc limit ${size} offset ${(page - 1) * size}`, params);
   const total = Number(rows[0]?.total || 0);
   return reply(res, 200, { casos: rows.map((c) => ({ id: c.id, titulo: c.titulo, createdAt: c.criado_em, score: c.score ?? null })),
    paginacao: { page, pageSize: size, total, totalPages: Math.max(1, Math.ceil(total / size)) } });
  }
  // request_id único por pessoa: um reenvio após resposta perdida devolve o mesmo caso.
  const { rows } = await q(`insert into casos (id, usuario_id, request_id, titulo, payload, feedback) values ($1, $2, $3, $4, $5, $6)
    on conflict (usuario_id, request_id) do update set request_id = excluded.request_id
    returning id, titulo, criado_em`, [randomUUID(), user.id, body.payload.wmed.requestId, body.titulo, body.payload, body.feedback]);
  return reply(res, 200, { caso: { id: rows[0].id, titulo: rows[0].titulo, createdAt: rows[0].criado_em } });
 } catch (e) {
  console.error('[2doctor] casos', e?.message);
  return reply(res, 503, { error: m(req, 'fail') });
 }
}

export async function history(req, res) {
 if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
 const user = await requireUser(req, res);
 if (!user) return;
 let b;
 try {
  b = await readJson(req, 1000000);
  if (!['list', 'open', 'save', 'rename', 'delete'].includes(b.action)) throw Error();
  if (['open', 'rename', 'delete'].includes(b.action) && !b.id) throw Error();
  if (b.action === 'rename' && (typeof b.title !== 'string' || !b.title.trim() || b.title.trim().length > 80)) throw Error();
  if ((b.action === 'open' || b.id != null) && !ID.test(b.id || '')) throw Error();
  if (b.action === 'save' && (!Array.isArray(b.messages) || !b.messages.length || b.messages.length > 200 || b.messages.some((x) => !['user', 'assistant'].includes(x?.papel) || typeof x.conteudo !== 'string' || !x.conteudo.trim() || x.conteudo.length > 20000))) throw Error();
 } catch { return reply(res, 400, { error: m(req, 'chatInvalid') }); }
 try {
  if (b.action === 'list') {
   const { rows } = await q(`select id, titulo, atualizada_em, jsonb_array_length(mensagens) as n from conversas where usuario_id = $1 order by atualizada_em desc limit 50`, [user.id]);
   return reply(res, 200, rows.map((c) => ({ id: c.id, titulo: c.titulo, updatedAt: c.atualizada_em, mensagens: c.n })));
  }
  if (b.action === 'open') {
   const { rows } = await q('select id, titulo, mensagens from conversas where id = $1 and usuario_id = $2', [b.id, user.id]);
   if (!rows[0]) return reply(res, 403, { error: m(req, 'chatNotFound') });
   return reply(res, 200, { ...rows[0], mensagens: rows[0].mensagens.map(({ papel, conteudo }) => ({ papel, conteudo })) });
  }
  if (b.action === 'rename') {
   const titulo = b.title.trim().replace(/\s+/g, ' ');
   const { rowCount } = await q('update conversas set titulo = $3, titulo_manual = true where id = $1 and usuario_id = $2', [b.id, user.id, titulo]);
   if (!rowCount) return reply(res, 403, { error: m(req, 'chatNotFound') });
   return reply(res, 200, { id: b.id, titulo });
  }
  if (b.action === 'delete') {
   const { rowCount } = await q('delete from conversas where id = $1 and usuario_id = $2', [b.id, user.id]);
   if (!rowCount) return reply(res, 403, { error: m(req, 'chatNotFound') });
   return reply(res, 200, { id: b.id, deleted: true });
  }
  // Horário de cada mensagem (só para o painel admin): mantém o de mensagens já salvas iguais.
  const agora = new Date().toISOString();
  let antes = [];
  if (b.id) antes = (await q('select mensagens from conversas where id = $1 and usuario_id = $2', [b.id, user.id])).rows[0]?.mensagens || [];
  const mensagens = b.messages.map(({ papel, conteudo }, i) => ({ papel, conteudo, em: antes[i]?.papel === papel && antes[i]?.conteudo === conteudo && antes[i]?.em ? antes[i].em : agora }));
  const titulo = (mensagens.find((x) => x.papel === 'user')?.conteudo || 'Conversa').slice(0, 80);
  if (b.id) {
   const { rowCount } = await q('update conversas set titulo = case when titulo_manual then titulo else $3 end, mensagens = $4, atualizada_em = now() where id = $1 and usuario_id = $2', [b.id, user.id, titulo, JSON.stringify(mensagens)]);
   if (!rowCount) return reply(res, 403, { error: m(req, 'chatNotFound') });
   return reply(res, 200, { id: b.id });
  }
  const id = randomUUID();
  await q('insert into conversas (id, usuario_id, titulo, mensagens) values ($1, $2, $3, $4)', [id, user.id, titulo, JSON.stringify(mensagens)]);
  return reply(res, 200, { id });
 } catch (e) {
  console.error('[2doctor] conversas', e?.message);
  return reply(res, 503, { error: m(req, 'fail') });
 }
}
