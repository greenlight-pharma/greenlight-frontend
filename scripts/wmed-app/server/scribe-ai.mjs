// 2Doctor Scribe: textos enviados à IA (nota + apoio ao raciocínio), modelos de nota prontos e
// clientes da IA (Anthropic, via fetch) e da voz (chave temporária da Soniox). O áudio vai do
// navegador direto para a Soniox; este servidor só recebe texto. Trocável nos testes (createScribeAi
// aceita fetchImpl, e o handler em scribe.mjs aceita um cliente falso).
// Variáveis: SCRIBE_ANTHROPIC_API_KEY, SCRIBE_SONIOX_API_KEY, SCRIBE_MODEL_LIVE, SCRIBE_MODEL_FINAL,
// SCRIBE_SONIOX_API, SCRIBE_SONIOX_WS.

export const LANGUAGES = ['en', 'es', 'pt-BR'];
export const TEMPLATE_IDS = ['first-visit', 'follow-up', 'soap'];
const LANGUAGE_NAME = { en: 'English', es: 'Spanish', 'pt-BR': 'Brazilian Portuguese' };
// Idioma da interface (pt/en/es) → idioma do registro.
export const recordLanguage = (l) => (l === 'pt' || l === 'pt-BR' ? 'pt-BR' : l === 'es' ? 'es' : 'en');

const S = (title, guidance) => ({ title, guidance });
const TEMPLATES = {
 en: {
  'first-visit': { name: 'First visit', sections: [
   S('Identification', 'Name, age, sex and occupation, if stated.'),
   S('Chief complaint', 'The reason for the visit in one sentence, with duration.'),
   S('History of present illness', 'Onset, course, characteristics, relieving and aggravating factors, associated symptoms and relevant negatives.'),
   S('Past medical history', 'Previous illnesses, surgeries, hospital admissions.'),
   S('Current medications', 'Name, dose and frequency; adherence, if discussed.'),
   S('Allergies', 'Substance and reaction; also record when the patient denies allergies.'),
   S('Lifestyle', 'Tobacco, alcohol, physical activity, diet, sleep.'),
   S('Family history', 'Illnesses in first-degree relatives.'),
   S('Review of systems', 'Symptoms from other systems that were asked about, present or denied.'),
   S('Physical examination', 'Vital signs and findings the clinician says out loud.'),
   S('Plan', 'Tests ordered, prescriptions, advice and follow-up actually stated in the visit.'),
  ] },
  'follow-up': { name: 'Follow-up', sections: [
   S('Reason for follow-up', 'Why the patient came back and how long since the last visit.'),
   S('Course since last visit', 'Improvement, worsening or new symptoms.'),
   S('Current treatment and adherence', 'Current medications, whether they are being taken, side effects.'),
   S('Test results', 'Results discussed in the visit, with values and dates.'),
   S('Physical examination', 'Vital signs and findings said out loud.'),
   S('Assessment', 'How the clinician summarized the situation to the patient.'),
   S('Plan', 'Treatment changes, tests ordered and follow-up date actually stated in the visit.'),
  ] },
  soap: { name: 'SOAP note', sections: [
   S('Subjective', 'What the patient reports.'),
   S('Objective', 'Physical examination, vital signs and test results.'),
   S('Assessment', 'Problems and diagnoses discussed in the visit.'),
   S('Plan', 'Management, prescriptions, advice and follow-up actually stated in the visit.'),
  ] },
 },
 es: {
  'first-visit': { name: 'Primera consulta', sections: [
   S('Identificación', 'Nombre, edad, sexo y ocupación, si se dijeron.'),
   S('Motivo de consulta', 'El motivo de la consulta en una frase, con la duración.'),
   S('Enfermedad actual', 'Inicio, evolución, características, factores que alivian o empeoran, síntomas asociados y negativos relevantes.'),
   S('Antecedentes personales', 'Enfermedades previas, cirugías, hospitalizaciones.'),
   S('Medicación actual', 'Nombre, dosis y frecuencia; adherencia, si se comentó.'),
   S('Alergias', 'Sustancia y reacción; registrar también cuando el paciente niega alergias.'),
   S('Hábitos', 'Tabaco, alcohol, actividad física, alimentación, sueño.'),
   S('Antecedentes familiares', 'Enfermedades en familiares de primer grado.'),
   S('Revisión por sistemas', 'Síntomas de otros sistemas por los que se preguntó, presentes o negados.'),
   S('Exploración física', 'Signos vitales y hallazgos que el profesional diga en voz alta.'),
   S('Plan', 'Estudios solicitados, recetas, indicaciones y seguimiento efectivamente dichos en la consulta.'),
  ] },
  'follow-up': { name: 'Seguimiento', sections: [
   S('Motivo del seguimiento', 'Por qué volvió y cuánto tiempo pasó desde la última consulta.'),
   S('Evolución desde la última consulta', 'Mejoría, empeoramiento o síntomas nuevos.'),
   S('Tratamiento actual y adherencia', 'Medicación actual, si la está tomando, efectos adversos.'),
   S('Resultados de estudios', 'Resultados comentados en la consulta, con valores y fechas.'),
   S('Exploración física', 'Signos vitales y hallazgos dichos en voz alta.'),
   S('Evaluación', 'Cómo el profesional resumió la situación al paciente.'),
   S('Plan', 'Ajustes de tratamiento, estudios solicitados y fecha de control efectivamente dichos en la consulta.'),
  ] },
  soap: { name: 'Nota SOAP', sections: [
   S('Subjetivo', 'Lo que el paciente refiere.'),
   S('Objetivo', 'Exploración física, signos vitales y resultados de estudios.'),
   S('Evaluación', 'Problemas y diagnósticos comentados en la consulta.'),
   S('Plan', 'Conducta, recetas, indicaciones y seguimiento efectivamente dichos en la consulta.'),
  ] },
 },
 'pt-BR': {
  'first-visit': { name: 'Primeira consulta', sections: [
   S('Identificação', 'Nome, idade, sexo e ocupação, se ditos.'),
   S('Queixa principal', 'O motivo da consulta em uma frase, com a duração.'),
   S('História da doença atual', 'Início, evolução, características, fatores de melhora e piora, sintomas associados e negativas relevantes.'),
   S('Antecedentes pessoais', 'Doenças prévias, cirurgias, internações.'),
   S('Medicamentos em uso', 'Nome, dose e frequência; adesão, se comentada.'),
   S('Alergias', 'Substância e reação; registrar também quando o paciente nega alergias.'),
   S('Hábitos de vida', 'Tabagismo, álcool, atividade física, alimentação, sono.'),
   S('História familiar', 'Doenças em parentes de primeiro grau.'),
   S('Revisão de sistemas', 'Sintomas de outros sistemas perguntados, presentes ou negados.'),
   S('Exame físico', 'Sinais vitais e achados que o profissional disser em voz alta.'),
   S('Conduta', 'Exames pedidos, prescrições, orientações e retorno efetivamente ditos na consulta.'),
  ] },
  'follow-up': { name: 'Retorno', sections: [
   S('Motivo do retorno', 'Por que voltou e há quanto tempo foi a última consulta.'),
   S('Evolução desde a última consulta', 'Melhora, piora ou sintomas novos.'),
   S('Tratamento em uso e adesão', 'Medicamentos atuais, se está tomando, efeitos colaterais.'),
   S('Exames trazidos', 'Resultados comentados na consulta, com valores e datas.'),
   S('Exame físico', 'Sinais vitais e achados ditos em voz alta.'),
   S('Avaliação', 'Como o profissional resumiu a situação ao paciente.'),
   S('Conduta', 'Ajustes de tratamento, exames pedidos e data de retorno efetivamente ditos na consulta.'),
  ] },
  soap: { name: 'Evolução SOAP', sections: [
   S('Subjetivo', 'O que o paciente relata.'),
   S('Objetivo', 'Exame físico, sinais vitais e resultados de exames.'),
   S('Avaliação', 'Problemas e diagnósticos discutidos na consulta.'),
   S('Plano', 'Conduta, prescrições, orientações e retorno efetivamente ditos na consulta.'),
  ] },
 },
};
/** Modelos de nota prontos no idioma pedido ('en' | 'es' | 'pt-BR'; qualquer outro vira inglês). */
export function templates(language) {
 const set = TEMPLATES[language] || TEMPLATES.en;
 return TEMPLATE_IDS.map((id) => ({ id, name: set[id].name, sections: set[id].sections.map((s) => ({ ...s })) }));
}
export const template = (id, language) => templates(language).find((t) => t.id === id) || null;

// ---- preferências de escrita ----
export const DEFAULT_PREFERENCES = Object.freeze({ specialty: '', detail: 'balanced', structure: 'prose', vocabulary: 'technical', quotes: false, abbreviations: false, reasoning: true, instructions: '' });
const ENUMS = { detail: ['concise', 'balanced', 'detailed'], structure: ['prose', 'bullets'], vocabulary: ['technical', 'plain'] };
const LIMITS = { specialty: 80, instructions: 1000 };
/**
 * Junta o que veio com a base (preferências salvas ou padrão). Devolve null se algum campo
 * enviado for inválido; campos desconhecidos são ignorados.
 */
export function mergePreferences(input, base = DEFAULT_PREFERENCES) {
 if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
 const out = { ...DEFAULT_PREFERENCES, ...base };
 for (const key of Object.keys(DEFAULT_PREFERENCES)) {
  if (!Object.hasOwn(input, key) || input[key] === undefined) continue;
  const v = input[key];
  if (ENUMS[key]) { if (!ENUMS[key].includes(v)) return null; out[key] = v; }
  else if (LIMITS[key]) { if (typeof v !== 'string' || v.trim().length > LIMITS[key]) return null; out[key] = v.trim(); }
  else { if (typeof v !== 'boolean') return null; out[key] = v; }
 }
 return out;
}

// ---- textos para a IA ----
const TEXT = { type: 'string' };
export const NOTE_SCHEMA = {
 type: 'object',
 properties: {
  sections: { type: 'array', items: { type: 'object', properties: { title: TEXT, text: TEXT }, required: ['title', 'text'], additionalProperties: false } },
  hypotheses: {
   type: 'array',
   items: {
    type: 'object',
    properties: { name: TEXT, likelihood: { type: 'string', enum: ['high', 'medium', 'low'] }, supporting: TEXT, against: TEXT },
    required: ['name', 'likelihood', 'supporting', 'against'], additionalProperties: false,
   },
  },
  questions: { type: 'array', items: TEXT },
  alerts: { type: 'array', items: TEXT },
 },
 required: ['sections', 'hypotheses', 'questions', 'alerts'],
 additionalProperties: false,
};
export const ROLES_SCHEMA = { type: 'object', properties: { clinician: TEXT }, required: ['clinician'], additionalProperties: false };

export const SYSTEM = `You are 2Doctor Scribe, a clinical scribe following a consultation while it is happening.

You receive the note template the clinician chose (the sections, in order), their writing preferences, the language the note must be written in, the automatic transcript of the conversation from the start until now, and the note you produced in the previous update. Return the complete, updated note.

About the transcript:
- It comes from speech recognition and contains word errors. Fix obvious medical terms (for example "a ten o lol" is atenolol).
- The "Clinician:", "Patient:" and "Other:" marks were added by an automatic step and are sometimes swapped. When the content contradicts the mark, trust the content.
- The consultation is still in progress: the last sentence may be cut off.
- The transcript may be in a different language from the note, or mix languages. Understand it as spoken and write the note in the note language.

About the note:
- Return exactly the sections of the template, with the same titles and in the same order. Each section follows the guidance given in the template.
- Record only what was said in the consultation. Never infer information nobody stated. A section with no information keeps an empty text, and anything nobody mentioned simply does not appear: never write "not reported" or "not mentioned". Example: if only the name was said, Identification is just "Anthony.", with no remark about the missing age or occupation.
- The note is a record of reported facts and of decisions the clinician actually stated. Nothing you would suggest yourself goes into the note: a diagnosis, test, prescription or plan appears only if the clinician said it out loud.
- Write in the note language, in the third person, in the style asked for in the preferences. Numbers, doses and measurements always in digits with the unit (58 years old, 160/100 mmHg, 50 mg), even when spoken in words. Relevant negatives are included ("denies dyspnea").
- Keep what was already correct in the previous note; change only what the new conversation adds or corrects. The clinician is reading the screen live, and text that changes for no reason gets in the way.

About the reasoning support (only when the preferences ask for it), written in the note language:
- Hypotheses support the clinician's reasoning; the clinician decides. List 0 to 5, from most to least likely, only when there is already information to support them.
- For each one, say in one sentence what in the conversation supports it and, in another, what weakens it or is still unknown.
- Questions: up to 4 questions not yet asked that would help the most. Remove from the list anything that has already been asked.
- Alerts: red-flag findings that came up in the conversation. Each one is a finding in at most 12 words, with no recommended management. At most 3.
When the preferences say not to suggest hypotheses, return hypotheses, questions and alerts as empty lists.`;

export const FINAL_REVIEW = 'The consultation has ended and this is the final review. Reread the whole transcript and check the note section by section: correct what is wrong, add what was left out and remove what was not said.';

export const SYSTEM_ROLES = 'You receive the beginning of a clinical consultation in which each line is marked with the number of the voice that said it (the split was made by voice timbre). Say which voice is the health professional: the one who leads the consultation, asks, examines, explains, prescribes. Answer with the voice label exactly as it appears in the mark, without the word "Voice".';

/** Preferências do profissional em frases para a IA (inclui idioma da nota e contexto). */
export function describePreferences(p, context = '', language = 'en') {
 const lines = [
  `Note language: ${LANGUAGE_NAME[language] || LANGUAGE_NAME.en}. Write every section and the reasoning support in ${LANGUAGE_NAME[language] || LANGUAGE_NAME.en}.`,
  p.specialty ? `Clinician's specialty: ${p.specialty}. Pay attention to what matters in this specialty.` : '',
  { concise: 'Level of detail: concise. Only the essentials, short sentences.', balanced: 'Level of detail: balanced.', detailed: 'Level of detail: detailed. Record everything relevant that was said, with timing, intensity and circumstances.' }[p.detail],
  p.structure === 'bullets' ? 'Structure: bullets. Each section as short items, one per line, starting with "- ".' : 'Structure: prose, in full sentences.',
  p.vocabulary === 'plain' ? 'Vocabulary: plain language the patient can understand when reading.' : 'Vocabulary: technical, as in a medical record.',
  p.quotes ? 'Include, in quotation marks, the patient\'s own words describing the symptoms.' : 'Do not use direct quotes from the patient.',
  p.abbreviations ? 'Common medical abbreviations may be used (HTN, T2DM, BP, HR).' : 'Write terms in full, without medical abbreviations.',
  p.reasoning ? 'Suggest diagnostic hypotheses, questions and alerts.' : 'Do not suggest diagnostic hypotheses, questions or alerts.',
  'Numbers always in digits with the unit, even when spoken in words: "58 years old", "for 3 weeks", "160/100 mmHg", "losartan 50 mg", "38 °C".',
  String(p.instructions || '').trim() ? `Clinician's instructions: ${String(p.instructions).trim()}` : '',
  String(context || '').trim() ? `Patient context given before the consultation: ${String(context).trim()}` : '',
 ];
 return lines.filter(Boolean).join('\n');
}

/** Conteúdo da mensagem do usuário no pedido de nota. */
export function notePrompt({ transcript, sections, preferences, context = '', language = 'en', previous = null, final = false }) {
 const model = sections.map((s, i) => `${i + 1}. ${s.title}${s.guidance ? ` — ${s.guidance}` : ''}`).join('\n');
 const before = previous ? JSON.stringify(previous, null, 1) : '(no note yet: this is the first update)';
 return `<note_template>\n${model}\n</note_template>\n\n<preferences>\n${describePreferences(preferences, context, language)}\n</preferences>\n\n` +
  `<transcript>\n${String(transcript).trim()}\n</transcript>\n\n<previous_note>\n${before}\n</previous_note>` +
  (final ? `\n\n${FINAL_REVIEW}` : '');
}

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
/**
 * A nota sempre sai com as seções do modelo, na ordem, mesmo que a IA erre um título; sem
 * "reasoning" nas preferências, o apoio sai vazio aqui no servidor, diga a IA o que disser.
 */
export function shapeNote(raw, sections, preferences) {
 const got = Array.isArray(raw?.sections) ? raw.sections.filter((s) => s && typeof s === 'object') : [];
 const byTitle = new Map(got.map((s) => [String(s.title ?? '').trim().toLowerCase(), s.text]));
 const off = !preferences?.reasoning;
 const list = (v) => (Array.isArray(v) ? v : []);
 const known = new Set(sections.map((s) => s.title.trim().toLowerCase()));
 // Título errado: vale a posição, desde que o texto dali não pertença a outra seção do modelo.
 const byPosition = (i) => (got[i] && !known.has(String(got[i].title ?? '').trim().toLowerCase()) ? got[i].text : '');
 return {
  note: sections.map((s, i) => ({ title: s.title, text: text(byTitle.get(s.title.trim().toLowerCase()) ?? byPosition(i), 20000) })),
  support: {
   hypotheses: off ? [] : list(raw?.hypotheses).filter((h) => h && typeof h === 'object' && text(h.name, 200)).slice(0, 5)
    .map((h) => ({ name: text(h.name, 200), likelihood: ['high', 'medium', 'low'].includes(h.likelihood) ? h.likelihood : 'low', supporting: text(h.supporting, 600), against: text(h.against, 600) })),
   questions: off ? [] : list(raw?.questions).map((q) => text(q, 300)).filter(Boolean).slice(0, 4),
   alerts: off ? [] : list(raw?.alerts).map((a) => text(a, 200)).filter(Boolean).slice(0, 3),
  },
 };
}

export const rolesPrompt = (turns) => turns.slice(0, 30).map((t) => `Voice ${t.voice}: ${t.text}`).join('\n');
/** Rótulo da voz do profissional: exatamente como veio nos turnos, ou '' se a IA não indicou uma voz conhecida. */
export function pickClinician(answer, turns) {
 const voices = [...new Set(turns.map((t) => String(t.voice)))];
 const said = String(answer ?? '').trim();
 if (voices.includes(said)) return said;
 const digits = said.replace(/\D/g, '');
 return digits ? voices.find((v) => v.replace(/\D/g, '') === digits) || '' : '';
}

/** Mensagem inicial da Soniox, sem a chave: o navegador junta a chave temporária e abre o WebSocket. */
export function voiceConfig(language) {
 return {
  model: 'stt-rt-v6', audio_format: 'auto',
  language_hints: [language === 'pt-BR' ? 'pt' : language === 'es' ? 'es' : 'en'],
  enable_speaker_diarization: true,
  context: { general: [{ key: 'domain', value: 'Healthcare' }, { key: 'topic', value: 'Medical consultation' }] },
 };
}

// ---- clientes (IA e voz) ----
const fail = (status, code, message) => Object.assign(Error(message), { status, code });

export function createScribeAi({ env = process.env, fetchImpl = fetch } = {}) {
 const key = () => env.SCRIBE_ANTHROPIC_API_KEY || '';
 const voiceKey = () => env.SCRIBE_SONIOX_API_KEY || '';
 const live = () => env.SCRIBE_MODEL_LIVE || 'claude-haiku-5-5';
 const final = () => env.SCRIBE_MODEL_FINAL || 'claude-opus-5-5';

 async function ask(model, system, content, schema, timeout) {
  if (!key()) throw fail(503, 'SCRIBE_NOT_CONFIGURED', 'AI not configured.');
  // O modelo maior aceita refazer em outro modelo se houver recusa por filtro de segurança.
  const fallback = /opus|sonnet-5-5|fable/.test(model);
  let response;
  try {
   response = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key(), 'anthropic-version': '2023-06-01', 'content-type': 'application/json', ...(fallback ? { 'anthropic-beta': 'server-side-fallback-2026-07-01' } : {}) },
    body: JSON.stringify({
     model, max_tokens: 16000, system,
     messages: [{ role: 'user', content }],
     output_config: { effort: 'low', format: { type: 'json_schema', schema } },
     ...(fallback ? { fallbacks: 'default' } : {}),
    }),
    signal: AbortSignal.timeout(timeout),
   });
  } catch { throw fail(502, 'AI_UNAVAILABLE', 'No connection to the AI.'); }
  // Nunca registrar o corpo: pode conter trechos da consulta.
  if (!response.ok) throw fail(502, 'AI_UNAVAILABLE', `AI error (${response.status}).`);
  let data;
  try { data = await response.json(); } catch { throw fail(502, 'AI_UNAVAILABLE', 'Unreadable AI response.'); }
  if (data?.stop_reason === 'refusal') throw fail(502, 'AI_UNAVAILABLE', 'The AI declined this excerpt.');
  if (data?.stop_reason === 'max_tokens') throw fail(502, 'AI_UNAVAILABLE', 'AI response cut off.');
  const block = (Array.isArray(data?.content) ? data.content : []).find((b) => b?.type === 'text');
  try { return JSON.parse(block.text); } catch { throw fail(502, 'AI_UNAVAILABLE', 'Unreadable AI response.'); }
 }

 return {
  status: () => ({ ai: !!key(), voice: !!voiceKey() }),
  /** Atualização ao vivo (modelo rápido) ou revisão final (modelo maior). Devolve o JSON da IA; quem chama passa por shapeNote. */
  note: (request) => ask(request.final ? final() : live(), SYSTEM, notePrompt(request), NOTE_SCHEMA, request.final ? 150000 : 90000),
  async clinicianVoice(turns) {
   const raw = await ask(live(), SYSTEM_ROLES, rolesPrompt(turns), ROLES_SCHEMA, 30000);
   return pickClinician(raw?.clinician, turns);
  },
  /** Chave de 60 s para o navegador abrir a transcrição ao vivo. A chave de verdade não sai do servidor. */
  async voiceKey() {
   if (!voiceKey()) throw fail(503, 'SCRIBE_NOT_CONFIGURED', 'Voice service not configured.');
   let response;
   try {
    response = await fetchImpl(`${env.SCRIBE_SONIOX_API || 'https://api.soniox.com'}/v1/auth/temporary-api-key`, {
     method: 'POST',
     headers: { Authorization: `Bearer ${voiceKey()}`, 'Content-Type': 'application/json' },
     body: JSON.stringify({ usage_type: 'transcribe_websocket', expires_in_seconds: 60 }),
     signal: AbortSignal.timeout(15000),
    });
   } catch { throw fail(502, 'AI_UNAVAILABLE', 'No connection to the voice service.'); }
   if (!response.ok) throw fail(502, 'AI_UNAVAILABLE', `Voice service error (${response.status}).`);
   const data = await response.json().catch(() => null);
   if (typeof data?.api_key !== 'string' || !data.api_key) throw fail(502, 'AI_UNAVAILABLE', 'Unreadable voice service response.');
   return { api_key: data.api_key, ws: env.SCRIBE_SONIOX_WS || 'wss://stt-rt.soniox.com/transcribe-websocket' };
  },
 };
}
