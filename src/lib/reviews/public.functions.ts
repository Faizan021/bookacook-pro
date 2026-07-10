import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPublicRestaurantReviews = createServerFn({ method: "GET" })
  .validator((input: { restaurantId: string }) =>
    z.object({ restaurantId: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: reviews, error } = await supabaseAdmin
      .from("restaurant_reviews")
      .select(
        "id, overall_rating, food_quality_rating, speed_rating, comment, vendor_reply, created_at, customer_name",
      )
      .eq("restaurant_id", data.restaurantId)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const count = reviews.length;
    const avgOverall =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + r.overall_rating, 0) / count : 0;
    const avgFood =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.food_quality_rating || 0), 0) / count
        : 0;
    const avgSpeed =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + (r.speed_rating || 0), 0) / count : 0;

    return {
      reviews,
      aggregates: {
        count,
        avgOverall: Number(avgOverall.toFixed(1)),
        avgFood: Number(avgFood.toFixed(1)),
        avgSpeed: Number(avgSpeed.toFixed(1)),
      },
    };
  });

export const getPublicCatererReviews = createServerFn({ method: "GET" })
  .validator((input: { catererId: string }) => z.object({ catererId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch reviews and join with catering_bookings to get event_type if possible
    // Note: PostgREST allows nested selects for FKs
    const { data: reviews, error } = await supabaseAdmin
      .from("caterer_reviews")
      .select(
        `
        id, 
        overall_rating, food_rating, reliability_rating, communication_rating, value_rating, 
        comment, vendor_reply, created_at, customer_name,
        catering_bookings ( event_type )
      `,
      )
      .eq("caterer_id", data.catererId)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      event_type: r.catering_bookings?.event_type || null,
      catering_bookings: undefined, // remove raw relation
    }));

    const count = formattedReviews.length;
    const avgOverall =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + r.overall_rating, 0) / count : 0;
    const avgFood =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + (r.food_rating || 0), 0) / count : 0;
    const avgRel =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.reliability_rating || 0), 0) / count
        : 0;
    const avgComms =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.communication_rating || 0), 0) / count
        : 0;
    const avgVal =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + (r.value_rating || 0), 0) / count : 0;

    return {
      reviews: formattedReviews,
      aggregates: {
        count,
        avgOverall: Number(avgOverall.toFixed(1)),
        avgFood: Number(avgFood.toFixed(1)),
        avgReliability: Number(avgRel.toFixed(1)),
        avgCommunication: Number(avgComms.toFixed(1)),
        avgValue: Number(avgVal.toFixed(1)),
      },
    };
  });

export const getPublicPlannerReviews = createServerFn({ method: "GET" })
  .validator((input: { plannerId: string }) => z.object({ plannerId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: reviews, error } = await supabaseAdmin
      .from("planner_reviews")
      .select(
        `
        id, 
        overall_rating, creativity_rating, execution_rating, communication_rating, value_rating, 
        comment, vendor_reply, created_at, customer_name,
        event_bookings ( event_type )
      `,
      )
      .eq("planner_id", data.plannerId)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      event_type: r.event_bookings?.event_type || null,
      event_bookings: undefined,
    }));

    const count = formattedReviews.length;
    const avgOverall =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + r.overall_rating, 0) / count : 0;
    const avgCre =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.creativity_rating || 0), 0) / count
        : 0;
    const avgExec =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.execution_rating || 0), 0) / count
        : 0;
    const avgComm =
      count > 0
        ? (reviews as any[]).reduce((acc, r) => acc + (r.communication_rating || 0), 0) / count
        : 0;
    const avgVal =
      count > 0 ? (reviews as any[]).reduce((acc, r) => acc + (r.value_rating || 0), 0) / count : 0;

    return {
      reviews: formattedReviews,
      aggregates: {
        count,
        avgOverall: Number(avgOverall.toFixed(1)),
        avgCreativity: Number(avgCre.toFixed(1)),
        avgExecution: Number(avgExec.toFixed(1)),
        avgCommunication: Number(avgComm.toFixed(1)),
        avgValue: Number(avgVal.toFixed(1)),
      },
    };
  });
