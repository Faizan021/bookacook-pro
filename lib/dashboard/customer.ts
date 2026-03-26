import { createClient } from "@/lib/supabase/server";

type BookingRow = {
  id: string;
  status: string;
  created_at: string;
};

export async function getCustomerDashboardData(userId: string) {
  const supabase = await createClient();

  const [bookingsRes, savedRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("id,status,created_at")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("saved_caterers")
      .select("id")
      .eq("customer_id", userId),
  ]);

  const bookings = (bookingsRes.data ?? []) as BookingRow[];
  const savedCaterers = savedRes.data ?? [];

  const totalOrders = bookings.length;
  const completedOrders = bookings.filter((b) => b.status === "completed").length;
  const pendingOrders = bookings.filter((b) =>
    ["pending", "quoted", "confirmed"].includes(b.status)
  ).length;

  const orderHistory =
    bookings.length > 0
      ? buildOrderHistory(bookings)
      : [
          { name: "Jan", value: 1 },
          { name: "Feb", value: 3 },
          { name: "Mar", value: 2 },
          { name: "Apr", value: 4 },
          { name: "May", value: 3 },
          { name: "Jun", value: 5 },
        ];

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    favoriteCaterers: savedCaterers.length,
    orderHistory,
    recentOrders:
      bookings.length > 0
        ? bookings.slice(0, 3).map((booking, index) => ({
            title: `Booking #${index + 1}`,
            subtitle: `Status: ${booking.status}`,
          }))
        : [
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
          ],
  };
}

function buildOrderHistory(bookings: BookingRow[]) {
  const map = new Map<string, number>();

  for (const booking of bookings) {
    const month = new Date(booking.created_at).toLocaleString("en-US", {
      month: "short",
    });
    map.set(month, (map.get(month) || 0) + 1);
  }

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}