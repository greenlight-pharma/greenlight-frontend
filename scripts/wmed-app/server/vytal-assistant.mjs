import {validateResponseStyle,responseStylePrompt,twoDoctorPresentation} from '../shared/assistant-style.mjs';
import {validateContext,contextualQuestion} from '../shared/international.mjs';
import {createHash} from 'node:crypto';
import {validateAttachments,assistantPayload} from '../shared/chat-attachments.mjs';
import { validateRequest, parseSSE } from './research.mjs';
import {perfilValido,modoPaciente,patientInstruction,emergencyTriage,emergencyMessage,emergencyAfter,EMERGENCY_NOTE} from '../shared/patient-mode.mjs';
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
// Identidade padrão (WMed no site Vytal): o token da conta Vytal vai como Bearer.
// O 2Doctor troca por accounts.identify (chave de serviço + conta própria).
export async function vytalIdentity(req){const token=sessionToken(req);return token?{id:token,headers:{Authorization:`Bearer ${token}`},path:p=>p}:null;}
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
function startSSE(res){res.statusCode=200;res.setHeader('Content-Type','text/event-stream; charset=utf-8');res.setHeader('Cache-Control','no-store, no-transform');res.setHeader('X-Accel-Buffering','no');res.flushHeaders?.();}
// Resposta fixa de emergência (modo paciente): sai mesmo sem cota ou com o assistente fora do ar.
function emergencyOnly(res,text){startSSE(res);if(!res.destroyed){res.write(`event: delta\ndata: ${JSON.stringify({text})}\n\n`);res.write(`event: done\ndata: {}\n\n`);}res.end();}
export async function chat(req,res,{fetchImpl=fetch,twoDoctorEnabled=process.env.TWO_DOCTOR_CHAT_ENABLED==='true',identify=vytalIdentity,allow=allowWrite}={}){
 headers(res);if(req.method!=='POST')return json(res,405,{error:'Método não permitido.'});if(!allow(req,res))return;
 let caller;try{caller=await identify(req);}catch{return json(res,503,{error:'O assistente está indisponível no momento. Tente novamente.'});}
 if(!caller)return json(res,401,{error:'Entre com sua conta para conversar.',code:'AUTH_REQUIRED'});
 // Modo paciente: decidido pelo perfil da conta no servidor. O navegador só pode pedir o modo
 // paciente (mais restrito) — usado quando não há conta própria (sem banco) — nunca o contrário.
 let input,attachments,patient=false,urgent='';try{const raw=await body(req,4400000);input=validateRequest(raw);const context=validateContext(raw);const style=validateResponseStyle(raw);if(style!==null&&!context)throw Error('INVALID_CONTEXT');
  if(raw.perfil!=null&&!perfilValido(raw.perfil))throw Error('INVALID_PROFILE');
  patient=modoPaciente(caller.perfil,raw.perfil);
  if(patient){
   const triage=emergencyTriage(input.question);const locale=context?.locale||'en';
   if(triage)urgent=emergencyMessage(triage,locale)+'\n\n'+emergencyAfter(locale)+'\n\n---\n\n';
   input.history=[...input.history,{role:'user',content:contextualQuestion(patientInstruction()+(triage?'\n'+EMERGENCY_NOTE:''),context)}];
  }else{
   const presentation=twoDoctorEnabled?twoDoctorPresentation(style??'auto'):responseStylePrompt(style);
   // The tutor keeps only 4,000 characters per message. Preferences must not
   // consume the user's 2,000-character question budget (including with files).
   if(context)input.history=[...input.history,{role:'user',content:contextualQuestion(presentation,context)}];
  }
  attachments=validateAttachments(raw.attachments);}catch(e){return json(res,400,{error:e.message==='BODY'?'Arquivos muito grandes. Envie até 3 MB.':e.message||'Mensagem ou arquivos inválidos.'});}
 const abort=new AbortController();res.on('close',()=>abort.abort());
 const fixed=urgent?urgent.replace(/\n\n---\n\n$/,''):'';
 let upstream;
 try{if(caller.charge&&!(await caller.charge('chat'))){if(urgent)return emergencyOnly(res,fixed);return json(res,429,{error:'Você atingiu o limite de uso de hoje. Volte amanhã.',code:'QUOTA'});}
 const payload=attachments.length?assistantPayload(input,attachments):{historico:[...input.history,{role:'user',content:input.question}]};
 upstream=await fetchImpl(API+caller.path(`/estudante/${twoDoctorEnabled?'2doctor':'tutor'}/chat-stream`),{method:'POST',headers:{'Content-Type':'application/json',...caller.headers},body:JSON.stringify(patient?{...payload,modo:'paciente'}:payload),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(attachments.length?270000:55000)]),redirect:'error'});}
 catch{if(res.destroyed)return;if(urgent)return emergencyOnly(res,fixed);return json(res,503,{error:'O assistente não respondeu. Tente novamente.'});}
 if(!upstream.ok){if(upstream.status===401)clear(res);if(urgent)return emergencyOnly(res,fixed);return json(res,[400,401,403,429].includes(upstream.status)?upstream.status:502,{error:await upstreamError(upstream,'Não foi possível conversar agora.'),code:upstream.status===401?'AUTH_REQUIRED':'ASSISTANT_UNAVAILABLE'});}
 if(!upstream.headers.get('content-type')?.includes('text/event-stream')){if(urgent)return emergencyOnly(res,fixed);return json(res,502,{error:'O assistente retornou uma resposta inválida.'});}
 startSSE(res);
 const send=(event,data)=>{if(!res.destroyed)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);};let completed=false;
 try{
  // A mensagem fixa de emergência sai antes de qualquer texto do modelo.
  if(urgent)send('delta',{text:urgent});
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
