import test from 'node:test';
import assert from 'node:assert/strict';
import {requestDiscovery} from '../shared/discovery-request.mjs';
const data={kind:'articles',retrievedAt:'2026-09-25T12:00:00Z',items:[]};
test('discovery request keeps topic and kind in same-origin body without automatic retry',async()=>{
 let calls=0;const out=await requestDiscovery(' asthma ','articles',{fetchImpl:async(url,options)=>{calls++;assert.equal(url,'/api/wmed/discovery');assert.deepEqual(JSON.parse(options.body),{query:'asthma',kind:'articles'});return Response.json(data);}});
 assert.deepEqual(out,{data});assert.equal(calls,1);
});
test('discovery errors are classified without leaking upstream text',async()=>{
 for(const[status,code]of[[429,'limited'],[400,'input'],[403,'unavailable'],[502,'unavailable']])assert.deepEqual(await requestDiscovery('asthma','articles',{fetchImpl:async()=>new Response('private detail',{status})}),{error:code});
 assert.deepEqual(await requestDiscovery('asthma','articles',{fetchImpl:async()=>{throw Error('private detail')}}),{error:'network'});
 assert.deepEqual(await requestDiscovery('asthma','articles',{fetchImpl:async()=>new Response('not json')}),{error:'unavailable'});
 for(const invalid of [{...data,kind:'trials'},{...data,items:null},{...data,retrievedAt:'bad'},{...data,items:[null]}])assert.deepEqual(await requestDiscovery('asthma','articles',{fetchImpl:async()=>Response.json(invalid)}),{error:'unavailable'});
});
test('timeout and explicit cancellation abort a pending fetch and are distinct',async()=>{
 const hanging=(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted')),{once:true}));
 assert.deepEqual(await requestDiscovery('asthma','articles',{timeoutMs:5,fetchImpl:hanging}),{error:'timeout'});
 const controller=new AbortController();const request=requestDiscovery('asthma','articles',{signal:controller.signal,fetchImpl:hanging});controller.abort();assert.deepEqual(await request,{error:'cancelled'});
 assert.deepEqual(await requestDiscovery('asthma','articles',{signal:controller.signal,fetchImpl:()=>assert.fail('must not fetch')}),{error:'cancelled'});
});
test('a response finishing after cancellation is discarded',async()=>{
 const controller=new AbortController();let finish;
 const pending=requestDiscovery('asthma','articles',{signal:controller.signal,fetchImpl:()=>new Promise(resolve=>{finish=resolve})});
 controller.abort();finish(Response.json(data));assert.deepEqual(await pending,{error:'cancelled'});
});
