import type { TokenizedHome } from "@/lib/types";
import { simulateAppreciationPct } from "@/lib/market";

// HESA agreement term. Investors share a Dutch home's value change over this
// horizon (or until the homeowner sells/refinances and settles early).
export const TERM_YEARS = 10;

// Stress scenarios for the home's TOTAL value change over the term. "Base"
// is filled in per home from its expected appreciation; bear/bull are fixed
// stress paths so the downside is always shown (homes can fall, not only rise).
export const BEAR_CHANGE_PCT = -15;
export const BULL_CHANGE_PCT = 25;

export interface Scenario {
  label: "Bear" | "Base" | "Bull";
  homeChangePct: number; // total home-value change over the term
  endingValue: number; // EUR value of the position at settlement
  gain: number; // endingValue − invested
  totalReturnPct: number; // proportional to the home's change
  irrPct: number; // annualized return over TERM_YEARS, 1dp
}

// Annualized internal rate of return from an ending/invested ratio.
export function annualizedReturnPct(ratio: number, years: number): number {
  if (ratio <= 0) return -100;
  return Math.round((Math.pow(ratio, 1 / years) - 1) * 1000) / 10;
}

// Project an investment of `invested` EUR across bear / base / bull paths.
// A token tracks the home proportionally, so the position's return equals the
// home's value change — including losses.
export function projectScenarios(
  invested: number,
  baseChangePct: number,
): Scenario[] {
  const defs: { label: Scenario["label"]; homeChangePct: number }[] = [
    { label: "Bear", homeChangePct: BEAR_CHANGE_PCT },
    { label: "Base", homeChangePct: baseChangePct },
    { label: "Bull", homeChangePct: BULL_CHANGE_PCT },
  ];
  return defs.map(({ label, homeChangePct }) => {
    const ratio = 1 + homeChangePct / 100;
    const endingValue = Math.round(invested * ratio);
    return {
      label,
      homeChangePct,
      endingValue,
      gain: endingValue - invested,
      totalReturnPct: homeChangePct,
      irrPct: annualizedReturnPct(ratio, TERM_YEARS),
    };
  });
}

// Convenience: scenarios for buying `invested` EUR of a specific home, using
// the home's simulated appreciation as the base case.
export function projectHomeScenarios(
  home: TokenizedHome,
  invested: number,
): Scenario[] {
  return projectScenarios(invested, simulateAppreciationPct(home));
}
