import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatEUR } from "@/lib/format";
import { AllocationChart } from "@/components/investor/allocation-chart";
import { simulateAppreciationPct } from "@/lib/market";
import type { PortfolioSummary } from "@/lib/market";

function gainClass(n: number): string {
  return n >= 0 ? "text-valyra-lime" : "text-red-600";
}

function signed(n: number): string {
  return `${n >= 0 ? "+" : "−"}${formatEUR(Math.abs(n))}`;
}

export function PortfolioView({ summary }: { summary: PortfolioSummary }) {
  if (summary.positions.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="display text-xl text-valyra-ink">No holdings yet</p>
        <p className="max-w-sm text-sm text-valyra-ink/60">
          Buy fractional tokens in any home from the Marketplace — from €100 —
          and your positions, returns, and allocation will appear here.
        </p>
      </Card>
    );
  }

  const { positions, invested, currentValue, gain, gainPct } = summary;

  // Weighted simulated appreciation and a one-year projection across holdings.
  const projectedValue = positions.reduce(
    (s, p) => s + Math.round(p.currentValue * (1 + simulateAppreciationPct(p.home) / 100)),
    0,
  );
  const projectedGain = projectedValue - currentValue;
  const weightedAppr =
    currentValue > 0
      ? positions.reduce((s, p) => s + p.currentValue * simulateAppreciationPct(p.home), 0) /
        currentValue
      : 0;
  const cities = new Set(positions.map((p) => p.home.city)).size;

  return (
    <div className="flex flex-col gap-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-valyra-line bg-valyra-line lg:grid-cols-4">
        <Kpi label="Portfolio value" value={formatEUR(currentValue)} sub={`${formatEUR(invested)} invested`} />
        <Kpi
          label="Total return"
          value={signed(gain)}
          sub={`${gainPct >= 0 ? "+" : ""}${gainPct}% all-time`}
          tone={gain >= 0 ? "up" : "down"}
        />
        <Kpi label="Positions" value={String(positions.length)} sub={`${cities} cit${cities === 1 ? "y" : "ies"}`} />
        <Kpi label="Projected" value={`+${weightedAppr.toFixed(1)}%/yr`} sub="simulated appreciation" tone="up" />
      </div>

      {/* Allocation + one-year outlook */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="mb-2 text-sm font-medium text-valyra-ink">Allocation by value</p>
          <AllocationChart positions={positions} />
        </Card>

        <Card className="flex flex-col">
          <p className="text-sm font-medium text-valyra-ink">One-year outlook</p>
          <p className="mt-1 text-xs text-valyra-ink/55">
            If each home appreciates at its simulated rate.
          </p>

          <div className="mt-6 flex flex-1 flex-col justify-center gap-4">
            <Bar label="Invested" value={invested} max={projectedValue} tone="ink" />
            <Bar label="Current value" value={currentValue} max={projectedValue} tone="blue" />
            <Bar label="Projected (1 yr)" value={projectedValue} max={projectedValue} tone="lime" />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-valyra-ink/10 pt-4 text-sm">
            <span className="text-valyra-ink/60">Projected 1-year gain</span>
            <span className={cn("font-semibold", gainClass(projectedGain))}>
              {signed(projectedGain)}
            </span>
          </div>
        </Card>
      </div>

      {/* Positions */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-valyra-ink/10 text-left text-valyra-ink/50">
              <th className="py-2 font-medium">Home</th>
              <th className="py-2 text-right font-medium">Tokens</th>
              <th className="py-2 text-right font-medium">Invested</th>
              <th className="py-2 text-right font-medium">Value</th>
              <th className="py-2 text-right font-medium">Appr.</th>
              <th className="py-2 text-right font-medium">Gain</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.homeId} className="border-b border-valyra-ink/5 last:border-0">
                <td className="py-2.5">
                  <span className="font-medium text-valyra-ink">{p.home.address}</span>
                  <span className="block text-xs text-valyra-ink/50">{p.home.city}</span>
                </td>
                <td className="py-2.5 text-right tabular-nums text-valyra-ink">{p.tokens.toLocaleString("nl-NL")}</td>
                <td className="py-2.5 text-right tabular-nums text-valyra-ink">{formatEUR(p.invested)}</td>
                <td className="py-2.5 text-right tabular-nums text-valyra-ink">{formatEUR(p.currentValue)}</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center rounded-full bg-valyra-lime/20 px-2 py-0.5 font-mono text-[10px] font-medium text-valyra-ink">
                    +{simulateAppreciationPct(p.home)}%
                  </span>
                </td>
                <td className={cn("py-2.5 text-right font-medium tabular-nums", gainClass(p.gain))}>
                  {signed(p.gain)}
                  <span className="block text-[10px] font-normal">
                    {p.gainPct >= 0 ? "+" : ""}
                    {p.gainPct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="text-[11px] leading-relaxed text-valyra-ink/45">
        Values reflect simulated appreciation and are illustrative only. Tokens
        track each home&apos;s value, which can fall as well as rise — see the
        How it works tab for the full risk and legal disclosures.
      </p>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="bg-valyra-canvas px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/45">{label}</p>
      <p
        className={cn(
          "display mt-1 text-2xl",
          tone === "up" ? "text-valyra-lime" : tone === "down" ? "text-red-600" : "text-valyra-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-valyra-ink/50">{sub}</p>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "ink" | "blue" | "lime";
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const fill = tone === "lime" ? "bg-valyra-lime" : tone === "blue" ? "bg-valyra-blue" : "bg-valyra-ink/40";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-valyra-ink/60">{label}</span>
        <span className="font-medium tabular-nums text-valyra-ink">{formatEUR(value)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-valyra-ink/10">
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
