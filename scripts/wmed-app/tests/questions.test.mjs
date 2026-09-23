import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'vytal-questions-'));
const out=join(dir,'model.mjs');
await build({entryPoints:['src/questions/model.ts'],outfile:out,bundle:true,platform:'node',format:'esm'});
const {questions,byId,cleanProgress,cleanSession,sessionResult,parseBackup,emptyFilters,filterQuestions,areaOf,areas}=await import(pathToFileURL(out));
test('acervo contém 770 IDs únicos, cinco áreas e gabaritos presentes nas alternativas, incluindo E',()=>{
 assert.equal(questions.length,770);assert.equal(byId.size,770);assert.equal(new Set(questions.map(q=>q.banca)).size,7);
 assert.deepEqual([...new Set(questions.map(areaOf))].sort(),[...areas].sort());
 for(const q of questions){assert.ok(q.alternativas[q.gabarito],`gabarito ${q.n}`);assert.ok(q.enunciado&&q.explicacao);}
 assert.ok(questions.some(q=>q.gabarito==='E'));
});
test('importação preserva respostas legadas e recalcula correção sem confiar no arquivo',()=>{
 const q=questions.find(q=>q.gabarito==='E');
 assert.deepEqual(cleanProgress({[q.n]:{answer:'E',correct:false}}),{[q.n]:{answer:'E',correct:true}});
 assert.deepEqual(cleanProgress({'__proto__':{answer:'A'},'99999':{answer:'A'},'1':{answer:'Z'},'01':{answer:'A'}}),{});
 const backup=parseBackup(JSON.stringify({format:'vytal-questions',version:1,progress:{[q.n]:{answer:'E',correct:false}},bookmarks:[q.n,q.n,99999]}));
 assert.equal(backup.progress[q.n].correct,true);assert.deepEqual(backup.bookmarks,[q.n]);
 assert.throws(()=>parseBackup('{}'));assert.throws(()=>parseBackup('x'.repeat(2_000_001)));
});
test('simulado mantém fila fixa e conta separadamente itens sem resposta',()=>{
 const first=questions[0],second=questions[1];
 const raw={ids:[first.n,second.n],index:999,answers:{[first.n]:first.gabarito,'99999':'A'},finished:false};
 const s=cleanSession(raw);assert.equal(s.index,1);assert.equal(Object.keys(s.answers).length,1);
 assert.deepEqual(sessionResult(s),{total:2,answered:1,correct:1,review:0,unanswered:1});
 assert.deepEqual(s.ids,[first.n,second.n]);assert.equal(cleanSession({...raw,ids:[1,1]}),null);
 assert.equal(cleanSession({...raw,ids:[99999]}),null);
});
test('filtros distinguem não respondidas, revisão e salvas sem perder especialidades',()=>{
 const q=questions[0];const p={[q.n]:{answer:'Z',correct:false}};
 assert.equal(filterQuestions({...emptyFilters,status:'review'},p,[]).length,1);
 assert.equal(filterQuestions({...emptyFilters,status:'new'},p,[]).length,769);
 assert.equal(filterQuestions({...emptyFilters,status:'saved'},{},[q.n]).length,1);
 for(const area of areas)assert.ok(filterQuestions({...emptyFilters,area},{},[]).every(q=>areaOf(q)===area));
});
await rm(dir,{recursive:true,force:true});

test('progress stays separated between accounts and guest',async()=>{
 const {questionStorageKey}=await import('../src/questions/storage.mjs');
 assert.notEqual(questionStorageKey('a'.repeat(64)),questionStorageKey('b'.repeat(64)));
 assert.notEqual(questionStorageKey('a'.repeat(64)),questionStorageKey(null));
 assert.equal(questionStorageKey('user@example.com'),'wmed:questions:guest');
});
test('bank filter selects exams rather than treating exams as areas',()=>{
 for(const bank of new Set(questions.map(q=>q.banca))){
  const result=filterQuestions({...emptyFilters,bank},{},[]);
  assert.ok(result.length>0);assert.ok(result.every(q=>q.banca===bank));
 }
});
