import { redirect } from "next/navigation";
import {
  getEventRequestById,
  updateEventRequest,
} from "@/lib/dashboard/event-requests";
import { generateMatchesForEventRequest } from "@/lib/dashboard/event-request-matching";
import RequestEditClient from "./RequestEditClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RequestEditPage({ params }: PageProps) {
  const { id } = await params;

  let request: any = null;

  try {
    request = await getEventRequestById(id);
  } catch (error) {
    console.error("Failed to load event request:", error);
    redirect("/request/new");
  }

  async function handleSave(formData: FormData) {
    "use server";

    const guest_count = formData.get("guest_count")
      ? Number(formData.get("guest_count"))
      : undefined;

    const budget_total = formData.get("budget_total")
      ? Number(formData.get("budget_total"))
      : undefined;

    const budget_per_person = formData.get("budget_per_person")
      ? Number(formData.get("budget_per_person"))
      : undefined;

    await updateEventRequest(id, {
      event_type: (formData.get("event_type") as string) || undefined,
      catering_type: (formData.get("catering_type") as string) || undefined,
      service_style: (formData.get("service_style") as string) || undefined,
      venue_type: (formData.get("venue_type") as string) || undefined,
      event_date: (formData.get("event_date") as string) || undefined,
      guest_count,
      city: (formData.get("city") as string) || undefined,
      postal_code: (formData.get("postal_code") as string) || undefined,
      budget_total,
      budget_per_person,
      planning_stage: (formData.get("planning_stage") as string) || undefined,
      special_requests:
        (formData.get("special_requests") as string) || undefined,
      cuisine_preferences: formData
        .getAll("cuisine_preferences")
        .map((value) => String(value))
        .filter(Boolean),
      dietary_requirements: formData
        .getAll("dietary_requirements")
        .map((value) => String(value))
        .filter(Boolean),
      extra_services: formData
        .getAll("extra_services")
        .map((value) => String(value))
        .filter(Boolean),
      status: "submitted",
    });

    try {
      await generateMatchesForEventRequest(id);
    } catch (error) {
      console.error("Failed to generate matches:", error);
    }

    redirect(`/request/${id}/matches`);
  }

  return <RequestEditClient request={request} handleSave={handleSave} />;
}
