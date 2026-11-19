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
test('SBAR uses explicit passages, retains all facts, and keeps absent recommendations empty',()=>{
 for(const locale of ['pt-BR','en','es'])for(const fixture of demoCases){
  const s=createDemo(fixture.id,locale,'SBAR');
  assert.deepEqual(s.sections.map(x=>x.key),['situation','background','assessment','recommendation']);
  assert.deepEqual(s.sections.flatMap(x=>x.sourceIds).sort(),s.source.map(x=>x.id).sort());
  for(const section of s.sections)assert.equal(section.text,s.source.filter(p=>p.sbar===section.key).map(p=>p.text).join('\n\n'));
  assert.equal(exportDemo(s),null);
 }
 assert.equal(createDemo('history','pt-BR','SBAR').sections[3].text,'');
 assert.equal(createDemo('correction','en','SBAR').sections[0].text,'');
 const handoff=createDemo('handoff','pt-BR','SBAR');
 assert.match(handoff.sections[2].text,/Ainda não defini/);
 assert.match(handoff.sections[2].text,/Não há resultado/);
 assert.match(handoff.sections[3].text,/Não defini nova medicação/);
 assert.equal(handoff.sections[3].sourceIds.join(','),'r5');
});
test('Changing formats reloads the original fixture, invalidates review and labels export',()=>{
 let s=demoReducer(createDemo('handoff','es','SBAR'),{type:'organize'});
 s=demoReducer(s,{type:'edit',key:'recommendation',text:'Solicitud ficticia editada.'});
 assert.equal(isEdited(s),true);assert.equal(exportDemo(s),null);
 s=demoReducer(s,{type:'review',value:true});assert.match(exportDemo(s),/SBAR/);assert.match(exportDemo(s),/Solicitud ficticia editada/);
 s=demoReducer(s,{type:'load',id:'handoff',locale:'es',format:'SOAP'});
 assert.equal(s.format,'SOAP');assert.equal(s.reviewed,false);assert.equal(s.organized,false);assert.equal(isEdited(s),false);
 assert.equal(exportDemo(s),null);
 const invalid=demoReducer(s,{type:'edit',key:'recommendation',text:'invalid'});assert.deepEqual(invalid,s);
 assert.throws(()=>createDemo('history','en','unsupported'));
});
