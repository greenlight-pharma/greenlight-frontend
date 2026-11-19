import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesInstrument} from '../shared/instrument-search.mjs';

test('instrument lookup accepts accents, numeric subscripts, and pasted spacing', () => {
  assert.ok(matchesInstrument('  CHA2DS2   VASc ', 'CHA₂DS₂-VASc', 'Cardiologia'));
  assert.ok(matchesInstrument('emergencia', 'Glasgow', 'Emergência'));
  assert.ok(matchesInstrument('', 'Glasgow'));
});
test('instrument lookup combines name and localized specialty without unrelated results', () => {
  assert.ok(matchesInstrument('neurology glasgow', 'Glasgow', 'Neurologia', 'Neurology'));
  assert.ok(matchesInstrument('cardiologia heart', 'HEART', 'Cardiologia'));
  assert.equal(matchesInstrument('cardiologia glasgow', 'Glasgow', 'Neurologia'), false);
  assert.equal(matchesInstrument('inexistente', 'Glasgow'), false);
});
