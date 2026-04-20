import { createClient } from "@/lib/supabase/server";

export type CreateEventRequestDraftInput = {
  ai_query?: string;
  event_type?: string | null;
  preferred_caterer_id?: string | null;
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
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function cleanStringArray(values?: string[] | null) {
  if (!values) return [];
  return values.map((v) => v.trim()).filter(Boolean);
}

function removeUndefinedFields<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
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

  const payload = {
    customer_id: user.id,
    status: "draft",
    ai_query: cleanString(input?.ai_query) ?? "",
    event_type: cleanString(input?.event_type),
    preferred_caterer_id: input?.preferred_caterer_id ?? null,
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
