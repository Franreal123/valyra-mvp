import Link from "next/link";
import { Home, LineChart, ShieldCheck, ArrowRight } from "lucide-react";

// Landing page — server component (no client-side interactivity needed).
// The three feature cards are the entry points into the MVP's flows.
const features = [
  {
    href: "/homeowner",
    icon: Home,
    title: "For homeowners",
    body: "Unlock cash from your home's future appreciation — no debt, no monthly payments, no interest.",
    cta: "Get an offer",
  },
  {
    href: "/investor",
    icon: LineChart,
    title: "For investors",
    body: "Buy fractional, tokenized shares of Dutch homes from €100 and share in their appreciation.",
    cta: "Browse homes",
  },
  {
    href: "/admin",
    icon: ShieldCheck,
    title: "Settlement & market",
    body: "Track settlements and the secondary market where appreciation tokens trade hands.",
    cta: "Open admin",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-valyra-paper text-valyra-ink">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-valyra-blue font-mono text-lg font-bold text-valyra-paper">
            V
          </span>
          <span className="text-xl font-semibold tracking-tight">Valyra</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link href="/homeowner" className="hover:text-valyra-blue">
            Homeowners
          </Link>
          <Link href="/investor" className="hover:text-valyra-blue">
            Investors
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-valyra-ink px-4 py-2 text-valyra-paper transition-colors hover:bg-valyra-blue"
          >
            Admin
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:pt-20">
        <span className="inline-flex items-center rounded-full border border-valyra-blue/20 bg-white/50 px-3 py-1 text-xs font-medium text-valyra-blue">
          🇳🇱 Home equity sharing, tokenized for the Netherlands
        </span>
        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Home equity, <span className="text-valyra-blue">unlocked</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-valyra-ink/70">
          Dutch homeowners sell a fraction of their home&apos;s future
          appreciation for cash today — no debt, no interest. Those rights are
          tokenized, so retail investors can own a piece from just €100.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/homeowner"
            className="inline-flex items-center gap-2 rounded-full bg-valyra-lime px-6 py-3 font-semibold text-valyra-ink transition-transform hover:-translate-y-0.5"
          >
            I&apos;m a homeowner <ArrowRight size={18} />
          </Link>
          <Link
            href="/investor"
            className="inline-flex items-center gap-2 rounded-full border border-valyra-ink/15 bg-white px-6 py-3 font-semibold transition-colors hover:border-valyra-blue hover:text-valyra-blue"
          >
            I&apos;m an investor
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {features.map(({ href, icon: Icon, title, body, cta }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-2xl border border-valyra-ink/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-valyra-blue/40 hover:shadow-lg"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-valyra-blue/10 text-valyra-blue">
              <Icon size={22} />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-valyra-ink/70">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-valyra-blue">
              {cta}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-valyra-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-valyra-ink/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Valyra — MVP demo</span>
          <span>
            Blockchain &amp; AVM valuation are simulated for this prototype.
          </span>
        </div>
      </footer>
    </div>
  );
}
