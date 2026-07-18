/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getGeoPageData = createServerFn({ method: "GET" })
  .validator(
    z.object({
      role: z.enum(["restaurants", "caterer", "planner"]),
      citySlug: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Location Validity Check
    const { data: location, error: locErr } = await supabaseAdmin
      .from("german_locations")
      .select("*")
      .ilike("name", data.citySlug.replace(/-/g, " "))
      .limit(1)
      .maybeSingle();

    if (locErr || !location) {
      return {
        indexStatus: "404" as const,
        location: null,
        seoData: null,
        vendors: [],
        aggregateRating: null,
      };
    }

    // 2. SEO Content Lookup
    const expectedSlug = `${data.role}/ort/${data.citySlug}`;
    const { data: seoData } = await supabaseAdmin
      .from("seo_content_pages")
      .select("*")
      .eq("slug", expectedSlug)
      .eq("status", "published")
      .maybeSingle();

    // 3. Vendor Lookup
    let vendors: any[] = [];
    if (data.role === "restaurants") {
      const { data: res } = await supabaseAdmin
        .from("restaurants")
        .select(
          "id, name, slug, logo_url, banner_image_url, cuisine_type, min_order_amount, delivery_fee, accepts_pickup, accepts_delivery, city, description, service_areas",
        )
        .eq("is_published", true)
        .ilike("city", location.name);
      vendors = res || [];
    } else if (data.role === "caterer") {
      const { data: res } = await supabaseAdmin
        .from("caterers")
        .select(
          "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
        )
        .ilike("city", location.name);
      vendors = res || [];
    } else if (data.role === "planner") {
      const { data: res } = await supabaseAdmin
        .from("planners")
        .select(
          "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
        )
        .ilike("city", location.name);
      vendors = res || [];
    }

    // 4. Quality Evaluation
    let indexStatus: "index" | "noindex" | "404" = "index";

    // Check SEO Field Completeness
    const hasSeo = seoData && seoData.meta_title && seoData.target_keyword;
    const hasUniqueText = seoData && seoData.content && seoData.content.length > 50;

    // Vendor Thresholds
    const minVendors = data.role === "restaurants" ? 3 : 1;
    const hasEnoughVendors = vendors.length >= minVendors;

    if (!hasEnoughVendors && !hasUniqueText) {
      indexStatus = "noindex"; // Weak/incomplete page quarantined
    }
    if (!hasSeo) {
      indexStatus = "noindex"; // Missing required SEO fields
    }

    // 5. Aggregate Rating
    // We will aggregate reviews for these specific vendors if we need to.
    let aggregateRating = null;

    if (vendors.length > 0) {
      const vendorIds = vendors.map((v) => v.id);
      let reviewTable = "";
      if (data.role === "restaurants") reviewTable = "restaurant_reviews";
      else if (data.role === "caterer") reviewTable = "caterer_reviews";
      else if (data.role === "planner") reviewTable = "planner_reviews";

      const { data: reviews } = await supabaseAdmin
        .from(reviewTable as "restaurant_reviews" | "caterer_reviews" | "planner_reviews")
        .select("overall_rating")
        .in(data.role === "restaurants" ? "restaurant_id" : "caterer_id", vendorIds)
        .eq("status", "published");

      if (reviews && reviews.length > 0) {
        const sum = (reviews as any[]).reduce((acc, r) => acc + (r.overall_rating || 0), 0);
        aggregateRating = {
          count: reviews.length,
          average: Math.round((sum / reviews.length) * 10) / 10,
        };
      }
    }

    let stats = null;
    if (data.role === "restaurants" && vendors.length > 0) {
      const minOrders = vendors
        .map((v) => Number(v.min_order_amount ?? 10))
        .filter((n) => !isNaN(n));
      const minOrderAvg =
        minOrders.length > 0
          ? Math.round(minOrders.reduce((a, b) => a + b, 0) / minOrders.length)
          : 10;

      const cuisinesMap: Record<string, number> = {};
      vendors.forEach((v) => {
        if (v.cuisine_type) {
          const type = v.cuisine_type.trim().toLowerCase();
          cuisinesMap[type] = (cuisinesMap[type] || 0) + 1;
        }
      });

      const popularCuisines = Object.entries(cuisinesMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name);

      stats = {
        minOrderAverage: minOrderAvg,
        popularCuisines,
      };
    }

    return {
      indexStatus,
      location,
      seoData,
      vendors,
      aggregateRating,
      stats,
    };
  });

export const getValidGeoLocations = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Fetch published pages
  // Cast to any[] to access intro_md which is not yet in the generated Supabase types
  // (mirrors the (seoData as any)?.intro_md pattern used in the city route loader)
  const { data: seoPages } = (await supabaseAdmin
    .from("seo_content_pages")
    .select("slug, content, meta_title, target_keyword")
    .eq("status", "published")
    .like("slug", "%/ort/%")) as { data: any[] | null };

  if (!seoPages || seoPages.length === 0) return [];

  const validEntries: { path: string; label: string }[] = [];

  // 2. Evaluate each page
  for (const page of seoPages) {
    // Slug format: role/ort/city
    const parts = page.slug?.split("/");
    if (!parts || parts.length !== 3) continue;

    const role = parts[0];
    const citySlug = parts[2];

    const hasSeo = page.meta_title && page.target_keyword;
    const hasUniqueText = page.content && page.content.length > 50;

    if (!hasSeo) continue;

    // Location match — also gives us the properly capitalised German city name
    const { data: location } = await supabaseAdmin
      .from("german_locations")
      .select("name")
      .ilike("name", citySlug.replace(/-/g, " "))
      .limit(1)
      .maybeSingle();

    if (!location) continue;

    let vendorCount = 0;
    if (role === "restaurants") {
      const { count } = await supabaseAdmin
        .from("restaurants")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true)
        .ilike("city", location.name);
      vendorCount = count || 0;
    } else if (role === "caterer") {
      const { count } = await supabaseAdmin
        .from("caterers")
        .select("*", { count: "exact", head: true })
        .ilike("city", location.name);
      vendorCount = count || 0;
    } else if (role === "planner") {
      const { count } = await supabaseAdmin
        .from("planners")
        .select("*", { count: "exact", head: true })
        .ilike("city", location.name);
      vendorCount = count || 0;
    }

    const minVendors = role === "restaurants" ? 3 : 1;
    const hasEnoughVendors = vendorCount >= minVendors;

    // Restaurants city pages require strict AND gating: enough vendors AND enough intro text.
    // This prevents sitemap.xml from listing pages that would render as noindex, follow.
    // Other roles use the looser threshold (hasEnoughVendors is sufficient).
    // We use page.content as the rich intro proxy (intro_md isn't in the select query).
    const introCopy: string = page.content || "";
    const hasRichIntro = introCopy.length >= 150;

    const isIndexable =
      role === "restaurants" ? hasEnoughVendors && hasRichIntro : hasEnoughVendors || hasUniqueText;

    if (isIndexable) {
      let finalSlug = page.slug;
      if (finalSlug && finalSlug.startsWith("restaurants/ort/")) {
        finalSlug = finalSlug.replace("restaurants/ort/", "restaurant/ort/");
      }
      validEntries.push({ path: `/${finalSlug}`, label: location.name });
    }
  }

  return validEntries;
});
