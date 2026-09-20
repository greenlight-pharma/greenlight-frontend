import definitions from './personalizacao.json';
import type { Medicao } from '../familia/Pessoa';
export type Valor=string|number;
export type Campo={id:string;label:string;type:string;unit?:string;min?:number;max?:number;options?:string[]};
export type Especificacao={title:string;subtitle:string;action:string;agenda:string;accent:string;profileFields:Campo[];fields:Campo[];metric?:string;measurement?:string;workflow?:string};
export type RegistroCuidado={id:string;data:string;hora:string;valores:Record<string,Valor>};
export type Acompanhamento={perfil:Record<string,Valor>;registros:RegistroCuidado[]};
export const personalizacao=definitions as Record<string,Especificacao>;
export const vazio=():Acompanhamento=>({perfil:{},registros:[]});
export const ordenarRegistros=(xs:RegistroCuidado[])=>[...xs].sort((a,b)=>(b.data+b.hora).localeCompare(a.data+a.hora));
export const diasDesde=(inicio:string,hoje:string)=>{const n=(Date.parse(hoje+'T12:00:00Z')-Date.parse(inicio+'T12:00:00Z'))/86400000;return Number.isFinite(n)?Math.round(n):null;};
export function limparValores(values:Record<string,Valor>){return Object.fromEntries(Object.entries(values).filter(([,v])=>v!==''));}
export function serieMedicoes(xs:Medicao[],tipo:string){return xs.filter(m=>m.tipo===tipo&&Number.isFinite(Date.parse(m.medidoEm))).filter(m=>tipo==='pressao'?m.sistolica!=null&&m.diastolica!=null&&Number.isFinite(Number(m.sistolica))&&Number.isFinite(Number(m.diastolica)):m.valor!=null&&m.valor!==''&&Number.isFinite(Number(m.valor))).sort((a,b)=>a.medidoEm.localeCompare(b.medidoEm)).slice(-12).map(m=>({date:m.medidoEm,values:tipo==='pressao'?[Number(m.sistolica),Number(m.diastolica)]:[Number(m.valor)]}));}
export function serieRegistros(xs:RegistroCuidado[],key:string){return ordenarRegistros(xs).reverse().filter(r=>typeof r.valores[key]==='number').slice(-12).map(r=>({date:r.data+'T'+r.hora+':00-03:00',values:[Number(r.valores[key])]}));}
