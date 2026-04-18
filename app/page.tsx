import { getEventRequestById, updateEventRequest, generateMatchesForEventRequest, getMatchesForEventRequest } from "@/lib/dashboard/event-requests"; 
import EventRequestClient from "./EventRequestClient";

// NOTE: If getMatchesForEventRequest is actually in event-request-matching.ts, 
// change the import above to:
// import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
// import { generateMatchesForEventRequest, getMatchesForEventRequest } from "@/lib/dashboard/event-request-matching";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  async function handleSave(formData: FormData) {
    "use server";
    // ... existing logic ...
  }

  return <EventRequestClient request={request} matches={matches} handleSave={handleSave} />;
}
