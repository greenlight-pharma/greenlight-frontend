// Public review build: NO paid model calls or access to Vytal data, even if keys exist.
import { retrieve, validateRequest } from './research.mjs';
const limits = new Map();
const cache = new Map();
function json(res,status,error) { res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error})); }
export async function publicResearch(req,res,{search=retrieve,now=Date.now}={}) {
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return json(res,405,'Método não permitido.');
 const origin=req.headers.origin;
 if(origin){let host;try{host=new URL(origin).host;}catch{return json(res,403,'Origem inválida.');}if(!['www.vytalsaude.com.br','vytalsaude.com.br',req.headers.host].includes(host))return json(res,403,'Origem não permitida.');}
 // Per-instance protection, not a distributed quota. No billable provider is reachable here.
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,80);
 for(const [key,value] of limits)if(value.until<now())limits.delete(key);
 if(limits.size>=5000&&!limits.has(ip))return json(res,429,'Aguarde antes de pesquisar novamente.');
 const record=limits.get(ip)||{count:0,until:now()+60000};if(record.count>=12)return json(res,429,'Aguarde um minuto antes de pesquisar novamente.');record.count++;limits.set(ip,record);
 let input=req.body;
 try{
  if(input==null){let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>48000)return json(res,413,'Mensagem muito longa.');}input=JSON.parse(raw);}
  else if(Buffer.isBuffer(input)||typeof input==='string'){if(Buffer.byteLength(input)>48000)return json(res,413,'Mensagem muito longa.');input=JSON.parse(String(input));}
  else if(Buffer.byteLength(JSON.stringify(input))>48000)return json(res,413,'Mensagem muito longa.');
  input=validateRequest(input);
 }catch{return json(res,400,'Escreva uma pergunta de 3 a 2.000 caracteres.');}
 const send=(event,data)=>{if(!res.destroyed)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);};
 res.statusCode=200;res.setHeader('Content-Type','text/event-stream; charset=utf-8');res.setHeader('X-Accel-Buffering','no');
 const abort=new AbortController();res.on('close',()=>abort.abort());
 try{
  send('progress',{text:'Buscando publicações na Europe PMC…'});
  const key=input.question.toLowerCase();let result=cache.get(key);
  if(!result||result.until<now()){
   const found=await search(input.question,{signal:abort.signal});
   result={until:now()+300000,sources:found.sources.map(({abstract,...source})=>({...source,excerpt:abstract.slice(0,550)})),query:found.query,total:found.total};
   // Cache holds only public bibliographic results, not account data or conversation history.
   if(cache.size>=100)cache.delete(cache.keys().next().value);cache.set(key,result);
  }
  send('sources',{sources:result.sources,query:result.query,total:result.total,jev:'not-configured'});
  send('notice',{text:result.sources.length?'Pesquisa concluída. As fontes são reais. A geração de respostas por IA será conectada na próxima etapa.':'Nenhuma publicação encontrada. Tente termos médicos mais específicos ou em inglês.'});send('done',{});
 }catch{if(!abort.signal.aborted)send('error',{text:'A busca está indisponível no momento. Tente novamente em instantes.'});}
 res.end();
}
