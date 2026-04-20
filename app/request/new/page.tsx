import type { Metadata } from "next";
import { RequestIntakePage } from "@/components/request/request-intake-page";

export const metadata: Metadata = {
  title: "Plan your event",
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

  return (
    <RequestIntakePage
      initialQuery={resolvedSearchParams.q ?? ""}
      initialOccasion={resolvedSearchParams.occasion ?? ""}
      initialCaterer={resolvedSearchParams.caterer ?? ""}
    />
  );
}
