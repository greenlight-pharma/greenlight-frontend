import test from 'node:test';
import http from 'node:http';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {createApp,byteRange} from '../server/railway.mjs';
function rawRequest(url,headers){return new Promise((resolve,reject)=>{const req=http.request(url,{method:'POST',headers},res=>{res.resume();res.on('end',()=>resolve({status:res.statusCode}));});req.on('error',reject);req.end('{}');});}
async function fixture(t,options={}){
 const root=await mkdtemp(join(tmpdir(),'2doctor-http-'));
 await writeFile(join(root,'index.html'),'<title>2Doctor</title>');await mkdir(join(root,'models'));await writeFile(join(root,'models','test.glb'),'0123456789');
 const server=createApp({root,...options});server.listen(0,'127.0.0.1');await once(server,'listening');
 t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});});
 return {server,url:`http://127.0.0.1:${server.address().port}`};
}
test('Railway serves built app and health, redirects root, never exposes source or env',async t=>{
 const {url}=await fixture(t);
 assert.equal((await fetch(url+'/healthz').then(r=>r.json())).product,'2doctor');
 const redirect=await fetch(url,{redirect:'manual'});assert.equal(redirect.status,302);assert.equal(redirect.headers.get('location'),'/2doctor/');
 const page=await fetch(url+'/2doctor/');assert.match(await page.text(),/2Doctor/);assert.equal(page.headers.get('cache-control'),'no-cache');
 for(const path of ['/server/railway.mjs','/2doctor/.env','/api/arbitrary','/2doctor/missing.js'])assert.equal((await fetch(url+path)).status,404);
 assert.equal((await fetch(url+'/2doctor/%2e%2e%2fserver%2frailway.mjs')).status,400);
});
test('Railway GLB range and HEAD responses return correct bytes and metadata',async t=>{
 const {url}=await fixture(t);const path=url+'/2doctor/models/test.glb';
 const range=await fetch(path,{headers:{Range:'bytes=2-5'}});assert.equal(range.status,206);assert.equal(range.headers.get('content-range'),'bytes 2-5/10');assert.equal(range.headers.get('content-type'),'model/gltf-binary');assert.equal(await range.text(),'2345');
 const head=await fetch(path,{method:'HEAD'});assert.equal(head.headers.get('content-length'),'10');assert.equal(await head.text(),'');
 assert.equal((await fetch(path,{headers:{Range:'bytes=99-100'}})).status,416);
 assert.deepEqual(byteRange('bytes=-3',10),{start:7,end:9});assert.equal(byteRange('bytes=0-1,4-5',10),false);
});
test('Railway preserves anonymous auth and denies paid chat/cases/history without session',async t=>{
 const {url}=await fixture(t);const headers={'X-WMed-Request':'1',Origin:url.replace('http:','https:'),'Content-Type':'application/json'};
 assert.deepEqual(await fetch(url+'/api/wmed/auth').then(r=>r.json()),{authenticated:false});
 for(const endpoint of ['chat','cases','history','academic']){const response=await fetch(url+'/api/wmed/'+endpoint,{method:'POST',headers,body:'{}'});assert.equal(response.status,401);assert.match(response.headers.get('cache-control'),/no-store/);}
 const blocked=await fetch(url+'/api/wmed/chat',{method:'POST',headers:{...headers,Origin:'https://unrelated.example'},body:'{}'});assert.equal(blocked.status,403);
});
test('Railway restricts configured origin and host independently of forwarded headers',async t=>{
 const {url}=await fixture(t,{publicOrigin:'https://2doctor.example'});
 assert.equal((await fetch(url+'/healthz')).status,200);
 assert.equal((await fetch(url+'/2doctor/')).status,400);
 const denied=await rawRequest(url+'/api/wmed/chat',{Host:'2doctor.example',Origin:'https://www.vytalsaude.com.br','X-WMed-Request':'1','X-Forwarded-Host':'2doctor.example'});assert.equal(denied.status,403);
 const own=await rawRequest(url+'/api/wmed/chat',{Host:'2doctor.example',Origin:'https://2doctor.example','X-WMed-Request':'1'});assert.equal(own.status,401);
});
test('Asset proxy is fixed to the academic archive and never forwards private headers',async t=>{
 let seen=false;
 const {url}=await fixture(t,{fetchImpl:async(target,options)=>{seen=true;assert.equal(target.origin,'https://app.vytalsaude.com.br');assert.equal(target.pathname,'/academico-assets/model.glb');assert.equal(options.headers.Range,'bytes=0-2');assert.equal(options.headers.Cookie,undefined);assert.equal(options.headers.Authorization,undefined);assert.equal(options.redirect,'error');return new Response('glb',{status:206,headers:{'content-type':'model/gltf-binary','content-range':'bytes 0-2/9'}});}});
 const r=await fetch(url+'/wmed/acervo/model.glb',{headers:{Range:'bytes=0-2',Cookie:'private',Authorization:'private'}});assert.equal(r.status,206);assert.equal(await r.text(),'glb');assert.ok(seen);
});
test('Streaming handlers remain unbuffered through the Railway adapter',async t=>{
 const {url}=await fixture(t,{handlers:{chat:async(req,res)=>{res.writeHead(200,{'Content-Type':'text/event-stream'});res.flushHeaders();res.write('event: delta\ndata: {"text":"fixture"}\n\n');res.end('event: done\ndata: {}\n\n');}}});
 const r=await fetch(url+'/api/wmed/chat',{method:'POST'});assert.equal(r.headers.get('content-type'),'text/event-stream');assert.match(await r.text(),/event: delta[\s\S]*event: done/);
});
