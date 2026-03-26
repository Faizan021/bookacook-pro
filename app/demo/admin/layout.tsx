import { DashboardShell } from "@/components/dashboard/shell";

export default function DemoAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="admin" basePath="/demo/admin" isDemo>
      {children}
    </DashboardShell>
  );
}
