import { DashboardShell } from "@/components/dashboard/shell";

export default function DemoCustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="customer" basePath="/demo/customer" isDemo>
      {children}
    </DashboardShell>
  );
}
