alter table public.vn_profiles
  add column if not exists shop_purchases jsonb not null default '[]'::jsonb,
  add column if not exists shop_spent integer not null default 0 check (shop_spent >= 0);
