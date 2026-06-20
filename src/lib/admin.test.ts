import { describe, it, expect } from "vitest";
import { platformStats, settlementQuote } from "@/lib/admin";
import type { Holding, TokenizedHome } from "@/lib/types";

const homes: TokenizedHome[] = [
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

const holdings: Holding[] = [
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

describe("platformStats", () => {
  it("aggregates supply and capital across homes and holdings", () => {
    const s = platformStats(homes, holdings);
    expect(s.homesCount).toBe(2);
    expect(s.tokensIssued).toBe(18_000); // 10,000 + 8,000
    expect(s.tokensSold).toBe(4_500); // 3,000 + 1,500
    expect(s.fundedPct).toBe(25); // 4,500 / 18,000
    expect(s.capitalRaised).toBe(83_844); // 52,020 + 31,824
    expect(s.capitalDeployed).toBe(21_570); // 15,600 + 5,970
    expect(s.positions).toBe(2);
  });

  it("handles an empty platform without dividing by zero", () => {
    const s = platformStats([], []);
    expect(s.fundedPct).toBe(0);
    expect(s.tokensIssued).toBe(0);
  });
});

describe("settlementQuote", () => {
  it("pays every held token its current value", () => {
    // VH-0001 appreciation 8% -> current token price 5.62; 3,000 held
    const q = settlementQuote(homes[0], holdings);
    expect(q.tokensHeld).toBe(3_000);
    expect(q.payout).toBe(16_860); // 3,000 × 5.62
  });

  it("returns a zero payout for a home with no holders", () => {
    const q = settlementQuote(homes[0], []);
    expect(q.tokensHeld).toBe(0);
    expect(q.payout).toBe(0);
  });
});
