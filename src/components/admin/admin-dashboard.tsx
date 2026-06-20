"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import {
  getHomes,
  getHoldings,
  tokensSold,
  isSettled,
  settleHome,
} from "@/lib/store";
import { platformStats, settlementQuote } from "@/lib/admin";
import { currentHomeValue } from "@/lib/market";
import { formatEUR } from "@/lib/format";
import type { TokenizedHome } from "@/lib/types";

export function AdminDashboard() {
  // The store is the source of truth; `tick` forces a re-read after settling.
  const [, setTick] = useState(0);
  const [settling, setSettling] = useState<TokenizedHome | null>(null);

  const homes = getHomes();
  const holdings = getHoldings();
  const stats = platformStats(homes, holdings);

  function confirmSettle() {
    if (!settling) return;
    settleHome(settling.id);
    setSettling(null);
    setTick((t) => t + 1);
  }

  const quote = settling ? settlementQuote(settling, holdings) : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-valyra-blue hover:underline">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="mb-8 text-3xl font-semibold text-valyra-ink">Platform overview</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Homes tokenized" value={String(stats.homesCount)} />
        <StatCard label="Capital raised" value={formatEUR(stats.capitalRaised)} sub="paid to homeowners" />
        <StatCard
          label="Capital deployed"
          value={formatEUR(stats.capitalDeployed)}
          sub={`${stats.positions} investor position${stats.positions === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Tokens sold"
          value={`${stats.fundedPct}%`}
          sub={`${stats.tokensSold.toLocaleString("nl-NL")} of ${stats.tokensIssued.toLocaleString("nl-NL")}`}
        />
      </div>

      {/* Homes & settlement */}
      <h2 className="mb-3 mt-10 text-lg font-semibold text-valyra-ink">Homes &amp; settlement</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-valyra-ink/10 text-left text-valyra-ink/50">
              <th className="py-2 font-medium">Home</th>
              <th className="py-2 text-right font-medium">Current value</th>
              <th className="py-2 text-right font-medium">Funded</th>
              <th className="py-2 text-right font-medium">Holder payout</th>
              <th className="py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {homes.map((home) => {
              const funded = Math.round((tokensSold(home.id) / home.tokenCount) * 100);
              const payout = settlementQuote(home, holdings).payout;
              const settled = isSettled(home.id);
              return (
                <tr key={home.id} className="border-b border-valyra-ink/5 last:border-0">
                  <td className="py-3">
                    <span className="font-medium text-valyra-ink">{home.address}</span>
                    <span className="block text-xs text-valyra-ink/50">
                      {home.city} · {home.id}
                    </span>
                  </td>
                  <td className="py-3 text-right text-valyra-ink">{formatEUR(currentHomeValue(home))}</td>
                  <td className="py-3 text-right text-valyra-ink">{funded}%</td>
                  <td className="py-3 text-right text-valyra-ink">{formatEUR(payout)}</td>
                  <td className="py-3 text-right">
                    {settled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-1 text-xs font-medium text-valyra-ink">
                        <CheckCircle2 size={12} /> Settled
                      </span>
                    ) : (
                      <button
                        onClick={() => setSettling(home)}
                        className="rounded-full border border-valyra-ink/15 px-3 py-1 text-xs font-medium text-valyra-blue hover:border-valyra-blue"
                      >
                        Settle
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Settle confirmation */}
      {settling && quote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-valyra-ink/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-valyra-ink">Settle {settling.address}</h2>
              <button onClick={() => setSettling(null)} aria-label="Close" className="text-valyra-ink/40 hover:text-valyra-ink">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-valyra-ink/70">
              Settling buys out all {quote.tokensHeld.toLocaleString("nl-NL")} investor-held
              tokens at the current value. Token holders receive:
            </p>
            <p className="mt-3 text-3xl font-semibold text-valyra-ink">{formatEUR(quote.payout)}</p>
            <div className={cn("mt-5 flex justify-end gap-2")}>
              <Button variant="ghost" onClick={() => setSettling(null)}>
                Cancel
              </Button>
              <Button onClick={confirmSettle}>Confirm settlement</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
