import type { Holding, TokenizedHome } from "@/lib/types";

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

// Pre-existing investor holdings so marketplace homes show partial funding.
// invested = tokens × tokenPrice (the home's mint price at purchase).
export const seedHoldings: Holding[] = [
  {
    id: "HLD-0001",
    homeId: "VH-0001",
    tokens: 3_000,
    tokenPrice: 5.2,
    invested: 15_600,
    purchasedAt: "2026-05-04T09:00:00.000Z",
  },
  {
    id: "HLD-0002",
    homeId: "VH-0002",
    tokens: 1_500,
    tokenPrice: 3.98,
    invested: 5_970,
    purchasedAt: "2026-05-12T09:00:00.000Z",
  },
];
