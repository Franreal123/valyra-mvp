import { CITY_PRICES, NATIONAL_AVG_PRICE_M2 } from "@/db/seed";
import type { EnergyLabel, PropertyInput, Valuation } from "@/lib/types";

// Energy-label multipliers: greener homes carry a small premium.
const LABEL_ADJ: Record<EnergyLabel, number> = {
  A: 1.05,
  B: 1.03,
  C: 1.01,
  D: 1.0,
  E: 0.98,
  F: 0.96,
  G: 0.93,
};

const BAND = 0.04; // ±4% confidence band
const REFERENCE_YEAR = 2026;

function roundTo500(n: number): number {
  return Math.round(n / 500) * 500;
}

export function valuateProperty(input: PropertyInput): Valuation {
  const cityKey = input.city.trim().toLowerCase();
  const matched = CITY_PRICES[cityKey];
  const cityMatched = matched !== undefined;
  const pricePerM2 = matched ?? NATIONAL_AVG_PRICE_M2;

  const base = input.areaM2 * pricePerM2;
  const labelAdj = LABEL_ADJ[input.energyLabel] ?? 1.0;

  // Newer homes worth a little more; older a little less, clamped to ±~10%.
  const age = Math.max(0, REFERENCE_YEAR - input.buildYear);
  const ageAdj = Math.min(1.05, Math.max(0.9, 1.05 - age * 0.0015));

  const areaEstimate = base * labelAdj * ageAdj;
  // Anchor to the official WOZ-waarde when supplied: weight the area model 65%,
  // WOZ 35% (WOZ tends to lag market, so it's a sanity anchor, not the driver).
  const woz = input.wozValue && input.wozValue > 0 ? input.wozValue : null;
  const value = roundTo500(woz ? 0.65 * areaEstimate + 0.35 * woz : areaEstimate);

  return {
    value,
    low: roundTo500(value * (1 - BAND)),
    high: roundTo500(value * (1 + BAND)),
    pricePerM2,
    cityMatched,
    breakdown: { base, labelAdj, ageAdj },
  };
}
