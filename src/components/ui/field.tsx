import type { ReactNode } from "react";

export const inputClass =
  "rounded-lg border border-valyra-ink/15 bg-white px-3 py-2 text-valyra-ink outline-none focus:border-valyra-blue";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-valyra-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-valyra-ink/50">{hint}</span> : null}
    </label>
  );
}
