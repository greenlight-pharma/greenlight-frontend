import React,{useState} from 'react';
import {ArrowLeft} from 'lucide-react';
import {t,locale} from './i18n';
import {PED_DRUGS,pedDose} from '../shared/pediatric-doses.mjs';
import SaveTools from './SaveTools';
const fmt=n=>n.toLocaleString(locale,{maximumFractionDigits:2});
const range=(a,b,u)=>a===b?`${fmt(a)} ${u}`:`${fmt(a)}–${fmt(b)} ${u}`;
export default function PediatricDoses({onBack}){
 const [id,setId]=useState(PED_DRUGS[0].id),[kg,setKg]=useState(''),drug=PED_DRUGS.find(d=>d.id===id);
 const w=Number(String(kg).replace(',','.')),r=kg?pedDose(drug,w):null;
 return <section className="module-page"><button className="back-button" onClick={onBack}><ArrowLeft size={17}/>{t('Scores e calculadoras')}</button>
 <header className="module-heading"><span className="eyebrow blue">{t('PEDIATRIA')}</span><h1>{t('Doses pediátricas')}</h1><p>{t('Dose por tomada e volume por apresentação a partir do peso, com teto pela dose máxima.')}</p></header>
 <SaveTools item={{kind:'calc',ref:'doses-pediatricas',title:t('Doses pediátricas'),href:'#scores?id=doses-pediatricas'}}/>
 <div className="calculator-layout"><div className="criteria-list">
  <label className="resource-card calc-field"><span>{t('Medicamento')}</span><select value={id} onChange={e=>setId(e.target.value)}>{PED_DRUGS.map(d=><option key={d.id} value={d.id}>{d.name} · {d.use}</option>)}</select></label>
  <label className="resource-card calc-field"><span>{t('Peso (kg)')}</span><input inputMode="decimal" value={kg} placeholder="0,5–150" onChange={e=>setKg(e.target.value)}/></label>
  <div className="resource-card"><h3>{drug.name}</h3><p>{drug.perDose?t('{a}–{b} mg/kg por dose',{a:fmt(drug.perDose[0]),b:fmt(drug.perDose[1])}):t('{a}–{b} mg/kg/dia em {n} tomada(s)',{a:fmt(drug.perDay[0]),b:fmt(drug.perDay[1]),n:drug.doses})} · {drug.interval}</p>{drug.minAge&&<p>{t('Idade mínima: {i}',{i:drug.minAge})}</p>}<p>{drug.note}</p></div>
 </div>
 <aside className="result-card" aria-live="polite"><span className="eyebrow">{t('DOSE POR TOMADA')}</span>
  <strong>{r&&!r.error?range(r.lo,r.hi,'mg'):'—'}</strong>
  <p>{!kg?t('Informe o peso.'):r.error?t(r.error):r.capped?t('Limitada pela dose máxima de adulto.'):drug.interval}</p>
  {r&&!r.error&&<>{r.volumes.map(v=><p key={v.label}><b>{range(v.lo,v.hi,'mL')}</b> · {v.label}</p>)}{r.perDayMax&&<p>{t('Máximo diário: {m} mg',{m:fmt(r.perDayMax)})}</p>}</>}
  <details><summary>{t('Referência')}</summary><a href={drug.source} target="_blank" rel="noreferrer">{drug.source}</a></details>
  <p className="module-note">{t('Rascunho em revisão médica. Confira bula, função renal e hepática, alergias e protocolo local antes de prescrever.')}</p>
 </aside></div></section>;
}
