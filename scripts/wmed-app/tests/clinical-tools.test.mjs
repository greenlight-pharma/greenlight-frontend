// Scores, calculadoras e doses pediátricas da ampliação de 24/09/2026.
import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';
import {calculate,calculators} from '../shared/calculators.mjs';
import {PED_DRUGS,pedDose} from '../shared/pediatric-doses.mjs';
async function load(path){const r=await build({entryPoints:[path],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)}
const close=(a,b,tol=.01)=>assert.ok(Math.abs(a-b)<=tol,`${a} ≠ ${b}`);

test('biblioteca passa de 100 instrumentos, com ids únicos e faixas que cobrem todas as somas possíveis',async()=>{
 const [{SCORES},{EXTRA_SCORES},{MORE_SCORES}]=await Promise.all(['src/academic/scores.ts','src/academic/extra-scores.ts','src/academic/more-scores.ts'].map(load));
 const all=[...SCORES,...EXTRA_SCORES,...MORE_SCORES];
 assert.ok(all.length+calculators.length+1>=100,`total ${all.length+calculators.length+1}`);
 assert.equal(new Set(all.map(s=>s.id)).size,all.length);
 for(const s of MORE_SCORES){
  assert.ok(s.fonte&&s.descricao&&s.criterios.length,s.id);
  // soma mínima e máxima possíveis
  let lo=0,hi=0;for(const c of s.criterios){const vals=c.tipo==='checkbox'?[0,c.valor]:c.opcoes.map(o=>o.valor);lo+=Math.min(...vals);hi+=Math.max(...vals);}
  for(let v=lo;v<=hi;v++)assert.ok(s.faixas.some(f=>v>=f.min&&v<=f.max),`${s.id}: soma ${v} sem faixa`);
 }
});
test('calculadoras novas batem com exemplos calculados à mão',()=>{
 const v=(id,x)=>calculate(id,x).value;
 close(v('holliday',{kg:25}),1600/24);close(v('infusao',{dose:.1,kg:70,conc:16}),26.25);close(v('ca-corr',{ca:8,alb:2}),9.6);
 close(v('na-glic',{na:130,glic:600}),138);close(v('osm',{na:140,glic:180,ureia:30}),295);close(v('agua-livre',{na:160,kg:70,fator:.6}),6);
 close(v('qtc',{qt:400,fc:60}),400);close(v('pam',{pas:120,pad:80}),93.33);close(v('cockcroft',{age:70,kg:70,creatinine:1,female:0}),68.06);
 close(v('pf',{pao2:80,fio2:.5}),160);close(v('ldl',{ct:200,hdl:50,tg:150}),120);close(v('fena',{una:40,pna:140,ucr:100,pcr:2}),.571);
 close(v('parkland',{kg:70,scq:30}),8400);close(v('maco',{cig:20,anos:30}),30);close(v('maddrey',{tp:20,tpc:12,bt:5}),41.8);
 assert.deepEqual(calculate('holliday',{kg:25}).detail,['1600 mL/dia']);
 assert.ok(calculate('ldl',{ct:200,hdl:50,tg:450}).error,'Friedewald recusa TG ≥ 400');
});
test('doses pediátricas: faixa por peso, teto de adulto e volume por apresentação',()=>{
 const para=PED_DRUGS.find(d=>d.id==='paracetamol');
 const r=pedDose(para,15);assert.equal(r.lo,150);assert.equal(r.hi,225);assert.equal(r.volumes[0].lo,.75);assert.equal(r.capped,false);
 const adult=pedDose(para,90);assert.equal(adult.hi,1000);assert.equal(adult.capped,true);assert.equal(adult.perDayMax,4000);
 const amox=pedDose(PED_DRUGS.find(d=>d.id==='amoxicilina'),15);assert.equal(amox.lo,375);assert.equal(amox.volumes[0].lo,7.5);
 const azi=pedDose(PED_DRUGS.find(d=>d.id==='azitromicina'),80);assert.equal(azi.hi,500,'azitromicina limitada a 500 mg/dia');
 assert.ok(pedDose(para,0).error);
 for(const d of PED_DRUGS){assert.ok(d.source.startsWith('https://')&&d.forms.length&&(d.perDose||d.perDay),d.id);}
});
