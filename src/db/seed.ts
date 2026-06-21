import type { Holding, Listing, TokenizedHome } from "@/lib/types";

// Indicative NL residential €/m² levels (simulated, ~2026). Keys are lowercased.
export const CITY_PRICES: Record<string, number> = {
  amsterdam: 7200,
  rotterdam: 4100,
  "den haag": 4600,
  utrecht: 5500,
  eindhoven: 4300,
  groningen: 3800,
  tilburg: 3500,
  almere: 3700,
  breda: 3900,
  nijmegen: 3900,
  haarlem: 4900,
  leiden: 4700,
  delft: 4500,
  maastricht: 4000,
  arnhem: 3700,
};

export const NATIONAL_AVG_PRICE_M2 = 4000;

// Build a tokenized home from the locked model so every seed home is internally
// consistent (see seed.test.ts):
//   tokenCount = sharePct × 1000
//   cashPaid   = round(sharePct% × valuation × 0.85)   (15% risk discount)
//   tokenPrice = 2dp-rounded unit price of cashPaid
function makeHome(
  id: string,
  address: string,
  city: string,
  valuation: number,
  sharePct: number,
  signedAt: string,
): TokenizedHome {
  const tokenCount = sharePct * 1000;
  const cashPaid = Math.round((sharePct / 100) * valuation * 0.85);
  const tokenPrice = Math.round((cashPaid / tokenCount) * 100) / 100;
  return {
    id,
    contractRef: `VLY-2026-${id}`,
    address,
    city,
    valuation,
    sharePct,
    tokenCount,
    tokenPrice,
    cashPaid,
    signedAt,
  };
}

// [id, address, city, valuation, sharePct, signedAt]
const HOMES: ReadonlyArray<
  [string, string, string, number, number, string]
> = [
  ["VH-0001", "Prinsengracht 263", "Amsterdam", 612_000, 10, "2026-05-02T10:00:00.000Z"],
  ["VH-0002", "Oudegracht 12", "Utrecht", 468_000, 8, "2026-05-10T10:00:00.000Z"],
  ["VH-0003", "Witte de Withstraat 44", "Rotterdam", 400_000, 10, "2026-05-14T10:00:00.000Z"],
  ["VH-0004", "Denneweg 7", "Den Haag", 560_000, 8, "2026-05-18T10:00:00.000Z"],
  ["VH-0005", "Stratumseind 21", "Eindhoven", 340_000, 15, "2026-05-22T10:00:00.000Z"],
  ["VH-0006", "Folkingestraat 9", "Groningen", 300_000, 12, "2026-05-26T10:00:00.000Z"],
  ["VH-0007", "Keizersgracht 401", "Amsterdam", 845_000, 8, "2026-05-28T10:00:00.000Z"],
  ["VH-0008", "Vondelstraat 14", "Amsterdam", 720_000, 6, "2026-05-29T10:00:00.000Z"],
  ["VH-0009", "Egelantiersgracht 22", "Amsterdam", 565_000, 10, "2026-05-30T10:00:00.000Z"],
  ["VH-0010", "Nieuwe Binnenweg 120", "Rotterdam", 318_000, 12, "2026-06-01T10:00:00.000Z"],
  ["VH-0011", "Kralingse Plaslaan 5", "Rotterdam", 489_000, 9, "2026-06-02T10:00:00.000Z"],
  ["VH-0012", "Lange Voorhout 30", "Den Haag", 905_000, 7, "2026-06-03T10:00:00.000Z"],
  ["VH-0013", "Prins Hendrikstraat 11", "Den Haag", 372_000, 12, "2026-06-04T10:00:00.000Z"],
  ["VH-0014", "Twijnstraat 6", "Utrecht", 535_000, 10, "2026-06-05T10:00:00.000Z"],
  ["VH-0015", "Biltstraat 90", "Utrecht", 410_000, 11, "2026-06-06T10:00:00.000Z"],
  ["VH-0016", "Grote Markt 3", "Haarlem", 612_000, 8, "2026-06-07T10:00:00.000Z"],
  ["VH-0017", "Botermarkt 19", "Leiden", 458_000, 10, "2026-06-08T10:00:00.000Z"],
  ["VH-0018", "Oude Delft 50", "Delft", 521_000, 9, "2026-06-09T10:00:00.000Z"],
  ["VH-0019", "Vrijthof 7", "Maastricht", 398_000, 12, "2026-06-10T10:00:00.000Z"],
  ["VH-0020", "Stevenskerkhof 2", "Nijmegen", 286_000, 14, "2026-06-11T10:00:00.000Z"],
  ["VH-0021", "Korenmarkt 8", "Arnhem", 312_000, 13, "2026-06-12T10:00:00.000Z"],
  ["VH-0022", "Heuvel 15", "Tilburg", 268_000, 15, "2026-06-13T10:00:00.000Z"],
  ["VH-0023", "Esplanade 4", "Almere", 332_000, 11, "2026-06-14T10:00:00.000Z"],
  ["VH-0024", "Ginnekenstraat 40", "Breda", 354_000, 12, "2026-06-15T10:00:00.000Z"],
];

// Pre-tokenized homes so the marketplace looks like a live, populated market.
export const seedHomes: TokenizedHome[] = HOMES.map((h) => makeHome(...h));

// Pre-existing investor (you) holdings so some homes show partial funding and
// the portfolio isn't empty. invested = tokens × the home's mint price.
export const seedHoldings: Holding[] = [
  {
    id: "HLD-0001",
    homeId: "VH-0001",
    tokens: 3_000,
    tokenPrice: 5.2,
    invested: 15_600,
    purchasedAt: "2026-05-04T09:00:00.000Z",
  },
  {
    id: "HLD-0002",
    homeId: "VH-0002",
    tokens: 1_500,
    tokenPrice: 3.98,
    invested: 5_970,
    purchasedAt: "2026-05-12T09:00:00.000Z",
  },
  {
    id: "HLD-0003",
    homeId: "VH-0003",
    tokens: 4_000,
    tokenPrice: 3.4,
    invested: 13_600,
    purchasedAt: "2026-05-16T09:00:00.000Z",
  },
  {
    id: "HLD-0004",
    homeId: "VH-0005",
    tokens: 2_000,
    tokenPrice: 2.89,
    invested: 5_780,
    purchasedAt: "2026-05-24T09:00:00.000Z",
  },
];

// Tokens held by OTHER investors ("the market"). They give homes a realistic
// spread of funding levels, back secondary listings, and count toward a home's
// sold supply — but never appear in your portfolio.
function marketHolding(
  id: string,
  homeId: string,
  tokens: number,
  purchasedAt: string,
): Holding {
  const home = seedHomes.find((h) => h.id === homeId);
  if (!home) throw new Error(`seed: unknown home ${homeId}`);
  return {
    id,
    homeId,
    tokens,
    tokenPrice: home.tokenPrice,
    invested: Math.round(tokens * home.tokenPrice),
    purchasedAt,
    owner: "market",
  };
}

// [id, homeId, tokens, purchasedAt]. VH-0004 and VH-0006 back the two listings.
const MARKET: ReadonlyArray<[string, string, number, string]> = [
  ["MKT-0001", "VH-0004", 1_500, "2026-05-19T09:00:00.000Z"],
  ["MKT-0002", "VH-0006", 2_000, "2026-05-27T09:00:00.000Z"],
  ["MKT-0003", "VH-0007", 2_400, "2026-05-30T09:00:00.000Z"],
  ["MKT-0004", "VH-0008", 900, "2026-05-31T09:00:00.000Z"],
  ["MKT-0005", "VH-0009", 5_500, "2026-06-01T09:00:00.000Z"],
  ["MKT-0006", "VH-0010", 2_000, "2026-06-02T09:00:00.000Z"],
  ["MKT-0007", "VH-0011", 3_600, "2026-06-03T09:00:00.000Z"],
  ["MKT-0008", "VH-0012", 1_400, "2026-06-04T09:00:00.000Z"],
  ["MKT-0009", "VH-0013", 3_000, "2026-06-05T09:00:00.000Z"],
  ["MKT-0010", "VH-0014", 6_000, "2026-06-06T09:00:00.000Z"],
  ["MKT-0011", "VH-0015", 1_100, "2026-06-07T09:00:00.000Z"],
  ["MKT-0012", "VH-0016", 2_800, "2026-06-08T09:00:00.000Z"],
  ["MKT-0013", "VH-0017", 4_500, "2026-06-09T09:00:00.000Z"],
  ["MKT-0014", "VH-0018", 1_800, "2026-06-10T09:00:00.000Z"],
  ["MKT-0015", "VH-0019", 3_600, "2026-06-11T09:00:00.000Z"],
  ["MKT-0016", "VH-0020", 7_000, "2026-06-12T09:00:00.000Z"],
];

export const seedMarketHoldings: Holding[] = MARKET.map((m) => marketHolding(...m));

// Secondary-market SELL orders, backed 1:1 by the market holdings above. Prices
// sit near each home's current token price (a small discount / premium).
export const seedListings: Listing[] = [
  {
    id: "LST-0001",
    homeId: "VH-0004",
    tokens: 1_500,
    pricePerToken: 5.1, // vs ~€5.28 current — a small discount
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "LST-0002",
    homeId: "VH-0006",
    tokens: 2_000,
    pricePerToken: 2.95, // vs ~€2.88 current — a small premium
    createdAt: "2026-06-03T09:00:00.000Z",
  },
];
