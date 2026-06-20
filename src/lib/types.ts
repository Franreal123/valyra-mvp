export type EnergyLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface PropertyInput {
  address: string;
  city: string;
  areaM2: number;
  bedrooms: number;
  buildYear: number;
  energyLabel: EnergyLabel;
  sharePct: number; // requested share of future appreciation, 5..20
  mortgageBalance?: number; // outstanding mortgage (EUR); HESA is junior to it
  wozValue?: number; // official municipal valuation (WOZ-waarde), optional AVM anchor
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

export interface Holding {
  id: string; // e.g. "HLD-0001"
  homeId: string; // FK -> TokenizedHome.id
  tokens: number; // whole tokens bought
  tokenPrice: number; // price paid per token at purchase (the mint price)
  invested: number; // tokens × tokenPrice, EUR
  purchasedAt: string; // ISO
}
