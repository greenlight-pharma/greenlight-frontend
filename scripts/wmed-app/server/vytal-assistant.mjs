import {validateContext,contextualQuestion} from '../shared/international.mjs';
import {createHash} from 'node:crypto';
import {validateAttachments,assistantPayload} from '../shared/chat-attachments.mjs';
import { validateRequest, parseSSE } from './research.mjs';
const API='https://vytal-api-production.up.railway.app';
const COOKIE='__Secure-wmed_vytal';
const attempts=new Map();
function headers(res){res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
function clear(res){res.setHeader('Set-Cookie',`${COOKIE}=; Path=/api/wmed; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);}
export function sessionToken(req){
 const value=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
 return value&&value.length<=8192&&/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)?value:null;
}
export function allowWrite(req,res){
 const origin=req.headers.origin;
 if(req.headers['x-wmed-request']!=='1'||!origin)return json(res,403,{error:'Atualize a página antes de continuar.'}),false;
 try{const u=new URL(origin);if(u.protocol!=='https:'||!['www.vytalsaude.com.br','vytalsaude.com.br',req.headers.host].includes(u.host))throw Error();}
 catch{return json(res,403,{error:'Origem não permitida.'}),false;}
 return true;
}
async function body(req,max=48000){let data=req.body;if(data==null){data='';for await(const c of req){data+=c;if(Buffer.byteLength(data)>max)throw Error('BODY');}}if(typeof data==='string'||Buffer.isBuffer(data)){if(Buffer.byteLength(data)>max)throw Error('BODY');data=JSON.parse(String(data));}else if(Buffer.byteLength(JSON.stringify(data))>max)throw Error('BODY');return data;}
function userInfo(user){return {...(typeof user?.id==='string'?{progressScope:createHash('sha256').update('wmed-progress:'+user.id).digest('hex')} : {}),nome:typeof user?.nome==='string'?user.nome.split(' ')[0].slice(0,60):''};}
async function upstreamError(r,fallback){if(r.status>=500)return fallback;try{const j=await r.json();const msg=j.message||j.error;return typeof msg==='string'&&msg.length<500?msg:Array.isArray(msg)?msg.filter(v=>typeof v==='string').join(' ').slice(0,400):fallback;}catch{return fallback;}}
export async function auth(req,res,{fetchImpl=fetch,now=Date.now}={}){
 headers(res);
 if(req.method==='GET'){
  const token=sessionToken(req);if(!token)return json(res,200,{authenticated:false});
  try{const r=await fetchImpl(`${API}/estudante/me`,{headers:{Authorization:`Bearer ${token}`},redirect:'error',signal:AbortSignal.timeout(12000)});
   if(r.status===401){clear(res);return json(res,200,{authenticated:false});}
   if(!r.ok)return json(res,503,{error:'Não foi possível conferir sua sessão. Tente novamente.'});
   return json(res,200,{authenticated:true,user:userInfo((await r.json()).user)});
  }catch{return json(res,503,{error:'Não foi possível conferir sua sessão. Tente novamente.'});}
 }
 if(!['POST','DELETE'].includes(req.method))return json(res,405,{error:'Método não permitido.'});
 if(!allowWrite(req,res))return;
 if(req.method==='DELETE'){clear(res);return json(res,200,{authenticated:false});}
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,80);
 for(const [k,v]of attempts)if(v.until<now())attempts.delete(k);
 if(attempts.size>=5000&&!attempts.has(ip))return json(res,429,{error:'Tente novamente em um minuto.'});
 const record=attempts.get(ip)||{count:0,until:now()+60000};if(record.count>=6)return json(res,429,{error:'Muitas tentativas. Aguarde um minuto.'});record.count++;attempts.set(ip,record);
 let input;try{input=await body(req,4096);if(typeof input.email!=='string'||!/^\S+@\S+\.\S+$/.test(input.email)||input.email.length>254||typeof input.password!=='string'||!input.password||input.password.length>512)throw Error();}catch{return json(res,400,{error:'Informe seu e-mail e sua senha do Vytal Acadêmico.'});}
 try{
  const r=await fetchImpl(`${API}/estudante/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:input.email.trim().toLowerCase(),password:input.password}),redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!r.ok)return json(res,[400,401,403,429].includes(r.status)?r.status:503,{error:await upstreamError(r,'Não foi possível entrar. Tente novamente.')});
  const data=await r.json();const token=data.token;
  if(typeof token!=='string'||token.length>8192||!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token))return json(res,502,{error:'A sessão retornada é inválida. Tente novamente.'});
  res.setHeader('Set-Cookie',`${COOKIE}=${token}; Path=/api/wmed; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
  return json(res,200,{authenticated:true,user:userInfo(data.user)});
 }catch{return json(res,503,{error:'O acesso ao Vytal está indisponível no momento. Tente novamente.'});}
}
export async function chat(req,res,{fetchImpl=fetch}={}){
 headers(res);if(req.method!=='POST')return json(res,405,{error:'Método não permitido.'});if(!allowWrite(req,res))return;
 const token=sessionToken(req);if(!token)return json(res,401,{error:'Entre com sua conta Vytal Acadêmico para conversar.',code:'AUTH_REQUIRED'});
 let input,attachments;try{const raw=await body(req,4400000);input=validateRequest(raw);const context=validateContext(raw);input.question=contextualQuestion(input.question,context);attachments=validateAttachments(raw.attachments);}catch(e){return json(res,400,{error:e.message==='BODY'?'Arquivos muito grandes. Envie até 3 MB.':e.message||'Mensagem ou arquivos inválidos.'});}
 const abort=new AbortController();res.on('close',()=>abort.abort());
 let upstream;
 try{upstream=await fetchImpl(`${API}/estudante/tutor/chat-stream`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(attachments.length?assistantPayload(input,attachments):{historico:[...input.history,{role:'user',content:input.question}]}),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(attachments.length?270000:55000)]),redirect:'error'});}
 catch{if(!res.destroyed)return json(res,503,{error:'O assistente não respondeu. Tente novamente.'});return;}
 if(!upstream.ok){if(upstream.status===401)clear(res);return json(res,[400,401,403,429].includes(upstream.status)?upstream.status:502,{error:await upstreamError(upstream,'Não foi possível conversar agora.'),code:upstream.status===401?'AUTH_REQUIRED':'ASSISTANT_UNAVAILABLE'});}
 if(!upstream.headers.get('content-type')?.includes('text/event-stream'))return json(res,502,{error:'O assistente retornou uma resposta inválida.'});
 res.statusCode=200;res.setHeader('Content-Type','text/event-stream; charset=utf-8');res.setHeader('Cache-Control','no-store, no-transform');res.setHeader('X-Accel-Buffering','no');res.flushHeaders?.();
 const send=(event,data)=>{if(!res.destroyed)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);};let completed=false;
 try{
  send('progress',{text:'O assistente está preparando sua resposta…'});
  for await(const event of parseSSE(upstream.body)){
   if(typeof event.error==='string'){send('error',{text:'O assistente não conseguiu concluir a resposta. Tente novamente.'});completed=true;break;}
   if(typeof event.t==='string')send('delta',{text:event.t});
   if(event.done===true){send('done',{});completed=true;break;}
  }
  if(!completed&&!abort.signal.aborted)send('error',{text:'A resposta foi interrompida. Você pode tentar novamente.'});
 }catch{if(!abort.signal.aborted)send('error',{text:'A conexão com o assistente foi interrompida. Tente novamente.'});}
 res.end();
}
