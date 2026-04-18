// app/request/[id]/page.tsx

import { redirect } from "next/navigation";
import { getEventRequestById, updateEventRequest, generateMatchesForEventRequest, getMatchesForEventRequest } from "@/lib/dashboard/event-requests";
import EventRequestClient from "./EventRequestClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  // The Server Action (handleSave) stays here so it can be called by the client
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

    await generateMatchesForEventRequest(id);
    redirect(`/request/${id}`);
  }

  return <EventRequestClient request={request} matches={matches} handleSave={handleSave} />;
}
