import type { ReactNode } from "react";
import {
  Home,
  Layers,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Scale,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Investor "How it works" tab — the product mechanics, economics, risks, and the
// legal / regulatory disclosures, in one place. Informational only.
export function HowItWorks() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      {/* Simulation banner */}
      <Callout tone="info" icon={Info} title="This is a simulated MVP">
        Valyra is a university prototype. The blockchain, the property valuation
        (AVM), and all balances are <strong>simulated in software</strong> — there
        is no real chain, no real money, and no real personal data. Nothing here
        is an offer, a solicitation, or investment, legal, or tax advice.
      </Callout>

      {/* What it is */}
      <Section title="What Valyra is">
        <p>
          Valyra turns Dutch <strong>home-equity sharing agreements (HESAs)</strong>{" "}
          into a retail-accessible market. A homeowner sells a slice of their
          home&apos;s <em>future appreciation</em> for cash today — with no debt, no
          interest, and no monthly payments. Those appreciation rights are
          <strong> tokenized</strong> into thousands of fractional units, so retail
          investors can own a piece of residential property from just{" "}
          <strong>€100</strong> and share in the upside.
        </p>
      </Section>

      {/* How it works steps */}
      <Section title="How it works, step by step">
        <ol className="flex flex-col gap-4">
          <Step n="1" icon={Home} title="A homeowner unlocks equity">
            They enter their property, receive an instant AVM valuation, and choose
            to sell <strong>5–20%</strong> of future appreciation. Only{" "}
            <strong>unmortgaged equity</strong> can be sold — the HESA is junior to
            any existing mortgage. The cash offer applies a risk-adjustment discount
            (currently <strong>15%</strong>) to reflect the illiquid, long-dated,
            coupon-less nature of the asset.
          </Step>
          <Step n="2" icon={Layers} title="The home is tokenized">
            The sold share becomes a fixed pool of fractional tokens (the model uses{" "}
            <strong>1,000 tokens per 1% sold</strong>). Each token represents a claim
            on its slice of the home&apos;s future value.
          </Step>
          <Step n="3" icon={Wallet} title="Investors buy fractions">
            After a one-time suitability check, you buy tokens from <strong>€100</strong>.
            Your holdings, returns, and allocation appear in your Portfolio. You can
            resell tokens on the secondary market for liquidity before settlement.
          </Step>
          <Step n="4" icon={TrendingUp} title="Settlement shares the upside">
            When the home is sold or refinanced (or at the end of the term), token
            holders are bought out at the home&apos;s then-current value. If the home
            appreciated, holders gain; if it fell, they can lose part or all of their
            investment.
          </Step>
        </ol>
      </Section>

      {/* Economics & fees */}
      <Section title="Economics & fees">
        <p>
          A token&apos;s price tracks the home&apos;s value: the platform marks each
          home to its (simulated) current value, so token prices move with the
          underlying property. Representative fees for a production service — shown
          for transparency, <strong>not charged in this demo</strong>:
        </p>
        <Table
          rows={[
            ["Minimum investment", "€100 per purchase"],
            ["Homeowner risk discount", "~15% of valuation (built into the offer)"],
            ["Origination fee", "One-off, charged to the homeowner on funding"],
            ["Management fee", "Annual %, on assets under management"],
            ["Settlement spread", "Small spread taken at buy-out / settlement"],
            ["Investor entry/exit", "No entry fee in the demo; secondary trades at the quoted price"],
          ]}
        />
        <p className="text-xs text-valyra-ink/55">
          Full pricing logic and worked examples are in the project&apos;s financial
          model documentation.
        </p>
      </Section>

      {/* Returns & risk */}
      <Section title="Returns & risk">
        <p>
          Returns come <strong>only</strong> from home-price appreciation over the
          term — there is no interest or dividend. Each home shows{" "}
          <strong>bear / base / bull</strong> scenarios with an indicative annual
          return before you invest, and the downside is always shown first.
        </p>
        <Callout tone="warning" icon={AlertTriangle} title="Capital at risk">
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>You can lose money.</strong> If a home&apos;s value falls, your tokens fall with it — potentially to zero.</li>
            <li><strong>Illiquid &amp; long-dated.</strong> Exit depends on the secondary market or settlement; there is no guaranteed buyer.</li>
            <li><strong>No income.</strong> Tokens pay no interest or dividend; the only return is appreciation at settlement.</li>
            <li><strong>Concentration.</strong> A single home or city can move your portfolio sharply — diversify.</li>
            <li>Simulated and past performance is <strong>not</strong> indicative of future results.</li>
          </ul>
        </Callout>
      </Section>

      {/* Eligibility & KYC */}
      <Section title="Eligibility, KYC & suitability" icon={ShieldCheck}>
        <p>Before a first investment, every retail investor completes a one-time check:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><strong>Identity (KYC) &amp; AML</strong> screening, as required under the Dutch <em>Wwft</em> (anti-money-laundering act) for a production service.</li>
          <li><strong>Age &amp; residence</strong> — you must be 18 or older.</li>
          <li><strong>Suitability / appropriateness</strong> — an experience check and an explicit acknowledgement that you can bear the loss of your entire investment.</li>
          <li><strong>Source of funds</strong> would be verified before processing real payments.</li>
        </ul>
      </Section>

      {/* Legal & regulatory */}
      <Section title="Legal & regulatory" icon={Scale}>
        <p>
          The following describes how a <em>production</em> Valyra would be
          structured and regulated. It is general information, not legal advice, and
          a formal legal opinion would be obtained before any launch.
        </p>
        <ul className="ml-4 list-disc space-y-2">
          <li>
            <strong>Instrument classification.</strong> A tokenized appreciation
            right is most likely a <strong>transferable security</strong> under{" "}
            <strong>MiFID II</strong>, rather than a crypto-asset under{" "}
            <strong>MiCA</strong>. We default to security-token treatment.
          </li>
          <li>
            <strong>Offering rules.</strong> Public offers fall under the EU{" "}
            <strong>Prospectus Regulation</strong>; the platform would operate within
            an exemption (offer-size / investor-count caps) or publish an approved
            prospectus, with ongoing monitoring of those thresholds.
          </li>
          <li>
            <strong>Supervision (Netherlands).</strong> Conduct is supervised by the{" "}
            <strong>AFM</strong> and prudential matters by <strong>DNB</strong>. A
            venue/operator would act under the appropriate licence or via a licensed
            partner.
          </li>
          <li>
            <strong>Legal structure.</strong> Each home&apos;s appreciation rights
            would sit in a dedicated <strong>SPV</strong> with a notarial deed and a
            registered charge; the HESA is <strong>junior to the mortgage</strong>{" "}
            and requires lender consent where applicable.
          </li>
          <li>
            <strong>Investor protection.</strong> Risk disclosures, suitability
            checks, asset segregation, and qualified custody for the real-chain
            version. Tokens are <strong>not bank deposits</strong> and are not covered
            by any deposit-guarantee scheme.
          </li>
          <li>
            <strong>Data protection.</strong> Personal and KYC data would be processed
            under the <strong>GDPR</strong>, minimised, encrypted in transit and at
            rest, and retained only as long as required.
          </li>
        </ul>
      </Section>

      {/* Tax */}
      <Section title="Tax">
        <p>
          Tax treatment depends on your personal circumstances. For Dutch individual
          investors, holdings would typically fall under <strong>Box 3</strong>{" "}
          (savings &amp; investments). Valyra does not provide tax advice — please
          consult a qualified tax adviser.
        </p>
      </Section>

      {/* Final disclaimer */}
      <Callout tone="info" icon={Info} title="Important">
        This material is for information only and is not an offer, solicitation, or
        recommendation to buy or sell any financial instrument, nor investment,
        legal, or tax advice. Capital is at risk. In this MVP everything is
        simulated. See the repository&apos;s <em>regulatory note</em>,{" "}
        <em>financial model</em>, and <em>risk register</em> for full detail.
      </Callout>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof Info;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="display flex items-center gap-2 text-xl text-valyra-ink">
        {Icon ? <Icon size={18} className="text-valyra-blue" strokeWidth={1.75} /> : null}
        {title}
      </h3>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-valyra-ink/75">
        {children}
      </div>
    </Card>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  children,
}: {
  n: string;
  icon: typeof Info;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-valyra-paper/70 text-valyra-blue">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-medium text-valyra-ink">
          <span className="font-mono text-xs text-valyra-ink/40">{n}.</span> {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-valyra-ink/70">{children}</p>
      </div>
    </li>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-valyra-ink/10 rounded-xl border border-valyra-line">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <dt className="text-sm font-medium text-valyra-ink">{k}</dt>
          <dd className="text-sm text-valyra-ink/65 sm:text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "info" | "warning";
  icon: typeof Info;
  title: string;
  children: ReactNode;
}) {
  const styles =
    tone === "warning"
      ? "border-red-200 bg-red-50"
      : "border-valyra-blue/20 bg-valyra-blue/5";
  const iconColor = tone === "warning" ? "text-red-600" : "text-valyra-blue";
  return (
    <div className={`flex gap-3 rounded-2xl border p-5 ${styles}`}>
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconColor}`} strokeWidth={1.75} />
      <div className="flex flex-col gap-1.5">
        <p className="font-medium text-valyra-ink">{title}</p>
        <div className="text-sm leading-relaxed text-valyra-ink/75">{children}</div>
      </div>
    </div>
  );
}
