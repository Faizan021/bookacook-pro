import { redirect } from "next/navigation";
import { createEventRequestDraft } from "@/lib/dashboard/event-requests";

export default async function NewEventRequestPage() {
  const draft = await createEventRequestDraft();
  redirect(`/request/${draft.id}`);
}
