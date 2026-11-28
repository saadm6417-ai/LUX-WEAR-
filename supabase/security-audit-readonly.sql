-- LUX WEAR: READ-ONLY security audit
-- Safe to run in Supabase SQL Editor. Does not change schema, data, grants or policies.

-- 1) Target tables and RLS state
select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r'
  and c.relname in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
order by c.relname;

-- 2) Columns (names and types only)
select table_schema, table_name, column_name, data_type, udt_name,
       is_nullable, column_default
from information_schema.columns
where table_schema='public'
  and table_name in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
order by table_name, ordinal_position;

-- 3) Existing policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname='public'
  and tablename in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
order by tablename, policyname;

-- 4) Table-level privileges for anon/authenticated
select table_schema, table_name, grantee, privilege_type
from information_schema.table_privileges
where table_schema='public'
  and table_name in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
  and grantee in ('anon','authenticated')
order by table_name, grantee, privilege_type;

-- 5) Triggers on these tables
select event_object_schema as schema_name, event_object_table as table_name,
       trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where event_object_schema='public'
  and event_object_table in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
order by event_object_table, trigger_name;

-- 6) Indexes on these tables
select schemaname, tablename, indexname, indexdef
from pg_indexes
where schemaname='public'
  and tablename in ('admin_users','customer_reviews','care_guides','luxwear_content','site_settings','store_hours')
order by tablename, indexname;
