"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
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

  const chips = useMemo(() => {
    return [
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
  }, [request, budget]);

  const preferences = [
    ...safeArray(request?.cuisine_preferences),
    ...safeArray(request?.dietary_requirements),
    ...safeArray(request?.extra_services),
  ];

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

              <h1 className="premium-heading max-w-3xl text-4xl leading-[0.95] text-[#173f35] sm:text-5xl lg:text-6xl">
                {tr("request.details.title", "Your catering brief is ready.")}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#173f35]/70">
                {tr(
                  "request.details.subtitle",
                  "Speisely converted your event idea into a clean brief. Continue to matches or improve the details."
                )}
              </p>

              <div className="mt-7 rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-5">
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
                <Link
                  href={`/request/${request.id}/matches`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
                >
                  {tr("request.details.viewMatches", "View matches")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`/request/${request.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
                >
                  <WandSparkles className="h-4 w-4 text-[#b28a3c]" />
                  {tr("request.details.improveDetails", "Improve details")}
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-[#eadfce] bg-[#173f35] p-6 text-white shadow-[0_24px_80px_rgba(23,63,53,0.16)] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    {tr("request.details.aiSummary", "AI summary")}
                  </p>
                  <h2 className="premium-heading mt-1 text-3xl text-white">
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
        </div>
      </section>
    </main>
  );
}
