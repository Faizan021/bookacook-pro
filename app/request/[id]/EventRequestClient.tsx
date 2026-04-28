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

export default function EventRequestClient({
  request,
  matches,
  handleSave,
}: Props) {
  const t = useT();
  const [showEdit, setShowEdit] = useState(false);

  const eventTypeMap: Record<string, string> = {
    wedding: t("event.wedding", "Wedding"),
    birthday: t("event.birthday", "Birthday"),
    corporate: t("event.corporate", "Corporate event"),
    private_party: t("event.privateParty", "Private party"),
    ramadan: t("event.ramadan", "Ramadan / Iftar"),
    christmas: t("event.christmas", "Christmas party"),
  };

  const cateringMap: Record<string, string> = {
    buffet: t("catering.buffet", "Buffet"),
    finger_food: t("catering.fingerFood", "Finger food"),
    plated: t("catering.plated", "Plated menu"),
    live_station: t("catering.liveStation", "Live station"),
    bbq: t("catering.bbq", "BBQ"),
  };

  const summary = useMemo(() => {
    return {
      type:
        eventTypeMap[request.event_type] ||
        request.event_type ||
        t("common.open", "Open"),
      catering:
        cateringMap[request.catering_type] ||
        request.catering_type ||
        t("common.open", "Open"),
      guests: request.guest_count
        ? `${request.guest_count} ${t("common.guests", "guests")}`
        : t("common.open", "Open"),
      budget:
        formatMoney(request.budget_total) ||
        formatMoney(request.budget_per_person) ||
        t("request.flexibleBudget", "Flexible budget"),
      city: request.postal_code
        ? `${request.postal_code} ${request.city || ""}`.trim()
        : request.city || t("request.locationOpen", "Location open"),
      date: request.event_date || t("request.dateOpen", "Date open"),
    };
  }, [request, t]);

  const aiPills = [
    summary.type,
    summary.guests,
    summary.city,
    summary.budget,
    summary.catering,
    ...(request.dietary_requirements || []),
    ...(request.cuisine_preferences || []),
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <Link
          href="/request/new"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("request.back", "Back to request")}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t("request.aiBadge", "AI event briefing")}
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
              {t("request.reviewTitle", "AI understood your event.")}
              <span className="block italic text-[#b28a3c]">
                {t("request.reviewSubtitle", "Now review the match brief.")}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5c6f68]">
              {t(
                "request.reviewDesc",
                "Speisely converted your description into a structured catering brief. You can continue with matches or quickly adjust the key details."
              )}
            </p>

            {request?.ai_query ? (
              <div className="mt-6 rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
                  {t("request.originalPrompt", "Original prompt")}
                </p>
                <p className="mt-3 text-base leading-7 text-[#173f35]">
                  “{request.ai_query}”
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {aiPills.slice(0, 10).map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-semibold text-[#173f35] shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              {t("request.aiSummary", "AI summary")}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryItem icon={<CheckCircle2 />} label={t("request.event", "Event")} value={summary.type} />
              <SummaryItem icon={<Users />} label={t("request.guests", "Guests")} value={summary.guests} />
              <SummaryItem icon={<MapPin />} label={t("request.location", "Location")} value={summary.city} />
              <SummaryItem icon={<Wallet />} label={t("request.budget", "Budget")} value={summary.budget} />
              <SummaryItem icon={<Sparkles />} label={t("request.style", "Style")} value={summary.catering} />
              <SummaryItem icon={<CalendarDays />} label={t("request.date", "Date")} value={summary.date} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowEdit((v) => !v)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#d8ccb9] bg-[#faf6ee] px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7]"
              >
                <WandSparkles className="h-4 w-4" />
                {showEdit
                  ? t("request.hideEdit", "Hide details")
                  : t("request.improve", "Improve details")}
              </button>

              <Link
                href={buildBrowseHref(request)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                {t("request.browse", "Browse caterers")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
                {t("request.matches", "Matched caterers")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#173f35]">
                {matches.length > 0
                  ? t("request.matchesFound", "{{count}} matches found").replace(
                      "{{count}}",
                      String(matches.length)
                    )
                  : t("request.noMatchesTitle", "No strong matches yet")}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                {matches.length > 0
                  ? t(
                      "request.matchesDesc",
                      "These caterers are suggested based on your location, budget, style and requirements."
                    )
                  : t(
                      "request.noMatchesDesc",
                      "Try widening the budget, changing the city, or browsing caterers manually while Speisely improves the match."
                    )}
              </p>
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] p-6">
              <p className="font-semibold text-[#173f35]">
                {t("request.aiSuggestion", "AI suggestion")}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                {t(
                  "request.aiSuggestionText",
                  "Add a clearer event date, increase budget flexibility, or select nearby Berlin areas to improve results."
                )}
              </p>
              <Link
                href={buildBrowseHref(request)}
                className="mt-4 inline-flex rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white"
              >
                {t("request.browseManually", "Browse caterers manually")}
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {matches.map((match: any, idx: number) => (
                <MatchCard
                  key={match?.id ?? idx}
                  match={match}
                  request={request}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>

        <form
          action={handleSave}
          className={showEdit ? "block space-y-5" : "hidden lg:block"}
        >
          <input type="hidden" name="request_id" value={request.id} />

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              {t("request.quickEdit", "Quick edit")}
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#173f35]">
              {t("request.refineBrief", "Refine the brief")}
            </h3>

            <div className="mt-5 grid gap-4">
              <Input label={t("request.city", "City")} name="city" defaultValue={request.city || ""} />
              <Input label={t("request.postalCode", "Postal code")} name="postal_code" defaultValue={request.postal_code || ""} />
              <Input label={t("request.guests", "Guests")} name="guest_count" type="number" defaultValue={request.guest_count || ""} />
              <Input label={t("request.budgetTotal", "Total budget (€)")} name="budget_total" type="number" defaultValue={request.budget_total || ""} />

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("request.specialRequests", "Special requests")}
                </label>
                <textarea
                  name="special_requests"
                  defaultValue={request.special_requests || ""}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm leading-7 outline-none focus:border-[#c9a45c]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
            >
              {t("request.saveUpdate", "Save and update matches")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[#b28a3c] [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            {label}
          </p>
          <p className="mt-1.5 font-semibold text-[#173f35]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string | number;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#173f35]">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
      />
    </div>
  );
}

function MatchCard({ match, request, t }: { match: any; request: any; t: any }) {
  const caterer = Array.isArray(match.caterers)
    ? match.caterers[0]
    : match.caterers;

  const score = Math.min(100, Math.round(match.match_score ?? 0));
  const verified =
    caterer?.verification_status === "verified" ||
    caterer?.verification_status === "approved";

  return (
    <div className="rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#173f35]">
            {caterer?.business_name || t("request.selectedCaterer", "Selected caterer")}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5c6f68]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {caterer?.city || request?.city || "Germany"}
            </span>

            {caterer?.average_rating ? (
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#b28a3c] text-[#b28a3c]" />
                {Number(caterer.average_rating).toFixed(1)}
              </span>
            ) : null}

            {verified ? (
              <span className="rounded-full border border-[#eadfce] bg-white px-2.5 py-1 text-xs font-semibold text-[#8a6d35]">
                {t("common.verified", "Verified")}
              </span>
            ) : null}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            {score}% {t("request.match", "match")}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={buildBrowseHref(request)}
          className="text-sm font-semibold text-[#173f35] underline-offset-4 hover:underline"
        >
          {t("request.viewSimilar", "View similar caterers")}
        </Link>

        {caterer?.id ? (
          <Link
            href={`/caterers/${caterer.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            {t("request.openProfile", "Open profile")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
