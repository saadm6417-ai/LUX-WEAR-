-- LUX WEAR dashboard backend schema (Supabase/PostgreSQL)
-- Run in Supabase SQL Editor. Do not expose service_role keys in browser code.
create extension if not exists pgcrypto;

create table if not exists public.customer_surveys (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  source_language text not null default 'ar',
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists customer_surveys_submitted_at_idx on public.customer_surveys(submitted_at desc);
create index if not exists customer_surveys_phone_idx on public.customer_surveys(phone);

create table if not exists public.lux_site_content (
  content_key text primary key,
  arabic_value jsonb not null default '{}'::jsonb,
  english_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
create table if not exists public.lux_business_hours (
  day_of_week smallint primary key check(day_of_week between 0 and 6),
  open_minutes integer not null check(open_minutes between 0 and 1439),
  close_minutes integer not null check(close_minutes between 0 and 2879),
  closed boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists public.lux_admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'admin' check(role in ('owner','admin','editor','viewer')),
  created_at timestamptz not null default now()
);

alter table public.customer_surveys enable row level security;
alter table public.lux_site_content enable row level security;
alter table public.lux_business_hours enable row level security;
alter table public.lux_admin_profiles enable row level security;

-- Survey submissions are public insert only; reads require an authenticated administrator.
create policy "public submit surveys" on public.customer_surveys for insert to anon, authenticated with check (true);
create policy "admins read surveys" on public.customer_surveys for select to authenticated using (exists (select 1 from public.lux_admin_profiles p where p.id=auth.uid() and p.role in ('owner','admin','editor','viewer')));
create policy "admins manage content" on public.lux_site_content for all to authenticated using (exists (select 1 from public.lux_admin_profiles p where p.id=auth.uid() and p.role in ('owner','admin','editor'))) with check (exists (select 1 from public.lux_admin_profiles p where p.id=auth.uid() and p.role in ('owner','admin','editor')));
create policy "admins manage hours" on public.lux_business_hours for all to authenticated using (exists (select 1 from public.lux_admin_profiles p where p.id=auth.uid() and p.role in ('owner','admin','editor'))) with check (exists (select 1 from public.lux_admin_profiles p where p.id=auth.uid() and p.role in ('owner','admin','editor')));
create policy "profile read" on public.lux_admin_profiles for select to authenticated using (id=auth.uid());

-- Configure profiles via Supabase dashboard, never allow public profile writes.
