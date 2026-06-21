# Security Policy

Valyra is an **academic MVP**: the blockchain, the AVM, and the data store are
**simulated**, and the app handles **no real funds, no real chain, and no real
personal data**. There is therefore no production system to attack today — but
because this is a FinTech product intended to handle money and ownership, we take
the security model seriously and document it so the path to a secure production
deployment is clear.

## Scope today (the MVP)

- The data layer is an **in-memory, client-side singleton** that resets on
  restart — there is no authentication, and `/admin` is intentionally open for
  the demo.
- **No secrets are committed.** `.env*` files are gitignored; only an
  `.env.example` with empty placeholders ships.

For the full operator/user threat model, the production hardening checklist, and
operations/maintenance considerations, see
[`docs/security.md`](docs/security.md).

## Reporting a vulnerability

This is a student project, not a live service. If you find a security issue in
the code, please **open a GitHub issue** (for non-sensitive findings) or contact
the maintainer privately for anything sensitive. For a real deployment this file
would carry a dedicated disclosure address and a triage SLA.

## Before this goes to production

Minimum bar before handling real users or funds (tracked in
[`docs/security.md`](docs/security.md) and [`docs/risk-register.md`](docs/risk-register.md)):

- Real authentication + role-based access control (gate `/admin`).
- Persistence with Row-Level Security; service-role keys kept strictly
  server-side.
- KYC/AML via a regulated provider; PII encrypted in transit and at rest.
- Audited token contracts + qualified custody for the real-chain version.
- Dependency scanning (`npm audit` / Dependabot) and monitoring in CI/CD.
