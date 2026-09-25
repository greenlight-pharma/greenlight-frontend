import React,{createContext,useContext,useState,useEffect,useMemo} from 'react';
import {Globe2} from 'lucide-react';
import {languages,countries,loadPreferences} from '../../shared/international.mjs';
import {translate} from '../../shared/i18n/catalog.mjs';
const Context=createContext({locale:'pt-BR',country:'global',t:text=>text});
export function I18nProvider({enabled,children}){
 const [preferences,setPreferences]=useState(()=>{if(!enabled)return {locale:'pt-BR',country:'global'};try{return loadPreferences(window.localStorage,navigator.language);}catch{return loadPreferences(null,navigator.language);}});
 useEffect(()=>{if(!enabled)return;document.documentElement.lang=preferences.locale;try{localStorage.setItem('2doctor-international',JSON.stringify(preferences));}catch{}},[preferences,enabled]);
 const value=useMemo(()=>({...preferences,setPreferences,t:text=>translate(preferences.locale,text)}),[preferences]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useI18n=()=>useContext(Context);
export function LanguageSettings(){const {locale,country,t,setPreferences}=useI18n();const names=new Intl.DisplayNames([locale],{type:'region'});return <details className="doctor-language" onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}}}><summary aria-label={t('Suporte a idiomas')}><Globe2 size={18}/><span>{locale==='pt-BR'?'PT':locale.toUpperCase()}</span></summary><div className="doctor-language-panel"><label>{t('Idioma')}<select value={locale} onChange={e=>setPreferences(p=>({...p,locale:e.target.value}))}>{languages.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select></label><label>{t('País de referência')}<select value={country} onChange={e=>setPreferences(p=>({...p,country:e.target.value}))}>{countries.map(c=><option key={c} value={c}>{c==='global'?t('Sem país definido'):c==='other'?t('Outro país'):names.of(c)}</option>)}</select></label><p>{t('O país orienta o contexto da conversa. Não confirma validação clínica local.')}</p></div></details>}
export function LibraryLanguageNotice(){const{locale,t}=useI18n();return locale==='pt-BR'?null:<p className="doctor-language-notice" role="note">{t('Conteúdo desta biblioteca em português. A tradução do acervo está em preparação.')}</p>;}
