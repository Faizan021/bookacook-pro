"use server";

import { createEventRequestDraft } from "@/lib/dashboard/event-requests";

type CreateRequestDraftInput = {
  ai_query?: string;
  event_type?: string | null;
  preferred_caterer_id?: string | null;
};

export async function createRequestDraftAction(
  input: CreateRequestDraftInput
) {
  const draft = await createEventRequestDraft({
    ai_query: input.ai_query ?? "",
    event_type: input.event_type ?? null,
    preferred_caterer_id: input.preferred_caterer_id ?? null,
  });

  if (!draft?.id) {
    throw new Error("Could not create request draft.");
  }

  return { id: draft.id };
}
