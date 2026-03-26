import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getAdminDashboardData } from "@/lib/dashboard/admin";
import { AdminOverviewDisplay } from "@/components/dashboard/admin-overview-display";

export default async function AdminPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData = await getAdminDashboardData();

  return (
    <AdminOverviewDisplay
      data={{
        totalRevenue: dashboardData.totalRevenue,
        totalCommission: dashboardData.totalCommission,
        totalCaterers: dashboardData.totalCaterers,
        totalOrders: dashboardData.totalOrders,
        revenueData: dashboardData.revenueData,
        recentActivity: dashboardData.recentActivity,
        userName: profile.full_name || profile.first_name || undefined,
      }}
    />
  );
}
