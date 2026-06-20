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
