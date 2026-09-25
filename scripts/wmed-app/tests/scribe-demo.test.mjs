import test from 'node:test';
import assert from 'node:assert/strict';
import {demoCases,createDemo,demoReducer,exportDemo,isEdited,sectionKeys,exportNotice} from '../shared/scribe-demo.mjs';
test('Fictional notes preserve every source passage verbatim in every language',()=>{
 for(const locale of ['pt-BR','en','es'])for(const example of demoCases){
  const state=createDemo(example.id,locale);
  assert.deepEqual(state.sections.map(s=>s.key),sectionKeys);
  assert.deepEqual(state.sections.flatMap(s=>s.sourceIds).sort(),state.source.map(s=>s.id).sort());
  for(const section of state.sections)assert.equal(section.text,state.source.filter(s=>section.sourceIds.includes(s.id)).map(s=>s.text).join('\n\n'));
  assert.equal(exportDemo(state),null);
 }
});
test('Absent exam and assessment remain empty, dose correction and uncertain allergy remain explicit',()=>{
 const state=createDemo('correction','pt-BR');
 assert.equal(state.sections[1].text,'');assert.equal(state.sections[2].text,'');
 assert.match(state.sections[0].text,/500 mg.*850 mg/);
 assert.match(state.sections[0].text,/Não informou a frequência/);
 assert.match(state.sections[0].text,/Não lembra se já teve reação/);
 assert.equal(createDemo('history').sections[3].text,'');
});
test('Export requires organisation and review; any edit revokes review and uses current text',()=>{
 let s=createDemo();s=demoReducer(s,{type:'review',value:true});assert.equal(s.reviewed,false);
 s=demoReducer(s,{type:'organize'});assert.equal(exportDemo(s),null);
 s=demoReducer(s,{type:'review',value:true});assert.match(exportDemo(s),/^EXEMPLO FICTÍCIO/);
 s=demoReducer(s,{type:'edit',key:'subjective',text:'Texto fictício revisado.'});assert.equal(exportDemo(s),null);assert.equal(isEdited(s),true);
 s=demoReducer(s,{type:'review',value:true});assert.match(exportDemo(s),/Texto fictício revisado/);assert.doesNotMatch(exportDemo(s),/Nega febre/);
 s=demoReducer(s,{type:'load',id:'correction',locale:'es'});assert.equal(s.reviewed,false);assert.equal(s.organized,false);assert.equal(isEdited(s),false);
});
test('Invalid fixtures rejected, locale fallback explicit and export labeled in each language',()=>{
 assert.throws(()=>createDemo('missing'));assert.equal(createDemo('history','unknown').locale,'pt-BR');
 for(const locale of ['pt-BR','en','es']){let s=createDemo('history',locale);s=demoReducer(s,{type:'organize'});s=demoReducer(s,{type:'review',value:true});assert.ok(exportDemo(s).startsWith(exportNotice[locale]));}
});
