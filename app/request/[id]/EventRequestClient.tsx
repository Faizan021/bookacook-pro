"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useMemo } from "react";
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
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

type Props = {
  request: any;
  matches: any[];
  handleSave: (formData: FormData) => Promise<void>;
};

function formatEventType(value?: string) {
  if (!value) return "Noch offen";

  const map: Record<string, string> = {
    wedding: "Hochzeit",
    birthday: "Geburtstag",
    corporate: "Firmenevent",
    private_party: "Private Feier",
    ramadan: "Ramadan / Iftar",
    christmas: "Weihnachtsfeier",
  };

  return map[value] ?? value;
}

function formatCateringType(value?: string) {
  if (!value) return "Noch offen";

  const map: Record<string, string> = {
    buffet: "Buffet",
    finger_food: "Fingerfood",
    plated: "Menü am Tisch",
    live_station: "Live Station",
    bbq: "BBQ",
  };

  return map[value] ?? value;
}

function formatBudget(value?: number | null) {
  if (!value) return "Flexibles Budget";
  return `€${Number(value).toLocaleString("de-DE")}`;
}

function formatGuests(value?: number | null) {
  if (!value) return "Noch offen";
  return `${value} Gäste`;
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

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[#b28a3c]">{icon}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            {label}
          </p>
          <p className="mt-2 font-semibold text-[#173f35]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, request }: { match: any; request: any }) {
  const caterer = Array.isArray(match.caterers)
    ? match.caterers[0]
    : match.caterers;

  const score = Math.min(100, Math.round(match.match_score ?? 0));
  const browseHref = buildBrowseHref(request, caterer);

  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffaf1]">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#173f35] text-xl font-semibold text-white">
            {caterer?.business_name?.charAt(0) || "C"}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-[#173f35]">
                {caterer?.business_name || "Ausgewählter Caterer"}
              </h3>

              {caterer?.verification_status === "verified" ? (
                <span className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1 text-xs font-semibold text-[#8a6d35]">
                  Verifiziert
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5c6f68]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {caterer?.city || request?.city || "Deutschland"}
              </span>

              {caterer?.average_rating ? (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#b28a3c] text-[#b28a3c]" />
                  {Number(caterer.average_rating).toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-4 py-3 md:min-w-[140px]">
          <p className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            {score}% Match
          </p>
          <div className="mt-3 h-2 rounded-full bg-[#eadfce]">
            <div
              className="h-full rounded-full bg-[#b28a3c]"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {match.match_reasons?.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {match.match_reasons.map((reason: string) => (
            <span
              key={reason}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1.5 text-xs font-semibold text-[#173f35]"
            >
              <CheckCircle2 className="h-3 w-3 text-[#b28a3c]" />
              {reason}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 border-t border-[#eadfce] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={browseHref}
          className="text-sm font-semibold text-[#173f35] underline-offset-4 hover:underline"
        >
          Ähnliche Caterer ansehen
        </Link>

        {caterer?.id ? (
          <Link
            href={`/caterers/${caterer.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            Profil öffnen
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function EventRequestClient({
  request,
  matches,
  handleSave,
}: Props) {
  const t = useT();

  const summary = useMemo(() => {
    return {
      type: formatEventType(request.event_type),
      catering: formatCateringType(request.catering_type),
      guests: formatGuests(request.guest_count),
      budget: formatBudget(request.budget_total),
      city: request.postal_code
        ? `${request.postal_code} ${request.city || ""}`.trim()
        : request.city || "Ort noch offen",
      date: request.event_date || "Datum noch offen",
    };
  }, [request]);

  const insightPills = useMemo(() => {
    const items: string[] = [];

    if (summary.catering !== "Noch offen") items.push(summary.catering);

    (request?.dietary_requirements || []).forEach((item: string) => {
      if (!items.includes(item)) items.push(item);
    });

    (request?.cuisine_preferences || []).forEach((item: string) => {
      if (!items.includes(item)) items.push(item);
    });

    return items;
  }, [request, summary.catering]);

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Link
          href="/request/new"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("requestDetail.back", "Zurück zur Anfrage")}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t("requestDetail.badge", "Ihr Event-Briefing")}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
              {t("requestDetail.title", "Prüfen Sie Ihre Anfrage.")}
              <span className="block italic text-[#b28a3c]">
                {t("requestDetail.subtitle", "Verfeinern Sie die Details.")}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
              {t(
                "requestDetail.description",
                "Speisely hat Ihre Eventbeschreibung strukturiert. Ergänzen Sie fehlende Informationen, damit passende Caterer besser gefunden werden."
              )}
            </p>

            {request?.ai_query ? (
              <div className="mt-8 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
                  {t("requestDetail.original", "Ursprüngliche Anfrage")}
                </p>
                <blockquote className="mt-4 text-lg leading-8 text-[#173f35]">
                  “{request.ai_query}”
                </blockquote>
              </div>
            ) : null}
          </div>

          <aside className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              {t("requestDetail.summary", "Briefing-Zusammenfassung")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SummaryItem
                icon={<CheckCircle2 className="h-4 w-4" />}
                label={t("requestDetail.eventType", "Event")}
                value={summary.type}
              />
              <SummaryItem
                icon={<Users className="h-4 w-4" />}
                label={t("requestDetail.guests", "Gäste")}
                value={summary.guests}
              />
              <SummaryItem
                icon={<Wallet className="h-4 w-4" />}
                label={t("requestDetail.budget", "Budget")}
                value={summary.budget}
              />
              <SummaryItem
                icon={<MapPin className="h-4 w-4" />}
                label={t("requestDetail.location", "Ort")}
                value={summary.city}
              />
              <SummaryItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={t("requestDetail.date", "Datum")}
                value={summary.date}
              />
              <SummaryItem
                icon={<Sparkles className="h-4 w-4" />}
                label="ID"
                value={`#${String(request.id).slice(-6).toUpperCase()}`}
              />
            </div>

            {insightPills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[#eadfce] pt-5">
                {insightPills.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1.5 text-xs font-semibold text-[#173f35]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              {t("requestDetail.matches", "Passende Caterer")}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {matches.length}{" "}
              {matches.length === 1
                ? t("requestDetail.matchOne", "Partner gefunden")
                : t("requestDetail.matchMany", "Partner gefunden")}
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
              {t(
                "requestDetail.matchHelp",
                "Je genauer Ihr Briefing ist, desto besser kann Speisely später passende Caterer nach Ort, Stil und Servicegebiet vorschlagen."
              )}
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center text-sm leading-7 text-[#5c6f68]">
              {t(
                "requestDetail.noMatches",
                "Noch keine Matches vorhanden. Speichern Sie das Briefing erneut, um die Suche zu aktualisieren."
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {matches.map((match: any, idx: number) => (
                <MatchCard key={match?.id ?? idx} match={match} request={request} />
              ))}
            </div>
          )}
        </div>

        <form action={handleSave} className="space-y-6">
          <input type="hidden" name="request_id" value={request.id} />

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              01. {t("requestDetail.coreDetails", "Eventdetails")}
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              {t("requestDetail.logistics", "Logistik und Rahmen")}
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.eventType", "Event")}
                </label>
                <select
                  name="event_type"
                  defaultValue={request.event_type || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                >
                  <option value="">Auswählen...</option>
                  <option value="wedding">Hochzeit</option>
                  <option value="birthday">Geburtstag</option>
                  <option value="corporate">Firmenevent</option>
                  <option value="private_party">Private Feier</option>
                  <option value="ramadan">Ramadan / Iftar</option>
                  <option value="christmas">Weihnachtsfeier</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.cateringFormat", "Catering-Format")}
                </label>
                <select
                  name="catering_type"
                  defaultValue={request.catering_type || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                >
                  <option value="">Auswählen...</option>
                  <option value="buffet">Buffet</option>
                  <option value="finger_food">Fingerfood</option>
                  <option value="plated">Menü am Tisch</option>
                  <option value="live_station">Live Station</option>
                  <option value="bbq">BBQ</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.guests", "Gäste")}
                </label>
                <input
                  type="number"
                  name="guest_count"
                  defaultValue={request.guest_count || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.budgetTotal", "Budget gesamt (€)")}
                </label>
                <input
                  type="number"
                  name="budget_total"
                  defaultValue={request.budget_total || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.city", "Stadt")}
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={request.city || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.postalCode", "Postleitzahl")}
                </label>
                <input
                  type="text"
                  name="postal_code"
                  defaultValue={request.postal_code || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.date", "Datum")}
                </label>
                <input
                  type="date"
                  name="event_date"
                  defaultValue={request.event_date || ""}
                  className="mt-2 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm outline-none focus:border-[#c9a45c]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              02. {t("requestDetail.foodDirection", "Kulinarische Richtung")}
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              {t("requestDetail.foodTitle", "Küche, Ernährung und Extras")}
            </h3>

            <div className="mt-6 space-y-6">
              <CheckboxGroup
                title={t("requestDetail.cuisine", "Küchenrichtung")}
                name="cuisine_preferences"
                selected={request.cuisine_preferences || []}
                options={[
                  "Turkish",
                  "Mediterranean",
                  "Italian",
                  "Arabic",
                  "German",
                  "BBQ",
                  "Vegan",
                  "Fine Dining",
                ]}
              />

              <CheckboxGroup
                title={t("requestDetail.dietary", "Ernährung")}
                name="dietary_requirements"
                selected={request.dietary_requirements || []}
                options={[
                  "Vegetarian",
                  "Vegan",
                  "Halal",
                  "Gluten-free",
                  "Lactose-free",
                  "Kosher",
                ]}
              />

              <CheckboxGroup
                title={t("requestDetail.extras", "Zusatzleistungen")}
                name="extra_services"
                selected={request.extra_services || []}
                options={[
                  "Staff",
                  "Tableware",
                  "Delivery",
                  "Setup",
                  "Drinks",
                  "Live Cooking",
                ]}
              />

              <div>
                <label className="text-sm font-semibold text-[#173f35]">
                  {t("requestDetail.specialRequests", "Besondere Wünsche")}
                </label>
                <textarea
                  name="special_requests"
                  defaultValue={request.special_requests || ""}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-4 text-sm leading-7 outline-none focus:border-[#c9a45c]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            {t("requestDetail.save", "Briefing speichern und Matches aktualisieren")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
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
    <div>
      <label className="text-sm font-semibold text-[#173f35]">{title}</label>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="peer hidden"
            />
            <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-3 text-center text-xs font-semibold text-[#173f35] transition peer-checked:border-[#b28a3c] peer-checked:bg-[#f4ead7] peer-checked:text-[#8a6d35]">
              {option}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
