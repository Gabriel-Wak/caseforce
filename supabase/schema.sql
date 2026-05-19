-- Case Forge V3 - Supabase database
-- Cole tudo no Supabase SQL Editor e execute uma vez.
-- Economia 100% fictícia. Sem depósito, saque, dinheiro real ou apostas reais.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  coins integer not null default 650,
  tickets integer not null default 0,
  last_daily_reward date,
  mission_state jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{"openedCases":0,"rareDrops":0,"battlesPlayed":0,"tradesCompleted":0,"levelsGained":0}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  skin_id text not null,
  obtained_at timestamptz not null default now(),
  source text not null default 'case'
);

create table if not exists recent_wins (
  id text primary key,
  user_id uuid references profiles(id) on delete set null,
  user_name text not null,
  avatar text,
  skin_id text not null,
  value integer not null default 0,
  rarity text not null,
  created_at timestamptz not null default now()
);

create table if not exists battles (
  id text primary key,
  creator_id uuid references profiles(id) on delete set null,
  case_ids jsonb not null default '[]'::jsonb,
  players jsonb not null default '[]'::jsonb,
  rounds jsonb not null default '[]'::jsonb,
  totals jsonb not null default '{}'::jsonb,
  winner_id uuid,
  winner_name text,
  created_at timestamptz not null default now()
);

create table if not exists trades (
  id text primary key,
  from_user_id uuid not null references profiles(id) on delete cascade,
  to_user_id uuid not null references profiles(id) on delete cascade,
  offered_item_uid text not null,
  requested_item_uid text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table profiles enable row level security;
alter table inventory_items enable row level security;
alter table recent_wins enable row level security;
alter table battles enable row level security;
alter table trades enable row level security;

-- Perfis e ranking podem ser lidos por todos para o ranking público do jogo.
drop policy if exists "profiles are readable" on profiles;
create policy "profiles are readable" on profiles for select using (true);

drop policy if exists "users insert own profile" on profiles;
create policy "users insert own profile" on profiles for insert with check (auth.uid() = id);

drop policy if exists "users update own profile" on profiles;
create policy "users update own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Inventários são públicos para ranking/trades. Só o dono pode inserir/deletar os próprios itens.
drop policy if exists "inventory is readable" on inventory_items;
create policy "inventory is readable" on inventory_items for select using (true);

drop policy if exists "users insert own inventory" on inventory_items;
create policy "users insert own inventory" on inventory_items for insert with check (auth.uid() = user_id);

drop policy if exists "users delete own inventory" on inventory_items;
create policy "users delete own inventory" on inventory_items for delete using (auth.uid() = user_id);

-- Feed público de drops.
drop policy if exists "recent wins are readable" on recent_wins;
create policy "recent wins are readable" on recent_wins for select using (true);

drop policy if exists "users insert own wins" on recent_wins;
create policy "users insert own wins" on recent_wins for insert with check (auth.uid() = user_id);

-- Batalhas públicas, criação apenas pelo criador logado.
drop policy if exists "battles are readable" on battles;
create policy "battles are readable" on battles for select using (true);

drop policy if exists "users insert own battles" on battles;
create policy "users insert own battles" on battles for insert with check (auth.uid() = creator_id);

-- Trades: visíveis apenas para os dois usuários envolvidos.
drop policy if exists "trade participants can read" on trades;
create policy "trade participants can read" on trades for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

drop policy if exists "users create own trades" on trades;
create policy "users create own trades" on trades for insert with check (auth.uid() = from_user_id);

drop policy if exists "trade participants update" on trades;
create policy "trade participants update" on trades for update using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create index if not exists idx_inventory_user_id on inventory_items(user_id);
create index if not exists idx_recent_wins_created_at on recent_wins(created_at desc);
create index if not exists idx_battles_created_at on battles(created_at desc);
create index if not exists idx_trades_from_to on trades(from_user_id, to_user_id);

-- Cria perfil automaticamente quando alguém faz sign up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1), 'Forge Player'),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), 'CF')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
