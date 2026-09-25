import test from 'node:test';
import assert from 'node:assert/strict';
import {entryAsset, hasNewModuleVersion, isImportFailure} from '../shared/module-version.mjs';
const page = asset => `<html><script type="module" crossorigin src="${asset}"></script></html>`;
const oldAsset='/2doctor/assets/index-old.js', latest='/2doctor/assets/index-new.js';
test('only recognizes 2Doctor entry assets, not external scripts or arbitrary HTML',()=>{
 assert.equal(entryAsset(page(oldAsset)),oldAsset);
 assert.equal(entryAsset(page('https://evil.test'+latest)),null);
 assert.equal(entryAsset(page('/wmed/assets/index-new.js')),null);
 assert.equal(entryAsset('<h1>Maintenance</h1>'),null);
});
test('version lookup compares public filenames and sends no credentials',async()=>{
 const signal=new AbortController().signal;
 const fetchImpl=async(url,options)=>{
  assert.equal(url,'/2doctor/');assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.signal,signal);
  return {ok:true,text:async()=>page(latest)};
 };
 assert.equal(await hasNewModuleVersion(oldAsset,fetchImpl,signal),true);
 assert.equal(await hasNewModuleVersion(latest,fetchImpl,signal),false);
});
test('offline, missing entry, HTTP failure and unknown page never claim an update',async()=>{
 assert.equal(await hasNewModuleVersion(null,()=>{throw Error('must not fetch')}),false);
 for(const fetchImpl of [async()=>{throw Error('offline')},async()=>({ok:false}),async()=>({ok:true,text:async()=>'<h1>Proxy error</h1>'})]){
  assert.equal(await hasNewModuleVersion(oldAsset,fetchImpl),false);
 }
});
test('recognizes browser import failures without treating render errors as deployment updates',()=>{
 for(const message of ['Failed to fetch dynamically imported module: /old.js','Importing a module script failed.','error loading dynamically imported module','Unable to preload CSS for /old.css']) assert.equal(isImportFailure(Error(message)),true);
 assert.equal(isImportFailure(Error('Cannot read properties of undefined')),false);
 assert.equal(isImportFailure(null),false);
});
