# Valyra — Deployment & Usage

How to run the MVP locally and how it is deployed. The app is a standard
Next.js 14 application, so it deploys anywhere that runs Node — Vercel is the
zero-config path.

## Run it locally

```bash
git clone https://github.com/Franreal123/valyra-mvp.git
cd valyra-mvp
npm install
npm run dev          # → http://localhost:3000
```

No environment variables are required for the demo: the chain, AVM, and data
store are simulated in `src/lib/`. (`.env.local` is only needed once the store
is wired to Supabase — see below.)

### Using the MVP (2–3 minute demo)

Open http://localhost:3000 and walk the three flows — full script in
[`demo-script.md`](demo-script.md):

1. **Homeowners** (`/homeowner`) — enter a home → get an AVM valuation → see the
   cash offer → sign. The home is tokenized.
2. **Investors** (`/investor`) — the signed home now appears in the marketplace.
   Pass the KYC gate, buy tokens from €100, and view the portfolio (with the
   downside scenario shown first).
3. **Desk** (`/admin`) — platform KPIs and per-home settlement. **Reset demo**
   restores the seeded state.

## Verify a build before shipping

```bash
npm run lint         # ESLint — no warnings
npm test             # Vitest — 50 unit tests
npm run test:e2e     # Playwright — full cross-flow journey
npm run build        # production build
```

> ⚠️ Never run `npm run build` while a `next dev` (or Playwright) server is
> writing to `.next`. Mixed dev/prod artifacts corrupt the build (`next start`
> then fails with a missing `vendor-chunks` module). Fix with a clean
> `rm -rf .next && npm run build`.

## Deploy to Vercel (recommended)

The repo builds cleanly as a static-first Next.js app.

1. Push to GitHub (already done).
2. In Vercel: **New Project → Import** `Franreal123/valyra-mvp`.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`,
   output handled automatically. No env vars needed for the simulated demo.
4. **Deploy.** Every push to `main` then ships a production deployment, and each
   pull request gets its own preview URL.

CLI alternative:

```bash
npm i -g vercel
vercel            # first run links/creates the project
vercel --prod     # promote to production
```

## Optional: wire up Supabase (prototype → persistent product)

This is the one architectural step from demo to real product (see
[`architecture.md`](architecture.md)). Persistence sits behind the existing
`src/lib/store.ts` interface, so the UI does not change.

1. Create a Supabase project; copy the keys into `.env.local`:

   ```bash
   cp .env.example .env.local
   # NEXT_PUBLIC_SUPABASE_URL=...
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   # SUPABASE_SERVICE_ROLE_KEY=...   # server-only, never exposed to the client
   ```

2. Implement the `store.ts` functions against Supabase tables seeded from
   `src/db/seed.ts`, keeping the same signatures.
3. Add the same env vars in the Vercel project settings (mark the service-role
   key as server-only / sensitive).

## Production checklist (beyond the MVP)

- Authentication + per-user sessions (replacing the demo's shared client store).
- Move the service-role key strictly server-side; never bundle it client-side.
- Add monitoring/error tracking and database backups.
- See [`security.md`](security.md) for the operator/user security model and
  [`risk-register.md`](risk-register.md) for the broader risk list.
