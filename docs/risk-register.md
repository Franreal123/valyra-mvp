# Valyra — Risk Register

Key risks for the platform, homeowners, and investors, with severity (likelihood ×
impact) and mitigations. Maintained as a living document.

## Product & financial

| # | Risk | Sev | Mitigation |
| --- | --- | --- | --- |
| F1 | **Home depreciation** — investors lose capital; homeowner over-sold | High | Downside modelled & disclosed at point of sale; risk-adjustment discount; (future) appreciation floor |
| F2 | **AVM error** — wrong valuation mis-prices the offer | High | Confidence band; WOZ + comparables (future); manual review on outliers |
| F3 | **Liquidity** — investors can't exit before settlement | Med | Secondary market (roadmap); clear term disclosure |
| F4 | **Concentration** — investor over-exposed to one home/city | Med | Portfolio diversification surfacing; (future) per-position caps |
| F5 | **Settlement default** — homeowner can't fund buy-out | Med | Settlement on sale/refinance; senior-to-equity structuring; reserve (future) |

## Legal & regulatory

| # | Risk | Sev | Mitigation |
| --- | --- | --- | --- |
| R1 | **Token mis-classification** (security vs crypto-asset) | High | Legal opinion before launch; default to security-token treatment |
| R2 | **Operating an unlicensed venue** | High | Licensed partner / exemption + AFM dialogue |
| R3 | **Prospectus breach** on public offer | High | Offer caps, investor-count tracking, exemption monitoring |
| R4 | **Mortgage seniority / lender consent** (NL) | High | Model unmortgaged equity only; lender consent; SPV structure |
| R5 | **KYC/AML failure** | High | Mandatory onboarding, screening, source-of-funds |

## Technical & operational

| # | Risk | Sev | Mitigation |
| --- | --- | --- | --- |
| T1 | **Smart-contract bug** (real chain) | High | Audited ERC-1400; formal verification; upgradability controls |
| T2 | **Data loss / no persistence** (current MVP is in-memory) | High | Move store → Supabase/Postgres behind the existing seam |
| T3 | **Custody / key management** | High | Qualified custodian; multisig |
| T4 | **Oracle / valuation feed integrity** | Med | Multiple AVM sources; signed feeds |

## MVP-specific (this prototype)

| # | Risk | Sev | Mitigation |
| --- | --- | --- | --- |
| M1 | In-memory store resets on restart | — | Documented; Supabase swap is the next architectural step |
| M2 | Appreciation is simulated/deterministic | — | Clearly labelled "simulated"; documented in the financial model |
| M3 | No real chain / KYC | — | Simulation boundary documented in `simulated-vs-real.md` |
