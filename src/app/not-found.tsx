import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-valyra-canvas px-6 text-center text-valyra-ink">
      <Link href="/" className="display text-2xl font-semibold">
        Valyra
      </Link>
      <span className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-valyra-blue">
        404 · Not found
      </span>
      <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[0.95]">
        This page isn&apos;t
        <br />
        <span className="font-normal italic">on the market.</span>
      </h1>
      <p className="mt-5 max-w-md text-valyra-ink/70">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Head
        back and explore the homes that are listed.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-valyra-ink px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-pop transition-all hover:-translate-y-0.5 hover:bg-valyra-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valyra-blue focus-visible:ring-offset-2 focus-visible:ring-offset-valyra-canvas"
        >
          Back home
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/investor"
          className="group inline-flex items-center gap-1.5 border-b border-valyra-ink/30 pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-valyra-blue hover:text-valyra-blue focus-visible:outline-none focus-visible:text-valyra-blue"
        >
          Browse the market
          <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
