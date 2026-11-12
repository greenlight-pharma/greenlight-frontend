// OFFLINE ONLY. Conservative proposed metadata contract, not a validated clinical gate.
// No imports from this directory are permitted in src/, server/, or shared/.
import {calculateAcidBase} from '../../shared/acid-base-input.mjs';
const blocked = reason => ({status:'blocked', reason});
export function runReference(input) {
 if(!input||!['gap','winter'].includes(input.calculator))return blocked('unsupported-calculator');
 if(input.population!=='adult')return blocked('unsupported-population');
 const isWinter=input.calculator==='winter';
 if(isWinter){
  if(input.sample!=='arterial')return blocked('arterial-sample-required');
  if(input.metabolicAcidosisConfirmed!==true)return blocked('context-unconfirmed');
  if(input.bicarbonateAgreement!=='confirmed')return blocked('bicarbonate-review-required');
 }
 const fields=isWinter?['hco']:['na','cl','hco'];
 const raw={};let collection;
 for(const field of fields){
  const m=input.measurements?.[field];
  if(!m||typeof m!=='object'||Array.isArray(m))return blocked('missing-measurement');
  if(m.unit!=='mEq/L')return blocked('unsupported-unit');
  if(!(isWinter?['chemistry','blood-gas']:['chemistry']).includes(m.source))return blocked('unsupported-source');
  if(typeof m.collection!=='string'||!m.collection.trim())return blocked('missing-collection');
  if(collection&&collection!==m.collection)return blocked('collection-mismatch');
  collection=m.collection;raw[field]=m.value;
 }
 if(isWinter&&input.observation){
  if(input.observation.pco2Unit!=='mmHg')return blocked('unsupported-pressure-unit');
  if(input.observation.collection!==collection)return blocked('collection-mismatch');
 }
 const r=calculateAcidBase(input.calculator,raw);
 if(r.pending)return blocked('incomplete-number');
 if(r.error)return blocked('invalid-number');
 return isWinter?{status:'calculated',value:r.value,low:r.value-r.range,high:r.value+r.range,unit:r.unit}:{status:'calculated',value:r.value,unit:r.unit};
}
