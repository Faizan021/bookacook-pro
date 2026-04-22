"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

type Props = {
  request: any;
  matches: any[];
  handleSave: (formData: FormData) => Promise<void>;
};

function formatEventType(value?: string) {
  if (!value) return "Not defined yet";

  const map: Record<string, string> = {
    wedding: "Wedding",
    birthday: "Birthday",
    corporate: "Corporate Event",
    private_party: "Private Party",
    ramadan: "Ramadan / Iftar",
    christmas: "Christmas Dinner",
  };

  return map[value] ?? value;
}

function formatCateringType(value?: string) {
  if (!value) return "Not defined yet";

  const map: Record<string, string> = {
    buffet: "Buffet",
    finger_food: "Finger Food",
    plated: "Plated Menu",
    live_station: "Live Station",
    bbq: "BBQ",
  };

  return map[value] ?? value;
}

function MatchCard({ match }: { match: any }) {
  const caterer = Array.isArray(match.caterers) ? match.caterers[0] : match.caterers;
  const score = Math.min(100, Math.round(match.match_score ?? 0));

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c49840]/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#c49840]/15 bg-[#c49840]/10 text-lg font-semibold text-[#c49840]">
            {caterer?.business_name?.charAt(0) || "C"}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {caterer?.business_name || "Curated Caterer"}
            </h3>
            <p className="mt-1 text-sm text-[#93a28f]">
              {caterer?.city || "Hospitality specialist"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
            {score}% match
          </div>
          <div className="mt-2 h-1.5 w-20 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#c49840]"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {match.match_reasons?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {match.match_reasons.map((reason: string) => (
            <span
              key={reason}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c49840]/15 bg-[#c49840]/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#c49840]"
            >
              <CheckCircle2 className="h-3 w-3" />
              {reason}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
        <a
          href={`/caterers/${caterer?.slug ?? caterer?.id ?? ""}`}
          className="text-sm font-semibold text-white transition hover:text-[#c49840]"
        >
          View profile
        </a>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
        >
          Open match
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function InsightPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#ddd5c6]">
      {label}
    </span>
  );
}

export default function EventRequestClient({
  request,
  matches,
  handleSave,
}: Props) {
  const summary = useMemo(() => {
    return {
      type: formatEventType(request.event_type),
      catering: formatCateringType(request.catering_type),
      guests: request.guest_count ? `${request.guest_count} guests` : "To be confirmed",
      budget: request.budget_total ? `€${request.budget_total}` : "Flexible budget",
      city: request.city || "Location not specified",
      date: request.event_date || "Date not specified",
    };
  }, [request]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.15) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.16) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <section className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:px-8 md:pb-20 md:pt-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                <Sparkles className="h-3.5 w-3.5" />
                Your event briefing
              </div>

              <h1 className="mt-8 text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                Review your brief.
                <span className="mt-2 block italic text-[#c49840]">
                  Refine the shortlist if needed.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a4b29f]">
                Speisely has created a first shortlist based on your request. You can already
                review suitable caterers below, then improve the brief to make matching even
                more precise.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8ea18b]">
                Request reference
              </div>
              <div className="mt-2 font-mono text-sm font-semibold text-white">
                #{String(request.id).slice(-6).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="px-1">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                  Curated matches
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {matches.length} partner{matches.length === 1 ? "" : "s"} available
                </h3>
                <p className="mt-2 text-sm text-[#92a18f]">
                  This first shortlist was generated from your saved request. Add more detail
                  below to improve match quality.
                </p>
              </div>

              {matches.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm leading-7 text-[#92a18f]">
                  No matches yet. Complete your brief below and refresh the shortlist.
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match: any, idx: number) => (
                    <MatchCard key={match?.id ?? idx} match={match} />
                  ))}
                </div>
              )}
            </div>

            <form action={handleSave} className="space-y-8">
              <input type="hidden" name="request_id" value={request.id} />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
                <div className="mb-6">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                    01. Core event details
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    Logistics and event scope
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Event type
                    </label>
                    <select
                      name="event_type"
                      defaultValue={request.event_type || ""}
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white outline-none focus:border-[#c49840]/35"
                    >
                      <option value="" className="bg-[#0d1711]">Select type...</option>
                      <option value="wedding" className="bg-[#0d1711]">Wedding</option>
                      <option value="birthday" className="bg-[#0d1711]">Birthday</option>
                      <option value="corporate" className="bg-[#0d1711]">Corporate Event</option>
                      <option value="private_party" className="bg-[#0d1711]">Private Party</option>
                      <option value="ramadan" className="bg-[#0d1711]">Ramadan / Iftar</option>
                      <option value="christmas" className="bg-[#0d1711]">Christmas Dinner</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Catering format
                    </label>
                    <select
                      name="catering_type"
                      defaultValue={request.catering_type || ""}
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white outline-none focus:border-[#c49840]/35"
                    >
                      <option value="" className="bg-[#0d1711]">Select format...</option>
                      <option value="buffet" className="bg-[#0d1711]">Buffet</option>
                      <option value="finger_food" className="bg-[#0d1711]">Finger Food</option>
                      <option value="plated" className="bg-[#0d1711]">Plated Menu</option>
                      <option value="live_station" className="bg-[#0d1711]">Live Station</option>
                      <option value="bbq" className="bg-[#0d1711]">BBQ</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Guest count
                    </label>
                    <input
                      type="number"
                      name="guest_count"
                      defaultValue={request.guest_count || ""}
                      placeholder="e.g. 80"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#c49840]/35"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Budget total (€)
                    </label>
                    <input
                      type="number"
                      name="budget_total"
                      defaultValue={request.budget_total || ""}
                      placeholder="e.g. 3500"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#c49840]/35"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={request.city || ""}
                      placeholder="e.g. Berlin"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#c49840]/35"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Postal code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      defaultValue={request.postal_code || ""}
                      placeholder="e.g. 10115"
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#c49840]/35"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Event date
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      defaultValue={request.event_date || ""}
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm text-white outline-none focus:border-[#c49840]/35"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
                <div className="mb-6">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                    02. Culinary direction
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    Cuisine, dietary needs, and extras
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Cuisine preferences
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        "Turkish",
                        "Mediterranean",
                        "Italian",
                        "Arabic",
                        "German",
                        "BBQ",
                        "Vegan",
                        "Fine Dining",
                      ].map((option) => (
                        <label key={option} className="cursor-pointer">
                          <input
                            type="checkbox"
                            name="cuisine_preferences"
                            value={option}
                            defaultChecked={request.cuisine_preferences?.includes(option)}
                            className="peer hidden"
                          />
                          <div className="rounded-[1rem] border border-white/10 bg-black/10 p-3 text-center text-xs font-medium text-[#ddd5c6] transition peer-checked:border-[#c49840]/30 peer-checked:bg-[#c49840]/10 peer-checked:text-[#c49840]">
                            {option}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Dietary requirements
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        "Vegetarian",
                        "Vegan",
                        "Halal",
                        "Gluten-free",
                        "Lactose-free",
                        "Kosher",
                      ].map((option) => (
                        <label key={option} className="cursor-pointer">
                          <input
                            type="checkbox"
                            name="dietary_requirements"
                            value={option}
                            defaultChecked={request.dietary_requirements?.includes(option)}
                            className="peer hidden"
                          />
                          <div className="rounded-[1rem] border border-white/10 bg-black/10 p-3 text-center text-xs font-medium text-[#ddd5c6] transition peer-checked:border-[#c49840]/30 peer-checked:bg-[#c49840]/10 peer-checked:text-[#c49840]">
                            {option}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Extra services
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        "Staff",
                        "Tableware",
                        "Delivery",
                        "Setup",
                        "Drinks",
                        "Live Cooking",
                      ].map((option) => (
                        <label key={option} className="cursor-pointer">
                          <input
                            type="checkbox"
                            name="extra_services"
                            value={option}
                            defaultChecked={request.extra_services?.includes(option)}
                            className="peer hidden"
                          />
                          <div className="rounded-[1rem] border border-white/10 bg-black/10 p-3 text-center text-xs font-medium text-[#ddd5c6] transition peer-checked:border-[#c49840]/30 peer-checked:bg-[#c49840]/10 peer-checked:text-[#c49840]">
                            {option}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
                      Special requests
                    </label>
                    <textarea
                      name="special_requests"
                      defaultValue={request.special_requests || ""}
                      rows={5}
                      placeholder="e.g. elegant styling, staffing, cocktail buffet"
                      className="mt-3 w-full resize-none rounded-[1.2rem] border border-white/10 bg-black/10 p-4 text-sm leading-7 text-white placeholder:text-white/30 outline-none focus:border-[#c49840]/35"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[1.2rem] bg-[#c49840] px-6 py-4 text-base font-semibold text-black transition hover:scale-[1.01]"
              >
                Save brief & refresh matches
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                Brief summary
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      Event type
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{summary.type}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      Guest count
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">
                      {summary.guests}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wallet className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      Budget
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">
                      {summary.budget}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      Location
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">
                      {summary.city}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex flex-wrap gap-2">
                  <InsightPill label={summary.catering} />
                  {request.dietary_requirements?.slice?.(0, 2)?.map((item: string) => (
                    <InsightPill key={item} label={item} />
                  ))}
                  {request.cuisine_preferences?.slice?.(0, 2)?.map((item: string) => (
                    <InsightPill key={item} label={item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#c49840]/15 bg-[#c49840]/8 p-5">
              <p className="text-sm leading-7 text-[#e7dcc7]">
                Better details = better matches. The strongest signal for matching is
                event type, city, guest count, cuisine fit, dietary requirements, and
                budget direction.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
