import { createClient } from "@/lib/supabase/server";

type BookingRow = {
  id: string;
  status: string;
  created_at: string;
  final_amount?: number | null;
  quoted_amount?: number | null;
};

type PaymentRow = {
  id: string;
  amount_total: number;
  payment_status: string;
  created_at: string;
};

export async function getCatererDashboardData(userId: string) {
  const supabase = await createClient();

  const { data: caterer } = await supabase
    .from("caterers")
    .select("id,business_name")
    .eq("user_id", userId)
    .single();

  if (!caterer) {
    return {
      totalSales: 0,
      totalOrders: 0,
      pendingRequests: 0,
      packagesLive: 0,
      salesData: [],
      recentBookings: [],
    };
  }

  const [bookingsRes, packagesRes, paymentsRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("id,status,created_at,final_amount,quoted_amount")
      .eq("caterer_id", caterer.id)
      .order("created_at", { ascending: false }),
    supabase.from("packages").select("id").eq("caterer_id", caterer.id),
    supabase
      .from("payments")
      .select("id,amount_total,payment_status,created_at")
      .eq("caterer_id", caterer.id),
  ]);

  const bookings = (bookingsRes.data ?? []) as BookingRow[];
  const packages = packagesRes.data ?? [];
  const payments = (paymentsRes.data ?? []) as PaymentRow[];

  const totalSales =
    payments.length > 0
      ? payments
          .filter((p) => ["paid", "payout_sent"].includes(p.payment_status))
          .reduce((sum, p) => sum + Number(p.amount_total || 0), 0)
      : 0;

  const salesData = payments.length > 0 ? buildSalesData(payments) : [];

  const recentBookings =
    bookings.length > 0
      ? bookings.slice(0, 3).map((booking, index) => ({
          title: `Booking #${index + 1}`,
          subtitle: `Status: ${booking.status}`,
          amount: booking.final_amount
            ? `€${booking.final_amount}`
            : booking.quoted_amount
            ? `€${booking.quoted_amount}`
            : undefined,
        }))
      : [];

  return {
    totalSales,
    totalOrders: bookings.length,
    pendingRequests: bookings.filter((b) => b.status === "pending").length,
    packagesLive: packages.length,
    salesData,
    recentBookings,
  };
}

function buildSalesData(payments: PaymentRow[]) {
  const map = new Map<string, number>();

  for (const payment of payments) {
    const month = new Date(payment.created_at).toLocaleString("en-US", {
      month: "short",
    });
    map.set(month, (map.get(month) || 0) + Number(payment.amount_total || 0));
  }

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
