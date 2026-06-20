import { describe, it, expect } from "vitest";
import {
  getHomes,
  signOffer,
  createApplication,
  getHoldings,
  getHome,
  tokensSold,
  tokensAvailable,
  buyTokens,
  isSettled,
  settleHome,
  getSettledIds,
  getActiveHomes,
  getSettlementPayout,
  resetDemo,
  isKycVerified,
  completeKyc,
  getUserHoldings,
  getListings,
  buyListing,
} from "@/lib/store";
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

describe("investor store", () => {
  it("starts with the seeded holdings", () => {
    expect(getHoldings().length).toBeGreaterThanOrEqual(2);
  });

  it("tokensAvailable subtracts sold tokens from the mint count", () => {
    const home = getHome("VH-0001");
    expect(home).toBeDefined();
    expect(tokensSold("VH-0001")).toBe(3000); // seed holding
    expect(tokensAvailable(home!)).toBe(7000); // 10,000 − 3,000
  });

  it("buyTokens records a holding and reduces availability", () => {
    const before = tokensAvailable(getHome("VH-0001")!);
    const h = buyTokens("VH-0001", 100);
    expect(h.id).toMatch(/^HLD-\d{4}$/);
    expect(h.invested).toBe(520); // 100 × 5.2
    expect(tokensAvailable(getHome("VH-0001")!)).toBe(before - 100);
  });

  it("buyTokens throws on unknown home or oversell", () => {
    expect(() => buyTokens("VH-9999", 1)).toThrow();
    const home = getHome("VH-0002")!;
    expect(() => buyTokens("VH-0002", tokensAvailable(home) + 1)).toThrow();
  });

  it("settleHome buys out holders, removes holdings, and records the payout", () => {
    // VH-0003 appreciation 10% -> current token price 3.74; 4,000 held
    expect(isSettled("VH-0003")).toBe(false);
    const payout = settleHome("VH-0003");
    expect(payout).toBe(14_960); // 4,000 × 3.74
    expect(isSettled("VH-0003")).toBe(true);
    expect(getSettledIds()).toContain("VH-0003");
    expect(getSettlementPayout("VH-0003")).toBe(14_960);
    expect(tokensSold("VH-0003")).toBe(0); // holdings bought out
    expect(getActiveHomes().some((h) => h.id === "VH-0003")).toBe(false);
  });

  it("settleHome throws for an unknown home", () => {
    expect(() => settleHome("VH-9999")).toThrow();
  });

  it("resetDemo restores the seeded state", () => {
    settleHome("VH-0006");
    buyTokens("VH-0004", 50);
    resetDemo();
    expect(getHoldings().length).toBe(6); // 4 user + 2 market holdings
    expect(getUserHoldings().length).toBe(4); // only the user's
    expect(getListings().length).toBe(2);
    expect(getSettledIds().length).toBe(0);
    expect(getActiveHomes().length).toBe(6); // all seed homes active again
  });

  it("KYC starts unverified, completeKyc verifies, resetDemo clears it", () => {
    expect(isKycVerified()).toBe(false);
    completeKyc();
    expect(isKycVerified()).toBe(true);
    resetDemo();
    expect(isKycVerified()).toBe(false);
  });
});

describe("secondary market", () => {
  it("buyListing transfers tokens from the market to you, supply unchanged", () => {
    resetDemo(); // clean baseline
    const listingsBefore = getListings().length;
    const soldBefore = tokensSold("VH-0004");
    const userBefore = getUserHoldings().length;

    const h = buyListing("LST-0001"); // 1,500 @ €5.10
    expect(h.owner).toBe("you");
    expect(h.tokens).toBe(1_500);
    expect(h.invested).toBe(7_650); // 1,500 × 5.10
    expect(getListings().length).toBe(listingsBefore - 1);
    // a transfer between holders — the home's sold supply does not change
    expect(tokensSold("VH-0004")).toBe(soldBefore);
    expect(getUserHoldings().length).toBe(userBefore + 1);
    expect(getUserHoldings().some((x) => x.id === h.id)).toBe(true);
  });

  it("buyListing throws for an unknown listing", () => {
    expect(() => buyListing("LST-9999")).toThrow();
  });
});
