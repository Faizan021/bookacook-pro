import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function saveStep1(formData: FormData) {
  "use server";

  const id = String(formData.get("request_id") || "");
  const event_type = String(formData.get("event_type") || "");
  const catering_type = String(formData.get("catering_type") || "");
  const guest_count_raw = String(formData.get("guest_count") || "");
  const city = String(formData.get("city") || "");
  const postal_code = String(formData.get("postal_code") || "");

  if (!id) {
    throw new Error("Missing request ID");
  }

  const guest_count = guest_count_raw ? Number(guest_count_raw) : undefined;

  await updateEventRequest(id, {
    event_type: event_type || undefined,
    catering_type: catering_type || undefined,
    guest_count,
    city: city || undefined,
    postal_code: postal_code || undefined,
  });

  redirect(`/request/${id}`);
}

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create Event Request</h1>

      <form action={saveStep1} className="space-y-4 rounded-lg border p-6">
        <input type="hidden" name="request_id" value={request.id} />

        <div>
          <label className="mb-1 block text-sm font-medium">Event Type</label>
          <select
            name="event_type"
            defaultValue={request.event_type || ""}
            className="w-full rounded-md border p-2"
          >
            <option value="">Select event type</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="corporate">Corporate Event</option>
            <option value="summerfest">Summer Festival</option>
            <option value="private_party">Private Party</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Catering Type</label>
          <select
            name="catering_type"
            defaultValue={request.catering_type || ""}
            className="w-full rounded-md border p-2"
          >
            <option value="">Select catering type</option>
            <option value="buffet">Buffet</option>
            <option value="finger_food">Finger Food</option>
            <option value="plated">Plated Menu</option>
            <option value="live_station">Live Station</option>
            <option value="bbq">BBQ</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Guest Count</label>
          <input
            type="number"
            name="guest_count"
            defaultValue={request.guest_count || ""}
            className="w-full rounded-md border p-2"
            min="1"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            defaultValue={request.city || ""}
            className="w-full rounded-md border p-2"
            placeholder="e.g. Mülheim an der Ruhr"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Postal Code</label>
          <input
            type="text"
            name="postal_code"
            defaultValue={request.postal_code || ""}
            className="w-full rounded-md border p-2"
            placeholder="e.g. 45473"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Save Step 1
        </button>
      </form>

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Current Request Data</h2>
        <p><strong>ID:</strong> {request.id}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Event Type:</strong> {request.event_type || "—"}</p>
        <p><strong>Catering Type:</strong> {request.catering_type || "—"}</p>
        <p><strong>Guest Count:</strong> {request.guest_count || "—"}</p>
        <p><strong>City:</strong> {request.city || "—"}</p>
        <p><strong>Postal Code:</strong> {request.postal_code || "—"}</p>
      </div>
    </div>
  );
}
