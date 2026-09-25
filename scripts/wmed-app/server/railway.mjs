import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {auth,chat} from './vytal-assistant.mjs';
import {academic} from './academic.mjs';
import {cases} from './cases.mjs';
import {history} from './history.mjs';
import {privacy} from './privacy.mjs';
import {publicResearch} from './public-research.mjs';

const ROOT=fileURLToPath(new URL('../dist-2doctor/',import.meta.url));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.woff2':'font/woff2','.glb':'model/gltf-binary','.gltf':'model/gltf+json','.bin':'application/octet-stream','.pdb':'chemical/x-pdb','.mp4':'video/mp4'};
const routes={auth,chat,academic,cases,history,privacy,research:publicResearch};
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
export function byteRange(header,size){
 if(!header)return null;
 const match=/^bytes=(\d*)-(\d*)$/.exec(header);
 if(!match||(!match[1]&&!match[2])||size===0)return false;
 let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
 let end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size)return false;
 return {start,end};
}
export function createApp({root=ROOT,publicOrigin=process.env.PUBLIC_ORIGIN,fetchImpl=fetch,handlers=routes}={}){
 const absoluteRoot=resolve(root);
 const origin=publicOrigin?new URL(publicOrigin).origin:null;
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  res.setHeader('Permissions-Policy','camera=(), geolocation=(), microphone=(self)');
  if(origin?.startsWith('https:'))res.setHeader('Strict-Transport-Security','max-age=31536000');
  try{
   let path;
   try{path=decodeURIComponent((req.url||'/').split('?')[0]);}catch{return json(res,400,{error:'Endereço inválido.'});}
   if(path.includes('\\')||path.includes('\0')||path.split('/').some(part=>part==='..'||part==='.'))return json(res,400,{error:'Endereço inválido.'});
   if(path==='/healthz'&&req.method==='GET')return json(res,200,{ok:true,product:'2doctor'});
   if(origin&&req.headers.host!==new URL(origin).host)return json(res,400,{error:'Endereço não permitido.'});
   if(path.startsWith('/api/')){
    if(!path.startsWith('/api/wmed/'))return json(res,404,{error:'Recurso não encontrado.'});
    // Same-origin requests only. Existing cookie, permission and quota checks still run.
    if(!['GET','HEAD'].includes(req.method)&&origin&&req.headers.origin!==origin)return json(res,403,{error:'Origem não permitida.'});
    const name=path.slice('/api/wmed/'.length);
    if(name==='status')return json(res,req.method==='GET'?200:405,{research:'europe-pmc',jev:'not-configured',synthesis:'vytal-assistant',auth:'vytal-account',mode:'2doctor-preview'});
    const handler=Object.hasOwn(handlers,name)?handlers[name]:null;
    if(!handler)return json(res,404,{error:'Recurso não encontrado.'});
    return await handler(req,res);
   }
   if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Método não permitido.'});
   if(path==='/'||path==='/2doctor'){res.writeHead(302,{Location:'/2doctor/','Cache-Control':'no-store'});return res.end();}
   if(path.startsWith('/wmed/acervo/')){
    const relative=path.slice('/wmed/acervo/'.length);
    if(!relative||relative.split('/').some(part=>!part||part.startsWith('.')))return json(res,400,{error:'Arquivo inválido.'});
    const target=new URL('https://app.vytalsaude.com.br/academico-assets/'+relative.split('/').map(encodeURIComponent).join('/'));
    const abort=new AbortController();res.on('close',()=>abort.abort());
    const headers={};
    if(req.headers.range&&/^bytes=\d*-\d*$/.test(req.headers.range))headers.Range=req.headers.range;
    const upstream=await fetchImpl(target,{method:req.method,headers,redirect:'error',signal:AbortSignal.any([abort.signal,AbortSignal.timeout(60000)])});
    res.statusCode=upstream.status;
    for(const name of ['content-type','content-length','content-range','accept-ranges','etag','last-modified']){const value=upstream.headers.get(name);if(value)res.setHeader(name,value);}
    res.setHeader('Cache-Control',upstream.ok?'public, max-age=3600':'no-store');
    if(req.method==='HEAD'||!upstream.body)return res.end();
    await pipeline(Readable.fromWeb(upstream.body),res);return;
   }
   let relative;
   if(path.startsWith('/2doctor/'))relative=path.slice('/2doctor/'.length)||'index.html';
   // Legacy font URLs inside the existing library styles.
   else if(path.startsWith('/fonts/'))relative=path.slice(1);
   else return json(res,404,{error:'Página não encontrada.'});
   if(relative.split('/').some(part=>part.startsWith('.')))return json(res,404,{error:'Arquivo não encontrado.'});
   const file=resolve(absoluteRoot,relative);
   if(!file.startsWith(absoluteRoot+sep))return json(res,404,{error:'Arquivo não encontrado.'});
   let info;try{info=await stat(file);}catch{return json(res,404,{error:'Arquivo não encontrado.'});}
   if(!info.isFile())return json(res,404,{error:'Arquivo não encontrado.'});
   const range=byteRange(req.headers.range,info.size);
   if(range===false){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
   const ext=extname(file);res.setHeader('Content-Type',MIME[ext]||'application/octet-stream');
   res.setHeader('Cache-Control',ext==='.html'?'no-cache':relative.startsWith('assets/')?'public, max-age=31536000, immutable':'public, max-age=3600');
   res.setHeader('Accept-Ranges','bytes');
   if(range){res.statusCode=206;res.setHeader('Content-Range',`bytes ${range.start}-${range.end}/${info.size}`);}
   res.setHeader('Content-Length',range?range.end-range.start+1:info.size);
   if(req.method==='HEAD')return res.end();
   await pipeline(createReadStream(file,range||undefined),res);
  }catch{
   // Never log credentials, request bodies, upstream responses or patient data.
   if(res.destroyed)return;
   if(res.headersSent)return res.destroy();
   json(res,502,{error:'Não foi possível concluir. Tente novamente.'});
  }
 });
 server.requestTimeout=300000;server.headersTimeout=15000;
 return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=createApp();
 server.listen(Number(process.env.PORT||8080),'0.0.0.0',()=>console.log('2Doctor HTTPS edge server ready'));
 process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
}
