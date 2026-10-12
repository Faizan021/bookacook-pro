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
    } catch {
      // SEO page lookup failed or not found, fall back cleanly
    }

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

        if (vendors.length < 4) {
          const { fallbackRestaurants } = await import("@/data/restaurants");
          const existingSlugs = new Set(vendors.map((v: any) => v.slug || v.id));
          for (const fb of fallbackRestaurants) {
            if (vendors.length >= 6) break;
            const slug = fb.slug || fb.id;
            if (!existingSlugs.has(slug)) {
              vendors.push({
                id: fb.id,
                name: fb.name,
                slug,
                logo_url: fb.logo || null,
                banner_image_url: fb.img,
                cuisine_type: fb.tags.slice(0, 2).join(" & "),
                min_order_amount: fb.minOrder,
                delivery_fee: parseFloat(fb.fee.replace(/[^0-9.]/g, "")) || 0,
                accepts_pickup: true,
                accepts_delivery: true,
                city: fb.area,
                description: fb.about.de,
                is_showcase: true,
              });
            }
          }
        }
      } else if (data.role === "caterer") {
        const { data: res } = await supabaseAdmin
          .from("caterers")
          .select(
            "id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description",
          )
          .ilike("city", `%${locationObj!.name}%`);
        vendors = res || [];

        // Ensure Kampala Rolex Germany is present for Munich & surrounding region
        const isMuenchen =
          /m[üu]nchen/i.test(locationObj!.name) ||
          (data.citySlug && /m[üu]nchen/i.test(data.citySlug));
        if (
          isMuenchen &&
          !vendors.some((v) => (v.slug || v.id || "").toLowerCase() === "kampala-rolex-germany")
        ) {
          vendors.unshift({
            id: "kampala-rolex-germany",
            name: "Kampala Rolex Germany",
            slug: "kampala-rolex-germany",
            logo_url: "/caterers/kampala-rolex-muenchen/logo.png",
            banner_image_url: "/caterers/kampala-rolex-muenchen/06_buffet_event_guests.jpg",
            min_delivery_cents: 25000,
            delivery_fee_cents: 0,
            city: "München",
            description:
              "Authentisches ugandisches & ostafrikanisches Catering mit Live-Rolex-Station & Buffet-Kultur in München.",
          });
        }

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

    // 4. Quality Evaluation (All valid city pages are indexable)
    const indexStatus: "index" | "noindex" | "404" = "index";

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

  try {
    const fetchPromise = (async () => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      // 1. Fetch published pages
      const { data: seoPages } = (await supabaseAdmin
        .from("seo_content_pages")
        .select("slug, content, meta_title, target_keyword")
        .eq("status", "published")
        .like("slug", "%/ort/%")) as { data: any[] | null };

      const validEntriesMap = new Map<string, { path: string; label: string }>();

      // Core German cities always included
      const coreCities = [
        { slug: "berlin", label: "Berlin" },
        { slug: "muenchen", label: "München" },
        { slug: "hamburg", label: "Hamburg" },
        { slug: "koeln", label: "Köln" },
        { slug: "frankfurt", label: "Frankfurt" },
      ];
      for (const c of coreCities) {
        validEntriesMap.set(`/restaurant/ort/${c.slug}`, { path: `/restaurant/ort/${c.slug}`, label: c.label });
        validEntriesMap.set(`/catering/ort/${c.slug}`, { path: `/catering/ort/${c.slug}`, label: c.label });
        validEntriesMap.set(`/planner/ort/${c.slug}`, { path: `/planner/ort/${c.slug}`, label: c.label });
      }

      if (seoPages && seoPages.length > 0) {
        for (const page of seoPages) {
          const parts = page.slug?.split("/");
          if (!parts || parts.length !== 3) continue;

          const citySlug = parts[2];
          const locationName = citySlug
            .split("-")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          let finalSlug = page.slug;
          if (finalSlug && finalSlug.startsWith("restaurants/ort/")) {
            finalSlug = finalSlug.replace("restaurants/ort/", "restaurant/ort/");
          }
          if (finalSlug && finalSlug.startsWith("caterer/ort/")) {
            finalSlug = finalSlug.replace("caterer/ort/", "catering/ort/");
          }
          const path = `/${finalSlug}`;
          if (!validEntriesMap.has(path)) {
            validEntriesMap.set(path, { path, label: locationName });
          }
        }
      }

      const validEntries = Array.from(validEntriesMap.values());
      geoLocationsCache = { data: validEntries, timestamp: now };
      return validEntries;
    })();

    const timeoutPromise = new Promise<{ path: string; label: string }[]>((resolve) =>
      setTimeout(() => {
        console.warn("[getValidGeoLocations] Timeout fetching geo locations");
        resolve([]);
      }, 2500),
    );

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error("Error in getValidGeoLocations:", err);
    return [];
  }
});
