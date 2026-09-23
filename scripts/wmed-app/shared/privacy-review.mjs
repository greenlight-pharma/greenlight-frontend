import {detectAcademicPIIDetalhado} from './pii.mjs';
// This browser-only aid is deterministic, not OpenMed inference or a guarantee.
export function reviewPrivacy(text){
 const spans=[];
 const add=(re,label)=>{for(const m of text.matchAll(re)){const value=m[1]||m[0],start=m.index+m[0].indexOf(value);spans.push({start,end:start+value.length,label});}};
 add(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi,'e-mail');
 add(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,'documento');
 add(/(?:\+55\s*)?\(\d{2}\)\s*9?\d{4}[- ]?\d{4}\b/g,'telefone');
 add(/\b(?:telefone|celular|whatsapp)\s*[:=]?\s*(\+?[\d ()-]{10,20})/gi,'telefone');
 // Existing academic detector supplies further findings; preserve lengths/offsets.
 let masked=text;
 for(let n=0;n<40;n++){
  const finding=detectAcademicPIIDetalhado(masked);if(!finding)break;
  const start=masked.indexOf(finding.trecho);if(start<0)break;
  let end=start+finding.trecho.length,from=start;
  if(finding.tipo.includes('nome')){
   const prefix=/^(?:paciente|pcte\.?|sr\.?|sra\.?)\s+/i.exec(finding.trecho);if(prefix){from+=prefix[0].length;const name=/^[A-ZÀ-Ý][a-zà-ÿ]+(?:\s+(?:(?:da|de|do|dos|das)\s+)?[A-ZÀ-Ý][a-zà-ÿ]+){0,4}/.exec(text.slice(from));if(name)end=from+name[0].length;}
   // Keep the clinical age, if included in the detector's matching window.
   const age=/\s*,?\s*(?:de\s+)?\d{1,3}\s+anos?\b/i.exec(text.slice(from,end));if(age)end=from+age.index;
  }
  if(end>from)spans.push({start:from,end,label:finding.tipo});
  masked=masked.slice(0,start)+' '.repeat(finding.trecho.length)+masked.slice(start+finding.trecho.length);
 }
 spans.sort((a,b)=>a.start-b.start||b.end-a.end);
 const merged=[];for(const s of spans){const last=merged.at(-1);if(last&&s.start<last.end)last.end=Math.max(last.end,s.end);else merged.push({...s});}
 let result=text;for(const s of [...merged].reverse())result=result.slice(0,s.start)+'[dado removido]'+result.slice(s.end);
 return {spans:merged,text:result};
}
