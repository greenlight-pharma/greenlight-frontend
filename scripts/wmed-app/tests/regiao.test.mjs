import test from 'node:test';
import assert from 'node:assert/strict';
import { ipBrasil, noBrasil } from '../server/regiao.mjs';

test('IP do Brasil pelas faixas do LACNIC (v4, v6 e v4 mapeado)', () => {
 assert.equal(ipBrasil('200.147.67.142'), true);
 assert.equal(ipBrasil('::ffff:177.10.1.1'), true);
 assert.equal(ipBrasil('2804:14c::1'), true);
 for (const ip of ['8.8.8.8', '151.101.1.1', '2001:4860::1', '127.0.0.1', '', 'lixo']) assert.equal(ipBrasil(ip), false, ip);
});
test('usa o primeiro IP do X-Forwarded-For', () => {
 assert.equal(noBrasil({ headers: { 'x-forwarded-for': '200.147.67.142, 10.0.0.1' } }), true);
 assert.equal(noBrasil({ headers: { 'x-forwarded-for': '8.8.8.8, 200.147.67.142' } }), false);
});
