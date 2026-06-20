import { AppHeader } from "@/components/app-header";
import { HomeownerWizard } from "@/components/homeowner/homeowner-wizard";

export default function HomeownerPage() {
  return (
    <main className="min-h-screen bg-valyra-canvas">
      <AppHeader active="/homeowner" />
      <HomeownerWizard />
    </main>
  );
}
