import { getEventRequestById } from "@/lib/dashboard/event-requests";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const request = await getEventRequestById(id);

    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Event Request</h1>

        <div className="space-y-3 rounded-lg border p-4">
          <p><strong>ID:</strong> {request?.id || "no request found"}</p>
          <p><strong>Status:</strong> {request?.status || "—"}</p>
          <p><strong>Event Type:</strong> {request?.event_type || "—"}</p>
          <p><strong>Catering Type:</strong> {request?.catering_type || "—"}</p>
          <p><strong>Guest Count:</strong> {request?.guest_count || "—"}</p>
          <p><strong>City:</strong> {request?.city || "—"}</p>
          <p><strong>Postal Code:</strong> {request?.postal_code || "—"}</p>
          <p><strong>Budget Total:</strong> {request?.budget_total || "—"}</p>
          <p><strong>Event Date:</strong> {request?.event_date || "—"}</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Event Request Debug</h1>
        <pre className="rounded-lg border p-4 whitespace-pre-wrap">
          {error instanceof Error ? error.message : "Unknown error"}
        </pre>
        <p className="mt-4"><strong>Request ID from URL:</strong> {id}</p>
      </div>
    );
  }
}
