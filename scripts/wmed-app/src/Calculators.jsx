import React, {useState} from 'react';
import {calculateAcidBase} from '../shared/acid-base-input.mjs';
import './doctor/acid-base.css';
import {calculate} from '../shared/calculators.mjs';
import {localizedCalculators, calculatorError} from '../shared/i18n/calculators.mjs';
import {useI18n} from './doctor/I18n';

export default function Calculators({id,onBack}) {
 const {locale,t}=useI18n();
 const c=localizedCalculators(locale).find(c=>c.id===id);
 const [values,setValues]=useState({});
 const acidBase=import.meta.env.VITE_PRODUCT==='2doctor'&&['gap','winter'].includes(id);
 const result=acidBase?calculateAcidBase(id,values):calculate(id,values);
 const i=locale==='en'?1:locale==='es'?2:0;
 const text={decimal:['Use ponto ou vírgula decimal, com até 3 casas. Sem separador de milhares ou notação científica.','Use a decimal point or comma, up to 3 decimal places. No thousands separator or scientific notation.','Usa punto o coma decimal, hasta 3 decimales. Sin separador de miles ni notación científica.'],accepted:['Valores aceitos nesta calculadora','Accepted values in this calculator','Valores admitidos en esta calculadora'],bounds:['Esses limites são de entrada, não um intervalo de normalidade.','These are input limits, not a normal range.','Estos límites son de entrada, no un intervalo de normalidad.'],expected:['PaCO₂ esperada · faixa estimada','Expected PaCO₂ · estimated range','PaCO₂ esperada · intervalo estimado'],gap:['Ânion gap calculado','Calculated anion gap','Brecha aniónica calculada'],scope:['Cálculo educativo. Não identifica o distúrbio primário, valores críticos ou tratamento.','Educational calculation. Does not identify the primary disorder, critical values or treatment.','Cálculo educativo. No identifica el trastorno primario, valores críticos ni tratamiento.'],winter:['A acidose metabólica precisa ter sido identificada antes. PaCO₂ é arterial; este resultado não é um alvo de ventilação.','Metabolic acidosis must already have been identified. PaCO₂ is arterial; this result is not a ventilation target.','La acidosis metabólica debe haberse identificado previamente. La PaCO₂ es arterial; este resultado no es un objetivo de ventilación.'],center:['Estimativa central','Central estimate','Estimación central']};const tr=k=>text[k][i];
 const fmt=n=>n.toLocaleString(locale,{maximumFractionDigits:2});
 return <section className={`module-page formula-calculator${acidBase?' doctor-acid-base':''}`}>
  <button className="back-button" onClick={onBack}>← {t('Scores e calculadoras')}</button>
  <header className="module-heading"><h1>{c.name}</h1><p>{c.summary}</p></header>
  {acidBase&&<div className="acid-base-context"><p>{tr('scope')}</p><p id="acid-format">{tr('bounds')} {tr('decimal')}</p>{id==='winter'&&<p>{tr('winter')}</p>}</div>}
  <div className="calculator-layout">
   <div className="criteria-list">{c.inputs.map(f=><label key={f.id} className="resource-card calc-field">
    <span>{f.label}</span>
    {f.options?<select value={values[f.id]??''} onChange={e=>setValues(v=>({...v,[f.id]:e.target.value}))}>
     <option value="">{t('Selecione')}</option>{f.options.map(([v,label])=><option key={v} value={v}>{label}</option>)}
    </select>:<input aria-label={acidBase?f.label:undefined} aria-describedby={acidBase?`acid-hint-${f.id} acid-format`:undefined} aria-invalid={acidBase&&result.field===f.id?true:undefined} inputMode="decimal" type="text" value={values[f.id]??''} placeholder={`${fmt(f.min)}–${fmt(f.max)}`} onChange={e=>setValues(v=>({...v,[f.id]:e.target.value}))}/>}
    {acidBase&&<small id={`acid-hint-${f.id}`}>{tr('accepted')}: {fmt(f.min)}–{fmt(f.max)}.</small>}
   </label>)}</div>
   <aside className="result-card" aria-live="polite">
    <span className="eyebrow">{acidBase?tr(id==='winter'?'expected':'gap'):t('RESULTADO')}</span><strong>{result.value!==undefined?(acidBase&&id==='winter'?`${fmt(result.value-result.range)}–${fmt(result.value+result.range)}`:fmt(result.value)):'—'}</strong>
    <p>{calculatorError(result,c,locale)||(result.pending?t('Preencha todos os campos.'):c.unit)}</p>
    {acidBase&&id==='winter'&&result.value!==undefined&&<p>{tr('center')}: {fmt(result.value)} {c.unit}</p>}
    {result.range&&!acidBase&&<p>{t('Faixa esperada')}: {fmt(result.value-result.range)}–{fmt(result.value+result.range)} {c.unit}</p>}
    <p>{c.note}</p>
    <details><summary>{t('Fórmula e referência')}</summary><p>{c.formula}</p><a href={c.source} target="_blank" rel="noreferrer">{t('Referência')} ↗</a></details>
    <button onClick={()=>setValues({})}>{t('Limpar')}</button>
   </aside>
  </div>
 </section>;
}
