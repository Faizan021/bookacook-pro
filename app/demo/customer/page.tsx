import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const orderData = [
  { name: "Jan", value: 1 },
  { name: "Feb", value: 3 },
  { name: "Mar", value: 2 },
  { name: "Apr", value: 4 },
  { name: "May", value: 3 },
  { name: "Jun", value: 5 },
];

const recentOrders = [
  {
    title: "BBQ Party Booking",
    subtitle: "Booked with Berlin Grill House • Completed",
    amount: "€850",
  },
  {
    title: "Wedding Catering Inquiry",
    subtitle: "Booked with Royal Events Catering • Pending",
    amount: "€2,400",
  },
  {
    title: "Corporate Lunch",
    subtitle: "Booked with FreshBite Catering • Confirmed",
    amount: "€1,150",
  },
];

export default function DemoCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Customer Overview</h1>
        <p className="mt-1 text-gray-500">Your bookings and activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Orders" value={12} subtitle="All bookings made" />
        <MetricCard title="Completed Orders" value={8} subtitle="Successfully completed" />
        <MetricCard title="Pending Orders" value={3} subtitle="Waiting for update" />
        <MetricCard title="Favorite Caterers" value={5} subtitle="Saved by customer" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title="Order History" data={orderData} />
        </div>
        <RecentActivity title="Recent Orders" items={recentOrders} />
      </div>
    </div>
  );
}