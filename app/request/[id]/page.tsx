import { redirect } from "next/navigation";
import {
  getEventRequestById,
  updateEventRequest,
} from "@/lib/dashboard/event-requests";
import {
  generateMatchesForEventRequest,
  getMatchesForEventRequest,
} from "@/lib/dashboard/event-request-matching";
import EventRequestClient from "./EventRequestClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventRequestPage({ params }: PageProps) {
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

  async function handleSave(formData: FormData) {
    "use server";

    const guest_count = formData.get("guest_count")
      ? Number(formData.get("guest_count"))
      : undefined;

    const budget_total = formData.get("budget_total")
      ? Number(formData.get("budget_total"))
      : undefined;

    await updateEventRequest(id, {
      event_type: (formData.get("event_type") as string) || undefined,
      catering_type: (formData.get("catering_type") as string) || undefined,
      guest_count,
      city: (formData.get("city") as string) || undefined,
      postal_code: (formData.get("postal_code") as string) || undefined,
      service_style: (formData.get("service_style") as string) || undefined,
      event_date: (formData.get("event_date") as string) || undefined,
      budget_total,
      special_requests: (formData.get("special_requests") as string) || undefined,
      cuisine_preferences: formData
        .getAll("cuisine_preferences")
        .map((v) => String(v)),
      dietary_requirements: formData
        .getAll("dietary_requirements")
        .map((v) => String(v)),
      extra_services: formData
        .getAll("extra_services")
        .map((v) => String(v)),
      status: "submitted",
    });

    try {
      await generateMatchesForEventRequest(id);
    } catch (error) {
      console.error("Failed to generate matches:", error);
    }

    redirect(`/request/${id}`);
  }

  return (
    <EventRequestClient
      request={request}
      matches={matches}
      handleSave={handleSave}
    />
  );
}
