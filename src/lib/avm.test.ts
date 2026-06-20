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
