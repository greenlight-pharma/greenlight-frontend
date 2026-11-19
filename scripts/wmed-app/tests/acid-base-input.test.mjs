import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAcidBase} from '../shared/acid-base-input.mjs';
import {calculate} from '../shared/calculators.mjs';
import {calculatorError,localizedCalculators} from '../shared/i18n/calculators.mjs';
test('acid-base adapter rejects coercible nondecimal strings and nonscalar input',()=>{
 for(const na of ['0x8c','1e2','+140','140 000','140,0.0','140.0001',true,140,{},['140']]){
  assert.ok(calculateAcidBase('gap',{na,cl:'104',hco:'24'}).error);
 }
 for(const hco of ['0xc','1e1','12.0001'])assert.ok(calculateAcidBase('winter',{hco}).error);
 assert.equal(calculateAcidBase('gap',{na:'140',cl:'',hco:'24'}).pending,true);
 assert.ok(calculateAcidBase('bmi',{weight:'80',height:'200'}).error);
});
test('decimal comma and dot preserve arithmetic and do not suppress negative gaps',()=>{
 assert.equal(calculateAcidBase('gap',{na:'140',cl:'104',hco:'24'}).value,12);
 assert.equal(calculateAcidBase('gap',{na:'140,5',cl:'104.5',hco:'24'}).value,12);
 assert.equal(calculateAcidBase('gap',{na:'140',cl:'120',hco:'24'}).value,-4);
 const w=calculateAcidBase('winter',{hco:'12'});assert.equal(w.value,26);assert.equal(w.value-w.range,24);assert.equal(w.value+w.range,28);
 assert.equal(calculateAcidBase('winter',{hco:'12,5'}).value,26.75);
});
test('existing input bounds remain inclusive and translated field errors remain usable',()=>{
 for(const hco of ['1','30'])assert.equal(calculateAcidBase('winter',{hco}).value,calculate('winter',{hco}).value);
 for(const hco of ['0.999','30.001'])assert.ok(calculateAcidBase('winter',{hco}).error);
 const r=calculateAcidBase('winter',{hco:'1e1'});
 assert.match(calculatorError(r,localizedCalculators('en').find(c=>c.id==='winter'),'en'),/Bicarbonate/);
 assert.match(calculatorError(r,localizedCalculators('es').find(c=>c.id==='winter'),'es'),/Bicarbonato/);
 // Shared WMed engine intentionally untouched by the new 2Doctor adapter.
 assert.equal(calculate('gap',{na:'0x8c',cl:'104',hco:'24'}).value,12);
});
