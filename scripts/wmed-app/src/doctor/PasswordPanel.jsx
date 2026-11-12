// Trocar (ou criar, na conta só com Google) a senha da conta 2Doctor, com a sessão aberta.
import { useState } from 'react';
import { useI18n } from './I18n';

export default function PasswordPanel({ api, user, onChanged }) {
 const { t, locale } = useI18n();
 const [open, setOpen] = useState(false), [current, setCurrent] = useState(''), [next, setNext] = useState(''), [repeat, setRepeat] = useState('');
 const [busy, setBusy] = useState(false), [error, setError] = useState(''), [done, setDone] = useState('');
 const temSenha = user?.temSenha !== false;
 async function save(e) {
  e.preventDefault(); setError(''); setDone('');
  if (next.length < 8) return setError(t('A nova senha precisa ter pelo menos 8 caracteres.'));
  if (next !== repeat) return setError(t('As senhas não conferem.'));
  setBusy(true);
  try {
   const r = await fetch(`${api}/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1' }, body: JSON.stringify({ action: 'trocar', current, password: next, locale: locale.slice(0, 2) }) });
   const d = await r.json().catch(() => ({}));
   if (!r.ok) throw Error(d.error || t('Não foi possível trocar a senha.'));
   setDone(d.message); setCurrent(''); setNext(''); setRepeat(''); setOpen(false); onChanged?.(d.user);
  } catch (err) { setError(err.message); } finally { setBusy(false); }
 }
 return <section className="plan-panel password-panel" aria-labelledby="password-title">
  <div className="plan-head"><h3 id="password-title">{t('Senha')}</h3>{!open && <button type="button" className="password-toggle" onClick={() => { setOpen(true); setDone(''); }}>{temSenha ? t('Trocar senha') : t('Criar senha')}</button>}</div>
  {!open && <p>{done || (temSenha ? t('Use pelo menos 8 caracteres. Ao trocar, as outras sessões são encerradas.') : t('Sua conta entra com o Google. Crie uma senha para entrar também com e-mail.'))}</p>}
  {open && <form onSubmit={save} className="password-form">
   {temSenha && <label>{t('Senha atual')}<input type="password" autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} required /></label>}
   <label>{t('Nova senha')}<input type="password" autoComplete="new-password" minLength={8} maxLength={200} value={next} onChange={e => setNext(e.target.value)} required /></label>
   <label>{t('Repita a nova senha')}<input type="password" autoComplete="new-password" minLength={8} maxLength={200} value={repeat} onChange={e => setRepeat(e.target.value)} required /></label>
   {error && <p role="alert" className="error">{error}</p>}
   <div className="password-actions"><button type="button" onClick={() => { setOpen(false); setError(''); }} disabled={busy}>{t('Cancelar')}</button><button type="submit" className="plan-manage" disabled={busy}>{busy ? t('Salvando…') : t('Salvar nova senha')}</button></div>
  </form>}
 </section>;
}
