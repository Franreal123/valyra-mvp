# Homeowner Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the homeowner journey (Apply → AVM Valuation → Offer → Sign) as a single-page wizard backed by simulated `/lib` modules, where signing mints appreciation tokens into an in-memory store.

**Architecture:** A client `HomeownerWizard` component holds step state and calls three pure, simulated modules — `lib/avm.ts` (Dutch valuation), `lib/contract.ts` (HESA math + tokenization), `lib/store.ts` (in-memory data layer behind a swappable interface). All financial/AVM logic is unit-tested with Vitest; the presentational UI is verified by `lint` + `build`.

**Tech Stack:** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, lucide-react, Vitest.

## Global Constraints

- **Next.js 14**, App Router. Server components by default; `"use client"` only where browser interactivity is needed.
- **TypeScript strict mode** — no implicit `any`; type everything.
- **Tailwind classes inline.** Use brand tokens only, never raw hex: `valyra-blue` `#1f5673`, `valyra-ink` `#1f3a4a`, `valyra-lime` `#7fc242`, `valyra-paper` `#efe5d8`.
- **File naming:** kebab-case files, PascalCase component exports. `@/*` import alias.
- **All blockchain + AVM logic is simulated in `src/lib/`.** No real chain, no network.
- **Locked financial model:** discount = **15%**; **1% share = 1,000 tokens**; share range **5–20%**; AVM band **±4%**.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `vitest.config.ts` | Vitest config with `@` → `src` alias |
| `src/lib/types.ts` | Domain types (no logic) |
| `src/lib/format.ts` | `formatEUR`, `formatEURPrecise` (deterministic, no ICU) |
| `src/db/seed.ts` | `CITY_PRICES`, `NATIONAL_AVG_PRICE_M2`, `seedHomes` |
| `src/lib/avm.ts` | `valuateProperty()` |
| `src/lib/contract.ts` | `buildOffer()`, `mintTokens()`, constants |
| `src/lib/store.ts` | `getHomes()`, `createApplication()`, `signOffer()` |
| `src/components/ui/button.tsx` | `Button` primitive |
| `src/components/ui/card.tsx` | `Card` primitive |
| `src/components/ui/field.tsx` | `Field` wrapper + `inputClass` |
| `src/components/ui/stepper.tsx` | `Stepper` progress indicator |
| `src/components/homeowner/homeowner-wizard.tsx` | `HomeownerWizard` client component (4 steps) |
| `src/app/homeowner/page.tsx` | Server shell rendering the wizard (replaces placeholder) |

---

## Task 1: Test harness, domain types, format helpers, seed data

**Files:**
- Create: `vitest.config.ts`, `src/lib/types.ts`, `src/lib/format.ts`, `src/db/seed.ts`
- Modify: `package.json` (add `test` scripts), add `vitest` dev dependency
- Test: `src/lib/format.test.ts`, `src/db/seed.test.ts`

**Interfaces:**
- Produces:
  - `src/lib/types.ts`: `EnergyLabel`, `PropertyInput`, `Valuation`, `Offer`, `Application`, `TokenizedHome` (shapes below)
  - `src/lib/format.ts`: `formatEUR(n: number): string`, `formatEURPrecise(n: number): string`
  - `src/db/seed.ts`: `CITY_PRICES: Record<string, number>`, `NATIONAL_AVG_PRICE_M2: number` (= 4000), `seedHomes: TokenizedHome[]`

- [ ] **Step 1: Install Vitest**

```bash
cd ~/Claude/valyra-mvp && npm install -D vitest
```

- [ ] **Step 2: Add Vitest config with the `@` alias**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create the domain types**

Create `src/lib/types.ts`:

```ts
export type EnergyLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface PropertyInput {
  address: string;
  city: string;
  areaM2: number;
  bedrooms: number;
  buildYear: number;
  energyLabel: EnergyLabel;
  sharePct: number; // requested share of future appreciation, 5..20
}

export interface Valuation {
  value: number; // point estimate, EUR (rounded to nearest 500)
  low: number; // band lower, EUR
  high: number; // band upper, EUR
  pricePerM2: number; // €/m² used
  cityMatched: boolean; // false => national fallback used
  breakdown: {
    base: number; // area × €/m²
    labelAdj: number; // energy-label multiplier
    ageAdj: number; // build-year multiplier
  };
}

export interface Offer {
  valuation: Valuation;
  sharePct: number; // percent, e.g. 10
  discountPct: number; // risk adjustment, percent
  cashToday: number; // EUR, rounded
  tokenCount: number; // integer
  tokenPrice: number; // EUR per token, 2dp
}

export interface Application {
  id: string;
  input: PropertyInput;
  offer: Offer;
  createdAt: string; // ISO
}

export interface TokenizedHome {
  id: string; // e.g. "VH-0003"
  contractRef: string; // e.g. "VLY-2026-VH-0003"
  address: string;
  city: string;
  valuation: number; // value at tokenization
  sharePct: number;
  tokenCount: number;
  tokenPrice: number;
  cashPaid: number;
  signedAt: string; // ISO
}
```

- [ ] **Step 5: Create deterministic format helpers**

Create `src/lib/format.ts` (manual formatting to stay deterministic across environments — do not use `Intl`):

```ts
// Whole euros with dot thousands separators, e.g. 42500 -> "€42.500".
export function formatEUR(n: number): string {
  const rounded = Math.round(n);
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `€${rounded < 0 ? "-" : ""}${grouped}`;
}

// Two decimals, comma decimal separator, e.g. 4.25 -> "€4,25".
export function formatEURPrecise(n: number): string {
  const [int, dec] = n.toFixed(2).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `€${grouped},${dec}`;
}
```

- [ ] **Step 6: Create seed data**

Create `src/db/seed.ts`:

```ts
import type { TokenizedHome } from "@/lib/types";

// Indicative NL residential €/m² levels (simulated, ~2026). Keys are lowercased.
export const CITY_PRICES: Record<string, number> = {
  amsterdam: 7200,
  rotterdam: 4100,
  "den haag": 4600,
  utrecht: 5500,
  eindhoven: 4300,
  groningen: 3800,
  tilburg: 3500,
  almere: 3700,
  breda: 3900,
  nijmegen: 3900,
};

export const NATIONAL_AVG_PRICE_M2 = 4000;

// Pre-tokenized homes so the (later) marketplace isn't empty.
// Numbers follow the locked model: cash = share × value × 0.85; tokens = share × 1000.
export const seedHomes: TokenizedHome[] = [
  {
    id: "VH-0001",
    contractRef: "VLY-2026-VH-0001",
    address: "Prinsengracht 263",
    city: "Amsterdam",
    valuation: 612_000,
    sharePct: 10,
    tokenCount: 10_000,
    tokenPrice: 5.2,
    cashPaid: 52_020,
    signedAt: "2026-05-02T10:00:00.000Z",
  },
  {
    id: "VH-0002",
    contractRef: "VLY-2026-VH-0002",
    address: "Oudegracht 12",
    city: "Utrecht",
    valuation: 468_000,
    sharePct: 8,
    tokenCount: 8_000,
    tokenPrice: 3.98,
    cashPaid: 31_824,
    signedAt: "2026-05-10T10:00:00.000Z",
  },
];
```

- [ ] **Step 7: Write the failing tests**

Create `src/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { formatEUR, formatEURPrecise } from "@/lib/format";

describe("formatEUR", () => {
  it("formats whole euros with dot thousands separators", () => {
    expect(formatEUR(42500)).toBe("€42.500");
    expect(formatEUR(500000)).toBe("€500.000");
  });
});

describe("formatEURPrecise", () => {
  it("formats with two decimals and a comma decimal separator", () => {
    expect(formatEURPrecise(4.25)).toBe("€4,25");
    expect(formatEURPrecise(4250.5)).toBe("€4.250,50");
  });
});
```

Create `src/db/seed.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { CITY_PRICES, NATIONAL_AVG_PRICE_M2, seedHomes } from "@/db/seed";

describe("seed data", () => {
  it("exposes lowercased city keys with positive €/m²", () => {
    for (const [key, price] of Object.entries(CITY_PRICES)) {
      expect(key).toBe(key.toLowerCase());
      expect(price).toBeGreaterThan(0);
    }
  });

  it("has a national average and at least two seed homes", () => {
    expect(NATIONAL_AVG_PRICE_M2).toBe(4000);
    expect(seedHomes.length).toBeGreaterThanOrEqual(2);
  });

  it("seed homes follow the locked token ratio (1% = 1,000 tokens)", () => {
    for (const h of seedHomes) {
      expect(h.tokenCount).toBe(h.sharePct * 1000);
    }
  });
});
```

- [ ] **Step 8: Run tests to verify they fail, then pass**

```bash
npm test
```

Expected: `format.test.ts` and `seed.test.ts` pass (5 assertions across 5 tests). If a module is missing it FAILS with a resolve error first — create the file, re-run until green.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/lib/types.ts src/lib/format.ts src/db/seed.ts src/lib/format.test.ts src/db/seed.test.ts
git commit -m "feat: add test harness, domain types, format helpers, seed data"
```

---

## Task 2: AVM module (`lib/avm.ts`)

**Files:**
- Create: `src/lib/avm.ts`
- Test: `src/lib/avm.test.ts`

**Interfaces:**
- Consumes: `CITY_PRICES`, `NATIONAL_AVG_PRICE_M2` from `@/db/seed`; `PropertyInput`, `Valuation` from `@/lib/types`.
- Produces: `valuateProperty(input: PropertyInput): Valuation`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/avm.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { valuateProperty } from "@/lib/avm";
import type { PropertyInput } from "@/lib/types";

const base: PropertyInput = {
  address: "Teststraat 1",
  city: "Utrecht",
  areaM2: 85,
  bedrooms: 3,
  buildYear: 2000,
  energyLabel: "D",
  sharePct: 10,
};

describe("valuateProperty", () => {
  it("values a known city deterministically from area × €/m²", () => {
    const v = valuateProperty(base);
    // 85 × 5500 × labelD(1.0) × ageAdj(2000→1.011) = 472,642.5 → €472,500
    expect(v.pricePerM2).toBe(5500);
    expect(v.cityMatched).toBe(true);
    expect(v.value).toBe(472_500);
    expect(v.value % 500).toBe(0);
  });

  it("raises the value for a better energy label", () => {
    const d = valuateProperty(base);
    const a = valuateProperty({ ...base, energyLabel: "A" });
    expect(a.value).toBeGreaterThan(d.value);
  });

  it("falls back to the national average for an unknown city", () => {
    const v = valuateProperty({ ...base, city: "Nowhereville" });
    expect(v.cityMatched).toBe(false);
    expect(v.pricePerM2).toBe(4000);
  });

  it("returns a ±4% confidence band around the value", () => {
    const v = valuateProperty(base);
    expect(v.low).toBeLessThan(v.value);
    expect(v.high).toBeGreaterThan(v.value);
    expect(Math.round(((v.high - v.value) / v.value) * 100)).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/avm.test.ts
```

Expected: FAIL — cannot resolve `@/lib/avm`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/avm.ts`:

```ts
import { CITY_PRICES, NATIONAL_AVG_PRICE_M2 } from "@/db/seed";
import type { EnergyLabel, PropertyInput, Valuation } from "@/lib/types";

// Energy-label multipliers: greener homes carry a small premium.
const LABEL_ADJ: Record<EnergyLabel, number> = {
  A: 1.05,
  B: 1.03,
  C: 1.01,
  D: 1.0,
  E: 0.98,
  F: 0.96,
  G: 0.93,
};

const BAND = 0.04; // ±4% confidence band
const REFERENCE_YEAR = 2026;

function roundTo500(n: number): number {
  return Math.round(n / 500) * 500;
}

export function valuateProperty(input: PropertyInput): Valuation {
  const cityKey = input.city.trim().toLowerCase();
  const matched = CITY_PRICES[cityKey];
  const cityMatched = matched !== undefined;
  const pricePerM2 = matched ?? NATIONAL_AVG_PRICE_M2;

  const base = input.areaM2 * pricePerM2;
  const labelAdj = LABEL_ADJ[input.energyLabel] ?? 1.0;

  // Newer homes worth a little more; older a little less, clamped to ±~10%.
  const age = Math.max(0, REFERENCE_YEAR - input.buildYear);
  const ageAdj = Math.min(1.05, Math.max(0.9, 1.05 - age * 0.0015));

  const value = roundTo500(base * labelAdj * ageAdj);

  return {
    value,
    low: roundTo500(value * (1 - BAND)),
    high: roundTo500(value * (1 + BAND)),
    pricePerM2,
    cityMatched,
    breakdown: { base, labelAdj, ageAdj },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/avm.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/avm.ts src/lib/avm.test.ts
git commit -m "feat: add deterministic Dutch AVM valuation"
```

---

## Task 3: Contract + tokenization module (`lib/contract.ts`)

**Files:**
- Create: `src/lib/contract.ts`
- Test: `src/lib/contract.test.ts`

**Interfaces:**
- Consumes: `Offer`, `Valuation`, `TokenizedHome` from `@/lib/types`.
- Produces:
  - `DISCOUNT_PCT = 15`, `TOKENS_PER_PERCENT = 1000`
  - `buildOffer(valuation: Valuation, sharePct: number): Offer`
  - `mintTokens(offer: Offer, who: { address: string; city: string }, id: string): TokenizedHome`

- [ ] **Step 1: Write the failing test**

Create `src/lib/contract.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  buildOffer,
  mintTokens,
  DISCOUNT_PCT,
  TOKENS_PER_PERCENT,
} from "@/lib/contract";
import type { Valuation } from "@/lib/types";

const valuation: Valuation = {
  value: 500_000,
  low: 480_000,
  high: 520_000,
  pricePerM2: 5000,
  cityMatched: true,
  breakdown: { base: 500_000, labelAdj: 1, ageAdj: 1 },
};

describe("buildOffer", () => {
  it("computes cash today from share × value × (1 − discount)", () => {
    expect(DISCOUNT_PCT).toBe(15);
    expect(buildOffer(valuation, 10).cashToday).toBe(42_500);
  });

  it("mints 1,000 tokens per 1% share and prices them from the cash", () => {
    const offer = buildOffer(valuation, 10);
    expect(TOKENS_PER_PERCENT).toBe(1000);
    expect(offer.tokenCount).toBe(10_000);
    expect(offer.tokenPrice).toBe(4.25);
  });
});

describe("mintTokens", () => {
  it("produces a tokenized home carrying the offer terms and a contract ref", () => {
    const offer = buildOffer(valuation, 10);
    const home = mintTokens(offer, { address: "A 1", city: "Utrecht" }, "VH-0007");
    expect(home.id).toBe("VH-0007");
    expect(home.contractRef).toBe("VLY-2026-VH-0007");
    expect(home.tokenCount).toBe(10_000);
    expect(home.cashPaid).toBe(42_500);
    expect(home.city).toBe("Utrecht");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/contract.test.ts
```

Expected: FAIL — cannot resolve `@/lib/contract`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/contract.ts`:

```ts
import type { Offer, TokenizedHome, Valuation } from "@/lib/types";

// Locked HESA model.
export const DISCOUNT_PCT = 15; // risk adjustment applied to cash today
export const TOKENS_PER_PERCENT = 1000; // 1% share => 1,000 tokens

export function buildOffer(valuation: Valuation, sharePct: number): Offer {
  const cashToday = Math.round(
    (sharePct / 100) * valuation.value * (1 - DISCOUNT_PCT / 100),
  );
  const tokenCount = Math.round(sharePct * TOKENS_PER_PERCENT);
  const tokenPrice = Math.round((cashToday / tokenCount) * 100) / 100;
  return {
    valuation,
    sharePct,
    discountPct: DISCOUNT_PCT,
    cashToday,
    tokenCount,
    tokenPrice,
  };
}

// Simulated on-chain mint. The `id` is assigned by the caller (the store)
// so this stays pure and deterministic for tests.
export function mintTokens(
  offer: Offer,
  who: { address: string; city: string },
  id: string,
): TokenizedHome {
  return {
    id,
    contractRef: `VLY-2026-${id}`,
    address: who.address,
    city: who.city,
    valuation: offer.valuation.value,
    sharePct: offer.sharePct,
    tokenCount: offer.tokenCount,
    tokenPrice: offer.tokenPrice,
    cashPaid: offer.cashToday,
    signedAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/contract.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/contract.ts src/lib/contract.test.ts
git commit -m "feat: add HESA offer math and simulated tokenization"
```

---

## Task 4: In-memory store (`lib/store.ts`)

**Files:**
- Create: `src/lib/store.ts`
- Test: `src/lib/store.test.ts`

**Interfaces:**
- Consumes: `seedHomes` from `@/db/seed`; `mintTokens` from `@/lib/contract`; `Application`, `Offer`, `PropertyInput`, `TokenizedHome` from `@/lib/types`.
- Produces:
  - `getHomes(): TokenizedHome[]`
  - `createApplication(input: PropertyInput, offer: Offer): Application`
  - `signOffer(input: PropertyInput, offer: Offer): TokenizedHome`

> Note: module-level arrays are the swappable data layer. They live in one JS
> module instance (per Node test process; per browser tab at runtime) — fine for
> the in-memory MVP. A Supabase-backed module can later expose the same three
> functions.

- [ ] **Step 1: Write the failing test**

Create `src/lib/store.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getHomes, signOffer, createApplication } from "@/lib/store";
import { buildOffer } from "@/lib/contract";
import type { PropertyInput, Valuation } from "@/lib/types";

const valuation: Valuation = {
  value: 500_000,
  low: 480_000,
  high: 520_000,
  pricePerM2: 5000,
  cityMatched: true,
  breakdown: { base: 500_000, labelAdj: 1, ageAdj: 1 },
};

const input: PropertyInput = {
  address: "Teststraat 1",
  city: "Utrecht",
  areaM2: 85,
  bedrooms: 3,
  buildYear: 2000,
  energyLabel: "D",
  sharePct: 10,
};

describe("store", () => {
  it("starts with the seeded homes", () => {
    expect(getHomes().length).toBeGreaterThanOrEqual(2);
  });

  it("signOffer appends a tokenized home retrievable via getHomes", () => {
    const before = getHomes().length;
    const home = signOffer(input, buildOffer(valuation, 10));
    const after = getHomes();
    expect(after.length).toBe(before + 1);
    expect(after.some((h) => h.id === home.id)).toBe(true);
    expect(home.id).toMatch(/^VH-\d{4}$/);
  });

  it("createApplication records an application with the offer", () => {
    const app = createApplication(input, buildOffer(valuation, 10));
    expect(app.id).toMatch(/^APP-\d{4}$/);
    expect(app.offer.cashToday).toBe(42_500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/store.test.ts
```

Expected: FAIL — cannot resolve `@/lib/store`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/store.ts`:

```ts
import { seedHomes } from "@/db/seed";
import { mintTokens } from "@/lib/contract";
import type {
  Application,
  Offer,
  PropertyInput,
  TokenizedHome,
} from "@/lib/types";

// In-memory data layer (swappable for Supabase behind these same functions).
const homes: TokenizedHome[] = [...seedHomes];
const applications: Application[] = [];

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

export function getHomes(): TokenizedHome[] {
  return [...homes];
}

export function createApplication(
  input: PropertyInput,
  offer: Offer,
): Application {
  const app: Application = {
    id: `APP-${pad4(applications.length + 1)}`,
    input,
    offer,
    createdAt: new Date().toISOString(),
  };
  applications.push(app);
  return app;
}

export function signOffer(
  input: PropertyInput,
  offer: Offer,
): TokenizedHome {
  const id = `VH-${pad4(homes.length + 1)}`;
  const home = mintTokens(offer, { address: input.address, city: input.city }, id);
  homes.push(home);
  return home;
}
```

- [ ] **Step 4: Run the whole suite to verify it passes**

```bash
npm test
```

Expected: PASS — all files green (format, seed, avm, contract, store).

- [ ] **Step 5: Commit**

```bash
git add src/lib/store.ts src/lib/store.test.ts
git commit -m "feat: add in-memory store for applications and tokenized homes"
```

---

## Task 5: UI primitives

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/field.tsx`, `src/components/ui/stepper.tsx`
- Verify: `npm run lint && npm run build`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces:
  - `Button` — props `variant?: "primary" | "secondary" | "ghost"` + native button props
  - `Card` — native div props
  - `Field` — props `{ label: string; hint?: string; children: ReactNode }`; plus exported `inputClass: string`
  - `Stepper` — props `{ steps: string[]; current: number }`

- [ ] **Step 1: Create `Button`**

Create `src/components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-valyra-lime text-valyra-ink hover:-translate-y-0.5",
  secondary: "bg-valyra-ink text-valyra-paper hover:bg-valyra-blue",
  ghost:
    "border border-valyra-ink/15 bg-white hover:border-valyra-blue hover:text-valyra-blue",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Create `Card`**

Create `src/components/ui/card.tsx`:

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-valyra-ink/10 bg-white p-6",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Create `Field` + `inputClass`**

Create `src/components/ui/field.tsx`:

```tsx
import type { ReactNode } from "react";

export const inputClass =
  "rounded-lg border border-valyra-ink/15 bg-white px-3 py-2 text-valyra-ink outline-none focus:border-valyra-blue";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-valyra-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-valyra-ink/50">{hint}</span> : null}
    </label>
  );
}
```

- [ ] **Step 4: Create `Stepper`**

Create `src/components/ui/stepper.tsx`:

```tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                done && "bg-valyra-lime text-valyra-ink",
                active && "bg-valyra-blue text-white",
                !done && !active && "bg-valyra-ink/10 text-valyra-ink/50",
              )}
            >
              {done ? <Check size={16} /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:block",
                active ? "font-semibold text-valyra-ink" : "text-valyra-ink/50",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px flex-1 bg-valyra-ink/15 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 5: Verify lint + build pass**

```bash
npm run lint && npm run build
```

Expected: lint clean; build compiles. (Primitives aren't used yet — this just confirms they're valid.)

- [ ] **Step 6: Commit**

```bash
git add src/components/ui
git commit -m "feat: add Button, Card, Field, Stepper UI primitives"
```

---

## Task 6: Homeowner wizard + route

**Files:**
- Create: `src/components/homeowner/homeowner-wizard.tsx`
- Modify: `src/app/homeowner/page.tsx` (replace the placeholder)
- Verify: `npm run lint && npm run build`, then a manual/headless walkthrough

**Interfaces:**
- Consumes: `valuateProperty` (`@/lib/avm`), `buildOffer` (`@/lib/contract`), `createApplication`/`signOffer` (`@/lib/store`), `formatEUR`/`formatEURPrecise` (`@/lib/format`), `CITY_PRICES` (`@/db/seed`), `Button`/`Card`/`Field`+`inputClass`/`Stepper` (UI primitives), types from `@/lib/types`.
- Produces: `HomeownerWizard` (default-exported? No — named export `HomeownerWizard`).

- [ ] **Step 1: Create the wizard client component**

Create `src/components/homeowner/homeowner-wizard.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";
import { valuateProperty } from "@/lib/avm";
import { buildOffer } from "@/lib/contract";
import { createApplication, signOffer } from "@/lib/store";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { CITY_PRICES } from "@/db/seed";
import type { EnergyLabel, PropertyInput, TokenizedHome } from "@/lib/types";

const STEPS = ["Apply", "Valuation", "Offer", "Sign"];
const LABELS: EnergyLabel[] = ["A", "B", "C", "D", "E", "F", "G"];
// Title-case the seed city keys for the dropdown; valuateProperty re-lowercases.
const CITIES = Object.keys(CITY_PRICES).map((c) =>
  c.replace(/\b\w/g, (m) => m.toUpperCase()),
);

type FormState = {
  address: string;
  city: string;
  areaM2: string;
  bedrooms: string;
  buildYear: string;
  energyLabel: EnergyLabel;
  sharePct: number;
};

const INITIAL: FormState = {
  address: "",
  city: "Utrecht",
  areaM2: "85",
  bedrooms: "3",
  buildYear: "2000",
  energyLabel: "C",
  sharePct: 10,
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-valyra-ink/60">{label}</dt>
      <dd className="font-medium text-valyra-ink">{value}</dd>
    </div>
  );
}

export function HomeownerWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [home, setHome] = useState<TokenizedHome | null>(null);

  const input: PropertyInput = useMemo(
    () => ({
      address: form.address.trim(),
      city: form.city,
      areaM2: Number(form.areaM2) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      buildYear: Number(form.buildYear) || 2000,
      energyLabel: form.energyLabel,
      sharePct: form.sharePct,
    }),
    [form],
  );

  const valuation = useMemo(() => valuateProperty(input), [input]);
  const offer = useMemo(
    () => buildOffer(valuation, form.sharePct),
    [valuation, form.sharePct],
  );

  const applyValid =
    input.address.length > 1 && input.areaM2 > 0 && input.buildYear > 1800;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSign() {
    createApplication(input, offer);
    setHome(signOffer(input, offer));
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-valyra-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back
      </Link>
      <Stepper steps={STEPS} current={step} />

      <div className="mt-8">
        {step === 0 && (
          <Card className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-valyra-ink">
              Tell us about your home
            </h2>
            <Field label="Address">
              <input
                className={inputClass}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Straatnaam 1"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <select
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Floor area (m²)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.areaM2}
                  onChange={(e) => set("areaM2", e.target.value)}
                />
              </Field>
              <Field label="Bedrooms">
                <input
                  type="number"
                  className={inputClass}
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
              </Field>
              <Field label="Build year">
                <input
                  type="number"
                  className={inputClass}
                  value={form.buildYear}
                  onChange={(e) => set("buildYear", e.target.value)}
                />
              </Field>
              <Field label="Energy label">
                <select
                  className={inputClass}
                  value={form.energyLabel}
                  onChange={(e) =>
                    set("energyLabel", e.target.value as EnergyLabel)
                  }
                >
                  {LABELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label={`Share of future appreciation to sell: ${form.sharePct}%`}
              hint="Between 5% and 20%."
            >
              <input
                type="range"
                min={5}
                max={20}
                value={form.sharePct}
                onChange={(e) => set("sharePct", Number(e.target.value))}
                className="accent-valyra-blue"
              />
            </Field>
            <div className="flex justify-end">
              <Button disabled={!applyValid} onClick={() => setStep(1)}>
                Get my valuation <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-valyra-ink">
              Estimated value
            </h2>
            <p className="text-4xl font-semibold text-valyra-blue">
              {formatEUR(valuation.value)}
            </p>
            <p className="text-sm text-valyra-ink/60">
              Confidence band {formatEUR(valuation.low)} –{" "}
              {formatEUR(valuation.high)}
              {!valuation.cityMatched &&
                " · national average used for this city"}
            </p>
            <div className="rounded-xl bg-valyra-paper/60 p-4 text-sm text-valyra-ink/80">
              <p className="font-medium">How we valued this</p>
              <ul className="mt-2 space-y-1">
                <li>
                  {input.areaM2} m² × {formatEUR(valuation.pricePerM2)}/m² (price
                  for {form.city})
                </li>
                <li>
                  Energy label {form.energyLabel} adjustment ×
                  {valuation.breakdown.labelAdj.toFixed(2)}
                </li>
                <li>
                  Build year {form.buildYear} adjustment ×
                  {valuation.breakdown.ageAdj.toFixed(3)}
                </li>
              </ul>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button onClick={() => setStep(2)}>
                See my offer <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-valyra-ink">Your offer</h2>
            <div className="rounded-xl bg-valyra-lime/15 p-5">
              <p className="text-sm text-valyra-ink/70">Cash to you today</p>
              <p className="text-4xl font-semibold text-valyra-ink">
                {formatEUR(offer.cashToday)}
              </p>
            </div>
            <dl className="divide-y divide-valyra-ink/10 text-sm">
              <Row label="Home value" value={formatEUR(valuation.value)} />
              <Row
                label="Share of future appreciation sold"
                value={`${offer.sharePct}%`}
              />
              <Row
                label="Risk adjustment (discount)"
                value={`${offer.discountPct}%`}
              />
              <Row
                label="Tokens minted"
                value={offer.tokenCount.toLocaleString("nl-NL")}
              />
              <Row
                label="Token price"
                value={formatEURPrecise(offer.tokenPrice)}
              />
            </dl>
            <p className="text-xs text-valyra-ink/50">
              No debt, no interest, no monthly payments. You settle the share
              when you sell or refinance.
            </p>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button onClick={handleSign}>
                Sign agreement <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && home && (
          <Card className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="text-valyra-lime" size={48} />
            <h2 className="text-xl font-semibold text-valyra-ink">
              Agreement signed
            </h2>
            <p className="text-valyra-ink/70">
              {formatEUR(home.cashPaid)} is on its way. Your home is tokenized
              and listed for investors.
            </p>
            <dl className="mt-2 w-full divide-y divide-valyra-ink/10 text-left text-sm">
              <Row label="Home ID" value={home.id} />
              <Row label="Contract reference" value={home.contractRef} />
              <Row
                label="Tokens issued"
                value={home.tokenCount.toLocaleString("nl-NL")}
              />
            </dl>
            <Link href="/investor" className="mt-2">
              <Button variant="secondary">
                View it in the marketplace <ArrowRight size={18} />
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace the homeowner route placeholder**

Replace the entire contents of `src/app/homeowner/page.tsx`:

```tsx
import { HomeownerWizard } from "@/components/homeowner/homeowner-wizard";

export default function HomeownerPage() {
  return (
    <main className="min-h-screen bg-valyra-paper">
      <HomeownerWizard />
    </main>
  );
}
```

- [ ] **Step 3: Verify lint + build**

```bash
npm run lint && npm run build
```

Expected: lint clean; build compiles; `/homeowner` listed in the route output.

- [ ] **Step 4: Manual / headless walkthrough**

With the dev server running (`npm run dev`), capture step 0:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --window-size=1280,1200 --screenshot=/tmp/valyra-homeowner.png http://localhost:3000/homeowner
```

Expected: the Apply form renders with the stepper at step 1. Manually click through Apply → Valuation → Offer → Sign and confirm the cash and token figures match the model. Reproducible check — set Utrecht, 85 m², build year 2000, **energy label D**, 10% share → value **€472,500**, cash **€40,162** (`0.10 × 472,500 × 0.85`), tokens **10,000**. (The form defaults to label C, which instead gives €477,500 / €40,588 — also correct.)

- [ ] **Step 5: Run the full test suite once more**

```bash
npm test
```

Expected: all unit tests still green.

- [ ] **Step 6: Commit**

```bash
git add src/components/homeowner/homeowner-wizard.tsx src/app/homeowner/page.tsx
git commit -m "feat: add homeowner wizard (apply, valuation, offer, sign)"
```

---

## Self-Review Notes

- **Spec coverage:** Apply/Valuation/Offer/Sign → Task 6; AVM deterministic Dutch model → Task 2; proportional offer + tokenization → Task 3; in-memory swappable store + signed `TokenizedHome` retrievable via `getHomes` → Task 4; 5–20% share, 15% discount, 1%=1,000 tokens, ±4% band → enforced in Tasks 2–3 and the wizard; seed homes for the later marketplace → Task 1.
- **Type consistency:** `valuateProperty → Valuation`, `buildOffer(Valuation, number) → Offer`, `mintTokens(Offer, {address,city}, id) → TokenizedHome`, `signOffer(PropertyInput, Offer) → TokenizedHome` are consistent across tasks and tests.
- **Edge cases:** unknown city → national fallback (Task 2 test); apply validation gates step advance (Task 6).
