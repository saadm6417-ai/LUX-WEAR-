-- LUX WEAR: harden the admin allow-list table.
-- Authenticated clients can only read their own allow-list row; all mutations are blocked.
begin;
alter table public.admin_users enable row level security;
alter table public.admin_users force row level security;
revoke insert, update, delete, truncate, references, trigger on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "lux_admin_users_read_self" on public.admin_users;
create policy "lux_admin_users_read_self"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));
commit;
