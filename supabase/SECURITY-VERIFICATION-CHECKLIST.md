# LUX WEAR security verification checklist

## Database migration
- Review `supabase/security-hardening-admin-users.sql` against the live schema and existing website needs before running.
- Run in Supabase SQL Editor only after verifying all six named tables exist and the referenced columns/types are present.
- Inspect existing policies and grants first; this migration deliberately drops policies on the listed tables and replaces them.
- Verify the migration succeeds; do not assume it has run based on GitHub commit status.

## Auth settings (Supabase Dashboard)
- Require email confirmation for new accounts and email changes.
- Configure password strength/minimum length and leaked-password protection where available.
- Review OTP expiry, rate limits and resend limits; add CAPTCHA to public sign-in/recovery and survey paths if supported.
- Restrict Auth redirect URLs to the exact LUX WEAR domains and paths.
- Configure an SMS provider and test OTP delivery, verified phone behavior and throttling.
- Never expose a service-role key in client files.

## Verification tests
- Non-admin Auth account: login must be denied and session cleared.
- Unauthenticated browser: all admin pages redirect to login.
- Non-admin authenticated account: cannot select or mutate protected data.
- Public review submit: only a pending review is inserted; no read/update/delete.
- Admin account: can moderate reviews and manage permitted content.
- Test recovery with wrong email/phone, unverified phone, expired OTP, repeated OTP requests and invalid session.
- Confirm recovery email/phone is actually verified and attached to the account in Auth, not merely profile metadata.
- Test website public reads (published content, active care guides and store hours) after applying RLS.
