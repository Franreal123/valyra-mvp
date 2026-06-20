import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Landing page — server component. All motion is CSS (no client JS).
// Aesthetic: Dutch editorial broadsheet — warm paper, ink, a high-contrast
// display serif, mono financial labels, and a tokenization "certificate".

const departments = [
  {
    n: "01",
    href: "/homeowner",
    title: "Homeowners",
    desc: "Turn a share of your home's future value into cash today. Apply, get an instant AVM valuation, sign.",
    action: "Get an offer",
  },
  {
    n: "02",
    href: "/investor",
    title: "Investors",
    desc: "Own fractional shares of Dutch homes and share in their appreciation. Build a portfolio from €100.",
    action: "Browse the market",
  },
  {
    n: "03",
    href: "/admin",
    title: "Settlement",
    desc: "The operator's desk — platform capital, token supply, and per-home settlement.",
    action: "Open the desk",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="paper-texture grain relative min-h-screen overflow-hidden text-valyra-ink">
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
            <Link href="/homeowner" className="hover:text-valyra-blue">Homeowners</Link>
            <Link href="/investor" className="hover:text-valyra-blue">Investors</Link>
            <Link href="/admin" className="hover:text-valyra-blue">Desk</Link>
          </nav>
        </header>
        <div className="hairline anim-draw" />

        {/* Hero */}
        <section className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p
              className="anim-rise font-mono text-xs uppercase tracking-[0.25em] text-valyra-blue"
              style={{ animationDelay: "0.05s" }}
            >
              ▸ NL · Home-equity · Tokenized
            </p>
            <h1
              className="display anim-rise mt-6 text-[clamp(3rem,8vw,6.5rem)] font-light leading-[0.92]"
              style={{ animationDelay: "0.12s" }}
            >
              Home equity,
              <br />
              <span className="font-normal italic">unlocked.</span>
            </h1>
            <p
              className="anim-rise mt-8 max-w-xl text-lg leading-relaxed text-valyra-ink/75"
              style={{ animationDelay: "0.2s" }}
            >
              Dutch homeowners sell a sliver of their home&apos;s future
              appreciation for cash today — no debt, no interest. We tokenize
              those rights so anyone can own a piece from{" "}
              <span className="font-mono text-valyra-ink">€100</span>.
            </p>
            <div
              className="anim-rise mt-10 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "0.28s" }}
            >
              <Link
                href="/homeowner"
                className="group inline-flex items-center gap-2 bg-valyra-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-valyra-paper transition-colors hover:bg-valyra-blue"
              >
                Sell a share
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/investor"
                className="group inline-flex items-center gap-1.5 border-b border-valyra-ink/30 pb-1 font-mono text-xs uppercase tracking-[0.18em] hover:border-valyra-blue hover:text-valyra-blue"
              >
                Invest from €100
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Ticker stats */}
            <dl
              className="anim-rise mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-valyra-ink/15 pt-6"
              style={{ animationDelay: "0.36s" }}
            >
              <Stat k="Minimum" v="€100" />
              <Stat k="Interest" v="0%" />
              <Stat k="Monthly debt" v="None" />
              <Stat k="Liquidity" v="Secondary market" />
            </dl>
          </div>

          {/* Certificate artifact */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Certificate />
          </div>
        </section>

        {/* Departments */}
        <section className="border-t-2 border-valyra-ink pt-3">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-valyra-ink/50">
            <span>The desk</span>
            <span>Three ways in</span>
          </div>
          <div className="mt-2 grid grid-cols-1 divide-y divide-valyra-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {departments.map((d, i) => (
              <Link
                key={d.href}
                href={d.href}
                className="group anim-rise relative overflow-hidden p-7 pl-0 md:px-7"
                style={{ animationDelay: `${0.45 + i * 0.08}s` }}
              >
                <span className="font-mono text-xs text-valyra-ink/40">{d.n}</span>
                <h3 className="display mt-3 text-3xl">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-valyra-ink/70">{d.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-valyra-blue">
                  {d.action}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-valyra-lime transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-start justify-between gap-2 border-t border-valyra-ink/15 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-valyra-ink/50 sm:flex-row sm:items-center">
          <span>© 2026 Valyra — MVP demo</span>
          <span>Blockchain &amp; AVM valuation simulated</span>
        </footer>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-valyra-ink/45">{k}</dt>
      <dd className="font-mono text-sm text-valyra-ink">{v}</dd>
    </div>
  );
}

// A printed "share certificate" for a tokenized home — the memorable artifact.
function Certificate() {
  const tokens = Array.from({ length: 100 }, (_, i) => i < 10); // 10% filled
  return (
    <div className="anim-settle w-full max-w-[20rem]" style={{ animationDelay: "0.3s" }}>
      <div className="relative -rotate-[1.5deg] border border-valyra-ink/70 bg-[#f7f1e6] p-5 shadow-[10px_10px_0_0_rgba(31,58,74,0.12)]">
        <div className="flex items-center justify-between border-b border-dashed border-valyra-ink/30 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-valyra-ink/60">
          <span>Tokenization Cert.</span>
          <span>VH-0001</span>
        </div>

        <div className="flex justify-center py-4">
          <CanalHouse />
        </div>

        <div className="grid grid-cols-10 gap-[3px]">
          {tokens.map((on, i) => (
            <span
              key={i}
              className={`aspect-square rounded-[1px] ${on ? "bg-valyra-lime" : "bg-valyra-ink/20"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-valyra-ink/55">
          10% tokenized · 10,000 units
        </p>

        <div className="mt-3 space-y-1 border-t border-dashed border-valyra-ink/30 pt-3 font-mono text-[10px] text-valyra-ink/70">
          <CertRow l="Property" r="Prinsengracht 263" />
          <CertRow l="Valuation" r="€612,000" />
          <CertRow l="Unit price" r="€5.20" />
        </div>

        <div className="absolute -bottom-4 -right-4 grid h-16 w-16 rotate-[9deg] place-items-center rounded-full border border-valyra-blue bg-valyra-paper text-center font-mono text-[8px] font-bold uppercase leading-tight tracking-wider text-valyra-blue">
          NL
          <br />
          Verified
        </div>
      </div>
    </div>
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
      width="124"
      height="150"
      viewBox="0 0 124 150"
      fill="none"
      stroke="#1f3a4a"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* body + bell gable */}
      <rect x="22" y="54" width="80" height="94" fill="#efe5d8" />
      <path
        d="M22 54 V46 Q22 32 36 30 Q42 18 62 18 Q82 18 88 30 Q102 32 102 46 V54 Z"
        fill="#efe5d8"
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
            <rect x={x} y={y} width="16" height="18" fill="#f7f1e6" />
            <line x1={x + 8} y1={y} x2={x + 8} y2={y + 18} strokeWidth="1.2" />
            <line x1={x} y1={y + 9} x2={x + 16} y2={y + 9} strokeWidth="1.2" />
          </g>
        )),
      )}
      {/* door */}
      <rect x="52" y="122" width="20" height="26" fill="#f7f1e6" />
      <line x1="62" y1="122" x2="62" y2="148" strokeWidth="1.2" />
    </svg>
  );
}
