"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

type Props = {
  request: any;
  handleSave: (formData: FormData) => Promise<void>;
};

const eventTypes = ["wedding", "corporate", "birthday", "private_party", "christmas", "ramadan"];
const cateringTypes = ["buffet", "finger_food", "plated", "live_station", "bbq"];
const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Lactose-free", "Kosher"];
const cuisineOptions = ["German", "Mediterranean", "Italian", "Turkish", "Arabic", "BBQ", "Fine Dining"];
const extraOptions = ["Staff", "Tableware", "Delivery", "Setup", "Drinks", "Live Cooking"];

function safeArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return [value];
  return [];
}

export default function RequestEditClient({ request, handleSave }: Props) {
  const t = useT();

  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const selectedCuisines = safeArray(request?.cuisine_preferences);
  const selectedDietary = safeArray(request?.dietary_requirements);
  const selectedExtras = safeArray(request?.extra_services);

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
      <SpeiselyHeader />

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href={`/request/${request.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/70 px-4 py-2 text-sm font-medium text-[#173f35]/75 shadow-sm transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {tr("request.details.backToBrief", "Back to brief")}
        </Link>

        <div className="mt-8 rounded-[2.25rem] border border-[#eadfce] bg-white/80 p-6 shadow-[0_24px_80px_rgba(23,63,53,0.08)] md:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#173f35] px-4 py-2 text-sm font-semibold text-[#fbf7ef]">
              <Sparkles className="h-4 w-4 text-[#d8b76a]" />
              {tr("request.details.editLabel", "Improve details")}
            </div>

            <h1 className="premium-heading max-w-3xl text-5xl leading-[0.95] text-[#173f35] md:text-6xl">
              {tr("request.edit.title", "Refine your catering brief.")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#173f35]/70">
              {tr(
                "request.edit.subtitle",
                "Add only the details that help Speisely match you with better caterers."
              )}
            </p>
          </div>

          <form action={handleSave} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.details.city", "City")}
                </span>
                <input
                  name="city"
                  defaultValue={request?.city || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                  placeholder="Berlin"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.details.postalCode", "Postal code")}
                </span>
                <input
                  name="postal_code"
                  defaultValue={request?.postal_code || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                  placeholder="10115"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.details.guestCount", "Guests")}
                </span>
                <input
                  name="guest_count"
                  type="number"
                  min="1"
                  defaultValue={request?.guest_count || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                  placeholder="80"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.edit.eventDate", "Event date")}
                </span>
                <input
                  name="event_date"
                  type="date"
                  defaultValue={request?.event_date || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.edit.eventType", "Event type")}
                </span>
                <select
                  name="event_type"
                  defaultValue={request?.event_type || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                >
                  <option value="">Select</option>
                  {eventTypes.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.edit.cateringType", "Catering type")}
                </span>
                <select
                  name="catering_type"
                  defaultValue={request?.catering_type || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                >
                  <option value="">Select</option>
                  {cateringTypes.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.details.budgetTotal", "Budget total")}
                </span>
                <input
                  name="budget_total"
                  type="number"
                  min="0"
                  defaultValue={request?.budget_total || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                  placeholder="3000"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#173f35]/75">
                  {tr("request.edit.budgetPerPerson", "Budget per person")}
                </span>
                <input
                  name="budget_per_person"
                  type="number"
                  min="0"
                  defaultValue={request?.budget_per_person || ""}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                  placeholder="45"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <CheckboxGroup
                title={tr("request.edit.cuisines", "Cuisine preferences")}
                name="cuisine_preferences"
                options={cuisineOptions}
                selected={selectedCuisines}
              />

              <CheckboxGroup
                title={tr("request.edit.dietary", "Dietary requirements")}
                name="dietary_requirements"
                options={dietaryOptions}
                selected={selectedDietary}
              />

              <CheckboxGroup
                title={tr("request.edit.extras", "Extra services")}
                name="extra_services"
                options={extraOptions}
                selected={selectedExtras}
              />
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#173f35]/75">
                {tr("request.details.specialRequests", "Special requests")}
              </span>
              <textarea
                name="special_requests"
                defaultValue={request?.special_requests || ""}
                rows={5}
                className="w-full resize-none rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                placeholder={tr(
                  "request.details.specialRequestsPlaceholder",
                  "Vegetarian options, halal food, buffet style, staff, drinks..."
                )}
              />
            </label>

            <div className="flex flex-col justify-end gap-3 border-t border-[#eadfce] pt-6 sm:flex-row">
              <Link
                href={`/request/${request.id}`}
                className="inline-flex items-center justify-center rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
              >
                {tr("request.edit.cancel", "Cancel")}
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
              >
                {tr("request.edit.saveAndMatch", "Save and view matches")}
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
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
    <div className="rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-4">
      <p className="mb-3 text-sm font-semibold text-[#173f35]">{title}</p>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-[#173f35]/75"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="h-4 w-4 accent-[#173f35]"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
