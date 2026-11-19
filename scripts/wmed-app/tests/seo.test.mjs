import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {doctorIndexHtml,SEO,SITE} from '../shared/seo.mjs';
const read=path=>readFile(new URL(path,import.meta.url),'utf8');
test('2Doctor build gets an English, indexable head with link preview tags',async()=>{
 const html=doctorIndexHtml(await read('../index.html'));
 assert.match(html,/<html lang="en">/);assert.match(html,/<meta name="robots" content="index,follow"\/>/);assert.ok(!html.includes('noindex'));
 assert.ok(html.includes(`<title>${SEO.title}</title>`));assert.ok(!/Medicina conectada|WMed/.test(html));
 for(const tag of ['name="description"','rel="canonical"','property="og:title"','property="og:description"','property="og:image"','name="twitter:card" content="summary_large_image"','rel="apple-touch-icon"','brand/2doctor/favicon.svg','#005d5b'])assert.ok(html.includes(tag),tag);
 assert.equal(SEO.image,SITE+'/brand/2doctor/og-2doctor.png');
 assert.ok((await stat(new URL('../public/brand/2doctor/og-2doctor.png',import.meta.url))).size>5000);
});
test('WMed keeps the shared index.html untouched (Portuguese, not indexed)',async()=>{
 const html=await read('../index.html');
 assert.match(html,/<html lang="pt-BR">/);assert.match(html,/noindex,nofollow/);assert.match(html,/<title>WMed · Evidências em perspectiva<\/title>/);
 assert.match(await read('../vite.config.js'),/VITE_PRODUCT==='2doctor'\?doctorIndexHtml\(html\):html/);
});
