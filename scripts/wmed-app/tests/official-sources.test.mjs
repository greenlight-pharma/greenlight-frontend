import test from 'node:test';
import assert from 'node:assert/strict';
import {officialSources,sourceDirectory,sourceCategories,sourceText} from '../shared/official-sources.mjs';
import {navigationGroups} from '../shared/product.mjs';
test('regional references never silently substitute another jurisdiction',()=>{
 for(const region of ['global','MX','other','__proto__',undefined]){
  const r=sourceDirectory({region});assert.deepEqual(r.regional,[]);assert.equal(r.covered,false);
  assert.ok(r.international.every(s=>s.region==='global'));
 }
 const br=sourceDirectory({region:'BR'});assert.equal(br.covered,true);assert.ok(br.regional.length>=3);assert.ok(br.regional.every(s=>s.region==='BR'));
 const us=sourceDirectory({region:'US',category:'vaccines'});assert.deepEqual(us.regional,[]);assert.deepEqual(us.international,[]);
});
test('directory filters are accent insensitive and local, with explicit empty results',()=>{
 assert.deepEqual(sourceDirectory({region:'BR',query:'  BULARIO  '}).regional.map(s=>s.id),['anvisa']);
 assert.deepEqual(sourceDirectory({region:'BR',category:'vaccines'}).regional.map(s=>s.id),['pni']);
 assert.deepEqual(sourceDirectory({region:'BR',query:'https://evil.example/patient'}).regional,[]);
 assert.equal(sourceDirectory({region:'BR',query:'guidelines',locale:'en'}).regional[0].id,'pcdt');
 assert.deepEqual(sourceDirectory({region:'BR',category:'not-a-category'}),{regional:[],international:[],covered:true});
});
test('sources use a fixed HTTPS allowlist without dynamic search payloads',()=>{
 const allowed=new Set(['www.gov.br','wiki.datasus.gov.br','extranet.infarmed.pt','dailymed.nlm.nih.gov','products.mhra.gov.uk','cima.aemps.es','www.who.int']);
 assert.equal(new Set(officialSources.map(s=>s.id)).size,officialSources.length);
 for(const s of officialSources){const u=new URL(s.url);assert.equal(u.protocol,'https:');assert.ok(allowed.has(u.hostname));assert.equal(u.search,'');assert.equal(u.username,'');assert.ok(sourceCategories.includes(s.category));assert.equal(s.use,'external-link-only');assert.match(s.reviewedOn,/^\d{4}-\d{2}-\d{2}$/);for(const locale of ['pt-BR','en','es'])assert.ok(sourceText(s.description,locale).length>10);}
 assert.ok(navigationGroups.find(g=>g.id==='plantao').modules.includes('fontes-oficiais'));
});
