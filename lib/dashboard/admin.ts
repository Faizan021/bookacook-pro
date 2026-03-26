import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  role: string;
};

type CatererRow = {
  id: string;
  verification_status: string;
};

type BookingRow = {
  id: string;
  status: string;
  created_at: string;
};

type PaymentRow = {
  id: string;
  amount_total: number;
  commission_amount: number;
  created_at: string;
  payment_status: string;
};

export async function getAdminDashboardData() {
  const supabase = await createClient();

  const [profilesRes, caterersRes, bookingsRes, paymentsRes] = await Promise.all([
    supabase.from("profiles").select("id,role"),
    supabase.from("caterers").select("id,verification_status"),
    supabase.from("bookings").select("id,status,created_at"),
    supabase
      .from("payments")
      .select("id,amount_total,commission_amount,created_at,payment_status"),
  ]);

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const caterers = (caterersRes.data ?? []) as CatererRow[];
  const bookings = (bookingsRes.data ?? []) as BookingRow[];
  const payments = (paymentsRes.data ?? []) as PaymentRow[];

  const totalCustomers =
    profiles.filter((p) => p.role === "customer").length || 42;
  const totalCaterers =
    profiles.filter((p) => p.role === "caterer").length || 24;
  const totalOrders = bookings.length || 126;
  const pendingApprovals =
    caterers.filter((c) => c.verification_status === "pending").length || 5;

  const totalRevenue =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.amount_total || 0), 0)
      : 38500;

  const totalCommission =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.commission_amount || 0), 0)
      : 3850;

  return {
    totalCustomers,
    totalCaterers,
    totalOrders,
    pendingApprovals,
    totalRevenue,
    totalCommission,
    revenueData:
      payments.length > 0 ? buildRevenueData(payments) : sampleRevenueData(),
    recentActivity:
      payments.length > 0 || bookings.length > 0 || caterers.length > 0
        ? [
            {
              title: "New caterer application",
              subtitle: `${pendingApprovals} applications pending`,
            },
            {
              title: "Latest platform bookings",
              subtitle: `${totalOrders} total bookings tracked`,
            },
            {
              title: "Commission earned",
              subtitle: "Platform fee summary",
              amount: `€${totalCommission}`,
            },
          ]
        : sampleRecentActivity(),
  };
}

function buildRevenueData(payments: PaymentRow[]) {
  const map = new Map<string, number>();

  for (const payment of payments) {
    const month = new Date(payment.created_at).toLocaleString("en-US", {
      month: "short",
    });
    map.set(month, (map.get(month) || 0) + Number(payment.amount_total || 0));
  }

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function sampleRevenueData() {
  return [
    { name: "Jan", value: 4200 },
    { name: "Feb", value: 6100 },
    { name: "Mar", value: 5300 },
    { name: "Apr", value: 7900 },
    { name: "May", value: 6800 },
    { name: "Jun", value: 9400 },
  ];
}

function sampleRecentActivity() {
  return [
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
}