import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { campaignHref, campaignParameters } from '../assets/care-acquisition.mjs';

const query = 'utm_source=meta&utm_medium=paid_social&utm_campaign=care_familia_v1&utm_content=familia';
const page = `https://www.vytalsaude.com.br/?${query}&email=nao-repassar&fbclid=nao-repassar`;
test('origem acompanha homepage, landing e cadastro sem parâmetros pessoais', () => {
  const landing = campaignHref('/vytal-care2/', page);
  const signup = campaignHref('https://care.vytalsaude.com.br/familia', landing);
  assert.equal(signup, `https://care.vytalsaude.com.br/familia?${query}`);
  assert.equal(campaignHref(signup, landing), signup);
});
test('não altera links externos, institucionais ou navegação interna do app', () => {
  for (const href of ['/privacidade', '/termos', 'https://wa.me/5500000000000', 'https://care.vytalsaude.com.br/conta', 'https://outro.example/vytal-care2/']) {
    assert.equal(campaignHref(href, page), href);
  }
});
test('tráfego sem campanha completa ou com texto livre não gera atribuição', () => {
  for (const q of ['', query.replace('familia_v1', 'outra'), query.replace('utm_content=familia', 'utm_content=telefone'), 'utm_source=meta']) {
    assert.equal(campaignParameters(q), '');
    assert.equal(campaignHref('/vytal-care2/', `https://www.vytalsaude.com.br/?${q}`), '/vytal-care2/');
  }
});
test('links curtos da bio e do anúncio abrem o WhatsApp com origens separadas', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
  const bySource = Object.fromEntries(config.redirects.map((item) => [item.source, item]));
  assert.match(bySource['/care-whatsapp'].destination, /^https:\/\/wa\.me\/5512996527434\?text=/);
  assert.match(decodeURIComponent(bySource['/care-whatsapp'].destination), /\[IG-BIO-001\]$/);
  assert.match(decodeURIComponent(bySource['/care-anuncio'].destination), /\[META-ANUNCIO-001\]$/);
  assert.equal(bySource['/care-whatsapp'].permanent, false);
  assert.equal(bySource['/care-anuncio'].permanent, false);
});
