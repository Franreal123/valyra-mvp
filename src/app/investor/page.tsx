import { AppHeader } from "@/components/app-header";
import { InvestorApp } from "@/components/investor/investor-app";
import { SiteFooter } from "@/components/site-footer";

export default function InvestorPage() {
  return (
    <main className="flex min-h-screen flex-col bg-valyra-canvas">
      <AppHeader active="/investor" />
      <div className="flex-1">
        <InvestorApp />
      </div>
      <SiteFooter />
    </main>
  );
}
