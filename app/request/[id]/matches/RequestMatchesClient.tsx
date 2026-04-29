"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

type Props = {
  request: any;
  matches: any[];
  regenerateMatches: () => Promise<void>;
};

function buildBrowseHref(request: any) {
  const params = new URLSearchParams();

  if (request?.city) params.set("city", request.city);
  if (request?.special_requests || request?.ai_query) {
    params.set("q", request.special_requests || request.ai_query);
  }

  const queryString = params.toString();
  return queryString ? `/caterers?${queryString}` : "/caterers";
}

export default function RequestMatchesClient({
  request,
  matches,
  regenerateMatches,
}: Props) {
  const t = useT();

  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const hasMatches = Array.isArray(matches) && matches.length > 0;

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
      <SpeiselyHeader />

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/request/${request.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/80 px-4 py-2 text-sm font-semibold text-[#173f35]/75 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {tr("request.matches.backToBrief", "Back to brief")}
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/request/${request.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
            >
              {tr("request.matches.improveDetails", "Improve details")}
            </Link>

            <form action={regenerateMatches}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
              >
                <WandSparkles className="h-4 w-4 text-[#d8b76a]" />
                {tr("request.matches.generateMatches", "Generate AI matches")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-[2.25rem] border border-[#eadfce] bg-white/85 p-6 shadow-[0_24px_80px_rgba(23,63,53,0.08)] backdrop-blur md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
            {tr("request.matches.label", "AI caterer matches")}
          </p>

          <h1 className="premium-heading mt-3 max-w-3xl text-5xl leading-[0.95] text-[#173f35] md:text-6xl">
            {hasMatches
              ? tr("request.matches.readyTitle", "Your suggested caterers")
              : tr("request.matches.emptyTitle", "Your AI matches are almost ready")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#173f35]/70">
            {hasMatches
              ? tr(
                  "request.matches.readySubtitle",
                  "These recommendations are based on your event brief, location, guest count, budget and preferences."
                )
              : tr(
                  "request.matches.emptySubtitle",
                  "Speisely has created your event brief. Generate AI matches to find suitable caterers, or explore the marketplace directly."
                )}
          </p>
        </div>

        <section className="mt-8">
          {hasMatches ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match: any, index: number) => {
                const caterer = match?.caterer || match?.caterers || match;

                const name =
                  caterer?.business_name ||
                  caterer?.name ||
                  match?.business_name ||
                  tr("request.matches.caterer", "Caterer");

                const city = caterer?.city || match?.city || request?.city;

                const score =
                  match?.score ||
                  match?.match_score ||
                  match?.compatibility_score ||
                  null;

                const reasons = Array.isArray(match?.match_reasons)
                  ? match.match_reasons
                  : [];

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
                        {score
                          ? `${Math.round(Number(score))}% ${tr(
                              "request.matches.match",
                              "match"
                            )}`
                          : tr("request.matches.aiMatch", "AI match")}
                      </div>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-[#173f35]">
                      {name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#173f35]/65">
                      {caterer?.description ||
                        tr(
                          "request.matches.matchDescription",
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

                      {caterer?.is_featured && (
                        <span className="rounded-full bg-[#b28a3c]/10 px-3 py-1 text-xs font-semibold text-[#8b6a25]">
                          {tr("request.matches.featured", "Featured")}
                        </span>
                      )}
                    </div>

                    {reasons.length > 0 && (
                      <div className="mt-5 space-y-2">
                        {reasons.slice(0, 3).map((reason: string) => (
                          <div
                            key={reason}
                            className="rounded-2xl bg-[#faf6ee] px-3 py-2 text-xs font-medium leading-5 text-[#173f35]/70"
                          >
                            {reason}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <Link
                        href={
                          caterer?.id ? `/caterers/${caterer.id}` : "/caterers"
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-[#12342c]"
                      >
                        {tr("request.matches.viewCaterer", "View caterer")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2.25rem] border border-dashed border-[#d9c8ae] bg-white/85 p-8 text-center shadow-[0_18px_60px_rgba(23,63,53,0.06)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173f35]">
                <Sparkles className="h-7 w-7 text-[#d8b76a]" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#b28a3c]">
                {tr("request.matches.aiWorking", "AI matching")}
              </p>

              <h2 className="premium-heading mt-2 text-4xl text-[#173f35]">
                {tr(
                  "request.matches.emptyHeading",
                  "Your AI matches will appear here."
                )}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#173f35]/65">
                {tr(
                  "request.matches.emptyText",
                  "Generate matches from your event brief, or explore caterers while Speisely prepares stronger recommendations."
                )}
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <form action={regenerateMatches}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173f35]/15 transition hover:-translate-y-0.5 hover:bg-[#12342c]"
                  >
                    <WandSparkles className="h-4 w-4 text-[#d8b76a]" />
                    {tr("request.matches.generateMatches", "Generate AI matches")}
                  </button>
                </form>

                <Link
                  href={buildBrowseHref(request)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
                >
                  {tr("request.matches.exploreCaterers", "Explore caterers")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
