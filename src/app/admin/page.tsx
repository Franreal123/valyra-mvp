import { AppHeader } from "@/components/app-header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-valyra-canvas">
      <AppHeader active="/admin" />
      <AdminDashboard />
    </main>
  );
}
