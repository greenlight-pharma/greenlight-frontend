import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const terms = await readFile(new URL('../termos/index.html', import.meta.url), 'utf8');
const privacy = await readFile(new URL('../privacidade-lembretes/index.html', import.meta.url), 'utf8');
const landing = await readFile(new URL('../vytal-care2/index.html', import.meta.url), 'utf8');

test('Termos 1.1 contemplam família, teste, cartão, Pix, cancelamento e arrependimento', () => {
  for (const text of ['Versão 1.1', 'conta familiar', 'teste gratuito sem cartão', 'renovação automática', 'No Pix', 'direito de arrependimento']) assert.match(terms, new RegExp(text, 'i'));
  assert.doesNotMatch(terms, /devem ser preenchidos antes da publicação/i);
});

test('política Care 1.1 explica campanha mínima e não compartilhada com anúncios', () => {
  for (const text of ['Versão 1.1', 'Care pessoal ou familiar', 'Origem da campanha de cadastro', 'identificadores de clique', 'não são enviados pela Vytal à Meta', 'legítimo interesse']) assert.match(privacy, new RegExp(text, 'i'));
  assert.doesNotMatch(privacy, /devem ser preenchidos antes da publicação/i);
});

test('landing do Care aponta à política do Care', () => {
  assert.match(landing, /href="\/privacidade-lembretes"/);
  assert.doesNotMatch(landing, /href="\/privacidade"/);
});
