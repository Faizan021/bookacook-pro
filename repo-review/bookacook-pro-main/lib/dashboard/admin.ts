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
    profiles.filter((p) => p.role === "customer").length;
  const totalCaterers =
    profiles.filter((p) => p.role === "caterer").length;
  const totalOrders = bookings.length;
  const pendingApprovals =
    caterers.filter((c) => c.verification_status === "pending").length;

  const totalRevenue =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.amount_total || 0), 0)
      : 0;

  const totalCommission =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.commission_amount || 0), 0)
      : 0;

  return {
    totalCustomers,
    totalCaterers,
    totalOrders,
    pendingApprovals,
    totalRevenue,
    totalCommission,
    revenueData:
      payments.length > 0 ? buildRevenueData(payments) : [],
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
        : [],
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