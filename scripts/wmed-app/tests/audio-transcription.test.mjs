import test from 'node:test';
import assert from 'node:assert/strict';
import {transcribeCaseAudio} from '../shared/audio-transcription.mjs';
const deferred=()=>{let resolve;return {promise:new Promise(r=>resolve=r),resolve:v=>resolve(v)}};
test('cancelamento anterior à leitura não inicia trabalho',async()=>{
 const c=new AbortController();c.abort();let calls=0;
 await assert.rejects(transcribeCaseAudio({}, {signal:c.signal,read:()=>calls++,send:()=>calls++}),{name:'AbortError'});
 assert.equal(calls,0);
});
test('cancelar leitura libera espera e impede envio tardio',async()=>{
 const c=new AbortController(), file=deferred();let sent=0;
 const result=transcribeCaseAudio({}, {signal:c.signal,read:()=>file.promise,send:()=>sent++});
 c.abort();await assert.rejects(result,{name:'AbortError'});
 file.resolve('audio');await new Promise(r=>setImmediate(r));assert.equal(sent,0);
});
test('cancelar envio ignora resposta tardia e permite tentativa independente',async()=>{
 const c=new AbortController(), response=deferred(), started=deferred();
 const first=transcribeCaseAudio({}, {signal:c.signal,read:async()=>'audio',send:(_,signal)=>{assert.equal(signal,c.signal);started.resolve();return response.promise}});
 await started.promise;c.abort();await assert.rejects(first,{name:'AbortError'});
 const next=await transcribeCaseAudio({}, {signal:new AbortController().signal,read:async()=>'audio',send:async()=>({texto:'novo'})});
 response.resolve({texto:'antigo'});await new Promise(r=>setImmediate(r));assert.deepEqual(next,{texto:'novo'});
});
test('sucesso e falhas de rede mantêm contrato',async()=>{
 const opts={signal:new AbortController().signal,read:async()=>'base64',send:async data=>({texto:data})};
 assert.deepEqual(await transcribeCaseAudio({},opts),{texto:'base64'});
 await assert.rejects(transcribeCaseAudio({}, {...opts,send:async()=>{throw Error('offline')}}),/offline/);
});
