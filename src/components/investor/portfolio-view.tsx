import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatEUR } from "@/lib/format";
import { AllocationChart } from "@/components/investor/allocation-chart";
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
      <Card className="text-center text-valyra-ink/60">
        You don&apos;t own any tokens yet. Head to the Marketplace to invest from €100.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary + allocation */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="flex flex-col justify-center gap-2">
          <p className="text-sm text-valyra-ink/60">Portfolio value</p>
          <p className="text-4xl font-semibold text-valyra-ink">{formatEUR(summary.currentValue)}</p>
          <p className={cn("text-sm font-medium", gainClass(summary.gain))}>
            {signed(summary.gain)} ({summary.gainPct >= 0 ? "+" : ""}
            {summary.gainPct}%) · {formatEUR(summary.invested)} invested
          </p>
        </Card>
        <Card>
          <p className="mb-2 text-sm font-medium text-valyra-ink">Allocation</p>
          <AllocationChart positions={summary.positions} />
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
              <th className="py-2 text-right font-medium">Gain</th>
            </tr>
          </thead>
          <tbody>
            {summary.positions.map((p) => (
              <tr key={p.homeId} className="border-b border-valyra-ink/5 last:border-0">
                <td className="py-2">
                  <span className="font-medium text-valyra-ink">{p.home.address}</span>
                  <span className="block text-xs text-valyra-ink/50">{p.home.city}</span>
                </td>
                <td className="py-2 text-right text-valyra-ink">{p.tokens.toLocaleString("nl-NL")}</td>
                <td className="py-2 text-right text-valyra-ink">{formatEUR(p.invested)}</td>
                <td className="py-2 text-right text-valyra-ink">{formatEUR(p.currentValue)}</td>
                <td className={cn("py-2 text-right font-medium", gainClass(p.gain))}>
                  {signed(p.gain)} ({p.gainPct >= 0 ? "+" : ""}
                  {p.gainPct}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
