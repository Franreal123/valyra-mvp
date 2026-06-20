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
  {
    id: "VH-0003",
    contractRef: "VLY-2026-VH-0003",
    address: "Witte de Withstraat 44",
    city: "Rotterdam",
    valuation: 400_000,
    sharePct: 10,
    tokenCount: 10_000,
    tokenPrice: 3.4, // 34,000 / 10,000
    cashPaid: 34_000, // 0.10 × 400,000 × 0.85
    signedAt: "2026-05-14T10:00:00.000Z",
  },
  {
    id: "VH-0004",
    contractRef: "VLY-2026-VH-0004",
    address: "Denneweg 7",
    city: "Den Haag",
    valuation: 560_000,
    sharePct: 8,
    tokenCount: 8_000,
    tokenPrice: 4.76, // 38,080 / 8,000
    cashPaid: 38_080, // 0.08 × 560,000 × 0.85
    signedAt: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "VH-0005",
    contractRef: "VLY-2026-VH-0005",
    address: "Stratumseind 21",
    city: "Eindhoven",
    valuation: 340_000,
    sharePct: 15,
    tokenCount: 15_000,
    tokenPrice: 2.89, // 43,350 / 15,000
    cashPaid: 43_350, // 0.15 × 340,000 × 0.85
    signedAt: "2026-05-22T10:00:00.000Z",
  },
  {
    id: "VH-0006",
    contractRef: "VLY-2026-VH-0006",
    address: "Folkingestraat 9",
    city: "Groningen",
    valuation: 300_000,
    sharePct: 12,
    tokenCount: 12_000,
    tokenPrice: 2.55, // 30,600 / 12,000
    cashPaid: 30_600, // 0.12 × 300,000 × 0.85
    signedAt: "2026-05-26T10:00:00.000Z",
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
  {
    id: "HLD-0003",
    homeId: "VH-0003",
    tokens: 4_000,
    tokenPrice: 3.4,
    invested: 13_600,
    purchasedAt: "2026-05-16T09:00:00.000Z",
  },
  {
    id: "HLD-0004",
    homeId: "VH-0005",
    tokens: 2_000,
    tokenPrice: 2.89,
    invested: 5_780,
    purchasedAt: "2026-05-24T09:00:00.000Z",
  },
];
