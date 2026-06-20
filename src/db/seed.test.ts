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
