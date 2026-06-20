# Valyra — Home equity, unlocked

**Valyra** is a FinTech MVP that brings **home equity sharing agreements** (HESAs)
to the Netherlands and makes them **retail-accessible via tokenization**.

Dutch homeowners can sell a fraction of their home's **future appreciation** in
exchange for cash today — **no debt, no interest, no monthly payments**. Those
appreciation rights are **tokenized**, so retail investors can buy fractional
shares from as little as **€100**. Think of US companies **Point** and **Unison**,
brought to the Netherlands and opened up to small investors.

> 🎓 Built as a university FinTech assignment. The blockchain and the AVM
> (Automated Valuation Model) are **simulated in the backend** — there is no real
> chain connection.

## What the MVP demonstrates

Three flows:

1. **Homeowner journey** — apply, get an AVM valuation, receive an offer, sign a contract.
2. **Investor journey** — browse a marketplace of tokenized homes, buy fractional tokens, view a portfolio.
3. **Settlement / secondary market** — admin view of settlements and token trading.

## Tech stack

| Layer     | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Framework | **Next.js 14** (App Router, React Server Components)              |
| Language  | **TypeScript** (strict mode)                                      |
| Styling   | **Tailwind CSS** + brand palette                                  |
| Icons     | **lucide-react**                                                  |
| Charts    | **recharts**                                                      |
| Data      | **Supabase** (`@supabase/supabase-js`) — wired up in a later step |
| Utilities | `clsx`, `tailwind-merge`                                          |
| Tooling   | ESLint, Prettier                                                  |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. (Later) configure environment
cp .env.example .env.local   # add Supabase keys when the DB is wired up

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## Folder structure

```
valyra-mvp/
├── src/
│   ├── app/                # Routes (App Router)
│   │   ├── page.tsx        # Landing page
│   │   ├── homeowner/      # Homeowner journey
│   │   ├── investor/       # Investor journey
│   │   ├── admin/          # Settlement & secondary-market view
│   │   └── api/            # Route handlers (simulated chain / AVM endpoints)
│   ├── components/
│   │   └── ui/             # Reusable UI primitives
│   ├── lib/                # Utilities, types, simulated smart-contract & AVM logic
│   └── db/                 # Database schema + seed data
├── tailwind.config.ts      # Brand palette lives here
├── CLAUDE.md               # Coding conventions for this project
└── README.md
```

## Brand palette

| Token          | Hex       | Use                  |
| -------------- | --------- | -------------------- |
| `valyra-blue`  | `#1f5673` | Primary / accent     |
| `valyra-ink`   | `#1f3a4a` | Text / dark surfaces |
| `valyra-lime`  | `#7fc242` | Calls to action      |
| `valyra-paper` | `#efe5d8` | Page background      |

Available as Tailwind classes, e.g. `bg-valyra-blue`, `text-valyra-ink`.

## Status

✅ Scaffold + branded landing page. Routes are stubbed placeholders.
⏭️ **Next:** wire up Supabase (schema + seed data) and build the homeowner journey.
