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
