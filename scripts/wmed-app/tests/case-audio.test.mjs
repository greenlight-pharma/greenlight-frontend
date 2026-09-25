import test from 'node:test';
import assert from 'node:assert/strict';
import {caseAudioType} from '../shared/case-audio.mjs';
test('audio transport accepts recorder codec tags and common iPhone/WAV aliases',()=>{
 for(const [type,expected] of [['audio/webm;codecs=opus','audio/webm'],['audio/x-m4a','audio/m4a'],['audio/x-wav','audio/wav'],['audio/mp4','audio/mp4']]) assert.equal(caseAudioType({size:100,type}),expected);
});
test('empty and oversized recordings cannot become pending retries',()=>{
 for(const size of [0,-1,NaN,2900001]) assert.throws(()=>caseAudioType({size,type:'audio/wav'}));
 assert.equal(caseAudioType({size:2900000,type:'audio/wav'}),'audio/wav');
});
test('unsupported files are rejected before transcription and unknown MIME preserves existing fallback',()=>{
 assert.throws(()=>caseAudioType({size:100,type:'text/plain'}),/Use áudio/);
 assert.equal(caseAudioType({size:100,type:''}),'audio/mp4');
});
