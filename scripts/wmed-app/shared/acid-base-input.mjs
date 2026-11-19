import {calculators,calculate} from './calculators.mjs';
// 2Doctor-only input adapter. Formula coefficients and original bounds unchanged.
export function calculateAcidBase(id,raw={}) {
 const c=calculators.find(c=>c.id===id);
 if(!c||!['gap','winter'].includes(id))return {error:'Calculadora não encontrada.'};
 for(const field of c.inputs){
  const value=raw[field.id];
  if(value===undefined||value===null||(typeof value==='string'&&!value.trim()))continue;
  if(typeof value!=='string'||!/^\d{1,3}(?:[.,]\d{1,3})?$/.test(value.trim()))return {error:`Confira ${field.label.toLowerCase()}.`,field:field.id};
 }
 const result=calculate(id,raw);
 return result.error?{...result,field:c.inputs.find(f=>result.error===`Confira ${f.label.toLowerCase()}.`)?.id}:result;
}
