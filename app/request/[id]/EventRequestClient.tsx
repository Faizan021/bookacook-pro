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

  const originalPrompt =
    request?.ai_query ||
    request?.special_requests ||
    "No original prompt found.";

  const budget =
    request?.budget_total || request?.budget_per_person
      ? request?.budget_total
        ? formatMoney(request.budget_total)
        : `${formatMoney(request.budget_per_person)} p.p.`
      : "Flexible budget";

  const chips = useMemo(() => {
    return [
      {
        icon: CalendarDays,
        label: request?.event_type || "Event",
      },
      {
        icon: Users,
        label: request?.guest_count
          ? `${request.guest_count} guests`
          : "Guests open",
      },
      {
        icon: MapPin,
        label: request?.city || "Location open",
      },
      {
        icon: Wallet,
        label: budget,
      },
    ];
  }, [request, budget]);

  const hasMatches = matches && matches.length > 0;

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
      <SpeiselyHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#173f35]/70 hover:text-[#173f35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          {/* LEFT */}
          <div className="rounded-3xl bg-white p-8 shadow-lg border border-[#eadfce]">
            <div className="inline-flex items-center gap-2 bg-[#173f35] text-white px-4 py-2 rounded-full text-sm">
              <Sparkles className="h-4 w-4 text-[#d6b25e]" />
              AI generated brief
            </div>

            <h1 className="mt-6 text-4xl font-semibold">
              Your catering brief is ready
            </h1>

            <p className="mt-4 text-[#5c6f68]">
              Speisely converted your idea into a structured request.
            </p>

            {/* PROMPT */}
            <div className="mt-6 p-5 bg-[#faf6ee] rounded-2xl border">
              <p className="text-xs uppercase text-[#b28a3c] mb-2">
                Original input
              </p>
              <p className="text-base">“{originalPrompt}”</p>
            </div>

            {/* CHIPS */}
            <div className="mt-6 flex flex-wrap gap-3">
              {chips.map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 text-sm"
                  >
                    <Icon className="h-4 w-4 text-[#b28a3c]" />
                    {chip.label}
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex gap-3">
              <a
                href="#matches"
                className="bg-[#173f35] text-white px-6 py-3 rounded-full flex items-center gap-2"
              >
                View matches <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => setShowEdit(!showEdit)}
                className="border px-6 py-3 rounded-full flex items-center gap-2"
              >
                <WandSparkles className="h-4 w-4" />
                Improve details
              </button>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="rounded-3xl bg-[#173f35] text-white p-6">
            <h2 className="text-xl font-semibold">AI Summary</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="opacity-60">Status</p>
                <p>{request?.status || "draft"}</p>
              </div>

              <div>
                <p className="opacity-60">Best for</p>
                <p>{request?.service_style || "Custom catering"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT FORM */}
        {showEdit && (
          <form action={handleSave} className="mt-6 bg-white p-6 rounded-3xl">
            <h3 className="text-xl mb-4">Improve details</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="city"
                placeholder="City"
                defaultValue={request?.city}
                className="p-3 border rounded-xl"
              />
              <input
                name="guest_count"
                placeholder="Guests"
                defaultValue={request?.guest_count}
                className="p-3 border rounded-xl"
              />
              <input
                name="budget_total"
                placeholder="Budget"
                defaultValue={request?.budget_total}
                className="p-3 border rounded-xl"
              />
            </div>

            <button className="mt-6 bg-[#173f35] text-white px-6 py-3 rounded-full">
              Save
            </button>
          </form>
        )}
      </section>

      {/* MATCHES */}
      <section id="matches" className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-3xl font-semibold mb-6">
          {hasMatches ? "Your matches" : "Preparing matches..."}
        </h2>

        {hasMatches ? (
          <div className="grid md:grid-cols-3 gap-6">
            {matches.map((m: any, i: number) => (
              <div key={i} className="p-6 bg-white rounded-3xl shadow">
                <h3 className="text-lg font-semibold">
                  {m?.caterer?.name || "Caterer"}
                </h3>

                <p className="text-sm mt-2 text-[#5c6f68]">
                  {m?.reason || "Great match for your event"}
                </p>

                <Link
                  href="/caterers"
                  className="mt-4 inline-flex text-sm text-[#173f35] font-semibold"
                >
                  View → 
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl text-center">
            <p>AI is preparing your matches...</p>
          </div>
        )}
      </section>
    </main>
  );
}
