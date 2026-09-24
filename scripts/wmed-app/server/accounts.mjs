// Contas WMed: cadastro, entrada, sessão por cookie HttpOnly e saída.
// Senhas com scrypt (node:crypto); sessões guardadas como hash SHA-256 do token (o token só existe no cookie).
import {randomBytes,scrypt as scryptCb,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {query} from './db.mjs';
import {noStore,json,L,langOf,allowWrite,readJson,clientIp} from './http.mjs';

const scrypt=promisify(scryptCb);
export const COOKIE='__Host-wmed_session';
const SESSION_DAYS=30,N=16384,R=8,P=1,KEYLEN=64;
const sha256=s=>createHash('sha256').update(s).digest('hex');

export async function hashPassword(password){
 const salt=randomBytes(16),key=await scrypt(password.normalize('NFKC'),salt,KEYLEN,{N,r:R,p:P,maxmem:64*1024*1024});
 return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}
export async function verifyPassword(password,stored){
 const [kind,n,r,p,salt,hash]=String(stored).split('$');
 if(kind!=='scrypt'||!salt||!hash)return false;
 const expected=Buffer.from(hash,'base64');
 const key=await scrypt(password.normalize('NFKC'),Buffer.from(salt,'base64'),expected.length,{N:+n,r:+r,p:+p,maxmem:64*1024*1024});
 return key.length===expected.length&&timingSafeEqual(key,expected);
}
// Hash de uma senha qualquer: iguala o tempo de resposta quando o e-mail não existe.
let DUMMY=null;const dummy=async()=>DUMMY??=await hashPassword(randomBytes(12).toString('hex'));

export const progressScope=id=>createHash('sha256').update('wmed-progress:'+id).digest('hex');
export function publicUser(u){return {nome:u.name.split(' ')[0].slice(0,60),email:u.email,plan:u.effective_plan||u.plan,locale:u.locale,progressScope:progressScope(u.id)};}

function tokenFrom(req){
 const raw=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
 return raw&&/^[A-Za-z0-9_-]{43}$/.test(raw)?raw:null;
}
// Usuário da sessão (com plano efetivo: plano da conta ou assinatura ativa) ou null.
const EFFECTIVE_PLAN=`case when u.plan='pro' or exists(select 1 from subscriptions s where s.user_id=u.id and s.status in ('active','trialing') and (s.current_period_end is null or s.current_period_end>now())) then 'pro' else 'free' end as effective_plan`;
export async function sessionUser(req){
 const token=tokenFrom(req);if(!token)return null;
 const {rows}=await query(`select u.*, ${EFFECTIVE_PLAN} from sessions x join users u on u.id=x.user_id where x.token_hash=$1 and x.expires_at>now()`,[sha256(token)]);
 return rows[0]||null;
}
const userById=async id=>(await query(`select u.*, ${EFFECTIVE_PLAN} from users u where u.id=$1`,[id])).rows[0];
async function startSession(res,userId,req){
 const token=randomBytes(32).toString('base64url');
 await query('insert into sessions(token_hash,user_id,expires_at,user_agent) values($1,$2,now()+make_interval(days=>$3),$4)',[sha256(token),userId,SESSION_DAYS,String(req.headers['user-agent']||'').slice(0,300)]);
 res.setHeader('Set-Cookie',`${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS*86400}`);
}
const clearCookie=res=>res.setHeader('Set-Cookie',`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

// Limite de tentativas no banco (vale entre instâncias serverless): max por janela de 15 min.
async function allowAttempt(key,max){
 const {rows}=await query(`insert into auth_attempts(key,window_start,count) values($1,now(),1)
  on conflict(key) do update set count=case when auth_attempts.window_start<now()-interval '15 minutes' then 1 else auth_attempts.count+1 end,
   window_start=case when auth_attempts.window_start<now()-interval '15 minutes' then now() else auth_attempts.window_start end
  returning count`,[key]);
 return rows[0].count<=max;
}

const EMAIL=/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;
export async function auth(req,res){
 noStore(res);const lang=langOf(req);
 try{
  if(req.method==='GET'){const u=await sessionUser(req);return json(res,200,u?{authenticated:true,user:publicUser(u)}:{authenticated:false});}
  if(!['POST','DELETE'].includes(req.method))return json(res,405,{error:L(lang,'Método não permitido.','Method not allowed.')});
  if(!allowWrite(req,res))return;
  if(req.method==='DELETE'){const t=tokenFrom(req);if(t)await query('delete from sessions where token_hash=$1',[sha256(t)]);clearCookie(res);return json(res,200,{authenticated:false});}
  let b;try{b=await readJson(req,8192);}catch{return json(res,400,{error:L(lang,'Pedido inválido.','Invalid request.')});}
  const email=typeof b.email==='string'?b.email.trim().toLowerCase():'',password=typeof b.password==='string'?b.password:'';
  if(!EMAIL.test(email)||email.length>254)return json(res,400,{error:L(lang,'Informe um e-mail válido.','Enter a valid email.')});
  if(!await allowAttempt('ip:'+clientIp(req),30)||!await allowAttempt('email:'+email,10))return json(res,429,{error:L(lang,'Muitas tentativas. Aguarde alguns minutos.','Too many attempts. Wait a few minutes.')});
  if(b.action==='signup'){
   const name=typeof b.name==='string'?b.name.trim().replace(/\s+/g,' '):'';
   if(name.length<2||name.length>80)return json(res,400,{error:L(lang,'Informe seu nome.','Enter your name.')});
   if(password.length<10||password.length>200)return json(res,400,{error:L(lang,'A senha deve ter de 10 a 200 caracteres.','Password must be 10 to 200 characters.')});
   if(b.acceptTerms!==true)return json(res,400,{error:L(lang,'Aceite os termos de uso e a política de privacidade para criar a conta.','Accept the terms of use and privacy policy to create an account.')});
   const locale=b.locale==='en'?'en':'pt';
   const {rows}=await query(`insert into users(email,name,password_hash,locale,terms_accepted_at) values($1,$2,$3,$4,now())
    on conflict ((lower(email))) do nothing returning *`,[email,name,await hashPassword(password),locale]);
   if(!rows[0])return json(res,409,{error:L(lang,'Já existe uma conta com este e-mail. Entre com sua senha.','An account with this email already exists. Sign in with your password.')});
   await startSession(res,rows[0].id,req);
   return json(res,201,{authenticated:true,user:publicUser(rows[0])});
  }
  if(b.action==='login'){
   const {rows}=await query('select * from users where lower(email)=$1',[email]);
   const ok=rows[0]?await verifyPassword(password,rows[0].password_hash):(await verifyPassword(password,await dummy()),false);
   if(!ok||!password)return json(res,401,{error:L(lang,'E-mail ou senha incorretos.','Incorrect email or password.')});
   await startSession(res,rows[0].id,req);
   return json(res,200,{authenticated:true,user:publicUser(await userById(rows[0].id))});
  }
  return json(res,400,{error:L(lang,'Pedido inválido.','Invalid request.')});
 }catch(e){
  return json(res,503,{error:e.code==='NO_DB'?L(lang,'Contas WMed ainda não configuradas neste ambiente.','WMed accounts are not configured in this environment yet.'):L(lang,'Não foi possível acessar sua conta agora. Tente novamente.','Could not reach your account right now. Please try again.')});
 }
}
