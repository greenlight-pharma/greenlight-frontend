import http from 'node:http';
import {retrieve,rank,synthesize,validateRequest} from './research.mjs';
const port=Number(process.env.WMED_API_PORT||5199);const calls=[];
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
export const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.headers.origin&&!['http://127.0.0.1:5198','http://localhost:5198'].includes(req.headers.origin))return json(res,403,{error:'Origem não permitida.'});
 if(req.url==='/api/status'&&req.method==='GET')return json(res,200,{research:'europe-pmc',jev:process.env.TYPESAFE_API_KEY?'configured':'not-configured',synthesis:process.env.ANTHROPIC_API_KEY&&process.env.ANTHROPIC_MODEL?'configured':'not-configured',mode:'local-development'});
 if(req.url!=='/api/research'||req.method!=='POST')return json(res,404,{error:'Recurso não encontrado.'});
 while(calls.length&&calls[0]<Date.now()-60000)calls.shift();if(calls.length>=10)return json(res,429,{error:'Aguarde um minuto antes de pesquisar novamente.'});calls.push(Date.now());
 let input='';try{for await(const chunk of req){input+=chunk;if(Buffer.byteLength(input)>48000)return json(res,413,{error:'Mensagem muito longa.'});}}catch{return;}
 let validated;try{validated=validateRequest(JSON.parse(input));}catch(e){return json(res,400,{error:e instanceof SyntaxError?'Formato inválido.':e.message});}
 const abort=new AbortController();res.on('close',()=>abort.abort());
 res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no'});
 const send=(event,data)=>{if(!res.destroyed)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);};
 try{
  send('progress',{text:'Buscando publicações na Europe PMC…'});
  const found=await retrieve(validated.question,{signal:abort.signal});
  const ranked=await rank(validated.question,found.sources,{signal:abort.signal});
  send('sources',{sources:ranked.sources.map(({abstract,...s})=>({...s,excerpt:abstract.slice(0,550)})),query:found.query,total:found.total,jev:ranked.status});
  if(!ranked.sources.length){send('notice',{text:'Nenhuma publicação encontrada para esta busca. Tente termos médicos mais específicos ou em inglês.'});send('done',{});res.end();return;}
  const enabled=await synthesize(validated.question,ranked.sources,validated.history,delta=>send('delta',{text:delta}),{signal:abort.signal});
  if(!enabled)send('notice',{text:'Pesquisa concluída. As fontes abaixo são reais; a síntese por IA ainda não está conectada nesta versão de desenvolvimento.'});
  send('done',{});
 }catch{if(!abort.signal.aborted)send('error',{text:'Não foi possível concluir esta etapa. As fontes já recebidas continuam disponíveis. Tente novamente.'});}
 res.end();
});
server.listen(port,'127.0.0.1',()=>console.log(`WMed API local: http://127.0.0.1:${port}`));
