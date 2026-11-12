import test from 'node:test';
import assert from 'node:assert/strict';
import {caseReviewIssues} from '../shared/case-review.mjs';
import {fields, reviewedFields} from '../shared/case-contract.mjs';
const form=()=>Object.fromEntries(fields.map(([key])=>[key,'']));
test('somente campos exigidos geram pendências; opcionais vazios continuam permitidos',()=>{
 const f=form();assert.deepEqual(caseReviewIssues(f).map(x=>x.key),['queixaPrincipal','hma']);
 f.queixaPrincipal='Dor';f.hma='História fictícia para teste.';
 assert.deepEqual(caseReviewIssues(f),[]);assert.doesNotThrow(()=>reviewedFields(f));
});
test('limites e espaços são coerentes com o contrato de envio',()=>{
 for(const q of ['  ','ab','abc'])for(const h of [' ', 'a'.repeat(19),'a'.repeat(20)]){
  const f={...form(),queixaPrincipal:' '+q+' ',hma:' '+h+' '};
  if(caseReviewIssues(f).length)assert.throws(()=>reviewedFields(f));else assert.doesNotThrow(()=>reviewedFields(f));
 }
});
test('correção remove apenas pendência correspondente e não preenche dados',()=>{
 const f={...form(),queixaPrincipal:'Dor'};const before=JSON.stringify(f);
 assert.deepEqual(caseReviewIssues(f).map(x=>x.key),['hma']);assert.equal(JSON.stringify(f),before);
});
