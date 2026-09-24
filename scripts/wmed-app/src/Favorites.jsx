import React,{useState} from 'react';
import {Star,StickyNote,ArrowUpRight} from 'lucide-react';
import {t,msg,locale} from './i18n';
import {useFavorites} from './favorites';
const KINDS={score:msg('Scores'),calc:msg('Calculadoras'),med:msg('Medicações'),cid:msg('Condições'),topic:msg('Resumos')};
export default function Favorites({onLogin}){
 const s=useFavorites(),[kind,setKind]=useState(''),[only,setOnly]=useState('');
 const rows=[...s.items.values()].filter(r=>(!kind||r.kind===kind)&&(!only||(only==='fav'?r.favorite:r.note))).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
 return <section className="module-page favorites-page"><header className="module-heading"><span className="eyebrow blue">{t('SUA CONTA WMED')}</span><h1>{t('Favoritos e anotações')}</h1><p>{t('Tudo o que você marcou com estrela ou anotou, salvo na sua conta e disponível em qualquer aparelho.')}</p></header>
 {!s.signedIn?<div className="resource-card"><Star/><h2>{t('Entre para ver seus favoritos.')}</h2><button className="module-primary" onClick={onLogin}>{t('Entrar ou criar conta WMed')}</button></div>:<>
 <div className="library-filters"><select aria-label={t('Tipo de conteúdo')} value={kind} onChange={e=>setKind(e.target.value)}><option value="">{t('Todos os tipos')}</option>{Object.entries(KINDS).map(([k,l])=><option key={k} value={k}>{t(l)}</option>)}</select><select aria-label={t('Mostrar')} value={only} onChange={e=>setOnly(e.target.value)}><option value="">{t('Favoritos e anotações')}</option><option value="fav">{t('Só favoritos')}</option><option value="note">{t('Só anotações')}</option></select></div>
 {s.loading?<p role="status">{t('Carregando…')}</p>:rows.length?<div className="resource-grid">{rows.map(r=><a className="resource-card favorite-card" key={r.kind+r.ref} href={r.href}><small>{t(KINDS[r.kind]||r.kind)} {r.favorite&&<Star size={13} fill="currentColor"/>}{r.note&&<StickyNote size={13}/>}</small><h3>{r.title}</h3>{r.note&&<p>{r.note}</p>}<span>{new Date(r.updatedAt).toLocaleDateString(locale)} <ArrowUpRight size={15}/></span></a>)}</div>:<p>{t('Nada salvo ainda. Use a estrela ou "Anotar" em scores, medicações, condições e resumos.')}</p>}</>}
 </section>;
}
