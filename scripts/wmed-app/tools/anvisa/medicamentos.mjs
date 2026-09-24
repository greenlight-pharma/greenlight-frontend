// Importa os registros de medicamentos dos dados abertos da Anvisa e gera public/dados/anvisa.json
// só com os princípios ativos do acervo WMed (medicações e verificador de interações).
// Uso: node tools/anvisa/medicamentos.mjs [arquivo.csv|URL]   (padrão: URL oficial abaixo)
// Fonte: Anvisa, Dados Abertos (licença aberta; citar a fonte). O arquivo é CSV com ";" em Latin-1 ou UTF-8.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

export const ANVISA_URL='https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv';
const MAX_PRODUCTS=40;

export const plain=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

// Latin-1 é o formato histórico do arquivo; se o UTF-8 não tiver erro de decodificação, fica com ele.
export function decode(buf){const utf=new TextDecoder('utf-8').decode(buf);return utf.includes('�')?new TextDecoder('latin1').decode(buf):utf.replace(/^﻿/,'');}

export function parseCsv(text,sep=';'){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else quoted=false;}else field+=c;}
  else if(c==='"')quoted=true;
  else if(c===sep){row.push(field);field='';}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);field='';if(row.some(v=>v!==''))rows.push(row);row=[];}
  else field+=c;}
 row.push(field);if(row.some(v=>v!==''))rows.push(row);
 return rows;
}

// Sais, hidratos e qualificadores que não mudam o princípio ativo (cloridrato de amiodarona → amiodarona).
const SALT=new Set(['cloridrato','dicloridrato','bromidrato','sulfato','hemissulfato','fosfato','maleato','mesilato','besilato','tartarato','hemitartarato','succinato','citrato','acetato','fumarato','hemifumarato','valerato','propionato','dipropionato','furoato','xinafoato','monoidratado','monoidratada','di-hidratado','di-hidratada','tri-hidratado','tri-hidratada','hemi-hidratado','hidratado','hidratada','anidro','anidra','potassica','potassico','sodica','sodico','calcica','calcico','magnesica','magnesico','potassio','sodio','calcio','magnesio','de','da','do']);
const KEEP=new Set(['cloreto de potassio','cloreto de sodio','carbonato de calcio','carbonato de litio','sulfato de magnesio','sulfato de zinco','sulfato ferroso','gluconato de calcio','citrato de potassio','bicarbonato de sodio','iodeto de potassio','heparina sodica','nitroprusseto de sodio','butilbrometo de escopolamina','brometo de ipratropio','brometo de tiotropio','subcitrato de bismuto','mononitrato de isossorbida','dinitrato de isossorbida']);
export function canonicalPart(s){
 const p=plain(s).replace(/[()]/g,' ').replace(/\s+/g,' ').trim();
 if(KEEP.has(p))return p;
 return p.split(' ').filter(w=>!SALT.has(w)).join(' ').trim();
}
// "AMOXICILINA TRI-HIDRATADA + CLAVULANATO DE POTÁSSIO" e "amoxicilina com clavulanato" → "amoxicilina + clavulanato"
export function canonical(s){
 return plain(s).replace(/([a-z])-(?!hidrat)([a-z])/g,'$1 + $2').split(/\s*(?:\+|;|,|\bcom\b| e )\s*/).map(canonicalPart).filter(Boolean).sort().join(' + ');
}

const CATEGORY_ORDER=['referencia','generico','similar','novo','biologico','especifico'];
const catRank=c=>{const i=CATEGORY_ORDER.findIndex(k=>plain(c).startsWith(k));return i<0?CATEGORY_ORDER.length:i;};
const title=s=>String(s||'').toLowerCase().replace(/(^|[\s\-/(])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()).trim();

export function build(csvText,names,{date=new Date().toISOString().slice(0,10)}={}){
 const [head,...rows]=parseCsv(csvText);
 const col=Object.fromEntries(head.map((h,i)=>[plain(h).toUpperCase().replace(/ /g,'_'),i]));
 for(const need of ['NOME_PRODUTO','PRINCIPIO_ATIVO','SITUACAO_REGISTRO','CATEGORIA_REGULATORIA','EMPRESA_DETENTORA_REGISTRO','NUMERO_REGISTRO_PRODUTO'])
  if(!(need in col))throw Error(`Coluna ${need} não encontrada no arquivo da Anvisa. Colunas: ${head.join(', ')}`);
 const wanted=new Map(names.map(n=>[canonical(n),n]));
 const out={};let validRows=0;
 for(const r of rows){
  const get=k=>(r[col[k]]||'').trim();
  if(!plain(get('SITUACAO_REGISTRO')).startsWith('valido'))continue;
  if('TIPO_PRODUTO' in col&&!plain(get('TIPO_PRODUTO')).startsWith('medicamento'))continue;
  validRows++;
  const name=wanted.get(canonical(get('PRINCIPIO_ATIVO')));if(!name)continue;
  (out[name]||=[]).push({nome:title(get('NOME_PRODUTO')),categoria:title(get('CATEGORIA_REGULATORIA')),empresa:title(get('EMPRESA_DETENTORA_REGISTRO').replace(/^\d[\d./-]*\s*-\s*/,'')),registro:get('NUMERO_REGISTRO_PRODUTO')});
 }
 const meds={};
 for(const [name,list] of Object.entries(out)){
  const seen=new Set(),uniq=list.filter(p=>{const k=plain(p.nome+'|'+p.empresa);if(seen.has(k))return false;seen.add(k);return true;});
  uniq.sort((a,b)=>catRank(a.categoria)-catRank(b.categoria)||a.nome.localeCompare(b.nome,'pt'));
  meds[name]={total:uniq.length,produtos:uniq.slice(0,MAX_PRODUCTS)};
 }
 return {fonte:'Anvisa · Dados Abertos · Medicamentos registrados',url:ANVISA_URL,geradoEm:date,registrosValidos:validRows,meds};
}

async function main(){
 const src=process.argv[2]||ANVISA_URL;
 const buf=/^https?:\/\//.test(src)?new Uint8Array(await (await fetch(src).then(r=>{if(!r.ok)throw Error(`Anvisa respondeu ${r.status}`);return r;})).arrayBuffer()):readFileSync(src);
 const root=new URL('../../',import.meta.url);
 const acervo=JSON.parse(readFileSync(new URL('public/dados/medicacoes.json',root))).map(m=>m.n);
 const {INTERACTION_DRUGS}=await import('../../shared/interactions.mjs');
 const data=build(decode(buf),[...new Set([...acervo,...INTERACTION_DRUGS])]);
 if(data.registrosValidos<1000)throw Error(`Só ${data.registrosValidos} registros válidos: arquivo incompleto? Nada foi gravado.`);
 writeFileSync(new URL('public/dados/anvisa.json',root),JSON.stringify(data));
 console.log(`${data.registrosValidos} registros válidos; ${Object.keys(data.meds).length} princípios do acervo com produtos → public/dados/anvisa.json`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exit(1);});
