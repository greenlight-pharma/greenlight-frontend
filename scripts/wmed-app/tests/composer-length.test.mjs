import test from 'node:test';
import assert from 'node:assert/strict';
import { composerLength } from '../shared/composer-length.mjs';
test('composer warns near its existing limit and accepts the boundary', () => {
  assert.equal(composerLength('x'.repeat(1799)).visible, false);
  assert.equal(composerLength('x'.repeat(1800)).visible, true);
  assert.deepEqual(composerLength('x'.repeat(2000)), {used:2000,remaining:0,over:false,visible:true});
});
test('overlong draft stays intact and becomes sendable after editing', () => {
  const draft = 'Estudo. '.repeat(300) + 'CONCLUSAO';
  assert.equal(composerLength(draft).over, true);
  assert.equal(composerLength(draft).remaining, 2000-draft.length);
  assert.ok(draft.endsWith('CONCLUSAO'));
  assert.equal(composerLength(draft.slice(0,2000)).over, false);
});
test('composer counts Unicode and whitespace like the existing JS limit', () => {
  assert.equal(composerLength('🫀'.repeat(1000)).over, false);
  assert.equal(composerLength('🫀'.repeat(1000)+' ').over, true);
});
