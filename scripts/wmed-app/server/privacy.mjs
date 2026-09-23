import {sessionToken,allowWrite} from './vytal-assistant.mjs';
const API='https://vytal-api-production.up.railway.app';
const calls=new Map();
export async function privacy(req,res,{fetchImpl=fetch,endpoint=process.env.WMED_OPENMED_URL,key=process.env.WMED_OPENMED_TOKEN,now=Date.now}={}){
 const reply=(s,d)=>{res.statusCode=s;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(d))};
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 let enabled=false;try{enabled=!!key&&new URL(endpoint).protocol==='https:'}catch{}
 if(req.method==='GET')return reply(200,{enabled,engine:enabled?'openmed':null});
 if(req.method!=='POST')return reply(405,{error:'Método não permitido.'});
 if(!allowWrite(req,res))return;
 const token=sessionToken(req);if(!token)return reply(401,{error:'Entre com sua conta para usar a revisão ampliada.'});
 if(!enabled)return reply(503,{error:'O piloto OpenMed não está ativo neste ambiente. A revisão local continua disponível.'});
 let b=req.body;try{if(b==null){b='';for await(const c of req){b+=c;if(Buffer.byteLength(b)>30000)throw Error();}}if(typeof b==='string'||Buffer.isBuffer(b))b=JSON.parse(String(b));if(typeof b?.text!=='string'||b.text.length<3||b.text.length>6000)throw Error();}catch{return reply(400,{error:'Use um texto de 3 a 6.000 caracteres.'})}
 for(const [k,v]of calls)if(v.until<now())calls.delete(k);
 // Keyed by session, never text; bounded process-local throttle.
 const {createHash}=await import('node:crypto');const id=createHash('sha256').update(token).digest('hex');const count=calls.get(id)||{n:0,until:now()+60000};
 if(count.n>=6||calls.size>=5000&&!calls.has(id))return reply(429,{error:'Aguarde um minuto antes de analisar novamente.'});count.n++;calls.set(id,count);
 try{
  const me=await fetchImpl(API+'/estudante/me',{headers:{Authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(10000)});
  if(!me.ok)return reply(me.status===401?401:403,{error:'Não foi possível autorizar esta análise.'});
  const r=await fetchImpl(new URL('/review',endpoint),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({text:b.text}),redirect:'error',signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw Error();const data=await r.json();
  if(data.engine!=='openmed'||!Array.isArray(data.findings)||data.findings.length>1000||data.findings.some(f=>!Number.isInteger(f.start)||!Number.isInteger(f.end)||f.start<0||f.end<=f.start||f.end>b.text.length||typeof f.label!=='string'||f.label.length>60))throw Error();
  return reply(200,{engine:'openmed',findings:data.findings.map(({start,end,label})=>({start,end,label})),reviewRequired:true});
 }catch{return reply(503,{error:'A revisão ampliada não foi concluída. Nenhum resultado de IA foi aplicado.'})}
}
