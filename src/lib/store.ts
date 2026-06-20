import { seedHomes, seedHoldings } from "@/db/seed";
import { mintTokens } from "@/lib/contract";
import type {
  Application,
  Holding,
  Offer,
  PropertyInput,
  TokenizedHome,
} from "@/lib/types";

// In-memory data layer (swappable for Supabase behind these same functions).
const homes: TokenizedHome[] = [...seedHomes];
const applications: Application[] = [];
const holdings: Holding[] = [...seedHoldings];
const settledIds = new Set<string>();

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

export function getHomes(): TokenizedHome[] {
  return [...homes];
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
    id: `HLD-${pad4(holdings.length + 1)}`,
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

export function settleHome(homeId: string): void {
  if (!getHome(homeId)) throw new Error(`Unknown home: ${homeId}`);
  settledIds.add(homeId);
}
