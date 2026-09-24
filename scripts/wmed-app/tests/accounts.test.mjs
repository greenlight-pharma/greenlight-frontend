// Contas, chat e histórico WMed contra um Postgres real.
// Rodar: WMED_TEST_DATABASE_URL=postgres://… npm test (sem a variável, os testes de banco são pulados).
import test from 'node:test';import assert from 'node:assert/strict';import {EventEmitter} from 'node:events';
import {hashPassword,verifyPassword} from '../server/accounts.mjs';
import {buildMessages} from '../server/wmed-chat.mjs';

const URL_DB=process.env.WMED_TEST_DATABASE_URL;
const skip=URL_DB?false:'defina WMED_TEST_DATABASE_URL para testar com Postgres';

function call(handler,{method='POST',body,cookie='',lang='pt',headers={}}={},opts){
 const req=Object.assign(new EventEmitter(),{method,url:'/api/wmed/x',body:body===undefined?undefined:JSON.stringify(body),socket:{remoteAddress:'10.0.0.'+Math.floor(Math.random()*200)},
  headers:{host:'wmed.ai',origin:'https://wmed.ai','x-wmed-request':'1','x-wmed-lang':lang,'user-agent':'test',cookie,...headers}});
 const out={status:0,headers:{},chunks:[]};
 const res=Object.assign(new EventEmitter(),{destroyed:false,
  setHeader(k,v){out.headers[k.toLowerCase()]=v;},flushHeaders(){},write(c){out.chunks.push(String(c));},end(c){if(c)out.chunks.push(String(c));out.done=true;}});
 Object.defineProperty(res,'statusCode',{set(v){out.status=v;},get(){return out.status;}});
 return Promise.resolve(handler(req,res,opts)).then(()=>{out.text=out.chunks.join('');try{out.json=JSON.parse(out.text);}catch{}out.cookie=String(out.headers['set-cookie']||'').split(';')[0];return out;});
}
const events=text=>text.split('\n\n').filter(Boolean).map(b=>({event:b.match(/^event: (.*)$/m)?.[1],data:JSON.parse(b.match(/^data: (.*)$/m)?.[1]||'null')}));
function fakeClient(chunks=['Olá',' mundo'],{stop='end_turn',fail=false}={}){
 const calls=[];
 return {calls,beta:{messages:{stream(params){calls.push(params);if(fail)throw Object.assign(Error('boom'),{status:500});
  return {async *[Symbol.asyncIterator](){for(const text of chunks)yield {type:'content_block_delta',delta:{type:'text_delta',text}};},async finalMessage(){return {stop_reason:stop};}};}}}};
}

test('senha: scrypt verifica a certa e recusa a errada',async()=>{
 const h=await hashPassword('senha-muito-segura');
 assert.match(h,/^scrypt\$16384\$8\$1\$/);
 assert.equal(await verifyPassword('senha-muito-segura',h),true);
 assert.equal(await verifyPassword('outra-senha-qualquer',h),false);
 assert.equal(await verifyPassword('x','formato-invalido'),false);
});
test('mensagens para a Claude: anexos como blocos e conversa começando pelo usuário',()=>{
 const m=buildMessages({question:'Explique',history:[{role:'assistant',content:'oi'},{role:'user',content:'a'},{role:'assistant',content:'b'}]},[{kind:'image',name:'x.png',mediaType:'image/png',data:'iVBORw0KGgo='},{kind:'pdf',name:'a.pdf',data:'JVBERi0x'},{kind:'text',name:'n.txt',text:'nota'}]);
 assert.equal(m[0].role,'user');
 const last=m.at(-1).content;
 assert.deepEqual(last.map(b=>b.type),['image','document','text','text']);
 assert.equal(last.at(-1).text,'Explique');
});

test('contas, chat e histórico com Postgres',{skip},async t=>{
 process.env.DATABASE_URL=URL_DB;
 const {resetPool,query}=await import('../server/db.mjs');
 const {migrate}=await import('../server/migrate.mjs');
 const {auth}=await import('../server/accounts.mjs');
 const {chat}=await import('../server/wmed-chat.mjs');
 const {history}=await import('../server/wmed-history.mjs');
 await migrate(()=>{});
 await query('truncate users, auth_attempts cascade');
 const email=`ana${Date.now()}@exemplo.com`;
 let cookie;

 await t.test('cadastro exige termos, senha longa e cria sessão',async()=>{
  assert.equal((await call(auth,{body:{action:'signup',name:'Ana',email,password:'curta',acceptTerms:true}})).status,400);
  assert.equal((await call(auth,{body:{action:'signup',name:'Ana',email,password:'senha-bem-longa',acceptTerms:false}})).status,400);
  const r=await call(auth,{body:{action:'signup',name:'Ana Souza',email,password:'senha-bem-longa',acceptTerms:true,locale:'en'},lang:'en'});
  assert.equal(r.status,201);assert.equal(r.json.user.nome,'Ana');assert.equal(r.json.user.plan,'free');
  assert.match(r.headers['set-cookie'],/__Host-wmed_session=.+; Path=\/; HttpOnly; Secure; SameSite=Lax/);
  cookie=r.cookie;
  const dup=await call(auth,{body:{action:'signup',name:'Ana',email:email.toUpperCase(),password:'senha-bem-longa',acceptTerms:true},lang:'en'});
  assert.equal(dup.status,409);assert.match(dup.json.error,/already exists/);
 });
 await t.test('sessão, entrada e saída',async()=>{
  assert.equal((await call(auth,{method:'GET',cookie})).json.authenticated,true);
  assert.equal((await call(auth,{method:'GET'})).json.authenticated,false);
  assert.equal((await call(auth,{body:{action:'login',email,password:'errada-errada'}})).status,401);
  assert.equal((await call(auth,{body:{action:'login',email:'nao@existe.com',password:'qualquer-uma'}})).status,401);
  const ok=await call(auth,{body:{action:'login',email,password:'senha-bem-longa'}});assert.equal(ok.status,200);
  const out=await call(auth,{method:'DELETE',cookie:ok.cookie});assert.equal(out.json.authenticated,false);
  assert.equal((await call(auth,{method:'GET',cookie:ok.cookie})).json.authenticated,false);
 });
 await t.test('escrita sem cabeçalho do app ou de outra origem é recusada',async()=>{
  assert.equal((await call(auth,{body:{action:'login',email,password:'x'},headers:{'x-wmed-request':''}})).status,403);
  assert.equal((await call(auth,{body:{action:'login',email,password:'x'},headers:{origin:'https://evil.example'}})).status,403);
 });
 await t.test('chat exige conta, transmite a resposta e usa o prompt do idioma',async()=>{
  assert.equal((await call(chat,{body:{question:'O que é IC?'}},{client:fakeClient()})).status,401);
  const client=fakeClient(['Heart',' failure']);
  const r=await call(chat,{cookie,body:{question:'What is heart failure?',lang:'en'}},{client});
  const ev=events(r.text);
  assert.deepEqual(ev.map(e=>e.event),['progress','delta','delta','done']);
  assert.equal(ev.filter(e=>e.event==='delta').map(e=>e.data.text).join(''),'Heart failure');
  const p=client.calls[0];
  assert.equal(p.model,process.env.ANTHROPIC_MODEL||'claude-opus-5');assert.equal(p.fallbacks,'default');assert.deepEqual(p.betas,['server-side-fallback-2026-07-01']);
  assert.match(p.system[0].text,/Answer in English/);
 });
 await t.test('cota diária do plano gratuito e devolução quando a IA falha',async()=>{
  process.env.WMED_FREE_DAILY_CHATS='2'; // 1 já usada na pergunta em inglês
  const failed=await call(chat,{cookie,body:{question:'Pergunta com falha'}},{client:fakeClient([],{fail:true})});
  assert.equal(events(failed.text).at(-1).event,'error');
  const used=(await query('select chat_messages from daily_usage')).rows[0].chat_messages;
  assert.equal(used,1,'a falha não consome cota');
  assert.equal(events((await call(chat,{cookie,body:{question:'Segunda pergunta'}},{client:fakeClient()})).text).at(-1).event,'done');
  const blocked=await call(chat,{cookie,body:{question:'Terceira pergunta'}},{client:fakeClient()});
  assert.equal(blocked.status,429);assert.equal(blocked.json.code,'QUOTA');assert.match(blocked.json.error,/2 perguntas/);
  await query("update users set plan='pro'");
  assert.equal(events((await call(chat,{cookie,body:{question:'Agora sou Pro'}},{client:fakeClient()})).text).at(-1).event,'done');
  delete process.env.WMED_FREE_DAILY_CHATS;
 });
 await t.test('recusa de segurança vira aviso e não consome cota',async()=>{
  const before=(await query('select chat_messages from daily_usage')).rows[0].chat_messages;
  const r=await call(chat,{cookie,body:{question:'Pergunta recusada'}},{client:fakeClient([],{stop:'refusal'})});
  assert.equal(events(r.text).at(-1).event,'error');
  assert.equal((await query('select chat_messages from daily_usage')).rows[0].chat_messages,before);
 });
 await t.test('histórico: salvar, listar, abrir e isolar por conta',async()=>{
  const msgs=[{papel:'user',conteudo:'Explique a IC'},{papel:'assistant',conteudo:'Resposta'}];
  const saved=await call(history,{cookie,body:{action:'save',messages:msgs}});assert.equal(saved.status,200);
  const id=saved.json.id;
  await call(history,{cookie,body:{action:'save',id,messages:[...msgs,{papel:'user',conteudo:'E o tratamento?'}]}});
  const list=await call(history,{cookie,body:{action:'list'}});
  assert.equal(list.json[0].id,id);assert.equal(list.json[0].titulo,'Explique a IC');assert.equal(list.json[0].mensagens,3);
  assert.equal((await call(history,{cookie,body:{action:'open',id}})).json.mensagens.length,3);
  const other=await call(auth,{body:{action:'signup',name:'Beto',email:'b'+email,password:'outra-senha-longa',acceptTerms:true}});
  assert.equal((await call(history,{cookie:other.cookie,body:{action:'open',id}})).status,404);
  assert.equal((await call(history,{cookie:other.cookie,body:{action:'list'}})).json.length,0);
  assert.equal((await call(history,{body:{action:'list'}})).status,401);
 });
 await resetPool();
});
