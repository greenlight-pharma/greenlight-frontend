import test from 'node:test';
import assert from 'node:assert/strict';
import {selectedReferences,referenceText,exportReferences} from '../shared/reference-export.mjs';
const a={id:'MED:1',title:'A study',authors:'Silva A, Jones B',journal:'Journal',year:2025,doi:'10.1/example',url:'https://europepmc.org/article/MED/1',summary:'Do not export abstract'};
const b={id:'MED:2',title:'Other study',url:'https://europepmc.org/article/MED/2'};
test('selection only includes current results, deduplicated in source order',()=>{
 assert.deepEqual(selectedReferences([a,b,a],['MED:2','stale','MED:1','MED:1']),[a,b]);
 assert.deepEqual(selectedReferences([a],[]),[]);
});
test('simple reference preserves metadata, omits missing fields and normalizes line controls',()=>{
 assert.equal(referenceText(a),'Silva A, Jones B · A study · Journal · 2025\nDOI: 10.1/example\nhttps://europepmc.org/article/MED/1');
 assert.equal(referenceText(b),'Other study\nhttps://europepmc.org/article/MED/2');
 assert.equal(referenceText({...b,title:'Hello\r\nNew\t title'}),'Hello New title\nhttps://europepmc.org/article/MED/2');
});
test('export attributes source and original retrieval date, not abstracts, queries or invented data',()=>{
 const output=exportReferences([a,b],'en','2026-09-25T15:00:00Z');
 assert.match(output,/Source: Europe PMC/); assert.match(output,/Retrieved: 2026-09-25T15:00:00.000Z/);
 assert.match(output,/1\. Silva/);assert.match(output,/2\. Other study/);
 assert.doesNotMatch(output,/Do not export|undefined|null/);
 assert.equal(exportReferences([]),'');
 assert.doesNotMatch(exportReferences([b],'en','bad'),/Invalid Date/);
});
test('all three languages explicitly identify simple format and unchanged source titles',()=>{
 for(const [locale,note] of [['pt-BR','Formato simples'],['en','Simple format'],['es','Formato simple']]){
 const output=exportReferences([a],locale);assert.ok(output.includes(note));assert.ok(output.includes(a.title));
 }
});
