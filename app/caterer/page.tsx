import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererDashboardData } from "@/lib/dashboard/caterer";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function CatererPage() {
  const { user, profile } = await getUserProfile();

  if (!user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "caterer" && profile.role !== "admin") {
    redirect("/dashboard");
  }

  const dashboardData = await getCatererDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Caterer Overview</h1>
        <p className="mt-1 text-gray-500">
          Welcome back, {profile.full_name || profile.first_name || "Caterer"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Sales" value={`€${dashboardData.totalSales}`} subtitle="Sales through Bookacook" />
        <MetricCard title="Total Orders" value={dashboardData.totalOrders} subtitle="All booking requests" />
        <MetricCard title="Pending Requests" value={dashboardData.pendingRequests} subtitle="Waiting for response" />
        <MetricCard title="Packages Live" value={dashboardData.packagesLive} subtitle="Visible to customers" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title="Monthly Sales" data={dashboardData.salesData} />
        </div>
        <RecentActivity title="Recent Bookings" items={dashboardData.recentBookings} />
      </div>
    </div>
  );
}