create table if not exists public.vn_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  player_name text not null check (player_name ~ '^[А-Яа-яЁёІіӘәҒғҚқҢңӨөҰұҮүҺһ -]{2,32}$'),
  character_id text not null,
  gender text not null check (gender in ('male', 'female')),
  legal_literacy integer not null default 0 check (legal_literacy >= 0),
  secret_unlocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.vn_npc_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id text not null,
  npc_id text not null,
  completed boolean not null default true,
  correct_answers integer not null default 0 check (correct_answers >= 0),
  score_delta integer not null default 0 check (score_delta >= 0),
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now(),
  unique (user_id, npc_id)
);

alter table public.vn_profiles enable row level security;
alter table public.vn_npc_progress enable row level security;

create policy "Users can read own visual novel profile"
  on public.vn_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own visual novel profile"
  on public.vn_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own visual novel profile"
  on public.vn_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own visual novel profile"
  on public.vn_profiles for delete
  using (auth.uid() = user_id);

create policy "Users can read own visual novel npc progress"
  on public.vn_npc_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own visual novel npc progress"
  on public.vn_npc_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own visual novel npc progress"
  on public.vn_npc_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own visual novel npc progress"
  on public.vn_npc_progress for delete
  using (auth.uid() = user_id);
