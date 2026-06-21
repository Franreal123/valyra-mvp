# Valyra — Security & Operations

Security risks for the **operator** and the **users**, plus the operations and
maintenance challenges of running the platform — and how each is mitigated. This
complements the financial/legal/technical [risk register](risk-register.md);
here the lens is specifically *security and ops*.

## Threat model in one line

Valyra moves money and represents ownership of an asset, so the prizes for an
attacker are **funds, tokens (ownership), and personal/KYC data**. The operator
must protect all three; users must be protected from fraud and from losing
control of their holdings.

## Risks to the operator

| # | Risk | Mitigation |
| --- | --- | --- |
| O1 | **Leaked server secrets** (Supabase service-role key, payment keys) | Secrets only in `.env.local` / host secret store, never committed (`.env*` is gitignored, only `.env.example` ships); service-role key used **server-side only**, never bundled to the client |
| O2 | **Database compromise / unauthorized data access** | Supabase Row-Level Security so each user reads only their own rows; least-privilege keys; the public `anon` key never carries write authority beyond RLS policy |
| O3 | **Custody / private-key theft** (real-chain version) | Qualified custodian + multisig; operator never holds raw user keys (risk **T3**) |
| O4 | **Broken access control** (e.g. an investor reaching the operator desk) | Real auth + role checks on every privileged route (the demo's `/admin` is open and must be gated before launch) |
| O5 | **Supply-chain / dependency vulnerabilities** | Pinned dependencies, `npm audit` in CI, Dependabot; minimal dependency surface |
| O6 | **Web app attacks** (XSS, CSRF) | React escapes output by default; no `dangerouslySetInnerHTML`; security headers + same-site cookies for the authenticated version |

## Risks to the users

| # | Risk | Mitigation |
| --- | --- | --- |
| U1 | **Account takeover** | Strong auth (passkeys/MFA), session expiry, device/anomaly checks |
| U2 | **Loss of token control** (real-chain) | KYC-restricted transfers (ERC-1400), recovery via the regulated custodian rather than a lost seed phrase |
| U3 | **Phishing / fraudulent "Valyra" sites** | Verified domain, in-app-only actions, never asking for keys or full payment details over email |
| U4 | **PII / KYC data exposure** | Encryption in transit (TLS) and at rest; data minimisation; retention limits; processed via a regulated KYC provider |
| U5 | **Mis-selling / hidden downside** | The UI discloses the downside scenario *first* and forces a loss-bearing acknowledgement at the KYC gate (suitability) |

## MVP security posture (today)

This prototype is a **simulation** with **no real funds, no real chain, and no
real PII**, which removes most live attack surface — but it is also explicitly
not production-secure:

- The data store is an **in-memory, client-side singleton** — no auth, and
  `/admin` is open. This is fine for a demo and is the first thing to harden
  (auth + RLS) when persistence lands.
- No secrets exist in the repo (verified); `.env.example` holds empty
  placeholders only.

## Operations & maintenance challenges

| Challenge | How it's tackled |
| --- | --- |
| **No persistence yet** (state resets on restart) | Swap `store.ts` for Supabase/Postgres behind the same interface (see [architecture.md](architecture.md)); add automated backups |
| **Keeping valuations correct over time** | Periodic re-valuation jobs, multiple AVM feeds, manual review on outliers |
| **Dependency & framework upkeep** | Automated dependency updates, the four-check verification gate (lint/unit/build/e2e) on every change to catch regressions |
| **Observability** | Add error tracking + uptime/latency monitoring and structured logs before launch |
| **Incident response & data integrity** | Backups + point-in-time recovery, an audit trail of token mints/transfers/settlements, and a documented runbook |
| **Regulatory change** | The regulatory note is a living document; classification and licensing are reviewed before each market move |

## Responsible disclosure

For a production deployment, publish a `SECURITY.md` with a disclosure contact
and triage SLA so researchers can report issues safely.
