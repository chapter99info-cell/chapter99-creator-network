# Chapter99 Creator Network

Thai photographer marketplace PWA for Chapter99 Solutions — connecting verified Thai photographers in Australia with clients through escrow-protected bookings, Stripe Connect payouts, and admin-managed workflows.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS (charcoal `#111111` + saffron `#E8A838`)
- **Database & Auth:** Supabase (PostgreSQL, Magic Link auth, Storage)
- **Payments:** Stripe Connect (Payment Intents + Express transfers)
- **Email:** Resend
- **PWA:** next-pwa
- **Deploy:** Vercel

## Environment Variables

Copy `.env.local` and fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_USER_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=Chapter99 <onboarding@resend.dev>
ADMIN_EMAIL=chapter99solutions@gmail.com
NEXT_PUBLIC_FACEBOOK_GROUP_URL=https://www.facebook.com/groups/chapter99creatornetwork
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_*` | Client + server Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API, join registration, file uploads |
| `STRIPE_*` | Payments and Connect transfers |
| `ADMIN_USER_ID` | Supabase auth UUID for admin middleware |
| `RESEND_*` | Transactional emails |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for emails, sitemap, redirects |
| `NEXT_PUBLIC_FACEBOOK_GROUP_URL` | Community group link on homepage |

## Run Locally

```bash
cd chapter99-creator-network
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Type-check:

```bash
npx tsc --noEmit
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor.
3. Run any migrations in `supabase/migrations/` if needed.
4. Create Storage buckets:
   - `documents` — avatars (`avatars/`), insurance (`insurance/`)
   - `deliverables` — RAW upload folders per booking
5. Set bucket policies: public read for `documents`, authenticated upload for `deliverables`.
6. Enable Email auth (Magic Link) in Authentication → Providers.
7. Copy Project URL, anon key, and service role key to `.env.local`.
8. Set `ADMIN_USER_ID` to your admin user's auth UUID after first login.

## Stripe Connect Setup

1. Create a Stripe account at [stripe.com](https://stripe.com).
2. Enable **Connect** → Express accounts.
3. Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `transfer.created`
4. Copy publishable key, secret key, and webhook secret to `.env.local`.
5. Photographers complete Express onboarding via `/api/stripe/onboard` from the Photographer Portal.

## Resend Setup

1. Create account at [resend.com](https://resend.com).
2. Verify your sending domain (or use `onboarding@resend.dev` for testing).
3. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env.local`.

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in [vercel.com](https://vercel.com).
3. Add all environment variables from `.env.local`.
4. Set `NEXT_PUBLIC_APP_URL` to your production domain.
5. Deploy — Vercel auto-builds on push.
6. Update Stripe webhook URL to production `/api/webhooks/stripe`.
7. Add production URL to Supabase Auth → Redirect URLs.

## Key Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/photographers` | Public | Browse verified photographers |
| `/photographers/[id]` | Public | Photographer profile |
| `/book/[id]` | Client login | Booking + payment |
| `/join` | Public | Photographer registration |
| `/terms` | Public | Terms & Conditions |
| `/sop` | Verified photographer | Standard Operating Procedure |
| `/photographer/*` | Verified photographer | Portal dashboard, uploads |
| `/client/*` | Client login | Booking history, reviews |
| `/admin/*` | Admin only (`ADMIN_USER_ID`) | Admin dashboard |

### Access control

| Path | Who can access |
|------|----------------|
| `/admin/*` | พี่แสน only — `ADMIN_USER_ID` in env |
| `/photographer/*`, `/sop` | Photographers with `is_verified=true`, not blacklisted |
| `/client/*`, `/book/*` | Any logged-in user (client Magic Link) |

## Registration Flow

1. Applicant completes 4-step form at `/join`.
2. Files upload via `POST /api/join/upload` (service role).
3. Magic Link sent via `signInWithOtp`.
4. `POST /api/join` creates auth user + `photographers` row (`is_verified=false`).
5. Admin receives email → verifies at `/admin/photographers`.
6. Applicant receives confirmation email (2–3 business days review).

## Project Structure

```
app/
  (public)/          # Public pages: home, photographers, book, join, terms, sop
  (dashboard)/       # Photographer, client, admin portals
  api/               # REST routes: bookings, join, stripe, webhooks
  auth/              # Magic Link login + callback
components/          # UI components and forms
lib/                 # Supabase, Stripe, Resend, calculations, validations
types/               # TypeScript types + Supabase generated types
supabase/            # Schema and migrations
```

## License

Proprietary — Chapter99 Solutions © 2026
