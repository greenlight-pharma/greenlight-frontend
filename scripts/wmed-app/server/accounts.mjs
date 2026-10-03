// Contas próprias do 2Doctor: cadastro com e-mail e senha, entrada com Google, sessão em cookie
// HttpOnly e limites diários de uso. A IA continua na API Vytal, chamada com a chave de serviço
// do 2Doctor (nunca com conta Vytal). Só o servidor do Railway usa este módulo.
import { randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { q } from './db.mjs';
import { perfilValido, perfilEfetivo, TERMOS_PACIENTE_VERSAO } from '../shared/patient-mode.mjs';

const scrypt = promisify(scryptCb);
export const COOKIE = '__Host-2d_sessao';
const OAUTH_COOKIE = '2d_oauth';
const SESSION_DAYS = 30;
const API = 'https://vytal-api-production.up.railway.app';

// Limites por pessoa e por dia (UTC). "IA ilimitada" para uso normal; o teto só barra abuso.
export const DAILY_LIMITS = { chat: 300, feedback: 40, quality: 80, structure: 80, transcribe: 60, images: 600, privacy: 60 };
// Plano gratuito (decisão do Dilson, 26/09): mesmas funções, limite diário menor.
export const FREE_LIMITS = { chat: 20, feedback: 3, quality: 6, structure: 6, transcribe: 5, images: 100, privacy: 10 };
const ATIVOS = new Set(['active', 'trialing', 'past_due']);
// Pro pela assinatura ativa ou por cortesia dada no painel de administração (com prazo).
export const cortesiaAtiva = (u) => !!u?.cortesia_ate && new Date(u.cortesia_ate) > new Date();
export const planOf = (u) => ((u?.plano === 'pro' && ATIVOS.has(u?.assinatura_status)) || cortesiaAtiva(u) ? 'pro' : 'gratis');

const TEXT = {
 pt: {
  invalid: 'Confira os dados enviados.', email: 'Informe um e-mail válido.', password: 'A senha precisa ter de 8 a 200 caracteres.',
  name: 'Informe seu nome (até 80 caracteres).', exists: 'Já existe uma conta com este e-mail. Entre ou redefina a senha.',
  wrong: 'E-mail ou senha incorretos.', google: 'Esta conta usa o Google. Entre com o Google ou redefina a senha.',
  tooMany: 'Muitas tentativas. Aguarde um minuto.', unavailable: 'Serviço indisponível no momento. Tente novamente.',
  resetSent: 'Se houver uma conta com este e-mail, enviamos um link para redefinir a senha.',
  resetInvalid: 'Link inválido ou vencido. Peça um novo.', resetOk: 'Senha alterada. Você já está conectado.',
  login: 'Entre na sua conta 2Doctor para continuar.', quota: 'Você atingiu o limite de uso de hoje. Volte amanhã.',
  origin: 'Atualize a página antes de continuar.', googleOff: 'Entrada com Google indisponível no momento.',
  subjectReset: 'Redefinir sua senha do 2Doctor', subjectVerify: 'Confirme seu e-mail no 2Doctor',
  bodyReset: 'Recebemos um pedido para redefinir sua senha. O link vale por 1 hora:', bodyVerify: 'Confirme seu e-mail para proteger sua conta:',
  ignore: 'Se não foi você, ignore esta mensagem.',
  currentWrong: 'Senha atual incorreta.', changed: 'Senha alterada. As outras sessões foram encerradas.',
  perfil: 'Escolha quem você é.', terms: 'Para usar como paciente, aceite os termos para pacientes.', perfilOk: 'Perfil atualizado.',
 },
 en: {
  invalid: 'Check the information you sent.', email: 'Enter a valid email.', password: 'Your password must have 8 to 200 characters.',
  name: 'Enter your name (up to 80 characters).', exists: 'There is already an account with this email. Sign in or reset your password.',
  wrong: 'Incorrect email or password.', google: 'This account uses Google. Continue with Google or reset your password.',
  tooMany: 'Too many attempts. Wait a minute.', unavailable: 'Service unavailable right now. Try again.',
  resetSent: 'If there is an account with this email, we sent a link to reset your password.',
  resetInvalid: 'Invalid or expired link. Request a new one.', resetOk: 'Password changed. You are signed in.',
  login: 'Sign in to your 2Doctor account to continue.', quota: 'You reached today\'s usage limit. Come back tomorrow.',
  origin: 'Reload the page before continuing.', googleOff: 'Google sign-in is unavailable right now.',
  subjectReset: 'Reset your 2Doctor password', subjectVerify: 'Confirm your email on 2Doctor',
  bodyReset: 'We received a request to reset your password. The link is valid for 1 hour:', bodyVerify: 'Confirm your email to protect your account:',
  ignore: 'If this wasn\'t you, ignore this message.',
  currentWrong: 'Current password is incorrect.', changed: 'Password changed. Your other sessions were signed out.',
  perfil: 'Choose who you are.', terms: 'To use 2Doctor as a patient, accept the terms for patients.', perfilOk: 'Profile updated.',
 },
 es: {
  invalid: 'Revisa los datos enviados.', email: 'Ingresa un correo válido.', password: 'La contraseña debe tener de 8 a 200 caracteres.',
  name: 'Ingresa tu nombre (hasta 80 caracteres).', exists: 'Ya existe una cuenta con este correo. Inicia sesión o restablece la contraseña.',
  wrong: 'Correo o contraseña incorrectos.', google: 'Esta cuenta usa Google. Continúa con Google o restablece la contraseña.',
  tooMany: 'Demasiados intentos. Espera un minuto.', unavailable: 'Servicio no disponible en este momento. Inténtalo de nuevo.',
  resetSent: 'Si existe una cuenta con este correo, enviamos un enlace para restablecer la contraseña.',
  resetInvalid: 'Enlace inválido o vencido. Solicita uno nuevo.', resetOk: 'Contraseña cambiada. Ya iniciaste sesión.',
  login: 'Inicia sesión en tu cuenta 2Doctor para continuar.', quota: 'Alcanzaste el límite de uso de hoy. Vuelve mañana.',
  origin: 'Actualiza la página antes de continuar.', googleOff: 'El acceso con Google no está disponible en este momento.',
  subjectReset: 'Restablece tu contraseña de 2Doctor', subjectVerify: 'Confirma tu correo en 2Doctor',
  bodyReset: 'Recibimos una solicitud para restablecer tu contraseña. El enlace vale por 1 hora:', bodyVerify: 'Confirma tu correo para proteger tu cuenta:',
  ignore: 'Si no fuiste tú, ignora este mensaje.',
  currentWrong: 'La contraseña actual es incorrecta.', changed: 'Contraseña cambiada. Se cerraron tus otras sesiones.',
  perfil: 'Elige quién eres.', terms: 'Para usar 2Doctor como paciente, acepta los términos para pacientes.', perfilOk: 'Perfil actualizado.',
 },
};
export function lang(req, fallback) {
 const pick = (v) => { const l = String(v || '').slice(0, 2).toLowerCase(); return TEXT[l] ? l : null; };
 return pick(fallback) || pick(req.headers?.['x-2doctor-idioma']) || pick(req.headers?.['accept-language']) || 'en';
}
export const t = (l, key) => (TEXT[l] || TEXT.en)[key] || TEXT.en[key];

function reply(res, status, data, extra = {}) {
 res.statusCode = status;
 res.setHeader('Content-Type', 'application/json; charset=utf-8');
 res.setHeader('Cache-Control', 'private, no-store');
 res.setHeader('X-Content-Type-Options', 'nosniff');
 for (const [k, v] of Object.entries(extra)) res.setHeader(k, v);
 res.end(JSON.stringify(data));
}
async function readJson(req, max = 16000) {
 let data = req.body;
 if (data == null) { data = ''; for await (const c of req) { data += c; if (Buffer.byteLength(data) > max) throw Error('BODY'); } }
 if (typeof data === 'string' || Buffer.isBuffer(data)) { if (Buffer.byteLength(data) > max) throw Error('BODY'); data = JSON.parse(String(data)); }
 return data && typeof data === 'object' ? data : {};
}
const sha = (v) => createHash('sha256').update(v).digest('hex');
const cookies = (req) => Object.fromEntries(String(req.headers.cookie || '').split(';').map((c) => c.trim()).filter(Boolean).map((c) => [c.slice(0, c.indexOf('=')), c.slice(c.indexOf('=') + 1)]));
export const publicOrigin = () => (process.env.PUBLIC_ORIGIN || 'https://www.2doctor.ai').replace(/\/$/, '');

// Pedidos que mudam algo só vêm do próprio site (mesma origem) com o cabeçalho do app.
export function sameSite(req) {
 const origin = req.headers.origin;
 if (req.headers['x-wmed-request'] !== '1' || !origin) return false;
 try {
  const u = new URL(origin);
  if (u.origin === publicOrigin()) return true;
  return process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(u.hostname);
 } catch { return false; }
}

// ---- senha (scrypt, sal por usuário) ----
export async function hashPassword(password) {
 const salt = randomBytes(16);
 const key = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
 return `scrypt$16384$8$1$${salt.toString('base64')}$${key.toString('base64')}`;
}
export async function checkPassword(password, stored) {
 const [kind, N, r, p, salt, hash] = String(stored || '').split('$');
 if (kind !== 'scrypt') return false;
 const expected = Buffer.from(hash, 'base64');
 const key = await scrypt(password, Buffer.from(salt, 'base64'), expected.length, { N: +N, r: +r, p: +p, maxmem: 64 * 1024 * 1024 });
 return timingSafeEqual(key, expected);
}

// ---- sessão ----
function sessionCookie(token, maxAge) {
 return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
async function startSession(userId) {
 const token = randomBytes(32).toString('base64url');
 await q(`insert into sessoes (token_hash, usuario_id, expira_em) values ($1, $2, now() + interval '${SESSION_DAYS} days')`, [sha(token), userId]);
 await q('update usuarios set ultimo_acesso = now() where id = $1', [userId]);
 return sessionCookie(token, SESSION_DAYS * 86400);
}
export async function currentUser(req) {
 const token = cookies(req)[COOKIE];
 if (!token || !/^[A-Za-z0-9_-]{30,80}$/.test(token)) return null;
 const { rows } = await q(`select u.id, u.email, u.nome, u.email_verificado, u.google_sub is not null as google, u.senha_hash is not null as tem_senha, u.plano, u.assinatura_status, u.perfil, u.termos_paciente, u.cortesia_ate
   from sessoes s join usuarios u on u.id = s.usuario_id where s.token_hash = $1 and s.expira_em > now()`, [sha(token)]);
 const user = rows[0] || null;
 // Último acesso para o painel: no máximo uma escrita a cada 10 minutos por pessoa.
 if (user) q(`update usuarios set ultimo_acesso = now() where id = $1 and (ultimo_acesso is null or ultimo_acesso < now() - interval '10 minutes')`, [user.id]).catch(() => {});
 return user;
}
function publicUser(u) {
 return { nome: String(u.nome || u.email.split('@')[0]).split(' ')[0].slice(0, 60), email: u.email, emailVerificado: u.email_verificado,
  progressScope: sha('2doctor-progress:' + u.id), conta: '2doctor', plano: planOf(u), temSenha: u.tem_senha ?? !!u.senha_hash,
  perfil: perfilEfetivo(u.perfil), termosPaciente: u.termos_paciente === TERMOS_PACIENTE_VERSAO };
}

// ---- limites ----
const attempts = new Map();
export function throttle(key, max = 8, now = Date.now()) {
 for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
 const rec = attempts.get(key) || { n: 0, until: now + 60000 };
 if (rec.n >= max || (attempts.size > 20000 && !attempts.has(key))) return false;
 rec.n++; attempts.set(key, rec); return true;
}
export async function charge(userId, kind, plan) {
 if (!plan) { const { rows } = await q('select plano, assinatura_status, cortesia_ate from usuarios where id = $1', [userId]); plan = planOf(rows[0]); }
 const limit = (plan === 'pro' ? DAILY_LIMITS : FREE_LIMITS)[kind];
 if (!limit) return true;
 const { rows } = await q(`insert into uso_diario (usuario_id, dia, tipo, n) values ($1, (now() at time zone 'utc')::date, $2, 1)
   on conflict (usuario_id, dia, tipo) do update set n = uso_diario.n + 1 returning n`, [userId, kind]);
 return rows[0].n <= limit;
}

// Identidade usada pelos proxies (chat, feedback etc.): chave de serviço + id da pessoa.
export async function identify(req) {
 const user = await currentUser(req);
 if (!user) return null;
 const key = process.env.TWO_DOCTOR_SERVICE_KEY || '';
 return {
  id: user.id,
  headers: { 'X-2Doctor-Chave': key, 'X-2Doctor-Usuario': user.id },
  path: (p) => p.replace(/^\/estudante\/(?:2doctor\/|tutor\/)?/, '/servico/2doctor/'),
  charge: (kind) => charge(user.id, kind, planOf(user)),
  perfil: perfilEfetivo(user.perfil),
  user,
  // Credencial é a chave de serviço: 401/403 do upstream é falha do serviço, não da sessão.
  service: true,
 };
}

// ---- e-mail (Resend); sem chave configurada, o envio é pulado e registrado no log ----
async function sendEmail(to, subject, lines, link, { fetchImpl = fetch } = {}) {
 const key = process.env.RESEND_API_KEY;
 if (!key) { console.warn('[2doctor] e-mail não enviado: RESEND_API_KEY ausente', subject); return false; }
 const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
 const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#10201f"><p><b>2Doctor</b></p>${lines.map((l) => `<p>${esc(l)}</p>`).join('')}<p><a href="${esc(link)}" style="background:#005d5b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;display:inline-block">${esc(link.includes('redefinir') ? '2Doctor · ' + subject : '2Doctor')}</a></p><p style="color:#667">${esc(link)}</p></div>`;
 const r = await fetchImpl('https://api.resend.com/emails', {
  method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ from: process.env.EMAIL_FROM || '2Doctor <no-reply@2doctor.ai>', to: [to], subject, html }),
  signal: AbortSignal.timeout(10000),
 });
 if (!r.ok) console.warn('[2doctor] falha ao enviar e-mail', r.status);
 return r.ok;
}
async function emailToken(userId, tipo, hours) {
 const token = randomBytes(32).toString('base64url');
 await q(`insert into tokens_email (token_hash, usuario_id, tipo, expira_em) values ($1, $2, $3, now() + make_interval(hours => $4::int))`, [sha(token), userId, tipo, hours]);
 return token;
}

// Origem do cadastro (utm_source/ref guardado pelo site): só letras, números e . _ - : /, até 80.
export const cleanOrigin = (v) => (typeof v === 'string' && v.trim() ? v.trim().toLowerCase().replace(/[^a-z0-9._:\/-]/g, '').slice(0, 80) || null : null);

// Reenvio do e-mail de verificação (painel de administração).
export async function resendVerification(userId, { fetchImpl = fetch } = {}) {
 const { rows } = await q('select email, idioma, email_verificado from usuarios where id = $1', [userId]);
 const u = rows[0];
 if (!u) return { ok: false, motivo: 'nao-encontrado' };
 if (u.email_verificado) return { ok: false, motivo: 'ja-verificado' };
 const l = TEXT[u.idioma] ? u.idioma : 'en';
 const token = await emailToken(userId, 'verificar', 72);
 const sent = await sendEmail(u.email, t(l, 'subjectVerify'), [t(l, 'bodyVerify')], `${publicOrigin()}/api/wmed/auth/verificar?token=${token}`, { fetchImpl }).catch(() => false);
 return { ok: !!sent, motivo: sent ? null : (process.env.RESEND_API_KEY ? 'falha-envio' : 'email-desligado') };
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const googleOn = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export function authStatus() { return { auth: '2doctor', google: googleOn(), email: !!process.env.RESEND_API_KEY, billing: !!process.env.STRIPE_SECRET_KEY }; }

// /api/wmed/auth, /api/wmed/auth/google, /api/wmed/auth/google/retorno, /api/wmed/auth/verificar
export async function auth(req, res, { sub = '', fetchImpl = fetch } = {}) {
 const url = new URL(req.url || '/', 'http://x');
 try {
  if (sub === 'google' && req.method === 'GET') return googleStart(req, res, url);
  if (sub === 'google/retorno' && req.method === 'GET') return await googleReturn(req, res, url, fetchImpl);
  if (sub === 'verificar' && req.method === 'GET') return await verifyEmail(req, res, url);
  if (sub) return reply(res, 404, { error: 'Not found.' });
  if (req.method === 'GET') {
   const user = await currentUser(req);
   return reply(res, 200, user ? { authenticated: true, user: publicUser(user) } : { authenticated: false, ...authStatus() });
  }
  if (req.method === 'DELETE') return await logout(req, res);
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
  let b;
  try { b = await readJson(req); } catch { return reply(res, 400, { error: t(lang(req), 'invalid') }); }
  const l = lang(req, b.locale);
  if (!sameSite(req)) return reply(res, 403, { error: t(l, 'origin') });
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (!throttle('ip:' + ip, 12)) return reply(res, 429, { error: t(l, 'tooMany') });
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const action = b.action || 'entrar';
  if (action === 'sair') return await logout(req, res);
  if (action === 'redefinir') return await resetPassword(req, res, b, l);
  if (action === 'trocar') return await changePassword(req, res, b, l);
  if (action === 'perfil') return await changeProfile(req, res, b, l);
  if (!EMAIL_RE.test(email) || email.length > 254) return reply(res, 400, { error: t(l, 'email') });
  if (!throttle('email:' + email, 8)) return reply(res, 429, { error: t(l, 'tooMany') });
  if (action === 'esqueci') return await forgotPassword(res, email, l, fetchImpl);
  const password = typeof b.password === 'string' ? b.password : '';
  if (password.length < 8 || password.length > 200) return reply(res, 400, { error: t(l, 'password') });
  if (action === 'criar') {
   const nome = typeof b.nome === 'string' ? b.nome.trim().replace(/\s+/g, ' ') : '';
   if (!nome || nome.length > 80) return reply(res, 400, { error: t(l, 'name') });
   const perfil = b.perfil == null ? null : b.perfil;
   if (perfil !== null && !perfilValido(perfil)) return reply(res, 400, { error: t(l, 'perfil') });
   const termos = perfil === 'paciente' ? b.termosPaciente : null;
   if (perfil === 'paciente' && termos !== TERMOS_PACIENTE_VERSAO) return reply(res, 400, { error: t(l, 'terms'), code: 'PATIENT_TERMS' });
   const id = randomUUID();
   const { rowCount } = await q(`insert into usuarios (id, email, nome, senha_hash, idioma, pais, perfil, termos_paciente, termos_paciente_em, origem) values ($1, $2, $3, $4, $5, $6, $7, $8, case when $8::text is null then null else now() end, $9) on conflict (email) do nothing`,
    [id, email, nome, await hashPassword(password), l, typeof b.country === 'string' ? b.country.slice(0, 2).toUpperCase() : null, perfil, termos, cleanOrigin(b.origem)]);
   if (!rowCount) return reply(res, 409, { error: t(l, 'exists') });
   const token = await emailToken(id, 'verificar', 72);
   sendEmail(email, t(l, 'subjectVerify'), [t(l, 'bodyVerify')], `${publicOrigin()}/api/wmed/auth/verificar?token=${token}`, { fetchImpl }).catch(() => {});
   const user = { id, email, nome, email_verificado: false, tem_senha: true, perfil, termos_paciente: termos };
   return reply(res, 201, { authenticated: true, user: publicUser(user) }, { 'Set-Cookie': await startSession(id) });
  }
  if (action !== 'entrar') return reply(res, 400, { error: t(l, 'invalid') });
  const { rows } = await q('select id, email, nome, senha_hash, email_verificado, plano, assinatura_status, perfil, termos_paciente, cortesia_ate from usuarios where email = $1', [email]);
  const user = rows[0];
  if (user && !user.senha_hash) return reply(res, 401, { error: t(l, 'google') });
  // Sem conta, compara com um hash qualquer para o tempo de resposta não revelar se o e-mail existe.
  const ok = await checkPassword(password, user?.senha_hash || 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86) + '==');
  if (!user || !ok) return reply(res, 401, { error: t(l, 'wrong') });
  return reply(res, 200, { authenticated: true, user: publicUser(user) }, { 'Set-Cookie': await startSession(user.id) });
 } catch (e) {
  console.error('[2doctor] auth', e?.message);
  return reply(res, 503, { error: t(lang(req), 'unavailable') });
 }
}
async function logout(req, res) {
 const token = cookies(req)[COOKIE];
 if (token) await q('delete from sessoes where token_hash = $1', [sha(token)]);
 return reply(res, 200, { authenticated: false }, { 'Set-Cookie': sessionCookie('', 0) });
}
async function forgotPassword(res, email, l, fetchImpl) {
 const { rows } = await q('select id from usuarios where email = $1', [email]);
 if (rows[0]) {
  const token = await emailToken(rows[0].id, 'redefinir', 1);
  await sendEmail(email, t(l, 'subjectReset'), [t(l, 'bodyReset'), t(l, 'ignore')], `${publicOrigin()}/#redefinir=${token}`, { fetchImpl }).catch(() => {});
 }
 return reply(res, 200, { ok: true, message: t(l, 'resetSent') });
}
async function resetPassword(req, res, b, l) {
 const token = typeof b.token === 'string' ? b.token : '';
 const password = typeof b.password === 'string' ? b.password : '';
 if (password.length < 8 || password.length > 200) return reply(res, 400, { error: t(l, 'password') });
 if (!/^[A-Za-z0-9_-]{30,80}$/.test(token)) return reply(res, 400, { error: t(l, 'resetInvalid') });
 const { rows } = await q(`update tokens_email set usado_em = now() where token_hash = $1 and tipo = 'redefinir' and usado_em is null and expira_em > now() returning usuario_id`, [sha(token)]);
 if (!rows[0]) return reply(res, 400, { error: t(l, 'resetInvalid') });
 const id = rows[0].usuario_id;
 // O link chegou pelo e-mail: vale como confirmação do endereço. Sessões antigas caem.
 await q('update usuarios set senha_hash = $2, email_verificado = true where id = $1', [id, await hashPassword(password)]);
 await q('delete from sessoes where usuario_id = $1', [id]);
 const { rows: u } = await q('select id, email, nome, email_verificado, plano, assinatura_status, perfil, termos_paciente, cortesia_ate from usuarios where id = $1', [id]);
 return reply(res, 200, { authenticated: true, user: publicUser({ ...u[0], tem_senha: true }), message: t(l, 'resetOk') }, { 'Set-Cookie': await startSession(id) });
}
// Troca de senha com a sessão aberta. Conta só com Google cria a primeira senha sem pedir a atual.
async function changePassword(req, res, b, l) {
 const user = await currentUser(req);
 if (!user) return reply(res, 401, { error: t(l, 'login'), code: 'AUTH_REQUIRED' });
 if (!throttle('trocar:' + user.id, 6)) return reply(res, 429, { error: t(l, 'tooMany') });
 const password = typeof b.password === 'string' ? b.password : '';
 if (password.length < 8 || password.length > 200) return reply(res, 400, { error: t(l, 'password') });
 const { rows } = await q('select senha_hash from usuarios where id = $1', [user.id]);
 if (rows[0]?.senha_hash && !(await checkPassword(typeof b.current === 'string' ? b.current : '', rows[0].senha_hash))) return reply(res, 401, { error: t(l, 'currentWrong') });
 await q('update usuarios set senha_hash = $2 where id = $1', [user.id, await hashPassword(password)]);
 await q('delete from sessoes where usuario_id = $1 and token_hash <> $2', [user.id, sha(cookies(req)[COOKIE])]);
 return reply(res, 200, { ok: true, message: t(l, 'changed'), user: publicUser({ ...user, tem_senha: true }) });
}
// Troca de perfil em Conta. Virar paciente exige o aceite dos termos para pacientes (uma vez).
async function changeProfile(req, res, b, l) {
 const user = await currentUser(req);
 if (!user) return reply(res, 401, { error: t(l, 'login'), code: 'AUTH_REQUIRED' });
 if (!perfilValido(b.perfil)) return reply(res, 400, { error: t(l, 'perfil') });
 const aceitou = user.termos_paciente === TERMOS_PACIENTE_VERSAO || b.termosPaciente === TERMOS_PACIENTE_VERSAO;
 if (b.perfil === 'paciente' && !aceitou) return reply(res, 400, { error: t(l, 'terms'), code: 'PATIENT_TERMS' });
 const novoTermo = b.perfil === 'paciente' && user.termos_paciente !== TERMOS_PACIENTE_VERSAO;
 await q(`update usuarios set perfil = $2${novoTermo ? ', termos_paciente = $3, termos_paciente_em = now()' : ''} where id = $1`,
  novoTermo ? [user.id, b.perfil, TERMOS_PACIENTE_VERSAO] : [user.id, b.perfil]);
 return reply(res, 200, { ok: true, message: t(l, 'perfilOk'), user: publicUser({ ...user, perfil: b.perfil, termos_paciente: novoTermo ? TERMOS_PACIENTE_VERSAO : user.termos_paciente }) });
}
async function verifyEmail(req, res, url) {
 const token = url.searchParams.get('token') || '';
 let ok = false;
 if (/^[A-Za-z0-9_-]{30,80}$/.test(token)) {
  const { rows } = await q(`update tokens_email set usado_em = now() where token_hash = $1 and tipo = 'verificar' and usado_em is null and expira_em > now() returning usuario_id`, [sha(token)]);
  if (rows[0]) { ok = true; await q('update usuarios set email_verificado = true where id = $1', [rows[0].usuario_id]); }
 }
 res.writeHead(302, { Location: `/#${ok ? 'email-confirmado' : 'link-invalido'}`, 'Cache-Control': 'no-store' });
 res.end();
}

// ---- Google (OpenID Connect, código + PKCE) ----
const redirectUri = () => `${publicOrigin()}/api/wmed/auth/google/retorno`;
// Perfil escolhido no cadastro antes do Google (só vale para conta nova; paciente exige termos).
export function googlePerfil(url) {
 const perfil = url.searchParams.get('perfil');
 if (!perfilValido(perfil)) return '';
 if (perfil === 'paciente' && url.searchParams.get('termos') !== TERMOS_PACIENTE_VERSAO) return '';
 return perfil;
}
function googleStart(req, res, url) {
 if (!googleOn()) { res.writeHead(302, { Location: '/#google-indisponivel' }); return res.end(); }
 const state = randomBytes(16).toString('base64url');
 const verifier = randomBytes(32).toString('base64url');
 const challenge = createHash('sha256').update(verifier).digest('base64url');
 const l = lang(req, url.searchParams.get('idioma'));
 const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri(), response_type: 'code', scope: 'openid email profile',
  state, code_challenge: challenge, code_challenge_method: 'S256', prompt: 'select_account', hl: l });
 res.writeHead(302, { Location: 'https://accounts.google.com/o/oauth2/v2/auth?' + params, 'Cache-Control': 'no-store',
  'Set-Cookie': `${OAUTH_COOKIE}=${state}.${verifier}.${l}.${googlePerfil(url)}.${Buffer.from(cleanOrigin(url.searchParams.get('origem')) || '').toString('base64url')}; Path=/api/wmed/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600` });
 res.end();
}
async function googleReturn(req, res, url, fetchImpl) {
 const done = (hash, cookie) => {
  const headers = { Location: '/#' + hash, 'Cache-Control': 'no-store', 'Set-Cookie': [`${OAUTH_COOKIE}=; Path=/api/wmed/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0`, ...(cookie ? [cookie] : [])] };
  res.writeHead(302, headers); res.end();
 };
 const [state, verifier, l, perfilCookie, o64] = String(cookies(req)[OAUTH_COOKIE] || '').split('.');
 const perfil = perfilValido(perfilCookie) ? perfilCookie : null;
 const origem = cleanOrigin(Buffer.from(o64 || '', 'base64url').toString());
 const code = url.searchParams.get('code');
 if (!googleOn() || !state || !verifier || url.searchParams.get('state') !== state || !code) return done('google-falhou');
 const tok = await fetchImpl('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri(), grant_type: 'authorization_code', code_verifier: verifier }),
  signal: AbortSignal.timeout(10000) });
 if (!tok.ok) return done('google-falhou');
 const { access_token } = await tok.json();
 const info = await fetchImpl('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${access_token}` }, signal: AbortSignal.timeout(10000) });
 if (!info.ok) return done('google-falhou');
 const g = await info.json();
 if (typeof g.sub !== 'string' || typeof g.email !== 'string' || g.email_verified !== true) return done('google-falhou');
 const email = g.email.trim().toLowerCase();
 const nome = typeof g.name === 'string' ? g.name.slice(0, 80) : null;
 // Mesmo e-mail já cadastrado com senha: o Google confirmou o endereço, então vincula.
 // Perfil e termos só entram na conta nova (conta existente mantém o que já tinha).
 const { rows } = await q(`insert into usuarios (id, email, nome, google_sub, email_verificado, idioma, perfil, termos_paciente, termos_paciente_em, origem) values ($1, $2, $3, $4, true, $5, $6, $7, case when $7::text is null then null else now() end, $8)
   on conflict (email) do update set google_sub = coalesce(usuarios.google_sub, excluded.google_sub), email_verificado = true, nome = coalesce(usuarios.nome, excluded.nome)
   returning id, google_sub, (xmax = 0) as novo`, [randomUUID(), email, nome, g.sub, l || 'en', perfil, perfil === 'paciente' ? TERMOS_PACIENTE_VERSAO : null, origem]);
 if (rows[0].google_sub !== g.sub) return done('google-falhou');
 return done(rows[0].novo ? 'entrou-novo' : 'entrou', await startSession(rows[0].id));
}

// ---- guarda para proxies que precisam de conta (casos, histórico) ----
export async function requireUser(req, res) {
 const l = lang(req);
 if (req.method !== 'GET' && !sameSite(req)) { reply(res, 403, { error: t(l, 'origin') }); return null; }
 const user = await currentUser(req).catch(() => undefined);
 if (user === undefined) { reply(res, 503, { error: t(l, 'unavailable') }); return null; }
 if (!user) { reply(res, 401, { error: t(l, 'login'), code: 'AUTH_REQUIRED' }); return null; }
 return user;
}
export { reply, readJson, API };
