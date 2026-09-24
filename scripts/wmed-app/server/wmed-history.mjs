// Histórico de conversas das contas WMed (mesmo contrato do histórico anterior: list/open/save).
import {query} from './db.mjs';
import {sessionUser} from './accounts.mjs';
import {noStore,json,L,langOf,allowWrite,readJson} from './http.mjs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function validHistory(b){
 if(!['list','open','save'].includes(b.action))return false;
 if((b.action==='open'||b.id!=null)&&!UUID.test(b.id||''))return false;
 if(b.action==='save'&&(!Array.isArray(b.messages)||!b.messages.length||b.messages.length>200||b.messages.some(m=>!['user','assistant'].includes(m?.papel)||typeof m.conteudo!=='string'||!m.conteudo.trim()||m.conteudo.length>20000)))return false;
 return true;
}
const titleOf=messages=>(messages.find(m=>m.papel==='user')?.conteudo||'Conversa').replace(/\s+/g,' ').trim().slice(0,80);

export async function history(req,res){
 noStore(res);const lang=langOf(req);
 if(req.method!=='POST')return json(res,405,{error:L(lang,'Método não permitido.','Method not allowed.')});
 if(!allowWrite(req,res))return;
 let b;try{b=await readJson(req,1000000);if(!validHistory(b))throw Error();}
 catch{return json(res,400,{error:L(lang,'A conversa excedeu o limite de salvamento ou contém dados inválidos. Copie o texto antes de sair.','The chat exceeded the save limit or contains invalid data. Copy the text before leaving.')});}
 try{
  const user=await sessionUser(req);
  if(!user)return json(res,401,{error:L(lang,'Entre para acessar seu histórico.','Sign in to access your history.')});
  if(b.action==='list'){
   const {rows}=await query('select id,title,updated_at,jsonb_array_length(messages) as n from conversations where user_id=$1 order by updated_at desc limit 50',[user.id]);
   return json(res,200,rows.map(r=>({id:r.id,titulo:r.title,updatedAt:r.updated_at,mensagens:r.n})));
  }
  if(b.action==='open'){
   const {rows}=await query('select id,messages from conversations where id=$1 and user_id=$2',[b.id,user.id]);
   if(!rows[0])return json(res,404,{error:L(lang,'Conversa não encontrada nesta conta.','Chat not found in this account.')});
   return json(res,200,{id:rows[0].id,mensagens:rows[0].messages});
  }
  const messages=b.messages.map(({papel,conteudo})=>({papel,conteudo}));
  if(b.id){
   const {rows}=await query('update conversations set messages=$1,title=$2,updated_at=now() where id=$3 and user_id=$4 returning id',[JSON.stringify(messages),titleOf(messages),b.id,user.id]);
   if(!rows[0])return json(res,404,{error:L(lang,'Conversa não encontrada nesta conta.','Chat not found in this account.')});
   return json(res,200,{id:rows[0].id});
  }
  const {rows}=await query('insert into conversations(user_id,title,messages) values($1,$2,$3) returning id',[user.id,titleOf(messages),JSON.stringify(messages)]);
  return json(res,200,{id:rows[0].id});
 }catch{return json(res,503,{error:L(lang,'Não foi possível salvar ou carregar. Sua conversa permanece nesta tela.','Could not save or load. Your chat stays on this screen.')});}
}
