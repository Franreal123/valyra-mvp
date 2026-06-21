import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-valyra-canvas">
      <PageSkeleton rows={3} />
    </main>
  );
}
