import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RequestIntakePage } from "@/components/request/request-intake-page";
import { createClient } from "@/lib/supabase/server";
import { createEventRequestDraft } from "@/lib/dashboard/event-requests";

export const metadata: Metadata = {
  title: "Speisely Preview",
};

type SearchParams = Promise<{
  q?: string;
  occasion?: string;
  caterer?: string;
}>;

export default async function NewEventRequestPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q ?? "";
  const occasion = resolvedSearchParams.occasion ?? "";
  const caterer = resolvedSearchParams.caterer ?? "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged-in user + query => create real draft and continue to request page
  if (user && query.trim()) {
    const draft = await createEventRequestDraft({
      ai_query: query,
      event_type: occasion || null,
      preferred_caterer_id: caterer || null,
    });

    if (draft?.id) {
      redirect(`/request/${draft.id}`);
    }
  }

  return (
    <RequestIntakePage
      initialQuery={query}
      initialOccasion={occasion}
      initialCaterer={caterer}
    />
  );
}
