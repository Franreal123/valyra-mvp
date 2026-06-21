"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";

export const inputClass =
  "rounded-lg border border-valyra-ink/15 bg-white px-3 py-2 text-valyra-ink outline-none focus:border-valyra-blue focus-visible:ring-2 focus-visible:ring-valyra-blue/40";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  // Associate the label and (optional) hint with the control by injecting an id
  // and aria-describedby, so the accessible name stays the label alone and the
  // hint is read as a description.
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        "aria-describedby": hintId,
      })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-valyra-ink">
        {label}
      </label>
      {control}
      {hint ? (
        <span id={hintId} className="text-xs text-valyra-ink/50">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
