import {useState,useEffect,useRef} from 'react';
import {X,LockKeyhole,ArrowRight} from 'lucide-react';
import {t,lang} from './i18n';
// Entrar ou criar conta WMed (e-mail e senha). A senha nunca fica no navegador; a sessão é um cookie HttpOnly.
export default function AuthDialog({api,onClose,onSuccess,initialMode='login'}){
 const [mode,setMode]=useState(initialMode),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[terms,setTerms]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');const root=useRef(null),controller=useRef(null);
 const signup=mode==='signup';
 useEffect(()=>{const previous=document.activeElement;return()=>{controller.current?.abort();previous?.focus?.();};},[]);
 function keys(e){if(e.key==='Escape'&&!busy)onClose();if(e.key==='Tab'){const all=[...root.current.querySelectorAll('button,input,a')].filter(el=>!el.disabled);if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0]?.focus();}}}
 async function submit(e){e.preventDefault();if(busy)return;setBusy(true);setError('');controller.current=new AbortController();
  try{const r=await fetch(`${api}/auth`,{method:'POST',headers:{'Content-Type':'application/json','X-WMed-Request':'1','X-WMed-Lang':lang},body:JSON.stringify(signup?{action:'signup',name:name.trim(),email:email.trim(),password,acceptTerms:terms,locale:lang}:{action:'login',email:email.trim(),password}),signal:controller.current.signal});
   const data=await r.json();if(!r.ok||!data.authenticated)throw Error(data.error||t('Não foi possível entrar.'));setPassword('');onSuccess(data);}
  catch(e){if(e.name!=='AbortError')setError(t(e.message));}finally{setBusy(false);}}
 function switchMode(next){setMode(next);setError('');}
 return <div className="modal-shade" onClick={()=>{if(!busy)onClose();}}><section ref={root} onKeyDown={keys} className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={e=>e.stopPropagation()}><button className="icon-btn close" disabled={busy} aria-label={t("Fechar entrada")} onClick={onClose}><X/></button><div className="auth-icon"><LockKeyhole size={22}/></div><span className="eyebrow blue">{t("SUA CONTA WMED")}</span>
 <h2 id="login-title">{signup?t("Crie sua conta."):t("Entre para continuar.")}</h2><p>{signup?t("Comece grátis. Pergunte ao assistente e guarde suas conversas na sua conta."):t("Use o e-mail e a senha da sua conta WMed.")}</p>
 <div className="mode-tabs auth-tabs" role="group" aria-label={t("Entrar ou criar conta")}><button type="button" aria-pressed={!signup} onClick={()=>switchMode('login')}>{t("Entrar")}</button><button type="button" aria-pressed={signup} onClick={()=>switchMode('signup')}>{t("Criar conta")}</button></div>
 <form onSubmit={submit}>{signup&&<><label htmlFor="wmed-name">{t("Nome")}</label><input autoFocus id="wmed-name" name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={e=>setName(e.target.value)} disabled={busy}/></>}
 <label htmlFor="wmed-email">{t("E-mail")}</label><input autoFocus={!signup} id="wmed-email" name="username" type="email" autoComplete="username" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/>
 <label htmlFor="wmed-password">{t("Senha")}</label><input id="wmed-password" name="password" type="password" autoComplete={signup?'new-password':'current-password'} required minLength={signup?10:1} maxLength={200} value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/>{signup&&<small className="auth-hint">{t("Mínimo de 10 caracteres.")}</small>}
 {signup&&<label className="confirm-row auth-terms"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} disabled={busy} required/>{t("Li e aceito os termos de uso e a política de privacidade da WMed.")}</label>}
 {error&&<p role="alert" className="error">{error}</p>}<button className="auth-submit" disabled={busy||(signup&&!terms)}>{busy?(signup?t('Criando conta…'):t('Entrando…')):(signup?t('Criar conta grátis'):t('Entrar no WMed'))}<ArrowRight size={17}/></button></form>
 <button type="button" className="auth-help" onClick={()=>switchMode(signup?'login':'signup')}>{signup?t("Já tem conta? Entrar"):t("Não tem conta? Criar conta grátis")}</button>
 <p className="modal-note">{t("A senha não fica salva no navegador. A sessão usa um cookie protegido. A pesquisa de artigos pode ser usada sem entrar.")}</p></section></div>;
}
