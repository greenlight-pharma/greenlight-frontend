import test from 'node:test';
import assert from 'node:assert/strict';
import {calculators,calculate} from '../shared/calculators.mjs';
import {localizedCalculators,calculatorError} from '../shared/i18n/calculators.mjs';

test('translated calculator fields preserve source units, bounds and coded sex options',()=>{
 for(const locale of ['en','es'])for(const localized of localizedCalculators(locale)){
  const original=calculators.find(c=>c.id===localized.id);
  assert.equal(localized.calc,original.calc);
  assert.equal(localized.source,original.source);
  assert.equal(localized.unit.replace('1.73','1,73'),original.unit);
  assert.deepEqual(localized.inputs.map(({id,min,max,step,options})=>({id,min,max,step,options:options?.map(([v])=>v)})),original.inputs.map(({id,min,max,step,options})=>({id,min,max,step,options:options?.map(([v])=>v)})));
  for(const key of ['name','summary','note','formula'])assert.ok(localized[key]);
 }
 assert.equal(localizedCalculators('pt-BR'),calculators);
});
test('invalid renal age and creatinine errors identify the correct field in the selected language',()=>{
 const en=localizedCalculators('en').find(c=>c.id==='egfr');
 const es=localizedCalculators('es').find(c=>c.id==='egfr');
 const age=calculate('egfr',{age:15,creatinine:1,female:'0'});
 assert.equal(calculatorError(age,en,'en'),'Check: Age (years).');
 const creatinine=calculate('egfr',{age:60,creatinine:0,female:'1'});
 assert.equal(calculatorError(creatinine,es,'es'),'Revisa: Creatinina (mg/dL).');
 assert.equal(calculatorError(calculate('egfr',{}),en,'en'),'');
 // Switching language only changes display; comma and dot input still use the same engine.
 assert.equal(calculate('egfr',{age:60,creatinine:'1,2',female:'1'}).value,calculate('egfr',{age:60,creatinine:'1.2',female:'1'}).value);
});
