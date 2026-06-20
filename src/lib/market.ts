import type { Holding, TokenizedHome } from "@/lib/types";

// Minimum a retail investor can put into a single buy.
export const MIN_INVESTMENT_EUR = 100;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// Deterministic, simulated appreciation per home (2..14%), derived from the
// home id so the marketplace and portfolio are reproducible across reloads.
export function simulateAppreciationPct(home: TokenizedHome): number {
  let sum = 0;
  for (const ch of home.id) sum += ch.charCodeAt(0);
  return (sum % 13) + 2;
}

// Present per-token price: the mint price grown by the home's appreciation.
export function currentTokenPrice(home: TokenizedHome): number {
  return round2(home.tokenPrice * (1 + simulateAppreciationPct(home) / 100));
}

// Fewest whole tokens that still clears the €100 minimum at this price.
export function minTokens(tokenPrice: number): number {
  return Math.ceil(MIN_INVESTMENT_EUR / tokenPrice);
}

// Whole tokens an amount buys at a given price.
export function tokensForAmount(amountEUR: number, tokenPrice: number): number {
  return Math.floor(amountEUR / tokenPrice);
}

export interface Position {
  homeId: string;
  home: TokenizedHome;
  tokens: number;
  invested: number;
  currentValue: number;
  gain: number;
  gainPct: number;
}

export interface PortfolioSummary {
  invested: number;
  currentValue: number;
  gain: number;
  gainPct: number;
  positions: Position[];
}

// Aggregate holdings by home and value them at the current token price.
export function summarisePortfolio(
  holdings: Holding[],
  homes: TokenizedHome[],
): PortfolioSummary {
  const homeById = new Map(homes.map((h) => [h.id, h]));
  const byHome = new Map<string, { tokens: number; invested: number }>();
  for (const h of holdings) {
    const agg = byHome.get(h.homeId) ?? { tokens: 0, invested: 0 };
    agg.tokens += h.tokens;
    agg.invested += h.invested;
    byHome.set(h.homeId, agg);
  }

  const positions: Position[] = [];
  for (const [homeId, agg] of Array.from(byHome.entries())) {
    const home = homeById.get(homeId);
    if (!home) continue; // holding for an unknown home is skipped
    const currentValue = Math.round(agg.tokens * currentTokenPrice(home));
    const gain = currentValue - agg.invested;
    const gainPct = agg.invested > 0 ? round1((gain / agg.invested) * 100) : 0;
    positions.push({
      homeId,
      home,
      tokens: agg.tokens,
      invested: agg.invested,
      currentValue,
      gain,
      gainPct,
    });
  }

  const invested = positions.reduce((s, p) => s + p.invested, 0);
  const currentValue = positions.reduce((s, p) => s + p.currentValue, 0);
  const gain = currentValue - invested;
  const gainPct = invested > 0 ? round1((gain / invested) * 100) : 0;
  return { invested, currentValue, gain, gainPct, positions };
}
