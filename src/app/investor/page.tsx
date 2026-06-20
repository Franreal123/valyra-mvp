import Link from "next/link";

// Placeholder route — the investor journey (browse marketplace → buy
// fractional tokens → view portfolio) is built in a later step.
export default function InvestorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 px-6">
      <Link href="/" className="text-sm text-valyra-blue hover:underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-semibold text-valyra-ink">Investor</h1>
      <p className="text-valyra-ink/70">
        The investor journey is coming soon: browse the marketplace of tokenized
        homes, buy fractional shares from €100, and track your portfolio.
      </p>
    </main>
  );
}
