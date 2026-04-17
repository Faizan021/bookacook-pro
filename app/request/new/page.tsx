import type { Metadata } from "next";
import { RequestIntakePage } from "@/components/request/request-intake-page";

export const metadata: Metadata = {
  title: "Plan your event",
};

export default function NewEventRequestPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    occasion?: string;
    caterer?: string;
  };
}) {
  return (
    <RequestIntakePage
      initialQuery={searchParams?.q ?? ""}
      initialOccasion={searchParams?.occasion ?? ""}
      initialCaterer={searchParams?.caterer ?? ""}
    />
  );
}
