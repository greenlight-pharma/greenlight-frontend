// Banco WMed (Postgres no Railway). DATABASE_URL obrigatória; SSL ligado fora do localhost.
import pg from 'pg';
let pool=null;
export function db(){
 if(pool)return pool;
 const url=process.env.DATABASE_URL;
 if(!url)throw Object.assign(Error('DATABASE_URL não configurada.'),{code:'NO_DB'});
 const local=/@(localhost|127\.0\.0\.1)[:/]/.test(url);
 pool=new pg.Pool({connectionString:url,max:Number(process.env.DATABASE_POOL_MAX||3),idleTimeoutMillis:10000,
  ssl:process.env.DATABASE_SSL==='false'||local?false:{rejectUnauthorized:process.env.DATABASE_SSL_STRICT==='true'}});
 return pool;
}
export const query=(text,params)=>db().query(text,params);
export async function tx(fn){const c=await db().connect();try{await c.query('begin');const r=await fn(c);await c.query('commit');return r;}catch(e){await c.query('rollback').catch(()=>{});throw e;}finally{c.release();}}
// Testes: aponta para outro banco e fecha o pool.
export async function resetPool(){const p=pool;pool=null;if(p)await p.end();}
