// Idiomas da interface WMed. O texto-fonte fica em português dentro de t('…'); en.js traz a versão em inglês.
// Ordem de escolha: ?lang= na URL → escolha salva → domínio (wmed.ai usa o idioma do navegador; o site Vytal usa português).
// Trocar de idioma recarrega a página (o idioma é lido uma vez, sem estado global reativo).
import EN from './i18n/en.js';
export const LANGS=[['pt','Português'],['en','English']];
const valid=l=>l==='pt'||l==='en';
function detect(){
 try{const q=new URLSearchParams(location.search).get('lang');if(valid(q)){try{localStorage.setItem('wmed-lang',q);}catch{}return q;}}catch{}
 try{const saved=localStorage.getItem('wmed-lang');if(valid(saved))return saved;}catch{}
 const international=/(^|\.)wmed\.ai$/i.test(location.hostname);
 if(!international)return 'pt';
 const prefs=(navigator.languages?.length?navigator.languages:[navigator.language||'']).map(s=>String(s).toLowerCase());
 return prefs.some(s=>s.startsWith('pt'))?'pt':'en';
}
export const lang=detect();
export const locale=lang==='en'?'en-US':'pt-BR';
if(typeof document!=='undefined'){document.documentElement.lang=lang==='en'?'en':'pt-BR';if(lang==='en')document.title=EN['WMed · Evidências em perspectiva'];}
// t('Texto com {nome}', {nome}) — sem tradução cadastrada, devolve o português (nunca uma chave vazia)
export function t(text,vars){
 let out=lang==='en'&&typeof text==='string'?(EN[text]??text):text;
 if(vars&&typeof out==='string')out=out.replace(/\{(\w+)\}/g,(m,k)=>k in vars?String(vars[k]):m);
 return out;
}
export function setLang(next){
 if(!valid(next)||next===lang)return;
 try{localStorage.setItem('wmed-lang',next);}catch{}
 const u=new URL(location.href);u.searchParams.delete('lang');location.replace(u.href);
}

// marca um texto como traduzível sem traduzir agora (listas de dados exibidas depois com t())
export const msg=text=>text;
