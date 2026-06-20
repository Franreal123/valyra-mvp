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
