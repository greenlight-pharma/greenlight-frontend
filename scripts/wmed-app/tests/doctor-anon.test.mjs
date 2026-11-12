// Perguntas grátis sem conta (2Doctor). Precisa do mesmo Postgres de teste descartável:
//   TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/doctor2_teste node --test tests/doctor-anon.test.mjs
// Sem a variável, os testes de banco são pulados. A IA é sempre simulada (fetchImpl).
import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { randomBytes, randomUUID } from 'node:crypto';

const URL_TESTE = process.env.TEST_DATABASE_URL;
const skip = !URL_TESTE && 'TEST_DATABASE_URL ausente';
const ORIGIN = 'https://www.2doctor.ai';
let db, anon, chat;

const novoIp = () => [...randomBytes(4)].join('.');
function req({ body = { question: 'What is the first-line treatment for sepsis?' }, cookie = '', ip = novoIp() } = {}) {
 return { method: 'POST', url: '/api/wmed/chat', body, headers: { origin: ORIGIN, 'x-wmed-request': '1', cookie, 'x-real-ip': ip }, socket: {} };
}
function res() {
 const r = Object.assign(new EventEmitter(), { statusCode: 200, headers: {}, out: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, getHeader(k) { return this.headers[k.toLowerCase()]; }, removeHeader(k) { delete this.headers[k.toLowerCase()]; }, write(t) { this.out += t; }, end(t = '') { this.out += t; this.ended = true; } });
 Object.defineProperty(r, 'data', { get() { try { return JSON.parse(this.out); } catch { return null; } } });
 return r;
}
const cookieOf = (r) => String([].concat(r.headers['set-cookie'] || [])[0] || '').split(';')[0];
const okStream = () => new Response('data: {"t":"Resposta simulada"}\n\ndata: {"done":true}\n\n', { headers: { 'content-type': 'text/event-stream' } });
// Uma pergunta anônima pelo mesmo caminho do servidor (identidade anônima + chat com IA simulada).
async function ask({ cookie = '', ip, body, limits, fetchImpl } = {}) {
 const q = req({ cookie, ip, body }), r = res();
 let calls = 0, sent = null;
 await chat(q, r, { twoDoctorEnabled: true, allow: () => true, identify: async () => anon.anonCaller(q, r, limits ? { limits: { ...anon.anonLimits(), ...limits } } : undefined),
  fetchImpl: fetchImpl || (async (url, options) => { calls++; sent = { url, headers: options.headers }; return okStream(); }) });
 return { r, calls, sent, cookie: cookieOf(r) || cookie };
}

test.before(async () => {
 for (const k of ['ANON_FREE_QUESTIONS', 'ANON_IP_DAILY_LIMIT', 'ANON_GLOBAL_DAILY_LIMIT', 'ANON_RATE_PER_MINUTE', 'ANON_COOKIE_SECRET']) delete process.env[k];
 process.env.TWO_DOCTOR_SERVICE_KEY = 'chave-de-servico-de-teste-com-32-caracteres';
 process.env.PUBLIC_ORIGIN = ORIGIN;
 if (URL_TESTE) process.env.DATABASE_URL = URL_TESTE;
 ({ chat } = await import('../server/vytal-assistant.mjs'));
 if (skip) return;
 db = await import('../server/db.mjs');
 anon = await import('../server/anon.mjs');
 await db.q('truncate anon_visitantes, uso_anonimo');
});
test.after(async () => { if (!skip) await db.closeDb(); });

test('limites padrão e leitura das variáveis', { skip }, () => {
 assert.deepEqual(anon.anonLimits({}), { perVisitor: 2, perIp: 6, global: 500, perMinute: 4 });
 assert.deepEqual(anon.anonLimits({ ANON_FREE_QUESTIONS: '0', ANON_IP_DAILY_LIMIT: '10', ANON_GLOBAL_DAILY_LIMIT: '50', ANON_RATE_PER_MINUTE: '9' }), { perVisitor: 0, perIp: 10, global: 50, perMinute: 9 });
 // Valor inválido não abre a porta: volta ao padrão.
 assert.equal(anon.anonLimits({ ANON_FREE_QUESTIONS: 'muitas' }).perVisitor, 2);
 assert.equal(anon.anonLimits({ ANON_FREE_QUESTIONS: '-3' }).perVisitor, 2);
});

test('cookie anônimo: assinado, HttpOnly, e adulteração vira visitante novo', { skip }, () => {
 const q = req(), r = res();
 const caller = anon.anonCaller(q, r);
 const set = String(r.headers['set-cookie']);
 assert.match(set, /^__Host-2d_anon=[0-9a-f-]{36}\.[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000$/);
 const cookie = set.split(';')[0];
 assert.equal(anon.readAnonId({ headers: { cookie } }), caller.id);
 // Cookie existente e válido não é reemitido.
 const r2 = res();
 assert.equal(anon.anonCaller(req({ cookie }), r2).id, caller.id);
 assert.equal(r2.headers['set-cookie'], undefined);
 // Id trocado com a assinatura antiga, assinatura trocada ou sem assinatura: recusado.
 const outro = randomUUID();
 assert.equal(anon.readAnonId({ headers: { cookie: `__Host-2d_anon=${outro}.${cookie.split('.')[1]}` } }), null);
 assert.equal(anon.readAnonId({ headers: { cookie: cookie.slice(0, -2) + 'xx' } }), null);
 assert.equal(anon.readAnonId({ headers: { cookie: `__Host-2d_anon=${outro}` } }), null);
 assert.equal(anon.readAnonId({ headers: {} }), null);
 // A IA recebe a chave de serviço e o id anônimo (UUID), nunca uma conta.
 assert.equal(caller.headers['X-2Doctor-Usuario'], caller.id);
 assert.equal(caller.path('/estudante/2doctor/chat-stream'), '/servico/2doctor/chat-stream');
});

test('2 perguntas grátis por visitante; a 3ª cai no muro sem chamar a IA', { skip }, async () => {
 const ip = novoIp();
 const a = await ask({ ip });
 assert.equal(a.r.statusCode, 200);
 assert.match(a.r.out, /event: done/);
 assert.equal(a.r.headers['x-2doctor-anon-left'], '1');
 assert.match(a.sent.url, /\/servico\/2doctor\/chat-stream$/);
 assert.match(a.sent.headers['X-2Doctor-Usuario'], /^[0-9a-f-]{36}$/);
 const b = await ask({ ip, cookie: a.cookie });
 assert.equal(b.r.statusCode, 200);
 assert.equal(b.r.headers['x-2doctor-anon-left'], '0');
 assert.equal(b.r.headers['set-cookie'], undefined);
 const c = await ask({ ip, cookie: a.cookie });
 assert.equal(c.r.statusCode, 401);
 assert.equal(c.r.data.code, 'AUTH_REQUIRED');
 assert.equal(c.r.data.anon, true);
 assert.equal(c.calls, 0);
 // Continua barrado depois (o total é por visitante, não por dia) e nada foi somado a mais.
 assert.equal((await ask({ ip, cookie: a.cookie })).r.statusCode, 401);
 const id = a.cookie.split('=')[1].split('.')[0];
 assert.equal((await db.q('select n from anon_visitantes where id = $1', [id])).rows[0].n, 2);
});

test('teto diário por IP vale mesmo trocando de cookie', { skip }, async () => {
 const ip = novoIp(), limits = { perIp: 3, perMinute: 0 };
 for (let i = 0; i < 3; i++) assert.equal((await ask({ ip, limits })).r.statusCode, 200, 'pergunta ' + (i + 1));
 const barrado = await ask({ ip, limits });
 assert.equal(barrado.r.statusCode, 401);
 assert.equal(barrado.calls, 0);
 // A pergunta barrada pelo IP não gasta a cota do visitante.
 const id = barrado.cookie.split('=')[1].split('.')[0];
 assert.equal((await db.q('select n from anon_visitantes where id = $1', [id])).rows[0]?.n ?? 0, 0);
 // Outro IP segue livre.
 assert.equal((await ask({ limits })).r.statusCode, 200);
});

test('teto global diário barra todos e não desconta de quem foi barrado', { skip }, async () => {
 const { rows } = await db.q(`select coalesce((select n from uso_anonimo where chave = 'global' and dia = (now() at time zone 'utc')::date), 0) as n`);
 const limits = { global: rows[0].n + 1 };
 assert.equal((await ask({ limits })).r.statusCode, 200);
 const ip = novoIp();
 const barrado = await ask({ ip, limits });
 assert.equal(barrado.r.statusCode, 401);
 assert.equal(barrado.calls, 0);
 // Com o teto de volta, o mesmo visitante ainda tem as 2 perguntas.
 assert.equal((await ask({ ip, cookie: barrado.cookie })).r.headers['x-2doctor-anon-left'], '1');
});

test('rajada por IP: acima do limite por minuto cai no muro', { skip }, async () => {
 const ip = novoIp(), limits = { perMinute: 2, perIp: 50 };
 assert.equal((await ask({ ip, limits })).r.statusCode, 200);
 assert.equal((await ask({ ip, limits })).r.statusCode, 200);
 assert.equal((await ask({ ip, limits })).r.statusCode, 401);
});

test('ANON_FREE_QUESTIONS=0 desliga: sem identidade, sem cookie, muro normal', { skip }, async () => {
 const q = req(), r = res();
 assert.equal(anon.anonCaller(q, r, { limits: { ...anon.anonLimits(), perVisitor: 0 } }), null);
 assert.equal(r.headers['set-cookie'], undefined);
 const x = await ask({ limits: { perVisitor: 0 } });
 assert.equal(x.r.statusCode, 401);
 assert.equal(x.r.data.code, 'AUTH_REQUIRED');
 assert.equal(x.calls, 0);
});

test('visitante sem conta: só chat de texto (arquivo e modo paciente pedem conta, sem gastar cota)', { skip }, async () => {
 const ip = novoIp();
 const arquivo = await ask({ ip, body: { question: 'Explain this file', attachments: [{ kind: 'text', name: 'nota.txt', text: 'Texto.' }] } });
 assert.equal(arquivo.r.statusCode, 401);
 assert.equal(arquivo.r.data.code, 'AUTH_REQUIRED');
 const paciente = await ask({ ip, cookie: arquivo.cookie, body: { question: 'What does my exam mean?', perfil: 'paciente' } });
 assert.equal(paciente.r.statusCode, 401);
 assert.equal(arquivo.calls + paciente.calls, 0);
 assert.equal((await ask({ ip, cookie: arquivo.cookie })).r.headers['x-2doctor-anon-left'], '1');
});

test('falha da IA antes da resposta devolve a pergunta ao visitante', { skip }, async () => {
 const ip = novoIp();
 const falha = await ask({ ip, fetchImpl: async () => Response.json({ error: 'fora do ar' }, { status: 500 }) });
 assert.equal(falha.r.statusCode, 502);
 assert.equal(falha.r.headers['x-2doctor-anon-left'], undefined);
 const semRede = await ask({ ip, cookie: falha.cookie, fetchImpl: async () => { throw Error('rede'); } });
 assert.equal(semRede.r.statusCode, 503);
 const depois = await ask({ ip, cookie: falha.cookie });
 assert.equal(depois.r.statusCode, 200);
 assert.equal(depois.r.headers['x-2doctor-anon-left'], '1');
});

test('o IP não é gravado em claro', { skip }, async () => {
 const ip = '203.0.113.77';
 await ask({ ip });
 const { rows } = await db.q('select chave from uso_anonimo');
 assert.ok(rows.length > 0);
 assert.ok(rows.every((x) => x.chave === 'global' || /^ip:[A-Za-z0-9_-]{32}$/.test(x.chave)));
 assert.ok(!rows.some((x) => x.chave.includes(ip)));
});

test('sem identidade anônima, o chat continua exigindo conta', async () => {
 const r = res();
 await chat(req(), r, { twoDoctorEnabled: true, allow: () => true, identify: async () => null, fetchImpl: () => assert.fail('não deve chamar a IA') });
 assert.equal(r.statusCode, 401);
 assert.equal(r.data.code, 'AUTH_REQUIRED');
});
