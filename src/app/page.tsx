import Link from "next/link";
import { ArrowUpRight, MapPin, Home, Layers, TrendingUp } from "lucide-react";
import { seedHomes, seedHoldings, seedMarketHoldings } from "@/db/seed";
import { simulateAppreciationPct, MIN_INVESTMENT_EUR } from "@/lib/market";
import { formatEUR, formatEURPrecise } from "@/lib/format";

// Landing page — server component. All motion is CSS (no client JS).
// Positioned as a real-estate brokerage: the live market of tokenized Dutch
// homes is brought onto the page. Listings are derived from the same seed data
// the app uses, so the front page and the marketplace always agree.
// Brand palette only (see tailwind.config).

// Sold tokens per home (your holdings + the "market"), for the funded bars.
const soldByHome = [...seedHoldings, ...seedMarketHoldings].reduce<
  Record<string, number>
>((acc, h) => {
  acc[h.homeId] = (acc[h.homeId] ?? 0) + h.tokens;
  return acc;
}, {});

const listings = seedHomes.map((h) => ({
  id: h.id,
  address: h.address,
  city: h.city,
  valuation: h.valuation,
  tokenPrice: h.tokenPrice,
  apprPct: simulateAppreciationPct(h),
  fundedPct: Math.round(((soldByHome[h.id] ?? 0) / h.tokenCount) * 100),
}));

const tickerItems = listings.map((l) => ({
  address: l.address,
  city: l.city,
  pct: l.apprPct,
}));

// The landing shows a featured slice; the full market lives on /investor.
const featured = listings.slice(0, 9);

const marketValue = seedHomes.reduce((s, h) => s + h.valuation, 0);
const avgAppr =
  seedHomes.reduce((s, h) => s + simulateAppreciationPct(h), 0) /
  seedHomes.length;

const metrics = [
  { k: "Homes listed", v: String(seedHomes.length) },
  { k: "Market value", v: `€${(marketValue / 1e6).toFixed(2)}M` },
  { k: "Avg. projected", v: `+${avgAppr.toFixed(1)}%/yr` },
  { k: "Minimum ticket", v: formatEUR(MIN_INVESTMENT_EUR) },
];

const steps = [
  {
    n: "01",
    icon: Home,
    title: "Homeowner unlocks equity",
    desc: "Apply, get an instant AVM valuation, and sell a slice (5–20%) of future appreciation for cash today — no debt, no monthly payments.",
  },
  {
    n: "02",
    icon: Layers,
    title: "The home is tokenized",
    desc: "Those appreciation rights become thousands of fractional tokens, each priced from a few euros.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Investors fund & share the upside",
    desc: "Buy tokens from €100, track value in a portfolio, and exit any time on the resale market.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-valyra-canvas text-valyra-ink">
      {/* Atmosphere — soft brand-toned glows for depth on the flat canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-valyra-lime/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-[26rem] h-[30rem] w-[30rem] rounded-full bg-valyra-blue/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Masthead */}
        <header className="flex items-baseline justify-between py-6">
          <div className="flex items-baseline gap-3">
            <span className="display text-3xl font-semibold">Valyra</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-valyra-ink/50 sm:block">
              Est. 2026 · Amsterdam
            </span>
          </div>
          <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] sm:gap-7">
            <Link href="/homeowner" className="hidden rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas sm:inline">
              Homeowners
            </Link>
            <Link href="/investor" className="rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas">
              Investors
            </Link>
            <Link href="/admin" className="rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas">
              Desk
            </Link>
            <Link
              href="/investor"
              className="group hidden items-center gap-1.5 rounded-full bg-valyra-ink px-4 py-2 text-white transition-colors hover:bg-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-canvas sm:inline-flex"
            >
              Invest
              <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </nav>
        </header>

        {/* Live market ticker */}
        <MarketTicker />

        {/* Hero */}
        <section className="grid grid-cols-1 items-start gap-10 pt-10 pb-12 lg:grid-cols-12 lg:pt-14 lg:pb-16">
          <div className="lg:col-span-7">
            <p
              className="anim-rise inline-flex items-center gap-2 rounded-full border border-valyra-line bg-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-valyra-blue"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-valyra-lime" />
              The market for Dutch home equity
            </p>
            <h1
              className="display anim-rise mt-6 text-[clamp(2.75rem,7vw,6rem)] font-light leading-[0.9]"
              style={{ animationDelay: "0.12s" }}
            >
              Home equity,
              <br />
              <span className="relative font-normal italic">
                unlocked.
                <span
                  aria-hidden
                  className="anim-draw absolute -bottom-1 left-0 h-[6px] w-full origin-left rounded-full bg-valyra-lime/70"
                  style={{ animationDelay: "0.6s" }}
                />
              </span>
            </h1>
            <p
              className="anim-rise mt-7 max-w-xl text-lg leading-relaxed text-valyra-ink/75"
              style={{ animationDelay: "0.2s" }}
            >
              Homeowners sell a sliver of their home&apos;s future appreciation
              for cash today — no debt, no interest. We tokenize those rights so
              anyone can build a portfolio of Dutch property from{" "}
              <span className="font-mono font-medium text-valyra-ink">€100</span>.
            </p>
            <div
              className="anim-rise mt-9 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "0.28s" }}
            >
              <Link
                href="/investor"
                className="group inline-flex items-center gap-2 rounded-full bg-valyra-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-canvas"
              >
                Browse the market
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/homeowner"
                className="group inline-flex items-center gap-1.5 border-b border-valyra-ink/30 pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-valyra-blue hover:text-valyra-blue focus-visible:outline-none focus-visible:text-valyra-blue"
              >
                List your home
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Value props */}
            <ul
              className="anim-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-valyra-ink/55"
              style={{ animationDelay: "0.34s" }}
            >
              {["No debt", "0% interest", "Exit on resale", "AVM-priced"].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-valyra-lime" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature: living tokenized-asset card */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <AssetCard />
          </div>
        </section>

        {/* Market at a glance */}
        <section
          className="anim-rise grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-valyra-line bg-valyra-line sm:grid-cols-4"
          style={{ animationDelay: "0.4s" }}
          aria-label="Market at a glance"
        >
          {metrics.map((m) => (
            <div key={m.k} className="bg-valyra-canvas px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/45">
                {m.k}
              </p>
              <p className="display mt-1 text-2xl text-valyra-ink sm:text-3xl">{m.v}</p>
            </div>
          ))}
        </section>

        {/* The market — live listings */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-valyra-blue">
                The market · Open for investment
              </p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Featured homes</h2>
            </div>
            <Link
              href="/investor"
              className="group hidden shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-valyra-blue hover:text-valyra-ink sm:inline-flex"
            >
              Browse all {seedHomes.length} homes
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l, i) => (
              <ListingCard key={l.id} listing={l} delay={0.1 + i * 0.05} />
            ))}
          </div>

          <Link
            href="/investor"
            className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-valyra-blue hover:text-valyra-ink sm:hidden"
          >
            Browse all {seedHomes.length} homes
            <ArrowUpRight size={14} />
          </Link>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-valyra-ink/45">
            How it works
          </p>
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-valyra-line bg-valyra-line md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col bg-valyra-canvas p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-valyra-paper/70 text-valyra-blue">
                    <s.icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs text-valyra-ink/35">{s.n}</span>
                </div>
                <h3 className="display mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-valyra-ink/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dark closing band — contrast + final CTA */}
        <section className="anim-rise relative mt-16 overflow-hidden rounded-3xl bg-valyra-ink px-8 py-14 text-valyra-canvas sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-valyra-lime/15 blur-3xl"
          />
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-valyra-lime">
                Residential appreciation, fractionalized
              </p>
              <h2 className="display mt-4 text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.02]">
                Own a piece of the Dutch
                <br className="hidden sm:block" /> housing market — from €100.
              </h2>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <Link
                href="/investor"
                className="group inline-flex items-center gap-2 rounded-full bg-valyra-lime px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-valyra-ink transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-lime focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-ink"
              >
                Browse the market
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/admin"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-valyra-canvas/60 transition-colors hover:text-valyra-lime focus-visible:outline-none focus-visible:text-valyra-lime"
              >
                Operator desk →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-valyra-line py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-valyra-ink/50 sm:flex-row sm:items-center">
          <span>© 2026 Valyra — MVP demo</span>
          <span>Blockchain &amp; AVM valuation simulated</span>
        </footer>
      </div>
    </div>
  );
}

// Scrolling "live market" ticker under the masthead — fills the top band and
// signals an active market. Decorative (the real listings are below), so it's
// hidden from assistive tech and pauses on hover / with reduced motion.
function MarketTicker() {
  return (
    <div
      aria-hidden
      className="marquee-pause relative -mx-6 overflow-hidden border-y border-valyra-line bg-white/40"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
      }}
    >
      <div className="animate-marquee flex w-max items-center py-2.5 font-mono text-[11px] uppercase tracking-[0.14em]">
        {[...tickerItems, ...tickerItems].map((t, i) => (
          <span key={i} className="flex items-center gap-2.5 px-5">
            <span className="text-valyra-ink/70">{t.address}</span>
            <span className="text-valyra-ink/35">{t.city}</span>
            <span className="font-medium text-valyra-blue">+{t.pct}%</span>
            <span className="ml-2.5 h-1 w-1 rounded-full bg-valyra-ink/20" />
          </span>
        ))}
      </div>
    </div>
  );
}

type Listing = {
  id: string;
  address: string;
  city: string;
  valuation: number;
  tokenPrice: number;
  apprPct: number;
  fundedPct: number;
};

// A brokerage-style listing for one tokenized home, derived from seed data.
function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  return (
    <Link
      href="/investor"
      className="group anim-rise flex flex-col rounded-2xl border border-valyra-line bg-white/80 p-5 transition-all hover:-translate-y-1 hover:border-valyra-blue/40 hover:bg-white hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/45">
            <MapPin size={11} /> {listing.city}
          </p>
          <h3 className="display mt-1 text-xl leading-tight">{listing.address}</h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-valyra-ink">
          ▲ +{listing.apprPct}%/yr
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-valyra-ink/55">Valuation</dt>
        <dd className="text-right font-medium tabular-nums">{formatEUR(listing.valuation)}</dd>
        <dt className="text-valyra-ink/55">Token price</dt>
        <dd className="text-right font-medium tabular-nums">{formatEURPrecise(listing.tokenPrice)}</dd>
      </dl>

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-valyra-ink/10">
          <div className="h-full rounded-full bg-valyra-blue" style={{ width: `${listing.fundedPct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-valyra-ink/50">
          <span>{listing.fundedPct}% funded</span>
          <span className="inline-flex items-center gap-1 text-valyra-blue transition-colors group-hover:text-valyra-ink">
            Invest from €100
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// The signature artifact: a tokenized home as a "live" asset card —
// appreciation curve drawing in, ownership grid filling with tokens.
function AssetCard() {
  const total = 50; // 10 × 5 grid — kept compact so the card isn't too tall
  const filled = 6; // 6 of 50 ≈ 12% tokenized
  return (
    <div className="anim-settle w-full max-w-[20.5rem]" style={{ animationDelay: "0.3s" }}>
      <div className="relative -rotate-[1.2deg] rounded-2xl border border-valyra-line bg-white p-5 shadow-pop transition-transform duration-500 hover:rotate-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-valyra-ink/25 pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-valyra-ink/55">
            Tokenized asset · VH-0001
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-valyra-lime/20 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-valyra-ink">
            ▲ +8.4%/yr
          </span>
        </div>

        {/* Canal house */}
        <div className="flex justify-center pt-3">
          <CanalHouse />
        </div>

        {/* Appreciation curve */}
        <AppreciationCurve />
        <p className="-mt-1 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-valyra-ink/45">
          Est. value · 10-year path
        </p>

        {/* Ownership grid */}
        <div className="mt-4 grid grid-cols-10 gap-[3px]">
          {Array.from({ length: total }, (_, i) => {
            const on = i < filled;
            return (
              <span
                key={i}
                className={`aspect-square rounded-[1px] ${on ? "anim-pop bg-valyra-lime" : "bg-valyra-ink/15"}`}
                style={on ? { animationDelay: `${1 + i * 0.06}s` } : undefined}
              />
            );
          })}
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-valyra-ink/55">
          12% tokenized · 10,000 units
        </p>

        {/* Figures */}
        <div className="mt-3 space-y-1 border-t border-dashed border-valyra-ink/25 pt-3 font-mono text-[10px] text-valyra-ink/70">
          <CertRow l="Property" r="Prinsengracht 263" />
          <CertRow l="Valuation" r="€612,000" />
          <CertRow l="Unit price" r="€5.20" />
        </div>

        {/* Verified seal */}
        <div className="absolute -bottom-4 -right-4 grid h-16 w-16 rotate-[9deg] place-items-center rounded-full border border-valyra-blue bg-valyra-paper text-center font-mono text-[8px] font-bold uppercase leading-tight tracking-wider text-valyra-blue">
          NL
          <br />
          Verified
        </div>
      </div>
    </div>
  );
}

// Climbing value curve with a soft area fill — the "appreciation" thesis.
function AppreciationCurve() {
  const line = "M4 56 C 40 52, 64 44, 96 34 S 168 14, 196 8";
  const area = `${line} L196 64 L4 64 Z`;
  return (
    <svg viewBox="0 0 200 64" className="mt-3 w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="valyra-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fc242" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7fc242" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="4" y1="63" x2="196" y2="63" stroke="#1f3a4a" strokeOpacity="0.12" strokeWidth="1" />
      <path d={area} fill="url(#valyra-area)" className="anim-area" />
      <path
        d={line}
        pathLength={1}
        stroke="#1f5673"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="anim-line"
      />
      <circle cx="196" cy="8" r="3.5" fill="#7fc242" stroke="#ffffff" strokeWidth="1.5" className="anim-area" />
    </svg>
  );
}

function CertRow({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="uppercase tracking-[0.12em] text-valyra-ink/45">{l}</span>
      <span className="text-valyra-ink">{r}</span>
    </div>
  );
}

// Hand-built Dutch canal house (bell gable), ink line-art on paper.
function CanalHouse() {
  return (
    <svg
      width="100"
      height="121"
      viewBox="0 0 124 150"
      fill="none"
      stroke="#1f3a4a"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect x="22" y="54" width="80" height="94" fill="#ffffff" />
      <path
        d="M22 54 V46 Q22 32 36 30 Q42 18 62 18 Q82 18 88 30 Q102 32 102 46 V54 Z"
        fill="#ffffff"
      />
      <line x1="62" y1="18" x2="62" y2="9" />
      <path d="M57 9 h10" />
      <line x1="17" y1="54" x2="107" y2="54" />
      {[66, 92].map((y) =>
        [30, 53, 76].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="16" height="18" fill="#ffffff" />
            <line x1={x + 8} y1={y} x2={x + 8} y2={y + 18} strokeWidth="1.2" />
            <line x1={x} y1={y + 9} x2={x + 16} y2={y + 9} strokeWidth="1.2" />
          </g>
        )),
      )}
      <rect x="52" y="122" width="20" height="26" fill="#ffffff" />
      <line x1="62" y1="122" x2="62" y2="148" strokeWidth="1.2" />
    </svg>
  );
}
