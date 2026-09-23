export function progressKey(scope) {
  return typeof scope === "string" && /^[a-f0-9]{64}$/.test(scope)
    ? `wmed:progress:v1:${scope}`
    : null;
}
export function cleanProgress(value) {
  return Array.isArray(value)
    ? value
        .filter(
          (p) =>
            p &&
            Number.isInteger(p.score) &&
            p.score >= 0 &&
            p.score <= 100 &&
            typeof p.date === "string" &&
            Number.isFinite(Date.parse(p.date)),
        )
        .slice(-200)
        .map(({ score, date }) => ({ score, date }))
    : [];
}
export function loadProgress(storage, scope) {
  const key = progressKey(scope);
  if (!key) return [];
  try {
    return cleanProgress(JSON.parse(storage.getItem(key) || "[]"));
  } catch {
    return [];
  }
}
export function saveProgress(storage, scope, records) {
  const key = progressKey(scope);
  if (!key) return false;
  try {
    storage.setItem(key, JSON.stringify(cleanProgress(records)));
    return true;
  } catch {
    return false;
  }
}
