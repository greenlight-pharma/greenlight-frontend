import React,{useState,useEffect} from 'react';
import {Star,StickyNote} from 'lucide-react';
import {t} from './i18n';
import {favorites,useFavorites} from './favorites';
// Estrela de favorito + anotação para um conteúdo. item = {kind, ref, title, href}
export default function SaveTools({item}){
 const s=useFavorites(),saved=s.items.get(`${item.kind}:${item.ref}`),[open,setOpen]=useState(false),[draft,setDraft]=useState(saved?.note||''),[status,setStatus]=useState('');
 useEffect(()=>{if(!open)setDraft(saved?.note||'');},[saved?.note,open]);
 async function saveNote(){setStatus(t('Salvando…'));const ok=await favorites.save(item,{note:draft});setStatus(ok?t('Anotação salva.'):'');if(ok)setOpen(false);}
 return <div className="save-tools">
  <button type="button" aria-pressed={!!saved?.favorite} onClick={()=>favorites.save(item,{favorite:!saved?.favorite})}><Star size={16} fill={saved?.favorite?'currentColor':'none'}/>{saved?.favorite?t('Favorito'):t('Favoritar')}</button>
  <button type="button" aria-expanded={open} onClick={()=>{if(!s.signedIn)return favorites.save(item,{});setOpen(o=>!o);}}><StickyNote size={16}/>{saved?.note?t('Ver anotação'):t('Anotar')}</button>
  {open&&<div className="save-note"><label htmlFor={`note-${item.kind}-${item.ref}`}>{t('Sua anotação')}</label><textarea id={`note-${item.kind}-${item.ref}`} rows={5} maxLength={5000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t('Escreva algo para lembrar depois…')}/><div><button type="button" onClick={saveNote}>{t('Salvar anotação')}</button><button type="button" onClick={()=>setOpen(false)}>{t('Cancelar')}</button></div></div>}
  {(status||s.error)&&<small role="status">{status||t(s.error)}</small>}
 </div>;
}
