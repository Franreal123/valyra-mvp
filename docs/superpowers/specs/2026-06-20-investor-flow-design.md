# Investor Flow — Design Spec

**Project:** Valyra MVP · **Date:** 2026-06-20 · **Status:** Approved (autonomous build)

## Goal

Build the investor journey: browse a marketplace of tokenized homes, buy fractional
tokens (from €100), and view a portfolio with simulated appreciation. Reads the same
in-memory store the homeowner flow writes to, so a home signed in `/homeowner` appears
here.

All blockchain/AVM/market logic is **simulated in `/lib`** — no real chain, no network.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Page shape | Single `/investor` route, client app with two tabs: Marketplace, Portfolio |
| Issuance model | Primary: investors buy a home's minted tokens at its `tokenPrice`; `available = tokenCount − tokensSold` |
| Minimum investment | €100 (whole tokens only; `minTokens = ceil(100 / tokenPrice)`) |
| Appreciation | Deterministic per home id, 2–14% (`simulateAppreciationPct`); `currentTokenPrice = tokenPrice × (1 + appr/100)`, 2dp |
| Gain | `currentValue = tokens × currentTokenPrice`; `gain = currentValue − invested` |
| Chart | recharts donut of current value by home (Portfolio tab) |

## Data model additions (`lib/types.ts`)

```ts
export interface Holding {
  id: string;          // "HLD-0001"
  homeId: string;      // FK -> TokenizedHome.id
  tokens: number;      // whole tokens bought
  tokenPrice: number;  // price paid per token at purchase (the mint price)
  invested: number;    // tokens × tokenPrice, EUR
  purchasedAt: string; // ISO
}
```

## Store additions (`lib/store.ts`)

- `getHoldings(): Holding[]` — copy.
- `getHome(id: string): TokenizedHome | undefined`.
- `tokensSold(homeId: string): number` — sum of holdings' tokens for that home.
- `tokensAvailable(home: TokenizedHome): number` — `tokenCount − tokensSold`.
- `buyTokens(homeId: string, tokens: number): Holding` — validates availability, records a holding, returns it. Throws on unknown home or oversell.
- Seed a few holdings (`db/seed.ts` `seedHoldings`) so marketplace shows partial funding.

## Market logic (`lib/market.ts`)

- `MIN_INVESTMENT_EUR = 100`.
- `simulateAppreciationPct(home): number` — deterministic hash of `home.id` → integer 2..14.
- `currentTokenPrice(home): number` — `round(tokenPrice × (1 + appr/100), 2dp)`.
- `minTokens(tokenPrice): number` — `ceil(100 / tokenPrice)`.
- `tokensForAmount(amountEUR, tokenPrice): number` — `floor(amountEUR / tokenPrice)`.
- `holdingValue(holding, home)` → `{ currentValue, gain, gainPct }`.
- `summarisePortfolio(holdings, homes)` → `{ invested, currentValue, gain, gainPct, positions }`.

## UI (`components/investor/`, build-verified)

- `home-card.tsx` — marketplace card: address, city, valuation, token price, funded bar (`sold/total`), projected-appreciation badge, Invest button.
- `buy-panel.tsx` *(client)* — € amount input (min €100, max = available × price), live token preview, confirm → `buyTokens`, success state.
- `portfolio-view.tsx` — positions table (tokens, invested, current value, gain ±%), totals summary.
- `allocation-chart.tsx` *(client, recharts)* — donut of current value by home.
- `investor-app.tsx` *(client)* — tab state + selected-home buy state, refreshes holdings after a buy.
- `app/investor/page.tsx` — server shell rendering `<InvestorApp />` (replaces placeholder).

## Error handling / edges

- Buy below €100 or above availability is blocked in the UI and `buyTokens` throws as a backstop.
- Fully-funded homes show "Fully funded" and disable Invest.
- Empty portfolio shows an empty state.
- In-memory store resets on server restart (accepted MVP limit).

## Success criteria

- Marketplace lists homes from `getHomes()` with correct availability.
- Buying decrements availability and adds a portfolio position.
- Portfolio totals and per-position gains match the market math.
- `npm test`, `npm run lint`, `npm run build` all pass.
