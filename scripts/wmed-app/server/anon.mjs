// Perguntas grátis sem conta (2Doctor): poucas perguntas no chat principal antes do muro de
// cadastro. Identidade = id anônimo em cookie HttpOnly assinado; contagem no Postgres por id
// (total), por IP (dia) e global (dia), para conter abuso e custo de IA. Só o chat usa isto.
import { createHmac, createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { q } from './db.mjs';
import { throttle } from './accounts.mjs';

export const ANON_COOKIE = '__Host-2d_anon';
const COOKIE_DAYS = 30;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const int = (v, d) => { const n = Number(v); return v != null && String(v).trim() !== '' && Number.isInteger(n) && n >= 0 ? n : d; };
// ANON_FREE_QUESTIONS: perguntas por visitante (0 desliga). ANON_IP_DAILY_LIMIT: teto por IP e dia.
// ANON_GLOBAL_DAILY_LIMIT: teto de perguntas anônimas do site inteiro por dia (custo de IA).
// ANON_RATE_PER_MINUTE: rajada por IP. Dias em UTC.
export function anonLimits(env = process.env) {
 return { perVisitor: int(env.ANON_FREE_QUESTIONS, 2), perIp: int(env.ANON_IP_DAILY_LIMIT, 6), global: int(env.ANON_GLOBAL_DAILY_LIMIT, 500), perMinute: int(env.ANON_RATE_PER_MINUTE, 4) };
}

// Segredo da assinatura: variável própria, senão deriva da chave de serviço (já existe em produção).
// Sem nenhuma das duas (desenvolvimento), vale um segredo por processo.
let fallback = null;
function secret() {
 const base = process.env.ANON_COOKIE_SECRET || process.env.TWO_DOCTOR_SERVICE_KEY;
 if (base) return createHash('sha256').update('2doctor-anon-v1:' + base).digest();
 return (fallback ??= randomBytes(32));
}
const sign = (id) => createHmac('sha256', secret()).update(id).digest('base64url');
export const anonCookieValue = (id) => `${id}.${sign(id)}`;
export function readAnonId(req) {
 const raw = String(req.headers?.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(ANON_COOKIE + '='))?.slice(ANON_COOKIE.length + 1) || '';
 const dot = raw.indexOf('.');
 if (dot < 0) return null;
 const id = raw.slice(0, dot), sig = Buffer.from(raw.slice(dot + 1)), good = Buffer.from(UUID.test(id) ? sign(id) : '');
 return good.length && sig.length === good.length && timingSafeEqual(sig, good) ? id : null;
}
// IP do visitante: o Railway informa em X-Real-IP; o primeiro de X-Forwarded-For é a reserva.
export function clientIp(req) {
 return String(req.headers?.['x-real-ip'] || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim().slice(0, 64) || 'desconhecido';
}
// O IP nunca é gravado: só um resumo com o segredo do servidor.
const ipKey = (ip) => 'ip:' + createHmac('sha256', secret()).update('ip:' + ip).digest('base64url').slice(0, 32);

function appendCookie(res, cookie) {
 const old = res.getHeader?.('Set-Cookie') ?? res.headers?.['set-cookie'];
 res.setHeader('Set-Cookie', old ? [].concat(old, cookie) : cookie);
}
// Soma 1 só se ainda estiver abaixo do teto (atômico). Devolve o novo total ou null.
async function bumpDay(chave, limit) {
 if (limit <= 0) return null;
 const { rows } = await q(`insert into uso_anonimo (chave, dia, n) values ($1, (now() at time zone 'utc')::date, 1)
   on conflict (chave, dia) do update set n = uso_anonimo.n + 1 where uso_anonimo.n < $2 returning n`, [chave, limit]);
 return rows[0]?.n ?? null;
}
const undoDay = (chave) => q(`update uso_anonimo set n = n - 1 where chave = $1 and dia = (now() at time zone 'utc')::date and n > 0`, [chave]);
async function bumpVisitor(id, limit) {
 const { rows } = await q(`insert into anon_visitantes (id, n) values ($1, 1)
   on conflict (id) do update set n = anon_visitantes.n + 1, ultimo_em = now() where anon_visitantes.n < $2 returning n`, [id, limit]);
 return rows[0]?.n ?? null;
}
const undoVisitor = (id) => q('update anon_visitantes set n = n - 1 where id = $1 and n > 0', [id]);

// Identidade anônima para o chat. Devolve null quando o recurso está desligado (muro normal).
// charge() devolve false quando qualquer teto estoura: o chat responde 401 e o site abre o muro.
export function anonCaller(req, res, { limits = anonLimits() } = {}) {
 if (limits.perVisitor <= 0) return null;
 let id = readAnonId(req);
 if (!id) {
  id = randomUUID();
  appendCookie(res, `${ANON_COOKIE}=${anonCookieValue(id)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_DAYS * 86400}`);
 }
 const ip = ipKey(clientIp(req));
 let charged = false;
 return {
  anon: true, id, service: true, perfil: 'profissional',
  headers: { 'X-2Doctor-Chave': process.env.TWO_DOCTOR_SERVICE_KEY || '', 'X-2Doctor-Usuario': id },
  path: (p) => p.replace(/^\/estudante\/(?:2doctor\/|tutor\/)?/, '/servico/2doctor/'),
  async charge(kind) {
   if (kind !== 'chat') return false;
   if (limits.perMinute > 0 && !throttle('anon:' + ip, limits.perMinute)) return false;
   const n = await bumpVisitor(id, limits.perVisitor);
   if (n == null) return false;
   if ((await bumpDay(ip, limits.perIp)) == null) { await undoVisitor(id); return false; }
   if ((await bumpDay('global', limits.global)) == null) { await undoDay(ip); await undoVisitor(id); return false; }
   charged = true;
   res.setHeader('X-2Doctor-Anon-Left', String(Math.max(0, limits.perVisitor - n)));
   return true;
  },
  // A IA falhou antes de responder: devolve a pergunta ao visitante (e aos tetos).
  async refund() {
   if (!charged) return;
   charged = false;
   res.removeHeader?.('X-2Doctor-Anon-Left');
   await Promise.all([undoVisitor(id), undoDay(ip), undoDay('global')]).catch(() => {});
  },
 };
}
