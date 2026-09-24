-- Contas WMed, sessões, uso diário, histórico de conversas e assinaturas.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  password_hash text not null,
  locale text not null default 'pt' check (locale in ('pt','en')),
  plan text not null default 'free' check (plan in ('free','pro')),
  terms_accepted_at timestamptz,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists users_email_key on users (lower(email));

create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  user_agent text
);
create index if not exists sessions_user_idx on sessions (user_id);
create index if not exists sessions_expiry_idx on sessions (expires_at);

create table if not exists auth_attempts (
  key text primary key,
  window_start timestamptz not null,
  count integer not null
);

create table if not exists daily_usage (
  user_id uuid not null references users(id) on delete cascade,
  day date not null,
  chat_messages integer not null default 0,
  primary key (user_id, day)
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  messages jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conversations_user_idx on conversations (user_id, updated_at desc);

-- Preenchida pelos webhooks de cobrança (Stripe no exterior, Pagar.me no Brasil) na fase C.
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null check (provider in ('stripe','pagarme')),
  external_id text not null,
  plan text not null check (plan in ('pro')),
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_id)
);
create index if not exists subscriptions_user_idx on subscriptions (user_id);
