# Valyra — Architecture

How the conceptual innovation (retail-accessible, tokenized home-equity sharing)
maps into code, how the GUI serves the UX, and what it takes to scale this from
a prototype to a real product.

## One-paragraph overview

Valyra is a **Next.js 14 App Router** application written in **strict
TypeScript**. Pages are **React Server Components by default**; interactivity is
pushed to small client leaves. Every piece of "hard" domain logic — valuation,
tokenization, pricing, settlement — lives in **pure, unit-tested modules under
`src/lib/`**, behind small interfaces so the *simulated* implementations can be
swapped for real ones (a chain, an AVM vendor, a database) without touching the
UI. That seam **is** the architecture's main idea: a prototype that is one
honest step away from production.

## Concept → code map

| Conceptual innovation | Where it lives | What it does (simulated) | Production swap |
| --- | --- | --- | --- |
| **AVM valuation** of a home | [`lib/avm.ts`](../src/lib/avm.ts) | `area × €/m²(city) × label/age adj`, blended with WOZ, with a confidence band | Vendor AVM + comparables + manual review |
| **Mortgage seniority** (only unmortgaged equity is tokenizable) | [`lib/eligibility.ts`](../src/lib/eligibility.ts) | Equity, LTV, and the max share a homeowner may sell | Same logic, fed by verified mortgage data + lender consent |
| **HESA offer** (cash today for future appreciation) | [`lib/contract.ts`](../src/lib/contract.ts) | Builds the offer (risk-adjustment discount) and "mints" the token pool | ERC-1400 security tokens, transfer-restricted to KYC'd wallets |
| **Fractional tokens & pricing** | [`lib/market.ts`](../src/lib/market.ts) | Token price, available supply, current value, appreciation | Live indices, periodic re-valuation, on-chain supply |
| **Risk/return projection** | [`lib/scenarios.ts`](../src/lib/scenarios.ts) | Bear/base/bull outcomes + IRR over the term | Stochastic models, real index data |
| **Settlement / buy-out** | [`lib/admin.ts`](../src/lib/admin.ts) | Buy-out cost, platform KPIs | Real payment rails + escrow + settlement events |
| **Investor onboarding** | KYC gate (`components/investor/kyc-gate.tsx`) | Simulated KYC + suitability + risk acknowledgement | Regulated KYC/AML, sanctions screening, source-of-funds |
| **The data layer** | [`lib/store.ts`](../src/lib/store.ts) | In-memory, module-level singleton (resets on restart) | Supabase/Postgres behind the *same* function signatures |

See [`simulated-vs-real.md`](simulated-vs-real.md) for the full faked-vs-real
table and [`financial-model.md`](financial-model.md) for the numbers behind the
offer, discount, and IRR scenarios.

## The data-layer seam (the highest-leverage decision)

`lib/store.ts` exposes a small, deliberate interface — `getHomes`,
`getActiveHomes`, `signOffer`, `buyTokens`, `settleHome`, `getListings`,
`buyListing`, `isKycVerified`, … — and the rest of the app depends only on that.
Today those functions read and mutate in-memory arrays seeded from
[`src/db/seed.ts`](../src/db/seed.ts). Swapping them for Supabase/Postgres is the
single step from "prototype" to "persistent product" and requires **no UI
changes**. The `.env.example` already lists the Supabase keys for that step.

> The store is intentionally **client-only** (a browser module singleton). The
> header comment in `store.ts` forbids importing it from Server Components — the
> singletons (incl. `kycVerified`) would otherwise be shared across all users.
> In production this constraint disappears because state moves to the database.

## Data flow — one shared system

```
        Homeowner flow                Investor flow                 Operator desk
        (/homeowner)                  (/investor)                   (/admin)
            │                              │                            │
   apply → AVM → offer → sign      browse → KYC → buy → portfolio   KPIs → settle
            │                              │                            │
            └──────────────┐     ┌─────────┘             ┌──────────────┘
                           ▼     ▼                       ▼
                      ┌─────────────────────────────────────────┐
                      │   src/lib/store.ts  (swappable seam)     │
                      │   homes · holdings · listings · KYC      │
                      └─────────────────────────────────────────┘
```

Signing a home in the homeowner flow pushes it into the shared store, where it
immediately appears in the investor marketplace and the operator desk. The
end-to-end test (`e2e/full-flow.spec.ts`) drives exactly this path across all
three roles to prove the shared store works.

## How the GUI facilitates the UX

- **Three role-scoped surfaces, one mental model.** `/homeowner`, `/investor`,
  and `/admin` each tell a single, linear story (apply→sign, browse→invest,
  oversee→settle). A shared `AppHeader` is the only chrome; the wordmark always
  returns home.
- **Progressive disclosure.** The homeowner wizard (`Stepper`: Apply →
  Valuation → Offer → Sign) reveals one decision at a time and explains *how we
  valued this* and *why the discount* inline — trust is built at the point of
  the number.
- **Honest framing of risk.** The buy panel shows the **downside scenario
  first** and states returns are simulated; the KYC gate forces an explicit
  loss-bearing acknowledgement. The product never implies guaranteed upside.
- **Accessibility built in.** Dialogs use `role="dialog"` + `aria-modal` +
  labelled titles, close on Escape/backdrop (shared `Modal` primitive); the
  investor views are a real `tablist`/`tab`/`tabpanel`; form controls are
  label-associated with `aria-describedby` hints; interactive elements have
  `focus-visible` rings. Empty and loading states are handled, and the layout is
  responsive down to mobile.
- **Fast, mostly-static delivery.** Server components keep the JS small; only
  interactive leaves ship client code.

## Prerequisites to scale out (and the technical risks)

| To scale… | You need… | Risk if skipped |
| --- | --- | --- |
| **Persistence & multi-user** | Replace the in-memory store with Supabase/Postgres behind the same interface; add auth + per-user sessions | Data loss on restart; the client-only singleton can't serve real concurrent users (risk **T2/M1** in the [risk register](risk-register.md)) |
| **Real tokenization** | Audited ERC-1400 contracts, a qualified custodian, transfer restrictions to KYC'd wallets | Smart-contract bugs, key/custody loss (**T1/T3**) |
| **Trustworthy valuations** | Multiple AVM sources + signed feeds + manual review on outliers | Mispriced offers, oracle manipulation (**T4/F2**) |
| **Regulated operation** | Security-token classification, licensed venue/partner, prospectus-exemption monitoring | Operating an unlicensed venue, prospectus breach (**R1–R3**) |
| **Throughput & cost** | The static-first render already helps; add caching/CDN, paginate the marketplace, move heavy projections server-side | Slow marketplace as listings grow |

Operations, maintenance, and the operator/user **security** risks are covered in
[`security.md`](security.md); the financial and regulatory risks in
[`risk-register.md`](risk-register.md) and [`regulatory-note.md`](regulatory-note.md).
