# Valyra — Regulatory Note (NL/EU)

A first-pass analysis of how Valyra would be regulated in the Netherlands and the
EU. This is an academic assessment for the MVP, **not legal advice**.

## 1. What is the instrument?

A token represents a fractional, tradable right to a share of a specific home's
**future value** — economic exposure with an expectation of profit derived from a
third party's efforts (the homeowner's property + Valyra's management). Under EU law
this most likely makes the token a **transferable security / financial instrument**
(MiFID II, Annex I, Section C), i.e. a **security token** — not a utility token and
not e-money.

## 2. Applicable regimes

| Regime | Why it applies | Implication for Valyra |
| --- | --- | --- |
| **MiFID II** | Tokens are financial instruments | Marketplace ≈ trading venue / investment-firm activity → likely needs authorisation or a licensed partner |
| **EU Prospectus Regulation** | Public offer of securities | A **prospectus** is required unless an exemption applies (e.g. < €5m/12-months NL threshold, or < 150 retail investors per member state) |
| **MiCA** | If framed/marketed as a crypto-asset | MiCA mostly **excludes** instruments that already qualify as MiFID financial instruments — so classification must be settled first |
| **AMLD5 / Wwft (NL)** | Onboarding investors & paying homeowners | Mandatory **KYC/AML**, sanctions screening, source-of-funds |
| **AFM** (conduct) & **DNB** (prudential) | Dutch supervisors | Licensing, conduct-of-business, marketing rules, ongoing reporting |

## 3. Retail-investor protection (the €100 minimum cuts both ways)

Opening security-token investing to retail from €100 is the product's USP **and** its
biggest compliance surface:

- **Appropriateness/suitability** assessment before investing.
- **Risk disclosures** + a key information document (PRIIPs-style KID).
- Possible **investment limits** per retail investor (concentration caps).
- Clear, non-misleading **marketing** (AFM scrutiny).

## 4. Property-law & lien specifics (NL)

- A HESA is **junior to the mortgage**; tokenizing future value needs the structure
  to respect the mortgage lender's senior claim and likely **lender consent**.
- The right must be legally enforceable at settlement (sale/refinance) — a notarial
  deed and a registered charge or contractual structure (e.g. an SPV holding the
  rights, with tokens as participations).

## 5. What this means for the build (roadmap)

1. **KYC/AML onboarding gate** before any investor can buy (simulated in the MVP).
2. **Risk disclosure + suitability** step in the invest flow.
3. **Offer caps / exemption tracking** to stay under prospectus thresholds.
4. **SPV + token standard** (e.g. ERC-1400 security token with transfer restrictions
   enforcing whitelisting/KYC on-chain).
5. Legal classification opinion before any real offer.

## 6. Honest position

For a real launch Valyra would almost certainly operate **with a licensed partner**
(or under an exemption + AFM dialogue) rather than unlicensed. The MVP simulates the
product mechanics; the compliance layer is modelled as onboarding + disclosures, not
implemented as a regulated venue.
