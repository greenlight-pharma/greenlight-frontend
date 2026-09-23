import catalog from './catalog.json';
export type Question = {n:number;banca:string;especialidade:string;tema:string;subtemas:string[];dificuldade:string;temImagem:boolean;enunciado:string;alternativas:Record<string,string>;gabarito:string;explicacao:string};
export const questions = catalog as Question[];
export const byId = new Map(questions.map(q=>[q.n,q]));
export const LEGACY_KEY='vytal-banco-ad1-usp-2026';
export type Progress = Record<string,{answer:string;correct:boolean}>;
export type Session = {ids:number[];index:number;answers:Record<string,string>;finished:boolean};
export const areas=['Clínica Médica','Cirurgia','Pediatria','Ginecologia e Obstetrícia','Medicina de Família e Preventiva'];
export function areaOf(q:Question) {return q.especialidade==='GO'?'Ginecologia e Obstetrícia':/Preventiva|MFC/.test(q.especialidade)?areas[4]:q.especialidade;}
export function cleanProgress(value:unknown):Progress {
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  const out:Progress={};
  for(const [id,entry] of Object.entries(value)) {
    const q=byId.get(Number(id));
    if(!q||String(q.n)!==id||!entry||typeof entry!=='object')continue;
    const answer=(entry as {answer?:unknown}).answer;
    if(typeof answer==='string'&&Object.prototype.hasOwnProperty.call(q.alternativas,answer))out[id]={answer,correct:answer===q.gabarito};
  }
  return out;
}
export function parseBackup(text:string) {
  if(text.length>2_000_000)throw Error('O arquivo é muito grande. Use um arquivo de progresso do Vytal.');
  const value=JSON.parse(text);
  if(value?.format!=='vytal-questions'||value.version!==1)throw Error('Escolha um arquivo de progresso exportado pelo Vytal.');
  const progress=cleanProgress(value.progress);
  const bookmarks=cleanBookmarks(value.bookmarks);
  if(!Object.keys(progress).length&&!bookmarks.length)throw Error('O arquivo não contém respostas ou questões salvas válidas.');
  return {progress,bookmarks};
}
export function cleanBookmarks(value:unknown):number[] {return Array.isArray(value)?[...new Set(value.filter((id):id is number=>typeof id==='number'&&byId.has(id)))]:[];}
export function cleanSession(value:unknown):Session|null {
  const s=value as Session;
  if(!s||!Array.isArray(s.ids)||!s.ids.length||s.ids.length>770||s.ids.some(id=>!byId.has(id))||new Set(s.ids).size!==s.ids.length)return null;
  const valid=cleanProgress(s.answers&&typeof s.answers==='object'?Object.fromEntries(Object.entries(s.answers).map(([id,answer])=>[id,{answer}])):{});
  return {ids:s.ids,index:Math.max(0,Math.min(Number.isInteger(s.index)?s.index:0,s.ids.length-1)),answers:Object.fromEntries(Object.entries(valid).filter(([id])=>s.ids.includes(Number(id))).map(([id,p])=>[id,p.answer])),finished:s.finished===true};
}
export function sessionResult(session:Session) {
  const answered=session.ids.filter(id=>Object.prototype.hasOwnProperty.call(session.answers,String(id)));
  const correct=answered.filter(id=>session.answers[id]===byId.get(id)?.gabarito).length;
  return {total:session.ids.length,answered:answered.length,correct,review:answered.length-correct,unanswered:session.ids.length-answered.length};
}
export type Filters={area:string;bank:string;search:string;status:string;difficulty:string;imageOnly:boolean};
export const emptyFilters:Filters={area:'',bank:'',search:'',status:'',difficulty:'',imageOnly:false};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterQuestions(filters:Filters,progress:Progress,bookmarks:number[]) {
 const search=normalize(filters.search.trim());
 return questions.filter(q=>(!filters.area||areaOf(q)===filters.area)&&(!filters.bank||q.banca===filters.bank)&&(!filters.difficulty||q.dificuldade===filters.difficulty)&&(!filters.imageOnly||q.temImagem)&&(!search||normalize([q.tema,q.enunciado,...q.subtemas].join(' ')).includes(search))&&(!filters.status||(filters.status==='new'&&!progress[q.n])||(filters.status==='review'&&progress[q.n]?.correct===false)||(filters.status==='done'&&!!progress[q.n])||(filters.status==='saved'&&bookmarks.includes(q.n))));
}
