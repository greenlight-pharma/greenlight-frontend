// Modo paciente: instrução sem dose, triagem de emergência antes do modelo e escolha do modo
// pelo perfil da conta no servidor. Sem banco (o perfil salvo no Postgres fica em doctor-accounts).
import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { once } from 'node:events';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chat } from '../server/vytal-assistant.mjs';
import { createApp } from '../server/railway.mjs';
import { emergencyTriage, emergencyMessage, patientInstruction, perfilEfetivo, modoPaciente, patientAllowsModule, PATIENT_TERMS, QUESTIONS_PROMPT } from '../shared/patient-mode.mjs';
import { PRIVACY, CONTACT_EMAIL } from '../shared/legal.mjs';
import { catalog } from '../shared/i18n/catalog.mjs';

function mock(body) {
 const req = { method: 'POST', body, headers: { origin: 'https://www.2doctor.ai', 'x-wmed-request': '1' } };
 const res = Object.assign(new EventEmitter(), { statusCode: 0, headers: {}, out: '', destroyed: false, setHeader(k, v) { this.headers[k] = v; }, write(t) { this.out += t; }, end(t = '') { this.out += t; }, flushHeaders() {} });
 return [req, res];
}
const caller = (perfil, extra = {}) => async () => ({ id: 'u1', headers: { 'X-2Doctor-Chave': 'k', 'X-2Doctor-Usuario': 'u1' }, path: (p) => p.replace(/^\/estudante\/(?:2doctor\/|tutor\/)?/, '/servico/2doctor/'), perfil, ...extra });
const sse = (text = 'Explicação simples.') => new Response(`data: ${JSON.stringify({ t: text })}\n\ndata: {"done":true}\n\n`, { headers: { 'Content-Type': 'text/event-stream' } });
async function run({ perfil, body, upstream = async () => sse(), charge }) {
 const [req, res] = mock({ locale: 'en', country: 'global', ...body });
 let seen = null;
 await chat(req, res, { twoDoctorEnabled: true, allow: () => true, identify: caller(perfil, charge ? { charge } : {}), fetchImpl: async (url, opts) => { seen = { url, body: JSON.parse(opts.body) }; return upstream(); } });
 return { res, seen, deltas: [...res.out.matchAll(/event: delta\ndata: (.*)\n/g)].map((m) => JSON.parse(m[1]).text) };
}

test('triagem de emergência reconhece sinais de alarme em EN/ES/PT', () => {
 const cases = {
  chest: ['I have chest pain and sweating', 'Tengo dolor en el pecho desde hace una hora', 'Estou com dor no peito forte'],
  breathing: ["My mom can't breathe well", 'No puedo respirar bien', 'Não consigo respirar direito'],
  stroke: ['His face is drooping and he has slurred speech', 'Tiene debilidad en un lado del cuerpo', 'Meu pai está com a fala enrolada e boca torta'],
  fainting: ['She fainted at home', 'Mi hijo se desmayó', 'Minha avó desmaiou agora'],
  bleeding: ['There is heavy bleeding after surgery', 'Tengo un sangrado abundante', 'Sangramento intenso depois do parto'],
  suicide: ['I want to kill myself', 'Estoy pensando en quitarme la vida', 'Tenho pensado em suicídio'],
  allergy: ['My throat is swelling after a bee sting', 'Se me está cerrando la garganta', 'Minha garganta está fechando depois do remédio'],
  seizure: ['My son is having a seizure', 'Mi hija está convulsionando', 'Meu filho teve uma convulsão agora'],
  babyFever: ['My 2 month old baby has a fever of 39', 'Mi bebé tiene fiebre alta', 'Meu bebê está com febre de 39'],
 };
 for (const [kind, texts] of Object.entries(cases)) for (const text of texts) {
  const r = emergencyTriage(text);
  assert.ok(r?.kinds.includes(kind), `${kind}: ${text}`);
 }
 assert.equal(emergencyTriage('I want to kill myself').suicide, true);
 // Perguntas de entendimento, sem sinal agudo, não disparam.
 for (const calm of ['What does high LDL cholesterol mean?', '¿Qué significa hemoglobina A1c?', 'O que é AVC? Meu pai teve um no ano passado.', 'What should I ask my doctor about thyroid tests?', 'Explique meu exame de sangue']) assert.equal(emergencyTriage(calm), null, calm);
});

test('mensagem fixa de emergência traz os números locais; suicídio inclui 988', () => {
 const en = emergencyMessage({ kinds: ['chest'], suicide: false }, 'en');
 for (const n of ['911', '999', '112', '192', 'local emergency number']) assert.ok(en.includes(n), n);
 assert.ok(!en.includes('988'));
 const s = emergencyMessage({ kinds: ['suicide'], suicide: true }, 'en');
 assert.match(s, /988/); assert.match(s, /Get help now|help is available now/);
 assert.ok(s.indexOf('988') < s.indexOf('911'), 'apoio de crise vem primeiro');
 assert.match(emergencyMessage({ kinds: ['chest'], suicide: false }, 'es'), /número de emergencias local/);
 assert.match(emergencyMessage({ kinds: ['suicide'], suicide: true }, 'pt-BR'), /188.*192|192.*188/s);
 assert.match(emergencyMessage({ kinds: ['suicide'], suicide: true }, 'pt-BR'), /988/);
});

test('instrução de paciente: linguagem simples, sem dose nem prescrição, perguntas para o médico', () => {
 const p = patientInstruction();
 assert.ok(p.length < 3300, `cabe no limite de 4.000 da API com o prefixo de idioma (${p.length})`);
 assert.match(p, /8th-grade reading level/);
 assert.match(p, /Never: give a medicine dose, amount or schedule/);
 assert.match(p, /start, stop, skip, switch, increase or decrease any medicine/);
 assert.match(p, /prescription/); assert.match(p, /definitive diagnosis/);
 assert.match(p, /talk with their doctor/);
 assert.match(p, /Questions to ask your doctor/); assert.match(p, /3 to 5/);
 assert.match(p, /do not read an image of an exam .* as a report/);
 // Nenhum exemplo de dose dentro da própria instrução.
 assert.doesNotMatch(p, /\d+\s?(mg|mcg|µg|g|ml|mL|UI|IU|units?)\b/i);
 for (const l of ['pt-BR', 'en', 'es']) assert.ok(QUESTIONS_PROMPT[l].length > 20);
});

test('perfil: conta antiga sem perfil segue profissional; navegador só restringe', () => {
 assert.equal(perfilEfetivo(null), 'profissional');
 assert.equal(perfilEfetivo('qualquer'), 'profissional');
 assert.equal(perfilEfetivo('paciente'), 'paciente');
 assert.equal(modoPaciente('paciente', 'profissional'), true);
 assert.equal(modoPaciente('profissional', undefined), false);
 assert.equal(modoPaciente('profissional', 'paciente'), true);
 assert.equal(patientAllowsModule('chat'), true);
 for (const hidden of ['scores', 'questoes', 'enamed', 'caso', 'medicacoes', 'comunidade']) assert.equal(patientAllowsModule(hidden), false, hidden);
});

test('servidor escolhe o modo pelo perfil da conta (não pelo navegador)', async () => {
 const pac = await run({ perfil: 'paciente', body: { question: 'What does a high TSH mean?', responseStyle: 'concise' } });
 assert.equal(pac.res.statusCode, 200);
 assert.equal(pac.seen.url, 'https://vytal-api-production.up.railway.app/servico/2doctor/chat-stream');
 assert.equal(pac.seen.body.modo, 'paciente');
 const hist = pac.seen.body.historico.map((m) => m.content).join('\n');
 assert.match(hist, /2Doctor patient mode/);
 assert.doesNotMatch(hist, /presentation preference/, 'sem a preferência profissional');
 assert.equal(pac.seen.body.historico.at(-1).content, 'What does a high TSH mean?');

 // Conta paciente pedindo "profissional" pelo navegador continua paciente.
 const forced = await run({ perfil: 'paciente', body: { question: 'Give me the dose of levothyroxine', perfil: 'profissional' } });
 assert.equal(forced.seen.body.modo, 'paciente');

 // Profissional: nada muda.
 const pro = await run({ perfil: 'profissional', body: { question: 'Explique a insuficiência mitral' } });
 assert.equal(pro.seen.body.modo, undefined);
 assert.doesNotMatch(pro.seen.body.historico.map((m) => m.content).join('\n'), /patient mode/);
 assert.match(pro.seen.body.historico.map((m) => m.content).join('\n'), /presentation preference/);

 // Sem conta própria (modo antigo), o navegador pode pedir o modo paciente (mais restrito).
 const legacy = await run({ perfil: undefined, body: { question: 'What is anemia?', perfil: 'paciente' } });
 assert.equal(legacy.seen.body.modo, 'paciente');

 const bad = await run({ perfil: 'profissional', body: { question: 'valid question', perfil: 'admin' } });
 assert.equal(bad.res.statusCode, 400);
 assert.equal(bad.seen, null);
});

test('paciente com sinal de alarme: mensagem fixa antes do modelo, mesmo sem cota ou com falha', async () => {
 const ok = await run({ perfil: 'paciente', body: { question: 'I have crushing chest pain right now, what is troponin?' } });
 assert.equal(ok.res.statusCode, 200);
 assert.match(ok.deltas[0], /911/); assert.match(ok.deltas[0], /local emergency number/);
 assert.equal(ok.deltas[1], 'Explicação simples.');
 assert.ok(ok.res.out.indexOf('911') < ok.res.out.indexOf('Explicação simples.'));
 assert.match(ok.seen.body.historico.map((m) => m.content).join('\n'), /possible emergency warning signs/);

 const suicide = await run({ perfil: 'paciente', body: { question: 'Quiero morir, no aguanto más', locale: 'es' } });
 assert.match(suicide.deltas[0], /988/);

 const down = await run({ perfil: 'paciente', body: { question: 'My baby is 3 weeks old and has a fever' }, upstream: async () => new Response('x', { status: 503 }) });
 assert.equal(down.res.statusCode, 200);
 assert.match(down.res.out, /911/); assert.match(down.res.out, /event: done/);

 let called = false;
 const [req, res] = mock({ question: 'Estou com dor no peito agora', locale: 'pt-BR', country: 'BR' });
 await chat(req, res, { twoDoctorEnabled: true, allow: () => true, identify: caller('paciente', { charge: async () => false }), fetchImpl: async () => { called = true; return sse(); } });
 assert.equal(called, false, 'sem cota não chama o modelo');
 assert.equal(res.statusCode, 200);
 assert.match(res.out, /192/); assert.match(res.out, /pronto-socorro/);

 // Profissional não recebe a mensagem fixa (o modo dele não muda).
 const pro = await run({ perfil: 'profissional', body: { question: 'Paciente com dor no peito: diagnóstico diferencial' } });
 assert.doesNotMatch(pro.res.out, /911/);
});

test('termos para pacientes e política de privacidade: textos completos nos 3 idiomas', () => {
 for (const l of ['en', 'es', 'pt-BR']) {
  const t = PATIENT_TERMS[l], p = PRIVACY[l];
  assert.ok(t.title && t.accept && t.items.length >= 5, l);
  assert.ok(p.title && p.updated && p.sections.length >= 6, l);
  const all = p.sections.flatMap(([, items]) => items).join(' ');
  assert.match(all, /Stripe/); assert.match(all, /Meta/); assert.ok(all.includes(CONTACT_EMAIL));
 }
 assert.match(PATIENT_TERMS.en.items.join(' '), /not a medical service/);
 assert.match(PATIENT_TERMS.en.items.join(' '), /does not diagnose, prescribe/);
 for (const key of ['Quem é você?', 'Médico ou estudante', 'Paciente ou cuidador', 'Perguntas para o meu médico', 'O 2Doctor explica informações de saúde. Não substitui o seu médico. Em uma emergência, ligue para o número de emergência local.']) assert.ok(catalog[key], key);
 assert.equal(catalog['Perguntas para o meu médico'][0], 'Questions for my doctor');
 assert.equal(catalog['O 2Doctor explica informações de saúde. Não substitui o seu médico. Em uma emergência, ligue para o número de emergência local.'][0], '2Doctor explains health information. It does not replace your doctor. In an emergency, call your local emergency number.');
});

test('servidor publica /privacy e /terms/patients (com apelidos em PT/ES)', async () => {
 const root = mkdtempSync(join(tmpdir(), '2d-legal-')); writeFileSync(join(root, 'index.html'), '<!doctype html>');
 const server = createApp({ root, publicOrigin: '' });
 server.listen(0, '127.0.0.1'); await once(server, 'listening');
 const base = `http://127.0.0.1:${server.address().port}`;
 try {
  const get = (p, h = {}) => fetch(base + p, { headers: h });
  let r = await get('/privacy', { 'accept-language': 'en-US,en;q=0.9' });
  assert.equal(r.status, 200); assert.match(r.headers.get('content-type'), /text\/html/);
  let html = await r.text();
  assert.match(html, /<html lang="en">/); assert.match(html, /Privacy policy/); assert.match(html, /Stripe/); assert.match(html, /mailto:/);
  html = await (await get('/privacidade?lang=pt')).text();
  assert.match(html, /Política de privacidade/); assert.match(html, /lang="pt-BR"/);
  html = await (await get('/privacidad', { 'accept-language': 'es-MX' })).text();
  assert.match(html, /Política de privacidad/);
  html = await (await get('/terms/patients?lang=en')).text();
  assert.match(html, /Terms for patients/); assert.match(html, /not a medical service/);
  assert.equal((await get('/termos-paciente/')).status, 200);
 } finally { server.close(); }
});
