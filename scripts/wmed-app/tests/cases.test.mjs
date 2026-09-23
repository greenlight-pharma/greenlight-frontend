import test from 'node:test';import assert from 'node:assert/strict';
import {cases} from '../server/cases.mjs';
import {caseSaveBody,restoreCase} from '../shared/case-storage.mjs';
import {fields} from '../shared/case-contract.mjs';
const request=body=>({method:'POST',headers:{origin:'https://www.vytalsaude.com.br',host:'www.vytalsaude.com.br','x-wmed-request':'1',cookie:'__Secure-wmed_vytal=e30.e30.fake'},body});
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},end(s){this.data=JSON.parse(s);}});
const snapshot=()=>({requestId:'aaaa0000-bbbb-cccc-dddd-eeee00000001',relato:'Caso fictício: pessoa adulta com tosse seca há três dias.',fields:Object.fromEntries(fields.map(([key])=>[key,key==='queixaPrincipal'?'Tosse seca':key==='hma'?'Tosse seca há três dias, sem outros dados disponíveis.':''])),feedback:{resumo_caso:'Relato sintético para teste.',hipoteses_para_discussao:[{hipotese:'Hipótese para discussão',justificativa:'Dados insuficientes.'}],comparacao_conduta_aluno:'Não deve persistir'},quality:null});
test('case history rejects anonymous, CSRF, path traversal and unsupported writes before upstream',async()=>{
 for(const change of [r=>delete r.headers.cookie,r=>r.headers.origin='https://evil.example',r=>r.body.id='../other',r=>r.body.action='delete']){const r=request({action:'open',id:'case-id'});change(r);const o=response();await cases(r,o,{fetchImpl:()=>assert.fail()});assert.ok([400,401,403].includes(o.statusCode));}
});
test('save and restore round-trip all reviewed fields, original story and feedback without fabricated student answers',()=>{
 const s=snapshot(),body=caseSaveBody(s);assert.equal(body.payload.wmed.relato,s.relato);assert.equal(body.feedback.comparacao_conduta_aluno,undefined);
 const restored=restoreCase({id:'stored-case',...body});assert.deepEqual(restored.form,s.fields);assert.equal(restored.relato,s.relato);assert.deepEqual(restored.feedback,body.feedback);
});
test('save forwards only authenticated account and validates inputs before persistence',async()=>{
 const o=response(),calls=[];await cases(request({action:'save',owner:'other',snapshot:snapshot()}),o,{fetchImpl:async(url,opts)=>{calls.push(url);assert.equal(opts.headers.Authorization,'Bearer e30.e30.fake');if(opts.method==='GET')return Response.json({casos:[]});const body=JSON.parse(opts.body);assert.equal(body.owner,undefined);assert.deepEqual(body,caseSaveBody(snapshot()));return Response.json({caso:{id:'saved'}});}});assert.equal(o.data.caso.id,'saved');assert.equal(calls.length,2);assert.equal(o.headers['Cache-Control'],'private, no-store');
 for(const s of [{...snapshot(),requestId:'../x'},{...snapshot(),relato:'Paciente CPF 123.456.789-09 com queixa clínica.'},{...snapshot(),feedback:[]},{...snapshot(),quality:{score:101,criteria:[]}}]){const out=response();await cases(request({action:'save',snapshot:s}),out,{fetchImpl:()=>assert.fail()});assert.equal(out.statusCode,400);}
});
test('retry reconciles a previously saved request after a lost response without creating another case',async()=>{
 const o=response();let calls=0;await cases(request({action:'save',snapshot:snapshot()}),o,{fetchImpl:async(url,opts)=>{calls++;assert.equal(opts.method,'GET');assert.ok(url.includes(snapshot().requestId));return Response.json({casos:[{id:'existing',...caseSaveBody(snapshot())}]});}});assert.equal(o.data.caso.id,'existing');assert.equal(calls,1);
});
test('history paginates and minimizes listing; opening delegates account ownership upstream',async()=>{
 const o=response();await cases(request({action:'list',page:2,search:'Tosse'}),o,{fetchImpl:async(url)=>{assert.ok(url.includes('page=2'));assert.ok(url.includes('pageSize=12'));return Response.json({casos:[{id:'case',titulo:'Tosse',createdAt:'2026-09-23',...caseSaveBody(snapshot())}],paginacao:{page:2,totalPages:3}});}});assert.equal(o.data.casos[0].payload,undefined);assert.equal(o.data.casos[0].feedback,undefined);assert.equal(o.data.paginacao.totalPages,3);
 const denied=response();await cases(request({action:'open',id:'foreign-case'}),denied,{fetchImpl:async()=>Response.json({}, {status:404})});assert.equal(denied.statusCode,404);
});
test('upstream save failure is explicit, never a false saved confirmation',async()=>{
 const o=response();await cases(request({action:'save',snapshot:snapshot()}),o,{fetchImpl:async(url,opts)=>opts.method==='GET'?Response.json({casos:[]}):Response.json({}, {status:500})});assert.equal(o.statusCode,503);assert.ok(o.data.error);assert.equal(o.data.caso,undefined);
});

// PostgreSQL JSONB returns alphabetical keys; re-opening must still read S → B → A → R.
import {orderedSbar,guidanceFeedback} from '../shared/case-contract.mjs';
test('SBAR preserves the presentation sequence after JSON key reordering and keeps additional content',()=>{
 const input={A:['avaliação'],B:['contexto'],R:['recomendação'],S:['situação'],nota:'adicional'};
 const result=orderedSbar(input);
 assert.deepEqual(result.steps.map(step=>step.letter),['S','B','A','R']);
 assert.deepEqual(result.steps.map(step=>step.value),[['situação'],['contexto'],['avaliação'],['recomendação']]);
 assert.deepEqual(result.extras,{nota:'adicional'});
 assert.equal(orderedSbar('texto legado'),null);
});
test('WMed removes both remaining didactic alignments while preserving the analysis and SBAR',()=>{
 const input={alinhamento_anamnese_didatico:'alta_concordancia',alinhamento_exame_fisico_didatico:'divergencia',analise_anamnese:{texto:'anamnese'},analise_exame_fisico:{texto:'exame'},como_apresentar_caso:{S:['situação']}};
 assert.deepEqual(guidanceFeedback(input),{analise_anamnese:input.analise_anamnese,analise_exame_fisico:input.analise_exame_fisico,como_apresentar_caso:input.como_apresentar_caso});
});
