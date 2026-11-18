// 2Doctor Scribe: regras puras do cliente (sem DOM), testadas em tests/scribe-client.test.mjs.
// A conversa fica num objeto mutável: os pedaços de fala chegam várias vezes por segundo.

export const UPDATE_INTERVAL = 2500;
export const MAX_RECONNECTS = 4;
export const reconnectDelay = (attempt) => Math.min(8000, 1000 * 2 ** Math.max(0, attempt - 1));

export const ROLES = ['clinician', 'patient', 'other'];
// Prefixos fixos do contrato da API (não são texto de tela, não se traduzem).
export const TRANSCRIPT_PREFIX = { clinician: 'Clinician', patient: 'Patient', other: 'Other', unknown: 'Other' };

// A cada conexão o serviço de voz renumera as vozes; o prefixo da sessão evita misturar "voz 1" de antes e de depois.
export const voiceId = (session, speaker) => `${session}-${speaker || '1'}`;
export const sessionOf = (voice) => { const v = String(voice ?? ''), i = v.lastIndexOf('-'); return i < 0 ? '' : v.slice(0, i); };

export function createConversation(saved) {
 const c = { dialogue: [], partial: [], roles: {}, manual: {}, asked: {}, version: 0 };
 if (saved && typeof saved === 'object') {
  if (Array.isArray(saved.dialogue)) c.dialogue = saved.dialogue.filter((t) => t && typeof t.text === 'string' && t.text.trim()).map((t) => ({ voice: String(t.voice || 'old-1'), who: ROLES.includes(t.who) ? t.who : 'other', text: t.text }));
  for (const key of ['roles', 'manual', 'asked']) if (saved[key] && typeof saved[key] === 'object') c[key] = { ...saved[key] };
  for (const t of c.dialogue) if (!ROLES.includes(c.roles[t.voice])) c.roles[t.voice] = t.who;
  if (c.dialogue.length) c.version = 1;
 }
 return c;
}

// Maior número de sessão de voz já usado (para continuar a contagem depois de recarregar a página).
export function lastSession(c) {
 let max = 0;
 for (const voice of Object.keys(c.roles)) { const n = Number(sessionOf(voice)); if (Number.isInteger(n) && n > max) max = n; }
 return max;
}

const sameSession = (c, voice) => { const s = sessionOf(voice); return Object.keys(c.roles).filter((v) => sessionOf(v) === s); };

// Quem fala primeiro numa sessão é tratado como o profissional, depois o paciente; os demais, "outro".
export function roleOf(c, voice) {
 if (!c.roles[voice]) {
  const used = sameSession(c, voice).map((v) => c.roles[v]);
  c.roles[voice] = !used.includes('clinician') ? 'clinician' : !used.includes('patient') ? 'patient' : 'other';
 }
 return c.roles[voice];
}

export function assignRole(c, voice, role) {
 const previous = roleOf(c, voice);
 if (previous === role || !ROLES.includes(role)) return false;
 // Só existe um profissional e um paciente por sessão: quem tinha o papel fica com o antigo desta voz.
 if (role !== 'other') for (const other of sameSession(c, voice)) if (other !== voice && c.roles[other] === role) c.roles[other] = previous;
 c.roles[voice] = role;
 for (const turn of c.dialogue) turn.who = roleOf(c, turn.voice);
 c.version++;
 return true;
}

// Toque no nome de quem falou: com até duas vozes só inverte; com três ou mais, roda os papéis.
export function swapRole(c, voice) {
 if (!voice) return false;
 const session = sessionOf(voice);
 c.manual[session] = true;
 const current = roleOf(c, voice);
 const voices = new Set(c.dialogue.filter((t) => sessionOf(t.voice) === session).map((t) => t.voice));
 const next = voices.size <= 2 ? (current === 'clinician' ? 'patient' : 'clinician') : { clinician: 'patient', patient: 'other', other: 'clinician' }[current];
 return assignRole(c, voice, next);
}

// Junta os pedaços: os finais entram na conversa; os provisórios substituem os provisórios anteriores.
export function receive(c, pieces) {
 c.partial = [];
 for (const p of pieces || []) {
  if (!p || typeof p.text !== 'string') continue;
  const list = p.final ? c.dialogue : c.partial;
  const last = list[list.length - 1];
  if (last && last.voice === p.voice) last.text += p.text;
  else if (p.text.trim()) list.push({ voice: p.voice, who: roleOf(c, p.voice), text: p.text.trimStart() });
 }
 if (pieces?.length) c.version++;
 return c;
}

// Mensagem do serviço de voz → pedaços de fala. Marcadores de fim não são fala.
export function parseVoiceMessage(raw, session) {
 let m;
 try { m = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return { pieces: [], finished: false }; }
 if (!m || typeof m !== 'object') return { pieces: [], finished: false };
 if (m.error_code) return { error: { type: String(m.error_type || ''), message: String(m.error_message || m.error_type || '') }, pieces: [], finished: false };
 const pieces = [];
 for (const k of m.tokens ?? []) {
  if (!k?.text || k.text === '<end>' || k.text === '<fin>') continue;
  pieces.push({ voice: voiceId(session, k.speaker), text: k.text, final: !!k.is_final });
 }
 return { pieces, finished: !!m.finished };
}

// A última palavra provisória pode estar pela metade: fica de fora do que vai para a nota.
export function dropHalfWord(text) {
 return /[.!?,;:]\s*$/.test(text) ? text : text.replace(/\s*\S+$/, '');
}

const line = (who, text) => `${TRANSCRIPT_PREFIX[who] || 'Other'}: ${text.trim()}`;
export function buildTranscript(c) {
 const lines = c.dialogue.filter((t) => t.text.trim()).map((t) => line(t.who, t.text));
 c.partial.forEach((t, i) => {
  const text = i === c.partial.length - 1 ? dropHalfWord(t.text) : t.text;
  if (text.trim()) lines.push(line(roleOf(c, t.voice), text));
 });
 return lines.join('\n');
}

// Ao encerrar, o que ainda era provisório entra na conversa.
export function flushPartial(c) {
 for (const t of c.partial) if (t.text.trim()) c.dialogue.push({ voice: t.voice, who: roleOf(c, t.voice), text: t.text });
 if (c.partial.length) c.version++;
 c.partial = [];
 return c;
}
export const dialogueForFinish = (c) => c.dialogue.filter((t) => t.text.trim()).map(({ who, text }) => ({ who: ROLES.includes(who) ? who : 'unknown', text: text.trim() }));

// Pergunta ao servidor quem é o profissional: aos 4 e aos 12 turnos de cada sessão de voz, se houver duas vozes
// e o usuário não tiver corrigido à mão. Devolve null quando não é hora.
export function rolesRequest(c, session) {
 session = String(session);
 if (c.manual[session]) return null;
 const turns = c.dialogue.filter((t) => sessionOf(t.voice) === session);
 const voices = [...new Set(turns.map((t) => t.voice))];
 const asked = c.asked[session] || 0;
 const target = asked === 0 ? 4 : asked === 1 ? 12 : Infinity;
 if (voices.length < 2 || turns.length < target) return null;
 return { session, voices, turns: turns.slice(0, 30).map((t) => ({ voice: String(voices.indexOf(t.voice) + 1), text: t.text })) };
}
export function applyClinician(c, request, clinician) {
 const voice = request.voices[Number(clinician) - 1];
 if (!voice || c.manual[request.session]) return false;
 return assignRole(c, voice, 'clinician');
}

// Cópia do andamento para o sessionStorage (sobrevive a recarregar a aba; apagada ao encerrar).
export const snapshot = (c, extra = {}) => ({ ...extra, dialogue: c.dialogue.map(({ voice, who, text }) => ({ voice, who, text })), roles: { ...c.roles }, manual: { ...c.manual }, asked: { ...c.asked } });
export const liveKey = (id) => `2doctor-scribe-live:${id}`;

export const clock = (seconds) => { const s = Math.max(0, Math.floor(seconds || 0)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

// Texto copiado: só a nota. O apoio ao raciocínio nunca entra.
export function noteText(note, headings) {
 return (note || []).filter((s) => s?.text?.trim()).map((s) => (headings ? `${s.title}\n${s.text.trim()}` : s.text.trim())).join('\n\n');
}
export const hasSupport = (support) => !!((support?.hypotheses?.length || 0) + (support?.questions?.length || 0) + (support?.alerts?.length || 0));

// Textos de tela (português é o idioma-fonte; traduções em shared/i18n/parts/scribe.mjs).
export const TEMPLATE_NAMES = { 'first-visit': 'Primeira consulta', 'follow-up': 'Retorno' };
export const ROLE_LABEL = { clinician: 'Profissional', patient: 'Paciente', other: 'Outra pessoa', unknown: 'Fala' };
export const LIKELIHOOD = { high: 'Mais provável', medium: 'Possível', low: 'Menos provável' };
export const SPECIALTIES = ['Clínica médica', 'Medicina de família', 'Cardiologia', 'Pediatria', 'Ginecologia e obstetrícia', 'Psiquiatria', 'Ortopedia', 'Endocrinologia', 'Neurologia', 'Dermatologia', 'Geriatria', 'Medicina de emergência'];
export const PROBLEMS = {
 AUTH_REQUIRED: 'Entre na sua conta para usar o Scribe.',
 SCRIBE_NOT_CONFIGURED: 'O Scribe está temporariamente indisponível.',
 UNAVAILABLE: 'O Scribe está temporariamente indisponível.',
 SCRIBE_TRIAL_ENDED: 'Suas consultas gratuitas acabaram.',
 AI_UNAVAILABLE: 'A IA não respondeu agora. Tente de novo em instantes.',
 NETWORK: 'Sem conexão com o servidor. Verifique a internet.',
 NOT_FOUND: 'Consulta não encontrada.',
};
// Fase da consulta → [rótulo, estilo do indicador]
export const PHASE = { ready: ['Pronto', ''], connecting: ['Conectando', 'busy'], listening: ['Ouvindo', 'on'], paused: ['Em pausa', ''], reconnecting: ['Reconectando', 'busy'], ending: ['Revisão final…', 'busy'] };
// Falha ao ligar o microfone ou a transcrição → [o que houve, o que fazer]
export const MIC_PROBLEMS = {
 'mic-denied': ['Microfone bloqueado.', 'Toque no cadeado ao lado do endereço do site, permita o microfone e tente de novo. No celular, confira também a permissão de microfone do navegador nos ajustes do aparelho.'],
 'mic-missing': ['Nenhum microfone encontrado.', 'Conecte um microfone e tente de novo.'],
 unsupported: ['Este navegador não grava áudio.', 'Use uma versão recente do Chrome, Safari ou Edge.'],
 connect: ['Não foi possível conectar à transcrição.', 'Verifique a internet e tente de novo.'],
};
export const uiStrings = () => [...Object.values(TEMPLATE_NAMES), ...Object.values(ROLE_LABEL), ...Object.values(LIKELIHOOD), ...SPECIALTIES, ...Object.values(PROBLEMS), ...Object.values(PHASE).map(([label]) => label), ...Object.values(MIC_PROBLEMS).flat()];
