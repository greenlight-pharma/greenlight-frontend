import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';
import {progressKey} from '../src/enamed/progress.mjs';
async function load(path){const r=await build({entryPoints:[path],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)}
test('USMLE pack: every topic has a summary with an exam trap and exactly five cards',async()=>{
 const c=await load('src/usmle/content.ts');
 assert.ok(c.USMLE_AREAS.length>=8);
 const ids=new Set(),keys=new Set();
 for(const a of c.USMLE_AREAS){
  assert.ok(!ids.has(a.id));ids.add(a.id);assert.ok(a.nome&&a.step&&a.temas.length);
  for(const [ti,t] of a.temas.entries()){
   assert.ok(t.t&&t.r.length>400,`${a.id}:${ti} summary too short`);
   assert.match(t.r,/\*\*Exam trap\.\*\*/,`${a.id}:${ti} lacks an exam trap`);
   const cards=c.USMLE_DECK[a.id].filter(x=>x.ti===ti);
   assert.equal(cards.length,5,`${a.id}:${ti} should have 5 cards`);
   for(const card of cards){assert.ok(card.q.endsWith('?')||card.q.endsWith('.'),card.q);assert.ok(card.a.length>2);const k=`${a.id}:${ti}:c${card.ci}`;assert.ok(!keys.has(k));keys.add(k);}
  }
 }
 assert.equal(c.USMLE_TOTAL_CARDS,keys.size);
 assert.equal(c.USMLE_TOTAL_CARDS,c.USMLE_TOTAL_TOPICS*5);
});
test('USMLE content is written in English (no Portuguese markers)',async()=>{
 const c=await load('src/usmle/content.ts');
 const text=JSON.stringify([c.USMLE_AREAS,c.USMLE_DECK]);
 assert.doesNotMatch(text,/\b(não|são|pegadinha|tratamento|diagnóstico|paciente)\b/i);
});
test('USMLE progress lives in its own key and ENAMED keeps the original one',()=>{
 assert.equal(progressKey('abc'),'wmed:enamed:v1:abc');
 assert.equal(progressKey('abc','usmle'),'wmed:usmle:v1:abc');
 assert.notEqual(progressKey('abc','usmle'),progressKey('abc'));
});
