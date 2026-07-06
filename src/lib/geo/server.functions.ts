import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getGeoPageData = createServerFn({ method: "GET" })
  .validator(
    z.object({
      role: z.enum(["restaurants", "caterer", "planner"]),
      citySlug: z.string(),
    })
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
      return { indexStatus: "404" as const, location: null, seoData: null, vendors: [], aggregateRating: null };
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
        .select("id, name, slug, logo_url, banner_image_url, cuisine_type, min_order_amount, delivery_fee, accepts_pickup, accepts_delivery, city, description")
        .eq("is_published", true)
        .ilike("city", location.name);
      vendors = res || [];
    } else if (data.role === "caterer") {
      const { data: res } = await supabaseAdmin
        .from("caterers")
        .select("id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description")
        .ilike("city", location.name);
      vendors = res || [];
    } else if (data.role === "planner") {
      const { data: res } = await supabaseAdmin
        .from("planners")
        .select("id, name, slug, logo_url, banner_image_url, min_delivery_cents, delivery_fee_cents, city, description")
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
      const vendorIds = vendors.map(v => v.id);
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
          average: Math.round((sum / reviews.length) * 10) / 10
        };
      }
    }

    return {
      indexStatus,
      location,
      seoData,
      vendors,
      aggregateRating
    };
  });

export const getValidGeoLocations = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch published pages
    const { data: seoPages } = await supabaseAdmin
      .from("seo_content_pages")
      .select("slug, content, meta_title, target_keyword")
      .eq("status", "published")
      .like("slug", "%/ort/%");

    if (!seoPages || seoPages.length === 0) return [];

    const validPaths: string[] = [];

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

      // Location match
      const { data: location } = await supabaseAdmin
        .from("german_locations")
        .select("name")
        .ilike("name", citySlug.replace(/-/g, " "))
        .limit(1)
        .maybeSingle();

      if (!location) continue;

      let vendorCount = 0;
      if (role === "restaurants") {
        const { count } = await supabaseAdmin.from("restaurants").select("*", { count: "exact", head: true }).eq("is_published", true).ilike("city", location.name);
        vendorCount = count || 0;
      } else if (role === "caterer") {
        const { count } = await supabaseAdmin.from("caterers").select("*", { count: "exact", head: true }).ilike("city", location.name);
        vendorCount = count || 0;
      } else if (role === "planner") {
        const { count } = await supabaseAdmin.from("planners").select("*", { count: "exact", head: true }).ilike("city", location.name);
        vendorCount = count || 0;
      }

      const minVendors = role === "restaurants" ? 3 : 1;
      const hasEnoughVendors = vendorCount >= minVendors;

      if (hasEnoughVendors || hasUniqueText) {
        validPaths.push(`/${page.slug}`);
      }
    }

    return validPaths;
  });

