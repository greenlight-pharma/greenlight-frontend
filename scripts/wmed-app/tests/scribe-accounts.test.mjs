// 2Doctor Scribe com banco: teste grátis, registros privados, nota ao vivo, revisão final,
// chave de voz e assinatura separada do Pro. Precisa de um Postgres de teste descartável:
//   TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/doctor2_teste node --test tests/scribe-accounts.test.mjs
// Sem a variável, os testes são pulados. A IA e a voz são sempre falsas (nenhuma chamada de rede).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';

const URL_TESTE = process.env.TEST_DATABASE_URL;
const skip = !URL_TESTE && 'TEST_DATABASE_URL ausente';
const ORIGIN = 'https://www.2doctor.ai';
let db, accounts, scribeMod, billing;

function req({ method = 'POST', body, cookie = '', url = '/api/wmed/scribe', origin = ORIGIN, idioma } = {}) {
 return { method, url, body, headers: { origin, 'x-wmed-request': '1', cookie, 'x-forwarded-for': randomBytes(4).join('.'), ...(idioma ? { 'x-2doctor-idioma': idioma } : {}) }, socket: {} };
}
function res() {
 const r = Object.assign(new EventEmitter(), { statusCode: 200, headers: {}, out: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, writeHead(s, h) { this.statusCode = s; for (const [k, v] of Object.entries(h || {})) this.setHeader(k, v); }, write(t) { this.out += t; }, end(t = '') { this.out += t; this.ended = true; } });
 Object.defineProperty(r, 'data', { get() { try { return JSON.parse(this.out); } catch { return null; } } });
 return r;
}
async function signup(email) {
 const r = res();
 await accounts.auth(req({ url: '/api/wmed/auth', body: { action: 'criar', nome: 'Pessoa Teste', email, password: 'senha-de-teste-1', locale: 'en' } }), r);
 assert.equal(r.statusCode, 201);
 const { rows } = await db.q('select id from usuarios where email = $1', [email]);
 return { cookie: String([].concat(r.headers['set-cookie'] || [])[0] || '').split(';')[0], id: rows[0].id };
}
// IA e voz falsas: guardam os pedidos e devolvem o que o teste mandar.
function fakeAi() {
 const ai = {
  ready: { ai: true, voice: true }, calls: [], keys: 0, fail: false,
  raw: { sections: [], hypotheses: [], questions: [], alerts: [] },
  status() { return { ...this.ready }; },
  async note(request) { this.calls.push(request); if (this.fail) throw Object.assign(Error('AI error (500).'), { status: 502, code: 'AI_UNAVAILABLE' }); return this.raw; },
  async clinicianVoice(turns) { this.turns = turns; return '2'; },
  async voiceKey() { this.keys++; return { api_key: 'temp:falsa', ws: 'wss://voz.exemplo/ws' }; },
 };
 return ai;
}
function setup() {
 const ai = fakeAi();
 const handler = scribeMod.createScribe({ ai });
 const call = async (cookie, body, extra = {}) => { const r = res(); await handler(req({ cookie, body, ...extra }), r); return r; };
 return { ai, call };
}
const START = { action: 'start', template: 'soap', language: 'en', consent: true };
const unthrottle = (id) => db.q(`update scribe_registros set ultima_atualizacao = now() - interval '5 seconds' where id = $1`, [id]);

test.before(async () => {
 if (skip) return;
 // Esquema próprio: os outros arquivos com banco rodam em paralelo e recriam as tabelas deles.
 const pg = (await import('../server/node_modules/pg/lib/index.js')).default;
 const admin = new pg.Client({ connectionString: URL_TESTE });
 await admin.connect();
 await admin.query('drop schema if exists scribe_teste cascade');
 await admin.query('create schema scribe_teste');
 await admin.end();
 process.env.DATABASE_URL = URL_TESTE + (URL_TESTE.includes('?') ? '&' : '?') + 'options=' + encodeURIComponent('-c search_path=scribe_teste');
 process.env.PUBLIC_ORIGIN = ORIGIN;
 delete process.env.RESEND_API_KEY; delete process.env.SCRIBE_TRIAL;
 delete process.env.SCRIBE_ANTHROPIC_API_KEY; delete process.env.SCRIBE_SONIOX_API_KEY;
 db = await import('../server/db.mjs');
 accounts = await import('../server/accounts.mjs');
 scribeMod = await import('../server/scribe.mjs');
 billing = await import('../server/billing.mjs');
});
test.after(async () => { if (!skip) await db.closeDb(); });

test('sem sessão: 401 AUTH_REQUIRED; outra origem: 403; só POST', { skip }, async () => {
 const { call } = setup();
 const anon = await call('', { action: 'status' });
 assert.equal(anon.statusCode, 401); assert.equal(anon.data.code, 'AUTH_REQUIRED');
 const a = await signup('origem@exemplo.com');
 assert.equal((await call(a.cookie, { action: 'status' }, { origin: 'https://evil.example' })).statusCode, 403);
 assert.equal((await call(a.cookie, undefined, { method: 'GET' })).statusCode, 405);
 const bad = await call(a.cookie, { action: 'nope' });
 assert.equal(bad.statusCode, 400); assert.equal(bad.data.code, 'INVALID');
});

test('status: pronto, teste de 3, preferências padrão, modelos no idioma do pedido e preço', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('status@exemplo.com');
 const r = await call(a.cookie, { action: 'status' });
 assert.equal(r.statusCode, 200);
 assert.deepEqual(r.data.ready, { ai: true, voice: true });
 assert.deepEqual(r.data.access, { plan: 'trial', trialLeft: 3, trialTotal: 3 });
 assert.deepEqual(r.data.preferences, { specialty: '', detail: 'balanced', structure: 'prose', vocabulary: 'technical', quotes: false, abbreviations: false, reasoning: true, instructions: '' });
 assert.deepEqual(r.data.templates.map((t) => t.id), ['first-visit', 'follow-up', 'soap']);
 assert.equal(r.data.templates[2].sections[0].title, 'Subjective');
 assert.deepEqual(r.data.price, { monthly: 29, currency: 'USD' });
 assert.equal((await call(a.cookie, { action: 'status' }, { idioma: 'pt' })).data.templates[2].sections[3].title, 'Plano');
 assert.equal((await call(a.cookie, { action: 'status' }, { idioma: 'es' })).data.templates[0].name, 'Primera consulta');
 // Sem as chaves: o status responde "não pronto" e o resto do site segue.
 ai.ready = { ai: false, voice: false };
 const off = await call(a.cookie, { action: 'status' });
 assert.equal(off.statusCode, 200); assert.deepEqual(off.data.ready, { ai: false, voice: false });
 const start = await call(a.cookie, START);
 assert.equal(start.statusCode, 503); assert.equal(start.data.code, 'SCRIBE_NOT_CONFIGURED');
 assert.equal((await db.q('select scribe_testes_usados n from usuarios where id = $1', [a.id])).rows[0].n, 0); // não gastou o teste
 // O usuário da conta expõe "scribe" sem quebrar os campos antigos.
 const me = res(); await accounts.auth(req({ method: 'GET', url: '/api/wmed/auth', cookie: a.cookie }), me);
 assert.equal(me.data.user.scribe, false); assert.equal(me.data.user.plano, 'gratis');
});

test('preferências: salva parcial, mantém o resto e recusa valor inválido', { skip }, async () => {
 const { call } = setup();
 const a = await signup('prefs@exemplo.com');
 const r = await call(a.cookie, { action: 'preferences-save', preferences: { specialty: ' Cardiology ', detail: 'concise', reasoning: false } });
 assert.equal(r.statusCode, 200); assert.equal(r.data.preferences.specialty, 'Cardiology'); assert.equal(r.data.preferences.reasoning, false);
 const again = await call(a.cookie, { action: 'preferences-save', preferences: { structure: 'bullets' } });
 assert.equal(again.data.preferences.detail, 'concise'); assert.equal(again.data.preferences.structure, 'bullets');
 assert.deepEqual((await call(a.cookie, { action: 'status' })).data.preferences, again.data.preferences);
 for (const preferences of [{ detail: 'x' }, { instructions: 'x'.repeat(1001) }, null, 'x']) {
  const bad = await call(a.cookie, { action: 'preferences-save', preferences });
  assert.equal(bad.statusCode, 400); assert.equal(bad.data.code, 'INVALID');
 }
});

test('start: exige consentimento e dados válidos; conta as 3 consultas grátis e depois responde 402', { skip }, async () => {
 const { call } = setup();
 const a = await signup('teste-gratis@exemplo.com');
 for (const body of [{ ...START, consent: false }, { ...START, consent: 'yes' }, { ...START, consent: undefined }, { ...START, template: 'custom' }, { ...START, language: 'fr' }, { ...START, label: 'x'.repeat(81) }, { ...START, context: 'x'.repeat(2001) }, { ...START, label: 5 }]) {
  const bad = await call(a.cookie, body);
  assert.equal(bad.statusCode, 400, JSON.stringify(body).slice(0, 80)); assert.equal(bad.data.code, 'INVALID');
 }
 assert.match((await call(a.cookie, { ...START, consent: false })).data.error, /patient agreed/);
 assert.equal((await call(a.cookie, { action: 'status' })).data.access.trialLeft, 3); // pedido inválido não gasta
 const first = await call(a.cookie, { ...START, template: 'follow-up', language: 'pt-BR', label: ' Sala 2 ', context: ' 62 anos, hipertensa ' });
 assert.equal(first.statusCode, 200);
 const rec = first.data.record;
 assert.match(rec.id, /^[0-9a-f-]{36}$/);
 assert.deepEqual({ label: rec.label, template: rec.template, templateName: rec.templateName, language: rec.language, context: rec.context, status: rec.status, finishedAt: rec.finishedAt, reviewed: rec.reviewed },
  { label: 'Sala 2', template: 'follow-up', templateName: 'Retorno', language: 'pt-BR', context: '62 anos, hipertensa', status: 'live', finishedAt: null, reviewed: false });
 assert.deepEqual(rec.note.map((s) => s.title), ['Motivo do retorno', 'Evolução desde a última consulta', 'Tratamento em uso e adesão', 'Exames trazidos', 'Exame físico', 'Avaliação', 'Conduta']);
 assert.ok(rec.note.every((s) => s.text === ''));
 assert.deepEqual(rec.support, { hypotheses: [], questions: [], alerts: [] }); assert.deepEqual(rec.dialogue, []);
 assert.ok(!Number.isNaN(Date.parse(rec.startedAt))); assert.equal(typeof rec.durationSeconds, 'number');
 assert.deepEqual((await call(a.cookie, { action: 'status' })).data.access, { plan: 'trial', trialLeft: 2, trialTotal: 3 });
 // Duas ao mesmo tempo com 2 restantes: as duas passam; a seguinte recebe 402.
 const both = await Promise.all([call(a.cookie, START), call(a.cookie, START)]);
 assert.deepEqual(both.map((r) => r.statusCode), [200, 200]);
 const over = await call(a.cookie, START);
 assert.equal(over.statusCode, 402); assert.equal(over.data.code, 'SCRIBE_TRIAL_ENDED'); assert.match(over.data.error, /Subscribe to 2Doctor Scribe/);
 assert.equal((await call(a.cookie, START, { idioma: 'pt' })).data.error, 'Suas consultas grátis acabaram. Assine o 2Doctor Scribe para continuar.');
 assert.deepEqual((await call(a.cookie, { action: 'status' })).data.access, { plan: 'none', trialLeft: 0, trialTotal: 3 });
 assert.equal((await db.q('select scribe_testes_usados n from usuarios where id = $1', [a.id])).rows[0].n, 3);
 assert.equal((await db.q('select count(*)::int n from scribe_registros where usuario_id = $1', [a.id])).rows[0].n, 3);
 // A consulta de teste já iniciada continua funcionando depois que o teste acabou.
 assert.equal((await call(a.cookie, { action: 'update', id: rec.id, transcript: 'Clinician: Olá.' })).statusCode, 200);
 // Apagar um registro não devolve a consulta grátis.
 assert.deepEqual((await call(a.cookie, { action: 'delete', id: rec.id })).data, { ok: true });
 assert.equal((await call(a.cookie, START)).statusCode, 402);
});

test('SCRIBE_TRIAL muda o número de consultas grátis; corrida não passa do limite', { skip }, async (t) => {
 process.env.SCRIBE_TRIAL = '1';
 t.after(() => { delete process.env.SCRIBE_TRIAL; });
 const { call } = setup();
 const a = await signup('teste-um@exemplo.com');
 assert.deepEqual((await call(a.cookie, { action: 'status' })).data.access, { plan: 'trial', trialLeft: 1, trialTotal: 1 });
 const race = await Promise.all([call(a.cookie, START), call(a.cookie, START), call(a.cookie, START)]);
 assert.deepEqual(race.map((r) => r.statusCode).sort(), [200, 402, 402]);
 assert.equal((await db.q('select count(*)::int n from scribe_registros where usuario_id = $1', [a.id])).rows[0].n, 1);
 assert.equal(scribeMod.scribeTrial({}), 3); assert.equal(scribeMod.scribeTrial({ SCRIBE_TRIAL: '0' }), 0); assert.equal(scribeMod.scribeTrial({ SCRIBE_TRIAL: 'abc' }), 3); assert.equal(scribeMod.scribeTrial({ SCRIBE_TRIAL: '-2' }), 3);
});

test('assinante do Scribe não gasta o teste; cortesia Pro não dá Scribe; limite de 40 inícios por dia', { skip }, async () => {
 const { call } = setup();
 const a = await signup('assinante@exemplo.com');
 const fim = new Date(Date.now() + 20 * 86400000);
 await db.q(`update usuarios set scribe_status = 'active', scribe_fim = $2, scribe_testes_usados = 3 where id = $1`, [a.id, fim]);
 assert.deepEqual((await call(a.cookie, { action: 'status' })).data.access, { plan: 'scribe', trialLeft: 0, trialTotal: 3, renews: fim.toISOString(), cancels: false });
 assert.equal((await call(a.cookie, START)).statusCode, 200);
 assert.equal((await db.q('select scribe_testes_usados n from usuarios where id = $1', [a.id])).rows[0].n, 3);
 const me = res(); await accounts.auth(req({ method: 'GET', url: '/api/wmed/auth', cookie: a.cookie }), me);
 assert.equal(me.data.user.scribe, true); assert.equal(me.data.user.plano, 'gratis');
 // 40 por dia (UTC): o 41º é barrado com 429.
 await db.q(`update uso_diario set n = 40 where usuario_id = $1 and tipo = 'scribe'`, [a.id]);
 const over = await call(a.cookie, START);
 assert.equal(over.statusCode, 429); assert.equal(over.data.code, 'SCRIBE_LIMIT'); assert.match(over.data.error, /today/);
 // Pro por cortesia segue sem Scribe.
 const b = await signup('cortesia@exemplo.com');
 await db.q(`update usuarios set cortesia_ate = now() + interval '30 days', scribe_testes_usados = 3 where id = $1`, [b.id]);
 const pro = res(); await accounts.auth(req({ method: 'GET', url: '/api/wmed/auth', cookie: b.cookie }), pro);
 assert.equal(pro.data.user.plano, 'pro'); assert.equal(pro.data.user.scribe, false);
 assert.equal((await call(b.cookie, START)).statusCode, 402);
});

test('registros são privados: outra pessoa recebe 404 em tudo', { skip }, async () => {
 const { ai, call } = setup();
 const dona = await signup('dona@exemplo.com'); const outra = await signup('outra@exemplo.com');
 const id = (await call(dona.cookie, START)).data.record.id;
 const tries = [
  { action: 'open', id }, { action: 'voice-key', id }, { action: 'update', id, transcript: 'x' }, { action: 'roles', id, turns: [{ voice: '1', text: 'a' }] },
  { action: 'finish', id, transcript: 'x', dialogue: [] }, { action: 'edit', id, label: 'meu' }, { action: 'delete', id },
 ];
 for (const body of tries) {
  const r = await call(outra.cookie, body);
  assert.equal(r.statusCode, 404, body.action); assert.equal(r.data.code, 'NOT_FOUND');
 }
 assert.equal(ai.calls.length, 0); assert.equal(ai.keys, 0); // nada foi gasto pela tentativa
 assert.deepEqual((await call(outra.cookie, { action: 'list' })).data.records, []);
 const mine = await call(dona.cookie, { action: 'list' });
 assert.deepEqual(Object.keys(mine.data.records[0]).sort(), ['finishedAt', 'id', 'label', 'language', 'startedAt', 'status', 'template']);
 assert.equal(mine.data.records[0].id, id);
 assert.equal((await call(dona.cookie, { action: 'open', id })).data.record.status, 'live');
 for (const bad of ['nao-e-uuid', '00000000-0000-4000-8000-000000000000', undefined])
  assert.equal((await call(dona.cookie, { action: 'open', id: bad })).statusCode, 404);
});

test('chave de voz: configuração por idioma, só para registro em andamento, no máximo 30 por registro', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('voz@exemplo.com');
 await db.q(`update usuarios set scribe_status = 'active' where id = $1`, [a.id]);
 const hints = {};
 for (const language of ['en', 'es', 'pt-BR']) {
  const id = (await call(a.cookie, { ...START, language })).data.record.id;
  const r = await call(a.cookie, { action: 'voice-key', id });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(Object.keys(r.data).sort(), ['api_key', 'config', 'ws']);
  assert.equal(r.data.api_key, 'temp:falsa'); assert.equal(r.data.ws, 'wss://voz.exemplo/ws');
  assert.deepEqual({ ...r.data.config, language_hints: null }, { model: 'stt-rt-v6', audio_format: 'auto', language_hints: null, enable_speaker_diarization: true, context: { general: [{ key: 'domain', value: 'Healthcare' }, { key: 'topic', value: 'Medical consultation' }] } });
  hints[language] = r.data.config.language_hints; hints.last = id;
 }
 assert.deepEqual({ en: hints.en, es: hints.es, 'pt-BR': hints['pt-BR'] }, { en: ['en'], es: ['es'], 'pt-BR': ['pt'] });
 const id = hints.last;
 await db.q('update scribe_registros set chaves_voz = 30 where id = $1', [id]);
 const before = ai.keys;
 const over = await call(a.cookie, { action: 'voice-key', id });
 assert.equal(over.statusCode, 429); assert.equal(over.data.code, 'SCRIBE_LIMIT'); assert.equal(ai.keys, before);
 assert.equal((await call(a.cookie, { action: 'finish', id, transcript: '', dialogue: [] })).statusCode, 200);
 const done = await call(a.cookie, { action: 'voice-key', id });
 assert.equal(done.statusCode, 409); assert.equal(done.data.code, 'ALREADY_FINISHED');
 ai.ready = { ai: true, voice: false };
 const off = await call(a.cookie, { action: 'voice-key', id });
 assert.equal(off.statusCode, 503); assert.equal(off.data.code, 'SCRIBE_NOT_CONFIGURED');
});

test('update: títulos e ordem do modelo forçados, nota anterior enviada, apoio vazio sem "reasoning", limites', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('update@exemplo.com');
 const id = (await call(a.cookie, { ...START, context: 'Known hypertension', label: 'Room 1' })).data.record.id;
 ai.raw = {
  sections: [{ title: 'Plan', text: 'Losartan 50 mg once daily.' }, { title: 'subjective', text: 'Headache for 3 days.' }, { title: 'Made up', text: 'BP 160/100 mmHg.' }],
  hypotheses: [{ name: 'Hypertensive urgency', likelihood: 'medium', supporting: 'BP 160/100 mmHg.', against: 'No end-organ symptoms.' }],
  questions: ['Any visual changes?'], alerts: ['BP 160/100 mmHg'],
 };
 const transcript = 'Clinician: What brings you in?\nPatient: Dor de cabeça há três dias, ação e coração.';
 const r = await call(a.cookie, { action: 'update', id, transcript });
 assert.equal(r.statusCode, 200);
 assert.deepEqual(r.data.note, [{ title: 'Subjective', text: 'Headache for 3 days.' }, { title: 'Objective', text: '' }, { title: 'Assessment', text: 'BP 160/100 mmHg.' }, { title: 'Plan', text: 'Losartan 50 mg once daily.' }]);
 assert.deepEqual(r.data.support, { hypotheses: ai.raw.hypotheses, questions: ['Any visual changes?'], alerts: ['BP 160/100 mmHg'] });
 const sent = ai.calls[0];
 assert.equal(sent.final, false); assert.equal(sent.transcript, transcript); assert.equal(sent.language, 'en'); assert.equal(sent.context, 'Known hypertension'); assert.equal(sent.previous, null);
 assert.deepEqual(sent.sections.map((s) => s.title), ['Subjective', 'Objective', 'Assessment', 'Plan']); assert.equal(sent.preferences.reasoning, true);
 // Mais de uma a cada 2 s: 429, sem chamar a IA.
 const fast = await call(a.cookie, { action: 'update', id, transcript });
 assert.equal(fast.statusCode, 429); assert.equal(fast.data.code, 'SCRIBE_LIMIT'); assert.equal(ai.calls.length, 1);
 // Na seguinte, a nota anterior vai junto; com "reasoning" desligado o apoio sai vazio, diga a IA o que disser.
 await unthrottle(id);
 await call(a.cookie, { action: 'preferences-save', preferences: { reasoning: false } });
 const second = await call(a.cookie, { action: 'update', id, transcript: transcript + '\nClinician: Ok.' });
 assert.equal(second.statusCode, 200);
 assert.deepEqual(second.data.support, { hypotheses: [], questions: [], alerts: [] });
 assert.equal(second.data.note[0].text, 'Headache for 3 days.');
 assert.equal(ai.calls[1].previous.sections[3].text, 'Losartan 50 mg once daily.'); assert.equal(ai.calls[1].previous.questions[0], 'Any visual changes?'); assert.equal(ai.calls[1].preferences.reasoning, false);
 const open = (await call(a.cookie, { action: 'open', id })).data.record;
 assert.deepEqual(open.support, { hypotheses: [], questions: [], alerts: [] }); assert.equal(open.note[3].text, 'Losartan 50 mg once daily.'); assert.equal(open.status, 'live');
 // Falha da IA ao vivo: 502 AI_UNAVAILABLE e a nota salva continua a mesma.
 await unthrottle(id); ai.fail = true;
 const down = await call(a.cookie, { action: 'update', id, transcript });
 assert.equal(down.statusCode, 502); assert.equal(down.data.code, 'AI_UNAVAILABLE'); assert.doesNotMatch(down.data.error, /500/);
 assert.equal((await call(a.cookie, { action: 'open', id })).data.record.note[0].text, 'Headache for 3 days.');
 ai.fail = false;
 // Validação e teto de 1500 atualizações.
 for (const t of ['', '   ', 5, 'x'.repeat(400001)]) assert.equal((await call(a.cookie, { action: 'update', id, transcript: t })).statusCode, 400);
 await db.q('update scribe_registros set atualizacoes = 1500, ultima_atualizacao = null where id = $1', [id]);
 assert.equal((await call(a.cookie, { action: 'update', id, transcript })).statusCode, 429);
 ai.ready = { ai: false, voice: true };
 const off = await call(a.cookie, { action: 'update', id, transcript });
 assert.equal(off.statusCode, 503); assert.equal(off.data.code, 'SCRIBE_NOT_CONFIGURED');
});

test('roles: valida os turnos e devolve o rótulo da voz do profissional', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('roles@exemplo.com');
 const id = (await call(a.cookie, START)).data.record.id;
 const r = await call(a.cookie, { action: 'roles', id, turns: [{ voice: '1', text: 'My knee hurts.' }, { voice: '2', text: 'Since when?' }] });
 assert.equal(r.statusCode, 200); assert.deepEqual(r.data, { clinician: '2' }); assert.equal(ai.turns.length, 2);
 for (const turns of [[], Array(61).fill({ voice: '1', text: 'a' }), [{ voice: 1, text: 'a' }], [{ voice: '1' }], 'x', [{ voice: '', text: 'a' }]])
  assert.equal((await call(a.cookie, { action: 'roles', id, turns })).statusCode, 400);
});

test('finish: revisão final com o modelo maior; guarda o diálogo; depois disso é 409', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('finish@exemplo.com');
 const id = (await call(a.cookie, START)).data.record.id;
 ai.raw = { sections: [{ title: 'Subjective', text: 'Cough for 5 days.' }, { title: 'Objective', text: '' }, { title: 'Assessment', text: '' }, { title: 'Plan', text: 'Chest X-ray ordered.' }], hypotheses: [], questions: ['Fever?'], alerts: [] };
 const dialogue = [{ who: 'clinician', text: 'What brings you in?', extra: 'descartado' }, { who: 'patient', text: 'Tosse há cinco dias.' }, { who: 'other', text: 'x' }, { who: 'unknown', text: '' }];
 for (const body of [{ dialogue: [{ who: 'doctor', text: 'x' }] }, { dialogue: 'x' }, { dialogue: [{ who: 'patient' }] }, { transcript: 5 }, { transcript: 'x'.repeat(400001) }])
  assert.equal((await call(a.cookie, { action: 'finish', id, transcript: 'x', dialogue: [], ...body })).statusCode, 400);
 const r = await call(a.cookie, { action: 'finish', id, transcript: 'Clinician: What brings you in?\nPatient: Tosse há cinco dias.', dialogue });
 assert.equal(r.statusCode, 200);
 const rec = r.data.record;
 assert.equal(rec.status, 'finished'); assert.equal(rec.reviewed, true); assert.ok(rec.finishedAt); assert.ok(rec.durationSeconds >= 0);
 assert.equal(rec.note[0].text, 'Cough for 5 days.'); assert.equal(rec.note[3].text, 'Chest X-ray ordered.'); assert.deepEqual(rec.support.questions, ['Fever?']);
 assert.deepEqual(rec.dialogue, [{ who: 'clinician', text: 'What brings you in?' }, { who: 'patient', text: 'Tosse há cinco dias.' }, { who: 'other', text: 'x' }, { who: 'unknown', text: '' }]);
 assert.equal(ai.calls.at(-1).final, true);
 for (const body of [{ action: 'finish', id, transcript: 'x', dialogue: [] }, { action: 'update', id, transcript: 'x' }]) {
  const again = await call(a.cookie, body);
  assert.equal(again.statusCode, 409, body.action); assert.equal(again.data.code, 'ALREADY_FINISHED');
 }
 assert.equal((await call(a.cookie, { action: 'list' })).data.records[0].status, 'finished');
});

test('finish com falha da IA (ou IA desligada): o registro fica salvo como finalizado, reviewed:false, com a última nota', { skip }, async () => {
 const { ai, call } = setup();
 const a = await signup('finish-falha@exemplo.com');
 const id = (await call(a.cookie, START)).data.record.id;
 ai.raw = { sections: [{ title: 'Subjective', text: 'Live note.' }], hypotheses: [], questions: ['Live question?'], alerts: [] };
 assert.equal((await call(a.cookie, { action: 'update', id, transcript: 'Patient: hi' })).statusCode, 200);
 ai.fail = true;
 const r = await call(a.cookie, { action: 'finish', id, transcript: 'Patient: hi', dialogue: [{ who: 'patient', text: 'hi' }] });
 assert.equal(r.statusCode, 200);
 assert.equal(r.data.record.status, 'finished'); assert.equal(r.data.record.reviewed, false);
 assert.equal(r.data.record.note[0].text, 'Live note.'); assert.deepEqual(r.data.record.support.questions, ['Live question?']);
 assert.deepEqual(r.data.record.dialogue, [{ who: 'patient', text: 'hi' }]);
 const saved = (await call(a.cookie, { action: 'open', id })).data.record;
 assert.equal(saved.status, 'finished'); assert.equal(saved.reviewed, false); assert.equal(saved.note[0].text, 'Live note.');
 // IA desligada no ambiente: também finaliza sem revisão, sem chamar a IA.
 ai.fail = false; ai.ready = { ai: true, voice: true };
 const id2 = (await call(a.cookie, START)).data.record.id;
 ai.ready = { ai: false, voice: false }; const before = ai.calls.length;
 const off = await call(a.cookie, { action: 'finish', id: id2, transcript: 'Patient: hi', dialogue: [] });
 assert.equal(off.statusCode, 200); assert.equal(off.data.record.reviewed, false); assert.equal(ai.calls.length, before);
});

test('edit e delete: o dono corrige rótulo e nota; apagar é definitivo', { skip }, async () => {
 const { call } = setup();
 const a = await signup('edit@exemplo.com');
 const id = (await call(a.cookie, START)).data.record.id;
 const note = [{ title: 'Subjective', text: 'Edited by the clinician.' }, { title: 'Plan', text: '' }];
 const r = await call(a.cookie, { action: 'edit', id, label: ' Bed 4 ', note });
 assert.equal(r.statusCode, 200); assert.equal(r.data.record.label, 'Bed 4'); assert.deepEqual(r.data.record.note, note);
 assert.equal((await call(a.cookie, { action: 'edit', id, label: 'Only label' })).data.record.note[0].text, 'Edited by the clinician.');
 assert.equal((await call(a.cookie, { action: 'edit', id, note: [{ title: 'S', text: 'x' }] })).data.record.label, 'Only label');
 for (const body of [{}, { label: 'x'.repeat(81) }, { note: 'x' }, { note: [{ title: '', text: 'x' }] }, { note: [{ title: 'S' }] }, { note: Array(21).fill({ title: 'S', text: '' }) }, { note: [{ title: 'S', text: 'x'.repeat(20001) }] }])
  assert.equal((await call(a.cookie, { action: 'edit', id, ...body })).statusCode, 400, JSON.stringify(body).slice(0, 60));
 assert.deepEqual((await call(a.cookie, { action: 'delete', id })).data, { ok: true });
 assert.equal((await call(a.cookie, { action: 'open', id })).statusCode, 404);
 assert.equal((await call(a.cookie, { action: 'delete', id })).statusCode, 404);
 assert.equal((await db.q('select count(*)::int n from scribe_registros where id = $1', [id])).rows[0].n, 0);
});

test('consulta aberta há mais de 6 h aparece finalizada (interrompida) ao listar e abrir', { skip }, async () => {
 const { call } = setup();
 const a = await signup('interrompida@exemplo.com');
 const old = (await call(a.cookie, START)).data.record.id;
 const recent = (await call(a.cookie, START)).data.record.id;
 await db.q(`update scribe_registros set iniciado_em = now() - interval '7 hours', ultima_atualizacao = now() - interval '6 hours 30 minutes' where id = $1`, [old]);
 await db.q(`update scribe_registros set iniciado_em = now() - interval '5 hours' where id = $1`, [recent]);
 const list = (await call(a.cookie, { action: 'list' })).data.records;
 assert.equal(list.find((r) => r.id === old).status, 'finished'); assert.ok(list.find((r) => r.id === old).finishedAt);
 assert.equal(list.find((r) => r.id === recent).status, 'live');
 const rec = (await call(a.cookie, { action: 'open', id: old })).data.record;
 assert.equal(rec.status, 'finished'); assert.equal(rec.reviewed, false); assert.equal(rec.interrupted, true);
 assert.ok(rec.durationSeconds >= 1700 && rec.durationSeconds <= 1900); // até a última atualização (30 min)
 assert.equal((await call(a.cookie, { action: 'update', id: old, transcript: 'x' })).statusCode, 409);
 assert.equal((await call(a.cookie, { action: 'voice-key', id: old })).statusCode, 409);
});

test('corpo em pedaços com acentos é lido inteiro; corpo grande demais é recusado', { skip }, async () => {
 const ai = fakeAi(); const handler = scribeMod.createScribe({ ai });
 const a = await signup('corpo@exemplo.com');
 const start = res(); await handler(req({ cookie: a.cookie, body: START }), start);
 const id = start.data.record.id;
 const transcript = 'Patient: coração, ação, ñandú. '.repeat(200);
 const bytes = Buffer.from(JSON.stringify({ action: 'update', id, transcript }));
 const stream = (buffer, size) => { const rq = req({ cookie: a.cookie }); delete rq.body; rq[Symbol.asyncIterator] = async function* () { for (let i = 0; i < buffer.length; i += size) yield buffer.subarray(i, i + size); }; return rq; };
 const r = res(); await handler(stream(bytes, 7), r); // 7 bytes por pedaço: corta caracteres de 2 bytes ao meio
 assert.equal(r.statusCode, 200); assert.equal(ai.calls[0].transcript, transcript);
 const big = res(); await handler(stream(Buffer.alloc(3_000_001, 0x20), 65536), big);
 assert.equal(big.statusCode, 400); assert.equal(big.data.code, 'INVALID');
});

// ---- assinatura ----
function stripeFake(calls) {
 return async (url, opts = {}) => {
  calls.push({ url, body: opts.body ? Object.fromEntries(new URLSearchParams(opts.body)) : null });
  if (url.includes('/prices?')) return Response.json({ data: [{ id: url.includes('2doctor_scribe_mensal') ? 'price_scribe' : 'price_pro' }] });
  if (url.endsWith('/customers')) return Response.json({ id: 'cus_scribe_teste' });
  if (url.endsWith('/checkout/sessions')) return Response.json({ url: 'https://checkout.stripe.com/c/pay/teste' });
  if (url.endsWith('/billing_portal/sessions')) return Response.json({ url: 'https://billing.stripe.com/p/teste' });
  return Response.json({ error: { message: 'inesperado' } }, { status: 400 });
 };
}
async function webhook(event) {
 const raw = JSON.stringify(event); const t = Math.floor(Date.now() / 1000);
 const sig = createHmac('sha256', 'whsec_scribe').update(`${t}.${raw}`).digest('hex');
 const rq = Object.assign(new EventEmitter(), { method: 'POST', url: '/api/wmed/stripe-webhook', headers: { 'stripe-signature': `t=${t},v1=${sig}` } });
 rq[Symbol.asyncIterator] = async function* () { yield raw; };
 const out = res(); await billing.stripeWebhook(rq, out); return out;
}
const fimEm = (dias) => Math.floor(Date.now() / 1000) + dias * 86400;
const subscription = ({ id, customer, status, lookup, produto, usuario, fim = fimEm(30), cancela = false, type = 'customer.subscription.updated' }) => ({
 type, data: { object: { id, customer, status, cancel_at_period_end: cancela, metadata: { ...(usuario ? { usuario_id: usuario } : {}), ...(produto ? { produto } : {}) },
  items: { data: [{ current_period_end: fim, price: { ...(lookup ? { lookup_key: lookup } : {}), recurring: { interval: 'month' } } }] } } },
});
const planRow = async (id) => (await db.q('select plano, assinatura_status, stripe_subscription_id, assinatura_intervalo, scribe_status, scribe_subscription_id, scribe_cancela, scribe_fim, stripe_customer_id from usuarios where id = $1', [id])).rows[0];

test('produto de uma assinatura: pelo lookup_key do preço; sem ele, pelo metadata; o resto é Pro', { skip }, () => {
 const sub = (lookup, produto) => subscription({ id: 's', customer: 'c', status: 'active', lookup, produto }).data.object;
 assert.equal(billing.SCRIBE_PRICE, '2doctor_scribe_mensal');
 assert.equal(billing.productOf(sub('2doctor_scribe_mensal')), 'scribe');
 assert.equal(billing.productOf(sub('2doctor_pro_mensal')), 'pro'); assert.equal(billing.productOf(sub('2doctor_pro_anual')), 'pro');
 assert.equal(billing.productOf(sub('2doctor_pro_mensal', 'scribe')), 'pro'); // o preço manda
 assert.equal(billing.productOf(sub(undefined, 'scribe')), 'scribe'); assert.equal(billing.productOf(sub('outro_preco', 'scribe')), 'scribe');
 assert.equal(billing.productOf(sub(undefined, '2doctor')), 'pro'); assert.equal(billing.productOf(sub()), 'pro'); assert.equal(billing.productOf({}), 'pro');
});

test('checkout do Scribe: preço 2doctor_scribe_mensal, volta em /#scribe-ok; o do Pro segue igual', { skip }, async () => {
 process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
 const a = await signup('checkout-scribe@exemplo.com');
 const calls = []; const fetchImpl = stripeFake(calls);
 const post = async (body) => { const r = res(); await billing.billing(req({ url: '/api/wmed/billing', cookie: a.cookie, body }), r, { fetchImpl }); return r; };
 const r = await post({ action: 'checkout', produto: 'scribe' });
 assert.equal(r.statusCode, 200); assert.match(r.data.url, /checkout\.stripe\.com/);
 assert.ok(calls.some((c) => c.url.endsWith('/prices?lookup_keys[]=2doctor_scribe_mensal&active=true')));
 const session = calls.find((c) => c.url.endsWith('/checkout/sessions')).body;
 assert.equal(session.mode, 'subscription'); assert.equal(session['line_items[0][price]'], 'price_scribe'); assert.equal(session.client_reference_id, a.id);
 assert.equal(session['subscription_data[metadata][produto]'], 'scribe'); assert.equal(session['subscription_data[metadata][usuario_id]'], a.id);
 assert.equal(session.success_url, ORIGIN + '/#scribe-ok'); assert.equal(session.cancel_url, ORIGIN + '/#scribe');
 // Pro, sem "produto": exatamente como antes.
 calls.length = 0;
 assert.equal((await post({ action: 'checkout', intervalo: 'anual' })).statusCode, 200);
 assert.ok(calls.some((c) => c.url.endsWith('/prices?lookup_keys[]=2doctor_pro_anual&active=true')));
 const pro = calls.find((c) => c.url.endsWith('/checkout/sessions')).body;
 assert.equal(pro['line_items[0][price]'], 'price_pro'); assert.equal(pro['subscription_data[metadata][produto]'], '2doctor');
 assert.equal(pro.success_url, ORIGIN + '/#assinatura-ok'); assert.equal(pro.cancel_url, ORIGIN + '/#planos');
 assert.equal((await post({ action: 'checkout' })).statusCode, 400); assert.equal((await post({ action: 'checkout', produto: 'outro', intervalo: 'mensal' })).statusCode, 400);
 // Já assinante do Scribe: 409 no Scribe, mas ainda pode assinar o Pro (e vice-versa).
 await db.q(`update usuarios set scribe_status = 'active' where id = $1`, [a.id]);
 assert.equal((await post({ action: 'checkout', produto: 'scribe' })).statusCode, 409);
 assert.equal((await post({ action: 'checkout', intervalo: 'mensal' })).statusCode, 200);
 await db.q(`update usuarios set scribe_status = null, plano = 'pro', assinatura_status = 'active' where id = $1`, [a.id]);
 assert.equal((await post({ action: 'checkout', intervalo: 'mensal' })).statusCode, 409);
 assert.equal((await post({ action: 'checkout', produto: 'scribe' })).statusCode, 200);
 assert.equal((await post({ action: 'portal' })).data.url, 'https://billing.stripe.com/p/teste');
 const get = res(); await billing.billing(req({ method: 'GET', url: '/api/wmed/billing', cookie: a.cookie }), get);
 assert.equal(get.data.plano, 'pro'); assert.equal(get.data.scribe, false); assert.equal(get.data.cliente, true);
});

test('webhook: Scribe e Pro não se sobrescrevem (rota pelo lookup_key, com metadata de reserva)', { skip }, async () => {
 process.env.STRIPE_WEBHOOK_SECRET = 'whsec_scribe';
 const a = await signup('webhook-scribe@exemplo.com');
 await db.q(`update usuarios set stripe_customer_id = 'cus_dois' where id = $1`, [a.id]);
 const base = { customer: 'cus_dois', usuario: a.id };
 // 1) Pro mensal ativo.
 assert.equal((await webhook(subscription({ ...base, id: 'sub_pro', status: 'active', lookup: '2doctor_pro_mensal', produto: '2doctor' }))).statusCode, 200);
 let u = await planRow(a.id);
 assert.deepEqual([u.plano, u.assinatura_status, u.stripe_subscription_id, u.assinatura_intervalo, u.scribe_status, u.scribe_subscription_id], ['pro', 'active', 'sub_pro', 'mensal', null, null]);
 // 2) Scribe ativo: só os campos scribe_*.
 const fim = fimEm(30);
 assert.equal((await webhook(subscription({ ...base, id: 'sub_scribe', status: 'active', lookup: '2doctor_scribe_mensal', fim, type: 'customer.subscription.created' }))).statusCode, 200);
 u = await planRow(a.id);
 assert.deepEqual([u.plano, u.assinatura_status, u.stripe_subscription_id, u.scribe_status, u.scribe_subscription_id, u.scribe_cancela], ['pro', 'active', 'sub_pro', 'active', 'sub_scribe', false]);
 assert.equal(new Date(u.scribe_fim).getTime(), fim * 1000);
 const me = res(); await accounts.auth(req({ method: 'GET', url: '/api/wmed/auth', cookie: a.cookie }), me);
 assert.equal(me.data.user.plano, 'pro'); assert.equal(me.data.user.scribe, true);
 // 3) Pro cancelado: Scribe continua.
 await webhook(subscription({ ...base, id: 'sub_pro', status: 'canceled', lookup: '2doctor_pro_mensal', type: 'customer.subscription.deleted' }));
 u = await planRow(a.id);
 assert.deepEqual([u.plano, u.assinatura_status, u.scribe_status, u.scribe_subscription_id], ['gratis', 'canceled', 'active', 'sub_scribe']);
 // 4) Scribe marcado para cancelar no fim do período, depois cancelado: Pro (reativado) não muda.
 await webhook(subscription({ ...base, id: 'sub_pro2', status: 'active', lookup: '2doctor_pro_anual' }));
 await webhook(subscription({ ...base, id: 'sub_scribe', status: 'active', lookup: '2doctor_scribe_mensal', cancela: true }));
 assert.equal((await planRow(a.id)).scribe_cancela, true);
 await webhook(subscription({ ...base, id: 'sub_scribe', status: 'canceled', lookup: '2doctor_scribe_mensal', type: 'customer.subscription.deleted' }));
 u = await planRow(a.id);
 assert.deepEqual([u.plano, u.assinatura_status, u.stripe_subscription_id, u.scribe_status], ['pro', 'active', 'sub_pro2', 'canceled']);
 const fora = res(); await accounts.auth(req({ method: 'GET', url: '/api/wmed/auth', cookie: a.cookie }), fora);
 assert.equal(fora.data.user.plano, 'pro'); assert.equal(fora.data.user.scribe, false);
 // 5) Sem lookup_key no preço: vale o metadata "produto".
 await webhook(subscription({ ...base, id: 'sub_scribe2', status: 'trialing', produto: 'scribe' }));
 u = await planRow(a.id);
 assert.deepEqual([u.plano, u.stripe_subscription_id, u.scribe_status, u.scribe_subscription_id], ['pro', 'sub_pro2', 'trialing', 'sub_scribe2']);
 // 6) Evento atrasado da assinatura antiga do Scribe não derruba a atual.
 await webhook(subscription({ ...base, id: 'sub_scribe', status: 'canceled', lookup: '2doctor_scribe_mensal', type: 'customer.subscription.deleted' }));
 u = await planRow(a.id);
 assert.deepEqual([u.scribe_status, u.scribe_subscription_id], ['trialing', 'sub_scribe2']);
});

test('webhook do Scribe para cliente ainda não ligado: acha pelo usuario_id e não cria Pro', { skip }, async () => {
 process.env.STRIPE_WEBHOOK_SECRET = 'whsec_scribe';
 const a = await signup('webhook-novo@exemplo.com');
 await webhook(subscription({ customer: 'cus_novo', usuario: a.id, id: 'sub_n', status: 'active', lookup: '2doctor_scribe_mensal' }));
 const u = await planRow(a.id);
 assert.deepEqual([u.stripe_customer_id, u.plano, u.assinatura_status, u.stripe_subscription_id, u.scribe_status], ['cus_novo', 'gratis', null, null, 'active']);
 const { call } = setup();
 assert.equal((await call(a.cookie, { action: 'status' })).data.access.plan, 'scribe');
});
