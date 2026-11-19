// Enter inserts a line on compact/touch layouts and during IME composition.
export function shouldSubmitComposer(event, compactOrTouch = false) {
  const native = event.nativeEvent ?? event;
  return event.key === 'Enter' && !event.shiftKey && !compactOrTouch
    && !event.repeat && !native.isComposing && !event.isComposing
    && native.keyCode !== 229 && event.keyCode !== 229;
}
