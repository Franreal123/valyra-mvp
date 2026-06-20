import { describe, it, expect } from "vitest";
import {
  MIN_INVESTMENT_EUR,
  simulateAppreciationPct,
  currentTokenPrice,
  currentHomeValue,
  minTokens,
  tokensForAmount,
  summarisePortfolio,
} from "@/lib/market";
import type { Holding, TokenizedHome } from "@/lib/types";

const home: TokenizedHome = {
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
};

describe("market math", () => {
  it("appreciation is deterministic and within 2..14%", () => {
    const a = simulateAppreciationPct(home);
    expect(a).toBe(simulateAppreciationPct(home));
    expect(a).toBeGreaterThanOrEqual(2);
    expect(a).toBeLessThanOrEqual(14);
  });

  it("current token price applies appreciation to the mint price (2dp)", () => {
    expect(simulateAppreciationPct(home)).toBe(8); // VH-0001 -> 8%
    expect(currentTokenPrice(home)).toBe(5.62); // 5.2 × 1.08 = 5.616 -> 5.62
  });

  it("current home value applies appreciation to the valuation", () => {
    expect(currentHomeValue(home)).toBe(660_960); // 612,000 × 1.08
  });

  it("minTokens enforces the €100 minimum", () => {
    expect(MIN_INVESTMENT_EUR).toBe(100);
    expect(minTokens(5.2)).toBe(20); // ceil(100/5.2) = ceil(19.23) = 20
  });

  it("tokensForAmount floors to whole tokens", () => {
    expect(tokensForAmount(1000, 5.2)).toBe(192); // floor(192.31)
  });
});

describe("summarisePortfolio", () => {
  const holdings: Holding[] = [
    {
      id: "HLD-1",
      homeId: "VH-0001",
      tokens: 1000,
      tokenPrice: 5.2,
      invested: 5200,
      purchasedAt: "2026-05-04T09:00:00.000Z",
    },
  ];

  it("computes current value and gain from appreciation", () => {
    const s = summarisePortfolio(holdings, [home]);
    expect(s.invested).toBe(5200);
    expect(s.currentValue).toBe(5620); // 1000 × 5.62
    expect(s.gain).toBe(420);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].homeId).toBe("VH-0001");
  });

  it("aggregates multiple holdings of the same home into one position", () => {
    const two: Holding[] = [
      ...holdings,
      {
        id: "HLD-2",
        homeId: "VH-0001",
        tokens: 500,
        tokenPrice: 5.2,
        invested: 2600,
        purchasedAt: "2026-05-05T09:00:00.000Z",
      },
    ];
    const s = summarisePortfolio(two, [home]);
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].tokens).toBe(1500);
    expect(s.invested).toBe(7800);
  });

  it("skips holdings whose home is unknown", () => {
    const orphan: Holding[] = [
      {
        id: "HLD-X",
        homeId: "VH-9999",
        tokens: 10,
        tokenPrice: 1,
        invested: 10,
        purchasedAt: "2026-05-05T09:00:00.000Z",
      },
    ];
    const s = summarisePortfolio(orphan, [home]);
    expect(s.positions).toHaveLength(0);
    expect(s.invested).toBe(0);
  });
});
