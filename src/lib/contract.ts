import type { Offer, TokenizedHome, Valuation } from "@/lib/types";

// Locked HESA model.
export const DISCOUNT_PCT = 15; // risk adjustment applied to cash today
export const TOKENS_PER_PERCENT = 1000; // 1% share => 1,000 tokens

export function buildOffer(valuation: Valuation, sharePct: number): Offer {
  const cashToday = Math.round(
    (sharePct / 100) * valuation.value * (1 - DISCOUNT_PCT / 100),
  );
  const tokenCount = Math.round(sharePct * TOKENS_PER_PERCENT);
  const tokenPrice = Math.round((cashToday / tokenCount) * 100) / 100;
  return {
    valuation,
    sharePct,
    discountPct: DISCOUNT_PCT,
    cashToday,
    tokenCount,
    tokenPrice,
  };
}

// Simulated on-chain mint. The `id` is assigned by the caller (the store)
// so this stays pure and deterministic for tests.
export function mintTokens(
  offer: Offer,
  who: { address: string; city: string },
  id: string,
): TokenizedHome {
  return {
    id,
    contractRef: `VLY-2026-${id}`,
    address: who.address,
    city: who.city,
    valuation: offer.valuation.value,
    sharePct: offer.sharePct,
    tokenCount: offer.tokenCount,
    tokenPrice: offer.tokenPrice,
    cashPaid: offer.cashToday,
    signedAt: new Date().toISOString(),
  };
}
