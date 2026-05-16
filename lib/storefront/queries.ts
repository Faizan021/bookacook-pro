import { createClient } from "@/lib/supabase/server";
import type { StorefrontData } from "@/lib/storefront/types";

export async function getStorefrontBySlug(slug: string): Promise<StorefrontData | null> {
  const supabase = await createClient();
  const cleanSlug = slug.trim().toLowerCase();

  const { data: storefront, error: storefrontError } = await supabase
    .from("storefront_settings")
    .select("*")
    .eq("slug", cleanSlug)
    .eq("status", "published")
    .maybeSingle();

  if (storefrontError) {
    console.error("Storefront load failed:", storefrontError.message);
    throw new Error(storefrontError.message);
  }

  if (!storefront) return null;

  const [{ data: caterer, error: catererError }, { data: categories, error: categoriesError }, { data: products, error: productsError }] =
    await Promise.all([
      supabase
        .from("caterers")
        .select(
          "id,business_name,city,phone,cuisine_types,average_rating,verification_status,storefront_enabled,storefront_status,accepts_direct_orders,accepts_catering_requests"
        )
        .eq("id", storefront.caterer_id)
        .maybeSingle(),
      supabase
        .from("product_categories")
        .select("*")
        .eq("caterer_id", storefront.caterer_id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name_de", { ascending: true }),
      supabase
        .from("products")
        .select("*")
        .eq("caterer_id", storefront.caterer_id)
        .eq("service_type", "instant")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name_de", { ascending: true }),
    ]);

  if (catererError) throw new Error(catererError.message);
  if (categoriesError) throw new Error(categoriesError.message);
  if (productsError) throw new Error(productsError.message);
  if (!caterer) return null;

  return {
    storefront,
    caterer,
    categories: categories || [],
    products: products || [],
  } as StorefrontData;
}
