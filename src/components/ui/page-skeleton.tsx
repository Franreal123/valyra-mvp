// Route-level loading fallback (Next.js `loading.tsx`). Mirrors the page chrome
// — a title bar and a grid of cards — so navigation has a calm placeholder
// instead of a blank frame. Decorative only, hidden from assistive tech.
export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10" aria-hidden>
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-valyra-ink/10" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl bg-valyra-ink/[0.06]"
          />
        ))}
      </div>
    </div>
  );
}
