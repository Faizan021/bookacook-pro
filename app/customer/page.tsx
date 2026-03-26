import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCustomerDashboardData } from "@/lib/dashboard/customer";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function CustomerPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "customer" && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData = await getCustomerDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Customer Overview</h1>
        <p className="mt-1 text-gray-500">
          Welcome back, {profile.full_name || profile.first_name || "Customer"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Orders" value={dashboardData.totalOrders} subtitle="All bookings made" />
        <MetricCard title="Completed Orders" value={dashboardData.completedOrders} subtitle="Successfully completed" />
        <MetricCard title="Pending Orders" value={dashboardData.pendingOrders} subtitle="Waiting for update" />
        <MetricCard title="Favorite Caterers" value={dashboardData.favoriteCaterers} subtitle="Saved by customer" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title="Order History" data={dashboardData.orderHistory} />
        </div>
        <RecentActivity title="Recent Orders" items={dashboardData.recentOrders} />
      </div>
    </div>
  );
}