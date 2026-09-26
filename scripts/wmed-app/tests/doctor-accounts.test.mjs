// Contas próprias do 2Doctor. Precisa de um Postgres de teste descartável:
//   TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/doctor2_teste node --test tests/doctor-accounts.test.mjs
// Sem a variável, os testes são pulados (o restante da suíte não depende de banco).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';

const URL_TESTE = process.env.TEST_DATABASE_URL;
const skip = !URL_TESTE && 'TEST_DATABASE_URL ausente';
let db, accounts, store, academicMod;
const ORIGIN = 'https://www.2doctor.ai';

function req({ method = 'POST', body, cookie = '', url = '/api/wmed/auth', origin = ORIGIN } = {}) {
 return { method, url, body, headers: { origin, 'x-wmed-request': '1', cookie, 'x-forwarded-for': randomBytes(4).join('.') }, socket: {} };
}
function res() {
 const r = Object.assign(new EventEmitter(), { statusCode: 200, headers: {}, out: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, writeHead(s, h) { this.statusCode = s; for (const [k, v] of Object.entries(h || {})) this.setHeader(k, v); }, write(t) { this.out += t; }, end(t = '') { this.out += t; this.ended = true; } });
 Object.defineProperty(r, 'data', { get() { try { return JSON.parse(this.out); } catch { return null; } } });
 return r;
}
const cookieOf = (r) => String([].concat(r.headers['set-cookie'] || [])[0] || '').split(';')[0];
async function signup(email, nome = 'Pessoa Teste') {
 const r = res();
 await accounts.auth(req({ body: { action: 'criar', nome, email, password: 'senha-de-teste-1', locale: 'pt' } }), r);
 return { r, cookie: cookieOf(r) };
}

test.before(async () => {
 if (skip) return;
 process.env.DATABASE_URL = URL_TESTE;
 process.env.PUBLIC_ORIGIN = ORIGIN;
 process.env.TWO_DOCTOR_SERVICE_KEY = 'chave-de-servico-de-teste-com-32-caracteres';
 delete process.env.RESEND_API_KEY;
 db = await import('../server/db.mjs');
 await db.q('drop table if exists uso_diario, conversas, casos, tokens_email, sessoes, usuarios cascade').catch(() => {});
 await db.closeDb();
 accounts = await import('../server/accounts.mjs');
 store = await import('../server/doctor-store.mjs');
 academicMod = await import('../server/academic.mjs');
});
test.after(async () => { if (!skip) await db.closeDb(); });

test('cria conta, recusa e-mail repetido e entra só com a senha certa', { skip }, async () => {
 const { r, cookie } = await signup('Pessoa@Exemplo.com');
 assert.equal(r.statusCode, 201);
 assert.equal(r.data.user.conta, '2doctor');
 assert.match(cookie, /^__Host-2d_sessao=/);
 assert.match(String(r.headers['set-cookie']), /HttpOnly; Secure; SameSite=Lax/);
 const again = await signup('pessoa@exemplo.com');
 assert.equal(again.r.statusCode, 409);
 const wrong = res();
 await accounts.auth(req({ body: { email: 'pessoa@exemplo.com', password: 'outra-senha-9', locale: 'pt' } }), wrong);
 assert.equal(wrong.statusCode, 401);
 const ok = res();
 await accounts.auth(req({ body: { email: 'PESSOA@exemplo.com', password: 'senha-de-teste-1' } }), ok);
 assert.equal(ok.statusCode, 200);
 const me = res();
 await accounts.auth(req({ method: 'GET', cookie: cookieOf(ok) }), me);
 assert.equal(me.data.authenticated, true);
 assert.equal(me.data.user.email, 'pessoa@exemplo.com');
 const { rows } = await db.q('select senha_hash from usuarios where email = $1', ['pessoa@exemplo.com']);
 assert.match(rows[0].senha_hash, /^scrypt\$/);
 assert.ok(!rows[0].senha_hash.includes('senha-de-teste-1'));
});

test('recusa pedido de outra origem e sessão inválida', { skip }, async () => {
 const r = res();
 await accounts.auth(req({ origin: 'https://evil.example', body: { action: 'criar', nome: 'X', email: 'x@exemplo.com', password: 'senha-de-teste-1' } }), r);
 assert.equal(r.statusCode, 403);
 const me = res();
 await accounts.auth(req({ method: 'GET', cookie: '__Host-2d_sessao=' + 'a'.repeat(43) }), me);
 assert.equal(me.data.authenticated, false);
});

test('esqueci a senha não revela se o e-mail existe; link de redefinição vale uma vez', { skip }, async () => {
 await signup('redefinir@exemplo.com');
 const a = res(), b = res();
 await accounts.auth(req({ body: { action: 'esqueci', email: 'redefinir@exemplo.com' } }), a);
 await accounts.auth(req({ body: { action: 'esqueci', email: 'naoexiste@exemplo.com' } }), b);
 assert.equal(a.statusCode, 200); assert.deepEqual(a.data, b.data);
 const token = randomBytes(32).toString('base64url');
 const { rows } = await db.q('select id from usuarios where email = $1', ['redefinir@exemplo.com']);
 await db.q(`insert into tokens_email (token_hash, usuario_id, tipo, expira_em) values ($1, $2, 'redefinir', now() + interval '1 hour')`, [createHash('sha256').update(token).digest('hex'), rows[0].id]);
 const r = res();
 await accounts.auth(req({ body: { action: 'redefinir', token, password: 'nova-senha-123' } }), r);
 assert.equal(r.statusCode, 200); assert.equal(r.data.authenticated, true);
 const again = res();
 await accounts.auth(req({ body: { action: 'redefinir', token, password: 'nova-senha-456' } }), again);
 assert.equal(again.statusCode, 400);
 const login = res();
 await accounts.auth(req({ body: { email: 'redefinir@exemplo.com', password: 'nova-senha-123' } }), login);
 assert.equal(login.statusCode, 200);
});

const snapshot = (requestId) => ({ requestId, relato: 'Caso fictício: pessoa adulta com tosse seca há três dias, sem febre.', fields: { contexto: '', queixaPrincipal: 'Tosse seca', hma: 'Tosse seca há três dias, sem outros dados disponíveis.', antPessoais: '', habitos: '', antFamiliares: '', sinaisVitais: '', exameFisico: '' }, feedback: { resumo_caso: 'Resumo sintético.' }, quality: null });

test('casos: salvar é idempotente, lista e abre só os da própria conta', { skip }, async () => {
 const a = await signup('casos-a@exemplo.com'), b = await signup('casos-b@exemplo.com');
 const call = async (cookie, body) => { const r = res(); await store.cases(req({ url: '/api/wmed/cases', cookie, body }), r); return r; };
 const s1 = await call(a.cookie, { action: 'save', snapshot: snapshot('aaaa0000-bbbb-cccc-dddd-eeee00000001') });
 const s2 = await call(a.cookie, { action: 'save', snapshot: snapshot('aaaa0000-bbbb-cccc-dddd-eeee00000001') });
 assert.equal(s1.statusCode, 200); assert.equal(s1.data.caso.id, s2.data.caso.id);
 const list = await call(a.cookie, { action: 'list' });
 assert.equal(list.data.casos.length, 1); assert.equal(list.data.paginacao.totalPages, 1);
 const open = await call(a.cookie, { action: 'open', id: s1.data.caso.id });
 assert.equal(open.data.caso.feedback.resumo_caso, 'Resumo sintético.');
 const other = await call(b.cookie, { action: 'open', id: s1.data.caso.id });
 assert.equal(other.statusCode, 404);
 const anon = await call('', { action: 'list' });
 assert.equal(anon.statusCode, 401);
});

test('conversas: cria, atualiza e protege de outra conta', { skip }, async () => {
 const a = await signup('chat-a@exemplo.com'), b = await signup('chat-b@exemplo.com');
 const call = async (cookie, body) => { const r = res(); await store.history(req({ url: '/api/wmed/history', cookie, body }), r); return r; };
 const msgs = [{ papel: 'user', conteudo: 'Pergunta de teste' }, { papel: 'assistant', conteudo: 'Resposta de teste' }];
 const c = await call(a.cookie, { action: 'save', messages: msgs });
 const u = await call(a.cookie, { action: 'save', id: c.data.id, messages: [...msgs, { papel: 'user', conteudo: 'Outra' }] });
 assert.equal(u.data.id, c.data.id);
 const list = await call(a.cookie, { action: 'list' });
 assert.equal(list.data[0].mensagens, 3); assert.equal(list.data[0].titulo, 'Pergunta de teste');
 const steal = await call(b.cookie, { action: 'save', id: c.data.id, messages: msgs });
 assert.equal(steal.statusCode, 403);
 const open = await call(b.cookie, { action: 'open', id: c.data.id });
 assert.equal(open.statusCode, 403);
});

test('IA vai à API Vytal pela rota de serviço, com a chave e o id da conta 2Doctor', { skip }, async () => {
 const a = await signup('ia@exemplo.com');
 const user = (await db.q('select id from usuarios where email = $1', ['ia@exemplo.com'])).rows[0];
 const r = res();
 const fields = { contexto: '', queixaPrincipal: 'Tosse', hma: 'Tosse seca há três dias, sem febre, em adulto.', antPessoais: '', habitos: '', antFamiliares: '', sinaisVitais: '', exameFisico: '' };
 let seen;
 await academicMod.academic(req({ url: '/api/wmed/academic', cookie: a.cookie, body: { action: 'structure', payload: { relato: 'Relato fictício de tosse seca há três dias.' } } }), r, {
  identify: accounts.identify, allow: (q) => accounts.sameSite(q),
  fetchImpl: async (url, opts) => { seen = { url, headers: opts.headers }; return Response.json({ campos: fields }); },
 });
 assert.equal(r.statusCode, 200);
 assert.equal(seen.url, 'https://vytal-api-production.up.railway.app/servico/2doctor/scribe/estruturar');
 assert.equal(seen.headers['X-2Doctor-Usuario'], user.id);
 assert.equal(seen.headers['X-2Doctor-Chave'], process.env.TWO_DOCTOR_SERVICE_KEY);
 assert.equal(seen.headers.Authorization, undefined);
 const anon = res();
 await academicMod.academic(req({ url: '/api/wmed/academic', body: { action: 'structure', payload: { relato: 'Relato fictício de tosse seca há três dias.' } } }), anon, { identify: accounts.identify, allow: () => true, fetchImpl: () => assert.fail('sem conta não chama a API') });
 assert.equal(anon.statusCode, 401);
});

test('teto diário por pessoa', { skip }, async () => {
 await signup('limite@exemplo.com');
 const { rows } = await db.q('select id from usuarios where email = $1', ['limite@exemplo.com']);
 const limit = accounts.DAILY_LIMITS.feedback;
 for (let i = 0; i < limit; i++) assert.equal(await accounts.charge(rows[0].id, 'feedback'), true);
 assert.equal(await accounts.charge(rows[0].id, 'feedback'), false);
 assert.equal(await accounts.charge(rows[0].id, 'chat'), true);
});
