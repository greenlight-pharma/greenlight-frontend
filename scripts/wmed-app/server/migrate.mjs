// Aplica server/migrations/*.sql em ordem, uma vez cada. Uso: DATABASE_URL=… npm run migrate
import {readdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {db,tx,resetPool} from './db.mjs';
const dir=new URL('./migrations/',import.meta.url);
export async function migrate(log=console.log){
 await db().query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())');
 const done=new Set((await db().query('select name from schema_migrations')).rows.map(r=>r.name));
 for(const name of readdirSync(dir).filter(f=>f.endsWith('.sql')).sort()){
  if(done.has(name))continue;
  await tx(async c=>{await c.query(readFileSync(new URL(name,dir),'utf8'));await c.query('insert into schema_migrations(name) values($1)',[name]);});
  log(`migração aplicada: ${name}`);
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url)){migrate().then(()=>resetPool()).catch(e=>{console.error(e.message);process.exit(1);});}
