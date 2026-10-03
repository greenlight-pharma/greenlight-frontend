import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldSubmitComposer } from '../shared/composer-keyboard.mjs';

test('desktop Enter submits while Shift+Enter preserves a new line', () => {
  assert.equal(shouldSubmitComposer({key:'Enter'}), true);
  assert.equal(shouldSubmitComposer({key:'Enter',shiftKey:true}), false);
  assert.equal(shouldSubmitComposer({key:'a'}), false);
});
test('compact and touch layouts never submit through Enter', () => {
  assert.equal(shouldSubmitComposer({key:'Enter'}, true), false);
  assert.equal(shouldSubmitComposer({key:'Enter',shiftKey:true}, true), false);
});
test('IME confirmation and held keys cannot accidentally submit', () => {
  for (const event of [
    {isComposing:true}, {nativeEvent:{isComposing:true}},
    {keyCode:229}, {nativeEvent:{keyCode:229}}, {repeat:true},
  ]) assert.equal(shouldSubmitComposer({key:'Enter',...event}), false);
  assert.equal(shouldSubmitComposer({key:'Enter',nativeEvent:{isComposing:false,keyCode:13}}), true);
});
