// Formulários da conta própria do 2Doctor (entrar, criar conta, esqueci a senha, nova senha).
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from './I18n';
import { ProfileChoice } from './Patient';
import { TERMOS_PACIENTE_VERSAO } from '../../shared/patient-mode.mjs';
import { trackRegistration } from './pixel';
import { signupOrigin } from './origem';

function GoogleMark() {
 return <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>;
}

export default function DoctorAccount({ api, google, resetToken, onMode, busy, setBusy, onSuccess, controller }) {
 const { t, locale, country } = useI18n();
 const [mode, setMode] = useState(resetToken ? 'redefinir' : 'entrar');
 const [nome, setNome] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
 const [error, setError] = useState(''), [notice, setNotice] = useState('');
 const [perfil, setPerfil] = useState(null), [terms, setTerms] = useState(false);
 const perfilPronto = !!perfil && (perfil !== 'paciente' || terms);
 const lang = locale.slice(0, 2);
 function go(next) { setMode(next); onMode?.(next); setError(''); setNotice(''); setPassword(''); }
 async function submit(e) {
  e.preventDefault(); if (busy) return;
  if (mode === 'criar' && !perfilPronto) { setError(perfil === 'paciente' ? t('Aceite os termos para pacientes para continuar.') : t('Quem é você?')); return; }
  setBusy(true); setError(''); setNotice('');
  controller.current = new AbortController();
  const action = { entrar: 'entrar', criar: 'criar', esqueci: 'esqueci', redefinir: 'redefinir' }[mode];
  const body = { action, locale: lang, email: email.trim(), ...(mode !== 'esqueci' ? { password } : {}), ...(mode === 'criar' ? { nome: nome.trim(), country, perfil, ...(perfil === 'paciente' ? { termosPaciente: TERMOS_PACIENTE_VERSAO } : {}), origem: signupOrigin() || undefined } : {}), ...(mode === 'redefinir' ? { token: resetToken } : {}) };
  try {
   const r = await fetch(`${api}/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1', 'X-2Doctor-Idioma': lang }, body: JSON.stringify(body), signal: controller.current.signal });
   const data = await r.json();
   if (!r.ok) throw Error(data.error || t('Não foi possível entrar.'));
   if (mode === 'esqueci') { setNotice(data.message); return; }
   if (!data.authenticated) throw Error(t('Não foi possível entrar.'));
   setPassword(''); if (mode === 'criar') trackRegistration(); onSuccess(data);
  } catch (e) { if (e.name !== 'AbortError') setError(e.message); } finally { setBusy(false); }
 }
 const googleButton = google && mode !== 'redefinir' && mode !== 'esqueci' && <>
  <a className="auth-google" href={`${api}/auth/google?idioma=${lang}${mode === 'criar' && perfilPronto ? `&perfil=${perfil}${perfil === 'paciente' ? `&termos=${TERMOS_PACIENTE_VERSAO}` : ''}` : ''}${signupOrigin() ? '&origem=' + encodeURIComponent(signupOrigin()) : ''}`} aria-disabled={busy || (mode === 'criar' && !perfilPronto)} onClick={(e) => { if (mode === 'criar' && !perfilPronto) { e.preventDefault(); setError(perfil === 'paciente' ? t('Aceite os termos para pacientes para continuar.') : t('Quem é você?')); } }}><GoogleMark /> {t('Continuar com Google')}</a>
  <p className="auth-or"><span>{t('ou')}</span></p>
 </>;
 const intro = { entrar: t('Entre para salvar suas conversas e casos.'), criar: t('Crie sua conta gratuita em segundos.'), esqueci: t('Informe seu e-mail para receber um link de nova senha.'), redefinir: t('Escolha uma nova senha para sua conta.') }[mode];
 const submitLabel = busy ? t('Aguarde…') : { entrar: t('Entrar na 2Doctor'), criar: t('Criar conta'), esqueci: t('Enviar link'), redefinir: t('Salvar nova senha') }[mode];
 return <>
  <p>{intro}</p>
  {mode === 'criar' && <ProfileChoice perfil={perfil} setPerfil={setPerfil} terms={terms} setTerms={setTerms} disabled={busy} />}
  {googleButton}
  <form onSubmit={submit}>
   {mode === 'criar' && <><label htmlFor="doctor-name">{t('Nome')}</label><input id="doctor-name" name="name" autoComplete="name" required maxLength={80} value={nome} onChange={(e) => setNome(e.target.value)} disabled={busy} /></>}
   {mode !== 'redefinir' && <><label htmlFor="wmed-email">{t('E-mail')}</label><input id="wmed-email" name="username" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /></>}
   {mode !== 'esqueci' && <><label htmlFor="wmed-password">{mode === 'redefinir' ? t('Nova senha') : t('Senha')}</label><input id="wmed-password" name="password" type="password" autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'} required minLength={8} maxLength={200} value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />{mode !== 'entrar' && <small className="auth-hint">{t('Mínimo de 8 caracteres.')}</small>}</>}
   {error && <p role="alert" className="error">{error}</p>}
   {notice && <p role="status" className="notice">{notice}</p>}
   <button className="auth-submit" disabled={busy}>{submitLabel}<ArrowRight size={17} /></button>
  </form>
  <div className="auth-links">
   {mode === 'entrar' && <><button type="button" onClick={() => go('esqueci')}>{t('Esqueci minha senha')}</button><button type="button" onClick={() => go('criar')}>{t('Criar conta')}</button></>}
   {mode !== 'entrar' && <button type="button" onClick={() => go('entrar')}>{t('Já tenho conta')}</button>}
  </div>
  {mode === 'criar' && <p className="modal-note">{t('Ao criar a conta, você concorda com o uso educacional da 2Doctor. Não insira dados que identifiquem pacientes.')} <a href={`/privacy?lang=${lang}`} target="_blank" rel="noopener noreferrer">{t('Política de privacidade')}</a></p>}
 </>;
}
