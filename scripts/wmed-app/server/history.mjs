import {sessionToken,allowWrite} from './vytal-assistant.mjs';
const API='https://vytal-api-production.up.railway.app/estudante/tutor/conversas';
export async function history(req,res,{fetchImpl=fetch}={}){
 const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data));};
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return send(405,{error:'Método não permitido.'});
 if(!allowWrite(req,res))return;
 const token=sessionToken(req);if(!token)return send(401,{error:'Entre para acessar seu histórico.'});
 let b;
 try{
  b=req.body;if(b==null){b='';for await(const chunk of req){b+=chunk;if(Buffer.byteLength(b)>1000000)throw Error();}}
  if(typeof b==='string'||Buffer.isBuffer(b))b=JSON.parse(String(b));
  if(Buffer.byteLength(JSON.stringify(b))>1000000)throw Error();
  if(!['list','open','save'].includes(b.action))throw Error();
  if((b.action==='open'||b.id!=null)&&!(/^[a-zA-Z0-9_-]{1,100}$/.test(b.id||'')))throw Error();
  if(b.action==='save'&&(!Array.isArray(b.messages)||!b.messages.length||b.messages.length>200||b.messages.some(m=>!['user','assistant'].includes(m.papel)||typeof m.conteudo!=='string'||!m.conteudo.trim()||m.conteudo.length>20000)))throw Error();
 }catch{return send(400,{error:'A conversa excedeu o limite de salvamento ou contém dados inválidos. Copie o texto antes de sair.'});}
 try{
  const r=await fetchImpl(API+(b.action==='open'?'/'+encodeURIComponent(b.id):''),{method:b.action==='save'?'POST':'GET',headers:{Authorization:`Bearer ${token}`,...(b.action==='save'?{'Content-Type':'application/json'}:{})},...(b.action==='save'?{body:JSON.stringify({conversaId:b.id||null,mensagens:b.messages.map(({papel,conteudo})=>({papel,conteudo}))})}:{}),redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!r.ok)return send([401,403,429].includes(r.status)?r.status:502,{error:r.status===403?'Conversa indisponível para esta conta.':'Não foi possível acessar o histórico. Tente novamente.'});
  return send(200,await r.json());
 }catch{return send(503,{error:'Não foi possível salvar ou carregar. Sua conversa permanece nesta tela.'});}
}
