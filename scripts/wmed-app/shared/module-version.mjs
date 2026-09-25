// Only compare public bundle names. Never store drafts or import remote code.
export function entryAsset(html) {
  return String(html).match(/<script\b[^>]*\bsrc=["'](\/2doctor\/assets\/index-[A-Za-z0-9_-]+\.js)["'][^>]*>/i)?.[1] ?? null;
}
export function isImportFailure(error) {
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed|Unable to preload CSS/i.test(String(error?.message ?? ''));
}
export async function hasNewModuleVersion(currentAsset, fetchImpl, signal) {
  if (!currentAsset) return false;
  try {
    const response = await fetchImpl('/2doctor/', {cache:'no-store', credentials:'omit', signal});
    if (!response.ok) return false;
    const latest = entryAsset(await response.text());
    return Boolean(latest && latest !== currentAsset);
  } catch { return false; }
}
