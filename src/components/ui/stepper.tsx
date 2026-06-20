import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                done && "bg-valyra-lime text-valyra-ink",
                active && "bg-valyra-blue text-white",
                !done && !active && "bg-valyra-ink/10 text-valyra-ink/50",
              )}
            >
              {done ? <Check size={16} /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:block",
                active ? "font-semibold text-valyra-ink" : "text-valyra-ink/50",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-1 hidden h-px flex-1 bg-valyra-ink/15 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
