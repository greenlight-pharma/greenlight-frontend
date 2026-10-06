import catalog from './catalog.json';
export type QuestionId = number|string;
export type Question = {n:QuestionId;banca:string;especialidade:string;tema:string;subtemas:string[];dificuldade:string;temImagem:boolean;enunciado:string;alternativas:Record<string,string>;gabarito:string;explicacao:string;version?:string;hint?:string;rationales?:Record<string,string>;illustration?:any;provenance?:any;source?:any;review?:any};
export const questions = catalog as Question[];
export const LEGACY_KEY='vytal-banco-ad1-usp-2026';
export type Progress = Record<string,{answer:string;correct:boolean}>;
export type Session = {ids:QuestionId[];index:number;answers:Record<string,string>;finished:boolean;runId?:string;versions?:Record<string,string>};
export type Filters={area:string;bank:string;search:string;status:string;difficulty:string;imageOnly:boolean};
export const emptyFilters:Filters={area:'',bank:'',search:'',status:'',difficulty:'',imageOnly:false};
export function createQuestionModel(questions:Question[]) {
const byId = new Map(questions.map(q=>[q.n,q]));



const areas=questions.some(q=>typeof q.n==='string')?[...new Set(questions.map(q=>q.especialidade))]:['Clínica Médica','Cirurgia','Pediatria','Ginecologia e Obstetrícia','Medicina de Família e Preventiva'];
function areaOf(q:Question) {return q.especialidade==='GO'?'Ginecologia e Obstetrícia':/Preventiva|MFC/.test(q.especialidade)?areas[4]:q.especialidade;}
function cleanProgress(value:unknown):Progress {
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  const out:Progress={};
  for(const [id,entry] of Object.entries(value)) {
    const q=questions.find(q=>String(q.n)===id);
    if(!q||String(q.n)!==id||!entry||typeof entry!=='object')continue;
    const answer=(entry as {answer?:unknown}).answer;
    if(typeof answer==='string'&&Object.prototype.hasOwnProperty.call(q.alternativas,answer))out[id]={answer,correct:answer===q.gabarito};
  }
  return out;
}
function parseBackup(text:string) {
  if(text.length>2_000_000)throw Error('O arquivo é muito grande. Use um arquivo de progresso do Vytal.');
  const value=JSON.parse(text);
  if(value?.format!=='vytal-questions'||value.version!==1)throw Error('Escolha um arquivo de progresso exportado pelo Vytal.');
  const progress=cleanProgress(value.progress);
  const bookmarks=cleanBookmarks(value.bookmarks);
  if(!Object.keys(progress).length&&!bookmarks.length)throw Error('O arquivo não contém respostas ou questões salvas válidas.');
  return {progress,bookmarks};
}
function cleanBookmarks(value:unknown):QuestionId[] {return Array.isArray(value)?[...new Set(value.filter((id):id is QuestionId=>byId.has(id)))]:[];}
function cleanSession(value:unknown):Session|null {
  const s=value as Session;
  if(!s||!Array.isArray(s.ids)||!s.ids.length||s.ids.length>questions.length||s.ids.some(id=>!byId.has(id))||new Set(s.ids).size!==s.ids.length)return null;
  if(questions.some(q=>q.version)&&s.ids.some(id=>s.versions?.[id]!==byId.get(id)?.version))return null;
  const valid=cleanProgress(s.answers&&typeof s.answers==='object'?Object.fromEntries(Object.entries(s.answers).map(([id,answer])=>[id,{answer}])):{});
  return {ids:s.ids,index:Math.max(0,Math.min(Number.isInteger(s.index)?s.index:0,s.ids.length-1)),answers:Object.fromEntries(Object.entries(valid).filter(([id])=>s.ids.some(qid=>String(qid)===id)).map(([id,p])=>[id,p.answer])),finished:s.finished===true,runId:typeof s.runId==='string'?s.runId:undefined,versions:s.versions};
}
function sessionResult(session:Session) {
  const answered=session.ids.filter(id=>Object.prototype.hasOwnProperty.call(session.answers,String(id)));
  const correct=answered.filter(id=>session.answers[id]===byId.get(id)?.gabarito).length;
  return {total:session.ids.length,answered:answered.length,correct,review:answered.length-correct,unanswered:session.ids.length-answered.length};
}


const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filterQuestions(filters:Filters,progress:Progress,bookmarks:number[]) {
 const search=normalize(filters.search.trim());
 return questions.filter(q=>(!filters.area||areaOf(q)===filters.area)&&(!filters.bank||q.banca===filters.bank)&&(!filters.difficulty||q.dificuldade===filters.difficulty)&&(!filters.imageOnly||q.temImagem)&&(!search||normalize([q.tema,q.enunciado,...q.subtemas].join(' ')).includes(search))&&(!filters.status||(filters.status==='new'&&!progress[q.n])||(filters.status==='review'&&progress[q.n]?.correct===false)||(filters.status==='done'&&!!progress[q.n])||(filters.status==='saved'&&bookmarks.includes(q.n))));
}

return {questions,byId,areas,areaOf,cleanProgress,parseBackup,cleanBookmarks,cleanSession,sessionResult,filterQuestions};
}
export const {byId,areas,areaOf,cleanProgress,parseBackup,cleanBookmarks,cleanSession,sessionResult,filterQuestions}=createQuestionModel(questions);
