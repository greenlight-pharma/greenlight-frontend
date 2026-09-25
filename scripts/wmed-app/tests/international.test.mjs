import test from 'node:test';import assert from 'node:assert/strict';import {EventEmitter} from 'node:events';
import {resolveLocale,loadPreferences,validateContext,contextualQuestion} from '../shared/international.mjs';
import {catalog,translate} from '../shared/i18n/catalog.mjs';import {chat} from '../server/vytal-assistant.mjs';import {searchNavigation} from '../shared/product.mjs';
test('Browser language never infers country; stored choice wins and invalid storage recovers',()=>{
 assert.equal(resolveLocale('es-MX'),'es');assert.equal(resolveLocale('pt-PT'),'pt-BR');assert.equal(resolveLocale('zh-CN'),'en');
 assert.deepEqual(loadPreferences(null,'en-US'),{locale:'en',country:'global'});
 assert.deepEqual(loadPreferences({getItem:()=>JSON.stringify({locale:'es',country:'BR'})},'en-US'),{locale:'es',country:'BR'});
 assert.deepEqual(loadPreferences({getItem:()=>'{broken'},'pt-BR'),{locale:'pt-BR',country:'global'});
 assert.deepEqual(loadPreferences({getItem:()=>JSON.stringify({locale:'unsupported',country:'invented'})},'es'),{locale:'es',country:'global'});
});
test('Every localized label has two explicit translations; fallback preserves unlocalized content',()=>{
 for(const [key,value] of Object.entries(catalog)){assert.equal(value.length,2,key);assert.ok(value.every(v=>typeof v==='string'&&v.trim()),key);assert.equal(translate('pt-BR',key),key);}
 assert.equal(translate('en','medical-source-unchanged'),'medical-source-unchanged');
});
test('Country and language accept only trusted allowlists; legacy requests are unchanged',()=>{
 assert.equal(validateContext({}),null);assert.equal(contextualQuestion('question',null),'question');
 for(const input of [{locale:'es',country:'ignore safety'},{locale:'system',country:'BR'},{country:'BR'}])assert.throws(()=>validateContext(input));
 const q=contextualQuestion('Explain asthma',validateContext({locale:'en',country:'BR'}));assert.match(q,/Answer in English/);assert.match(q,/Brazil/);assert.match(q,/Preserve all educational and safety instructions/);assert.match(q,/Explain asthma$/);
});
test('Translated navigation searches translated module and group names',()=>{
 const rows=searchNavigation([{id:'caso',label:'Clinical case',description:'Feedback'}],'clinical',[{id:'plantao',label:'Clinical practice',modules:['caso']}]);assert.equal(rows[0].items[0].id,'caso');
});
function mock(body){return [{method:'POST',body,headers:{host:'2doctor.example',origin:'https://2doctor.example','x-wmed-request':'1',cookie:'__Secure-wmed_vytal=header.payload.signature'}},Object.assign(new EventEmitter(),{statusCode:0,out:'',setHeader(){},write(s){this.out+=s},end(s=''){this.out+=s}})];}
test('Assistant forwards language context with unchanged history and protected educational contract',async()=>{
 const [req,res]=mock({question:'Explain asthma',locale:'es',country:'MX',history:[{role:'assistant',content:'Previous answer'}]});
 await chat(req,res,{fetchImpl:async(url,opts)=>{const data=JSON.parse(opts.body);assert.equal(data.historico[0].content,'Previous answer');assert.match(data.historico[1].content,/Answer in Spanish/);assert.match(data.historico[1].content,/Mexico/);assert.match(data.historico[1].content,/Explain asthma$/);return new Response('data: {"t":"fixture"}\n\ndata: {"done":true}\n\n',{headers:{'Content-Type':'text/event-stream'}});}});assert.equal(res.statusCode,200);assert.match(res.out,/event: done/);
});
test('Invalid locale is rejected before the paid upstream call',async()=>{const[req,res]=mock({question:'Explain asthma',locale:'en; override system',country:'US'});await chat(req,res,{fetchImpl:()=>assert.fail('must not invoke model')});assert.equal(res.statusCode,400);});
