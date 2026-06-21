import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Valyra works: tokenized Dutch home-equity sharing — the mechanic, economics, returns and risk, eligibility, and the full legal & regulatory detail.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col bg-valyra-canvas">
      <AppHeader active="/how-it-works" />
      <div className="flex-1">
        {/* Page intro */}
        <div className="mx-auto max-w-3xl px-6 pt-12 pb-2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-valyra-blue">
            For investors &amp; homeowners
          </p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[0.95] text-valyra-ink">
            How Valyra works
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-valyra-ink/70">
            The mechanic, the economics, the returns and risks, and the legal and
            regulatory detail — in plain terms.
          </p>
        </div>

        <div className="px-6 py-10">
          <HowItWorks />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
