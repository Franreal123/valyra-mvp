import { AppHeader } from "@/components/app-header";
import { HomeownerWizard } from "@/components/homeowner/homeowner-wizard";
import { SiteFooter } from "@/components/site-footer";

export default function HomeownerPage() {
  return (
    <main className="flex min-h-screen flex-col bg-valyra-canvas">
      <AppHeader active="/homeowner" />
      <div className="flex-1">
        <HomeownerWizard />
      </div>
      <SiteFooter />
    </main>
  );
}
