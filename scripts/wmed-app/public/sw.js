// Service worker da WMed: funciona offline com o núcleo do app (interface, dados, scores, resumos).
// precache.json é gerado no build (vite.config.js) com as URLs absolutas do núcleo e a versão.
// Modelos 3D e imagens grandes entram no cache só quando abertos. A API (/api/) nunca é guardada.
const RUNTIME='wmed-runtime-v1';
const ON_DEMAND=/\/(assets|dados|fonts|brand|models|microbiology|molecular|radiology|xray|genetics)\//;
let manifest=null;
async function loadManifest(){if(!manifest)manifest=await (await fetch(new URL('precache.json',self.location),{cache:'no-store'})).json();return manifest;}
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const m=await loadManifest(),cache=await caches.open('wmed-core-'+m.version);
 // um arquivo que falhe não impede a instalação do resto
 await Promise.all(m.files.map(u=>cache.add(new Request(u,{cache:'reload'})).catch(()=>{})));
 await self.skipWaiting();
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 const m=await loadManifest();
 for(const k of await caches.keys())if(k.startsWith('wmed-core-')&&k!=='wmed-core-'+m.version)await caches.delete(k);
 await self.clients.claim();
})());});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api/'))return;
 if(req.mode==='navigate'){
  // página: rede primeiro; sem rede, a última versão do app
  event.respondWith(fetch(req).catch(async()=>{const m=await loadManifest().catch(()=>null);return (m&&await caches.match(m.index))||Response.error();}));
  return;
 }
 event.respondWith((async()=>{
  const hit=await caches.match(req);if(hit)return hit;
  const res=await fetch(req);
  if(res.ok&&ON_DEMAND.test(url.pathname)){const copy=res.clone();caches.open(RUNTIME).then(c=>c.put(req,copy)).catch(()=>{});}
  return res;
 })());
});
