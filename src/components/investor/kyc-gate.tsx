"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { completeKyc } from "@/lib/store";

// Simulated KYC + suitability gate. A retail investor must verify once before
// their first purchase — identity, an appropriateness check, and a risk
// acknowledgement. (Demonstrates the regulatory onboarding layer; not real KYC.)
export function KycGate({
  onDone,
  onClose,
}: {
  onDone: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [country, setCountry] = useState("Netherlands");
  const [experience, setExperience] = useState("");
  const [bearLoss, setBearLoss] = useState(false);
  const [ack, setAck] = useState(false);

  const year = Number(birthYear);
  const isAdult = year > 1900 && new Date().getFullYear() - year >= 18;
  const yearEntered = birthYear.length >= 4; // don't flag mid-typing
  const valid =
    name.trim().length > 1 && isAdult && experience !== "" && bearLoss && ack;

  function submit() {
    if (!valid) return;
    completeKyc();
    onDone();
  }

  return (
    <Modal titleId="kyc-title" onClose={onClose}>
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-valyra-blue" size={20} />
          <h2
            id="kyc-title"
            className="display text-xl font-medium text-valyra-ink"
          >
            Verify to invest
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-valyra-ink/40 hover:text-valyra-ink"
        >
          <X size={20} />
        </button>
      </div>
      <p className="mb-4 text-sm text-valyra-ink/60">
        A one-time check (simulated KYC + suitability), required before
        investing.
      </p>

      <div className="flex flex-col gap-3">
        <Field label="Full name">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Year of birth">
            <input
              type="number"
              className={inputClass}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
            />
          </Field>
          <Field label="Country of residence">
            <select
              className={inputClass}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option>Netherlands</option>
              <option>Belgium</option>
              <option>Germany</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
        <Field label="Investment experience">
          <select
            className={inputClass}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Select…</option>
            <option>None</option>
            <option>Some</option>
            <option>Experienced</option>
          </select>
        </Field>
        <label className="flex items-start gap-2 text-sm text-valyra-ink/80">
          <input
            type="checkbox"
            checked={bearLoss}
            onChange={(e) => setBearLoss(e.target.checked)}
            className="mt-0.5 accent-valyra-blue"
          />
          I can bear the loss of my entire investment.
        </label>
        <label className="flex items-start gap-2 text-sm text-valyra-ink/80">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-0.5 accent-valyra-blue"
          />
          I understand these tokens are illiquid, long-dated, and can fall in
          value.
        </label>
        {yearEntered && !isAdult && (
          <p className="text-xs text-red-600">
            You must be 18 or older to invest.
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!valid} onClick={submit}>
          Complete verification
        </Button>
      </div>
    </Modal>
  );
}
