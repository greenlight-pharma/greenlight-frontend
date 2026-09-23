import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {scenePoint,projectRAS,matchingStructures} from '../src/xray/geometry.mjs';
const base=new URL('../public/xray/pelvis/',import.meta.url);
const data=JSON.parse(readFileSync(new URL('catalog.json',base)));
test('DRR assets have recorded integrity and paired structures',()=>{
 assert.equal(data.license,'CC BY 4.0');assert.equal(data.parts.length,5);
 assert.deepEqual(data.views.map(v=>v.angle),[0,15,30,45,60,75,90]);
 for(const [file,hash]of Object.entries(data.files))assert.equal(createHash('sha256').update(readFileSync(new URL(file,base))).digest('hex'),hash,file);
 const glb=readFileSync(new URL('pelvis.glb',base));
 const gltf=JSON.parse(glb.subarray(20,20+glb.readUInt32LE(12)).toString());
 for(const p of data.parts)assert.ok(gltf.nodes.some(n=>n.name===p.id));
});
test('calibrated detector corners map to pixel centres in every incidence',()=>{
 for(const view of data.views){
 const expected=[[0,0],[383,0],[0,383],[383,383]];
 view.detectorCornersRAS.forEach((point,i)=>projectRAS(point,view,data).forEach((v,j)=>assert.ok(Math.abs(v-expected[i][j])<.001)));
 projectRAS([0,0,0],view,data).forEach(v=>assert.ok(Math.abs(v-191.5)<.001));
 }
});
test('RAS orientation and overlapping projected selections remain explicit',()=>{
 assert.deepEqual(scenePoint([2,3,4]),[2,4,-3]);
 assert.ok(projectRAS([30,0,0],data.views[0],data)[0]<191.5);
 assert.equal(matchingStructures(0,data.parts).length,0);
 assert.deepEqual(matchingStructures(5,data.parts).map(p=>p.id),['hip_left','sacrum']);
});

import {ncc,bestProjection,isBoundary,detectorPoint,tone} from '../src/xray/imaging.mjs';
test('source-detector rays use calibrated detector coordinates for every view',()=>{
 for(const v of data.views)for(const [u,w] of [[0,0],[1,0],[0,1],[1,1],[.25,.7]]){
  const pixel=projectRAS(detectorPoint(v,u,w),v,data);
  assert.ok(Math.abs(pixel[0]-u*(data.size-1))<.001);
  assert.ok(Math.abs(pixel[1]-w*(data.size-1))<.001);
 }
});
test('NCC finds the corresponding incidence and tolerates linear intensity changes',()=>{
 const a=[1,4,2,8,3],b=a.map(v=>v*3+40),c=[8,2,4,1,9];
 assert.ok(Math.abs(ncc(a,b)-1)<1e-12);assert.ok(ncc(a,c)<0);
 assert.equal(bestProjection(a,[c,b]).index,1);assert.equal(ncc([4,4],[4,4]),0);
 assert.throws(()=>ncc([1],[1,2]));assert.throws(()=>bestProjection(a,[]));
});
test('contours preserve overlapping structures and exclude their interior',()=>{
 const bits=new Uint8ClampedArray(5*5*4);for(let y=1;y<4;y++)for(let x=1;x<4;x++)bits[(y*5+x)*4]=5;
 assert.equal(isBoundary(bits,2,2,5,5,1),false);assert.equal(isBoundary(bits,1,2,5,5,1),true);
 assert.equal(isBoundary(bits,1,2,5,5,4),true);assert.equal(isBoundary(bits,1,2,5,5,2),false);
 assert.equal(tone(0),0);assert.equal(tone(255),255);assert.ok(tone(150)<150);
});

test('thorax abdomen and lumbar libraries have intact paired projections and calibrated geometry',()=>{
 const generator=createHash('sha256').update(readFileSync(new URL('../tools/xray/build-regions.py',import.meta.url))).digest('hex');
 for(const region of ['torax','abdome','lombar']){
  const root=new URL(`../public/xray/${region}/`,import.meta.url),d=JSON.parse(readFileSync(new URL('catalog.json',root)));
  assert.equal(d.generatorSHA256,generator);assert.equal(d.license,'CC BY 4.0');assert.equal(d.views.length,7);
  assert.ok(d.parts.some(p=>p.id===d.challenge));assert.ok(d.parts.length<=8);
  assert.equal(new Set(d.parts.map(p=>p.bit)).size,d.parts.length);
  for(const p of d.parts){assert.ok(p.sourceLabels.length);assert.equal(p.bit,1<<(p.label-1));}
  for(const [file,hash]of Object.entries(d.files))assert.equal(createHash('sha256').update(readFileSync(new URL(file,root))).digest('hex'),hash,region+'/'+file);
  const raw=readFileSync(new URL(d.model,root)),gltf=JSON.parse(raw.subarray(20,20+raw.readUInt32LE(12)).toString());assert.ok(raw.length<5_000_000);
  for(const p of d.parts)assert.ok(gltf.nodes.some(n=>n.name===p.id));
  for(const v of d.views)for(const [u,w]of[[0,0],[1,0],[0,1],[1,1],[.5,.5]]){
   const p=projectRAS(detectorPoint(v,u,w),v,d);assert.ok(Math.abs(p[0]-u*(d.size-1))<.001);assert.ok(Math.abs(p[1]-w*(d.size-1))<.001);
  }
 }
});
