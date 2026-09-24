-- Favoritos e anotações por conta. kind + ref identificam o conteúdo (ex.: score/glasgow, med/amoxicilina, cid/I50, topic/usmle:cardio:0).
create table if not exists favorites (
  user_id uuid not null references users(id) on delete cascade,
  kind text not null check (kind ~ '^[a-z]{2,20}$'),
  ref text not null check (length(ref) between 1 and 120),
  title text not null check (length(title) between 1 and 200),
  href text not null check (length(href) between 1 and 200),
  favorite boolean not null default false,
  note text not null default '' check (length(note) <= 5000),
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, ref)
);
create index if not exists favorites_user_idx on favorites (user_id, updated_at desc);
