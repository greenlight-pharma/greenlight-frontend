// Verificador de interações: pares clássicos precisam sair com a gravidade e a conduta certas.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {checkInteractions,INTERACTION_DRUGS,SEVERITY} from '../shared/interactions.mjs';
const one=(...d)=>checkInteractions(d);
const top=(...d)=>one(...d)[0];

test('pares clássicos',()=>{
 assert.equal(top('sildenafila','nitroglicerina').sev,'contraindicada');
 assert.equal(top('sacubitril + valsartana','enalapril').sev,'contraindicada');
 assert.equal(top('sinvastatina','claritromicina').sev,'contraindicada');
 assert.equal(top('tranilcipromina','sertralina').sev,'contraindicada');
 assert.equal(top('ácido valproico','meropenem').sev,'contraindicada');
 for(const pair of [['varfarina','amiodarona'],['varfarina','ácido acetilsalicílico'],['enalapril','espironolactona'],['azitromicina','ondansetrona'],['morfina','diazepam'],['metoprolol','verapamil'],['alopurinol','azatioprina'],['carbonato de lítio','hidroclorotiazida'],['rifampicina','contraceptivo oral combinado'],['gentamicina','vancomicina']])
  assert.equal(top(...pair).sev,'grave',pair.join(' + '));
 assert.equal(top('clopidogrel','omeprazol').sev,'moderada');
 assert.equal(top('ciprofloxacino','carbonato de cálcio').sev,'moderada');
});
test('par específico prevalece sobre a regra de classe no mesmo mecanismo',()=>{
 const r=one('sinvastatina','diltiazem').filter(f=>f.grupo==='cyp3a4');
 assert.equal(r.length,1);assert.match(r[0].conduta,/10 mg/);
 assert.equal(one('sacubitril + valsartana','enalapril').filter(f=>f.grupo==='ieca-bra').length,1);
});
test('vários mecanismos no mesmo par aparecem separados e ordenados por gravidade',()=>{
 const r=one('amiodarona','varfarina','claritromicina');
 assert.ok(r.some(f=>f.grupo==='qt'&&f.a!==f.b));
 for(let i=1;i<r.length;i++)assert.ok(SEVERITY[r[i-1].sev]>=SEVERITY[r[i].sev]);
});
test('triplo golpe renal e ausência de falso positivo',()=>{
 assert.ok(one('enalapril','furosemida','ibuprofeno').some(f=>f.grupo==='triplo-golpe'));
 assert.ok(!one('enalapril','furosemida').some(f=>f.grupo==='triplo-golpe'));
 assert.deepEqual(one('amoxicilina','dipirona'),[]);
 assert.deepEqual(one('omeprazol','omeprazol'),[]);
});
test('todo fármaco do acervo com o mesmo nome é reconhecido e os textos estão completos',()=>{
 const acervo=new Set(JSON.parse(readFileSync(new URL('../public/dados/medicacoes.json',import.meta.url))).map(m=>m.n));
 const known=INTERACTION_DRUGS.filter(d=>acervo.has(d));
 assert.ok(known.length>=60,`${known.length} fármacos do acervo com regras`);
 const all=checkInteractions(INTERACTION_DRUGS);
 assert.ok(all.length>200);
 for(const f of all){assert.ok(f.titulo&&f.efeito.length>20&&f.conduta.length>10,f.titulo);assert.ok(f.sev in SEVERITY);}
});
test('linezolida com qualquer serotoninérgico',()=>{
 for(const d of ['sertralina','tramadol','venlafaxina','fentanil'])assert.equal(top('linezolida',d).sev,'grave',d);
});
