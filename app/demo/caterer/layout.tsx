import { DashboardShell } from "@/components/dashboard/shell";

export default function DemoCatererLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="caterer" basePath="/demo/caterer" isDemo>
      {children}
    </DashboardShell>
  );
}
