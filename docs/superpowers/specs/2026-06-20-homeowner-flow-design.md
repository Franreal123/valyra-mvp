# Homeowner Flow — Design Spec

**Project:** Valyra MVP · **Date:** 2026-06-20 · **Status:** Approved

## Goal

Build the homeowner journey: a homeowner applies, receives a simulated AVM
valuation, gets a Home Equity Sharing Agreement (HESA) offer, and signs. Signing
mints simulated appreciation tokens and writes a `TokenizedHome` into the data
store so the (later) investor marketplace can read it.

All blockchain and AVM logic is **simulated in `/lib`** — no real chain, no network.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Data layer | Simulated in-memory store + JSON-ish seed, behind a swappable interface (Supabase drops in later) |
| Offer model | Simple proportional share |
| AVM | Deterministic Dutch model (area × €/m² + adjustments) |
| UI | Single-page 4-step wizard/stepper at `/homeowner` |

## Architecture

A single `/homeowner` route renders a 4-step wizard (client component for state)
backed by simulated `/lib` modules, each behind a clean interface:

| Module | Purpose | Key exports |
| --- | --- | --- |
| `lib/avm.ts` | Deterministic Dutch valuation | `valuateProperty(input): Valuation` |
| `lib/contract.ts` | HESA offer math + simulated tokenization | `buildOffer(valuation, sharePct): Offer`, `mintTokens(offer, ...): TokenizedHome` |
| `lib/store.ts` | In-memory store (swappable data layer) | `createApplication()`, `signOffer()`, `getHomes()` |
| `lib/types.ts` | Shared domain types | `PropertyInput`, `Valuation`, `Offer`, `Application`, `TokenizedHome` |
| `db/seed.ts` | City €/m² table + seed homes | `CITY_PRICES`, `seedHomes` |

UI primitives live in `components/ui/` (`Button`, `Card`, `Stepper`, `Field`),
built as needed. Server component shell; `"use client"` only on the wizard.

## Data flow — the 4 steps

1. **Apply** — form: address, city (NL dropdown), floor area (m²), bedrooms,
   build year, energy label, requested share % (slider, 5–20%). Validated
   client-side.
2. **Valuation** — `valuateProperty()` → AVM value + confidence band + a short
   "how we valued this" breakdown.
3. **Offer** — `buildOffer()` → **cash today** = `share% × value × (1 − discount)`,
   plus share sold, discount, and tokens to be minted. Itemized.
4. **Sign** — "Sign agreement" → `signOffer()` calls `mintTokens()`, writes a
   `TokenizedHome` to the store, shows success with a fake contract ref + token id.

## Financial model (locked numbers)

- **Discount (risk adjustment):** 15% constant (named const, easy to tweak).
- **Tokenization ratio:** 1% share = 1,000 tokens. `tokenPrice = cash / tokenCount`.
- **AVM:** `value = area × €/m²(city) × labelAdj × ageAdj`, reported with a ±4%
  confidence band. City €/m² levels live in `db/seed.ts`.

Worked example: €500,000 value, 10% share, 15% discount →
cash = `0.10 × 500,000 × 0.85` = **€42,500**; tokens minted = **10,000**;
token price = **€4.25**. At a future €600,000 exit, investors collectively
receive `10% × 600,000` = €60,000.

## Error handling & edge cases

- Form validation blocks advancing: required fields, area > 0, share within 5–20%.
- Unknown city → fall back to national-average €/m² with a visible note.
- Wizard state is client-side; refresh resets (acceptable for in-memory MVP).
  Back/Next preserve entered data.

## Out of scope (YAGNI)

No cross-reload persistence, no auth, no real contract PDF, no changes to the
investor/admin routes yet. The signed `TokenizedHome` lands in the store so the
investor flow plugs in cleanly as the next milestone.

## Success criteria

- A user can complete Apply → Valuation → Offer → Sign end-to-end.
- The AVM value responds sensibly to inputs (city, area, label, age).
- The offer math matches the locked model exactly.
- Signing produces a `TokenizedHome` retrievable via `getHomes()`.
- `npm run lint` and `npm run build` pass.
