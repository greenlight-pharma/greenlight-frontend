// Cancels the browser wait. An upstream service may still finish processing.
export function transcribeCaseAudio(blob, { signal, read, send }) {
  return new Promise((resolve, reject) => {
    const aborted = () => reject(new DOMException('Espera cancelada', 'AbortError'));
    if (signal.aborted) return aborted();
    signal.addEventListener('abort', aborted, { once: true });
    (async () => {
      const audioBase64 = await read(blob);
      signal.throwIfAborted();
      const result = await send(audioBase64, signal);
      signal.throwIfAborted();
      return result;
    })().then(resolve, reject).finally(() => signal.removeEventListener('abort', aborted));
  });
}
