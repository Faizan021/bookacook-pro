import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const salesData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1800 },
  { name: "Mar", value: 1600 },
  { name: "Apr", value: 2400 },
  { name: "May", value: 2100 },
  { name: "Jun", value: 3200 },
];

const recentBookings = [
  {
    title: "Corporate Lunch - Berlin",
    subtitle: "24 guests • Confirmed",
    amount: "€1,200",
  },
  {
    title: "Wedding Catering - Potsdam",
    subtitle: "80 guests • Pending",
    amount: "€3,800",
  },
  {
    title: "Private Dinner - Hamburg",
    subtitle: "12 guests • Completed",
    amount: "€640",
  },
];

export default function DemoCatererPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Caterer Overview</h1>
        <p className="mt-1 text-gray-500">Your business performance at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Sales" value="€12,400" subtitle="Sales through Bookacook" />
        <MetricCard title="Total Orders" value={18} subtitle="All booking requests" />
        <MetricCard title="Pending Requests" value={4} subtitle="Waiting for response" />
        <MetricCard title="Packages Live" value={6} subtitle="Visible to customers" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title="Monthly Sales" data={salesData} />
        </div>
        <RecentActivity title="Recent Bookings" items={recentBookings} />
      </div>
    </div>
  );
}