import { createClient } from "@/lib/supabase/client";

export async function getStorefrontData(slug: string) {
  const supabase = createClient();

  // 1. Fetch caterer by slug
  const { data: caterer, error: catererError } = await supabase
    .from("caterers")
    .select(`
      id,
      business_name,
      city,
      cover_image_url,
      logo_url,
      cuisine_types,
      average_rating,
      verification_status
    `)
    .eq("slug", slug)
    .single();

  if (catererError || !caterer) {
    return null;
  }

  // 2. Fetch storefront settings
  const { data: settings } = await supabase
    .from("storefront_settings")
    .select("*")
    .eq("caterer_id", caterer.id)
    .single();

  // 3. Fetch product categories
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .eq("caterer_id", caterer.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // 4. Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("caterer_id", caterer.id)
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  return {
    caterer,
    settings: settings || null,
    categories: categories || [],
    products: products || []
  };
}
