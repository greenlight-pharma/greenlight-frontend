// 2Doctor Scribe: regras puras do cliente (junção de falas, papéis, transcrição, reconexão, exemplo, textos).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
 createConversation, receive, roleOf, assignRole, swapRole, buildTranscript, dropHalfWord, flushPartial, dialogueForFinish,
 rolesRequest, applyClinician, parseVoiceMessage, voiceId, sessionOf, lastSession, snapshot, liveKey, clock, noteText, hasSupport,
 reconnectDelay, MAX_RECONNECTS, uiStrings,
} from '../shared/scribe-client.mjs';
import { EXAMPLE_TURNS, EXAMPLE_SECTIONS, exampleTurns, exampleProgress, exampleChunks, exampleStrings } from '../shared/scribe-example.mjs';
import { catalog, translate } from '../shared/i18n/catalog.mjs';
import { navigationGroups, searchNavigation } from '../shared/product.mjs';
import { patientAllowsModule } from '../shared/patient-mode.mjs';

const piece = (voice, text, final = true) => ({ voice, text, final });

test('final pieces join into turns per speaker; partial pieces replace the previous partial', () => {
 const c = createConversation();
 receive(c, [piece('1-1', ' Good'), piece('1-1', ' morning.'), piece('1-2', ' Hi', false)]);
 assert.deepEqual(c.dialogue.map((t) => [t.who, t.text]), [['clinician', 'Good morning.']]);
 assert.deepEqual(c.partial.map((t) => t.text), ['Hi']);
 receive(c, [piece('1-2', ' Hi, doctor.'), piece('1-2', ' My', false), piece('1-2', ' che', false)]);
 assert.deepEqual(c.dialogue.map((t) => [t.who, t.text]), [['clinician', 'Good morning.'], ['patient', 'Hi, doctor.']]);
 assert.deepEqual(c.partial.map((t) => t.text), ['My che']);
 receive(c, [piece('1-1', '   ', true)]);
 assert.equal(c.dialogue.length, 2, 'blank speech does not open a turn');
 assert.equal(c.partial.length, 0);
});

test('version only moves when something arrives', () => {
 const c = createConversation(); const v = c.version;
 receive(c, []); assert.equal(c.version, v);
 receive(c, [piece('1-1', ' a')]); assert.equal(c.version, v + 1);
});

test('roles: first voice is the clinician, second the patient, others "other"', () => {
 const c = createConversation();
 assert.equal(roleOf(c, '1-1'), 'clinician'); assert.equal(roleOf(c, '1-2'), 'patient'); assert.equal(roleOf(c, '1-3'), 'other');
 assert.equal(roleOf(c, '1-1'), 'clinician');
});

test('tapping a name swaps clinician and patient with two voices and relabels the dialogue', () => {
 const c = createConversation();
 receive(c, [piece('1-1', ' What brings you in?'), piece('1-2', ' Chest pain.')]);
 assert.equal(swapRole(c, '1-1'), true);
 assert.deepEqual(c.dialogue.map((t) => t.who), ['patient', 'clinician']);
 assert.equal(c.manual['1'], true);
 swapRole(c, '1-2');
 assert.deepEqual(c.dialogue.map((t) => t.who), ['clinician', 'patient']);
});

test('with three voices the tap cycles the role and keeps one clinician and one patient', () => {
 const c = createConversation();
 receive(c, [piece('1-1', ' a'), piece('1-2', ' b'), piece('1-3', ' c')]);
 swapRole(c, '1-3'); // other → clinician; the previous clinician becomes other
 assert.deepEqual(c.dialogue.map((t) => t.who), ['other', 'patient', 'clinician']);
 swapRole(c, '1-3'); // clinician → patient; previous patient becomes clinician
 assert.deepEqual(c.dialogue.map((t) => t.who), ['other', 'clinician', 'patient']);
 assert.equal(assignRole(c, '1-3', 'patient'), false);
 assert.equal(assignRole(c, '1-3', 'nurse'), false);
});

test('transcript uses the contract prefixes and drops a trailing half word from the last partial', () => {
 const c = createConversation();
 receive(c, [piece('1-1', ' Any allergies?'), piece('1-2', ' Penicillin.'), piece('1-3', ' He also'), piece('1-1', ' And do you smo', false)]);
 assert.equal(buildTranscript(c), 'Clinician: Any allergies?\nPatient: Penicillin.\nOther: He also\nClinician: And do you');
 receive(c, [piece('1-1', ' And do you smoke?', false)]);
 assert.match(buildTranscript(c), /Clinician: And do you smoke\?$/);
 receive(c, [piece('1-2', ' Ye', false)]);
 assert.equal(buildTranscript(c).split('\n').length, 3, 'a partial that is only a half word is left out');
 assert.equal(dropHalfWord('one two'), 'one'); assert.equal(dropHalfWord('one two,'), 'one two,'); assert.equal(dropHalfWord('one'), '');
});

test('ending moves partial speech into the dialogue and sends who/text only', () => {
 const c = createConversation();
 receive(c, [piece('1-1', ' Hello.'), piece('1-2', ' I feel dizzy', false)]);
 flushPartial(c);
 assert.deepEqual(dialogueForFinish(c), [{ who: 'clinician', text: 'Hello.' }, { who: 'patient', text: 'I feel dizzy' }]);
 assert.equal(c.partial.length, 0);
});

test('voice messages: tokens become pieces with the session prefix; markers and errors are handled', () => {
 const m = parseVoiceMessage(JSON.stringify({ tokens: [{ text: ' Hi', speaker: '2', is_final: true }, { text: '<end>', is_final: true }, { text: ' the', is_final: false }], finished: true }), 3);
 assert.deepEqual(m.pieces, [{ voice: '3-2', text: ' Hi', final: true }, { voice: '3-1', text: ' the', final: false }]);
 assert.equal(m.finished, true);
 assert.equal(parseVoiceMessage('{"error_code":402,"error_type":"organization_balance_exhausted","error_message":"x"}', 1).error.type, 'organization_balance_exhausted');
 assert.deepEqual(parseVoiceMessage('not json', 1), { pieces: [], finished: false });
});

test('after a reconnect the new voices get their own roles instead of becoming "other"', () => {
 const c = createConversation();
 receive(c, [piece(voiceId(1, '1'), ' a'), piece(voiceId(1, '2'), ' b')]);
 receive(c, [piece(voiceId(2, '1'), ' c'), piece(voiceId(2, '2'), ' d')]);
 assert.deepEqual(c.dialogue.map((t) => t.who), ['clinician', 'patient', 'clinician', 'patient']);
 // In the new connection the patient spoke first: one tap fixes only that connection.
 swapRole(c, '2-1');
 assert.deepEqual(c.dialogue.map((t) => t.who), ['clinician', 'patient', 'patient', 'clinician']);
 assert.equal(sessionOf('2-1'), '2'); assert.equal(sessionOf('demo-1'), 'demo'); assert.equal(lastSession(c), 2);
 assert.equal(reconnectDelay(1), 1000); assert.equal(reconnectDelay(3), 4000); assert.equal(reconnectDelay(9), 8000); assert.ok(MAX_RECONNECTS >= 3);
});

test('role discovery is asked at 4 and 12 turns per voice session, never after a manual fix', () => {
 const c = createConversation();
 const say = (n) => { for (let i = 0; i < n; i++) receive(c, [piece(c.dialogue.length % 2 ? '1-2' : '1-1', ` turn ${c.dialogue.length}.`)]); };
 say(3); assert.equal(rolesRequest(c, 1), null);
 say(1);
 const first = rolesRequest(c, 1);
 assert.deepEqual(first.voices, ['1-1', '1-2']);
 assert.deepEqual(first.turns[1], { voice: '2', text: 'turn 1.' });
 c.asked[1] = 1;
 assert.equal(rolesRequest(c, 1), null, 'waits for 12 turns');
 assert.equal(applyClinician(c, first, '2'), true);
 assert.deepEqual(c.dialogue.slice(0, 2).map((t) => t.who), ['patient', 'clinician']);
 say(8); assert.ok(rolesRequest(c, 1)); c.asked[1] = 2; assert.equal(rolesRequest(c, 1), null);
 assert.equal(rolesRequest(c, 2), null, 'a new connection starts its own count');
 const d = createConversation(); receive(d, [piece('1-1', ' a'), piece('1-2', ' b'), piece('1-1', ' c'), piece('1-2', ' d')]);
 const request = rolesRequest(d, 1); swapRole(d, '1-1');
 assert.equal(rolesRequest(d, 1), null);
 assert.equal(applyClinician(d, request, '1'), false, 'a late answer never overrides the manual choice');
 const one = createConversation(); receive(one, [piece('1-1', ' a'), piece('1-1', ' b')]);
 assert.equal(rolesRequest(one, 1), null, 'needs two voices');
});

test('progress survives a reload through a snapshot', () => {
 const c = createConversation();
 receive(c, [piece('2-1', ' Hello.'), piece('2-2', ' Hi.'), piece('2-2', ' I', false)]);
 swapRole(c, '2-1');
 const saved = JSON.parse(JSON.stringify(snapshot(c, { seconds: 42 })));
 assert.equal(saved.seconds, 42);
 const back = createConversation(saved);
 assert.deepEqual(back.dialogue, c.dialogue); assert.deepEqual(back.roles, c.roles); assert.equal(back.manual['2'], true);
 assert.equal(back.partial.length, 0); assert.equal(lastSession(back), 2);
 assert.equal(createConversation({ dialogue: 'x' }).dialogue.length, 0);
 assert.equal(createConversation(null).dialogue.length, 0);
 assert.equal(liveKey('abc'), '2doctor-scribe-live:abc');
});

test('copy takes the note only; clock and support helpers', () => {
 const note = [{ title: 'Plan', text: ' ECG now. ' }, { title: 'Exam', text: '' }, { title: 'Assessment', text: 'Possible angina.' }];
 assert.equal(noteText(note, false), 'ECG now.\n\nPossible angina.');
 assert.equal(noteText(note, true), 'Plan\nECG now.\n\nAssessment\nPossible angina.');
 assert.equal(clock(0), '00:00'); assert.equal(clock(125), '02:05');
 assert.equal(hasSupport({ hypotheses: [], questions: [], alerts: [] }), false); assert.equal(hasSupport({ questions: ['x'] }), true); assert.equal(hasSupport(null), false);
});

test('example consultation: about 16 turns, both speakers, and a note that only grows', () => {
 assert.equal(EXAMPLE_TURNS.length, 16);
 const turns = exampleTurns();
 assert.deepEqual([...new Set(turns.map((t) => t.voice))].sort(), ['demo-1', 'demo-2']);
 assert.ok(exampleProgress(0).note.every((s) => !s.text) && !hasSupport(exampleProgress(0).support));
 let previous = exampleProgress(0).note;
 for (let n = 1; n <= 16; n++) {
  const { note, support } = exampleProgress(n);
  assert.deepEqual(note.map((s) => s.title), EXAMPLE_SECTIONS.map(([title]) => title));
  note.forEach((s, i) => assert.ok(s.text.startsWith(previous[i].text), `section ${s.title} at ${n}`));
  for (const h of support.hypotheses) { assert.ok(['high', 'medium', 'low'].includes(h.likelihood)); assert.ok(h.name && h.supporting && h.against); }
  previous = note;
 }
 const end = exampleProgress(99);
 assert.ok(end.note.every((s) => s.text), 'every section is filled at the end');
 assert.equal(end.support.hypotheses.length, 3); assert.equal(end.support.alerts.length, 1);
 assert.equal(exampleProgress(7).support.alerts.length, 0, 'the alert appears only after the rest episode is reported');
 assert.ok(exampleProgress(5).support.questions.some((q) => /repouso/.test(q)) && !exampleProgress(8).support.questions.some((q) => /repouso ou/.test(q)), 'answered questions leave the list');
 // The plan and assessment only enter once the clinician has said them.
 assert.equal(exampleProgress(15).note.at(-1).text, ''); assert.ok(exampleProgress(16).note.at(-1).text);
});

test('example speech arrives in growing chunks ending with the full sentence', () => {
 const chunks = exampleChunks('one two three four five six seven');
 assert.deepEqual(chunks, ['one two three', 'one two three four five six', 'one two three four five six seven']);
 assert.deepEqual(exampleChunks('short'), ['short']);
 // Played through the same pipeline, the 16 turns become the dialogue (the last two belong to the clinician).
 const c = createConversation();
 for (const turn of exampleTurns((text) => translate('en', text))) {
  for (const chunk of exampleChunks(turn.text).slice(0, -1)) receive(c, [piece(turn.voice, ` ${chunk}`, false)]);
  receive(c, [piece(turn.voice, ` ${turn.text}`, true)]);
 }
 assert.equal(c.dialogue.length, 15); assert.equal(c.partial.length, 0);
 assert.match(c.dialogue.at(-1).text, /lungs are clear\. Mr\. Carter/);
 assert.match(buildTranscript(c), /^Clinician: Good morning, Mr\. Carter/);
});

test('every Scribe text has English and Spanish in the catalog', () => {
 const source = readFileSync(new URL('../src/doctor/Scribe.jsx', import.meta.url), 'utf8');
 const literal = [...source.matchAll(/\bt\('((?:[^'\\]|\\.)*)'\)/g)].map((m) => m[1]);
 assert.ok(literal.length > 80);
 for (const key of [...literal, ...uiStrings(), ...exampleStrings(), 'Consulta transcrita e nota pronta', 'Termina em', 'Renova em']) {
  assert.ok(catalog[key], `missing translation: ${key}`);
  assert.notEqual(translate('en', key).trim(), ''); assert.notEqual(translate('es', key).trim(), '');
 }
 assert.equal(translate('en', 'O paciente concordou com a transcrição desta consulta.'), 'The patient agreed to this consultation being transcribed.');
 assert.equal(translate('en', 'Sugestões para apoiar seu raciocínio. Você decide.'), 'Suggestions to support your reasoning. You decide.');
 assert.equal(translate('en', 'Revisão final indisponível; esta é a última versão ao vivo.'), 'Final review unavailable; this is the last live version.');
 // No compliance, accuracy or clearance claims anywhere in the Scribe copy.
 const scribeCopy = [...literal, ...uiStrings(), ...exampleStrings()].flatMap((key) => [key, ...catalog[key]]).join('\n');
 assert.doesNotMatch(scribeCopy, /HIPAA|GDPR|LGPD|FDA|compliant|certified|accurate|precis[ãa]o/i);
});

test('Scribe leads the clinical group and stays out of patient mode', () => {
 assert.equal(navigationGroups.find((g) => g.id === 'plantao').modules[0], 'scribe');
 const found = searchNavigation([{ id: 'scribe', label: 'Scribe', description: 'Consulta transcrita e nota pronta' }], 'scribe');
 assert.equal(found[0].items[0].id, 'scribe');
 assert.equal(patientAllowsModule('scribe'), false);
});
