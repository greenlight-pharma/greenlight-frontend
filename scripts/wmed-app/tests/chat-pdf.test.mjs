import test from 'node:test';
import assert from 'node:assert/strict';
import { chatPdfDefinition } from '../shared/chat-pdf.mjs';
test('PDF preserves text, emphasis, lists and safe citations without topic metadata', () => {
 const doc = chatPdfDefinition({text:'# Revisão\n\n**Atenção**: ação e pressão ≥ 10.\n\n1. Primeiro\n2. Segundo\n\n[Diretriz](https://example.org)\n\n###TEMAS### ["Não exportar"]'});
 const json=JSON.stringify(doc);
 for(const expected of ['Revisão','Atenção','ação e pressão ', '≥', ' 10.','Primeiro','Segundo','https://example.org']) assert.ok(json.includes(expected));
 assert.ok(!json.includes('TEMAS')); assert.ok(!json.includes('Não exportar'));
 assert.ok(doc.content.some(n=>n.ol)); assert.ok(json.includes('"bold":true'));
});
test('PDF does not embed remote images or unsafe links', () => {
 const json=JSON.stringify(chatPdfDefinition({text:'[Abrir](javascript:alert)\n\n![Imagem](https://private.example/image.png)'}));
 assert.ok(!json.includes('javascript:')); assert.ok(!json.includes('private.example'));
});
test('PDF has repeating table headers, wide tables preserve all columns as labeled records', () => {
 const doc=chatPdfDefinition({text:'| A | B |\n|---|---|\n| Ação | 2 |'});
 assert.equal(doc.content.find(n=>n.table).table.headerRows,1);
 const wide=JSON.stringify(chatPdfDefinition({text:'| A | B | C | D | E |\n|---|---|---|---|---|\n| um | dois | três | quatro | cinco |'}));
 for(const value of ['um','dois','três','quatro','cinco']) assert.ok(wide.includes(value));
});
test('PDF research references retain numbering and links without inventing citations', () => {
 const json=JSON.stringify(chatPdfDefinition({mode:'research',text:'Texto [1].',sources:[{title:'Fonte',url:'https://example.org/paper'}]}));
 assert.ok(json.includes('https://example.org/paper')); assert.ok(json.includes('1. Fonte'));
});

test('PDF preserves footnote citations, repeated notes, and linked note bodies', () => {
 const doc=chatPdfDefinition({text:'Texto[^b] e repetição[^b]. Depois[^a].\n\n[^a]: Nota A com **ênfase**.\n[^b]: Nota B: [fonte](https://example.org/fonte)\n\n[^unused]: Não citada.'});
 const json=JSON.stringify(doc);
 assert.equal((json.match(/"linkToDestination":"note-1"/g)||[]).length,2);
 assert.ok(json.includes('"linkToDestination":"note-2"'));
 assert.equal((json.match(/"id":"note-1"/g)||[]).length,1);
 assert.ok(json.includes('https://example.org/fonte'));
 assert.ok(json.includes('Nota A')); assert.ok(json.includes('ênfase'));
 assert.ok(!json.includes('Não citada'));
});
test('PDF keeps reference-style links alongside footnotes and does not fetch anything', () => {
 const json=JSON.stringify(chatPdfDefinition({text:'[Fonte][ref] e nota[^1].\n\n[ref]: https://example.org/ref\n[^1]: [Documento][ref]'}));
 assert.equal((json.match(/"link":"https:\/\/example.org\/ref"/g)||[]).length,2);
 assert.ok(json.includes('"id":"note-1"'));
});
