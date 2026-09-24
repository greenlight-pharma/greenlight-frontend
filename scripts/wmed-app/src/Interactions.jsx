import React,{useState,useMemo} from 'react';
import {Search,X,ShieldAlert,Plus} from 'lucide-react';
import {t,lang} from './i18n';
import {hashParam} from './favorites';
import {checkInteractions,INTERACTION_DRUGS} from '../shared/interactions.mjs';
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const LABEL={contraindicada:'Contraindicada',grave:'Grave',moderada:'Moderada'};
const MAX=12;
// Verificador de interações: escolha os fármacos; a lista fica no link (#interacoes?med=a,b) para compartilhar.
export default function Interactions(){
 const [drugs,setDrugs]=useState(()=>(hashParam('med')||'').split(',').map(s=>s.trim()).filter(d=>INTERACTION_DRUGS.includes(d)).slice(0,MAX)),[q,setQ]=useState('');
 const found=useMemo(()=>checkInteractions(drugs),[drugs]);
 const suggestions=q.trim().length<2?[]:INTERACTION_DRUGS.filter(d=>!drugs.includes(d)&&norm(d).includes(norm(q.trim()))).slice(0,8);
 function update(next){setDrugs(next);history.replaceState(null,'',next.length?`#interacoes?med=${next.map(encodeURIComponent).join(',')}`:'#interacoes');}
 function add(d){if(drugs.length<MAX&&!drugs.includes(d))update([...drugs,d]);setQ('');}
 return <section className="module-page interactions-page">
  <header className="module-heading"><span className="eyebrow blue">{t('SEGURANÇA NA PRESCRIÇÃO')}</span><h1>{t('Interações medicamentosas')}</h1><p>{t('Adicione de 2 a {n} medicamentos para ver as interações de maior impacto clínico, o mecanismo e a conduta.',{n:MAX})}</p></header>
  <div className="library-filters interaction-search"><label><Search size={18}/><input aria-label={t('Buscar medicamento')} placeholder={t('Varfarina, amiodarona, sertralina…')} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&suggestions[0]){e.preventDefault();add(suggestions[0]);}}} disabled={drugs.length>=MAX}/></label></div>
  {suggestions.length>0&&<ul className="interaction-suggestions" aria-label={t('Sugestões')}>{suggestions.map(d=><li key={d}><button type="button" onClick={()=>add(d)}><Plus size={15}/>{d}</button></li>)}</ul>}
  {q.trim().length>=2&&!suggestions.length&&<p className="module-note">{t('Nenhum medicamento com regras de interação encontrado com esse nome.')}</p>}
  {drugs.length>0&&<div className="interaction-chips" aria-label={t('Medicamentos escolhidos')}>{drugs.map(d=><span key={d}>{d}<button type="button" aria-label={t('Remover {d}',{d})} onClick={()=>update(drugs.filter(x=>x!==d))}><X size={14}/></button></span>)}<button type="button" className="interaction-clear" onClick={()=>update([])}>{t('Limpar')}</button></div>}
  {drugs.length>=2&&<div role="status" className="interaction-summary">{found.length?t('{n} interações encontradas.',{n:found.length}):t('Nenhuma interação cadastrada entre esses medicamentos.')}</div>}
  <div className="interaction-list">{found.map((f,i)=><article key={i} className={`resource-card interaction-card sev-${f.sev}`}>
   <div className="interaction-top"><span className={`sev-badge sev-${f.sev}`}><ShieldAlert size={14}/>{t(LABEL[f.sev])}</span><strong>{f.a} + {f.b}{f.c?` + ${f.c}`:''}</strong></div>
   <h3>{f.titulo}</h3><p>{f.efeito}</p><p><b>{t('Conduta')}:</b> {f.conduta}</p></article>)}</div>
  {drugs.length>=2&&!found.length&&<p className="module-note">{t('Ausência de alerta não garante segurança: a base cobre as interações mais relevantes, não todas.')}</p>}
  <p className="module-note">{t('Rascunho WMed em revisão farmacêutica e médica, com regras próprias por mecanismo (QT, serotonina, potássio, sangramento, CYP3A4, indução enzimática, sedação e outros). Não substitui uma base licenciada nem a bula.')}{lang!=='pt'&&' '+t('Os textos das interações estão em português.')}</p>
 </section>;
}
