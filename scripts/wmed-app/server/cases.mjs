import {sessionToken,allowWrite} from './vytal-assistant.mjs';
import {caseSaveBody} from '../shared/case-storage.mjs';
const API='https://vytal-api-production.up.railway.app/estudante/casos';
export async function cases(req,res,{fetchImpl=fetch}={}) {
 const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data));};
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return send(405,{error:'Método não permitido.'});
 if(!allowWrite(req,res))return;
 const token=sessionToken(req);if(!token)return send(401,{error:'Entre para acessar seus casos.'});
 let b,body;
 try {
  b=req.body;if(b==null){b='';for await(const chunk of req){b+=chunk;if(Buffer.byteLength(b)>500000)throw Error('Caso muito grande.');}}
  if(typeof b==='string'||Buffer.isBuffer(b))b=JSON.parse(String(b));
  if(Buffer.byteLength(JSON.stringify(b))>500000)throw Error('Caso muito grande.');
  if(!['list','open','save'].includes(b?.action))throw Error('Operação inválida.');
  if(b.action==='open'&&!/^[a-zA-Z0-9_-]{1,100}$/.test(b.id||''))throw Error('Identificador inválido.');
  if(b.action==='list'&&(!Number.isInteger(b.page||1)||(b.page||1)<1||typeof (b.search||'')!=='string'||(b.search||'').length>200))throw Error('Busca inválida.');
  if(b.action==='save')body=caseSaveBody(b.snapshot);
 }catch(e){return send(400,{error:e.message||'Confira os dados do caso.'});}
 async function upstream(path='',value) {
  const r=await fetchImpl(API+path,{method:value?'POST':'GET',headers:{Authorization:`Bearer ${token}`,...(value?{'Content-Type':'application/json'}:{})},...(value?{body:JSON.stringify(value)}:{}),redirect:'error',signal:AbortSignal.timeout(90000)});
  if(!r.ok){const error=Error(r.status===401?'Sua sessão expirou. Entre novamente.':r.status===404?'Caso não encontrado.':r.status===403?'Caso indisponível para esta conta.':'Não foi possível acessar seus casos. Tente novamente.');error.status=r.status;throw error;}
  return r.json();
 }
 try {
  if(b.action==='open')return send(200,await upstream('/'+encodeURIComponent(b.id)));
  if(b.action==='list'){
   const q=new URLSearchParams({page:String(b.page||1),pageSize:'12',...(b.search?{busca:b.search}:{})});
   const d=await upstream('?'+q);
   return send(200,{casos:(d.casos||[]).map(c=>({id:c.id,titulo:c.titulo,createdAt:c.createdAt,score:c.payload?.wmed?.quality?.score??null})),paginacao:d.paginacao});
  }
  // Reconcile an earlier successful write whose response was lost. Search is scoped
  // to the authenticated account upstream; never trust an owner sent by the client.
  const q=new URLSearchParams({busca:body.payload.wmed.requestId,pageSize:'100'});
  const existing=await upstream('?'+q);
  const match=(existing.casos||[]).find(c=>c.payload?.wmed?.requestId===body.payload.wmed.requestId);
  if(match)return send(200,{caso:{id:match.id,titulo:match.titulo,createdAt:match.createdAt}});
  return send(200,await upstream('',body));
 }catch(e){return send([400,401,403,404,429].includes(e.status)?e.status:503,{error:e.message||'Não foi possível salvar. Mantenha esta tela aberta e tente novamente.'});}
}
