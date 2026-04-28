import { redirect } from "next/navigation";
import { getEventRequestById } from "@/lib/dashboard/event-requests";
import {
  generateMatchesForEventRequest,
  getMatchesForEventRequest,
} from "@/lib/dashboard/event-request-matching";
import RequestMatchesClient from "./RequestMatchesClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RequestMatchesPage({ params }: PageProps) {
  const { id } = await params;

  let request: any = null;
  let matches: any[] = [];

  try {
    request = await getEventRequestById(id);
  } catch (error) {
    console.error("Failed to load event request:", error);
    redirect("/request/new");
  }

  try {
    matches = await getMatchesForEventRequest(id);
  } catch (error) {
    console.error("Failed to load matches:", error);
    matches = [];
  }

  async function regenerateMatches() {
    "use server";

    try {
      await generateMatchesForEventRequest(id);
    } catch (error) {
      console.error("Failed to regenerate matches:", error);
    }

    redirect(`/request/${id}/matches`);
  }

  return (
    <RequestMatchesClient
      request={request}
      matches={matches}
      regenerateMatches={regenerateMatches}
    />
  );
}
