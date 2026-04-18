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
};

export async function createEventRequestDraft(
  input: CreateEventRequestDraftInput = {}
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const insertPayload: Record<string, unknown> = {
    customer_id: user.id,
    status: "draft",
  };

  if (input.event_type) {
    insertPayload.event_type = input.event_type;
  }

  if (input.ai_query?.trim()) {
    insertPayload.special_requests = input.ai_query.trim();
  }

  // Only keep this if your table already has a preferred_caterer_id column.
  // If it does not exist yet, leave this commented out for now.
  // if (input.preferred_caterer_id) {
  //   insertPayload.preferred_caterer_id = input.preferred_caterer_id;
  // }

  const { data, error } = await supabase
    .from("event_requests")
    .insert(insertPayload)
    .select()
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

  const { data, error } = await supabase
    .from("event_requests")
    .update(updates)
    .eq("id", id)
    .eq("customer_id", user.id)
    .select()
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
    throw new Error(
      `No event request found for id=${id} and customer_id=${user.id}`
    );
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
