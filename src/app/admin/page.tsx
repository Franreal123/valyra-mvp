import { AppHeader } from "@/components/app-header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SiteFooter } from "@/components/site-footer";

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col bg-valyra-canvas">
      <AppHeader active="/admin" />
      <div className="flex-1">
        <AdminDashboard />
      </div>
      <SiteFooter />
    </main>
  );
}
