// Invalidate delayed permission responses without touching a newer request.
export function createMicrophoneRequest() {
  let sequence = 0, current = null;
  return {
    begin() { if (current !== null) return null; current = ++sequence; return current; },
    isCurrent(token) { return token !== null && token === current; },
    finish(token) { if (token === null || token !== current) return false; current = null; return true; },
    cancel() { current = null; },
  };
}
export function stopMicrophone(stream) { stream?.getTracks().forEach(track => track.stop()); }
