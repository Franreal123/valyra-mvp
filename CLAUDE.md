# CLAUDE.md — Valyra MVP

Coding conventions for the **Valyra** project (Dutch home-equity tokenization MVP).
Read this before writing code here. For the product overview, see `README.md`.

## Architecture in one line

Next.js 14 App Router. **Server components by default**; data and the _simulated_
blockchain / AVM logic live on the server. The chain and valuations are **faked in
`/lib`** — there is no real chain.

## Conventions

### TypeScript

- **Strict mode** is on (`tsconfig.json`). No implicit `any`; type everything.
- Prefer explicit, named types/interfaces in `src/lib/` over inline shapes that get reused.

### React / Next.js

- **Functional components only** — no class components.
- **Server components by default.** Add `"use client"` _only_ when a file needs
  browser-side interactivity (state, effects, event handlers, `recharts`, etc.).
  Keep client components small and push them to the leaves of the tree.
- Use **Server Actions** for mutations where they fit, rather than ad-hoc API routes.
- Use the `@/*` import alias (e.g. `import { cn } from "@/lib/utils"`).

### Styling

- **Tailwind classes inline** in JSX. No `styled-components`, no CSS-in-JS, no
  CSS Modules for component styling.
- Use the brand palette tokens, never raw hex in components:
  `valyra-blue` `#1f5673`, `valyra-ink` `#1f3a4a`, `valyra-lime` `#7fc242`,
  `valyra-paper` `#efe5d8`. Defined in `tailwind.config.ts`.
- Compose conditional classes with `cn()` from `@/lib/utils` (clsx + tailwind-merge).

### Naming

- **Files:** `kebab-case` (e.g. `home-card.tsx`, `avm-engine.ts`).
- **React components:** `PascalCase` (e.g. `HomeCard`). One component's name need not
  match its file name's case — the file is kebab, the export is Pascal.
- **Routes:** App Router folders are lowercase (`homeowner/`, `investor/`).

### Simulation boundary

- **All blockchain and AVM logic is simulated in `/lib`.** Anything pretending to be
  on-chain (minting tokens, transfers, settlement) or a property valuation (AVM)
  must be a clearly-named module under `src/lib/` (e.g. `lib/contract.ts`,
  `lib/avm.ts`). Keep the simulation behind a small, swappable interface so a real
  chain / AVM could replace it later without touching the UI.
- Never imply to the user-facing copy that anything is _really_ on-chain beyond the
  demo framing.

### Secrets

- Secrets live in `.env.local` (gitignored), never hard-coded. Ship an `.env.example`.

## Layout

- `src/app/` — routes. `src/components/ui/` — reusable primitives.
- `src/lib/` — utilities, types, **simulated** contract & AVM logic.
- `src/db/` — schema + seed data.
