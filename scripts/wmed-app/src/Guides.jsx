import React,{useState,useMemo,useEffect} from 'react';
import ReactMarkdown from 'react-markdown';import remarkGfm from 'remark-gfm';
import {ArrowLeft,ArrowUpRight,BookOpenCheck,Search,ExternalLink} from 'lucide-react';
import {t,lang} from './i18n';
import SaveTools from './SaveTools';
import {hashParam} from './favorites';
import {EMERGENCIA} from './guides/emergencia';
import {ANTIMICROBIANOS} from './guides/antimicrobianos';
export const GUIDES=[...EMERGENCIA,...ANTIMICROBIANOS];
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
// Links internos (#modulo?…) abrem no próprio app; externos, em nova aba. Imagens não são renderizadas.
const md={a:({href='',children})=>href.startsWith('#')?<a href={href}>{children}</a>:/^https:\/\//.test(href)?<a href={href} target="_blank" rel="noopener noreferrer">{children}</a>:<span>{children}</span>,img:()=>null};
export default function Guides(){
 const [id,setId]=useState(()=>GUIDES.some(g=>g.id===hashParam('guia'))?hashParam('guia'):null),[q,setQ]=useState(''),[area,setArea]=useState('');
 // link interno para outro guia do mesmo módulo: o hash muda mesmo quando a rota do app não remonta a tela
 useEffect(()=>{const sync=()=>{const next=hashParam('guia');if(location.hash.startsWith('#protocolos')){setId(GUIDES.some(g=>g.id===next)?next:null);window.scrollTo?.(0,0);}};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const guide=GUIDES.find(g=>g.id===id);
 const list=useMemo(()=>GUIDES.filter(g=>(!area||g.area===area)&&norm(g.title+' '+g.summary).includes(norm(q))),[q,area]);
 function open(next){setId(next);history.replaceState(null,'',next?`#protocolos?guia=${next}`:'#protocolos');window.scrollTo?.(0,0);}
 const note=<p className="module-note">{t('Rascunho WMed em revisão médica. Material de estudo: não substitui o protocolo da sua instituição nem o julgamento clínico. Doses para adultos com função renal normal, salvo indicação.')}{lang!=='pt'&&' '+t('Conteúdo disponível em português.')}</p>;
 if(guide)return <section className="module-page guide-page">
  <button className="back-button" onClick={()=>open(null)}><ArrowLeft size={17}/>{t('Protocolos e guias')}</button>
  <header className="module-heading"><span className="eyebrow blue">{t(guide.area).toUpperCase()}</span><h1>{guide.title}</h1><p>{guide.summary}</p></header>
  <SaveTools item={{kind:'guide',ref:guide.id,title:guide.title,href:`#protocolos?guia=${guide.id}`}}/>
  <article className="markdown guide-body" lang="pt-BR"><ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{guide.body}</ReactMarkdown></article>
  <h2 className="library-section-title">{t('Fontes')}</h2>
  <ul className="guide-sources">{guide.sources.map(([label,url])=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label}<ExternalLink size={13}/></a></li>)}</ul>
  {note}
 </section>;
 return <section className="module-page">
  <header className="module-heading"><span className="eyebrow blue">{t('CONTEÚDO ORIGINAL WMED')}</span><h1>{t('Protocolos e guias')}</h1><p>{t('{n} guias de emergência e antimicrobianos, com doses, tabelas e atalhos para os scores.',{n:GUIDES.length})}</p></header>
  <div className="library-filters"><label><Search size={18}/><input aria-label={t('Buscar guia')} placeholder={t('Sepse, intubação, meningite…')} value={q} onChange={e=>setQ(e.target.value)}/></label>
   <select aria-label={t('Área')} value={area} onChange={e=>setArea(e.target.value)}><option value="">{t('Todas as áreas')}</option>{[...new Set(GUIDES.map(g=>g.area))].map(a=><option key={a} value={a}>{t(a)}</option>)}</select></div>
  <div className="resource-grid">{list.map(g=><button className="resource-card" key={g.id} onClick={()=>open(g.id)}><BookOpenCheck size={22}/><small>{t(g.area)}</small><h3>{g.title}</h3><p>{g.summary}</p><span>{t('Abrir guia')} <ArrowUpRight size={16}/></span></button>)}</div>
  {!list.length&&<p>{t('Nenhum guia encontrado.')}</p>}
  {note}
 </section>;
}
