import test from 'node:test';
import assert from 'node:assert/strict';
import {createMicrophoneRequest,stopMicrophone} from '../shared/microphone-request.mjs';
test('pending permission blocks duplicate requests and releases after completion',()=>{
 const gate=createMicrophoneRequest(), first=gate.begin();
 assert.equal(gate.begin(),null);assert.equal(gate.isCurrent(first),true);
 assert.equal(gate.finish(first),true);assert.equal(gate.isCurrent(first),false);
 assert.notEqual(gate.begin(),null);
});
test('leaving and returning invalidates late permission without cancelling a newer request',()=>{
 const gate=createMicrophoneRequest(),old=gate.begin();gate.cancel();const newer=gate.begin();
 assert.notEqual(newer,old);assert.equal(gate.isCurrent(old),false);
 assert.equal(gate.finish(old),false);assert.equal(gate.isCurrent(newer),true);
 assert.equal(gate.begin(),null);assert.equal(gate.finish(newer),true);
});
test('unmount cancellation rejects late responses and null never owns a request',()=>{
 const gate=createMicrophoneRequest(),ticket=gate.begin();gate.cancel();
 assert.equal(gate.isCurrent(ticket),false);assert.equal(gate.finish(ticket),false);
 assert.equal(gate.isCurrent(null),false);assert.equal(gate.finish(null),false);
});
test('discarding a delayed stream stops all its tracks and no other stream',()=>{
 let oldStops=0,newStops=0;
 const old={getTracks:()=>[{stop(){oldStops++}},{stop(){oldStops++}}]};
 const newer={getTracks:()=>[{stop(){newStops++}}]};
 stopMicrophone(old);assert.equal(oldStops,2);assert.equal(newStops,0);
 stopMicrophone(undefined);stopMicrophone(newer);assert.equal(newStops,1);
});
