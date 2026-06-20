// CLIENT-ONLY: every value here is in-memory, module-level singleton state.
// In production this becomes a Supabase-backed module behind the same interface.
// Until then, do NOT import this from a Server Component or Server Action — the
// singletons (incl. `kycVerified`) would be shared across all requests/users.
// Invariants like "KYC before buyTokens" are enforced in the UI, not here.
import {
  seedHomes,
  seedHoldings,
  seedMarketHoldings,
  seedListings,
} from "@/db/seed";
import { mintTokens } from "@/lib/contract";
import { settlementQuote } from "@/lib/admin";
import type {
  Application,
  Holding,
  Listing,
  Offer,
  PropertyInput,
  TokenizedHome,
} from "@/lib/types";

// In-memory data layer (swappable for Supabase behind these same functions).
const homes: TokenizedHome[] = [...seedHomes];
const applications: Application[] = [];
// All token holdings (yours + the "market"). tokensSold counts both.
const holdings: Holding[] = [...seedHoldings, ...seedMarketHoldings];
const listings: Listing[] = [...seedListings];
const settledIds = new Set<string>();
const settlementPayouts = new Map<string, number>(); // homeId -> EUR paid out
// Monotonic so holding ids stay unique even as holdings are spliced out
// (buying a listing removes a market holding, shrinking the array).
let holdingSeq = seedHoldings.length;

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

export function getHomes(): TokenizedHome[] {
  return [...homes];
}

// Homes still open for investment (settled homes have exited the platform).
export function getActiveHomes(): TokenizedHome[] {
  return homes.filter((h) => !settledIds.has(h.id));
}

export function createApplication(
  input: PropertyInput,
  offer: Offer,
): Application {
  const app: Application = {
    id: `APP-${pad4(applications.length + 1)}`,
    input,
    offer,
    createdAt: new Date().toISOString(),
  };
  applications.push(app);
  return app;
}

export function signOffer(
  input: PropertyInput,
  offer: Offer,
): TokenizedHome {
  const id = `VH-${pad4(homes.length + 1)}`;
  const home = mintTokens(offer, { address: input.address, city: input.city }, id);
  homes.push(home);
  return home;
}

// --- Investor side -------------------------------------------------------

export function getHoldings(): Holding[] {
  return [...holdings];
}

// Just the demo user's holdings (excludes the "market" counterparties).
export function getUserHoldings(): Holding[] {
  return holdings.filter((h) => h.owner !== "market");
}

export function getHome(id: string): TokenizedHome | undefined {
  return homes.find((h) => h.id === id);
}

export function tokensSold(homeId: string): number {
  return holdings
    .filter((h) => h.homeId === homeId)
    .reduce((sum, h) => sum + h.tokens, 0);
}

export function tokensAvailable(home: TokenizedHome): number {
  return home.tokenCount - tokensSold(home.id);
}

export function buyTokens(homeId: string, tokens: number): Holding {
  const home = getHome(homeId);
  if (!home) throw new Error(`Unknown home: ${homeId}`);
  if (tokens <= 0) throw new Error("Token amount must be positive");
  if (tokens > tokensAvailable(home)) throw new Error("Not enough tokens available");

  const holding: Holding = {
    id: `HLD-${pad4(++holdingSeq)}`,
    homeId,
    tokens,
    tokenPrice: home.tokenPrice,
    invested: Math.round(tokens * home.tokenPrice),
    purchasedAt: new Date().toISOString(),
  };
  holdings.push(holding);
  return holding;
}

// --- Admin / settlement --------------------------------------------------

export function isSettled(homeId: string): boolean {
  return settledIds.has(homeId);
}

export function getSettledIds(): string[] {
  return Array.from(settledIds);
}

// EUR paid out to token holders when this home was settled (0 if not settled).
export function getSettlementPayout(homeId: string): number {
  return settlementPayouts.get(homeId) ?? 0;
}

// Settle a home: buy out every held token at current value, then remove those
// holdings (investors are paid) and mark the home closed. Returns the payout.
export function settleHome(homeId: string): number {
  const home = getHome(homeId);
  if (!home) throw new Error(`Unknown home: ${homeId}`);
  if (settledIds.has(homeId)) return getSettlementPayout(homeId);

  const { payout } = settlementQuote(home, holdings);
  for (let i = holdings.length - 1; i >= 0; i--) {
    if (holdings[i].homeId === homeId) holdings.splice(i, 1);
  }
  settledIds.add(homeId);
  settlementPayouts.set(homeId, payout);
  return payout;
}

// --- Secondary market ----------------------------------------------------

export function getListings(): Listing[] {
  return [...listings];
}

// Buy an entire secondary listing: the tokens move from the backing "market"
// holder to you, and the listing is removed. Total tokens-in-hands (and so the
// home's funded supply) is UNCHANGED — this is a transfer, not new issuance.
export function buyListing(listingId: string): Holding {
  const li = listings.findIndex((l) => l.id === listingId);
  if (li < 0) throw new Error(`Unknown listing: ${listingId}`);
  const listing = listings[li];

  const mIdx = holdings.findIndex(
    (h) => h.owner === "market" && h.homeId === listing.homeId && h.tokens >= listing.tokens,
  );
  if (mIdx < 0) throw new Error(`No market holder backs listing ${listingId}`);

  const seller = holdings[mIdx];
  if (seller.tokens === listing.tokens) {
    holdings.splice(mIdx, 1);
  } else {
    seller.tokens -= listing.tokens;
    seller.invested = Math.round(seller.tokens * seller.tokenPrice);
  }

  const holding: Holding = {
    id: `HLD-${pad4(++holdingSeq)}`,
    homeId: listing.homeId,
    tokens: listing.tokens,
    tokenPrice: listing.pricePerToken,
    invested: Math.round(listing.tokens * listing.pricePerToken),
    purchasedAt: new Date().toISOString(),
    owner: "you",
  };
  holdings.push(holding);
  listings.splice(li, 1);
  return holding;
}

// --- Investor onboarding (simulated KYC / suitability) -------------------

let kycVerified = false;

export function isKycVerified(): boolean {
  return kycVerified;
}

export function completeKyc(): void {
  kycVerified = true;
}

// Restore the store to its seeded demo state.
export function resetDemo(): void {
  homes.splice(0, homes.length, ...seedHomes);
  holdings.splice(0, holdings.length, ...seedHoldings, ...seedMarketHoldings);
  listings.splice(0, listings.length, ...seedListings);
  applications.length = 0;
  settledIds.clear();
  settlementPayouts.clear();
  kycVerified = false;
  holdingSeq = seedHoldings.length;
}
