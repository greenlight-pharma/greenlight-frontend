import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {catalog,filterCatalog} from '../src/molecular/catalog.mjs';
const root=new URL('../public/molecular/',import.meta.url);
const provenance=JSON.parse(readFileSync(new URL('../src/molecular/source-metadata.json',import.meta.url)));
test('molecular catalog has unique entries and reproducible structures',()=>{
 assert.equal(new Set(catalog.map(c=>c.id)).size,catalog.length);
 for(const e of catalog){const data=readFileSync(new URL(e.file,root));assert.equal(createHash('sha256').update(data).digest('hex'),provenance[e.id].sha256);assert.ok(e.summary&&e.focus&&e.clinical);assert.equal(new URL(e.source).hostname,'www.rcsb.org');}
});
test('SDF models contain valid 3D atoms and bond references',()=>{
 for(const e of catalog.filter(c=>c.format==='sdf')){const lines=readFileSync(new URL(e.file,root),'utf8').split('\n');const n=Number(lines[3].slice(0,3)),b=Number(lines[3].slice(3,6));assert.ok(n>0);const atoms=lines.slice(4,4+n);assert.ok(atoms.some(l=>Math.abs(Number(l.slice(20,30)))>.001));for(const l of atoms)for(const [start,end] of [[0,10],[10,20],[20,30]])assert.ok(Number.isFinite(Number(l.slice(start,end))));for(const l of lines.slice(4+n,4+n+b)){assert.ok(Number(l.slice(0,3))>=1&&Number(l.slice(0,3))<=n);assert.ok(Number(l.slice(3,6))>=1&&Number(l.slice(3,6))<=n);}}
});
test('proteins contain experimental coordinates and backbone atoms',()=>{for(const e of catalog.filter(c=>c.format==='pdb')){const text=readFileSync(new URL(e.file,root),'utf8');assert.match(text,/^ATOM\s+\d+\s+CA\s/m);assert.match(text,/EXPDTA\s+X-RAY DIFFRACTION/);}});
test('search handles accents, identifiers and functional groups',()=>{assert.equal(filterCatalog('proteína-impossível').length,0);assert.equal(filterCatalog('carbonica','enzimas')[0].id,'1CA2');assert.equal(filterCatalog('1MSO')[0].name,'Insulina');assert.equal(filterCatalog('','enzimas').length,2);});
