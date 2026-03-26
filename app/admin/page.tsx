import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getAdminDashboardData } from "@/lib/dashboard/admin";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {profile.full_name || profile.first_name || "Admin"}
          </p>
          <p className="mt-1 text-sm text-gray-500">Role: {profile.role}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Platform Revenue"
            value={`€${dashboardData.totalRevenue}`}
            subtitle="Total GMV on platform"
          />
          <MetricCard
            title="Commission Earned"
            value={`€${dashboardData.totalCommission}`}
            subtitle="10% platform share"
          />
          <MetricCard
            title="Total Caterers"
            value={dashboardData.totalCaterers}
            subtitle="Registered caterers"
          />
          <MetricCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            subtitle="All bookings on platform"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesChart
              title="Platform Revenue Trend"
              data={dashboardData.revenueData}
            />
          </div>

          <div>
            <RecentActivity
              title="Platform Activity"
              items={dashboardData.recentActivity}
            />
          </div>
        </div>
      </div>
    </main>
  );
}