import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCustomerDashboardData } from "@/lib/dashboard/customer";
import { CustomerOverviewDisplay } from "@/components/dashboard/customer-overview-display";

export default async function CustomerPage() {
  const { user, profile } = await getUserProfile();

  if (!user) redirect("/login");
  if (!profile) redirect("/");

  if (profile.role !== "customer" && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData = await getCustomerDashboardData(user.id);

  return (
    <CustomerOverviewDisplay
      data={{
        totalOrders: dashboardData.totalOrders,
        completedOrders: dashboardData.completedOrders,
        pendingOrders: dashboardData.pendingOrders,
        favoriteCaterers: dashboardData.favoriteCaterers,
        orderHistory: dashboardData.orderHistory,
        recentOrders: dashboardData.recentOrders,
        userName: profile.full_name || profile.first_name || undefined,
      }}
    />
  );
}
