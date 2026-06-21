"use client";

import { useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { HomeCard } from "@/components/investor/home-card";
import { BuyPanel } from "@/components/investor/buy-panel";
import { KycGate } from "@/components/investor/kyc-gate";
import { PortfolioView } from "@/components/investor/portfolio-view";
import { SecondaryMarket } from "@/components/investor/secondary-market";
import {
  getHomes,
  getActiveHomes,
  getUserHoldings,
  getListings,
  getHome,
  tokensAvailable,
  buyTokens,
  buyListing,
  isKycVerified,
} from "@/lib/store";
import { summarisePortfolio } from "@/lib/market";
import type { Listing, TokenizedHome } from "@/lib/types";

type Tab = "market" | "trade" | "portfolio";
const TABS: { id: Tab; label: string }[] = [
  { id: "market", label: "Marketplace" },
  { id: "trade", label: "Trade" },
  { id: "portfolio", label: "Portfolio" },
];

export function InvestorApp() {
  const [tab, setTab] = useState<Tab>("market");
  // The store is the source of truth; `tick` forces a re-read after a mutation.
  const [, setTick] = useState(0);
  const [buying, setBuying] = useState<TokenizedHome | null>(null);
  const [kycOpen, setKycOpen] = useState(false);
  const pendingAfterKyc = useRef<(() => void) | null>(null);

  const verified = isKycVerified();
  const activeHomes = getActiveHomes(); // settled homes have left the market
  const listings = getListings();
  // Value the USER's holdings against all homes (settled ones still resolve).
  const summary = summarisePortfolio(getUserHoldings(), getHomes());

  // Run `action` if verified; otherwise collect KYC first, then run it.
  function requireKyc(action: () => void) {
    if (isKycVerified()) action();
    else {
      pendingAfterKyc.current = action;
      setKycOpen(true);
    }
  }

  function handleInvest(home: TokenizedHome) {
    requireKyc(() => setBuying(home));
  }

  function handleBuyListing(listing: Listing) {
    requireKyc(() => {
      buyListing(listing.id);
      setTick((t) => t + 1);
      setTab("portfolio");
    });
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="display text-4xl font-medium text-valyra-ink">
            {TABS.find((t) => t.id === tab)?.label ?? "Marketplace"}
          </h1>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-1 text-xs font-medium text-valyra-ink">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
        </div>
        <nav
          role="tablist"
          aria-label="Investor views"
          className="flex gap-1 self-start rounded-full bg-valyra-ink/5 p-1 sm:self-auto"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue",
                tab === t.id
                  ? "bg-white text-valyra-ink shadow-sm"
                  : "text-valyra-ink/60",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === "market" && (
        <div role="tabpanel" id="panel-market" aria-labelledby="tab-market">
          {activeHomes.length === 0 ? (
            <Card className="text-center text-valyra-ink/60">
              No homes are open for investment right now — every tokenized home
              has been settled. Sign a new home in the Homeowner flow to list
              one.
            </Card>
          ) : (
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
          )}
        </div>
      )}

      {tab === "trade" && (
        <div role="tabpanel" id="panel-trade" aria-labelledby="tab-trade">
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-valyra-ink/60">
            The resale market. Buy tokens other investors have listed — a direct
            transfer between holders at the quoted price, so a home&apos;s funded
            supply is unchanged. This is how you exit a position before settlement.
          </p>
          <SecondaryMarket
            listings={listings}
            homeById={getHome}
            onBuy={handleBuyListing}
          />
        </div>
      )}

      {tab === "portfolio" && (
        <div
          role="tabpanel"
          id="panel-portfolio"
          aria-labelledby="tab-portfolio"
        >
          <PortfolioView summary={summary} />
        </div>
      )}

      {buying && (
        <BuyPanel
          home={buying}
          available={tokensAvailable(buying)}
          onConfirm={confirmBuy}
          onClose={() => setBuying(null)}
        />
      )}

      {kycOpen && (
        <KycGate
          onClose={() => {
            pendingAfterKyc.current = null;
            setKycOpen(false);
          }}
          onDone={() => {
            setKycOpen(false);
            const action = pendingAfterKyc.current;
            pendingAfterKyc.current = null;
            action?.();
            setTick((t) => t + 1);
          }}
        />
      )}
    </div>
  );
}
