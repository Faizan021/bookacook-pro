import { DashboardShell } from "@/components/dashboard/shell";

export default function CatererLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="caterer" basePath="/caterer">
      {children}
    </DashboardShell>
  );
}
