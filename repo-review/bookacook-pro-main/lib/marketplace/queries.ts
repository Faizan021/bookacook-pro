import { createClient } from "@/lib/supabase/client";

export type MarketplaceCaterer = {
  id: string;
  name: string;
  slug: string;
  type: string;
  location: string;
  price: string;
  tag: string;
  image: string;
  alt: string;
  rating: number;
};

export async function getMarketplaceCaterers(): Promise<MarketplaceCaterer[]> {
  const supabase = createClient();

  // Fetch verified caterers
  const { data: caterers, error: catererError } = await supabase
    .from("caterers")
    .select(`
      id,
      business_name,
      slug,
      city,
      cuisine_types,
      cover_image_url,
      logo_url,
      average_rating,
      is_featured,
      verification_status
    `)
    .eq("verification_status", "verified")
    .eq("is_active", true);

  if (catererError || !caterers) {
    console.error("Error fetching marketplace caterers:", catererError);
    return [];
  }

  // Fetch starting prices for these caterers
  const catererIds = caterers.map(c => c.id);
  const { data: packages, error: packageError } = await supabase
    .from("packages")
    .select("caterer_id, price_amount")
    .in("caterer_id", catererIds)
    .eq("is_active", true)
    .order("price_amount", { ascending: true });

  const priceMap = new Map<string, number>();
  if (!packageError && packages) {
    packages.forEach(pkg => {
      if (!priceMap.has(pkg.caterer_id)) {
        priceMap.set(pkg.caterer_id, pkg.price_amount);
      }
    });
  }

  return caterers.map(c => {
    const minPrice = priceMap.get(c.id);
    const cuisines = c.cuisine_types && Array.isArray(c.cuisine_types) 
      ? c.cuisine_types.slice(0, 2).join(" & ") 
      : "Catering";

    return {
      id: c.id,
      name: c.business_name || "Unknown Caterer",
      slug: c.slug || c.id,
      type: cuisines,
      location: c.city || "Berlin",
      price: minPrice ? `ab €${Math.round(minPrice)} p.P.` : "Preis auf Anfrage",
      tag: c.is_featured ? "Premium Partner" : "Verifizierter Partner",
      image: c.cover_image_url || c.logo_url || "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=85",
      alt: `${c.business_name || 'Caterer'} profile image`,
      rating: c.average_rating || 5.0
    };
  });
}
