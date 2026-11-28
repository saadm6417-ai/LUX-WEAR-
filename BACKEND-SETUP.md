# LUX WEAR dashboard/backend setup

The integration branch currently holds the dashboard prototype and login page; the production main branch is untouched.

## Backend data model
Run `supabase-schema.sql` in Supabase SQL Editor. It creates survey submissions, bilingual content, store-hours data, and administrator profiles with RLS enabled.

## Needed to complete live functionality
1. Create a Supabase project.
2. Run the SQL file.
3. Add authenticated admin accounts in Supabase Auth and corresponding `lux_admin_profiles` rows (assign roles).
4. Supply the project URL and public anon key for client-side configuration. Never share the service-role key or put it in HTML.
5. Integrate the frontend with these tables, test submission/read/edit workflows, and then publish after approval.

## Survey payload format
Store each survey's numbered answers as JSON in `answers`. The bilingual survey can submit canonical Arabic option values and retain `source_language` metadata. Free-text answers should remain as entered, without automatic translation.

## Tables
- `customer_surveys`: survey entries and search fields.
- `lux_site_content`: separate Arabic and English JSON fields per editable page/content key.
- `lux_business_hours`: week schedule using minutes since midnight and closed flag.
- `lux_admin_profiles`: admin role records linked to Auth.

**Security note:** policies require authenticated profile rows for administrative reads and writes. Public submissions only insert into the survey table. Review and test RLS policies before going live.
