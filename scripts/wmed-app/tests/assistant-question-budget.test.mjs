import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {chat} from '../server/vytal-assistant.mjs';
import {languages,countries} from '../shared/international.mjs';
import {responseStyles,responseStylePrompt,twoDoctorPresentation} from '../shared/assistant-style.mjs';

for(const twoDoctorEnabled of [false,true])test(`Maximum question survives message limits: dedicated=${twoDoctorEnabled}, every locale/country/style, with and without files`,async()=>{
 const ending='FINAL_DA_PERGUNTA_123';
 const question='Texto fictício. '.repeat(130).slice(0,2000-ending.length)+ending;
 assert.equal(question.length,2000);
 const document='d'.repeat(11980)+'FINAL_DO_DOCUMENTO!!';
 assert.equal(document.length,12000);
 for(const {id:locale} of languages)for(const country of countries)for(const responseStyle of responseStyles)for(const withFiles of [false,true]){
  const req={method:'POST',headers:{host:'2doctor.example',origin:'https://2doctor.example','x-wmed-request':'1',cookie:'__Secure-wmed_vytal=header.payload.signature'},body:{question,locale,country,responseStyle,history:Array.from({length:6},(_,i)=>({role:i%2?'assistant':'user',content:`Histórico fictício ${i}`})),...(withFiles?{attachments:[{kind:'text',name:'ficcao.txt',text:document},{kind:'image',name:'ficcao.png',mediaType:'image/png',data:'iVBORw0KGgo='},{kind:'pdf',name:'ficcao.pdf',data:'JVBERi0xLjQK'}]}:{})}};
  const res=Object.assign(new EventEmitter(),{out:'',setHeader(){},write(s){this.out+=s},end(s=''){this.out+=s}});
  let called=false;
  await chat(req,res,{twoDoctorEnabled,fetchImpl:async(url,options)=>{
   called=true;
   assert.ok(url.endsWith(twoDoctorEnabled?'/estudante/2doctor/chat-stream':'/estudante/tutor/chat-stream'));
   const payload=JSON.parse(options.body);
   assert.ok(payload.historico.length<=10);
   assert.ok(payload.historico.every(m=>m.content.length<=4000));
   // Apply the existing tutor's actual limits before asserting preservation.
   const delivered=payload.historico.slice(-10).map(m=>({...m,content:m.content.slice(0,4000)}));
   assert.equal(delivered.at(-1).content,question);
   assert.ok(delivered.some(m=>m.content.includes((twoDoctorEnabled?twoDoctorPresentation(responseStyle):responseStylePrompt(responseStyle)))));
   if(withFiles){
    assert.ok(delivered.some(m=>m.content.includes('FINAL_DO_DOCUMENTO!!')));
    assert.equal(payload.imagens.length,1);assert.equal(payload.pdfs.length,1);
   }
   return new Response('data: {"done":true}\n\n',{headers:{'Content-Type':'text/event-stream'}});
  }});
  assert.ok(called);assert.equal(res.statusCode,200);assert.match(res.out,/event: done/);
 }
});
