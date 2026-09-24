import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import EN from '../src/i18n/en.js';

// Telas já traduzidas. Ao traduzir um novo módulo, acrescente o arquivo aqui.
export const TRANSLATED=['src/main.jsx','src/Modules.jsx','src/AuthDialog.jsx','src/PrivacyReview.jsx','src/ChatHistory.jsx','src/ChatAttachments.jsx','src/study/StudyDeck.jsx','src/Enamed.jsx','src/Usmle.jsx'];
// Mensagens que o servidor e os validadores compartilhados devolvem para essas telas (traduzidas no navegador).
export const MESSAGES=['server/vytal-assistant.mjs','server/history.mjs','server/research.mjs','server/public-research.mjs','shared/chat-attachments.mjs','shared/history.mjs'];
const url=f=>new URL('../'+f,import.meta.url);
export function keys(){
 const out=new Set();
 for(const f of TRANSLATED){const s=readFileSync(url(f),'utf8');for(const m of s.matchAll(/\b(?:t|msg)\(\s*(['"])((?:(?!\1)[^\\\n])+)\1/g))out.add(m[2]);}
 for(const f of MESSAGES){const s=readFileSync(url(f),'utf8');for(const m of s.matchAll(/(?:error:|text:|Error\()\s*'([^'\n]{3,})'/g))out.add(m[1]);}
 // códigos internos (ex.: SEARCH_UNAVAILABLE) não são exibidos
 return [...out].filter(k=>!/^[A-Z_]+$/.test(k));
}
test('toda frase das telas traduzidas tem versão em inglês',()=>{
 const missing=keys().filter(k=>typeof EN[k]!=='string'||!EN[k].trim());
 assert.deepEqual(missing,[]);
});
test('as traduções preservam as variáveis {nome}',()=>{
 for(const [pt,en] of Object.entries(EN)){
  const vars=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort().join();
  assert.equal(vars(en),vars(pt),`variáveis diferentes em: ${pt}`);
 }
});
test('o pedido em inglês instrui o assistente sem mudar o texto exibido',async()=>{
 const {withLanguage}=await import('../server/vytal-assistant.mjs');
 const input={question:'What is heart failure?',history:[]};
 assert.match(withLanguage(input,'en').question,/Please answer in English/);
 assert.equal(withLanguage(input,'pt'),input);
 assert.equal(withLanguage(input,undefined),input);
});
