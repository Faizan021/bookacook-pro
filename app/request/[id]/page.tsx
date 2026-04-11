import { notFound } from "next/navigation";
import { getEventRequestById } from "@/lib/dashboard/event-requests";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EventRequestPage({ params }: PageProps) {
  const request = await getEventRequestById(params.id).catch(() => null);

  if (!request) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Event Request</h1>

      <div className="space-y-3 rounded-lg border p-4">
        <p><strong>ID:</strong> {request.id}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Event Type:</strong> {request.event_type || "—"}</p>
        <p><strong>Catering Type:</strong> {request.catering_type || "—"}</p>
        <p><strong>Guest Count:</strong> {request.guest_count || "—"}</p>
        <p><strong>City:</strong> {request.city || "—"}</p>
        <p><strong>Postal Code:</strong> {request.postal_code || "—"}</p>
        <p><strong>Budget Total:</strong> {request.budget_total || "—"}</p>
        <p><strong>Event Date:</strong> {request.event_date || "—"}</p>
      </div>
    </div>
  );
}
