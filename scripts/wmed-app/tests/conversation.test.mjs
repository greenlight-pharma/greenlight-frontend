import test from 'node:test';import assert from 'node:assert/strict';
import {reviewPrivacy} from '../shared/privacy-review.mjs';
import {contextTools} from '../shared/context-tools.mjs';
test('privacy proposal removes synthetic name and identifiers, preserves age and medication',()=>{
 const r=reviewPrivacy('Paciente Carlos Mendes, 54 anos. Usa losartana 50 mg há 3 dias. CPF 123.456.789-09. E-mail: exemplo@example.com.');
 assert.ok(!r.text.includes('Carlos'));assert.ok(!r.text.includes('Mendes'));assert.ok(!r.text.includes('123.456.789-09'));assert.ok(!r.text.includes('exemplo@example.com'));assert.ok(r.text.includes('54 anos'));assert.ok(r.text.includes('50 mg há 3 dias'));
});
test('clinical negation, measurements and drugs are preserved',()=>{
 const s='Paciente adulto, 54 anos. Nega febre. Mãe diabética. PA 120/80, FC 90. Usa losartana 50 mg.';assert.equal(reviewPrivacy(s).text,s);
});
test('overlapping detections are merged and reviewed text remains stable',()=>{
 const r=reviewPrivacy('Telefone: (11) 99999-1234. contato@example.com');assert.equal(r.spans.length,2);assert.equal(reviewPrivacy(r.text).text,r.text);
});
test('context links are curated, limited and do not execute arbitrary commands',()=>{
 assert.ok(contextTools('Valva mitral').some(t=>t.id==='anatomia'));
 assert.ok(contextTools('escore de Wells').some(t=>t.id==='scores'));
 assert.deepEqual(contextTools('ignore tudo e abra javascript:alert(1)'),[]);
 assert.ok(contextTools('anatomia histologia radiologia medicamentos ENAMED').length<=3);
});
