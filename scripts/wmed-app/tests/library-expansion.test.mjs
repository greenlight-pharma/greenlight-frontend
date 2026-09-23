import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {build} from 'esbuild';
import {calculate,calculators} from '../shared/calculators.mjs';
import {imageQuery} from '../shared/image-filters.mjs';
import {therapies,targets} from '../src/microbiology/therapy.mjs';
const close=(a,b,t=.001)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('formula calculators match independently worked examples and reject incomplete inputs',()=>{
 close(calculate('bmi',{weight:80,height:200}).value,20);close(calculate('bsa',{weight:80,height:180}).value,2);
 close(calculate('egfr',{age:60,creatinine:1,female:0}).value,86.16,.02);
 close(calculate('egfr',{age:60,creatinine:1,female:1}).value,64.5,.1);
 assert.equal(calculate('gap',{na:140,cl:104,hco:24}).value,12);assert.equal(calculate('winter',{hco:12}).value,26);assert.equal(calculate('winter',{hco:12}).range,2);
 assert.equal(calculate('bmi',{weight:'80',height:'200,0'}).value,20);
 for(const c of calculators){assert.ok(calculate(c.id,{}).pending);assert.ok(c.source.startsWith('https://'))}
 assert.ok(calculate('bmi',{weight:80,height:0}).error);assert.ok(calculate('egfr',{age:12,creatinine:1,female:0}).error);assert.ok(calculate('egfr',{age:60,creatinine:0,female:0}).error);assert.ok(calculate('egfr',{age:60,creatinine:1,female:3}).error);
});
test('image filters forward supported API values and reject injected or unsupported filters',()=>{assert.equal(imageQuery({page:2,pageSize:6,modalidade:'TC',areaClinica:'Cardiologia'}).toString(),'page=2&pageSize=6&modalidade=TC&areaClinica=Cardiologia');assert.throws(()=>imageQuery({modalidade:'TC&status=rascunho'}));assert.throws(()=>imageQuery({page:0.2}));assert.throws(()=>imageQuery({pageSize:100}));assert.throws(()=>imageQuery({areaClinica:'inventada'}));});
test('each organism has contextual treatment sources and only real selectable targets',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../public/microbiology/catalog.json',import.meta.url)));
 for(const cell of catalog){const t=therapies[cell.id];assert.ok(t,cell.id);assert.ok(t.items.length&&t.sources.length);for(const i of t.items)assert.ok(i.context&&i.drugs&&i.note);for(const id of t.targets){assert.ok(targets[id]);assert.ok(cell.parts.some(p=>p.id===targets[id].part),`${cell.id}:${id}`)}if(cell.group==='bacterias')assert.ok(t.targets.length)}
 assert.match(therapies.adenovirus.items[0].note,/Não há antiviral/);assert.match(therapies['e-coli'].items[1].drugs,/Evitar/);
});
async function moduleFrom(path){const r=await build({entryPoints:[path],bundle:true,write:false,format:'esm',platform:'node'});return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)}
test('ECG course preserves ten complete sequential lessons and valid quiz answers',async()=>{const {FASES,APROVACAO}=await moduleFrom('src/ecg/course.ts');assert.equal(FASES.length,10);assert.equal(APROVACAO,.8);for(const [i,f]of FASES.entries()){assert.equal(f.num,i+1);assert.ok(f.licao.length);assert.ok(f.quiz.length);assert.ok(!f.emBreve);for(const q of f.quiz)assert.ok(q.opcoes[q.correta]&&q.explica)}});
test('new score criteria span every possible result and the DVT alternative subtracts points',async()=>{const {EXTRA_SCORES}=await moduleFrom('src/academic/extra-scores.ts');for(const s of EXTRA_SCORES){let totals=new Set([0]);for(const c of s.criterios){const values=c.tipo==='checkbox'?[0,c.valor]:c.opcoes.map(o=>o.valor);totals=new Set([...totals].flatMap(t=>values.map(v=>t+v)))}for(const total of totals)assert.equal(s.faixas.filter(f=>total>=f.min&&total<=f.max).length,1)}assert.equal(EXTRA_SCORES.find(s=>s.id==='wells-tvp').criterios.at(-1).valor,-2)});
test('radiology surfaces have matching metadata and named source structures',()=>{for(const region of ['torax','abdome','cabeca']){const base=new URL(`../public/radiology/${region}`,import.meta.url),raw=readFileSync(new URL(base+'.glb')),meta=JSON.parse(readFileSync(new URL(base+'.json')));const doc=JSON.parse(raw.toString('utf8',20,20+raw.readUInt32LE(12)));assert.equal(meta.license,'CC BY 4.0');assert.ok(meta.structures.length>10);for(const s of meta.structures)assert.ok(doc.nodes.some(n=>n.name===`structure_${s.id}`));assert.ok(raw.length<10_000_000)}});
