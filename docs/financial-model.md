# Valyra — Financial Model

How the Home Equity Sharing Agreement (HESA) is priced, tokenized, and settled.
All figures are **simulated** for the MVP; this document states the assumptions so
the model is transparent and defensible.

## 1. The agreement

A Dutch homeowner sells a fraction of their home's **future value** for cash today —
no debt, no interest, no monthly payments. The rights are tokenized so retail
investors buy fractional exposure. It is **not a loan**: there is no principal to
repay, and the investor shares **both upside and downside**.

- **Term:** `TERM_YEARS = 10` (or earlier on sale/refinance — an early settlement).
- **Share sold (X):** 5–20% of the home, chosen by the homeowner.

## 2. Pricing the offer (origination)

| Quantity | Formula | Example (€500k, X=10%) |
| --- | --- | --- |
| Cash to homeowner | `X% × AVM value × (1 − discount)` | €42,500 |
| Discount (risk adjustment) | `15%` | — |
| Tokens minted | `X × 1,000` (1% = 1,000 tokens) | 10,000 |
| Token mint price | `cash / tokens` (2dp) | €4.25 |

**Why the 15% discount?** It is the platform/investor **risk adjustment** for taking
illiquid, long-dated equity exposure with no coupon — analogous to the
risk-adjusted starting value used by Point/Unison. It protects investors against
AVM error and near-term softness, and is the homeowner's effective cost of
unlocking equity. (A production model would also set an **appreciation cap** and a
**floor**; the MVP keeps a clean proportional share.)

## 3. Valuation (AVM)

`value = floor area (m²) × €/m²(city) × energy-label adj × build-year adj`, rounded
to €500 with a ±4% confidence band. City €/m² levels approximate 2026 Dutch prices.
A production AVM would incorporate **WOZ-waarde** (official municipal valuation),
comparable sales, and postcode-level data.

## 4. Appreciation & current value

Each home is assigned a **deterministic** simulated appreciation (2–14%, from the
home id) so the marketplace and portfolio are reproducible.

- `currentTokenPrice = mintPrice × (1 + appreciation)`
- `currentHomeValue = valuation × (1 + appreciation)`
- A holding's current value = `tokens × currentTokenPrice`; gain = current − invested.

## 5. Risk & return (term projection)

Tokens track the home **proportionally**, so an investor's return equals the home's
value change over the term — **including losses**. `projectScenarios` models three
paths and annualizes each as an IRR over the term:

| Scenario | Home change (total) | On €10,000 | IRR |
| --- | --- | --- | --- |
| **Bear** | −15% | €8,500 (−€1,500) | ≈ −1.6%/yr |
| **Base** | the home's expected appreciation | — | — |
| **Bull** | +25% | €12,500 (+€2,500) | ≈ +2.3%/yr |

`IRR = (ending / invested)^(1/term) − 1`. Shown at the point of sale so the
**downside is always disclosed** before purchase.

## 6. Settlement

On settlement (sale, refinance, or end of term) token holders are **bought out** at
the current token price; their holdings are cleared and the home exits the platform.
`payout = tokensHeld × currentTokenPrice`.

## 7. Platform revenue (model)

Valyra would earn from: an **origination fee** (a % of cash advanced), an annual
**management fee** (a % of assets under management), and a **settlement spread**.
The MVP tracks capital raised/deployed; fees are documented here as the monetization
thesis rather than charged in the simulation.

## 8. Key assumptions & limitations

- Appreciation is simulated and treated as a **total over the term** for the base
  case (a real model would use an annual path with volatility).
- No interaction with the existing **mortgage** is modeled yet — in the Netherlands a
  HESA is **junior to the mortgage**, so only unmortgaged equity is truly tokenizable
  and lender consent is required. (See roadmap.)
- No taxes, transaction costs, or void/early-exit penalties.
- Single deterministic appreciation per home — not a stochastic simulation.

## 9. Regulatory note (NL/EU)

These tokens are most likely **security tokens** → EU **Prospectus Regulation** /
**MiFID II**, supervised by the **AFM** (conduct) and **DNB** (prudential); a
crypto-asset framing engages **MiCA**. A production launch needs **KYC/AML**
onboarding, risk disclosures, and retail-suitability checks. See
`docs/regulatory-note.md` (roadmap).
