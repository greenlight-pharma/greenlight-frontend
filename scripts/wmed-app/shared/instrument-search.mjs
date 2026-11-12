// Catalog lookup only. Never changes a score, formula, or interpretation.
const normalize = value => String(value ?? '').normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function matchesInstrument(query, ...fields) {
  const haystack = normalize(fields.join(' '));
  return normalize(query).split(/\s+/).every(term => haystack.includes(term));
}
