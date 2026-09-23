import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3} from 'three';
import {stages,helixPoint,complementary} from '../src/genetics/catalog.mjs';
import {buildGeneticModel} from '../src/genetics/scene.js';
test('Genetics models have finite geometry and every teaching selector maps to an actual structure',()=>{
 for(const stage of stages){const g=buildGeneticModel(stage.id),parts=new Set();g.traverse(o=>{if(!o.isMesh)return;parts.add(o.userData.part);const a=o.geometry.attributes.position.array;assert.ok(a.length>0);assert.ok(a.every(Number.isFinite),stage.id);o.geometry.dispose();o.material.dispose()});assert.deepEqual([...parts].sort(),stage.parts.map(p=>p[0]).sort());const b=new Box3().setFromObject(g);assert.ok(!b.isEmpty());assert.ok(b.max.y>b.min.y)}
});
test('DNA strands are antipodal at matching axial positions and complementary pairing is involutive',()=>{
 for(let t=0;t<18;t+=.25){const a=helixPoint(t),b=helixPoint(t,Math.PI);assert.ok(Math.abs(a[0]+b[0])<1e-10);assert.ok(Math.abs(a[2]+b[2])<1e-10);assert.equal(a[1],b[1]);}
 for(const b of 'ATGC')assert.equal(complementary(complementary(b)),b);assert.equal(complementary('A'),'T');assert.equal(complementary('G'),'C');
});
test('Genetics has five distinct lessons, valid answers and attributed references',()=>{
 assert.equal(stages.length,5);assert.equal(new Set(stages.map(s=>s.id)).size,5);for(const s of stages){assert.ok(s.options[s.answer]);assert.equal(new Set(s.options).size,s.options.length);assert.match(s.source,/^https:\/\/www.genome.gov\//);assert.ok(s.description&&s.takeaway&&s.why)}assert.throws(()=>buildGeneticModel('unknown'));
});
