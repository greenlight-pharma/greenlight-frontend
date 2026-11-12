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
test('Railway serves root app and health, redirects legacy pages, never exposes source or env',async t=>{
 const {url}=await fixture(t);
 assert.equal((await fetch(url+'/healthz').then(r=>r.json())).product,'2doctor');
 for(const path of ['/2doctor','/2doctor/','/2doctor/index.html']){
  const redirect=await fetch(url+path+'?lang=en',{redirect:'manual'});assert.equal(redirect.status,302);assert.equal(redirect.headers.get('location'),'/?lang=en');
 }
 const page=await fetch(url);assert.equal(page.status,200);assert.match(await page.text(),/2Doctor/);assert.equal(page.headers.get('cache-control'),'no-cache');
 for(const path of ['/server/railway.mjs','/2doctor/.env','/api/arbitrary','/2doctor/missing.js'])assert.equal((await fetch(url+path)).status,404);
 assert.equal((await fetch(url+'/2doctor/%2e%2e%2fserver%2frailway.mjs')).status,400);
});
test('Railway GLB range and HEAD responses return correct bytes and metadata',async t=>{
 const {url}=await fixture(t);const path=url+'/models/test.glb';
 assert.equal(await fetch(url+'/2doctor/models/test.glb').then(r=>r.text()),'0123456789');
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

test('Custom domain redirects only legacy public pages and retains host/origin restrictions',async t=>{
 const {url}=await fixture(t,{publicOrigin:'https://www.2doctor.ai'});
 async function request(path,method='GET',host='2doctor-web-production.up.railway.app'){
  return new Promise((resolve,reject)=>{const req=http.request(url+path,{method,headers:{Host:host}},res=>{res.resume();res.on('end',()=>resolve({status:res.statusCode,location:res.headers.location,cache:res.headers['cache-control']}));});req.on('error',reject);req.end();});
 }
 for(const method of ['GET','HEAD']){const result=await request('/2doctor/?lang=en',method);assert.equal(result.status,302);assert.equal(result.location,'https://www.2doctor.ai/2doctor/?lang=en');assert.equal(result.cache,'no-store');}
 assert.equal((await request('/')).location,'https://www.2doctor.ai/');
 assert.equal((await request('/2doctor/','POST')).status,400);
 assert.equal((await request('/api/wmed/auth')).status,400);
 assert.equal((await request('/api/wmed/chat','POST')).status,400);
 assert.equal((await request('/2doctor/','GET','unrelated.example')).status,400);
 assert.equal((await request('/2doctor/','GET','www.2doctor.ai')).location,'/');
 assert.equal((await request('/','GET','www.2doctor.ai')).status,200);
 assert.equal((await request('/healthz')).status,200);
});

test('SEO: only the official domain is indexable; robots, sitemap and favicon are served',async t=>{
 const local=await fixture(t);
 const home=await fetch(local.url);assert.equal(home.headers.get('x-robots-tag'),'noindex, nofollow');
 assert.equal(await fetch(local.url+'/robots.txt').then(r=>r.text()),'User-agent: *\nDisallow: /\n');
 assert.equal((await fetch(local.url+'/sitemap.xml')).status,404);
 const {server}=await fixture(t,{publicOrigin:'https://www.2doctor.ai'});const port=server.address().port;
 const get=(path,headers={})=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port,path,method:'GET',headers:{Host:'www.2doctor.ai',...headers}},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});req.on('error',reject);req.end();});
 for(const path of ['/','/privacy','/terms','/terms/patients'])assert.equal((await get(path)).headers['x-robots-tag'],undefined,path);
 for(const path of ['/api/wmed/status','/c/abcdefghij','/admin','/nope'])assert.equal((await get(path)).headers['x-robots-tag'],'noindex, nofollow',path);
 const robots=await get('/robots.txt');assert.match(robots.headers['content-type'],/text\/plain/);assert.match(robots.body,/Allow: \/\n/);assert.match(robots.body,/Disallow: \/api\//);assert.match(robots.body,/Sitemap: https:\/\/www\.2doctor\.ai\/sitemap\.xml/);
 const sitemap=await get('/sitemap.xml');assert.match(sitemap.headers['content-type'],/xml/);for(const loc of ['https://www.2doctor.ai/','https://www.2doctor.ai/privacy','https://www.2doctor.ai/terms'])assert.ok(sitemap.body.includes(`<loc>${loc}</loc>`),loc);
 const icon=await get('/favicon.ico');assert.equal(icon.status,302);assert.equal(icon.headers.location,'/brand/2doctor/favicon.svg');
});
test('Shortcuts /pricing and /signup redirect to the app state and keep the campaign query',async t=>{
 const {url}=await fixture(t);
 for(const [path,hash] of [['/pricing','planos'],['/pricing/','planos'],['/signup','criar-conta']]){
  const r=await fetch(url+path+'?utm_source=meta&utm_campaign=x',{redirect:'manual'});assert.equal(r.status,302);assert.equal(r.headers.get('location'),'/?utm_source=meta&utm_campaign=x#'+hash);
  assert.equal((await fetch(url+path,{redirect:'manual'})).headers.get('location'),'/#'+hash);
 }
});
test('Unknown pages get an English 404 page; non-HTML clients get English JSON',async t=>{
 const {url}=await fixture(t);
 const page=await fetch(url+'/does-not-exist',{headers:{Accept:'text/html,application/xhtml+xml'}});assert.equal(page.status,404);assert.match(page.headers.get('content-type'),/text\/html/);
 const html=await page.text();assert.match(html,/<html lang="en">/);assert.match(html,/Page not found/);assert.match(html,/Open 2Doctor/);
 const api=await fetch(url+'/missing.js');assert.equal(api.status,404);assert.deepEqual(await api.json(),{error:'Not found.'});
});
test('General terms of use page exists in English and is linked from the other legal pages',async t=>{
 const {url}=await fixture(t);
 for(const path of ['/terms','/terms/','/termos?lang=pt']){const r=await fetch(url+path);assert.equal(r.status,200,path);const html=await r.text();assert.match(html,/<html lang="en">/);assert.match(html,/<h1>Terms of use<\/h1>/);for(const piece of ['educational tool','does not replace clinical judgment','Stripe','cancel at any time','pro-rated refunds','mailto:'])assert.ok(html.includes(piece),piece);}
 assert.match(await fetch(url+'/privacy?lang=en').then(r=>r.text()),/<a href="\/terms">Terms of use<\/a>/);
 const patients=await fetch(url+'/terms/patients?lang=en').then(r=>r.text());assert.match(patients,/<a href="\/terms">Terms of use<\/a>/);assert.match(patients,/href="\/privacy\?lang=en"/);
});
test('landing dos anúncios (/start e /lp): HTML leve em inglês, sem o bundle, com pixel só por consentimento',async t=>{
 const {url}=await fixture(t,{metaPixelId:'1234567890',landing:()=>({freeChat:20,freeCases:3,anonFree:2})});
 for(const path of ['/start','/lp','/start/','/start?utm_source=instagram&fbclid=abc']){
  const r=await fetch(url+path);assert.equal(r.status,200,path);assert.match(r.headers.get('content-type'),/text\/html/);
  const html=await r.text();
  assert.match(html,/<html lang="en">/);assert.match(html,/Hard case at 3&nbsp;a\.m\.\?/);
  assert.ok(Buffer.byteLength(html)<40000,'página leve');
  assert.doesNotMatch(html,/assets\/index-|type="module"/); // não puxa o app
  for(const text of ['Answers with sources','Clinical cases with feedback','3D anatomy, histology and radiology','Ask your first question','20 AI answers a day','US$ 9.99','US$ 79 / year','Cancel anytime','Educational tool. Does not replace clinical judgment.','href="/privacy"','href="/terms"','Try 2 questions free'])assert.ok(html.includes(text),text);
  assert.match(html,/data-app="criar-conta"[^>]*>Start free/);
  // Pixel: o ID vai no script, mas só carrega com o consentimento salvo pelo mesmo aviso do app.
  assert.match(html,/var PIXEL="1234567890",CONSENT="2doctor-cookie-consent"/);
  assert.match(html,/fbq\('track','ViewContent',\{content_name:'landing'\}\)/);
  assert.match(html,/if\(c==='accepted'\)pixel\(\)/);
 }
 const head=await fetch(url+'/start',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 assert.equal((await fetch(url+'/start',{method:'POST'})).status,405);
});
test('landing sem pixel e sem perguntas grátis: nada de Meta carrega e o texto não promete pergunta sem conta',async t=>{
 const {url}=await fixture(t,{metaPixelId:'',landing:()=>({freeChat:20,freeCases:3,anonFree:0})});
 const html=await fetch(url+'/start').then(r=>r.text());
 assert.match(html,/var PIXEL=""/);assert.doesNotMatch(html,/Try \d+ question/);assert.match(html,/Free account, takes seconds/);
 // Sem banco (prévia): não inventa número de limite.
 const {url:bare}=await fixture(t);assert.match(await fetch(bare+'/lp').then(r=>r.text()),/AI answers with a daily limit/);
});
