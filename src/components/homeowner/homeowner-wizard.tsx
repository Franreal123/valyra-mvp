"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";
import { valuateProperty } from "@/lib/avm";
import { buildOffer } from "@/lib/contract";
import { createApplication, signOffer } from "@/lib/store";
import { formatEUR, formatEURPrecise } from "@/lib/format";
import { CITY_PRICES } from "@/db/seed";
import type { EnergyLabel, PropertyInput, TokenizedHome } from "@/lib/types";

const STEPS = ["Apply", "Valuation", "Offer", "Sign"];
const LABELS: EnergyLabel[] = ["A", "B", "C", "D", "E", "F", "G"];
// Title-case the seed city keys for the dropdown; valuateProperty re-lowercases.
const CITIES = Object.keys(CITY_PRICES).map((c) =>
  c.replace(/\b\w/g, (m) => m.toUpperCase()),
);

type FormState = {
  address: string;
  city: string;
  areaM2: string;
  bedrooms: string;
  buildYear: string;
  energyLabel: EnergyLabel;
  sharePct: number;
};

const INITIAL: FormState = {
  address: "",
  city: "Utrecht",
  areaM2: "85",
  bedrooms: "3",
  buildYear: "2000",
  energyLabel: "C",
  sharePct: 10,
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-valyra-ink/60">{label}</dt>
      <dd className="font-medium text-valyra-ink">{value}</dd>
    </div>
  );
}

export function HomeownerWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [home, setHome] = useState<TokenizedHome | null>(null);

  const input: PropertyInput = useMemo(
    () => ({
      address: form.address.trim(),
      city: form.city,
      areaM2: Number(form.areaM2) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      buildYear: Number(form.buildYear) || 2000,
      energyLabel: form.energyLabel,
      sharePct: form.sharePct,
    }),
    [form],
  );

  const valuation = useMemo(() => valuateProperty(input), [input]);
  const offer = useMemo(
    () => buildOffer(valuation, form.sharePct),
    [valuation, form.sharePct],
  );

  const applyValid =
    input.address.length > 1 && input.areaM2 > 0 && input.buildYear > 1800;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSign() {
    createApplication(input, offer);
    setHome(signOffer(input, offer));
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Stepper steps={STEPS} current={step} />

      <div className="mt-8">
        {step === 0 && (
          <Card className="flex flex-col gap-4">
            <h2 className="display text-2xl font-medium text-valyra-ink">
              Tell us about your home
            </h2>
            <Field label="Address">
              <input
                className={inputClass}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Straatnaam 1"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <select
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Floor area (m²)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.areaM2}
                  onChange={(e) => set("areaM2", e.target.value)}
                />
              </Field>
              <Field label="Bedrooms">
                <input
                  type="number"
                  className={inputClass}
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
              </Field>
              <Field label="Build year">
                <input
                  type="number"
                  className={inputClass}
                  value={form.buildYear}
                  onChange={(e) => set("buildYear", e.target.value)}
                />
              </Field>
              <Field label="Energy label">
                <select
                  className={inputClass}
                  value={form.energyLabel}
                  onChange={(e) =>
                    set("energyLabel", e.target.value as EnergyLabel)
                  }
                >
                  {LABELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label={`Share of future appreciation to sell: ${form.sharePct}%`}
              hint="Between 5% and 20%."
            >
              <input
                type="range"
                min={5}
                max={20}
                value={form.sharePct}
                onChange={(e) => set("sharePct", Number(e.target.value))}
                className="accent-valyra-blue"
              />
            </Field>
            <div className="flex justify-end">
              <Button disabled={!applyValid} onClick={() => setStep(1)}>
                Get my valuation <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="flex flex-col gap-4">
            <h2 className="display text-2xl font-medium text-valyra-ink">
              Estimated value
            </h2>
            <p className="text-4xl font-semibold text-valyra-blue">
              {formatEUR(valuation.value)}
            </p>
            <p className="text-sm text-valyra-ink/60">
              Confidence band {formatEUR(valuation.low)} –{" "}
              {formatEUR(valuation.high)}
              {!valuation.cityMatched &&
                " · national average used for this city"}
            </p>
            <div className="rounded-xl bg-valyra-paper/60 p-4 text-sm text-valyra-ink/80">
              <p className="font-medium">How we valued this</p>
              <ul className="mt-2 space-y-1">
                <li>
                  {input.areaM2} m² × {formatEUR(valuation.pricePerM2)}/m² (price
                  for {form.city})
                </li>
                <li>
                  Energy label {form.energyLabel} adjustment ×
                  {valuation.breakdown.labelAdj.toFixed(2)}
                </li>
                <li>
                  Build year {form.buildYear} adjustment ×
                  {valuation.breakdown.ageAdj.toFixed(3)}
                </li>
              </ul>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button onClick={() => setStep(2)}>
                See my offer <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="flex flex-col gap-4">
            <h2 className="display text-2xl font-medium text-valyra-ink">Your offer</h2>
            <div className="rounded-xl bg-valyra-lime/15 p-5">
              <p className="text-sm text-valyra-ink/70">Cash to you today</p>
              <p className="text-4xl font-semibold text-valyra-ink">
                {formatEUR(offer.cashToday)}
              </p>
            </div>
            <dl className="divide-y divide-valyra-ink/10 text-sm">
              <Row label="Home value" value={formatEUR(valuation.value)} />
              <Row
                label="Share of future appreciation sold"
                value={`${offer.sharePct}%`}
              />
              <Row
                label="Risk adjustment (discount)"
                value={`${offer.discountPct}%`}
              />
              <Row
                label="Tokens minted"
                value={offer.tokenCount.toLocaleString("nl-NL")}
              />
              <Row
                label="Token price"
                value={formatEURPrecise(offer.tokenPrice)}
              />
            </dl>
            <p className="text-xs text-valyra-ink/50">
              No debt, no interest, no monthly payments. You settle the share
              when you sell or refinance.
            </p>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={18} /> Back
              </Button>
              <Button onClick={handleSign}>
                Sign agreement <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && home && (
          <Card className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="text-valyra-lime" size={48} />
            <h2 className="display text-2xl font-medium text-valyra-ink">
              Agreement signed
            </h2>
            <p className="text-valyra-ink/70">
              {formatEUR(home.cashPaid)} is on its way. Your home is tokenized
              and listed for investors.
            </p>
            <dl className="mt-2 w-full divide-y divide-valyra-ink/10 text-left text-sm">
              <Row label="Home ID" value={home.id} />
              <Row label="Contract reference" value={home.contractRef} />
              <Row
                label="Tokens issued"
                value={home.tokenCount.toLocaleString("nl-NL")}
              />
            </dl>
            <Link href="/investor" className="mt-2">
              <Button variant="secondary">
                View it in the marketplace <ArrowRight size={18} />
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
