import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { currentTokenPrice } from "@/lib/market";
import type { Listing, TokenizedHome } from "@/lib/types";

// The secondary order book — SELL listings from other holders. Buying one
// transfers existing tokens to you (it doesn't mint new supply).
export function SecondaryMarket({
  listings,
  homeById,
  onBuy,
}: {
  listings: Listing[];
  homeById: (id: string) => TokenizedHome | undefined;
  onBuy: (listing: Listing) => void;
}) {
  if (listings.length === 0) {
    return (
      <Card className="text-center text-valyra-ink/60">
        No open listings right now — investors can resell their tokens here.
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-valyra-ink/10 text-left text-valyra-ink/50">
            <th className="py-2 font-medium">Home</th>
            <th className="py-2 text-right font-medium">Tokens</th>
            <th className="py-2 text-right font-medium">Ask</th>
            <th className="py-2 text-right font-medium">vs current</th>
            <th className="py-2 text-right font-medium">Total</th>
            <th className="py-2 text-right font-medium" />
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => {
            const home = homeById(l.homeId);
            if (!home) return null;
            const current = currentTokenPrice(home);
            const diffPct = Math.round(((l.pricePerToken - current) / current) * 1000) / 10;
            const total = Math.round(l.tokens * l.pricePerToken);
            return (
              <tr key={l.id} className="border-b border-valyra-ink/5 last:border-0">
                <td className="py-3">
                  <span className="font-medium text-valyra-ink">{home.address}</span>
                  <span className="block text-xs text-valyra-ink/50">
                    {home.city} · {home.id}
                  </span>
                </td>
                <td className="py-3 text-right text-valyra-ink">{l.tokens.toLocaleString("nl-NL")}</td>
                <td className="py-3 text-right text-valyra-ink">{formatEURPrecise(l.pricePerToken)}</td>
                <td
                  className={cn(
                    "py-3 text-right font-mono text-xs",
                    diffPct <= 0 ? "text-valyra-lime" : "text-valyra-ink/55",
                  )}
                >
                  {diffPct > 0 ? "+" : ""}
                  {diffPct}%
                </td>
                <td className="py-3 text-right text-valyra-ink">{formatEUR(total)}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onBuy(l)}
                    className="rounded-full border border-valyra-ink/15 px-3 py-1 text-xs font-medium text-valyra-blue hover:border-valyra-blue"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
