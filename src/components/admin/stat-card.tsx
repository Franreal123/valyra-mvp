import { Card } from "@/components/ui/card";

// One KPI tile for the admin overview.
export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-sm text-valyra-ink/60">{label}</p>
      <p className="text-2xl font-semibold text-valyra-ink">{value}</p>
      {sub ? <p className="text-xs text-valyra-ink/50">{sub}</p> : null}
    </Card>
  );
}
