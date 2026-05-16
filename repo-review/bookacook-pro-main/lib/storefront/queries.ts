import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/public";

export interface StorefrontCaterer {
  id: string;
  business_name: string | null;
  city: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  cuisine_types: string[] | null;
  average_rating: number | null;
  verification_status: string | null;
}

export interface StorefrontSettings {
  caterer_id: string;
  theme_color: string | null;
  welcome_message: string | null;
}

export interface ProductCategory {
  id: string;
  caterer_id: string;
  name: string;
  display_order: number | null;
}

export interface Product {
  id: string;
  caterer_id: string;
  name: string;
  price_amount: number;
  description: string | null;
  image_url: string | null;
}

export interface StorefrontData {
  caterer: StorefrontCaterer;
  settings: StorefrontSettings | null;
  categories: ProductCategory[];
  products: Product[];
}

const getStorefrontDataCached = unstable_cache(
  async (slug: string): Promise<StorefrontData | null> => {
    const supabase = createClient();

    const { data: caterer, error: catererError } = await supabase
      .from("caterers")
      .select("id, business_name, city, cover_image_url, logo_url, cuisine_types, average_rating, verification_status")
      .eq("slug", slug)
      .single();

    if (catererError || !caterer) return null;

    const [settingsRes, categoriesRes, productsRes] = await Promise.all([
      supabase.from("storefront_settings").select("*").eq("caterer_id", caterer.id).maybeSingle(),
      supabase.from("product_categories").select("id, caterer_id, name, display_order").eq("caterer_id", caterer.id).eq("is_active", true).order("display_order"),
      supabase.from("products").select("id, caterer_id, name, price_amount, description, image_url").eq("caterer_id", caterer.id).eq("is_available", true).order("display_order")
    ]);

    return {
      caterer: caterer as StorefrontCaterer,
      settings: settingsRes.data as StorefrontSettings | null,
      categories: categoriesRes.data || [],
      products: productsRes.data || []
    };
  },
  ["storefront"],
  { tags: ["storefront"], revalidate: 3600 }
);

export async function getStorefrontData(slug: string) {
  return getStorefrontDataCached(slug);
}
