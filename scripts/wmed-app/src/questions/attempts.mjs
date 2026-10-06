// Local, catalog/account-scoped ledger. No network or analytics SDK.
export function catalogStorageKey(scope,catalogId){
 if(!/^[a-z0-9-]{1,60}$/.test(catalogId))throw Error('Invalid catalog namespace');
 const owner=typeof scope==='string'&&/^[a-f0-9]{64}$/.test(scope)?scope:'guest';
 return `2doctor:qbank:${catalogId}:${owner}`;
}
export function emptyLedger(catalogId){return {schema:1,catalogId,attempts:[],archived:[],drafts:{}};}
const token=q=>`${q.n}@${q.version}`;
const archive=a=>({id:a.id,questionId:a.questionId,version:a.version,answer:String(a.answer||'').slice(0,2),correct:a.correct===true,hinted:a.hinted===true,activeMs:Math.max(0,Math.min(86400000,Number(a.activeMs)||0)),mode:a.mode==='exam'?'exam':'study'});
const draftKey=(q,mode)=>`${mode}:${token(q)}`;
export function cleanLedger(raw,catalogId,questions){
 const out=emptyLedger(catalogId);if(raw?.schema!==1||raw.catalogId!==catalogId)return out;
 out.archived=Array.isArray(raw.archived)?raw.archived.filter(a=>typeof a?.id==='string'&&typeof a?.version==='string'&&questions.some(q=>q.n===a.questionId)).map(archive):[];
 const valid=new Map(questions.map(q=>[token(q),q]));const seen=new Set();
 for(const a of Array.isArray(raw.attempts)?raw.attempts:[]){
  const q=valid.get(`${a.questionId}@${a.version}`);
  if(!q&&questions.some(q=>q.n===a.questionId)&&typeof a.id==='string'&&typeof a.version==='string'){if(!out.archived.some(old=>old.id===a.id))out.archived.push(archive(a));continue;}
  if(!q||typeof a.id!=='string'||a.id.length>160||seen.has(a.id)||!Object.hasOwn(q.alternativas,a.answer)||!['study','exam'].includes(a.mode))continue;
  seen.add(a.id);out.attempts.push({id:a.id,questionId:q.n,version:q.version,answer:a.answer,correct:a.answer===q.gabarito,hinted:a.hinted===true,activeMs:Math.max(0,Math.min(86400000,Number(a.activeMs)||0)),mode:a.mode});
 }
 for(const [key,d] of Object.entries(raw.drafts||{}))if(valid.has(key.replace(/^(study|exam):/,''))&&/^(study|exam):/.test(key)&&d&&typeof d==='object')out.drafts[key]={hinted:d.hinted===true,activeMs:Math.max(0,Math.min(86400000,Number(d.activeMs)||0))};
 return out;
}
export function track(ledger,q,{hint=false,elapsed=0,mode='study'}={}){
 const key=draftKey(q,mode),d=ledger.drafts[key]||{hinted:false,activeMs:0};
 return {...ledger,drafts:{...ledger.drafts,[key]:{hinted:mode==='study'&&(d.hinted||hint),activeMs:d.activeMs+Math.max(0,Math.min(2000,elapsed))}}};
}
export function record(ledger,q,{id,answer,mode}){
 if(ledger.attempts.some(a=>a.id===id)||!Object.hasOwn(q.alternativas,answer))return ledger;
 const key=draftKey(q,mode),d=ledger.drafts[key]||{hinted:false,activeMs:0};
 const a={id,questionId:q.n,version:q.version,answer,correct:answer===q.gabarito,hinted:mode==='study'&&d.hinted,activeMs:d.activeMs,mode};
 const drafts={...ledger.drafts};delete drafts[key];return {...ledger,attempts:[...ledger.attempts,a],drafts};
}
export function firstAttempts(ledger){const map=new Map();for(const a of ledger.attempts)if(!map.has(`${a.questionId}@${a.version}`))map.set(`${a.questionId}@${a.version}`,a);return [...map.values()];}
export function metrics(ledger){const first=firstAttempts(ledger);return {answered:first.length,correct:first.filter(a=>a.correct).length,unassisted:first.filter(a=>a.correct&&!a.hinted).length,assisted:first.filter(a=>a.hinted).length,assistedCorrect:first.filter(a=>a.correct&&a.hinted).length,wrong:first.filter(a=>!a.correct).length,activeMs:ledger.attempts.reduce((n,a)=>n+a.activeMs,0),attempts:ledger.attempts.length};}
export function reviewIds(ledger,kind){return firstAttempts(ledger).filter(a=>kind==='assisted'?a.hinted:!a.correct).map(a=>a.questionId);}
