import Link from "next/link";

// Placeholder route — the homeowner journey (apply → AVM valuation →
// offer → sign) is built in a later step. Kept minimal on purpose.
export default function HomeownerPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 px-6">
      <Link href="/" className="text-sm text-valyra-blue hover:underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-semibold text-valyra-ink">Homeowner</h1>
      <p className="text-valyra-ink/70">
        The homeowner journey is coming soon: apply, get an AVM valuation,
        receive your offer, and sign your equity-sharing agreement.
      </p>
    </main>
  );
}
