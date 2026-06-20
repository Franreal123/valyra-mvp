import Link from "next/link";
import { cn } from "@/lib/utils";

// Shared editorial chrome across the three flows. Server component — the
// wordmark returns home, so individual pages no longer need a "Back" link.
const links = [
  { href: "/homeowner", label: "Homeowners" },
  { href: "/investor", label: "Investors" },
  { href: "/admin", label: "Desk" },
] as const;

type FlowPath = (typeof links)[number]["href"];

export function AppHeader({ active }: { active: FlowPath }) {
  return (
    <header className="border-b border-valyra-ink/15">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="display text-2xl font-semibold text-valyra-ink">Valyra</span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-valyra-ink/40 sm:block">
            NL · Tokenized
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] sm:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-valyra-blue",
                active === l.href ? "text-valyra-blue" : "text-valyra-ink/55",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
