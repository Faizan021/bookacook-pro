// app/request/[id]/page.tsx
import { redirect } from "next/navigation";
// IMPORTANT: Notice we are importing from TWO different files here
import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
import { 
  generateMatchesForEventRequest, 
  getMatchesForEventRequest 
} from "@/lib/dashboard/event-request-matching";
import EventRequestClient from "./EventRequestClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Fetch data on the server
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  // 2. The Server Action (This runs on the server, not the browser)
  async function handleSave(formData: FormData) {
    "use server";
    const guest_count = formData.get("guest_count") ? Number(formData.get("guest_count") as string) : undefined;
    const budget_total = formData.get("budget_total") ? Number(formData.get("budget_total") as string) : undefined;

    await updateEventRequest(id, {
      event_type: formData.get("event_type") as string || undefined,
      catering_type: formData.get("catering_type") as string || undefined,
      guest_count,
      city: formData.get("city") as string || undefined,
      postal_code: formData.get("postal_code") as string || undefined,
      service_style: formData.get("service_style") as string || undefined,
      event_date: formData.get("event_date") as string || undefined,
      budget_total,
      special_requests: formData.get("special_requests") as string || undefined,
      cuisine_preferences: formData.getAll("cuisine_preferences").map(v => String(v)),
      dietary_requirements: formData.getAll("dietary_requirements").map(v => String(v)),
      extra_services: formData.getAll("extra_services").map(v => String(v)),
      status: "submitted",
    });

    // Update the matching engine
    await generateMatchesForEventRequest(id);
    
    // Redirect the user to the fresh data
    redirect(`/request/${id}`);
  }

  // 3. Pass the data and the function to the Client UI
  return <EventRequestClient request={request} matches={matches} handleSave={handleSave} />;
}
