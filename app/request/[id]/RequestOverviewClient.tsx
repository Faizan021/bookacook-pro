"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  WandSparkles,
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

type Props = {
  request: any;
};

function formatMoney(value?: number | null) {
  if (!value) return "";
  return `€${Number(value).toLocaleString("de-DE")}`;
}

function safeArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return [value];
  return [];
}

function calculateConfidence(request: any) {
  let score = 20;

  if (request?.event_type) score += 15;
  if (request?.guest_count) score += 15;
  if (request?.city) score += 15;
  if (request?.budget_total || request?.budget_per_person) score += 10;
  if (request?.catering_type || request?.service_style) score += 10;
  if (safeArray(request?.dietary_requirements).length > 0) score += 8;
  if (safeArray(request?.cuisine_preferences).length > 0) score += 7;

  return Math.min(score, 96);
}

function getMissingQuestions(request: any) {
  const questions: string[] = [];

  if (!request?.event_date) {
    questions.push("Wann findet Ihr Event statt?");
  }

  if (!request?.budget_total && !request?.budget_per_person) {
    questions.push("Haben Sie ein Budget pro Person?");
  }

  if (!request?.venue_type) {
    questions.push("Findet das Event drinnen, draußen oder in einer Location statt?");
  }

  if (!request?.catering_type) {
    questions.push("Wünschen Sie Buffet, Fingerfood, Menü oder Live-Cooking?");
  }

  if (safeArray(request?.extra_services).length === 0) {
    questions.push("Benötigen Sie Servicepersonal, Getränke oder Geschirr?");
  }

  return questions.slice(0, 4);
}

export default function RequestOverviewClient({ request }: Props) {
  const t = useT();

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

  const confidence = useMemo(() => calculateConfidence(request), [request]);
  const missingQuestions = useMemo(() => getMissingQuestions(request), [request]);

  const preferences = [
    ...safeArray(request?.cuisine_preferences),
    ...safeArray(request?.dietary_requirements),
    ...safeArray(request?.extra_services),
  ];

  const chips = useMemo(() => {
    return [
      {
        icon: CalendarDays,
        label:
          request?.event_type ||
          request?.catering_type ||
          tr("request.details.eventType", "Event type open"),
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
  }, [request, budget]);

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden border-b border-[#eadfce]">
        <div className="absolute left-[-12%] top-[-25%] h-96 w-96 rounded-full bg-[#b28a3c]/10 blur-3xl" />
        <div className="absolute right-[-8%] top-20 h-[28rem] w-[28rem] rounded-full bg-[#173f35]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-10">
          <Link
            href="/customer"
            className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/70 px-4 py-2 text-sm font-semibold text-[#173f35]/75 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {tr("request.details.backToDashboard", "Back to dashboard")}
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.82fr]">
            <div className="rounded-[2rem] border border-[#eadfce] bg-white/80 p-6 shadow-[0_24px_80px_rgba(23,63,53,0.08)] backdrop-blur md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-4 py-2 text-sm font-semibold text-[#fbf7ef]">
                  <Sparkles className="h-4 w-4 text-[#d8b76a]" />
                  {tr("request.details.aiUnderstood", "AI understood your event")}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[#faf6ee] px-4 py-2 text-sm font-semibold text-[#8a6d35]">
                  KI-Verständnis: {confidence}%
                </div>
              </div>

              <h1 className="premium-heading mt-5 max-w-3xl text-4xl leading-[0.95] text-[#173f35] sm:text-5xl lg:text-[3.7rem]">
                {tr("request.details.title", "Your AI catering brief is ready.")}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[#173f35]/70">
                Speisely hat Ihre Anfrage analysiert, wichtige Eventdetails erkannt
                und bereitet passende Caterer-Matches vor.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
                  {tr("request.details.originalPrompt", "Original prompt")}
                </p>
                <p className="text-base leading-7 text-[#173f35]">
                  “{originalPrompt}”
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {chips.map((chip, index) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={`${chip.label}-${index}`}
                      className="rounded-[1.25rem] border border-[#eadfce] bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#b28a3c]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
                          {index === 0
                            ? "Event"
                            : index === 1
                              ? "Gäste"
                              : index === 2
                                ? "Ort"
                                : "Budget"}
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#173f35]">
                        {chip.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {preferences.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
                    Erkannte Wünsche
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.slice(0, 8).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#173f35]/8 px-3 py-1 text-xs font-semibold text-[#173f35]/75"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#d8ccb9] bg-white/70 p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-1 h-5 w-5 text-[#b28a3c]" />
                  <div>
                    <p className="font-semibold text-[#173f35]">
                      Speisely würde noch fragen:
                    </p>

                    {missingQuestions.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#173f35]/70">
                        {missingQuestions.map((question) => (
                          <li key={question}>• {question}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-[#173f35]/70">
                        Ihr Briefing ist stark genug für erste Caterer-Matches.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/request/${request.id}/matches`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
                >
                  {tr("request.details.viewMatches", "KI-Matches ansehen")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`/request/${request.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
                >
                  <WandSparkles className="h-4 w-4 text-[#b28a3c]" />
                  Details verbessern
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-[#eadfce] bg-[#173f35] p-6 text-white shadow-[0_24px_80px_rgba(23,63,53,0.16)] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    KI-Zusammenfassung
                  </p>
                  <h2 className="premium-heading mt-1 text-3xl text-white">
                    {request?.city || tr("request.details.germany", "Germany")}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-[#d8b76a]" />
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  AI confidence
                </p>
                <div className="mt-3 h-2 rounded-full bg-white/15">
                  <div
                    className="h-2 rounded-full bg-[#d8b76a]"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold">{confidence}% understood</p>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {request?.status || "draft"}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Am besten für
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {request?.service_style ||
                      request?.catering_type ||
                      tr("request.details.customCatering", "Custom catering")}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Nächster Schritt
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/85">
                    Speisely vergleicht jetzt Caterer nach Ort, Gästezahl,
                    Catering-Stil, Budget und Ernährungswünschen.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
