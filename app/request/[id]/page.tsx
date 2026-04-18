import { redirect } from "next/navigation";
import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests";
import {
  generateMatchesForEventRequest,
  getMatchesForEventRequest,
} from "@/lib/dashboard/event-request-matching";

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
  const special_requests = String(formData.get("special_requests") || "");

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
    special_requests: special_requests || undefined,
    cuisine_preferences,
    dietary_requirements,
    extra_services,
    status: "submitted",
  });

  await generateMatchesForEventRequest(id);

  redirect(`/request/${id}`);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
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
      <FieldLabel>{title}</FieldLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm transition hover:bg-secondary"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="h-4 w-4 rounded border-border accent-[var(--primary)]"
            />
            <span className="text-foreground">{option}</span>
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
    <div className="flex items-start justify-between gap-4 border-b border-border py-2 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: any }) {
  const caterer = Array.isArray(match.caterers) ? match.caterers[0] : match.caterers;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {caterer?.business_name || "Unnamed Caterer"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {caterer?.city || "Location not available"}
          </p>
        </div>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
          Score {match.match_score}
        </span>
      </div>

      {(caterer?.cuisine_types || []).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {(caterer.cuisine_types || []).map((cuisine: string) => (
            <span
              key={cuisine}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {cuisine}
            </span>
          ))}
        </div>
      )}

      {(match.match_reasons || []).length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {(match.match_reasons || []).map((reason: string) => (
            <li key={reason} className="flex gap-2">
              <span className="mt-[2px] text-primary">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}

      {caterer?.slug ? (
        <div className="mt-4">
          <a
            href={`/caterers/${caterer.slug}`}
            className="text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            View caterer
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default async function EventRequestPage({ params }: PageProps) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="page-container section-shell-lg">
        <div className="mb-8 premium-card p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow text-primary">Event brief</div>
              <h1 className="section-title mt-3 text-3xl font-semibold sm:text-4xl">
                Refine your catering request
              </h1>
              <p className="body-muted mt-4 text-base">
                Review your event details, add preferences, and let Speisely
                generate suitable caterer matches for your request.
              </p>
            </div>

            <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground">
              <span className="font-semibold">Request ID:</span> {request.id}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form action={saveRequest} className="space-y-6 premium-card p-6 lg:p-8">
              <input type="hidden" name="request_id" value={request.id} />

              <div>
                <div className="eyebrow text-primary">Details</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Event details
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start with the basics so Speisely can understand your event
                  and recommend relevant caterers.
                </p>
              </div>

              {!!request.special_requests && (
                <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Original request
                  </div>
                  <p className="mt-2 text-sm leading-7 text-foreground">
                    {request.special_requests}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Event Type</FieldLabel>
                  <select
                    name="event_type"
                    defaultValue={request.event_type || ""}
                    className="field"
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
                  <FieldLabel>Catering Type</FieldLabel>
                  <select
                    name="catering_type"
                    defaultValue={request.catering_type || ""}
                    className="field"
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
                  <FieldLabel>Number of Guests</FieldLabel>
                  <input
                    type="number"
                    name="guest_count"
                    defaultValue={request.guest_count || ""}
                    className="field"
                    min="1"
                    placeholder="e.g. 60"
                  />
                </div>

                <div>
                  <FieldLabel>Event Date</FieldLabel>
                  <input
                    type="date"
                    name="event_date"
                    defaultValue={request.event_date || ""}
                    className="field"
                  />
                </div>

                <div>
                  <FieldLabel>City</FieldLabel>
                  <input
                    type="text"
                    name="city"
                    defaultValue={request.city || ""}
                    className="field"
                    placeholder="e.g. Berlin"
                  />
                </div>

                <div>
                  <FieldLabel>Postal Code</FieldLabel>
                  <input
                    type="text"
                    name="postal_code"
                    defaultValue={request.postal_code || ""}
                    className="field"
                    placeholder="e.g. 10115"
                  />
                </div>

                <div>
                  <FieldLabel>Budget Total (€)</FieldLabel>
                  <input
                    type="number"
                    name="budget_total"
                    defaultValue={request.budget_total || ""}
                    className="field"
                    min="0"
                    step="1"
                    placeholder="e.g. 2500"
                  />
                </div>

                <div>
                  <FieldLabel>Service Style</FieldLabel>
                  <select
                    name="service_style"
                    defaultValue={request.service_style || ""}
                    className="field"
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

              <div className="border-t border-border pt-6">
                <div className="eyebrow text-primary">Preferences</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Catering preferences
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select cuisines, dietary preferences, and extra services you
                  would like included.
                </p>
              </div>

              <div>
                <FieldLabel>Anything else we should know?</FieldLabel>
                <textarea
                  name="special_requests"
                  defaultValue={request.special_requests || ""}
                  rows={4}
                  className="field"
                  placeholder="Tell us about style, atmosphere, priorities, or any other details."
                />
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

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Save request & find matches
                </button>

                <span className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span className="font-medium text-foreground">
                    {request.status}
                  </span>
                </span>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Request summary
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
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

            <div className="premium-card p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Suggested caterers
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on your request details, here are the most relevant
                  caterers we found so far.
                </p>
              </div>

              {matches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  No matches yet. Save your request to generate suggestions.
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match: any) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
