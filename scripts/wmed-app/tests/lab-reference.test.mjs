import test from 'node:test';
import assert from 'node:assert/strict';
import {compareLabReference,changeLabUnit,labGuides,labText} from '../shared/lab-reference.mjs';
const base={unit:'g/dL',value:'14',lower:'12',upper:'16'};
test('comparison uses only the supplied interval and includes exact endpoints',()=>{
 for(const [value,position] of [['11.999','below'],['12','within'],['16','within'],['16.001','above']])assert.equal(compareLabReference('hemoglobin',{...base,value}).position,position);
 assert.equal(compareLabReference('hemoglobin',{unit:'g/dL',value:'14',lower:'15',upper:'18'}).position,'below');
 assert.equal(compareLabReference('creatinine',{unit:'mg/dL',value:'0,600',lower:'0.6',upper:'1,2'}).position,'within');
 assert.equal(compareLabReference('potassium',{unit:'mmol/L',value:'0',lower:'1',upper:'2'}).position,'below');
});
test('malformed, blank, nonfinite and reversed inputs never produce a position',()=>{
 for(const value of ['', ' ', 'NaN','Infinity','1e2','0x10','-1','+2','1 000','1,000.2','1.000,2','0.0001','1000000',14,null,{},undefined]){
  const r=compareLabReference('hemoglobin',{...base,value});assert.equal(r.error,'number');assert.equal(r.position,undefined);
 }
 for(const patch of [{lower:'16'},{lower:'17'},{upper:'12'},{unit:'mg/dL'}])assert.ok(compareLabReference('hemoglobin',{...base,...patch}).error);
 assert.equal(compareLabReference('unknown',base).error,'test');
});
test('integer-scaled decimals compare consistently without hidden normal ranges',()=>{
 for(let lower=0;lower<20;lower++)for(let offset=-1;offset<=11;offset++){
  if(lower+offset<0)continue;
  const result=compareLabReference('hemoglobin',{unit:'g/dL',lower:(lower/1000).toFixed(3),upper:((lower+10)/1000).toFixed(3),value:((lower+offset)/1000).toFixed(3)});
  assert.equal(result.position,offset<0?'below':offset>10?'above':'within');
 }
});
test('switching units clears all numbers; examples and sources remain explicit',()=>{
 assert.deepEqual(changeLabUnit('hemoglobin','g/L'),{value:'',lower:'',upper:'',unit:'g/L'});
 assert.equal(changeLabUnit('hemoglobin','mmol/L'),null);
 for(const g of labGuides){assert.equal(compareLabReference(g.id,g.example).position,'within');assert.ok(new URL(g.source).pathname.startsWith('/lab-tests/'));for(const l of ['pt-BR','en','es'])for(const k of ['name','concept','context','limit'])assert.ok(labText(g[k],l));}
});
