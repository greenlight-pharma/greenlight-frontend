// Banco próprio do 2Doctor (Postgres no projeto 2doctor do Railway), separado da conta Vytal.
// Só o servidor do Railway carrega este módulo; o site da Vytal (Vercel) nunca o importa.
import pg from 'pg';

// Esquema idempotente: roda a cada subida do servidor. Mudanças futuras entram como novos
// comandos "if not exists"/"add column if not exists" no fim da lista, nunca editando os antigos.
export const SCHEMA = [
 `create table if not exists usuarios (
   id uuid primary key,
   email text not null unique,
   nome text,
   senha_hash text,
   google_sub text unique,
   email_verificado boolean not null default false,
   idioma text,
   pais text,
   criado_em timestamptz not null default now(),
   ultimo_acesso timestamptz
 )`,
 `create table if not exists sessoes (
   token_hash text primary key,
   usuario_id uuid not null references usuarios(id) on delete cascade,
   criada_em timestamptz not null default now(),
   expira_em timestamptz not null
 )`,
 `create index if not exists sessoes_usuario on sessoes(usuario_id)`,
 `create table if not exists tokens_email (
   token_hash text primary key,
   usuario_id uuid not null references usuarios(id) on delete cascade,
   tipo text not null check (tipo in ('verificar','redefinir')),
   expira_em timestamptz not null,
   usado_em timestamptz
 )`,
 `create table if not exists casos (
   id uuid primary key,
   usuario_id uuid not null references usuarios(id) on delete cascade,
   request_id text not null,
   titulo text not null,
   payload jsonb not null,
   feedback jsonb not null,
   criado_em timestamptz not null default now(),
   unique (usuario_id, request_id)
 )`,
 `create index if not exists casos_usuario on casos(usuario_id, criado_em desc)`,
 `create table if not exists conversas (
   id uuid primary key,
   usuario_id uuid not null references usuarios(id) on delete cascade,
   titulo text not null,
   mensagens jsonb not null,
   criada_em timestamptz not null default now(),
   atualizada_em timestamptz not null default now()
 )`,
 `create index if not exists conversas_usuario on conversas(usuario_id, atualizada_em desc)`,
 // Assinatura (Stripe). Pro só vale com status active/trialing/past_due (ver billing.isPro).
 `alter table usuarios add column if not exists plano text not null default 'gratis'`,
 `alter table usuarios add column if not exists stripe_customer_id text unique`,
 `alter table usuarios add column if not exists stripe_subscription_id text`,
 `alter table usuarios add column if not exists assinatura_status text`,
 `alter table usuarios add column if not exists assinatura_fim timestamptz`,
 `create table if not exists uso_diario (
   usuario_id uuid not null references usuarios(id) on delete cascade,
   dia date not null,
   tipo text not null,
   n integer not null default 0,
   primary key (usuario_id, dia, tipo)
 )`,
];

let pool = null, ready = null;
export function db() {
 if (!pool) {
  const url = process.env.DATABASE_URL;
  if (!url) throw Error('DATABASE_URL ausente.');
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  pool = new pg.Pool({ connectionString: url, max: 8, ssl: local || /sslmode=disable/.test(url) ? false : { rejectUnauthorized: false } });
 }
 return pool;
}
export function migrate() {
 ready ??= (async () => { for (const sql of SCHEMA) await db().query(sql); })().catch((e) => { ready = null; throw e; });
 return ready;
}
export async function q(sql, params) {
 await migrate();
 return db().query(sql, params);
}
export async function closeDb() { if (pool) { const p = pool; pool = null; ready = null; await p.end(); } }
