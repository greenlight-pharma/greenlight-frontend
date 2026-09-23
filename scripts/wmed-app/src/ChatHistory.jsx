import React,{useEffect,useRef,useState} from 'react';
import {X,MessageSquare,Plus} from 'lucide-react';
import {encodeMessages,decodeMessages,createHistoryWriter} from '../shared/history.mjs';
export function useChatHistory({api,scope,messages,setMessages,busy}){
 const [items,setItems]=useState([]),[open,setOpen]=useState(false),[error,setError]=useState(''),[saving,setSaving]=useState(false),[loading,setLoading]=useState(false),[saved,setSaved]=useState(false);
 const owner=useRef(scope),state=useRef(null),latest=useRef(messages);latest.current=messages;
 const key=scope?`wmed:last-chat:${scope}`:null;
 async function call(payload){const r=await fetch(`${api}/history`,{method:'POST',headers:{'Content-Type':'application/json','X-WMed-Request':'1'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw Error(d.error||'Histórico indisponível.');return d;}
 async function list(s=state.current){if(!s)return;const d=await call({action:'list'});if(state.current===s)setItems(Array.isArray(d)?d:[]);}
 useEffect(()=>{
  if(owner.current&&owner.current!==scope){latest.current=[];setMessages([]);}
  owner.current=scope;
  setItems([]);setError('');setSaved(false);setOpen(false);
  if(!scope){state.current=null;return;}
  const s={writer:null,signature:'',key};
  s.writer=createHistoryWriter(async(id,rows)=>{if(state.current!==s)throw Error('A conta mudou. Entre novamente para salvar.');const d=await call({action:'save',id,messages:rows});if(state.current===s){try{localStorage.setItem(s.key,d.id);}catch{}}return d;});state.current=s;
  setLoading(true);
  (async()=>{try{await list(s);let id;try{id=localStorage.getItem(key);}catch{}
   if(id&&latest.current.length===0){const d=await call({action:'open',id});if(state.current===s&&latest.current.length===0){const rows=decodeMessages(d);s.writer.setId(id);s.signature=JSON.stringify(encodeMessages(rows));setMessages(rows);setSaved(true);}}
  }catch(e){if(state.current===s)setError(e.message);}finally{if(state.current===s)setLoading(false);}})();
  return()=>{if(state.current===s)state.current=null;};
 },[scope]);
 async function flush(){const s=state.current;if(!s)return true;const rows=encodeMessages(latest.current),signature=JSON.stringify(rows);if(rows.length&&signature!==s.signature)s.writer.enqueue(rows);if(!rows.length)return true;setSaving(true);try{await s.writer.flush();if(state.current===s){s.signature=signature;setSaved(true);setError('');await list(s);}return true;}catch(e){if(state.current===s){setError(e.message);setSaved(false);}return false;}finally{if(state.current===s)setSaving(false);}}
 useEffect(()=>{if(!scope||loading)return;setSaved(false);const timer=setTimeout(flush,busy?1500:300);return()=>clearTimeout(timer);},[messages,busy,scope,loading]);
 // A checkpoint also runs during uninterrupted streaming; no text is stored in localStorage.
 useEffect(()=>{if(!scope||!busy)return;const timer=setInterval(flush,5000);return()=>clearInterval(timer);},[scope,busy]);
 useEffect(()=>{const warn=e=>{if(saving||(encodeMessages(latest.current).length&&!saved&&scope)){e.preventDefault();e.returnValue='';}};addEventListener('beforeunload',warn);return()=>removeEventListener('beforeunload',warn);},[saving,saved,scope]);
 async function fresh(){if(busy||loading)return false;if(!await flush())return false;state.current?.writer.setId(null);if(state.current){state.current.signature='';try{localStorage.removeItem(key);}catch{}}setSaved(false);setOpen(false);return true;}
 async function select(id){if(busy||loading)return false;if(!await flush())return false;const s=state.current;setLoading(true);try{const d=await call({action:'open',id});if(state.current!==s)return false;const rows=decodeMessages(d);s.writer.setId(id);s.signature=JSON.stringify(encodeMessages(rows));setMessages(rows);try{localStorage.setItem(key,id);}catch{}setSaved(true);setError('');setOpen(false);return true;}catch(e){setError(e.message);return false;}finally{setLoading(false);}}
 return {items,open,setOpen,error,saving,loading,saved,flush,fresh,select,refresh:()=>list().catch(e=>setError(e.message))};
}
export default function ChatHistory({history,onClose,onNew,onSelect}){return <div className="modal-shade" onClick={onClose}><section className="modal history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title" onClick={e=>e.stopPropagation()}><button autoFocus className="icon-btn close" aria-label="Fechar histórico" onClick={onClose}><X/></button><h2 id="history-title">Suas conversas</h2><p>Chats salvos na sua conta Vytal. As 50 conversas mais recentes aparecem aqui.</p><button className="history-new" onClick={onNew} disabled={history.loading}><Plus size={17}/> Nova conversa</button>{history.error&&<p role="alert" className="error">{history.error}<button onClick={history.refresh}>Tentar novamente</button></p>}{history.loading?<p role="status">Carregando…</p>:history.items.length?<div className="history-list">{history.items.map(item=><button key={item.id} onClick={()=>onSelect(item.id)}><MessageSquare size={19}/><span><strong>{item.titulo||'Conversa'}</strong><small>{new Date(item.updatedAt).toLocaleDateString('pt-BR')} · {item.mensagens} mensagens</small></span></button>)}</div>:<p>Suas próximas conversas aparecerão aqui.</p>}</section></div>;}
