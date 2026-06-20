import { describe, it, expect } from "vitest";
import {
  TERM_YEARS,
  annualizedReturnPct,
  projectScenarios,
  projectHomeScenarios,
} from "@/lib/scenarios";
import type { TokenizedHome } from "@/lib/types";

describe("annualizedReturnPct", () => {
  it("annualizes a positive total return over the term", () => {
    // 1.08^(1/10) − 1 ≈ 0.77%
    expect(annualizedReturnPct(1.08, 10)).toBe(0.8);
  });

  it("returns the worst case for a wipe-out", () => {
    expect(annualizedReturnPct(0, 10)).toBe(-100);
  });
});

describe("projectScenarios", () => {
  it("models bear, base, and bull paths including losses", () => {
    const [bear, base, bull] = projectScenarios(10_000, 8);

    expect(bear.label).toBe("Bear");
    expect(bear.homeChangePct).toBe(-15);
    expect(bear.endingValue).toBe(8_500); // 10,000 × 0.85
    expect(bear.gain).toBe(-1_500);
    expect(bear.irrPct).toBeLessThan(0); // downside is real

    expect(base.homeChangePct).toBe(8);
    expect(base.endingValue).toBe(10_800);
    expect(base.gain).toBe(800);

    expect(bull.endingValue).toBe(12_500); // 10,000 × 1.25
    expect(bull.irrPct).toBeGreaterThan(base.irrPct);
  });
});

describe("projectHomeScenarios", () => {
  it("uses the home's appreciation as the base case", () => {
    const home: TokenizedHome = {
      id: "VH-0001", // appreciation 8%
      contractRef: "VLY-2026-VH-0001",
      address: "Prinsengracht 263",
      city: "Amsterdam",
      valuation: 612_000,
      sharePct: 10,
      tokenCount: 10_000,
      tokenPrice: 5.2,
      cashPaid: 52_020,
      signedAt: "2026-05-02T10:00:00.000Z",
    };
    const base = projectHomeScenarios(home, 1_000).find((s) => s.label === "Base");
    expect(TERM_YEARS).toBe(10);
    expect(base?.homeChangePct).toBe(8);
    expect(base?.endingValue).toBe(1_080);
  });
});
