// Simple bibliographic text; deliberately not a complete citation style.
const line = value => typeof value === 'string' || typeof value === 'number' ? String(value).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim() : '';
export function selectedReferences(items, ids) {
 const wanted = new Set(ids); const seen = new Set();
 return items.filter(item => wanted.has(item.id) && !seen.has(item.id) && (seen.add(item.id), true));
}
export function referenceText(item) {
 return [item.authors, item.title, item.journal, item.year].map(line).filter(Boolean).join(' · ') +
  (line(item.doi) ? `\nDOI: ${line(item.doi)}` : '') + `\n${line(item.url)}`;
}
export function exportReferences(items, locale='pt-BR', retrievedAt) {
 if (!items.length) return '';
 const i = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
 const title = ['Referências selecionadas — 2Doctor','Selected references — 2Doctor','Referencias seleccionadas — 2Doctor'][i];
 const note = ['Formato simples. Confira os dados na fonte antes de citar.','Simple format. Check the source metadata before citing.','Formato simple. Revisa los datos en la fuente antes de citar.'][i];
 const source = ['Fonte','Source','Fuente'][i]; const date = ['Consulta','Retrieved','Consulta'][i];
 const validDate = Number.isFinite(Date.parse(retrievedAt));
 return `${title}\n${note}\n${source}: Europe PMC${validDate ? `\n${date}: ${new Date(retrievedAt).toISOString()}` : ''}\n\n` + items.map((item,index)=>`${index+1}. ${referenceText(item)}`).join('\n\n');
}
