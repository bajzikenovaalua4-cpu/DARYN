alter table public.vn_profiles
  add column if not exists relationship_scores jsonb not null default '{}'::jsonb;
