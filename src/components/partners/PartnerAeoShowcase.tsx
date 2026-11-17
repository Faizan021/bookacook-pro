import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Bot,
  Search,
  ArrowRight,
  CheckCircle2,
  Globe,
  FileCode2,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { trackEvent } from "@/utils/posthog";

export function PartnerAeoShowcase() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const pillars = [
    {
      icon: Bot,
      badge: isDe ? "AEO & LLMs.txt" : "AEO & LLMs.txt",
      title: isDe ? "Präsenz in ChatGPT & Perplexity" : "Presence in ChatGPT & Perplexity",
      description: isDe
        ? "Deine Menüs, Buffets und Preise werden in maschinenlesbaren llms.txt- und Schema-Strukturen hinterlegt, damit KI-Modelle deine Küche direkt zitieren."
        : "Your menus, buffets, and prices are encoded in machine-readable llms.txt and schema structures so AI models quote your kitchen directly.",
    },
    {
      icon: Search,
      badge: isDe ? "Google AI Overviews" : "Google AI Overviews",
      title: isDe ? "Top-Platzierung in Google KI" : "Top Placement in Google AI",
      description: isDe
        ? "Google platziert KI-Antworten über den Suchergebnissen. Speisely strukturiert deine Speisen so, dass du in den hervorgehobenen KI-Karten landest."
        : "Google positions AI answers above search results. Speisely structures your dishes so you land in highlighted AI snippets.",
    },
    {
      icon: Globe,
      badge: isDe ? "Eigene AEO-Website" : "Custom AEO Website",
      title: isDe ? "Individueller Webauftritt" : "Your Own Branded Website",
      description: isDe
        ? "Du willst eine eigene Domain (wie partyservicekuepper.de)? Wir bauen deine High-Speed Website mit integrierter KI-Sichtbarkeit und 0% Provision."
        : "Want your own domain? We build your high-speed custom website with built-in AI visibility and 0% commission.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
      <div className="surface-card rounded-3xl border-2 border-[#b28a3c]/30 p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#fcfbf7] via-white to-[#f6f2e9]">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6B84A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/20 text-[#9a7633] px-3.5 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isDe ? "AEO & KI-Suchmaschinen 2026" : "AEO & AI Search 2026"}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight">
            {isDe ? (
              <>
                Wird dein Restaurant von <span className="text-[#b28a3c]">ChatGPT & Google AI</span>{" "}
                empfohlen?
              </>
            ) : (
              <>
                Is your restaurant recommended by{" "}
                <span className="text-[#b28a3c]">ChatGPT & Google AI</span>?
              </>
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed">
            {isDe
              ? "Firmenkunden und Event-Planer suchen heute nicht mehr mühsam auf Google – sie fragen KI-Assistenten nach dem besten Catering. 95% aller Gastronomie-Websites sind für KI unsichtbar. Mit Speisely machst du deine Küche zum bevorzugten Treffer in deiner Region."
              : "Corporate clients and event planners no longer just browse traditional search engines — they ask AI assistants for recommendations. 95% of food websites are invisible to AI. Speisely makes your kitchen the preferred recommendation in your area."}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid gap-6 md:grid-cols-3 relative z-10 mb-12">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white p-6 sm:p-8 border border-forest/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-forest/5 text-[#b28a3c] grid place-items-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest/60 bg-cream px-2.5 py-1 rounded-full border border-forest/10">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-forest mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Callout & CTAs */}
        <div className="relative z-10 pt-8 border-t border-forest/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-forest/80">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />{" "}
              {isDe
                ? "Inklusive in der Speisely Partnerschaft"
                : "Included in Speisely Partnership"}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />{" "}
              {isDe
                ? "Individuelle Webseiten & Audits verfügbar"
                : "Custom websites & audits available"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              to="/partner/webseiten"
              onClick={() =>
                trackEvent("partner_aeo_showcase_clicked", {
                  action: "view_webseiten_service",
                  lang,
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-forest/20 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-forest hover:bg-cream transition shadow-sm"
            >
              <Globe className="h-4 w-4 text-[#b28a3c]" />
              {isDe ? "Eigene Website & Audit ansehen" : "Explore Custom Websites & Audit"}
            </Link>

            <Link
              to="/auth"
              search={{ signup: "partner", message: undefined, logout: undefined }}
              onClick={() =>
                trackEvent("partner_aeo_showcase_clicked", {
                  action: "signup_partner_aeo",
                  lang,
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-forest/20 hover:bg-forest/90 transition"
            >
              {isDe ? "Jetzt Partner werden" : "Join as a Partner"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
