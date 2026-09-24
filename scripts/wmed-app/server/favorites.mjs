// Favoritos e anotações da conta WMed. POST {action:'list'} | {action:'save', kind, ref, title, href, favorite, note}.
// Um item sem favorito e sem anotação é apagado.
import {query} from './db.mjs';
import {sessionUser} from './accounts.mjs';
import {noStore,json,L,langOf,allowWrite,readJson} from './http.mjs';

export function validItem(b){
 return /^[a-z]{2,20}$/.test(b.kind||'')&&typeof b.ref==='string'&&b.ref.length>=1&&b.ref.length<=120
  &&typeof b.title==='string'&&b.title.trim().length>=1&&b.title.length<=200
  &&typeof b.href==='string'&&/^#[a-z0-9-]+(\?[\w=&%:.-]*)?$/i.test(b.href)&&b.href.length<=200
  &&typeof b.favorite==='boolean'&&typeof b.note==='string'&&b.note.length<=5000;
}
export async function favorites(req,res){
 noStore(res);const lang=langOf(req);
 if(req.method!=='POST')return json(res,405,{error:L(lang,'Método não permitido.','Method not allowed.')});
 if(!allowWrite(req,res))return;
 let b;try{b=await readJson(req,16000);if(!(b.action==='list'||(b.action==='save'&&validItem(b))))throw Error();}
 catch{return json(res,400,{error:L(lang,'Anotação inválida ou longa demais (até 5.000 caracteres).','Invalid or too long note (up to 5,000 characters).')});}
 try{
  const user=await sessionUser(req);
  if(!user)return json(res,401,{error:L(lang,'Entre na sua conta para salvar favoritos e anotações.','Sign in to save favorites and notes.'),code:'AUTH_REQUIRED'});
  if(b.action==='list'){
   const {rows}=await query('select kind,ref,title,href,favorite,note,updated_at from favorites where user_id=$1 order by updated_at desc limit 1000',[user.id]);
   return json(res,200,rows.map(r=>({kind:r.kind,ref:r.ref,title:r.title,href:r.href,favorite:r.favorite,note:r.note,updatedAt:r.updated_at})));
  }
  const note=b.note.trim();
  if(!b.favorite&&!note){await query('delete from favorites where user_id=$1 and kind=$2 and ref=$3',[user.id,b.kind,b.ref]);return json(res,200,{saved:false});}
  await query(`insert into favorites(user_id,kind,ref,title,href,favorite,note) values($1,$2,$3,$4,$5,$6,$7)
   on conflict(user_id,kind,ref) do update set title=excluded.title,href=excluded.href,favorite=excluded.favorite,note=excluded.note,updated_at=now()`,
   [user.id,b.kind,b.ref,b.title.trim(),b.href,b.favorite,note]);
  return json(res,200,{saved:true});
 }catch{return json(res,503,{error:L(lang,'Não foi possível salvar agora. Tente novamente.','Could not save right now. Please try again.')});}
}
