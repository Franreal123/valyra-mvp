import { seedHomes } from "@/db/seed";
import { mintTokens } from "@/lib/contract";
import type {
  Application,
  Offer,
  PropertyInput,
  TokenizedHome,
} from "@/lib/types";

// In-memory data layer (swappable for Supabase behind these same functions).
const homes: TokenizedHome[] = [...seedHomes];
const applications: Application[] = [];

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
