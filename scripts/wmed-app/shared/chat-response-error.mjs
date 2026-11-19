// Gateways can return HTML or an empty body instead of the API's JSON error.
export async function chatResponseError(response, fallback) {
  try {
    const data = await response.json();
    return typeof data?.error === 'string' && data.error.trim() ? data.error : fallback;
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    return fallback;
  }
}
