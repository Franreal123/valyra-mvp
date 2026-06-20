# Valyra — Demo Script (~2–3 min)

A tight walkthrough that shows the end-to-end thesis: a home is tokenized by its
owner, funded by investors, and settled by the operator — one shared system.

> Run `npm run dev` → open http://localhost:3000.

## 0. Landing (15s)
- "Valyra brings US-style home-equity sharing (Point/Unison) to the Netherlands and
  makes it retail-accessible via tokenization."
- Point at the **certificate**: one home → a pool of tradable tokens.

## 1. Homeowner — unlock equity (45s)
- Go to **Homeowners**. Enter a home: e.g. *Keizersgracht 100, Amsterdam, 110 m²,
  label B, 2010*, sell **10%**.
- **Valuation** → AVM value + confidence band + "how we valued this".
- **Offer** → cash today = `share × value × 0.85`, tokens minted, unit price.
- **Sign** → it's tokenized; contract ref + token id issued.
- Key line: *"No debt, no interest — the homeowner sold a slice of future value."*

## 2. Investor — buy a fraction (45s)
- Go to **Investors**. The home you just signed is now in the **Marketplace**
  (alongside 6 seeded homes across NL cities).
- Click **Invest** on one. Enter €500.
- Show the **10-year projection**: *Bear / Base / Bull with IRR* — "the downside is
  disclosed; tokens can fall as well as rise."
- Confirm → land in **Portfolio**: position, current value, gain, allocation donut.

## 3. Operator — oversee & settle (30s)
- Go to **Desk**. KPIs: capital raised to homeowners, capital deployed by investors,
  funded %, token supply.
- Click **Settle** on a funded home → token holders are **bought out** at current
  value; the home leaves the marketplace and shows "paid out".
- **Reset demo** restores the seeded state for the next run.

## 4. Close (15s)
- "Everything is one shared store — sign a home and it flows to the marketplace and
  the desk. The blockchain, AVM, and market are **simulated**; the data layer is a
  swappable seam ready for Supabase + a real chain."
- Point to `docs/` — financial model, regulatory note, risk register, simulated-vs-real.

## Talking points if asked
- **Why 15% discount?** Risk adjustment for illiquid, long-dated, coupon-less equity.
- **Regulation?** Likely a security token → MiFID II / Prospectus Reg, AFM/DNB, KYC.
- **NL specifics?** HESA is junior to the mortgage; only unmortgaged equity is
  tokenizable; WOZ feeds the AVM.
