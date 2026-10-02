import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {createApp} from '../server/railway.mjs';
import {cleanPixelId,injectPixelMeta,purchaseOnce,readConsent,saveConsent,PURCHASE_KEY} from '../shared/meta-pixel.mjs';
const HTML='<html><head><title>x</title></head><body></body></html>';
const memory=()=>{const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),m};};
async function serve(t,metaPixelId){
 const root=await mkdtemp(join(tmpdir(),'2doctor-pixel-'));await writeFile(join(root,'index.html'),HTML);
 const server=createApp({root,metaPixelId});server.listen(0,'127.0.0.1');await once(server,'listening');
 t.after(async()=>{server.closeAllConnections();await new Promise(r=>server.close(r));await rm(root,{recursive:true,force:true});});
 return `http://127.0.0.1:${server.address().port}`;
}
test('sem META_PIXEL_ID o HTML sai sem nada do pixel',async t=>{
 for(const id of [undefined,'','  ','abc','<script>1</script>']){
  const url=await serve(t,id);const body=await fetch(url).then(r=>r.text());
  assert.equal(body,HTML);assert.doesNotMatch(body,/pixel|facebook/i);
 }
 assert.equal(injectPixelMeta(HTML,undefined),HTML);
});
test('com META_PIXEL_ID o servidor injeta só a meta com o ID',async t=>{
 const url=await serve(t,'123456789');const res=await fetch(url);const body=await res.text();
 assert.match(body,/<meta name="meta-pixel-id" content="123456789"\/><\/head>/);
 assert.doesNotMatch(body,/connect\.facebook\.net/);
 assert.equal(res.headers.get('cache-control'),'no-cache');assert.equal(Number(res.headers.get('content-length')),Buffer.byteLength(body));
 assert.equal(cleanPixelId(' 123456789 '),'123456789');
});
test('consentimento só aceita accepted/declined',()=>{
 const s=memory();assert.equal(readConsent(s),null);saveConsent(s,'declined');assert.equal(readConsent(s),'declined');
 s.setItem('2doctor-cookie-consent','qualquer');assert.equal(readConsent(s),null);
 assert.equal(readConsent({getItem(){throw Error('bloqueado');}}),null);
});
test('Purchase dispara uma única vez por assinatura',()=>{
 const s=memory();let n=0;const fire=()=>n++;
 assert.equal(purchaseOnce(s,'2026-11-01',fire),true);
 assert.equal(purchaseOnce(s,'2026-11-01',fire),false);
 assert.equal(n,1);assert.equal(s.m.get(PURCHASE_KEY),'2026-11-01');
 assert.equal(purchaseOnce(s,'2027-01-01',fire),true);assert.equal(n,2);
 assert.equal(purchaseOnce({getItem(){throw Error('x');},setItem(){throw Error('x');}},'k',fire),true);
});
