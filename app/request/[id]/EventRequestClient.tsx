"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  CalendarDays,
  UtensilsCrossed,
  Star,
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

function formatBudget(value?: number | null) {
  if (!value) return "Flexible budget";
  return `€${Number(value).toLocaleString("de-DE")}`;
}

function formatGuests(value?: number | null) {
  if (!value) return "To be confirmed";
  return `${value} guests`;
}

function buildBrowseHref(request: any, caterer: any) {
  const params = new URLSearchParams();

  if (request?.city) params.set("city", request.city);

  const query =
    request?.special_requests ||
    request?.ai_query ||
    request?.event_type ||
    caterer?.business_name ||
    "";

  if (query) params.set("q", query);

  return `/caterers?${params.toString()}`;
}

function InsightPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#ddd5c6]">
      {label}
    </span>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#c49840]">{icon}</div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
          {label}
        </div>
        <div className="mt-1 text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function MatchReason({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c49840]/15 bg-[#c49840]/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#c49840]">
      <CheckCircle2 className="h-3 w-3" />
      {children}
    </span>
  );
}

function MatchCard({ match, request }: { match: any; request: any }) {
  const caterer = Array.isArray(match.caterers) ? match.caterers[0] : match.caterers;
  const score = Math.min(100, Math.round(match.match_score ?? 0));
  const browseHref = buildBrowseHref(request, caterer);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#c49840]/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))] md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.3rem] border border-[#c49840]/15 bg-[#c49840]/10 text-xl font-semibold text-[#c49840]">
            {caterer?.business_name?.charAt(0) || "C"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {caterer?.business_name || "Curated Caterer"}
              </h3>

              {caterer?.verification_status === "verified" ? (
                <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c49840]">
                  Verified
                </span>
              ) : null}

              {caterer?.is_featured ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#eadfca]">
                  Featured
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#93a28f]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {caterer?.city || "Hospitality specialist"}
              </span>

              {caterer?.average_rating ? (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                  {Number(caterer.average_rating).toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#c49840]/15 bg-[#c49840]/8 px-4 py-3 md:min-w-[140px]">
          <div className="text-right text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
            {score}% Match
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#c49840]"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {match.match_reasons?.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {match.match_reasons.map((reason: string) => (
            <MatchReason key={reason}>{reason}</MatchReason>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={browseHref}
          className="text-sm font-semibold text-white transition hover:text-[#c49840]"
        >
          View similar caterers
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={browseHref}
            className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
          >
            Open profile
          </Link>

          <Link
            href={browseHref}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] bg-[#c49840] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Explore match
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
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
      guests: formatGuests(request.guest_count),
      budget: formatBudget(request.budget_total),
      city: request.city || "Location not specified",
      date: request.event_date || "Date not specified",
    };
  }, [request]);

  const allInsightPills = useMemo(() => {
    const items: string[] = [];

    if (summary.catering !== "Not defined yet") items.push(summary.catering);

    (request?.dietary_requirements || []).forEach((item: string) => {
      if (!items.includes(item)) items.push(item);
    });

    (request?.cuisine_preferences || []).forEach((item: string) => {
      if (!items.includes(item)) items.push(item);
    });

    return items;
  }, [request, summary.catering]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.14) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.16) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.14) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <section className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:px-8 md:pb-16 md:pt-16">
          <div className="mb-8">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d8d1c2] transition hover:border-[#c49840]/30 hover:text-[#c49840]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to request preview
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                <Sparkles className="h-3.5 w-3.5" />
                Your event briefing
              </div>

              <h1 className="mt-8 text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Review your brief.
                <span className="mt-3 block italic text-[#c49840]">
                  Refine the shortlist if needed.
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-[#a4b29f]">
                Speisely has created a first shortlist based on your request. Review the
                best-fit caterers, then fine-tune the event brief below to improve
                matching quality and expand your shortlist.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.045] px-6 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Request reference
                </div>
                <div className="mt-2 font-mono text-lg font-semibold text-white">
                  #{String(request.id).slice(-6).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {request?.ai_query ? (
            <div className="mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-7">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                Original request
              </div>
              <blockquote className="mt-4 text-lg leading-8 text-white/90 md:text-xl">
                “{request.ai_query}”
              </blockquote>
            </div>
          ) : null}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="px-1">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                  Curated matches
                </div>
                <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-white">
                      {matches.length} partner{matches.length === 1 ? "" : "s"} available
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#92a18f]">
                      This first shortlist is based on your current brief. Stronger event
                      detail usually means better-quality matching.
                    </p>
                  </div>
                </div>
              </div>

              {matches.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-sm leading-7 text-[#92a18f]">
                  No matches yet. Refine the brief below and save again to refresh your
                  shortlist.
                </div>
              ) : (
                <div className="space-y-5">
                  {matches.map((match: any, idx: number) => (
                    <MatchCard
                      key={match?.id ?? idx}
                      match={match}
                      request={request}
                    />
                  ))}
                </div>
              )}
            </div>

            <form action={handleSave} className="space-y-8">
              <input type="hidden" name="request_id" value={request.id} />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
                <div className="mb-7">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                    01. Core event details
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
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
                      <option value="" className="bg-[#0d1711]">
                        Select type...
                      </option>
                      <option value="wedding" className="bg-[#0d1711]">
                        Wedding
                      </option>
                      <option value="birthday" className="bg-[#0d1711]">
                        Birthday
                      </option>
                      <option value="corporate" className="bg-[#0d1711]">
                        Corporate Event
                      </option>
                      <option value="private_party" className="bg-[#0d1711]">
                        Private Party
                      </option>
                      <option value="ramadan" className="bg-[#0d1711]">
                        Ramadan / Iftar
                      </option>
                      <option value="christmas" className="bg-[#0d1711]">
                        Christmas Dinner
                      </option>
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
                      <option value="" className="bg-[#0d1711]">
                        Select format...
                      </option>
                      <option value="buffet" className="bg-[#0d1711]">
                        Buffet
                      </option>
                      <option value="finger_food" className="bg-[#0d1711]">
                        Finger Food
                      </option>
                      <option value="plated" className="bg-[#0d1711]">
                        Plated Menu
                      </option>
                      <option value="live_station" className="bg-[#0d1711]">
                        Live Station
                      </option>
                      <option value="bbq" className="bg-[#0d1711]">
                        BBQ
                      </option>
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

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
                <div className="mb-7">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                    02. Culinary direction
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    Cuisine, dietary needs, and extras
                  </h3>
                </div>

                <div className="space-y-6">
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

          <aside className="space-y-6 xl:pt-[4.2rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                Brief summary
              </div>

              <div className="mt-6 space-y-5">
                <SummaryItem
                  icon={<CheckCircle2 className="h-4.5 w-4.5" />}
                  label="Event type"
                  value={summary.type}
                />
                <SummaryItem
                  icon={<Users className="h-4.5 w-4.5" />}
                  label="Guest count"
                  value={summary.guests}
                />
                <SummaryItem
                  icon={<Wallet className="h-4.5 w-4.5" />}
                  label="Budget"
                  value={summary.budget}
                />
                <SummaryItem
                  icon={<MapPin className="h-4.5 w-4.5" />}
                  label="Location"
                  value={summary.city}
                />
                <SummaryItem
                  icon={<CalendarDays className="h-4.5 w-4.5" />}
                  label="Date"
                  value={summary.date}
                />
              </div>

              {allInsightPills.length > 0 ? (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {allInsightPills.map((item) => (
                      <InsightPill key={item} label={item} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-[#c49840]/15 bg-[#c49840]/8 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="mt-0.5 h-5 w-5 text-[#c49840]" />
                <p className="text-sm leading-8 text-[#e7dcc7]">
                  Better details = better matches. The strongest signal for matching is
                  event type, city, guest count, cuisine fit, dietary requirements, and
                  budget direction.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
