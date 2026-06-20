import { AppHeader } from "@/components/app-header";
import { InvestorApp } from "@/components/investor/investor-app";

export default function InvestorPage() {
  return (
    <main className="min-h-screen bg-valyra-canvas">
      <AppHeader active="/investor" />
      <InvestorApp />
    </main>
  );
}
