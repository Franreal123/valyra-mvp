# Valyra — Simulated vs. Real

Explicit boundary between what the MVP fakes and how it would work in production.
Stating this is deliberate: it shows the prototype's claims are honest and that the
path to a real system is understood.

| Concern | MVP (simulated) | Production (real) |
| --- | --- | --- |
| **Valuation (AVM)** | `area × €/m²(city) × label/age adj`, ±4% band, in `lib/avm.ts` | Real AVM: WOZ-waarde, comparable sales, postcode data, vendor model + manual review |
| **Appreciation** | Deterministic per-home hash (2–14%), static | Live indices, stochastic paths, periodic re-valuation |
| **Blockchain / tokens** | "Mint" is an object in an in-memory store; ids like `VH-0001` | ERC-1400 security tokens on a chain, transfer-restricted to KYC'd wallets, real settlement events |
| **Data persistence** | In-memory arrays in `lib/store.ts` (reset on restart) | Postgres/Supabase behind the same `store` interface (built as a swappable seam) |
| **Investor onboarding** | None / open | KYC/AML, sanctions screening, suitability, source-of-funds |
| **Payments** | Cash amounts are display-only | PSD2 payment rails / regulated payment partner; escrow |
| **Legal structure** | Implicit | SPV holding the appreciation rights; notarial deed; registered charge; lender consent |
| **Secondary market** | Roadmap | Matching engine / regulated venue or licensed partner |
| **Fees / revenue** | Documented, not charged | Origination + management fee + settlement spread, in code |

## The one architectural decision that makes this real

The data layer was built as a **swappable interface** (`getHomes`, `getHoldings`,
`buyTokens`, `settleHome`, …). Swapping the in-memory arrays for Supabase/Postgres is
the single highest-leverage step from "prototype" to "persistent product" and
requires **no UI changes**.
