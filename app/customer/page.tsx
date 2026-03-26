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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {profile.full_name || profile.first_name || "Customer"}
          </p>
          <p className="mt-1 text-sm text-gray-500">Role: {profile.role}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            subtitle="All bookings made"
          />
          <MetricCard
            title="Completed Orders"
            value={dashboardData.completedOrders}
            subtitle="Successfully completed"
          />
          <MetricCard
            title="Pending Orders"
            value={dashboardData.pendingOrders}
            subtitle="Waiting for update"
          />
          <MetricCard
            title="Favorite Caterers"
            value={dashboardData.favoriteCaterers}
            subtitle="Saved by customer"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesChart title="Order History" data={dashboardData.orderHistory} />
          </div>

          <div>
            <RecentActivity title="Recent Orders" items={dashboardData.recentOrders} />
          </div>
        </div>
      </div>
    </main>
  );
}