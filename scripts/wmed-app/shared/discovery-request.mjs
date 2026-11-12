// Same-origin bibliographic metadata only. No retries, clinical model or persistence.
export async function requestDiscovery(query, kind, { signal, fetchImpl = fetch, timeoutMs = 25000 } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) cancel();
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    if (controller.signal.aborted) return { error: 'cancelled' };
    const response = await fetchImpl('/api/wmed/discovery', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WMed-Request': '1' },
      body: JSON.stringify({ query: query.trim(), kind }), signal: controller.signal,
    });
    if (!response.ok) return { error: response.status === 429 ? 'limited' : response.status === 400 ? 'input' : 'unavailable' };
    let data;
    try { data = await response.json(); } catch { return { error: controller.signal.aborted ? (timedOut ? 'timeout' : 'cancelled') : 'unavailable' }; }
    if (controller.signal.aborted) return { error: timedOut ? 'timeout' : 'cancelled' };
    if (data?.kind !== kind || !Array.isArray(data.items) || !Number.isFinite(Date.parse(data.retrievedAt)) || data.items.some(item => !item || typeof item.id !== 'string' || typeof item.title !== 'string' || typeof item.url !== 'string')) return { error: 'unavailable' };
    return { data };
  } catch {
    return { error: timedOut ? 'timeout' : controller.signal.aborted ? 'cancelled' : 'network' };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
