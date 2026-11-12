import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {fixtures} from '../evaluation/acid-base/fixtures.mjs';
import {runReference} from '../evaluation/acid-base/reference.mjs';
import {evaluate} from '../evaluation/acid-base/evaluate.mjs';
test('38 original offline acid-base fixtures pass without claiming clinical validation',()=>{
 const r=evaluate();assert.equal(r.total,38);assert.equal(r.passed,38);assert.equal(r.clinicalValidation,false);assert.equal(r.review,'pending');
 assert.equal(new Set(fixtures.map(f=>f.id)).size,fixtures.length);
 assert.ok(fixtures.every(f=>f.synthetic&&f.clinicalReview==='pending'));
 for(const f of fixtures){const before=structuredClone(f.input);runReference(f.input);assert.deepEqual(f.input,before);}
});
test('evaluation rejects altered coefficients, suppressed negative gaps and invented interpretation',()=>{
 for(const mutate of [r=>({...r,value:r.value+1}),r=>({...r,diagnosis:'invented'}),r=>({...r,treatment:'invented'}),r=>({...r,normal:true})]){
  const r=evaluate(input=>{const out=runReference(input);return out.status==='calculated'?mutate(out):out;});
  assert.ok(r.passed<r.total);
 }
 assert.ok(evaluate(input=>{const r=runReference(input);return r.value<0?{...r,value:0}:r;}).passed<38);
 assert.equal(evaluate(()=>{throw Error('failure');}).passed,0);
});
test('contract detects bypassed venous, missing unit and context checks',()=>{
 for(const id of ['winter-venous','winter-unconfirmed-context','gap-unit-absent']){
  const f=fixtures.find(f=>f.id===id);assert.equal(runReference(f.input).status,'blocked');
  const r=evaluate(input=>{
   if(JSON.stringify(input)===JSON.stringify(f.input))return {status:'calculated',value:26,low:24,high:28,unit:'mmHg'};
   return runReference(input);
  });assert.equal(r.passed,37);
 }
});
test('offline corpus is not imported into the application or copied to the runtime image',()=>{
 const root=new URL('../',import.meta.url);
 function scan(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const path=new URL(e.name+(e.isDirectory()?'/':''),dir);if(e.isDirectory())scan(path);else if(/\.(mjs|js|jsx|ts|tsx)$/.test(e.name))assert.doesNotMatch(readFileSync(path,'utf8'),/(?:import|export)[^;]*evaluation\/acid-base/);}}
 for(const folder of ['src/','shared/','server/'])scan(new URL(folder,root));
 assert.doesNotMatch(readFileSync(new URL('Dockerfile',root),'utf8'),/COPY\s+(?:\.\s|evaluation)/);
});
