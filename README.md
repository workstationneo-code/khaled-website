# Veltrix SAT Teaching Proposal

A responsive React + Vite proposal website for a universal SAT teaching platform (SAT English, SAT Math, or both).

## Run locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the Supabase URL and publishable key.
4. Run `npm run dev`.

## Supabase setup
The `public.leads` table is created with Row Level Security enabled. Public visitors can submit enquiries; only signed-in users whose Supabase Auth **app_metadata.role** is `admin` can view or update enquiries.

To create an administrator:
1. In Supabase Dashboard, open **Authentication → Users** and create/invite the admin account.
2. Copy the exact email address used for that account.
3. In **SQL Editor**, run the following after replacing the email:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```
4. Sign in at `/admin`. If the account was already signed in, sign out and back in so the refreshed JWT contains the admin role.

Do not put a Supabase secret/service-role key in browser code. Only the publishable key belongs in the Vite environment variables.

## Environment variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (the modern Supabase publishable key is accepted here; the variable name is retained for the existing client code)

## Commercial package prices
- Starter: EGP 35,000 one-time
- Professional: EGP 48,000 one-time (recommended)
- Elite: EGP 56,000 one-time
- Basic Care: EGP 4,000/month
- Complete Care: EGP 10,000 every 3 months

Care plans are separate from the one-time development fees.
