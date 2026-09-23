import {fields, reviewedFields, guidanceFeedback} from './case-contract.mjs';
import {detectAcademicPII} from './pii.mjs';
export function caseSaveBody(input) {
 if(!input || !/^[a-zA-Z0-9-]{16,80}$/.test(input.requestId || '')) throw Error('Identificador do caso inválido.');
 const form=reviewedFields(input.fields);
 if(typeof input.relato!=='string'||input.relato.trim().length<20||input.relato.length>5000)throw Error('Revise o relato antes de salvar.');
 if(!input.feedback||Array.isArray(input.feedback)||typeof input.feedback!=='object'||!Object.keys(input.feedback).length)throw Error('Feedback indisponível para salvar.');
 if(detectAcademicPII([input.relato,...Object.values(form)].join('\n')))throw Error('Remova os dados que identificam o paciente antes de salvar.');
 const quality=input.quality;
 if(quality!=null&&(!Number.isInteger(quality.score)||quality.score<0||quality.score>100||!Array.isArray(quality.criteria)||quality.criteria.length!==5))throw Error('Pontuação inválida.');
 return {titulo:form.queixaPrincipal.slice(0,200),payload:{...form,wmed:{version:1,requestId:input.requestId,relato:input.relato,quality:quality||null}},feedback:guidanceFeedback(input.feedback)};
}
export function restoreCase(caso) {
 if(!caso?.id||!caso.feedback||typeof caso.feedback!=='object'||Array.isArray(caso.feedback))throw Error('Este caso não possui um feedback disponível.');
 const payload=caso.payload||{};
 const form=Object.fromEntries(fields.map(([key])=>[key,typeof payload[key]==='string'?payload[key]:'']));
 const relato=typeof payload.wmed?.relato==='string'?payload.wmed.relato:fields.map(([key,label])=>form[key]?`${label}: ${form[key]}`:'').filter(Boolean).join('\n');
 return {id:caso.id,title:caso.titulo,form,relato,quality:payload.wmed?.quality||null,feedback:guidanceFeedback(caso.feedback)};
}
