import type { Metadata } from "next";
import { RequestIntakePage } from "@/components/request/request-intake-page";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <RequestIntakePage
      initialQuery={resolvedSearchParams.q ?? ""}
      initialOccasion={resolvedSearchParams.occasion ?? ""}
      initialCaterer={resolvedSearchParams.caterer ?? ""}
      isLoggedIn={!!user}
    />
  );
}
