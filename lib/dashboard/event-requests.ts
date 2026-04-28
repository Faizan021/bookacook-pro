import { createClient } from "@/lib/supabase/server";

export type CreateEventRequestDraftInput = {
  ai_query?: string;
  event_type?: string | null;
  preferred_caterer_id?: string | null;
  city?: string | null;
  postal_code?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
};

export type UpdateEventRequestInput = {
  event_type?: string;
  catering_type?: string;
  service_style?: string;
  venue_type?: string;
  guest_count?: number;
  event_date?: string;
  city?: string;
  postal_code?: string;
  lat?: string | number | null;
  lng?: string | number | null;
  budget_total?: number;
  budget_per_person?: number;
  planning_stage?: string;
  special_requests?: string;
  cuisine_preferences?: string[];
  dietary_requirements?: string[];
  extra_services?: string[];
  status?: string;
  ai_query?: string;
  preferred_caterer_id?: string | null;
};

function cleanString(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function cleanStringArray(values?: string[] | null) {
  if (!values) return [];
  return values.map((value) => value.trim()).filter(Boolean);
}

function removeUndefinedFields<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

function normalize(text?: string | null) {
  return (text || "").toLowerCase();
}

function parseEventTypeFromQuery(query?: string | null) {
  const text = normalize(query);

  if (text.includes("wedding") || text.includes("hochzeit")) return "wedding";

  if (
    text.includes("corporate") ||
    text.includes("office") ||
    text.includes("business") ||
    text.includes("firma") ||
    text.includes("meeting") ||
    text.includes("company")
  ) {
    return "corporate";
  }

  if (
    text.includes("birthday") ||
    text.includes("private party") ||
    text.includes("private event") ||
    text.includes("geburtstag") ||
    text.includes("jubiläum")
  ) {
    return "birthday";
  }

  if (text.includes("ramadan") || text.includes("iftar")) return "ramadan";

  if (
    text.includes("christmas") ||
    text.includes("weihnacht") ||
    text.includes("holiday dinner")
  ) {
    return "christmas";
  }

  if (
    text.includes("private") ||
    text.includes("dinner") ||
    text.includes("party")
  ) {
    return "private_party";
  }

  return null;
}

function parseCateringTypeFromQuery(query?: string | null) {
  const text = normalize(query);

  if (text.includes("buffet")) return "buffet";

  if (
    text.includes("finger food") ||
    text.includes("fingerfood") ||
    text.includes("canap") ||
    text.includes("snacks")
  ) {
    return "finger_food";
  }

  if (
    text.includes("plated") ||
    text.includes("sit down dinner") ||
    text.includes("fine dining") ||
    text.includes("course menu")
  ) {
    return "plated";
  }

  if (
    text.includes("live station") ||
    text.includes("live cooking") ||
    text.includes("food station")
  ) {
    return "live_station";
  }

  if (text.includes("bbq") || text.includes("grill")) return "bbq";

  return null;
}

function parseServiceStyleFromQuery(query?: string | null) {
  const text = normalize(query);

  if (text.includes("elegant")) return "elegant";
  if (text.includes("casual")) return "casual";
  if (text.includes("sharing")) return "sharing style";
  if (text.includes("premium") || text.includes("luxury")) return "premium";
  if (text.includes("fine dining")) return "fine dining";
  if (text.includes("family style")) return "family style";

  return null;
}

function parseCityFromQuery(query?: string | null) {
  const text = normalize(query);

  if (text.includes("berlin")) return "Berlin";
  if (text.includes("hamburg")) return "Hamburg";
  if (text.includes("munich") || text.includes("münchen")) return "München";
  if (text.includes("frankfurt")) return "Frankfurt am Main";
  if (text.includes("cologne") || text.includes("köln")) return "Köln";
  if (text.includes("dortmund")) return "Dortmund";

  if (text.includes("düsseldorf") || text.includes("duesseldorf")) {
    return "Düsseldorf";
  }

  if (text.includes("paderborn")) return "Paderborn";

  return null;
}

function parseGuestCountFromQuery(query?: string | null) {
  const text = query || "";

  const match =
    text.match(/(\d+)\s*(guests|guest|people|persons)/i) ||
    text.match(/(\d+)\s*(gäste|personen|mitarbeitende|mitarbeiter)/i) ||
    text.match(/for\s+(\d+)/i) ||
    text.match(/für\s+(\d+)/i);

  if (!match) return null;

  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function parseBudgetPerPersonFromQuery(query?: string | null) {
  const text = query || "";

  const match =
    text.match(/€\s?(\d+)\s*(per person|pp|p\.p\.|pro person)/i) ||
    text.match(/(\d+)\s?(€|eur|euros?)\s*(per person|pp|p\.p\.|pro person)/i) ||
    text.match(/ca\.\s*€\s?(\d+)/i) ||
    text.match(/around\s*€\s?(\d+)\s*(per person|pp|p\.p\.)/i);

  if (!match) return null;

  const numericPart = match.find((part) => /^\d+$/.test(part));
  const value = numericPart ? Number(numericPart) : NaN;

  return Number.isFinite(value) ? value : null;
}

function parseBudgetTotalFromQuery(query?: string | null) {
  const text = query || "";

  const rangeMatch = text.match(/€\s?(\d+)\s?-\s?€?\s?(\d+)/i);
  if (rangeMatch) {
    const upper = Number(rangeMatch[2]);
    return Number.isFinite(upper) ? upper : null;
  }

  const singleMatch =
    text.match(/budget[^0-9]{0,10}(\d{3,6})/i) ||
    text.match(/€\s?(\d{3,6})/i);

  if (!singleMatch) return null;

  const value = Number(singleMatch[1]);
  return Number.isFinite(value) ? value : null;
}

function parseCuisinePreferencesFromQuery(query?: string | null) {
  const text = normalize(query);
  const values: string[] = [];

  const cuisineMap: Array<[string, string]> = [
    ["turkish", "Turkish"],
    ["türkisch", "Turkish"],
    ["mediterranean", "Mediterranean"],
    ["mediterran", "Mediterranean"],
    ["italian", "Italian"],
    ["italienisch", "Italian"],
    ["arabic", "Arabic"],
    ["arabisch", "Arabic"],
    ["german", "German"],
    ["deutsch", "German"],
    ["bbq", "BBQ"],
    ["barbecue", "BBQ"],
    ["fine dining", "Fine Dining"],
    ["vegan", "Vegan"],
  ];

  for (const [needle, label] of cuisineMap) {
    if (text.includes(needle) && !values.includes(label)) {
      values.push(label);
    }
  }

  return values;
}

function parseDietaryRequirementsFromQuery(query?: string | null) {
  const text = normalize(query);
  const values: string[] = [];

  const dietaryMap: Array<[string, string]> = [
    ["vegetarian", "Vegetarian"],
    ["vegetar", "Vegetarian"],
    ["vegan", "Vegan"],
    ["halal", "Halal"],
    ["gluten", "Gluten-free"],
    ["lactose", "Lactose-free"],
    ["laktose", "Lactose-free"],
    ["kosher", "Kosher"],
  ];

  for (const [needle, label] of dietaryMap) {
    if (text.includes(needle) && !values.includes(label)) {
      values.push(label);
    }
  }

  return values;
}

function parseExtraServicesFromQuery(query?: string | null) {
  const text = normalize(query);
  const values: string[] = [];

  const extrasMap: Array<[string, string]> = [
    ["staff", "Staff"],
    ["personal", "Staff"],
    ["waitstaff", "Staff"],
    ["servers", "Staff"],
    ["servicekräfte", "Staff"],
    ["tableware", "Tableware"],
    ["plates", "Tableware"],
    ["geschirr", "Tableware"],
    ["delivery", "Delivery"],
    ["lieferung", "Delivery"],
    ["setup", "Setup"],
    ["set up", "Setup"],
    ["aufbau", "Setup"],
    ["drinks", "Drinks"],
    ["getränke", "Drinks"],
    ["beverages", "Drinks"],
    ["live cooking", "Live Cooking"],
    ["live station", "Live Cooking"],
  ];

  for (const [needle, label] of extrasMap) {
    if (text.includes(needle) && !values.includes(label)) {
      values.push(label);
    }
  }

  return values;
}

function normalizeCoordinate(value?: string | number | null) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function deriveStructuredFieldsFromAiQuery(input?: CreateEventRequestDraftInput) {
  const aiQuery = cleanString(input?.ai_query) ?? "";

  return {
    ai_query: aiQuery,
    event_type: cleanString(input?.event_type) ?? parseEventTypeFromQuery(aiQuery),
    catering_type: parseCateringTypeFromQuery(aiQuery),
    service_style: parseServiceStyleFromQuery(aiQuery),
    guest_count: parseGuestCountFromQuery(aiQuery),
    city: cleanString(input?.city) ?? parseCityFromQuery(aiQuery),
    postal_code: cleanString(input?.postal_code),
    lat: normalizeCoordinate(input?.lat),
    lng: normalizeCoordinate(input?.lng),
    preferred_caterer_id: input?.preferred_caterer_id ?? null,
    budget_total: parseBudgetTotalFromQuery(aiQuery),
    budget_per_person: parseBudgetPerPersonFromQuery(aiQuery),
    cuisine_preferences: parseCuisinePreferencesFromQuery(aiQuery),
    dietary_requirements: parseDietaryRequirementsFromQuery(aiQuery),
    extra_services: parseExtraServicesFromQuery(aiQuery),
  };
}

export async function createEventRequestDraft(
  input?: CreateEventRequestDraftInput
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const structured = deriveStructuredFieldsFromAiQuery(input);

  const payload = {
    customer_id: user.id,
    status: "draft",
    ai_query: structured.ai_query || null,
    event_type: structured.event_type,
    catering_type: structured.catering_type,
    service_style: structured.service_style,
    guest_count: structured.guest_count,
    city: structured.city,
    postal_code: structured.postal_code,
    lat: structured.lat,
    lng: structured.lng,
    preferred_caterer_id: structured.preferred_caterer_id,
    budget_total: structured.budget_total,
    budget_per_person: structured.budget_per_person,
    cuisine_preferences: structured.cuisine_preferences,
    dietary_requirements: structured.dietary_requirements,
    extra_services: structured.extra_services,
    special_requests: structured.ai_query || null,
  };

  const { data, error } = await supabase
    .from("event_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEventRequest(
  id: string,
  updates: UpdateEventRequestInput
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const payload = removeUndefinedFields({
    event_type: cleanString(updates.event_type),
    catering_type: cleanString(updates.catering_type),
    service_style: cleanString(updates.service_style),
    venue_type: cleanString(updates.venue_type),
    guest_count: updates.guest_count,
    event_date: cleanString(updates.event_date),
    city: cleanString(updates.city),
    postal_code: cleanString(updates.postal_code),
    lat: normalizeCoordinate(updates.lat),
    lng: normalizeCoordinate(updates.lng),
    budget_total: updates.budget_total,
    budget_per_person: updates.budget_per_person,
    planning_stage: cleanString(updates.planning_stage),
    special_requests: cleanString(updates.special_requests),
    cuisine_preferences:
      updates.cuisine_preferences !== undefined
        ? cleanStringArray(updates.cuisine_preferences)
        : undefined,
    dietary_requirements:
      updates.dietary_requirements !== undefined
        ? cleanStringArray(updates.dietary_requirements)
        : undefined,
    extra_services:
      updates.extra_services !== undefined
        ? cleanStringArray(updates.extra_services)
        : undefined,
    status: cleanString(updates.status),
    ai_query: cleanString(updates.ai_query),
    preferred_caterer_id:
      updates.preferred_caterer_id !== undefined
        ? updates.preferred_caterer_id
        : undefined,
  });

  const { data, error } = await supabase
    .from("event_requests")
    .update(payload)
    .eq("id", id)
    .eq("customer_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getEventRequestById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("event_requests")
    .select("*")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Event request not found");
  }

  return data;
}

export async function getCustomerEventRequests() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("event_requests")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
