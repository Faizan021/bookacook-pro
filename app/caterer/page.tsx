import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CatererOverviewDisplay } from "@/components/dashboard/caterer-overview-display";

export default async function CatererOverviewPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch caterer details
  const { data: caterer } = await supabase
    .from("caterers")
    .select("business_name, verification_status")
    .eq("user_id", user.id)
    .single();

  // Basic dummy data for the beautiful display component until real metrics are hooked up
  const dashboardData = {
    totalSales: 0,
    totalOrders: 0,
    pendingRequests: 0,
    packagesLive: 0,
    salesData: [],
    recentBookings: [],
    userName: caterer?.business_name || "Caterer",
  };

  return <CatererOverviewDisplay data={dashboardData} />;
}
