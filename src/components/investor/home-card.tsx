import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { simulateAppreciationPct } from "@/lib/market";
import type { TokenizedHome } from "@/lib/types";

// Marketplace card for one tokenized home. `available` is passed in by the
// parent (read from the store) so this stays a simple presentational unit.
export function HomeCard({
  home,
  available,
  onInvest,
}: {
  home: TokenizedHome;
  available: number;
  onInvest: (home: TokenizedHome) => void;
}) {
  const soldPct = Math.round(((home.tokenCount - available) / home.tokenCount) * 100);
  const fullyFunded = available <= 0;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-valyra-ink">{home.address}</h3>
          <p className="text-sm text-valyra-ink/60">{home.city}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-1 text-xs font-medium text-valyra-ink">
          <TrendingUp size={12} /> +{simulateAppreciationPct(home)}%
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-valyra-ink/60">Home value</dt>
        <dd className="text-right font-medium text-valyra-ink">{formatEUR(home.valuation)}</dd>
        <dt className="text-valyra-ink/60">Token price</dt>
        <dd className="text-right font-medium text-valyra-ink">{formatEURPrecise(home.tokenPrice)}</dd>
      </dl>

      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-valyra-ink/10">
          <div className="h-full rounded-full bg-valyra-blue" style={{ width: `${soldPct}%` }} />
        </div>
        <p className="mt-1 text-xs text-valyra-ink/60">
          {soldPct}% funded · {available.toLocaleString("nl-NL")} of{" "}
          {home.tokenCount.toLocaleString("nl-NL")} tokens left
        </p>
      </div>

      <Button
        variant={fullyFunded ? "ghost" : "primary"}
        disabled={fullyFunded}
        onClick={() => onInvest(home)}
        className="mt-1"
      >
        {fullyFunded ? "Fully funded" : "Invest"}
      </Button>
    </Card>
  );
}
