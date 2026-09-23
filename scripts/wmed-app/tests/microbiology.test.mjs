import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../public/microbiology/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('catalog.json',root)));
const manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
test('microbiology includes four groups, unique entries and sources',()=>{
 assert.equal(catalog.length,16);assert.equal(new Set(catalog.map(c=>c.id)).size,16);
 for(const group of ['bacterias','virus','fungos','protozoarios'])assert.equal(catalog.filter(c=>c.group===group).length,4);
 for(const cell of catalog){assert.ok(cell.sources.every(s=>s.startsWith('https://')));assert.ok(cell.summary&&cell.focus);assert.equal(new Set(cell.parts.map(p=>p.id)).size,cell.parts.length)}
});
test('all authored GLBs have embedded resources, selectable parts and bounded complexity',()=>{
 for(const c of catalog){
  const receipt=manifest.models.find(m=>m.id===c.id);assert.ok(receipt);
  for(const variant of c.cutaway?['complete','cutaway']:['complete']){
   const raw=readFileSync(new URL(`${c.id}/${variant}.glb`,root));assert.equal(raw.toString('ascii',0,4),'glTF');
   const doc=JSON.parse(raw.toString('utf8',20,20+raw.readUInt32LE(12)));
   assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.variants[variant].sha256);
   assert.ok(raw.length<5_000_000);assert.ok(receipt.variants[variant].triangles<150000);
   assert.ok(doc.buffers.every(b=>!b.uri));assert.ok(doc.images.every(i=>Number.isInteger(i.bufferView)));
   for(const p of c.parts){assert.ok(doc.nodes.some(n=>n.name===`${p.id.replaceAll('-','_')}_mesh`),`${c.id}: ${p.id}`);assert.ok(p.function.length>15)}
  }
  if(c.cutaway)assert.notEqual(receipt.variants.complete.sha256,receipt.variants.cutaway.sha256);
  else assert.equal(existsSync(new URL(`${c.id}/cutaway.glb`,root)),false);
 }
});
test('prokaryote and virus catalogues do not label eukaryotic organelles',()=>{
 for(const c of catalog.filter(c=>['bacterias','virus'].includes(c.group)))assert.ok(c.parts.every(p=>!['nucleo','mitocondrias','vacuolo'].includes(p.id)));
 for(const c of catalog.filter(c=>c.group==='virus'))assert.ok(c.parts.every(p=>p.id!=='ribossomos'));
 assert.ok(!catalog.find(c=>c.id==='adenovirus').parts.some(p=>p.id==='envelope'));
});
