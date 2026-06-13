import { DashboardShell } from "@/components/dashboard/shell";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="restaurant" basePath="/restaurant">
      {children}
    </DashboardShell>
  );
}
