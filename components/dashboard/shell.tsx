import { Sidebar } from "@/components/dashboard/sidebar";

type DashboardShellProps = {
  role: "admin" | "caterer" | "customer";
  basePath: string;
  isDemo?: boolean;
  children: React.ReactNode;
};

export function DashboardShell({
  role,
  basePath,
  isDemo = false,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
