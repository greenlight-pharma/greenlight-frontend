import React, {useState} from 'react';
import {calculate} from '../shared/calculators.mjs';
import {localizedCalculators, calculatorError} from '../shared/i18n/calculators.mjs';
import {useI18n} from './doctor/I18n';

export default function Calculators({id,onBack}) {
 const {locale,t}=useI18n();
 const c=localizedCalculators(locale).find(c=>c.id===id);
 const [values,setValues]=useState({});
 const result=calculate(id,values);
 const fmt=n=>n.toLocaleString(locale,{maximumFractionDigits:2});
 return <section className="module-page formula-calculator">
  <button className="back-button" onClick={onBack}>← {t('Scores e calculadoras')}</button>
  <header className="module-heading"><h1>{c.name}</h1><p>{c.summary}</p></header>
  <div className="calculator-layout">
   <div className="criteria-list">{c.inputs.map(f=><label key={f.id} className="resource-card calc-field">
    <span>{f.label}</span>
    {f.options?<select value={values[f.id]??''} onChange={e=>setValues(v=>({...v,[f.id]:e.target.value}))}>
     <option value="">{t('Selecione')}</option>{f.options.map(([v,label])=><option key={v} value={v}>{label}</option>)}
    </select>:<input inputMode="decimal" type="text" value={values[f.id]??''} placeholder={`${fmt(f.min)}–${fmt(f.max)}`} onChange={e=>setValues(v=>({...v,[f.id]:e.target.value}))}/>}
   </label>)}</div>
   <aside className="result-card" aria-live="polite">
    <span className="eyebrow">{t('RESULTADO')}</span><strong>{result.value!==undefined?fmt(result.value):'—'}</strong>
    <p>{calculatorError(result,c,locale)||(result.pending?t('Preencha todos os campos.'):c.unit)}</p>
    {result.range&&<p>{t('Faixa esperada')}: {fmt(result.value-result.range)}–{fmt(result.value+result.range)} {c.unit}</p>}
    <p>{c.note}</p>
    <details><summary>{t('Fórmula e referência')}</summary><p>{c.formula}</p><a href={c.source} target="_blank" rel="noreferrer">{t('Referência')} ↗</a></details>
    <button onClick={()=>setValues({})}>{t('Limpar')}</button>
   </aside>
  </div>
 </section>;
}
