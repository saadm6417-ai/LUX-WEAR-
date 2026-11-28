-- LUX WEAR security hardening (review before running in Supabase SQL Editor).
-- Intended for the known tables in this project; replaces their existing policies.
-- Run only after confirming the table names and columns in your Supabase project.

begin;

-- A non-recursive allow-list check. SECURITY DEFINER avoids RLS recursion when
-- admin policies consult admin_users. Keep the function narrowly scoped.
create schema if not exists private;
grant usage on schema private to authenticated;
create or replace function private.is_luxwear_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, auth
as $
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;
revoke all on function private.is_luxwear_admin() from public, anon;
grant execute on function private.is_luxwear_admin() to authenticated;

-- admin_users: authenticated users can see only their own allow-list entry;
-- no client-side mutations.
alter table public.admin_users enable row level security;
alter table public.admin_users force row level security;
revoke insert, update, delete, truncate, references, trigger on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- Reset policies on these tables so old permissive policies cannot silently
-- override this ruleset. This is why the script should be reviewed before run.
do $$
declare t text; p record;
begin
  foreach t in array array['admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours'] loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I',p.policyname,t);
    end loop;
  end loop;
end $$;

create policy lux_admin_users_self_select on public.admin_users
for select to authenticated using (user_id = (select auth.uid()));

-- Customer reviews: public can submit a pending review only; admins can read
-- and moderate. No public read, update, or delete.
alter table public.customer_reviews enable row level security;
create policy lux_reviews_public_submit on public.customer_reviews
for insert to anon, authenticated
with check (
  status = 'pending'
  and nullif(trim(customer_name),'') is not null
  and nullif(trim(phone),'') is not null
  and language in ('ar','en')
  and answers is not null
);
create policy lux_reviews_admin_read on public.customer_reviews
for select to authenticated using ((select private.is_luxwear_admin()));
create policy lux_reviews_admin_update on public.customer_reviews
for update to authenticated using ((select private.is_luxwear_admin()))
with check ((select private.is_luxwear_admin()));
create policy lux_reviews_admin_delete on public.customer_reviews
for delete to authenticated using ((select private.is_luxwear_admin()));

-- Admin-only management tables.
alter table public.care_guides enable row level security;
create policy lux_care_public_active_read on public.care_guides
for select to anon, authenticated using (is_active = true);
create policy lux_care_admin_all on public.care_guides
for all to authenticated using ((select private.is_luxwear_admin()))
with check ((select private.is_luxwear_admin()));

alter table public.luxwear_content enable row level security;
create policy lux_content_public_published_read on public.luxwear_content
for select to anon, authenticated using (is_published = true);
create policy lux_content_admin_all on public.luxwear_content
for all to authenticated using ((select private.is_luxwear_admin()))
with check ((select private.is_luxwear_admin()));

alter table public.site_settings enable row level security;
create policy lux_settings_admin_all on public.site_settings
for all to authenticated using ((select private.is_luxwear_admin()))
with check ((select private.is_luxwear_admin()));

alter table public.store_hours enable row level security;
create policy lux_hours_public_read on public.store_hours
for select to anon, authenticated using (true);
create policy lux_hours_admin_all on public.store_hours
for all to authenticated using ((select private.is_luxwear_admin()))
with check ((select private.is_luxwear_admin()));

-- Policies do not grant table privileges. Preserve required reads/writes while
-- restricting mutations to authenticated admins; confirm these grants against
-- your deployment and any public website queries before running.
grant select on public.care_guides, public.luxwear_content, public.store_hours to anon, authenticated;
grant select, insert, update, delete on public.customer_reviews to anon, authenticated;
grant select, insert, update, delete on public.care_guides, public.luxwear_content, public.site_settings, public.store_hours to authenticated;
revoke insert, update, delete on public.care_guides, public.luxwear_content, public.site_settings, public.store_hours from anon;

commit;
