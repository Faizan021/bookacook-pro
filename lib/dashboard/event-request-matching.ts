
import { createClient } from "@/lib/supabase/server";

type EventRequestRow = {
  id: string;
  customer_id: string | null;
  event_type: string | null;
  catering_type: string | null;
  service_style: string | null;
  venue_type: string | null;
  guest_count: number | null;
  event_date: string | null;
  city: string | null;
  postal_code: string | null;
  budget_total: number | null;
  budget_per_person: number | null;
  planning_stage: string | null;
  special_requests: string | null;
  cuisine_preferences: string[] | null;
  dietary_requirements: string[] | null;
  extra_services: string[] | null;
  status: string;
};

type CatererRow = {
  id: string;
  business_name: string;
  city: string | null;
  cuisine_types: string[] | null;
  verification_status: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  average_rating: number | null;
  payout_enabled: boolean | null;
};

type PackageRow = {
  id: string;
  caterer_id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  cuisine_type: string | null;
  price_amount: number | null;
  min_guests: number | null;
  max_guests: number | null;
  is_active: boolean | null;
  is_published: boolean | null;
  dietary_options: string[] | null;
  service_area: string | null;
  includes: string[] | null;
  category: string | null;
  tags: string[] | null;
  location: string | null;
  event_types: string[] | null;
  status: string | null;
  keywords: string[] | null;
};

type MatchReason = string;

type GeneratedMatch = {
  caterer_id: string;
  match_score: number;
  match_reasons: MatchReason[];
};

function normalize(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

function normalizeArray(values: string[] | null | undefined) {
  return (values || []).map((value) => normalize(value)).filter(Boolean);
}

function intersects(a: string[] | null | undefined, b: string[] | null | undefined) {
  const setA = new Set(normalizeArray(a));
  const setB = normalizeArray(b);
  return setB.some((item) => setA.has(item));
}

function includesValue(values: string[] | null | undefined, target: string | null | undefined) {
  const normalizedTarget = normalize(target);
  if (!normalizedTarget) return false;
  return normalizeArray(values).includes(normalizedTarget);
}

function textIncludes(text: string | null | undefined, target: string | null | undefined) {
  const a = normalize(text);
  const b = normalize(target);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

function packageSupportsEventType(pkg: PackageRow, request: EventRequestRow) {
  const requestEventType = normalize(request.event_type);
  if (!requestEventType) return false;

  return (
    normalize(pkg.event_type) === requestEventType ||
    includesValue(pkg.event_types, request.event_type) ||
    includesValue(pkg.tags, request.event_type) ||
    includesValue(pkg.keywords, request.event_type)
  );
}

function packageSupportsCuisine(pkg: PackageRow, request: EventRequestRow) {
  const requestedCuisines = request.cuisine_preferences || [];
  if (!requestedCuisines.length) return false;

  return (
    intersects([pkg.cuisine_type || ""], requestedCuisines) ||
    intersects(pkg.tags, requestedCuisines) ||
    intersects(pkg.keywords, requestedCuisines)
  );
}

function packageSupportsDietary(pkg: PackageRow, request: EventRequestRow) {
  const dietary = request.dietary_requirements || [];
  if (!dietary.length) return false;

  return intersects(pkg.dietary_options, dietary);
}

function packageSupportsExtras(pkg: PackageRow, request: EventRequestRow) {
  const extras = request.extra_services || [];
  if (!extras.length) return false;

  return intersects(pkg.includes, extras);
}

function packageSupportsGuestCount(pkg: PackageRow, request: EventRequestRow) {
  const guests = request.guest_count;
  if (!guests) return false;

  const minOk = pkg.min_guests == null || guests >= pkg.min_guests;
  const maxOk = pkg.max_guests == null || guests <= pkg.max_guests;

  return minOk && maxOk;
}

function packageSupportsLocation(pkg: PackageRow, request: EventRequestRow) {
  if (!request.city && !request.postal_code) return false;

  return (
    textIncludes(pkg.service_area, request.city) ||
    textIncludes(pkg.location, request.city) ||
    textIncludes(pkg.service_area, request.postal_code) ||
    textIncludes(pkg.location, request.postal_code)
  );
}

function packageSupportsCateringType(pkg: PackageRow, request: EventRequestRow) {
  const cateringType = normalize(request.catering_type);
  if (!cateringType) return false;

  return (
    normalize(pkg.category) === cateringType ||
    includesValue(pkg.tags, request.catering_type) ||
    includesValue(pkg.keywords, request.catering_type) ||
    textIncludes(pkg.title, request.catering_type) ||
    textIncludes(pkg.description, request.catering_type)
  );
}

function scoreCaterer(
  request: EventRequestRow,
  caterer: CatererRow,
  packages: PackageRow[]
): GeneratedMatch | null {
  let score = 0;
  const reasons: MatchReason[] = [];

  if (!caterer.is_active) {
    return null;
  }

  const activePackages = packages.filter(
    (pkg) => pkg.is_active && pkg.is_published && normalize(pkg.status || "published") !== "draft"
  );

  if (!activePackages.length) {
    return null;
  }

  if (textIncludes(caterer.city, request.city)) {
    score += 20;
    reasons.push(`Located in or near ${request.city}`);
  }

  if (intersects(caterer.cuisine_types, request.cuisine_preferences)) {
    score += 15;
    reasons.push("Caterer cuisine types match your preferences");
  }

  if (normalize(caterer.verification_status) === "verified") {
    score += 10;
    reasons.push("Verified caterer");
  }

  if (caterer.payout_enabled) {
    score += 5;
    reasons.push("Payout-ready caterer");
  }

  if ((caterer.average_rating || 0) >= 4.5) {
    score += 5;
    reasons.push("Strong average rating");
  }

  if (caterer.is_featured) {
    score += 3;
    reasons.push("Featured caterer");
  }

  let bestPackageScore = 0;
  let bestPackageReasons: string[] = [];

  for (const pkg of activePackages) {
    let packageScore = 0;
    const packageReasons: string[] = [];

    if (packageSupportsEventType(pkg, request)) {
      packageScore += 20;
      packageReasons.push("Supports your event type");
    }

    if (packageSupportsCateringType(pkg, request)) {
      packageScore += 15;
      packageReasons.push("Matches your catering style");
    }

    if (packageSupportsCuisine(pkg, request)) {
      packageScore += 15;
      packageReasons.push("Includes requested cuisine preferences");
    }

    if (packageSupportsDietary(pkg, request)) {
      packageScore += 10;
      packageReasons.push("Supports dietary requirements");
    }

    if (packageSupportsExtras(pkg, request)) {
      packageScore += 8;
      packageReasons.push("Includes requested extra services");
    }

    if (packageSupportsGuestCount(pkg, request)) {
      packageScore += 12;
      packageReasons.push("Fits your guest count");
    }

    if (packageSupportsLocation(pkg, request)) {
      packageScore += 8;
      packageReasons.push("Covers your event location");
    }

    if (
      request.budget_total != null &&
      pkg.price_amount != null &&
      request.guest_count != null
    ) {
      const estimatedTotal = pkg.price_amount * request.guest_count;
      if (estimatedTotal <= request.budget_total * 1.15) {
        packageScore += 10;
        packageReasons.push("Likely within or near your budget");
      }
    }

    if (packageScore > bestPackageScore) {
      bestPackageScore = packageScore;
      bestPackageReasons = packageReasons;
    }
  }

  score += bestPackageScore;
  reasons.push(...bestPackageReasons);

  if (score <= 0) {
    return null;
  }

  return {
    caterer_id: caterer.id,
    match_score: score,
    match_reasons: Array.from(new Set(reasons)).slice(0, 6),
  };
}

export async function generateMatchesForEventRequest(eventRequestId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: request, error: requestError } = await supabase
    .from("event_requests")
    .select("*")
    .eq("id", eventRequestId)
    .eq("customer_id", user.id)
    .single<EventRequestRow>();

  if (requestError || !request) {
    throw new Error(requestError?.message || "Event request not found");
  }

  const { data: caterers, error: caterersError } = await supabase
    .from("caterers")
    .select("id, business_name, city, cuisine_types, verification_status, is_active, is_featured, average_rating, payout_enabled")
    .eq("is_active", true)
    .returns<CatererRow[]>();

  if (caterersError) {
    throw new Error(caterersError.message);
  }

  const catererIds = (caterers || []).map((c) => c.id);

  if (!catererIds.length) {
    await supabase
      .from("event_request_matches")
      .delete()
      .eq("event_request_id", eventRequestId);

    return [];
  }

  const { data: packages, error: packagesError } = await supabase
    .from("packages")
    .select(
      "id, caterer_id, title, description, event_type, cuisine_type, price_amount, min_guests, max_guests, is_active, is_published, dietary_options, service_area, includes, category, tags, location, event_types, status, keywords"
    )
    .in("caterer_id", catererIds)
    .eq("is_active", true)
    .eq("is_published", true)
    .returns<PackageRow[]>();

  if (packagesError) {
    throw new Error(packagesError.message);
  }

  const packagesByCaterer = new Map<string, PackageRow[]>();

  for (const pkg of packages || []) {
    const existing = packagesByCaterer.get(pkg.caterer_id) || [];
    existing.push(pkg);
    packagesByCaterer.set(pkg.caterer_id, existing);
  }

  const matches = (caterers || [])
    .map((caterer) => scoreCaterer(request, caterer, packagesByCaterer.get(caterer.id) || []))
    .filter((match): match is GeneratedMatch => Boolean(match))
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 6);

  const { error: deleteError } = await supabase
    .from("event_request_matches")
    .delete()
    .eq("event_request_id", eventRequestId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (!matches.length) {
    return [];
  }

  const rows = matches.map((match) => ({
    event_request_id: eventRequestId,
    caterer_id: match.caterer_id,
    match_score: match.match_score,
    match_reasons: match.match_reasons,
  }));

  const { error: insertError } = await supabase
    .from("event_request_matches")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }

  return matches;
}

export async function getMatchesForEventRequest(eventRequestId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("event_request_matches")
    .select(`
      id,
      match_score,
      match_reasons,
      caterers (
        id,
        business_name,
        slug,
        city,
        cover_image_url,
        logo_url,
        cuisine_types,
        average_rating,
        verification_status,
        is_featured
      )
    `)
    .eq("event_request_id", eventRequestId)
    .order("match_score", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
