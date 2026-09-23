import test from 'node:test';import assert from 'node:assert/strict';
import {history} from '../server/history.mjs';
import {createHistoryWriter,encodeMessages,decodeMessages} from '../shared/history.mjs';
const request=body=>({method:'POST',headers:{origin:'https://www.vytalsaude.com.br',host:'www.vytalsaude.com.br','x-wmed-request':'1',cookie:'__Secure-wmed_vytal=e30.e30.fake'},body});
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},end(s){this.data=JSON.parse(s);}});
test('history rejects anonymous, foreign origin and path traversal without reading upstream',async()=>{
 for(const change of [r=>delete r.headers.cookie,r=>r.headers.origin='https://evil.example',r=>r.body.id='../me']){const r=request({action:'open',id:'abc'});change(r);const o=response();await history(r,o,{fetchImpl:()=>assert.fail()});assert.ok([400,401,403].includes(o.statusCode));}
});
test('history forwards the session, never a supplied owner; preserves forbidden upstream result',async()=>{
 const o=response();await history(request({action:'save',userId:'another-user',messages:[{papel:'user',conteudo:'Texto sintético'}]}),o,{fetchImpl:async(url,options)=>{assert.ok(url.endsWith('/tutor/conversas'));assert.equal(options.headers.Authorization,'Bearer e30.e30.fake');assert.deepEqual(JSON.parse(options.body),{conversaId:null,mensagens:[{papel:'user',conteudo:'Texto sintético'}]});return Response.json({id:'new'});}});assert.equal(o.data.id,'new');assert.equal(o.headers['Cache-Control'],'private, no-store');
 const denied=response();await history(request({action:'open',id:'other'}),denied,{fetchImpl:async()=>Response.json({}, {status:403})});assert.equal(denied.statusCode,403);
});
test('oversized messages fail rather than silently truncating a conversation',async()=>{const o=response();await history(request({action:'save',messages:[{papel:'assistant',conteudo:'x'.repeat(20001)}]}),o,{fetchImpl:()=>assert.fail()});assert.equal(o.statusCode,400);});
test('queued saves reuse new conversation id and latest snapshot wins',async()=>{
 let release;const gate=new Promise(r=>release=r),calls=[];const writer=createHistoryWriter(async(id,rows)=>{calls.push({id,rows});if(calls.length===1)await gate;return{id:'chat-id'};});writer.enqueue(['first']);const pending=writer.flush();writer.enqueue(['second']);writer.enqueue(['last']);release();await pending;assert.deepEqual(calls,[{id:null,rows:['first']},{id:'chat-id',rows:['last']}]);
});
test('failed writes remain retryable and partial answers never become completed context',async()=>{
 let fail=true;const w=createHistoryWriter(async()=>{if(fail)throw Error('offline');return{id:'retry-id'};});w.enqueue(['message']);await assert.rejects(w.flush());fail=false;assert.equal(await w.flush(),'retry-id');
 const rows=encodeMessages([{role:'user',text:'Pergunta',mode:'chat'},{role:'assistant',text:'Parcial',mode:'chat',complete:false},{role:'assistant',text:'Artigo',mode:'research'}]);assert.equal(rows.length,2);const loaded=decodeMessages({id:'test',mensagens:rows});assert.equal(loaded[1].complete,false);assert.equal(loaded[0].text,'Pergunta');
});
