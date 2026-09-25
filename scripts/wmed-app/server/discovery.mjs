// Public metadata only: no model, session data, contact details or paid API calls.
import {retrieve,cleanText} from './research.mjs';
export function discoveryInput(raw){
 if(!raw||typeof raw.query!=='string'||raw.query.trim().length<3||raw.query.length>160||!['articles','trials'].includes(raw.kind))throw Error('INVALID_INPUT');
 const query=raw.query.trim().replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();
 if(query.length<3)throw Error('INVALID_INPUT');
 return {query,kind:raw.kind};
}
export async function searchTrials(query,{fetchImpl=fetch,signal}={}){
 const url=new URL('https://clinicaltrials.gov/api/v2/studies');
 url.search=new URLSearchParams({'query.cond':query,pageSize:'8',format:'json',sort:'LastUpdatePostDate:desc',fields:'NCTId,BriefTitle,OverallStatus,BriefSummary,Phase,LocationCountry,LastUpdatePostDate',countTotal:'true'}).toString();
 const r=await fetchImpl(url,{redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000)});
 if(!r.ok)throw Error('UPSTREAM');const data=await r.json();if(!Array.isArray(data.studies))throw Error('UPSTREAM');
 return {total:data.totalCount??data.studies.length,items:data.studies.flatMap(study=>{
  const p=study.protocolSection,id=p?.identificationModule?.nctId,title=p?.identificationModule?.briefTitle;
  if(!/^NCT\d{8}$/.test(id)||typeof title!=='string')return [];
  return [{id,title:cleanText(title),url:`https://clinicaltrials.gov/study/${id}`,status:cleanText(p.statusModule?.overallStatus||''),updated:cleanText(p.statusModule?.lastUpdatePostDateStruct?.date||''),summary:cleanText(p.descriptionModule?.briefSummary||'').slice(0,900),phases:(p.designModule?.phases||[]).map(cleanText),countries:[...new Set((p.contactsLocationsModule?.locations||[]).map(x=>cleanText(x.country||'')).filter(Boolean))].slice(0,30)}];
 })};
}
const buckets=new Map();
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
export async function discovery(req,res,{fetchImpl=fetch,articleSearch=retrieve,now=Date.now}={}){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return json(res,405,{code:'METHOD'});
 let origin;try{origin=new URL(req.headers.origin);}catch{return json(res,403,{code:'ORIGIN'});}
 if(origin.host!==req.headers.host||req.headers['x-wmed-request']!=='1')return json(res,403,{code:'ORIGIN'});
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,80);
 for(const[k,v]of buckets)if(v.until<now())buckets.delete(k);
 const bucket=buckets.get(ip)||{n:0,until:now()+60000};
 if(bucket.n>=12||(buckets.size>=5000&&!buckets.has(ip)))return json(res,429,{code:'RATE_LIMIT'});
 bucket.n++;buckets.set(ip,bucket);
 let input;try{let raw=req.body;if(raw==null){raw='';for await(const c of req){raw+=c;if(Buffer.byteLength(raw)>2048)return json(res,413,{code:'SIZE'});}}if(typeof raw==='string'||Buffer.isBuffer(raw)){if(Buffer.byteLength(raw)>2048)return json(res,413,{code:'SIZE'});raw=JSON.parse(String(raw));}input=discoveryInput(raw);}catch{return json(res,400,{code:'INPUT'});}
 const abort=new AbortController();res.on('close',()=>abort.abort());
 try{
  let result;
  if(input.kind==='trials')result=await searchTrials(input.query,{fetchImpl,signal:abort.signal});
  else {const found=await articleSearch(input.query,{fetchImpl,signal:abort.signal});result={query:found.query,total:found.total,items:found.sources.map(({abstract,...source})=>({...source,summary:abstract.slice(0,900)}))};}
  if(!res.destroyed)json(res,200,{...result,kind:input.kind,retrievedAt:new Date(now()).toISOString()});
 }catch{if(!res.destroyed)json(res,502,{code:'SEARCH_UNAVAILABLE'});}
}
