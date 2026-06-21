import Link from "next/link";

// Shared footer for the app pages (homeowner / investor / desk), matching the
// landing footer so every screen has consistent chrome and the simulation
// disclaimer is always visible.
export function SiteFooter() {
  return (
    <footer className="border-t border-valyra-line">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-valyra-ink/50 sm:flex-row sm:items-center">
        <span>© 2026 Valyra — MVP demo</span>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link href="/homeowner" className="transition-colors hover:text-valyra-blue">
            Homeowners
          </Link>
          <Link href="/investor" className="transition-colors hover:text-valyra-blue">
            Investors
          </Link>
          <Link href="/admin" className="transition-colors hover:text-valyra-blue">
            Desk
          </Link>
        </nav>
        <span>Blockchain &amp; AVM valuation simulated</span>
      </div>
    </footer>
  );
}
