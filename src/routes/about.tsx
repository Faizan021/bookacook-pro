import { createFileRoute, Link } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { UtensilsCrossed, Sparkles, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import wedding from "@/assets/caterer-wedding.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Über Speisely — Kuratiert, transparent, persönlich" },
      { name: "description", content: "Speisely verbindet Restaurant-Bestellungen, Catering und Event-Planung — kuratiert, transparent und persönlich. Made in Deutschland — für Restaurants, Caterer und Event-Profis in ganz Deutschland." },
      { property: "og:title", content: "Über Speisely" },
      { property: "og:description", content: "Restaurant-Bestellungen, Catering und Event-Planung auf einer Plattform — kuratiert und persönlich." },
      { property: "og:url", content: "/about" },
    ],
    links: [
      { rel: "preload", href: "/hero-cinematic.png", as: "image", fetchpriority: "high" },
    ],
  }),
  component: About,
});


function About() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  
  return (
    <SiteShell>
      {/* Cinematic Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32 text-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.png"
            fetchPriority="high"
            alt="About Us Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/80 to-forest/95" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 flex flex-col items-center">
          <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f2d896] shadow-xl mb-6">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4 drop-shadow-md">
            {t("ab.eyebrow")}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight drop-shadow-sm mb-6">
            {t("ab.title")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed drop-shadow-sm">
            {t("ab.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="surface-card overflow-hidden">
            <img src={wedding} alt="Banquet hall with candlelit table" className="w-full h-full object-cover" loading="lazy" width={1024} height={1024} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/60">{t("ab.conviction")}</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-display font-bold text-forest leading-tight">{t("ab.h2")}</h2>
            <p className="mt-5 text-forest/75">{t("ab.body")}</p>
            <p className="mt-4 text-forest/75 border-l-2 border-forest/20 pl-4 italic text-sm">{t("ab.body.catering")}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Value icon={<Sparkles className="h-4 w-4" />} label={t("ab.v1")} desc={t("ab.v1.desc")} />
              <Value icon={<ShieldCheck className="h-4 w-4" />} label={t("ab.v2")} desc={t("ab.v2.desc")} />
              <Value icon={<Heart className="h-4 w-4" />} label={t("ab.v3")} desc={t("ab.v3.desc")} />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Hub */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 text-center border-t border-forest/10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/60 mb-6">
          {tt("Bereiche entdecken", "Explore categories")}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/instant-order"
            onClick={() => trackEvent("about_page_cta_clicked", { destination: "/instant-order" })}
            className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition"
          >
            {t("nav.instant")}
          </Link>
          <Link
            to="/catering"
            onClick={() => trackEvent("about_page_cta_clicked", { destination: "/catering" })}
            className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition"
          >
            {t("nav.catering")}
          </Link>
          <Link
            to="/planner"
            onClick={() => trackEvent("about_page_cta_clicked", { destination: "/planner" })}
            className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition"
          >
            Event Planner
          </Link>
          <Link
            to="/blog"
            onClick={() => trackEvent("about_page_cta_clicked", { destination: "/blog" })}
            className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition"
          >
            Blog
          </Link>
          <Link
            to="/partners"
            onClick={() => trackEvent("partner_cta_clicked", { location: "about_hub_link", role: "restaurant_owner" })}
            className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition"
          >
            {t("nav.partners")}
          </Link>
        </div>
      </section>

      {/* Growth Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] p-8 sm:p-16 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-forest" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest via-[#1a2d1d] to-[#0a120c] opacity-95" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] shadow-xl">
              <Sparkles className="h-4 w-4" />
              {tt("Netzwerk", "Network")}
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight drop-shadow-lg">
              {t("ab.growth.title")}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium">
              {t("ab.growth.body")}
            </p>
            <div className="pt-6">
              <Link
                to="/partners"
                onClick={() => trackEvent("partner_cta_clicked", { location: "about_growth_section", role: "restaurant_owner" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#f2d896] text-forest px-8 py-4 text-sm font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(242,216,150,0.3)]"
              >
                {t("ab.growth.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Value({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="surface-card p-4 flex flex-col items-center gap-1 text-center">
      <span className="text-forest">{icon}</span>
      <span className="font-display font-bold text-forest">{label}</span>
      <span className="text-xs text-forest/70 leading-snug">{desc}</span>
    </div>
  );
}
