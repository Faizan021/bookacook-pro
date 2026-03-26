import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const revenueData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 6100 },
  { name: "Mar", value: 5300 },
  { name: "Apr", value: 7900 },
  { name: "May", value: 6800 },
  { name: "Jun", value: 9400 },
];

const recentPlatformActivity = [
  {
    title: "New caterer application",
    subtitle: "Berlin BBQ House • Pending approval",
  },
  {
    title: "Large booking completed",
    subtitle: "Corporate event • 120 guests",
    amount: "€4,200",
  },
  {
    title: "Commission received",
    subtitle: "Platform fee from recent booking",
    amount: "€420",
  },
];

export default function DemoAdminPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="mt-1 text-gray-500">Platform operations at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Platform Revenue" value="€38,500" subtitle="Total GMV on platform" />
        <MetricCard title="Commission Earned" value="€3,850" subtitle="10% platform share" />
        <MetricCard title="Total Caterers" value={24} subtitle="Registered caterers" />
        <MetricCard title="Total Orders" value={126} subtitle="All bookings on platform" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title="Platform Revenue Trend" data={revenueData} />
        </div>
        <RecentActivity title="Platform Activity" items={recentPlatformActivity} />
      </div>
    </div>
  );
}