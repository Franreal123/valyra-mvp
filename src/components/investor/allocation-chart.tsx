"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatEUR } from "@/lib/format";
import type { Position } from "@/lib/market";

// Donut of portfolio allocation by current value. Brand-palette slices.
// Fixed-size (not ResponsiveContainer) so it renders deterministically without
// depending on a ResizeObserver — robust in SSR and headless captures alike.
const COLORS = ["#1f5673", "#7fc242", "#1f3a4a", "#9bbcc9", "#b7d99a"];

export function AllocationChart({ positions }: { positions: Position[] }) {
  const data = positions.map((p) => ({
    name: `${p.home.address}, ${p.home.city}`,
    value: p.currentValue,
  }));

  return (
    <div className="flex justify-center">
      <PieChart width={280} height={220}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatEUR(Number(value))} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span className="text-xs text-valyra-ink/70">{value}</span>
          )}
        />
      </PieChart>
    </div>
  );
}
