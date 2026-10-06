import test from 'node:test';
import assert from 'node:assert/strict';
import {qbankEntry} from '../src/questions/catalog-entry.mjs';
import {approvedQbank} from '../shared/approved-qbank.mjs';
import {qbankDrafts} from '../tools/india-preview/qbank-content.mjs';
test('empty approved manifest keeps both products on existing catalog and storage',()=>{
 assert.deepEqual(approvedQbank,[]);
 const scope='a'.repeat(64);
 for(const doctor of [true,false])assert.deepEqual(qbankEntry({doctor,original:true,scope}),{storageKey:`wmed:questions:${scope}`});
 assert.deepEqual(qbankEntry({doctor:true}),{storageKey:'wmed:questions:guest'});
});
test('production entry rejects pending drafts even when catalog is not selected',()=>{
 assert.throws(()=>qbankEntry({doctor:true,original:false},qbankDrafts),/unreviewed/);
});
test('approved catalog requires explicit 2Doctor selection and isolates account from legacy and guest',()=>{
 const catalog=qbankDrafts.map(q=>({...q,review:{status:'approved',reviewer:'Synthetic test reviewer',date:'2026-10-06',version:q.version}}));
 const scope='b'.repeat(64),entry=qbankEntry({doctor:true,original:true,scope},catalog);
 assert.equal(entry.catalog,catalog);
 assert.equal(entry.storageKey,`2doctor:qbank:original-learning:${scope}`);
 assert.equal(entry.catalogId,'original-learning');
 assert.equal(qbankEntry({doctor:true,original:true},catalog).storageKey,'2doctor:qbank:original-learning:guest');
 assert.deepEqual(qbankEntry({doctor:false,original:true,scope},catalog),{storageKey:`wmed:questions:${scope}`});
 assert.deepEqual(qbankEntry({doctor:true,original:false,scope},catalog),{storageKey:`wmed:questions:${scope}`});
});
