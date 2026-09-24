// Importação dos dados abertos da Anvisa com um arquivo de exemplo no formato oficial (CSV ";" em Latin-1).
import test from 'node:test';import assert from 'node:assert/strict';
import {build,decode,canonical,parseCsv} from '../tools/anvisa/medicamentos.mjs';

const CSV=['TIPO_PRODUTO;NOME_PRODUTO;DATA_FINALIZACAO_PROCESSO;CATEGORIA_REGULATORIA;NUMERO_REGISTRO_PRODUTO;DATA_VENCIMENTO_REGISTRO;NUMERO_PROCESSO;CLASSE_TERAPEUTICA;EMPRESA_DETENTORA_REGISTRO;SITUACAO_REGISTRO;PRINCIPIO_ATIVO',
 'MEDICAMENTO;ATLANSIL;01/01/2000;REFERÊNCIA;100000001;01/01/2030;1;ANTIARRITMICOS;12345678000100 - SANOFI MEDLEY FARMACÊUTICA LTDA;VÁLIDO;CLORIDRATO DE AMIODARONA',
 'MEDICAMENTO;CLORIDRATO DE AMIODARONA;01/01/2010;GENÉRICO;100000002;01/01/2030;2;ANTIARRITMICOS;EMS S/A;VÁLIDO;CLORIDRATO DE AMIODARONA',
 'MEDICAMENTO;AMIODAL;01/01/2001;SIMILAR;100000003;01/01/2010;3;ANTIARRITMICOS;LAB X;CADUCO/CANCELADO;CLORIDRATO DE AMIODARONA',
 'MEDICAMENTO;"CLAVULIN; BD";01/01/2000;REFERÊNCIA;100000004;01/01/2030;4;PENICILINAS;GSK;VÁLIDO;AMOXICILINA TRI-HIDRATADA + CLAVULANATO DE POTÁSSIO',
 'MEDICAMENTO;BACTRIM;01/01/2000;REFERÊNCIA;100000005;01/01/2030;5;SULFAS;ROCHE;VÁLIDO;SULFAMETOXAZOL + TRIMETOPRIMA',
 'MEDICAMENTO;SLOW-K;01/01/2000;SIMILAR;100000006;01/01/2030;6;ELETRÓLITOS;NOVARTIS;VÁLIDO;CLORETO DE POTÁSSIO',
 'MEDICAMENTO;ATLANSIL;01/01/2000;REFERÊNCIA;100000001;01/01/2030;1;ANTIARRITMICOS;12345678000100 - SANOFI MEDLEY FARMACÊUTICA LTDA;VÁLIDO;CLORIDRATO DE AMIODARONA',
 'MEDICAMENTO;TYLENOL;01/01/2000;REFERÊNCIA;100000007;01/01/2030;7;ANALGESICOS;J&J;VÁLIDO;PARACETAMOL',
].join('\r\n');
const latin1=Buffer.from(CSV,'latin1');

test('decodifica Latin-1 e UTF-8 e lê campos entre aspas',()=>{
 assert.match(decode(latin1),/REFERÊNCIA/);assert.match(decode(Buffer.from('﻿'+CSV,'utf8')),/^TIPO_PRODUTO/);
 assert.equal(parseCsv(CSV)[4][1],'CLAVULIN; BD');
});
test('princípio ativo canônico ignora sal e hidrato',()=>{
 assert.equal(canonical('CLORIDRATO DE AMIODARONA'),'amiodarona');
 assert.equal(canonical('AMOXICILINA TRI-HIDRATADA + CLAVULANATO DE POTÁSSIO'),canonical('amoxicilina com clavulanato'));
 assert.equal(canonical('SULFAMETOXAZOL + TRIMETOPRIMA'),canonical('sulfametoxazol-trimetoprima'));
 assert.equal(canonical('CLORETO DE POTÁSSIO'),'cloreto de potassio');
});
test('só registros válidos dos princípios do acervo, sem duplicata e com referência primeiro',()=>{
 const d=build(decode(latin1),['amiodarona','amoxicilina com clavulanato','sulfametoxazol com trimetoprima','sulfametoxazol-trimetoprima','cloreto de potássio'],{date:'2026-09-24'});
 assert.equal(d.registrosValidos,7);
 assert.deepEqual(d.meds.amiodarona.produtos.map(p=>[p.nome,p.categoria,p.empresa]),[['Atlansil','Referência','Sanofi Medley Farmacêutica Ltda'],['Cloridrato De Amiodarona','Genérico','Ems S/A']]);
 assert.equal(d.meds['amoxicilina com clavulanato'].produtos[0].nome,'Clavulin; Bd');
 assert.equal(d.meds['cloreto de potássio'].total,1);
 assert.ok(d.meds['sulfametoxazol com trimetoprima']||d.meds['sulfametoxazol-trimetoprima']);
 assert.equal(d.meds.paracetamol,undefined,'fora do acervo informado');
});
test('arquivo sem as colunas esperadas é recusado',()=>{
 assert.throws(()=>build('A;B\n1;2',['amiodarona']),/PRINCIPIO_ATIVO|NOME_PRODUTO/);
});
