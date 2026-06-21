"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { MIN_INVESTMENT_EUR, tokensForAmount } from "@/lib/market";
import { TERM_YEARS, projectHomeScenarios } from "@/lib/scenarios";
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

  // Risk/return projection over the HESA term (incl. the downside path).
  const scenarios = projectHomeScenarios(home, cost);

  return (
    <Modal titleId="buy-panel-title" onClose={onClose}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2
            id="buy-panel-title"
            className="text-lg font-semibold text-valyra-ink"
          >
            Invest in {home.address}
          </h2>
          <p className="text-sm text-valyra-ink/60">
            {home.city} · {formatEURPrecise(home.tokenPrice)} per token
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-valyra-ink/40 hover:text-valyra-ink"
        >
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
          <dd className="font-medium text-valyra-ink">
            {tokens.toLocaleString("nl-NL")}
          </dd>
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
        <p className="mt-2 text-xs text-red-600">
          Only {available.toLocaleString("nl-NL")} tokens are available.
        </p>
      )}

      {/* Projected outcomes over the term — downside shown first. */}
      {valid && (
        <div className="mt-4 rounded-xl bg-valyra-canvas p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/50">
            Projected at {TERM_YEARS}-yr term
          </p>
          <table className="w-full text-sm">
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.label}>
                  <td className="py-1 text-valyra-ink/60">{s.label}</td>
                  <td className="py-1 text-right tabular-nums text-valyra-ink">
                    {formatEUR(s.endingValue)}
                  </td>
                  <td
                    className={cn(
                      "py-1 pl-3 text-right font-mono text-xs tabular-nums",
                      s.gain >= 0 ? "text-valyra-lime" : "text-red-600",
                    )}
                  >
                    {s.gain >= 0 ? "+" : "−"}
                    {Math.abs(s.irrPct)}%/yr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[10px] leading-snug text-valyra-ink/45">
            Tokens track the home&apos;s value, which can fall as well as rise.
            Returns are simulated, not guaranteed.
          </p>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!valid} onClick={() => onConfirm(tokens)}>
          Confirm purchase
        </Button>
      </div>
    </Modal>
  );
}
