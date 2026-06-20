import { currentTokenPrice } from "@/lib/market";
import type { Holding, TokenizedHome } from "@/lib/types";

export interface PlatformStats {
  homesCount: number;
  tokensIssued: number; // total minted across all homes
  tokensSold: number; // total held by investors
  fundedPct: number; // tokensSold / tokensIssued, 1dp
  capitalRaised: number; // EUR paid out to homeowners (sum cashPaid)
  capitalDeployed: number; // EUR invested by investors (sum invested)
  positions: number; // number of holdings
}

export function platformStats(
  homes: TokenizedHome[],
  holdings: Holding[],
): PlatformStats {
  const tokensIssued = homes.reduce((s, h) => s + h.tokenCount, 0);
  const tokensSold = holdings.reduce((s, h) => s + h.tokens, 0);
  return {
    homesCount: homes.length,
    tokensIssued,
    tokensSold,
    fundedPct:
      tokensIssued > 0 ? Math.round((tokensSold / tokensIssued) * 1000) / 10 : 0,
    capitalRaised: homes.reduce((s, h) => s + h.cashPaid, 0),
    capitalDeployed: holdings.reduce((s, h) => s + h.invested, 0),
    positions: holdings.length,
  };
}

export interface SettlementQuote {
  homeId: string;
  tokensHeld: number; // investor-held tokens for this home
  payout: number; // EUR owed to holders, valued at the current token price
}

// What it costs to settle a home: pay every held token its current value.
export function settlementQuote(
  home: TokenizedHome,
  holdings: Holding[],
): SettlementQuote {
  const tokensHeld = holdings
    .filter((h) => h.homeId === home.id)
    .reduce((s, h) => s + h.tokens, 0);
  return {
    homeId: home.id,
    tokensHeld,
    payout: Math.round(tokensHeld * currentTokenPrice(home)),
  };
}
