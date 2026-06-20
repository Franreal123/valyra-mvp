"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeCard } from "@/components/investor/home-card";
import { BuyPanel } from "@/components/investor/buy-panel";
import { KycGate } from "@/components/investor/kyc-gate";
import { PortfolioView } from "@/components/investor/portfolio-view";
import {
  getHomes,
  getActiveHomes,
  getHoldings,
  tokensAvailable,
  buyTokens,
  isKycVerified,
} from "@/lib/store";
import { summarisePortfolio } from "@/lib/market";
import type { TokenizedHome } from "@/lib/types";

type Tab = "market" | "portfolio";

export function InvestorApp() {
  const [tab, setTab] = useState<Tab>("market");
  // The store is the source of truth; `tick` forces a re-read after a buy.
  const [, setTick] = useState(0);
  const [buying, setBuying] = useState<TokenizedHome | null>(null);
  // Home the investor wants to buy but must verify (KYC) for first.
  const [verifyingFor, setVerifyingFor] = useState<TokenizedHome | null>(null);

  const verified = isKycVerified();
  const activeHomes = getActiveHomes(); // settled homes have left the market
  const holdings = getHoldings();
  // Value holdings against all homes (so a just-settled home can still resolve).
  const summary = summarisePortfolio(holdings, getHomes());

  // Gate the first purchase behind KYC; afterwards open the buy panel directly.
  function handleInvest(home: TokenizedHome) {
    if (verified) setBuying(home);
    else setVerifyingFor(home);
  }

  function confirmBuy(tokens: number) {
    if (!buying) return;
    buyTokens(buying.id, tokens);
    setBuying(null);
    setTick((t) => t + 1);
    setTab("portfolio");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <h1 className="display text-4xl font-medium text-valyra-ink">Marketplace</h1>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-1 text-xs font-medium text-valyra-ink">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
        </div>
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
              onInvest={handleInvest}
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

      {verifyingFor && (
        <KycGate
          onClose={() => setVerifyingFor(null)}
          onDone={() => {
            setBuying(verifyingFor);
            setVerifyingFor(null);
          }}
        />
      )}
    </div>
  );
}
