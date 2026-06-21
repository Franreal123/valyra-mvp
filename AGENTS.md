# AGENTS.md — working in the Valyra repo

Cross-tool instructions for AI coding agents (Claude Code, Codex, Cursor,
Copilot, Gemini, …). This is the canonical, tool-agnostic entry point;
`CLAUDE.md` holds the same conventions in Claude Code's native location, and
`docs/agent-orchestration.md` documents **how** the agents were actually
orchestrated to build this MVP.

## What this project is

Valyra is a FinTech MVP: tokenized **home-equity sharing agreements (HESAs)**
for the Netherlands. Dutch homeowners sell a slice of their home's *future
appreciation* for cash today (no debt, no interest); those rights are tokenized
so retail investors buy fractional shares from €100. The blockchain and the AVM
(Automated Valuation Model) are **simulated in `src/lib/`** — there is no real
chain. See [`README.md`](README.md) for the product overview and
[`docs/architecture.md`](docs/architecture.md) for how the concept maps to code.

## Golden rules for agents

1. **Read first.** Read `CLAUDE.md` (conventions) and the relevant `docs/`
   before writing code. Match the surrounding style — naming, structure,
   comment density.
2. **Respect the simulation boundary.** All faked chain/AVM logic lives behind
   small, swappable interfaces in `src/lib/` (`contract.ts`, `avm.ts`,
   `store.ts`). Never imply in user-facing copy that anything is really on-chain.
3. **Keep the data layer swappable.** `src/lib/store.ts` is the single seam that
   becomes Supabase/Postgres in production. Don't scatter data access elsewhere.
4. **Server components by default.** Add `"use client"` only at the leaves that
   need interactivity. The client-only store must never be imported from a
   Server Component or Server Action (see the header comment in `store.ts`).
5. **Secrets live in `.env.local`** (gitignored). Ship `.env.example`. Never
   hard-code keys.
6. **Verify before claiming done.** Run the checks below and show output.

## Commands

| Task | Command |
| --- | --- |
| Install | `npm install` |
| Dev server | `npm run dev` → http://localhost:3000 |
| Lint | `npm run lint` |
| Unit tests (Vitest) | `npm test` |
| E2E test (Playwright) | `npm run test:e2e` |
| Production build | `npm run build` |

> ⚠️ Don't run `npm run build` while a `next dev` (or Playwright) server is
> writing to `.next` — mixed dev/prod artifacts corrupt the build. If
> `next start` fails with a missing `vendor-chunks` module, do a clean
> `rm -rf .next && npm run build`.

## Definition of done

A change is done only when **lint passes, all unit tests pass, the production
build succeeds, and the e2e flow passes**. New behaviour ships with tests.

## Where things live

- `src/app/` — routes (App Router): `/`, `/homeowner`, `/investor`, `/admin`.
- `src/components/` — UI; `ui/` holds reusable primitives (`Button`, `Field`,
  `Modal`, `Card`).
- `src/lib/` — types, utilities, and the **simulated** contract / AVM / market /
  settlement logic plus the swappable `store`.
- `src/db/` — schema + seed data.
- `e2e/` — Playwright end-to-end test (`/e2e`); Vitest owns `src/**/*.test.ts`.
- `docs/` — financial model, architecture, deployment, security, regulatory
  note, risk register, simulated-vs-real, demo script, and the
  `docs/superpowers/` design specs & plans.
