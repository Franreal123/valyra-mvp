import { describe, it, expect } from "vitest";
import { assessEquity, MAX_SHARE_PCT } from "@/lib/eligibility";

describe("assessEquity", () => {
  it("caps the sellable share at the unmortgaged equity percentage", () => {
    // €500k value, €350k mortgage → €150k equity = 30% → but capped at product max 20%
    const a = assessEquity(500_000, 350_000, 10);
    expect(a.equity).toBe(150_000);
    expect(a.ltvPct).toBe(70);
    expect(a.equityPct).toBe(30);
    expect(a.maxSharePct).toBe(MAX_SHARE_PCT); // min(20, floor(30)) = 20
    expect(a.eligible).toBe(true);
  });

  it("limits the share when equity is thin", () => {
    // €400k value, €352k mortgage → €48k equity = 12% → max 12%
    const a = assessEquity(400_000, 352_000, 15);
    expect(a.equityPct).toBe(12);
    expect(a.maxSharePct).toBe(12);
    expect(a.eligible).toBe(false); // requested 15% > 12%
    expect(assessEquity(400_000, 352_000, 10).eligible).toBe(true);
  });

  it("is ineligible with no equity (underwater or fully mortgaged)", () => {
    const a = assessEquity(400_000, 420_000, 5);
    expect(a.equity).toBe(0);
    expect(a.equityPct).toBe(0); // not a contradictory negative %
    expect(a.maxSharePct).toBe(0);
    expect(a.eligible).toBe(false);
  });

  it("floors the raw equity ratio, not the rounded display %", () => {
    // €39,980 equity on €400k = 9.995% → must allow at most 9%, not round up to 10%
    const a = assessEquity(400_000, 360_020, 10);
    expect(a.equityPct).toBe(10); // display rounds to 10.0%
    expect(a.maxSharePct).toBe(9); // but the allowance floors the raw 9.995%
    expect(a.eligible).toBe(false);
  });

  it("treats a zero mortgage as fully eligible up to the product max", () => {
    const a = assessEquity(500_000, 0, 20);
    expect(a.ltvPct).toBe(0);
    expect(a.maxSharePct).toBe(20);
    expect(a.eligible).toBe(true);
  });
});
