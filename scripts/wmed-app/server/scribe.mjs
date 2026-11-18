// 2Doctor Scribe: POST /api/wmed/scribe {action, ...}. Registros de consulta (só texto), nota ao
// vivo e revisão final pela IA, chave temporária de voz, preferências e teste grátis.
// O áudio vai do navegador direto para o serviço de voz e nunca passa por aqui.
// Nunca registrar em log o corpo dos pedidos nem respostas da IA (conteúdo de consulta).
import { randomUUID } from 'node:crypto';
import { q } from './db.mjs';
import { requireUser, reply, lang, scribeOf, throttle } from './accounts.mjs';
import { createScribeAi, templates, template, recordLanguage, mergePreferences, DEFAULT_PREFERENCES, shapeNote, voiceConfig, LANGUAGES, TEMPLATE_IDS } from './scribe-ai.mjs';

export const SCRIBE_PRICE = { monthly: 29, currency: 'USD' };
export const SCRIBE_LIMITS = { startsPerDay: 40, voiceKeys: 30, updates: 1500, updateGapSeconds: 2, staleHours: 6 };
/** Consultas grátis (vitalício) para quem não assina. SCRIBE_TRIAL muda o número; padrão 3. */
export function scribeTrial(env = process.env) {
 const n = Number(env.SCRIBE_TRIAL);
 return env.SCRIBE_TRIAL !== undefined && env.SCRIBE_TRIAL !== '' && Number.isInteger(n) && n >= 0 && n <= 1000 ? n : 3;
}

const MSG = {
 SCRIBE_NOT_CONFIGURED: { en: 'Scribe is not available right now.', es: 'Scribe no está disponible en este momento.', pt: 'O Scribe não está disponível no momento.' },
 SCRIBE_TRIAL_ENDED: { en: 'Your free consultations are over. Subscribe to 2Doctor Scribe to continue.', es: 'Tus consultas gratis terminaron. Suscríbete a 2Doctor Scribe para continuar.', pt: 'Suas consultas grátis acabaram. Assine o 2Doctor Scribe para continuar.' },
 SCRIBE_LIMIT: { en: 'Too many requests. Wait a moment and try again.', es: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.', pt: 'Muitos pedidos. Aguarde um instante e tente de novo.' },
 SCRIBE_DAY: { en: 'You reached today\'s limit of consultations. Come back tomorrow.', es: 'Alcanzaste el límite de consultas de hoy. Vuelve mañana.', pt: 'Você atingiu o limite de consultas de hoje. Volte amanhã.' },
 NOT_FOUND: { en: 'Record not found.', es: 'Registro no encontrado.', pt: 'Registro não encontrado.' },
 ALREADY_FINISHED: { en: 'This consultation is already finished.', es: 'Esta consulta ya fue finalizada.', pt: 'Esta consulta já foi finalizada.' },
 INVALID: { en: 'Check the information you sent.', es: 'Revisa los datos enviados.', pt: 'Confira os dados enviados.' },
 CONSENT: { en: 'Confirm that the patient agreed to the recording before starting.', es: 'Confirma que el paciente aceptó la grabación antes de empezar.', pt: 'Confirme que o paciente concordou com a gravação antes de começar.' },
 AI_UNAVAILABLE: { en: 'The AI is unavailable right now. Try again.', es: 'La IA no está disponible en este momento. Inténtalo de nuevo.', pt: 'A IA está indisponível no momento. Tente de novo.' },
 UNAVAILABLE: { en: 'Service unavailable right now. Try again.', es: 'Servicio no disponible en este momento. Inténtalo de nuevo.', pt: 'Serviço indisponível no momento. Tente novamente.' },
};
const STATUS = { SCRIBE_NOT_CONFIGURED: 503, SCRIBE_TRIAL_ENDED: 402, SCRIBE_LIMIT: 429, NOT_FOUND: 404, ALREADY_FINISHED: 409, INVALID: 400, AI_UNAVAILABLE: 502, UNAVAILABLE: 503 };
const stop = (code, message = code) => Object.assign(Error(code), { code, message });

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WHO = ['clinician', 'patient', 'other', 'unknown'];
const str = (v, max, { min = 0 } = {}) => (typeof v === 'string' && v.trim().length >= min && v.length <= max ? v : null);
const emptySupport = () => ({ hypotheses: [], questions: [], alerts: [] });

// Corpo grande (transcrição inteira): junta os pedaços como bytes para não quebrar acentos.
async function readBody(req, max) {
 let data = req.body;
 if (data == null) {
  const chunks = []; let size = 0;
  for await (const c of req) { const b = Buffer.isBuffer(c) ? c : Buffer.from(String(c)); size += b.length; if (size > max) throw stop('INVALID'); chunks.push(b); }
  data = Buffer.concat(chunks).toString('utf8');
 }
 if (typeof data === 'string' || Buffer.isBuffer(data)) { if (Buffer.byteLength(data) > max) throw stop('INVALID'); try { data = JSON.parse(String(data)); } catch { throw stop('INVALID'); } }
 if (!data || typeof data !== 'object' || Array.isArray(data)) throw stop('INVALID');
 return data;
}

function recordOut(r) {
 const end = r.finalizado_em ? new Date(r.finalizado_em) : new Date();
 const support = r.apoio && typeof r.apoio === 'object' ? r.apoio : {};
 return {
  id: r.id, label: r.rotulo, template: r.modelo, templateName: r.modelo_nome, language: r.idioma, context: r.contexto,
  status: r.status, startedAt: new Date(r.iniciado_em).toISOString(), finishedAt: r.finalizado_em ? new Date(r.finalizado_em).toISOString() : null,
  durationSeconds: Math.max(0, Math.round((end - new Date(r.iniciado_em)) / 1000)),
  note: Array.isArray(r.nota) ? r.nota : [],
  support: { hypotheses: support.hypotheses || [], questions: support.questions || [], alerts: support.alerts || [] },
  dialogue: Array.isArray(r.dialogo) ? r.dialogo : [],
  reviewed: !!r.revisada, interrupted: !!r.interrompida,
 };
}

// Consulta "ao vivo" há mais de 6 h ficou aberta: passa a finalizada (interrompida, sem revisão).
const closeStale = (userId) => q(`update scribe_registros set status = 'finished', interrompida = true, finalizado_em = coalesce(ultima_atualizacao, iniciado_em)
  where usuario_id = $1 and status = 'live' and iniciado_em < now() - make_interval(hours => $2::int)`, [userId, SCRIBE_LIMITS.staleHours]);

async function preferencesOf(userId) {
 const { rows } = await q('select dados from scribe_preferencias where usuario_id = $1', [userId]);
 return mergePreferences(rows[0]?.dados || {}) || { ...DEFAULT_PREFERENCES };
}
async function mine(userId, id) {
 if (typeof id !== 'string' || !ID.test(id)) throw stop('NOT_FOUND');
 await closeStale(userId);
 const { rows } = await q('select * from scribe_registros where id = $1 and usuario_id = $2', [id, userId]);
 if (!rows[0]) throw stop('NOT_FOUND');
 return rows[0];
}
// Por que a escrita condicional não pegou a linha: não existe, já terminou ou passou do limite.
async function whyNot(userId, id) {
 const { rows } = await q('select status from scribe_registros where id = $1 and usuario_id = $2', [id, userId]);
 return stop(!rows[0] ? 'NOT_FOUND' : rows[0].status !== 'live' ? 'ALREADY_FINISHED' : 'SCRIBE_LIMIT');
}

/** Situação do acesso: assinante, em teste (consultas grátis restantes) ou sem acesso. */
export function accessOf(u, trial = scribeTrial()) {
 const left = Math.max(0, trial - (u?.scribe_testes_usados || 0));
 if (scribeOf(u)) return { plan: 'scribe', trialLeft: left, trialTotal: trial, ...(u.scribe_fim ? { renews: new Date(u.scribe_fim).toISOString() } : {}), cancels: !!u.scribe_cancela };
 return { plan: left > 0 ? 'trial' : 'none', trialLeft: left, trialTotal: trial };
}

export function createScribe({ ai = createScribeAi() } = {}) {
 const actions = {
  async status(user, b, l) {
   const { rows } = await q('select scribe_status, scribe_fim, scribe_cancela, scribe_testes_usados from usuarios where id = $1', [user.id]);
   return { ready: ai.status(), access: accessOf(rows[0]), preferences: await preferencesOf(user.id), templates: templates(recordLanguage(l)), price: SCRIBE_PRICE };
  },

  async 'preferences-save'(user, b) {
   const merged = mergePreferences(b.preferences, await preferencesOf(user.id));
   if (!merged) throw stop('INVALID');
   await q(`insert into scribe_preferencias (usuario_id, dados) values ($1, $2::jsonb)
     on conflict (usuario_id) do update set dados = excluded.dados, atualizado_em = now()`, [user.id, JSON.stringify(merged)]);
   return { preferences: merged };
  },

  async start(user, b) {
   if (!TEMPLATE_IDS.includes(b.template) || !LANGUAGES.includes(b.language)) throw stop('INVALID');
   if (b.consent !== true) throw stop('INVALID', 'CONSENT');
   const label = b.label == null ? '' : str(b.label, 80);
   const context = b.context == null ? '' : str(b.context, 2000);
   if (label === null || context === null) throw stop('INVALID');
   const ready = ai.status();
   if (!ready.ai || !ready.voice) throw stop('SCRIBE_NOT_CONFIGURED');
   const { rows: us } = await q('select scribe_status, scribe_testes_usados from usuarios where id = $1', [user.id]);
   const subscribed = scribeOf(us[0]);
   const trial = scribeTrial();
   if (!subscribed && (us[0]?.scribe_testes_usados || 0) >= trial) throw stop('SCRIBE_TRIAL_ENDED');
   const { rows: day } = await q(`insert into uso_diario (usuario_id, dia, tipo, n) values ($1, (now() at time zone 'utc')::date, 'scribe', 1)
     on conflict (usuario_id, dia, tipo) do update set n = uso_diario.n + 1 returning n`, [user.id]);
   if (day[0].n > SCRIBE_LIMITS.startsPerDay) throw stop('SCRIBE_LIMIT', 'SCRIBE_DAY');
   const tpl = template(b.template, b.language);
   const note = tpl.sections.map((s) => ({ title: s.title, text: '' }));
   const values = [randomUUID(), user.id, label.trim(), tpl.id, tpl.name, JSON.stringify(tpl.sections), b.language, context.trim(), JSON.stringify(note), JSON.stringify(emptySupport()), !subscribed];
   const columns = '(id, usuario_id, rotulo, modelo, modelo_nome, secoes, idioma, contexto, nota, apoio, teste)';
   const row = '$1::uuid, $2::uuid, $3::text, $4::text, $5::text, $6::jsonb, $7::text, $8::text, $9::jsonb, $10::jsonb, $11::boolean';
   // Sem assinatura: a consulta de teste é descontada e o registro criado no mesmo comando
   // (duas abas ao mesmo tempo não passam do limite, e falha ao criar não consome o teste).
   const { rows } = subscribed
    ? await q(`insert into scribe_registros ${columns} values (${row}) returning *`, values)
    : await q(`with t as (update usuarios set scribe_testes_usados = scribe_testes_usados + 1 where id = $2::uuid and scribe_testes_usados < $12::int returning id)
        insert into scribe_registros ${columns} select ${row} from t returning *`, [...values, trial]);
   if (!rows[0]) throw stop('SCRIBE_TRIAL_ENDED');
   return { record: recordOut(rows[0]) };
  },

  async 'voice-key'(user, b) {
   if (!ai.status().voice) throw stop('SCRIBE_NOT_CONFIGURED');
   if (typeof b.id !== 'string' || !ID.test(b.id)) throw stop('NOT_FOUND');
   await closeStale(user.id);
   const { rows } = await q(`update scribe_registros set chaves_voz = chaves_voz + 1 where id = $1 and usuario_id = $2 and status = 'live' and chaves_voz < $3 returning idioma`, [b.id, user.id, SCRIBE_LIMITS.voiceKeys]);
   if (!rows[0]) throw await whyNot(user.id, b.id);
   const key = await ai.voiceKey();
   return { api_key: key.api_key, ws: key.ws, config: voiceConfig(rows[0].idioma) };
  },

  async roles(user, b) {
   const turns = Array.isArray(b.turns) && b.turns.length >= 1 && b.turns.length <= 60 ? b.turns : null;
   if (!turns || !turns.every((t) => t && str(t.voice, 40, { min: 1 }) !== null && str(t.text, 20000) !== null)) throw stop('INVALID');
   if (!ai.status().ai) throw stop('SCRIBE_NOT_CONFIGURED');
   await mine(user.id, b.id);
   if (!throttle('scribe-roles:' + b.id, 10)) throw stop('SCRIBE_LIMIT');
   return { clinician: String(await ai.clinicianVoice(turns.map((t) => ({ voice: t.voice.trim(), text: t.text }))) || '') };
  },

  async update(user, b) {
   if (str(b.transcript, 400000, { min: 1 }) === null) throw stop('INVALID');
   if (!ai.status().ai) throw stop('SCRIBE_NOT_CONFIGURED');
   if (typeof b.id !== 'string' || !ID.test(b.id)) throw stop('NOT_FOUND');
   await closeStale(user.id);
   // Uma atualização a cada 2 s e no máximo 1500 por registro, contadas no mesmo comando.
   const { rows } = await q(`update scribe_registros set atualizacoes = atualizacoes + 1, ultima_atualizacao = now()
     where id = $1 and usuario_id = $2 and status = 'live' and atualizacoes < $3
       and (ultima_atualizacao is null or ultima_atualizacao <= now() - make_interval(secs => $4::int)) returning *`, [b.id, user.id, SCRIBE_LIMITS.updates, SCRIBE_LIMITS.updateGapSeconds]);
   if (!rows[0]) throw await whyNot(user.id, b.id);
   const result = await generate(user.id, rows[0], b.transcript, false);
   await q(`update scribe_registros set nota = $3::jsonb, apoio = $4::jsonb where id = $1 and usuario_id = $2 and status = 'live'`, [b.id, user.id, JSON.stringify(result.note), JSON.stringify(result.support)]);
   return result;
  },

  async finish(user, b) {
   const dialogue = Array.isArray(b.dialogue) && b.dialogue.length <= 5000 ? b.dialogue : null;
   if (str(b.transcript, 400000) === null || !dialogue || !dialogue.every((t) => t && WHO.includes(t.who) && str(t.text, 20000) !== null)) throw stop('INVALID');
   const r = await mine(user.id, b.id);
   if (r.status !== 'live') throw stop('ALREADY_FINISHED');
   // Falha da IA (ou IA desligada) não perde a consulta: fica salva com a última nota, sem revisão.
   let result = null;
   if (ai.status().ai && b.transcript.trim()) { try { result = await generate(user.id, r, b.transcript, true); } catch { result = null; } }
   const { rows } = await q(`update scribe_registros set status = 'finished', finalizado_em = now(), dialogo = $3::jsonb, revisada = $4,
       nota = coalesce($5::jsonb, nota), apoio = coalesce($6::jsonb, apoio)
     where id = $1 and usuario_id = $2 and status = 'live' returning *`,
    [b.id, user.id, JSON.stringify(dialogue.map((t) => ({ who: t.who, text: t.text }))), !!result, result ? JSON.stringify(result.note) : null, result ? JSON.stringify(result.support) : null]);
   if (!rows[0]) throw stop('ALREADY_FINISHED');
   return { record: recordOut(rows[0]) };
  },

  async list(user) {
   await closeStale(user.id);
   const { rows } = await q(`select id, rotulo, modelo, status, iniciado_em, finalizado_em, idioma from scribe_registros where usuario_id = $1 order by iniciado_em desc limit 50`, [user.id]);
   return { records: rows.map((r) => ({ id: r.id, label: r.rotulo, template: r.modelo, status: r.status, startedAt: new Date(r.iniciado_em).toISOString(), finishedAt: r.finalizado_em ? new Date(r.finalizado_em).toISOString() : null, language: r.idioma })) };
  },

  async open(user, b) { return { record: recordOut(await mine(user.id, b.id)) }; },

  // O profissional corrige a nota ou o rótulo. A nota do Scribe é um rascunho de trabalho.
  async edit(user, b) {
   const label = b.label === undefined ? undefined : str(b.label, 80);
   let note;
   if (b.note !== undefined) {
    if (!Array.isArray(b.note) || b.note.length > 20 || !b.note.every((s) => s && str(s.title, 80, { min: 1 }) !== null && str(s.text, 20000) !== null)) throw stop('INVALID');
    note = b.note.map((s) => ({ title: s.title.trim(), text: s.text }));
   }
   if (label === null || (label === undefined && note === undefined)) throw stop('INVALID');
   await mine(user.id, b.id);
   const { rows } = await q(`update scribe_registros set rotulo = coalesce($3, rotulo), nota = coalesce($4::jsonb, nota) where id = $1 and usuario_id = $2 returning *`,
    [b.id, user.id, label === undefined ? null : label.trim(), note ? JSON.stringify(note) : null]);
   if (!rows[0]) throw stop('NOT_FOUND');
   return { record: recordOut(rows[0]) };
  },

  async delete(user, b) {
   if (typeof b.id !== 'string' || !ID.test(b.id)) throw stop('NOT_FOUND');
   const { rowCount } = await q('delete from scribe_registros where id = $1 and usuario_id = $2', [b.id, user.id]);
   if (!rowCount) throw stop('NOT_FOUND');
   return { ok: true };
  },
 };

 // A nota sai sempre com as seções do modelo, na ordem; sem "reasoning", o apoio sai vazio.
 async function generate(userId, r, transcript, final) {
  const preferences = await preferencesOf(userId);
  const before = Array.isArray(r.nota) ? r.nota : [];
  const support = r.apoio && typeof r.apoio === 'object' ? r.apoio : {};
  const raw = await ai.note({
   transcript, final, preferences, context: r.contexto, language: r.idioma, sections: r.secoes,
   previous: before.some((s) => s.text) ? { sections: before, hypotheses: support.hypotheses || [], questions: support.questions || [], alerts: support.alerts || [] } : null,
  });
  return shapeNote(raw, r.secoes, preferences);
 }

 return async function scribe(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;
  const l = lang(req);
  const fail = (code, message = code) => reply(res, STATUS[code] || 503, { error: (MSG[message] || MSG[code] || MSG.UNAVAILABLE)[l] || (MSG[message] || MSG[code] || MSG.UNAVAILABLE).en, code });
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
  try {
   const b = await readBody(req, 3_000_000);
   if (typeof b.action !== 'string' || !Object.hasOwn(actions, b.action)) return fail('INVALID');
   return reply(res, 200, await actions[b.action](user, b, l));
  } catch (e) {
   if (e?.code && STATUS[e.code]) return fail(e.code, MSG[e.message] ? e.message : e.code);
   console.error('[2doctor] scribe', e?.message);
   return fail('UNAVAILABLE');
  }
 };
}

let handler = null;
export function scribe(req, res) { handler ??= createScribe(); return handler(req, res); }
export const scribeStatus = () => createScribeAi().status();
