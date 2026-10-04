import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fixtures} from '../evaluations/scribe/fixtures.mjs';
import {sourceDigest,validateExtraction,evaluateFixture,referenceOutput} from '../evaluations/scribe/contract.mjs';
import {evaluateBatch,runSelfCheck} from '../evaluations/scribe/run.mjs';
const fixture=id=>fixtures.find(f=>f.id===id);
const check=(f,o)=>validateExtraction({text:f.source,locale:f.locale},o);
const has=(result,code)=>result.issues.some(i=>i.code===code);

test('synthetic corpus covers six scenarios in three languages; self-check labels itself as no model evaluation',()=>{
 assert.equal(fixtures.length,18);assert.equal(new Set(fixtures.map(f=>f.id)).size,18);
 for(const locale of ['pt-BR','en','es'])assert.equal(fixtures.filter(f=>f.locale===locale).length,6);
 const r=runSelfCheck();assert.equal(r.ok,true);assert.equal(r.positiveAccepted,18);assert.equal(r.negativeRejected,72);assert.equal(r.modelEvaluated,false);assert.equal(r.clinicalValidation,false);
});
test('changed negation, dose, decimal, unit, medication or route cannot claim verbatim provenance',()=>{
 for(const [id,from,to] of [['history:pt-BR','Nega','Apresenta'],['correction:pt-BR','850 mg','500 mg'],['measurements:pt-BR','36,7','37,6'],['measurements:en','micrograms','mg'],['measurements:en','levothyroxine','metformin'],['measurements:es','oral','intravenosa']]){
  const f=fixture(id),o=referenceOutput(f),b=o.blocks.find(b=>b.text.includes(from));assert.ok(b);b.text=b.text.replace(from,to);assert.ok(has(check(f,o),'NOT_VERBATIM'));
 }
});
test('an exact substring can still reverse meaning; fixture oracle rejects dropping negation or correction context',()=>{
 for(const [id,word] of [['history:pt-BR','febre'],['correction:en','500 mg'],['attribution:es','diabetes']]){
  const f=fixture(id),o=referenceOutput(f),start=f.source.indexOf(word);o.blocks[0]={section:'subjective',start,end:start+word.length,text:word};
  assert.equal(check(f,o).ok,true,'provenance is not semantic validation');
  const r=evaluateFixture(f,o);assert.equal(r.ok,false);assert.ok(has(r,'REQUIRED_PASSAGE_MISSING'));assert.ok(has(r,'UNEXPECTED_PASSAGE'));
 }
});
test('empty output, omitted uncertainty and false normal exam fail the annotated coverage oracle',()=>{
 const f=fixture('correction:pt-BR');const o=referenceOutput(f);o.blocks=[];assert.equal(check(f,o).ok,true);assert.equal(evaluateFixture(f,o).ok,false);
 const q=fixture('quoted-instruction:pt-BR'),p=referenceOutput(q),span=q.excluded[0];p.blocks.push({section:'objective',...span,text:q.source.slice(span.start,span.end)});
 assert.equal(check(q,p).ok,true);assert.ok(has(evaluateFixture(q,p),'UNEXPECTED_PASSAGE'));
});
test('source hash and locale prevent accepting another revision or language',()=>{
 const f=fixture('history:pt-BR'),o=referenceOutput(f);assert.notEqual(sourceDigest(f.source),sourceDigest(f.source+' '));
 o.sourceHash=sourceDigest(f.source+' ');assert.ok(has(check(f,o),'SOURCE_MISMATCH'));
 o.sourceHash=sourceDigest(f.source);o.locale='en';assert.ok(has(check(f,o),'LOCALE_MISMATCH'));
});
test('malformed output and invalid spans fail closed without returning source text',()=>{
 const f=fixture('history:en');for(const output of [null,[],{},'anything',1])assert.equal(check(f,output).ok,false);
 for(const range of [[-1,4],[0,999999],[2,2],[1.5,5],[0,Infinity]]){const o=referenceOutput(f);[o.blocks[0].start,o.blocks[0].end]=range;assert.ok(has(check(f,o),'SPAN'));}
 const o=referenceOutput(f);o.recommendation='new treatment';assert.ok(has(check(f,o),'OUTPUT_SHAPE'));
 const duplicate=referenceOutput(f);duplicate.blocks.push({...duplicate.blocks[0]});assert.ok(has(check(f,duplicate),'OVERLAPPING_SPANS'));
 const metadata=referenceOutput(f);metadata.blocks[0].confidence=.99;assert.ok(has(check(f,metadata),'BLOCK_SHAPE'));
 assert.equal(validateExtraction({text:'',locale:'en'},o).ok,false);
 assert.equal(validateExtraction({text:'x'.repeat(24001),locale:'en'},o).ok,false);
});
test('UTF-16 offsets preserve accents, emoji and repeated passages; source order remains observable',()=>{
 const f=fixture('chronology:pt-BR'),o=referenceOutput(f);assert.equal(check(f,o).ok,true);
 const split=referenceOutput(f);split.blocks[0]={section:'subjective',start:0,end:1,text:f.source.slice(0,1)};assert.ok(has(check(f,split),'UNICODE_BOUNDARY'));
 const before=o.blocks[1],after=o.blocks[2];assert.equal(before.text,after.text);assert.notEqual(before.start,after.start);
 [o.blocks[1],o.blocks[2]]=[o.blocks[2],o.blocks[1]];assert.ok(has(evaluateFixture(f,o),'SOURCE_ORDER'));
});
test('evaluation batches reject partial, duplicate and unknown cases instead of reporting a biased pass rate',()=>{
 const valid=fixtures.map(f=>({caseId:f.id,output:referenceOutput(f)}));const result=evaluateBatch(valid);assert.equal(result.passed,18);assert.equal(result.clinicalValidation,false);
 assert.throws(()=>evaluateBatch(valid.slice(1)),/BATCH_INCOMPLETE/);
 assert.throws(()=>evaluateBatch([...valid.slice(1),valid[1]]),/BATCH_INVALID/);
 assert.throws(()=>evaluateBatch([{...valid[0],caseId:'unknown'},...valid.slice(1)]),/BATCH_INVALID/);
 assert.doesNotMatch(JSON.stringify(result),/metformin|levothyroxine|Relata/);
});
test('CLI exits nonzero on failures and never echoes malformed candidate text',()=>{
 const dir=mkdtempSync(join(tmpdir(),'scribe-eval-'));
 try{
  const file=join(dir,'responses.json');writeFileSync(file,'{"sensitive-canary":');
  const bad=spawnSync(process.execPath,['evaluations/scribe/run.mjs','--responses',file],{encoding:'utf8'});assert.equal(bad.status,2);assert.doesNotMatch(bad.stdout+bad.stderr,/sensitive-canary/);
  const responses=fixtures.map(f=>({caseId:f.id,output:referenceOutput(f)}));responses[0].output.blocks=[];writeFileSync(file,JSON.stringify(responses));
  const fail=spawnSync(process.execPath,['evaluations/scribe/run.mjs','--responses',file],{encoding:'utf8'});assert.equal(fail.status,1);assert.equal(JSON.parse(fail.stdout).failed,1);
  const self=spawnSync(process.execPath,['evaluations/scribe/run.mjs','--self-check'],{encoding:'utf8'});assert.equal(self.status,0);assert.equal(JSON.parse(self.stdout).modelEvaluated,false);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
