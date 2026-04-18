// app/request/[id]/page.tsx
import { getEventRequestById, updateEventRequest, generateMatchesForEventRequest, getMatchesForEventRequest } from "@/lib/dashboard/event-requests";
import EventRequestClient from "./EventRequestClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  async function handleSave(formData: FormData) {
    "use server";
    // ... your existing save logic ...
  }

  return <EventRequestClient request={request} matches={matches} handleSave={handleSave} />;
}
