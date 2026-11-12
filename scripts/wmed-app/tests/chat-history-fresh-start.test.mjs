import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('returning to the site does not reopen the previous chat', () => {
  const src = readFileSync(new URL('../src/ChatHistory.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /localStorage\.getItem/);
  assert.doesNotMatch(src, /localStorage\.setItem/);
});
