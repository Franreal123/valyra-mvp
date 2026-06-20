import { AppHeader } from "@/components/app-header";
import { InvestorApp } from "@/components/investor/investor-app";

export default function InvestorPage() {
  return (
    <main className="paper-texture min-h-screen">
      <AppHeader active="/investor" />
      <InvestorApp />
    </main>
  );
}
