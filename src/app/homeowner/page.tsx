import { AppHeader } from "@/components/app-header";
import { HomeownerWizard } from "@/components/homeowner/homeowner-wizard";

export default function HomeownerPage() {
  return (
    <main className="paper-texture min-h-screen">
      <AppHeader active="/homeowner" />
      <HomeownerWizard />
    </main>
  );
}
