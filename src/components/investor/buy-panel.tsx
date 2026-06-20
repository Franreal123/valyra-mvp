"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { MIN_INVESTMENT_EUR, tokensForAmount } from "@/lib/market";
import type { TokenizedHome } from "@/lib/types";

// Modal to buy tokens in one home. Investor enters a € amount; we floor it to
// whole tokens at the home's mint price and validate the €100 minimum and the
// available supply before confirming.
export function BuyPanel({
  home,
  available,
  onConfirm,
  onClose,
}: {
  home: TokenizedHome;
  available: number;
  onConfirm: (tokens: number) => void;
  onClose: () => void;
}) {
  const maxAmount = Math.floor(available * home.tokenPrice);
  const [amount, setAmount] = useState(String(Math.min(500, maxAmount)));

  const amountNum = Number(amount) || 0;
  const tokens = tokensForAmount(amountNum, home.tokenPrice);
  const cost = Math.round(tokens * home.tokenPrice);

  const belowMin = amountNum < MIN_INVESTMENT_EUR;
  const overSupply = tokens > available;
  const valid = !belowMin && !overSupply && tokens > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-valyra-ink/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-valyra-ink">Invest in {home.address}</h2>
            <p className="text-sm text-valyra-ink/60">
              {home.city} · {formatEURPrecise(home.tokenPrice)} per token
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-valyra-ink/40 hover:text-valyra-ink">
            <X size={20} />
          </button>
        </div>

        <Field
          label="Amount to invest (€)"
          hint={`Minimum ${formatEUR(MIN_INVESTMENT_EUR)} · up to ${formatEUR(maxAmount)} available`}
        >
          <input
            type="number"
            className={inputClass}
            value={amount}
            min={MIN_INVESTMENT_EUR}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>

        <dl className="mt-4 divide-y divide-valyra-ink/10 text-sm">
          <div className="flex justify-between py-2">
            <dt className="text-valyra-ink/60">Tokens you receive</dt>
            <dd className="font-medium text-valyra-ink">{tokens.toLocaleString("nl-NL")}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-valyra-ink/60">Cost</dt>
            <dd className="font-medium text-valyra-ink">{formatEUR(cost)}</dd>
          </div>
        </dl>

        {belowMin && (
          <p className="mt-2 text-xs text-red-600">
            Minimum investment is {formatEUR(MIN_INVESTMENT_EUR)}.
          </p>
        )}
        {overSupply && (
          <p className="mt-2 text-xs text-red-600">Only {available.toLocaleString("nl-NL")} tokens are available.</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={() => onConfirm(tokens)}>
            Confirm purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
