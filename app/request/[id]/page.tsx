import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
import {
  generateMatchesForEventRequest,
  getMatchesForEventRequest,
} from "@/lib/dashboard/event-request-matching";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EVENT_TYPE_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate Event" },
  { value: "summerfest", label: "Summer Festival" },
  { value: "private_party", label: "Private Party" },
];

const CATERING_TYPE_OPTIONS = [
  { value: "buffet", label: "Buffet" },
  { value: "finger_food", label: "Finger Food" },
  { value: "plated", label: "Plated Menu" },
  { value: "live_station", label: "Live Station" },
  { value: "bbq", label: "BBQ" },
];

const SERVICE_STYLE_OPTIONS = [
  { value: "drop_off", label: "Drop-off only" },
  { value: "staffed", label: "Staffed service" },
  { value: "full_service", label: "Full service" },
];

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
  const event_date = String(formData.get("event_date") || "");
  const budget_total_raw = String(formData.get("budget_total") || "");

  if (!id) {
    throw new Error("Missing request ID");
  }

  const guest_count = guest_count_raw ? Number(guest_count_raw) : undefined;
  const budget_total = budget_total_raw ? Number(budget_total_raw) : undefined;

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
    event_date: event_date || undefined,
    budget_total,
    cuisine_preferences,
    dietary_requirements,
    extra_services,
    status: "submitted",
  });

  await generateMatchesForEventRequest(id);

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
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {title}
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="h-4 w-4"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
}

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Plan Your Event
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Share your event details and preferences. Speisely will use this
              information to help you discover suitable caterers for your
              occasion.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Request ID:</span>{" "}
            {request.id}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            action={saveRequest}
            className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <input type="hidden" name="request_id" value={request.id} />

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Event Details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Start with the basics so we can understand your event and
                recommend relevant catering options.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Event Type
                </label>
                <select
                  name="event_type"
                  defaultValue={request.event_type || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Catering Type
                </label>
                <select
                  name="catering_type"
                  defaultValue={request.catering_type || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                >
                  <option value="">Select catering type</option>
                  {CATERING_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guest_count"
                  defaultValue={request.guest_count || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                  min="1"
                  placeholder="e.g. 60"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Event Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  defaultValue={request.event_date || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={request.city || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                  placeholder="e.g. Berlin"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  defaultValue={request.postal_code || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                  placeholder="e.g. 10115"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Budget Total (€)
                </label>
                <input
                  type="number"
                  name="budget_total"
                  defaultValue={request.budget_total || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                  min="0"
                  step="1"
                  placeholder="e.g. 2500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Service Style
                </label>
                <select
                  name="service_style"
                  defaultValue={request.service_style || ""}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                >
                  <option value="">Select service style</option>
                  {SERVICE_STYLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Catering Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select cuisines, dietary preferences, and any extra services you
                would like included.
              </p>
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

            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
              <button
                type="submit"
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Save Request & Find Matches
              </button>

              <span className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium text-gray-900">
                  {request.status}
                </span>
              </span>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Request Summary
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick overview of the details you have provided so far.
            </p>

            <div className="mt-4">
              <SummaryRow label="Event Type" value={request.event_type} />
              <SummaryRow label="Catering Type" value={request.catering_type} />
              <SummaryRow label="Number of Guests" value={request.guest_count} />
              <SummaryRow label="City" value={request.city} />
              <SummaryRow label="Postal Code" value={request.postal_code} />
              <SummaryRow label="Event Date" value={request.event_date} />
              <SummaryRow label="Budget Total" value={request.budget_total} />
              <SummaryRow label="Service Style" value={request.service_style} />
              <SummaryRow
                label="Cuisine Preferences"
                value={(request.cuisine_preferences || []).join(", ")}
              />
              <SummaryRow
                label="Dietary Requirements"
                value={(request.dietary_requirements || []).join(", ")}
              />
              <SummaryRow
                label="Extra Services"
                value={(request.extra_services || []).join(", ")}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Suggested Caterers
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Based on your request details, here are the most relevant
                caterers we found so far.
              </p>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                No matches yet. Save your request to generate suggestions.
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match: any) => {
                  const caterer = Array.isArray(match.caterers)
                    ? match.caterers[0]
                    : match.caterers;

                  return (
                    <div
                      key={match.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {caterer?.business_name || "Unnamed Caterer"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {caterer?.city || "Location not available"}
                          </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          Score {match.match_score}
                        </span>
                      </div>

                      {(caterer?.cuisine_types || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(caterer.cuisine_types || []).map(
                            (cuisine: string) => (
                              <span
                                key={cuisine}
                                className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700"
                              >
                                {cuisine}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {(match.match_reasons || []).length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-gray-600">
                          {(match.match_reasons || []).map((reason: string) => (
                            <li key={reason} className="flex gap-2">
                              <span className="mt-[2px] text-orange-500">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {caterer?.slug ? (
                        <div className="mt-4">
                          <a
                            href={`/caterers/${caterer.slug}`}
                            className="text-sm font-semibold text-orange-600 hover:text-orange-500"
                          >
                            View Caterer
                          </a>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
