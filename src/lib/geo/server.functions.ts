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
    const { data: location } = await supabaseAdmin
      .from("german_locations")
      .select("*")
      .ilike("name", data.citySlug.replace(/-/g, " "))
      .limit(1)
      .maybeSingle();

    // locationObj is always non-null: either from DB or from the fallback below.
    let locationObj = location;
    if (!locationObj) {
      const cityNameFormatted = data.citySlug
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      // Cast to `any` so we can supply a minimal shape without matching the full
      // Supabase-generated row type (slug, postal_code etc. may not exist on the schema).
      locationObj = {
        id: data.citySlug,
        name: cityNameFormatted,
        state: "Deutschland",
        postal_code: null,
        type: null,
        lat: null,
        lng: null,
      } as any;
    }

    // 2. SEO Content Lookup
    const expectedSlug = `${data.role}/ort/${data.citySlug}`;
    let seoData: any = null;
    try {
      const { data: seo } = await supabaseAdmin
        .from("seo_content_pages")
        .select("*")
        .eq("slug", expectedSlug)
        .eq("status", "published")
        .maybeSingle();
      seoData = seo;
    } catch (e) {}

    // 3. Vendor Lookup
    let vendors: any[] = [];
    try {
      if (data.role === "restaurants") {
        const { data: res } = await supabaseAdmin
          .from("restaurants")
          .select(
            "id, name, slug, logo_url, banner_image_url, cuisine_type, min_order_amount, delivery_fee, accepts_pickup, accepts_delivery, city, description, service_areas",
          )
          .eq("is_published", true)
          .ilike("city", `%${locationObj!.name}%`);
        vendors = res || [];

        if (vendors.length === 0) {
          const { data: allRes } = await supabaseAdmin
            .from("restaurants")
            .select(
              "id, name, slug, logo_url, banner_image_url, cuisine_type, min_order_amount, delivery_fee, accepts_pickup, accepts_delivery, city, description, service_areas",
            )
            .eq("is_published", true)
            .limit(6);
          vendors = allRes || [];
        }
      } else if (data.role === "caterer") {
        const { data: res } = await supabaseAdmin
          .from("caterers")
          .select(
            "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
          )
          .ilike("city", `%${locationObj!.name}%`);
        vendors = res || [];

        if (vendors.length === 0) {
          const { data: allCat } = await supabaseAdmin
            .from("caterers")
            .select(
              "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
            )
            .limit(6);
          vendors = allCat || [];
        }
      } else if (data.role === "planner") {
        const { data: res } = await supabaseAdmin
          .from("planners")
          .select(
            "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
          )
          .ilike("city", `%${locationObj!.name}%`);
        vendors = res || [];

        if (vendors.length === 0) {
          const { data: allPlan } = await supabaseAdmin
            .from("planners")
            .select(
              "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
            )
            .limit(6);
          vendors = allPlan || [];
        }
      }
    } catch (vErr) {
      console.error("Vendor fetch error in getGeoPageData:", vErr);
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
      location: locationObj,
      seoData,
      vendors,
      aggregateRating,
      stats,
    };
  });

let geoLocationsCache: { data: { path: string; label: string }[]; timestamp: number } | null = null;
const GEO_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL cache

export const getValidGeoLocations = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (geoLocationsCache && now - geoLocationsCache.timestamp < GEO_CACHE_TTL_MS) {
    return geoLocationsCache.data;
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Fetch published pages
  const { data: seoPages } = (await supabaseAdmin
    .from("seo_content_pages")
    .select("slug, content, meta_title, target_keyword")
    .eq("status", "published")
    .like("slug", "%/ort/%")) as { data: any[] | null };

  if (!seoPages || seoPages.length === 0) {
    geoLocationsCache = { data: [], timestamp: now };
    return [];
  }

  // 2. Fetch all locations and vendor cities in parallel bulk queries instead of 100+ sequential queries
  const [locsRes, restRes, catRes, planRes] = await Promise.all([
    supabaseAdmin.from("german_locations").select("name"),
    supabaseAdmin.from("restaurants").select("city").eq("is_published", true),
    supabaseAdmin.from("caterers").select("city"),
    supabaseAdmin.from("planners").select("city"),
  ]);

  const locationNameMap = new Map<string, string>();
  if (locsRes.data) {
    for (const loc of locsRes.data) {
      if (loc.name) {
        locationNameMap.set(loc.name.toLowerCase(), loc.name);
      }
    }
  }

  const restCounts = new Map<string, number>();
  if (restRes.data) {
    for (const r of restRes.data) {
      if (r.city) {
        const key = r.city.trim().toLowerCase();
        restCounts.set(key, (restCounts.get(key) || 0) + 1);
      }
    }
  }

  const catCounts = new Map<string, number>();
  if (catRes.data) {
    for (const c of catRes.data) {
      if (c.city) {
        const key = c.city.trim().toLowerCase();
        catCounts.set(key, (catCounts.get(key) || 0) + 1);
      }
    }
  }

  const planCounts = new Map<string, number>();
  if (planRes.data) {
    for (const p of planRes.data) {
      if (p.city) {
        const key = p.city.trim().toLowerCase();
        planCounts.set(key, (planCounts.get(key) || 0) + 1);
      }
    }
  }

  const validEntries: { path: string; label: string }[] = [];

  // 3. Evaluate each page in memory
  for (const page of seoPages) {
    const parts = page.slug?.split("/");
    if (!parts || parts.length !== 3) continue;

    const role = parts[0];
    const citySlug = parts[2];

    const hasSeo = page.meta_title && page.target_keyword;
    const hasUniqueText = page.content && page.content.length > 50;

    if (!hasSeo) continue;

    const normalizedCity = citySlug.replace(/-/g, " ").toLowerCase();
    const locationName = locationNameMap.get(normalizedCity);

    if (!locationName) continue;

    const cityKey = locationName.trim().toLowerCase();
    let vendorCount = 0;
    if (role === "restaurants") {
      vendorCount = restCounts.get(cityKey) || 0;
    } else if (role === "caterer") {
      vendorCount = catCounts.get(cityKey) || 0;
    } else if (role === "planner") {
      vendorCount = planCounts.get(cityKey) || 0;
    }

    const minVendors = role === "restaurants" ? 3 : 1;
    const hasEnoughVendors = vendorCount >= minVendors;

    const introCopy: string = page.content || "";
    const hasRichIntro = introCopy.length >= 150;

    const isIndexable =
      role === "restaurants" ? hasEnoughVendors && hasRichIntro : hasEnoughVendors || hasUniqueText;

    if (isIndexable) {
      let finalSlug = page.slug;
      if (finalSlug && finalSlug.startsWith("restaurants/ort/")) {
        finalSlug = finalSlug.replace("restaurants/ort/", "restaurant/ort/");
      }
      validEntries.push({ path: `/${finalSlug}`, label: locationName });
    }
  }

  geoLocationsCache = { data: validEntries, timestamp: now };
  return validEntries;
});
