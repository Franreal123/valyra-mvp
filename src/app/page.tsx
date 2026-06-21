import Link from "next/link";
import { ArrowUpRight, Home, Coins, LineChart } from "lucide-react";

// Landing page — server component. All motion is CSS (no client JS).
// Aesthetic: warm Dutch canvas + a living "tokenized asset" card as the
// signature — a canal house whose value curve draws itself on load and whose
// ownership grid fills with tokens. Brand palette only (see tailwind.config).

const ways = [
  {
    href: "/homeowner",
    icon: Home,
    title: "Homeowners",
    desc: "Turn a slice of your home's future value into cash today — no debt, no interest, no monthly payments.",
    action: "Get an offer",
  },
  {
    href: "/investor",
    icon: Coins,
    title: "Investors",
    desc: "Own fractional shares of Dutch homes and share in their appreciation. Build a portfolio from €100.",
    action: "Browse the market",
  },
  {
    href: "/admin",
    icon: LineChart,
    title: "The desk",
    desc: "The operator's view — capital raised and deployed, token supply, and per-home settlement.",
    action: "Open the desk",
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
        className="pointer-events-none absolute -left-48 top-[28rem] h-[30rem] w-[30rem] rounded-full bg-valyra-blue/10 blur-3xl"
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
            <Link href="/homeowner" className="rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas">
              Homeowners
            </Link>
            <Link href="/investor" className="rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas">
              Investors
            </Link>
            <Link href="/admin" className="rounded-sm transition-colors hover:text-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-4 focus-visible:ring-offset-valyra-canvas">
              Desk
            </Link>
          </nav>
        </header>
        <div className="hairline anim-draw" />

        {/* Hero */}
        <section className="grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p
              className="anim-rise inline-flex items-center gap-2 rounded-full border border-valyra-line bg-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-valyra-blue"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-valyra-lime" />
              NL · Home-equity · Tokenized
            </p>
            <h1
              className="display anim-rise mt-6 text-[clamp(3rem,8vw,6.75rem)] font-light leading-[0.9]"
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
              className="anim-rise mt-8 max-w-xl text-lg leading-relaxed text-valyra-ink/75"
              style={{ animationDelay: "0.2s" }}
            >
              Dutch homeowners sell a sliver of their home&apos;s future
              appreciation for cash today — no debt, no interest. We tokenize
              those rights so anyone can own a piece from{" "}
              <span className="font-mono font-medium text-valyra-ink">€100</span>.
            </p>
            <div
              className="anim-rise mt-10 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "0.28s" }}
            >
              <Link
                href="/homeowner"
                className="group inline-flex items-center gap-2 rounded-full bg-valyra-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-canvas"
              >
                Sell a share
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/investor"
                className="group inline-flex items-center gap-1.5 border-b border-valyra-ink/30 pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-valyra-blue hover:text-valyra-blue focus-visible:outline-none focus-visible:text-valyra-blue"
              >
                Invest from €100
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Trust stats */}
            <dl
              className="anim-rise mt-14 grid max-w-xl grid-cols-2 gap-x-10 gap-y-6 border-t border-valyra-line pt-6 sm:grid-cols-4"
              style={{ animationDelay: "0.36s" }}
            >
              <Stat k="Minimum" v="€100" />
              <Stat k="Interest" v="0%" />
              <Stat k="Monthly debt" v="None" />
              <Stat k="Exit" v="Resale market" />
            </dl>
          </div>

          {/* Signature: living tokenized-asset card */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <AssetCard />
          </div>
        </section>

        {/* Three ways in */}
        <section className="pt-4">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-valyra-ink/45">
            <span>One platform</span>
            <span>Three ways in</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {ways.map((w, i) => (
              <Link
                key={w.href}
                href={w.href}
                className="group anim-rise relative flex flex-col rounded-2xl border border-valyra-line bg-white/70 p-7 transition-all hover:-translate-y-1 hover:border-valyra-blue/40 hover:bg-white hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue"
                style={{ animationDelay: `${0.45 + i * 0.08}s` }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-valyra-paper/70 text-valyra-blue transition-colors group-hover:bg-valyra-lime/25">
                  <w.icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="display mt-5 text-2xl">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-valyra-ink/70">{w.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-valyra-blue">
                  {w.action}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
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
            <div className="flex lg:col-span-4 lg:justify-end">
              <Link
                href="/investor"
                className="group inline-flex items-center gap-2 rounded-full bg-valyra-lime px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-valyra-ink transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-lime focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-ink"
              >
                Browse the market
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-start justify-between gap-2 border-t border-valyra-line py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-valyra-ink/50 sm:flex-row sm:items-center">
          <span>© 2026 Valyra — MVP demo</span>
          <span>Blockchain &amp; AVM valuation simulated</span>
        </footer>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/45">{k}</dt>
      <dd className="font-mono text-sm font-medium text-valyra-ink">{v}</dd>
    </div>
  );
}

// The signature artifact: a tokenized home as a "live" asset card —
// appreciation curve drawing in, ownership grid filling with tokens.
function AssetCard() {
  const filled = 12; // 12 of 100 cells "owned" in this illustration
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
        <div className="flex justify-center pt-4">
          <CanalHouse />
        </div>

        {/* Appreciation curve */}
        <AppreciationCurve />
        <p className="-mt-1 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-valyra-ink/45">
          Est. value · 10-year path
        </p>

        {/* Ownership grid */}
        <div className="mt-4 grid grid-cols-10 gap-[3px]">
          {Array.from({ length: 100 }, (_, i) => {
            const on = i < filled;
            return (
              <span
                key={i}
                className={`aspect-square rounded-[1px] ${on ? "anim-pop bg-valyra-lime" : "bg-valyra-ink/15"}`}
                style={on ? { animationDelay: `${1 + i * 0.04}s` } : undefined}
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
  // A gently rising path, normalized to pathLength 1 for the draw animation.
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
      {/* baseline */}
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
      width="116"
      height="138"
      viewBox="0 0 124 150"
      fill="none"
      stroke="#1f3a4a"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* body + bell gable */}
      <rect x="22" y="54" width="80" height="94" fill="#ffffff" />
      <path
        d="M22 54 V46 Q22 32 36 30 Q42 18 62 18 Q82 18 88 30 Q102 32 102 46 V54 Z"
        fill="#ffffff"
      />
      {/* hoisting beam at the apex */}
      <line x1="62" y1="18" x2="62" y2="9" />
      <path d="M57 9 h10" />
      {/* cornice */}
      <line x1="17" y1="54" x2="107" y2="54" />
      {/* windows: two rows of three, with muntins */}
      {[66, 92].map((y) =>
        [30, 53, 76].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="16" height="18" fill="#ffffff" />
            <line x1={x + 8} y1={y} x2={x + 8} y2={y + 18} strokeWidth="1.2" />
            <line x1={x} y1={y + 9} x2={x + 16} y2={y + 9} strokeWidth="1.2" />
          </g>
        )),
      )}
      {/* door */}
      <rect x="52" y="122" width="20" height="26" fill="#ffffff" />
      <line x1="62" y1="122" x2="62" y2="148" strokeWidth="1.2" />
    </svg>
  );
}
