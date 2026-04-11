import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const CUISINE_OPTIONS = [
  "Turkish",
  "Mediterranean",
  "Italian",
  "Arabic",
  "German",
  "BBQ",
  "Vegan",
];

const DIETARY_OPTIONS = [
  "Halal",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
];

const EXTRA_SERVICE_OPTIONS = [
  "Drinks",
  "Staff",
  "Tableware",
  "Setup & Cleanup",
];

function getSelectedValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

async function saveRequest(formData: FormData) {
  "use server";

  const id = String(formData.get("request_id") || "");
  const event_type = String(formData.get("event_type") || "");
  const catering_type = String(formData.get("catering_type") || "");
  const guest_count_raw = String(formData.get("guest_count") || "");
  const city = String(formData.get("city") || "");
  const postal_code = String(formData.get("postal_code") || "");
  const service_style = String(formData.get("service_style") || "");

  if (!id) {
    throw new Error("Missing request ID");
  }

  const guest_count = guest_count_raw ? Number(guest_count_raw) : undefined;

  const cuisine_preferences = getSelectedValues(formData, "cuisine_preferences");
  const dietary_requirements = getSelectedValues(formData, "dietary_requirements");
  const extra_services = getSelectedValues(formData, "extra_services");

  await updateEventRequest(id, {
    event_type: event_type || undefined,
    catering_type: catering_type || undefined,
    guest_count,
    city: city || undefined,
    postal_code: postal_code || undefined,
    service_style: service_style || undefined,
    cuisine_preferences,
    dietary_requirements,
    extra_services,
  });

  redirect(`/request/${id}`);
}

function CheckboxGroup({
  title,
  name,
  options,
  selected,
}: {
  title: string;
  name: string;
  options: string[];
  selected: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{title}</label>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 rounded-md border p-3 text-sm"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create Event Request</h1>

      <form action={saveRequest} className="space-y-4 rounded-lg border p-6">
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
            placeholder="e.g. Berlin"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Postal Code</label>
          <input
            type="text"
            name="postal_code"
            defaultValue={request.postal_code || ""}
            className="w-full rounded-md border p-2"
            placeholder="e.g. 12681"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Service Style</label>
          <select
            name="service_style"
            defaultValue={request.service_style || ""}
            className="w-full rounded-md border p-2"
          >
            <option value="">Select service style</option>
            <option value="drop_off">Drop-off only</option>
            <option value="staffed">Staffed service</option>
            <option value="full_service">Full service</option>
          </select>
        </div>

        <CheckboxGroup
          title="Cuisine Preferences"
          name="cuisine_preferences"
          options={CUISINE_OPTIONS}
          selected={request.cuisine_preferences || []}
        />

        <CheckboxGroup
          title="Dietary Requirements"
          name="dietary_requirements"
          options={DIETARY_OPTIONS}
          selected={request.dietary_requirements || []}
        />

        <CheckboxGroup
          title="Extra Services"
          name="extra_services"
          options={EXTRA_SERVICE_OPTIONS}
          selected={request.extra_services || []}
        />

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Save Request
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
        <p><strong>Service Style:</strong> {request.service_style || "—"}</p>
        <p><strong>Cuisine Preferences:</strong> {(request.cuisine_preferences || []).join(", ") || "—"}</p>
        <p><strong>Dietary Requirements:</strong> {(request.dietary_requirements || []).join(", ") || "—"}</p>
        <p><strong>Extra Services:</strong> {(request.extra_services || []).join(", ") || "—"}</p>
      </div>
    </div>
  );
}
