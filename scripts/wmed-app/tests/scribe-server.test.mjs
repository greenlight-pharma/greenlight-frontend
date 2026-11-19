// 2Doctor Scribe: regras puras do servidor (textos para a IA, preferências, formato da nota,
// cliente da IA/voz com fetch falso, página /scribe). Nada aqui usa rede nem banco.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import {
 templates, template, recordLanguage, mergePreferences, DEFAULT_PREFERENCES, describePreferences, notePrompt, shapeNote,
 rolesPrompt, pickClinician, voiceConfig, createScribeAi, SYSTEM, SYSTEM_ROLES, NOTE_SCHEMA, FINAL_REVIEW,
} from '../server/scribe-ai.mjs';
import { scribeLandingHtml } from '../server/landing.mjs';
import { createApp } from '../server/railway.mjs';
import { PIXEL_PRICES } from '../shared/meta-pixel.mjs';
import { SITEMAP_PATHS } from '../shared/seo.mjs';

test('modelos prontos: três, com os mesmos ids nos três idiomas e textos localizados', () => {
 for (const l of ['en', 'es', 'pt-BR']) {
  const list = templates(l);
  assert.deepEqual(list.map((t) => t.id), ['first-visit', 'follow-up', 'soap']);
  assert.deepEqual(list.map((t) => t.sections.length), [11, 7, 4]);
  for (const t of list) for (const s of t.sections) { assert.ok(s.title && s.guidance, `${l}/${t.id}`); }
 }
 assert.equal(template('soap', 'en').sections[0].title, 'Subjective');
 assert.equal(template('soap', 'es').sections[0].title, 'Subjetivo');
 assert.equal(template('follow-up', 'pt-BR').name, 'Retorno');
 assert.equal(template('soap', 'fr').name, 'SOAP note'); // idioma desconhecido cai no inglês
 assert.equal(template('nope', 'en'), null);
 assert.deepEqual(['pt', 'pt-BR', 'es', 'en', 'de'].map(recordLanguage), ['pt-BR', 'pt-BR', 'es', 'en', 'en']);
});

test('preferências: padrão, mescla parcial e recusa de valor inválido', () => {
 assert.equal(DEFAULT_PREFERENCES.reasoning, true);
 assert.deepEqual(mergePreferences({}), DEFAULT_PREFERENCES);
 const saved = mergePreferences({ specialty: '  Cardiology ', detail: 'concise', reasoning: false, ignorado: 1 });
 assert.equal(saved.specialty, 'Cardiology'); assert.equal(saved.detail, 'concise'); assert.equal(saved.reasoning, false); assert.equal(saved.ignorado, undefined);
 assert.equal(mergePreferences({ structure: 'bullets' }, saved).detail, 'concise'); // mantém o que já estava salvo
 for (const bad of [{ detail: 'huge' }, { structure: 'table' }, { vocabulary: 1 }, { quotes: 'yes' }, { reasoning: 0 }, { specialty: 'x'.repeat(81) }, { instructions: 'x'.repeat(1001) }, null, [], 'x'])
  assert.equal(mergePreferences(bad), null, JSON.stringify(bad));
 assert.ok(mergePreferences({ instructions: 'x'.repeat(1000), specialty: 'x'.repeat(80) }));
});

test('texto das preferências: idioma da nota, estilo, instruções e contexto', () => {
 const base = describePreferences(DEFAULT_PREFERENCES, '', 'en');
 assert.match(base, /^Note language: English\./);
 assert.match(base, /Level of detail: balanced\./); assert.match(base, /Structure: prose/); assert.match(base, /Vocabulary: technical/);
 assert.match(base, /Do not use direct quotes/); assert.match(base, /without medical abbreviations/); assert.match(base, /Suggest diagnostic hypotheses, questions and alerts\./);
 assert.doesNotMatch(base, /specialty|Clinician's instructions|Patient context/);
 const full = describePreferences({ specialty: 'Cardiology', detail: 'detailed', structure: 'bullets', vocabulary: 'plain', quotes: true, abbreviations: true, reasoning: false, instructions: ' Always list doses. ' }, ' 62 y, hypertension ', 'pt-BR');
 assert.match(full, /Note language: Brazilian Portuguese\. Write every section and the reasoning support in Brazilian Portuguese\./);
 for (const piece of ["Clinician's specialty: Cardiology.", 'Level of detail: detailed.', 'starting with "- "', 'plain language the patient can understand', "patient's own words", 'abbreviations may be used', 'Do not suggest diagnostic hypotheses, questions or alerts.', "Clinician's instructions: Always list doses.", 'Patient context given before the consultation: 62 y, hypertension'])
  assert.ok(full.includes(piece), piece);
 assert.match(describePreferences(DEFAULT_PREFERENCES, '', 'es'), /Note language: Spanish\./);
});

test('pedido de nota: modelo numerado, transcrição, nota anterior e revisão final só no fim', () => {
 const sections = template('soap', 'en').sections;
 const first = notePrompt({ transcript: ' Clinician: Hello.\nPatient: My chest hurts. ', sections, preferences: DEFAULT_PREFERENCES, language: 'en' });
 assert.match(first, /<note_template>\n1\. Subjective — What the patient reports\.\n2\. Objective/);
 assert.match(first, /<transcript>\nClinician: Hello\.\nPatient: My chest hurts\.\n<\/transcript>/);
 assert.match(first, /<previous_note>\n\(no note yet: this is the first update\)\n<\/previous_note>$/);
 const last = notePrompt({ transcript: 'x', sections, preferences: DEFAULT_PREFERENCES, language: 'en', final: true, previous: { sections: [{ title: 'Subjective', text: 'Chest pain.' }], hypotheses: [], questions: [], alerts: [] } });
 assert.ok(last.includes('"text": "Chest pain."')); assert.ok(last.endsWith(FINAL_REVIEW));
});

test('instruções à IA: regras que não podem se perder e nada de Brasil', () => {
 for (const piece of ['Record only what was said', 'keeps an empty text', 'never write "not reported"', 'in digits with the unit', 'Keep what was already correct in the previous note', 'the clinician decides', 'with no recommended management', '"Clinician:", "Patient:" and "Other:"', 'Write in the note language', 'only if the clinician said it out loud', 'return hypotheses, questions and alerts as empty lists'])
  assert.ok(SYSTEM.includes(piece), piece);
 assert.doesNotMatch(SYSTEM + SYSTEM_ROLES, /Bra[sz]il|Vytal|português/i);
 assert.deepEqual(NOTE_SCHEMA.required, ['sections', 'hypotheses', 'questions', 'alerts']);
 assert.deepEqual(NOTE_SCHEMA.properties.hypotheses.items.properties.likelihood.enum, ['high', 'medium', 'low']);
});

test('formato da nota: títulos e ordem do modelo são forçados; sem "reasoning" o apoio sai vazio', () => {
 const sections = template('soap', 'en').sections;
 const raw = {
  sections: [{ title: 'plan ', text: ' Return in 2 weeks. ' }, { title: 'SUBJECTIVE', text: 'Chest pain for 3 days.' }, { title: 'Invented', text: 'ignored by title' }, { title: 'Whatever', text: 'fourth by position' }],
  hypotheses: [{ name: 'Angina', likelihood: 'high', supporting: 'Exertional pain.', against: 'No ECG yet.' }, { name: 'GERD', likelihood: 'certain', supporting: 's', against: 'a' }, { name: '' }, null, ...Array(6).fill({ name: 'Extra', likelihood: 'low', supporting: '', against: '' })],
  questions: ['Radiation?', '', 2, 'a', 'b', 'c', 'd'], alerts: ['Chest pain at rest', 'x', 'y', 'z'],
 };
 const on = shapeNote(raw, sections, { ...DEFAULT_PREFERENCES, reasoning: true });
 assert.deepEqual(on.note.map((s) => s.title), ['Subjective', 'Objective', 'Assessment', 'Plan']);
 assert.equal(on.note[0].text, 'Chest pain for 3 days.');
 assert.equal(on.note[1].text, ''); // na posição 1 a IA pôs "SUBJECTIVE": não duplica em Objective
 assert.equal(on.note[2].text, 'ignored by title'); // título desconhecido: vale a posição
 assert.equal(on.note[3].text, 'Return in 2 weeks.');
 assert.equal(on.support.hypotheses.length, 5); assert.equal(on.support.hypotheses[1].likelihood, 'low'); // valor fora da lista vira "low"
 assert.deepEqual(on.support.questions, ['Radiation?', 'a', 'b', 'c']); assert.equal(on.support.alerts.length, 3);
 const off = shapeNote(raw, sections, { ...DEFAULT_PREFERENCES, reasoning: false });
 assert.deepEqual(off.support, { hypotheses: [], questions: [], alerts: [] });
 assert.equal(off.note[3].text, 'Return in 2 weeks.');
 // Resposta vazia ou torta: seções do modelo, todas vazias, sem quebrar.
 for (const broken of [null, {}, { sections: 'x' }, { sections: [null, 3] }])
  assert.deepEqual(shapeNote(broken, sections, DEFAULT_PREFERENCES), { note: sections.map((s) => ({ title: s.title, text: '' })), support: { hypotheses: [], questions: [], alerts: [] } });
 // Título certo ganha da posição; sem título conhecido, vale a posição.
 const byPosition = shapeNote({ sections: [{ title: 'A', text: 'one' }, { title: 'B', text: 'two' }] }, sections, DEFAULT_PREFERENCES);
 assert.deepEqual(byPosition.note.map((s) => s.text), ['one', 'two', '', '']);
});

test('vozes: linhas "Voice N: texto" (até 30) e rótulo devolvido como veio nos turnos', () => {
 const turns = [{ voice: '1', text: 'Good morning, what brings you in?' }, { voice: '2', text: 'My knee hurts.' }];
 assert.equal(rolesPrompt(turns), 'Voice 1: Good morning, what brings you in?\nVoice 2: My knee hurts.');
 assert.equal(rolesPrompt(Array.from({ length: 40 }, (_, i) => ({ voice: '1', text: 't' + i }))).split('\n').length, 30);
 assert.equal(pickClinician('1', turns), '1'); assert.equal(pickClinician('Voice 2', turns), '2'); assert.equal(pickClinician(' 2 ', turns), '2');
 assert.equal(pickClinician('7', turns), ''); assert.equal(pickClinician('the doctor', turns), ''); assert.equal(pickClinician(null, turns), '');
 assert.equal(pickClinician('S2', [{ voice: 'S1', text: '' }, { voice: 'S2', text: '' }]), 'S2');
});

test('configuração de voz por idioma: mensagem inicial da Soniox, sem a chave', () => {
 const base = { model: 'stt-rt-v6', audio_format: 'auto', enable_speaker_diarization: true, context: { general: [{ key: 'domain', value: 'Healthcare' }, { key: 'topic', value: 'Medical consultation' }] } };
 assert.deepEqual(voiceConfig('en'), { ...base, language_hints: ['en'] });
 assert.deepEqual(voiceConfig('es'), { ...base, language_hints: ['es'] });
 assert.deepEqual(voiceConfig('pt-BR'), { ...base, language_hints: ['pt'] });
 assert.equal(voiceConfig('en').api_key, undefined);
});

function fakeFetch(answer) {
 const calls = [];
 const fetchImpl = async (url, opts) => { calls.push({ url: String(url), headers: opts.headers, body: JSON.parse(opts.body) }); return answer(String(url), calls.length); };
 return { calls, fetchImpl };
}
const message = (json, extra = {}) => Response.json({ stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: JSON.stringify(json) }], ...extra });

test('cliente da IA: sem chaves fica "não pronto" e devolve 503 sem chamar a rede', async () => {
 const { calls, fetchImpl } = fakeFetch(() => message({}));
 const ai = createScribeAi({ env: {}, fetchImpl });
 assert.deepEqual(ai.status(), { ai: false, voice: false });
 await assert.rejects(ai.note({ transcript: 'x', sections: [], preferences: DEFAULT_PREFERENCES }), { status: 503, code: 'SCRIBE_NOT_CONFIGURED' });
 await assert.rejects(ai.voiceKey(), { status: 503, code: 'SCRIBE_NOT_CONFIGURED' });
 assert.equal(calls.length, 0);
});

test('cliente da IA: modelo rápido ao vivo, modelo maior na revisão (com beta de recusa), saída em JSON', async () => {
 const raw = { sections: [{ title: 'Subjective', text: 'Pain.' }], hypotheses: [], questions: [], alerts: [] };
 const { calls, fetchImpl } = fakeFetch(() => message(raw));
 const ai = createScribeAi({ env: { SCRIBE_ANTHROPIC_API_KEY: 'chave-falsa' }, fetchImpl });
 assert.deepEqual(ai.status(), { ai: true, voice: false });
 const request = { transcript: 'Patient: pain.', sections: template('soap', 'en').sections, preferences: DEFAULT_PREFERENCES, language: 'en' };
 assert.deepEqual(await ai.note(request), raw);
 assert.deepEqual(await ai.note({ ...request, final: true }), raw);
 const [live, final] = calls;
 assert.equal(live.url, 'https://api.anthropic.com/v1/messages');
 assert.equal(live.headers['x-api-key'], 'chave-falsa'); assert.equal(live.headers['anthropic-version'], '2023-06-01');
 assert.equal(live.body.model, 'claude-haiku-5-5'); assert.equal(live.headers['anthropic-beta'], undefined); assert.equal(live.body.fallbacks, undefined);
 assert.deepEqual(live.body.output_config, { effort: 'low', format: { type: 'json_schema', schema: NOTE_SCHEMA } });
 assert.equal(live.body.system, SYSTEM); assert.equal(live.body.messages[0].role, 'user'); assert.match(live.body.messages[0].content, /<transcript>\nPatient: pain\./);
 assert.equal(final.body.model, 'claude-opus-5-5'); assert.equal(final.headers['anthropic-beta'], 'server-side-fallback-2026-07-01'); assert.equal(final.body.fallbacks, 'default');
 assert.ok(final.body.messages[0].content.endsWith(FINAL_REVIEW));
 // Modelos trocáveis por variável.
 const other = fakeFetch(() => message(raw));
 await createScribeAi({ env: { SCRIBE_ANTHROPIC_API_KEY: 'k', SCRIBE_MODEL_LIVE: 'modelo-a', SCRIBE_MODEL_FINAL: 'modelo-b' }, fetchImpl: other.fetchImpl }).note(request);
 assert.equal(other.calls[0].body.model, 'modelo-a');
});

test('cliente da IA: recusa, corte, erro HTTP, rede e JSON ilegível viram AI_UNAVAILABLE (502)', async () => {
 const request = { transcript: 'x', sections: template('soap', 'en').sections, preferences: DEFAULT_PREFERENCES, language: 'en' };
 const cases = [
  () => message({}, { stop_reason: 'refusal', content: [] }),
  () => message({}, { stop_reason: 'max_tokens' }),
  () => Response.json({ error: { type: 'rate_limit_error' } }, { status: 429 }),
  () => Response.json({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'not json' }] }),
  () => new Response('<html>', { status: 200 }),
  () => { throw Error('network'); },
 ];
 for (const answer of cases) {
  const ai = createScribeAi({ env: { SCRIBE_ANTHROPIC_API_KEY: 'k' }, fetchImpl: fakeFetch(answer).fetchImpl });
  await assert.rejects(ai.note(request), { status: 502, code: 'AI_UNAVAILABLE' });
 }
});

test('cliente de voz: chave temporária de 60 s; a chave real só vai no cabeçalho para a Soniox', async () => {
 const { calls, fetchImpl } = fakeFetch(() => Response.json({ api_key: 'temp:abc', expires_at: 'x' }));
 const ai = createScribeAi({ env: { SCRIBE_SONIOX_API_KEY: 'chave-real' }, fetchImpl });
 assert.deepEqual(await ai.voiceKey(), { api_key: 'temp:abc', ws: 'wss://stt-rt.soniox.com/transcribe-websocket' });
 assert.equal(calls[0].url, 'https://api.soniox.com/v1/auth/temporary-api-key');
 assert.equal(calls[0].headers.Authorization, 'Bearer chave-real');
 assert.deepEqual(calls[0].body, { usage_type: 'transcribe_websocket', expires_in_seconds: 60 });
 const custom = fakeFetch(() => Response.json({ api_key: 't' }));
 assert.equal((await createScribeAi({ env: { SCRIBE_SONIOX_API_KEY: 'k', SCRIBE_SONIOX_API: 'https://voz.exemplo', SCRIBE_SONIOX_WS: 'wss://voz.exemplo/ws' }, fetchImpl: custom.fetchImpl }).voiceKey()).ws, 'wss://voz.exemplo/ws');
 assert.equal(custom.calls[0].url, 'https://voz.exemplo/v1/auth/temporary-api-key');
 for (const answer of [() => Response.json({}, { status: 401 }), () => Response.json({}), () => { throw Error('network'); }])
  await assert.rejects(createScribeAi({ env: { SCRIBE_SONIOX_API_KEY: 'k' }, fetchImpl: fakeFetch(answer).fetchImpl }).voiceKey(), { status: 502, code: 'AI_UNAVAILABLE' });
 // A IA identifica a voz do profissional.
 const roles = fakeFetch(() => message({ clinician: 'Voice 2' }));
 const turns = [{ voice: '1', text: 'My knee hurts.' }, { voice: '2', text: 'Since when?' }];
 assert.equal(await createScribeAi({ env: { SCRIBE_ANTHROPIC_API_KEY: 'k' }, fetchImpl: roles.fetchImpl }).clinicianVoice(turns), '2');
 assert.equal(roles.calls[0].body.system, SYSTEM_ROLES); assert.equal(roles.calls[0].body.messages[0].content, 'Voice 1: My knee hurts.\nVoice 2: Since when?');
});

async function fixture(t, options = {}) {
 const root = await mkdtemp(join(tmpdir(), '2doctor-scribe-'));
 await writeFile(join(root, 'index.html'), '<title>2Doctor</title>');
 const server = createApp({ root, ...options }); server.listen(0, '127.0.0.1'); await once(server, 'listening');
 t.after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); await rm(root, { recursive: true, force: true }); });
 return `http://127.0.0.1:${server.address().port}`;
}

test('página /scribe: 200, inglês, preço, três passos, privacidade verdadeira e CTA para /#scribe', async (t) => {
 const url = await fixture(t, { metaPixelId: '1234567890', landing: () => ({ scribeTrial: 3 }) });
 for (const path of ['/scribe', '/scribe/', '/scribe?utm_source=instagram&fbclid=abc']) {
  const r = await fetch(url + path, { redirect: 'manual' });
  assert.equal(r.status, 200, path); assert.match(r.headers.get('content-type'), /text\/html/);
  const html = await r.text();
  assert.match(html, /<html lang="en">/);
  assert.ok(Buffer.byteLength(html) < 40000, 'página leve');
  assert.doesNotMatch(html, /assets\/index-|type="module"/);
  for (const piece of ['The note writes itself', 'US$ 29', '3 free consultations, then US$ 29/month, cancel anytime.', 'Try 3 consultations free', '<h3>Start</h3>', '<h3>Talk</h3>', '<h3>Review</h3>',
   'A structured note in your template', 'Differential suggestions, questions still to ask and red flags', 'The clinician decides.', 'never store the audio', 'Delete any record', "Ask the patient's consent first",
   'Not available in the United States yet.', 'href="/privacy"', 'href="/terms"', 'rel="canonical" href="https://www.2doctor.ai/scribe"'])
   assert.ok(html.includes(piece), piece);
  // CTA abre o app em /#scribe; o script troca o href para manter a query (UTM, fbclid).
  assert.match(html, /<a class="btn" href="\/#scribe" data-app="scribe">Try 3 consultations free<\/a>/);
  assert.match(html, /function app\(hash\)\{return '\/'\+qs\+\(hash\?'#'\+hash:''\)\}/);
  // Nada de promessa de conformidade, acerto ou registro.
  assert.doesNotMatch(html, /HIPAA|GDPR|LGPD|FDA|CE[- ]mark|% accura|accuracy|complian|certified|cleared/i);
  // Pixel só com consentimento, igual à /start.
  assert.match(html, /var PIXEL="1234567890",CONSENT="2doctor-cookie-consent"/);
  assert.match(html, /fbq\('track','ViewContent',\{content_name:'scribe'\}\)/);
  assert.match(html, /if\(c==='accepted'\)pixel\(\)/);
 }
 const head = await fetch(url + '/scribe', { method: 'HEAD' }); assert.equal(head.status, 200); assert.equal(await head.text(), '');
 assert.equal((await fetch(url + '/scribe', { method: 'POST' })).status, 405);
 // A /start continua igual e os atalhos antigos seguem redirecionando.
 assert.match(await fetch(url + '/start').then((r) => r.text()), /fbq\('track','ViewContent',\{content_name:'landing'\}\)/);
 const pricing = await fetch(url + '/pricing?utm_source=x', { redirect: 'manual' }); assert.equal(pricing.status, 302); assert.equal(pricing.headers.get('location'), '/?utm_source=x#planos');
});

test('página /scribe: número de consultas grátis vem da configuração; sem pixel nada de Meta carrega', async (t) => {
 const url = await fixture(t, { metaPixelId: '', landing: () => ({ scribeTrial: 5 }) });
 const html = await fetch(url + '/scribe').then((r) => r.text());
 assert.match(html, /Try 5 consultations free/); assert.match(html, /5 free consultations, then US\$ 29\/month/); assert.match(html, /var PIXEL=""/);
 assert.match(scribeLandingHtml({ trial: 1 }), /Try 1 consultation free/);
 const none = scribeLandingHtml({ trial: 0 }); assert.doesNotMatch(none, /free consultation/); assert.match(none, /US\$ 29\/month, cancel anytime\./);
 // Sem banco (prévia): a página existe com o padrão de 3; a API do Scribe não.
 const bare = await fixture(t);
 assert.match(await fetch(bare + '/scribe').then((r) => r.text()), /Try 3 consultations free/);
 assert.equal((await fetch(bare + '/api/wmed/scribe', { method: 'POST', body: '{}' })).status, 404);
});

test('preço do Scribe no pixel e /scribe no sitemap, sem mexer nos valores do Pro', () => {
 assert.deepEqual(PIXEL_PRICES, { mensal: 9.99, anual: 79, scribe_mensal: 29 });
 assert.ok(SITEMAP_PATHS.includes('/scribe')); assert.equal(SITEMAP_PATHS[0], '/');
});
