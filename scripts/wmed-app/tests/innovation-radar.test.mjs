import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {researchEntries,researchText,projectionRegions,projectionAngles,projectionPath,researchCheckedAt} from '../shared/innovation-radar.mjs';

test('research entries have dated primary evidence and explicit limitations in every supported language',()=>{
 assert.equal(new Set(researchEntries.map(x=>x.id)).size,researchEntries.length);
 for(const entry of researchEntries){
  assert.equal(entry.status,'research-only');
  assert.match(entry.published,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(entry.published<=researchCheckedAt);
  for(const key of ['title','summary','opportunity','limit','license']){
   assert.equal(entry[key].length,3);
   for(const locale of ['pt-BR','en','es'])assert.ok(researchText(entry[key],locale).length>5);
  }
  assert.equal(new URL(entry.source).protocol,'https:');
  assert.notEqual(new URL(entry.source).hostname,'x.com');
  assert.equal(new URL(entry.post).hostname,'x.com');
 }
 const flex=researchEntries.find(x=>x.id==='flexray');
 for(const license of flex.license)assert.match(license,/CC BY-NC 4.0/);
});
test('every preview selection resolves to an existing attributed projection, never external model media',()=>{
 for(const region of projectionRegions){
  const catalog=JSON.parse(readFileSync(new URL(`../public/xray/${region}/catalog.json`,import.meta.url),'utf8'));
  assert.equal(catalog.license,'CC BY 4.0');
  assert.equal(catalog.sourceUrl,'https://zenodo.org/records/10047292');
  for(const angle of projectionAngles){
   const path=projectionPath(region,angle);
   assert.ok(existsSync(new URL(`../public/${path}`,import.meta.url)));
   assert.ok(catalog.views.some(v=>v.image===path.split('/').at(-1)));
  }
 }
 assert.throws(()=>projectionPath('../other','000'),RangeError);
 assert.throws(()=>projectionPath('torax','180'),RangeError);
});
