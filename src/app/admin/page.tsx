import Link from "next/link";

// Placeholder route — the admin / settlement & secondary-market view is
// built in a later step.
export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 px-6">
      <Link href="/" className="text-sm text-valyra-blue hover:underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-semibold text-valyra-ink">Admin</h1>
      <p className="text-valyra-ink/70">
        The admin view is coming soon: monitor settlements, the secondary
        market, and platform activity.
      </p>
    </main>
  );
}
