import test from 'node:test';import assert from 'node:assert/strict';
import {countryResources,countryProfile,pickText} from '../shared/country-hub.mjs';
import {countries} from '../shared/international.mjs';
import {challenges,challengeSources,resolveChallenge,dailyChallenge,challengeUrl,readChallengeProgress,recordChallenge} from '../shared/challenges.mjs';
test('Regional directory covers supported countries without treating unknown country as a jurisdiction',()=>{
 assert.deepEqual(countryResources.map(p=>p.code).sort(),countries.filter(c=>!['global','other'].includes(c)).sort());
 assert.equal(countryProfile('global'),null);assert.equal(countryProfile('<invalid>'),null);
 const hosts=['www.gov.br','www.acss.min-saude.pt','www.usmle.org','www.gmc-uk.org','www.sanidad.gob.es','www.cifrhs.salud.gob.mx','www.argentina.gob.ar','www2.minsalud.gov.co','www.eunacom.cl','mcc.ca','www.amc.org.au','www.natboard.edu.in'];
 for(const p of countryResources){const url=new URL(p.url);assert.equal(url.protocol,'https:');assert.ok(hosts.includes(url.hostname));assert.equal(p.focus.length,3);assert.ok(p.focus.every(Boolean));}
});
test('Daily challenges have original trilingual prompts, valid answers and source links',()=>{
 assert.equal(new Set(challenges.map(q=>q.id)).size,challenges.length);
 for(const q of challenges){for(const field of [q.topic,q.question,q.explanation,q.memory,...q.options]){assert.equal(field.length,3);assert.ok(field.every(x=>typeof x==='string'&&x.length>0));}assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.equal(new URL(challengeSources[q.source].url).protocol,'https:');}
 assert.equal(pickText(['pt','en','es'],'es'),'es');assert.equal(dailyChallenge('2026-09-25').id,dailyChallenge('2026-09-25').id);
 assert.equal(resolveChallenge('made-up','2026-09-25').id,dailyChallenge('2026-09-25').id);
});
test('Sharing preserves the challenge, strips unrelated query data and has no answer or personal data',()=>{
 const url=challengeUrl('https://2doctor.example','/2doctor/?private=do-not-share','nnt');
 assert.equal(url,'https://2doctor.example/2doctor/#desafio?id=nnt');assert.equal(resolveChallenge('nnt','2099-01-01').id,'nnt');
 assert.throws(()=>challengeUrl('https://2doctor.example','/2doctor/','<script>'));
});
test('Local learning progress tolerates corrupt storage and records only the first valid choice',()=>{
 assert.deepEqual(readChallengeProgress({getItem:()=>'{broken'}),{});assert.deepEqual(readChallengeProgress(null),{});
 assert.deepEqual(readChallengeProgress({getItem:()=>JSON.stringify({nnt:1,prevalence:999,unexpected:'payload',sensitivity:-1})}),{nnt:1});
 const first=recordChallenge({},'nnt',0);assert.deepEqual(recordChallenge(first,'nnt',1),{nnt:0});assert.deepEqual(recordChallenge(first,'nnt',NaN),first);assert.deepEqual(recordChallenge(first,'bogus',1),first);
});
