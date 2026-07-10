import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://athwccvgdovglcpluwnu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjY3NTEsImV4cCI6MjA5MDEwMjc1MX0.-hdc4Oof8qS-CT6i5Xohe3NjMw8VYD0jctqieh4Zjy8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Running fixed getRestaurant query simulation...");
  const slugOrId = "schnitzel-schmiede";
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  const query = supabase
    .from("restaurants")
    .select(
      "id, name, slug, description, logo_url, banner_image_url, city, cuisine_type, service_areas, custom_domain, announcement_active, announcement_text, announcement_bg_color, is_published, accepts_cash, accepts_paypal, stripe_connect_status, accepts_delivery, accepts_pickup, certifications, delivery_fee, delivery_radius_km, min_order_amount, operating_hours, seat_capacity, subscription_status, subscriptions(current_period_end), restaurant_products(*)"
    );

  const { data, error } = await (isUuid
    ? query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    : query.eq("slug", slugOrId)
  ).maybeSingle();

  if (error) {
    console.error("Query failed with error:", error);
  } else {
    console.log("Query succeeded! Data:", JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
