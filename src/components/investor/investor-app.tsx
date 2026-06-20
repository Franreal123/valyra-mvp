"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeCard } from "@/components/investor/home-card";
import { BuyPanel } from "@/components/investor/buy-panel";
import { PortfolioView } from "@/components/investor/portfolio-view";
import {
  getHomes,
  getActiveHomes,
  getHoldings,
  tokensAvailable,
  buyTokens,
} from "@/lib/store";
import { summarisePortfolio } from "@/lib/market";
import type { TokenizedHome } from "@/lib/types";

type Tab = "market" | "portfolio";

export function InvestorApp() {
  const [tab, setTab] = useState<Tab>("market");
  // The store is the source of truth; `tick` forces a re-read after a buy.
  const [, setTick] = useState(0);
  const [buying, setBuying] = useState<TokenizedHome | null>(null);

  const activeHomes = getActiveHomes(); // settled homes have left the market
  const holdings = getHoldings();
  // Value holdings against all homes (so a just-settled home can still resolve).
  const summary = summarisePortfolio(holdings, getHomes());

  function confirmBuy(tokens: number) {
    if (!buying) return;
    buyTokens(buying.id, tokens);
    setBuying(null);
    setTick((t) => t + 1);
    setTab("portfolio");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-valyra-blue hover:underline">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-semibold text-valyra-ink">Marketplace</h1>
        <nav className="flex gap-1 rounded-full bg-valyra-ink/5 p-1">
          {(["market", "portfolio"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t ? "bg-white text-valyra-ink shadow-sm" : "text-valyra-ink/60",
              )}
            >
              {t === "market" ? "Marketplace" : "Portfolio"}
            </button>
          ))}
        </nav>
      </div>

      {tab === "market" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeHomes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              available={tokensAvailable(home)}
              onInvest={setBuying}
            />
          ))}
        </div>
      ) : (
        <PortfolioView summary={summary} />
      )}

      {buying && (
        <BuyPanel
          home={buying}
          available={tokensAvailable(buying)}
          onConfirm={confirmBuy}
          onClose={() => setBuying(null)}
        />
      )}
    </div>
  );
}
