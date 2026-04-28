"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Sparkles,
  Star,
  Users,
  Wallet,
  WandSparkles,
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

type Props = {
  request: any;
  matches: any[];
  handleSave: (formData: FormData) => Promise<void>;
};

function formatMoney(value?: number | null) {
  if (!value) return "";
  return `€${Number(value).toLocaleString("de-DE")}`;
}

function buildBrowseHref(request: any) {
  const params = new URLSearchParams();
  if (request?.city) params.set("city", request.city);
  if (request?.special_requests || request?.ai_query) {
    params.set("q", request.special_requests || request.ai_query);
  }
  return `/caterers?${params.toString()}`;
}

function safeArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return [value];
  return [];
}

export default function EventRequestClient({
  request,
  matches,
  handleSave,
}: Props) {
  const t = useT();
  const [showEdit, setShowEdit] = useState(false);

  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const originalPrompt =
    request?.ai_query ||
    request?.special_requests ||
    tr(
      "request.details.noOriginalPrompt",
      "No original prompt was saved. You can improve the details below."
    );

  const budget =
    request?.budget_total || request?.budget_per_person
      ? request?.budget_total
        ? formatMoney(request.budget_total)
        : `${formatMoney(request.budget_per_person)} p.p.`
      : tr("request.details.flexibleBudget", "Flexible budget");

  const chips = useMemo(() => {
    const items = [
      {
        icon: CalendarDays,
        label:
          request?.event_type ||
          request?.catering_type ||
          tr("request.details.eventType", "Event"),
      },
      {
        icon: Users,
        label: request?.guest_count
          ? `${request.guest_count} ${tr("request.details.guests", "guests")}`
          : tr("request.details.guestCountMissing", "Guest count open"),
      },
      {
        icon: MapPin,
        label: request?.city
          ? `${request.city}${request?.postal_code ? `, ${request.postal_code}` : ""}`
          : tr("request.details.locationMissing", "Location open"),
      },
      {
        icon: Wallet,
        label: budget,
      },
    ];

    return items.filter((item) => Boolean(item.label));
  }, [request, budget]);

  const preferences = [
    ...safeArray(request?.cuisine_preferences),
    ...safeArray(request?.dietary_requirements),
    ...safeArray(request?.extra_services),
  ];

  const hasMatches = Array.isArray(matches) && matches.length > 0;

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden border-b border-[#eadfce]">
        <div className="absolute left-[-10%] top-[-20%] h-80 w-80 rounded-full bg-[#b28a3c]/10 blur-3xl" />
        <div className="absolute right-[-8%] top-10 h-96 w-96 rounded-full bg-[#173f35]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Link
            href="/customer"
            className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/60 px-4 py-2 text-sm font-medium text-[#173f35]/75 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {tr("request.details.backToDashboard", "Back to dashboard")}
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="rounded-[2rem] border border-[#eadfce] bg-white/75 p-6 shadow-[0_24px_80px_rgba(23,63,53,0.08)] backdrop-blur md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#173f35] px-4 py-2 text-sm font-semibold text-[#fbf7ef]">
                <Sparkles className="h-4 w-4 text-[#d8b76a]" />
                {tr("request.details.aiUnderstood", "AI understood your event")}
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#173f35] sm:text-4xl lg:text-5xl">
                {tr(
                  "request.details.title",
                  "Your catering brief is ready."
                )}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[#173f35]/70">
                {tr(
                  "request.details.subtitle",
                  "Speisely converted your event idea into a clean brief. You can improve a few details or continue to matching caterers."
                )}
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
                  {tr("request.details.originalPrompt", "Original prompt")}
                </p>
                <p className="text-base leading-7 text-[#173f35]">
                  “{originalPrompt}”
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {chips.map((chip, index) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={`${chip.label}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-medium text-[#173f35]/80 shadow-sm"
                    >
                      <Icon className="h-4 w-4 text-[#b28a3c]" />
                      {chip.label}
                    </div>
                  );
                })}
              </div>

              {preferences.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {preferences.slice(0, 8).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#173f35]/8 px-3 py-1 text-xs font-semibold text-[#173f35]/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#matches"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
                >
                  {tr("request.details.viewMatches", "View matches")}
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowEdit((value) => !value)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
                >
                  <WandSparkles className="h-4 w-4 text-[#b28a3c]" />
                  {showEdit
                    ? tr("request.details.hideDetails", "Hide details")
                    : tr("request.details.improveDetails", "Improve details")}
                </button>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-[#eadfce] bg-[#173f35] p-6 text-white shadow-[0_24px_80px_rgba(23,63,53,0.16)] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    {tr("request.details.aiSummary", "AI summary")}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {request?.city || tr("request.details.germany", "Germany")}
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-[#d8b76a]" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {tr("request.details.status", "Status")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {request?.status || "draft"}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {tr("request.details.bestFor", "Best for")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {request?.service_style ||
                      request?.catering_type ||
                      tr("request.details.customCatering", "Custom catering")}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {tr("request.details.nextStep", "Next step")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/85">
                    {tr(
                      "request.details.nextStepText",
                      "Review suggested caterers or improve the brief to receive better matches."
                    )}
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {showEdit && (
            <form
              action={handleSave}
              className="mt-6 rounded-[2rem] border border-[#eadfce] bg-white/80 p-6 shadow-[0_24px_80px_rgba(23,63,53,0.08)] backdrop-blur md:p-8"
            >
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
                  {tr("request.details.editLabel", "Improve details")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173f35]">
                  {tr(
                    "request.details.editTitle",
                    "Adjust only what matters."
                  )}
                </h2>
              </div>

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

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-[#173f35]/75">
                    {tr("request.details.specialRequests", "Special requests")}
                  </span>
                  <textarea
                    name="special_requests"
                    defaultValue={request?.special_requests || ""}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 text-[#173f35] outline-none transition focus:border-[#b28a3c] focus:ring-4 focus:ring-[#b28a3c]/10"
                    placeholder={tr(
                      "request.details.specialRequestsPlaceholder",
                      "Vegetarian options, halal food, buffet style, staff, drinks..."
                    )}
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
                >
                  {tr("request.details.saveDetails", "Save details")}
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section id="matches" className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
              {tr("request.details.matchesLabel", "Caterer matches")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#173f35]">
              {hasMatches
                ? tr("request.details.matchesReady", "Your suggested caterers")
                : tr("request.details.matchesEmptyTitle", "Matching is being prepared")}
            </h2>
          </div>

          <Link
            href={buildBrowseHref(request)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
          >
            {tr("request.details.browseMarketplace", "Browse marketplace")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {hasMatches ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match: any, index: number) => {
              const caterer = match?.caterer || match?.caterers || match;
              const name =
                caterer?.business_name ||
                caterer?.name ||
                match?.business_name ||
                tr("request.details.caterer", "Caterer");

              const city = caterer?.city || match?.city || request?.city;
              const score =
                match?.score ||
                match?.match_score ||
                match?.compatibility_score ||
                null;

              return (
                <article
                  key={match?.id || caterer?.id || `${name}-${index}`}
                  className="group rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-[0_18px_60px_rgba(23,63,53,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(23,63,53,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f35] text-lg font-semibold text-white">
                      {name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-[#b28a3c]/10 px-3 py-1 text-xs font-semibold text-[#8b6a25]">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {score ? `${Math.round(Number(score))}%` : "AI match"}
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#173f35]">
                    {name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#173f35]/65">
                    {caterer?.description ||
                      match?.reason ||
                      tr(
                        "request.details.matchDescription",
                        "A potential catering partner for your event brief."
                      )}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {city && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf6ee] px-3 py-1 text-xs font-semibold text-[#173f35]/70">
                        <MapPin className="h-3.5 w-3.5 text-[#b28a3c]" />
                        {city}
                      </span>
                    )}
                    {caterer?.price_range && (
                      <span className="rounded-full bg-[#faf6ee] px-3 py-1 text-xs font-semibold text-[#173f35]/70">
                        {caterer.price_range}
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <Link
                      href={caterer?.id ? `/caterers/${caterer.id}` : "/caterers"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-[#12342c]"
                    >
                      {tr("request.details.viewCaterer", "View caterer")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#d9c8ae] bg-white/75 p-8 text-center shadow-[0_18px_60px_rgba(23,63,53,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173f35]">
              <WandSparkles className="h-7 w-7 text-[#d8b76a]" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-[#173f35]">
              {tr(
                "request.details.emptyHeading",
                "Your AI matches will appear here."
              )}
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#173f35]/65">
              {tr(
                "request.details.emptyText",
                "We are preparing this area for curated caterer recommendations. You can improve your event details or browse the marketplace now."
              )}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
              >
                <Sparkles className="h-4 w-4 text-[#d8b76a]" />
                {tr("request.details.improveBrief", "Improve brief")}
              </button>

              <Link
                href={buildBrowseHref(request)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
              >
                {tr("request.details.exploreCaterers", "Explore caterers")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
