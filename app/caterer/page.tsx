import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererDashboardData } from "@/lib/dashboard/caterer";
import { CatererOverviewDisplay } from "@/components/dashboard/caterer-overview-display";

export default async function CatererPage() {
  const { user, profile } = await getUserProfile();

  if (!user) redirect("/login");
  if (!profile) redirect("/");

  if (profile.role !== "caterer" && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData = await getCatererDashboardData(user.id);

  return (
    <CatererOverviewDisplay
      data={{
        totalSales: dashboardData.totalSales,
        totalOrders: dashboardData.totalOrders,
        pendingRequests: dashboardData.pendingRequests,
        packagesLive: dashboardData.packagesLive,
        salesData: dashboardData.salesData,
        recentBookings: dashboardData.recentBookings,
        userName: profile.full_name || profile.first_name || undefined,
      }}
    />
  );
}
