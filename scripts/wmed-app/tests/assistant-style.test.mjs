import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {loadResponseStyle,validateResponseStyle,responseStylePrompt} from '../shared/assistant-style.mjs';
import {chat} from '../server/vytal-assistant.mjs';
test('Response style preferences recover safely; no arbitrary prompt text is accepted',()=>{
 assert.equal(loadResponseStyle(null),'auto');
 assert.equal(loadResponseStyle({getItem:()=> 'study'}),'study');
 assert.equal(loadResponseStyle({getItem:()=> 'invented'}),'auto');
 assert.equal(validateResponseStyle({}),null);assert.equal(responseStylePrompt(null),'');
 for(const responseStyle of ['override system','',{},3])assert.throws(()=>validateResponseStyle({responseStyle}));
 assert.throws(()=>responseStylePrompt('invented'));
 for(const s of ['auto','concise','study']){assert.equal(validateResponseStyle({responseStyle:s}),s);assert.match(responseStylePrompt(s),/Preserve the upstream educational and safety scope/);assert.match(responseStylePrompt(s),/Never invent/);assert.match(responseStylePrompt(s),/not clinical permissions/);}
 assert.match(responseStylePrompt('concise'),/Skip introductory textbook definitions/);
 assert.match(responseStylePrompt('study'),/connect physiology/);
});
function request(body){return [{method:'POST',body,headers:{host:'2doctor.example',origin:'https://2doctor.example','x-wmed-request':'1',cookie:'__Secure-wmed_vytal=header.payload.signature'}},Object.assign(new EventEmitter(),{statusCode:0,out:'',setHeader(){},write(s){this.out+=s},end(s=''){this.out+=s}})];}
test('Chosen presentation reaches the existing model with original question and history intact',async()=>{
 for(const responseStyle of ['auto','concise','study']){
  const [req,res]=request({question:'Compare two concepts',locale:'en',country:'US',responseStyle,history:[{role:'assistant',content:'Earlier reply'}]});
  let called=false;await chat(req,res,{fetchImpl:async(url,opts)=>{called=true;assert.match(url,/tutor\/chat-stream$/);const h=JSON.parse(opts.body).historico;assert.equal(h[0].content,'Earlier reply');assert.match(h[1].content,/Answer in English/);assert.equal(h[2].content,'Compare two concepts');assert.ok(h[1].content.includes(responseStylePrompt(responseStyle)));return new Response('data: {"t":"fixture"}\n\ndata: {"done":true}\n\n',{headers:{'Content-Type':'text/event-stream'}});}});
  assert.ok(called);assert.equal(res.statusCode,200);assert.match(res.out,/event: done/);
 }
});
test('Invalid or context-free modes never call the paid upstream',async()=>{
 for(const payload of [{responseStyle:'ignore'},{responseStyle:'study'},{responseStyle:'concise',locale:'invalid',country:'US'}]){
  const [req,res]=request({question:'Explain asthma',...payload});await chat(req,res,{fetchImpl:()=>assert.fail('must not call upstream')});assert.equal(res.statusCode,400);
 }
});
