// A HESA is JUNIOR to the existing mortgage: the homeowner can only responsibly
// tokenize their *unmortgaged* equity. This module turns a home value + mortgage
// into an eligibility assessment for the offer.

export const MAX_SHARE_PCT = 20;

export interface EquityAssessment {
  value: number;
  mortgageBalance: number;
  equity: number; // value − mortgage, floored at 0
  ltvPct: number; // loan-to-value, 1dp
  equityPct: number; // unmortgaged equity as % of value, 1dp
  maxSharePct: number; // most the homeowner may tokenize (capped at MAX_SHARE_PCT)
  eligible: boolean; // does the requested share fit?
}

export function assessEquity(
  value: number,
  mortgageBalance: number,
  requestedSharePct: number,
): EquityAssessment {
  const mortgage = Math.max(0, mortgageBalance);
  const equity = value - mortgage;
  const ltvPct = value > 0 ? Math.round((mortgage / value) * 1000) / 10 : 0;
  const equityPct = value > 0 ? Math.round((equity / value) * 1000) / 10 : 0;
  // Can't tokenize more appreciation than the unmortgaged stake; cap at product max.
  const maxSharePct = Math.max(0, Math.min(MAX_SHARE_PCT, Math.floor(equityPct)));
  const eligible = equity > 0 && requestedSharePct <= maxSharePct;
  return {
    value,
    mortgageBalance: mortgage,
    equity: Math.max(0, equity),
    ltvPct,
    equityPct,
    maxSharePct,
    eligible,
  };
}
