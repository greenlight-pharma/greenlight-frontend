// Guias com conteúdo próprio: estrutura, fontes e links internos que precisam abrir algo que existe.
import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';
import {calculators} from '../shared/calculators.mjs';
async function load(path){const r=await build({entryPoints:[path],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)}

test('guias: ids únicos, fontes https e aviso final',async()=>{
 const [{EMERGENCIA},{ANTIMICROBIANOS}]=await Promise.all(['src/guides/emergencia.ts','src/guides/antimicrobianos.ts'].map(load));
 const all=[...EMERGENCIA,...ANTIMICROBIANOS];
 assert.ok(EMERGENCIA.length>=10&&ANTIMICROBIANOS.length>=9);
 assert.equal(new Set(all.map(g=>g.id)).size,all.length);
 for(const g of all){
  assert.match(g.id,/^[a-z0-9-]+$/,g.id);
  assert.ok(g.title&&g.area&&g.summary.length>30,g.id);
  assert.ok(g.sources.length>=1,g.id);for(const [label,url] of g.sources){assert.ok(label,g.id);assert.match(url,/^https:\/\//,g.id);}
  assert.match(g.body.trim(),/\*\*Atenção\.\*\* .+$/,`${g.id}: termina com o aviso`);
  assert.doesNotMatch(g.body,/\]\((?!#|https:\/\/)/,`${g.id}: só links internos ou https`);
 }
 for(const need of ['iot','drogas-vasoativas','sepse','sepse-foco','pac','meningite','profilaxia-cirurgica'])assert.ok(all.some(g=>g.id===need),need);
});
test('guias: todo link interno aponta para score, calculadora ou guia existente',async()=>{
 const [{EMERGENCIA},{ANTIMICROBIANOS}]=await Promise.all(['src/guides/emergencia.ts','src/guides/antimicrobianos.ts'].map(load));
 const [{SCORES},{EXTRA_SCORES},{MORE_SCORES}]=await Promise.all(['src/academic/scores.ts','src/academic/extra-scores.ts','src/academic/more-scores.ts'].map(load));
 const all=[...EMERGENCIA,...ANTIMICROBIANOS];
 const tools=new Set([...SCORES,...EXTRA_SCORES,...MORE_SCORES,...calculators].map(s=>s.id).concat('doses-pediatricas'));
 const guides=new Set(all.map(g=>g.id));
 let links=0;
 for(const g of all)for(const [,href] of g.body.matchAll(/\]\((#[^)]+)\)/g)){
  links++;const [mod,query]=href.slice(1).split('?');const p=new URLSearchParams(query);
  if(mod==='scores')assert.ok(tools.has(p.get('id')),`${g.id} → ${href}`);
  else if(mod==='protocolos'){assert.ok(guides.has(p.get('guia')),`${g.id} → ${href}`);assert.notEqual(p.get('guia'),g.id,`${g.id} aponta para si mesmo`);}
  else assert.fail(`${g.id}: módulo desconhecido em ${href}`);
 }
 assert.ok(links>=20,`${links} links`);
});
