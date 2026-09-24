// Favoritos e anotações da conta (cache em memória + API). Uso: useFavorites() nos componentes.
import {useSyncExternalStore} from 'react';
import {lang} from './i18n';
const API=import.meta.env.VITE_PUBLIC_PREVIEW==='true'?'/api/wmed':'/api';
let state={signedIn:false,loading:false,items:new Map(),error:''},listeners=new Set(),requestLogin=()=>{};
const keyOf=(kind,ref)=>`${kind}:${ref}`;
function emit(next){state={...state,...next};listeners.forEach(l=>l());}
async function call(body){
 const r=await fetch(`${API}/favorites`,{method:'POST',headers:{'Content-Type':'application/json','X-WMed-Request':'1','X-WMed-Lang':lang},body:JSON.stringify(body)});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(Error(d.error||'Erro'),{status:r.status});return d;
}
export const favorites={
 // chamado pelo app quando a sessão muda
 async setSession(signedIn,onLogin){requestLogin=onLogin||requestLogin;if(!signedIn){emit({signedIn:false,items:new Map(),error:''});return;}
  emit({signedIn:true,loading:true,error:''});
  try{const rows=await call({action:'list'});emit({loading:false,items:new Map(rows.map(r=>[keyOf(r.kind,r.ref),r]))});}catch(e){emit({loading:false,error:e.message});}},
 get(kind,ref){return state.items.get(keyOf(kind,ref));},
 async save(item,patch){
  if(!state.signedIn){requestLogin();return false;}
  const k=keyOf(item.kind,item.ref),prev=state.items.get(k),next={favorite:false,note:'',...prev,...item,...patch,updatedAt:new Date().toISOString()};
  const items=new Map(state.items);if(!next.favorite&&!next.note.trim())items.delete(k);else items.set(k,next);emit({items,error:''});
  try{await call({action:'save',kind:next.kind,ref:next.ref,title:next.title,href:next.href,favorite:next.favorite,note:next.note});return true;}
  catch(e){const back=new Map(state.items);if(prev)back.set(k,prev);else back.delete(k);emit({items:back,error:e.message});if(e.status===401)requestLogin();return false;}
 },
};
export function useFavorites(){return useSyncExternalStore(l=>{listeners.add(l);return()=>listeners.delete(l);},()=>state);}
// parâmetro de um link interno: #medicacoes?item=amoxicilina → hashParam('item')
export const hashParam=name=>new URLSearchParams(location.hash.split('?')[1]||'').get(name);
