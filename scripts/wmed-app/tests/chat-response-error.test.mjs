import test from 'node:test';
import assert from 'node:assert/strict';
import { chatResponseError } from '../shared/chat-response-error.mjs';
import { translate } from '../shared/i18n/catalog.mjs';

const fallback = 'O assistente não conseguiu concluir a resposta. Tente novamente.';
test('gateway HTML and empty responses produce an actionable localized fallback', async () => {
  for (const locale of ['pt-BR', 'en', 'es']) {
    for (const body of ['<html>Gateway temporarily unavailable</html>', '']) {
      const text = translate(locale, fallback);
      assert.equal(await chatResponseError(new Response(body, {status:502}), text), text);
    }
  }
});
test('keeps API guidance for authentication and limits, rejecting invalid error shapes', async () => {
  for (const [status, error] of [[401,'Entre novamente.'],[429,'Aguarde antes de tentar novamente.']]) {
    assert.equal(await chatResponseError(Response.json({error}, {status}), fallback), error);
  }
  for (const data of [null, {}, {error:{}}, {error:0}, {error:'   '}]) {
    assert.equal(await chatResponseError(Response.json(data, {status:503}), fallback), fallback);
  }
});
test('does not turn a user interruption into a service error', async () => {
  const error = new DOMException('Stopped', 'AbortError');
  await assert.rejects(chatResponseError({json:async()=>{throw error;}}, fallback), e=>e===error);
});
