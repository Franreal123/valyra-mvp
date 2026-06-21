"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Accessible modal shell shared by the buy / KYC / settle dialogs. Handles the
// dialog semantics (role + aria-modal + labelled title), closes on Escape and on
// a backdrop click, and moves focus into the panel on open.
export function Modal({
  titleId,
  onClose,
  children,
  className,
}: {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-valyra-ink/40 p-4"
      onClick={onClose}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-md rounded-2xl bg-white p-6 shadow-pop outline-none",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
