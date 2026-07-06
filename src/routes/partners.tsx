import { createFileRoute, Link } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { ArrowRight, Users, CalendarCheck, BarChart3 } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { TrustSection } from "@/components/TrustSection";
import capacity from "@/assets/capacity-diorama.jpg";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Für Partner — Restaurants, Caterer & Event-Planer · Speisely" },
      { name: "description", content: "Speisely bringt Restaurants, Caterer und Event-Planer mit den richtigen Gästen zusammen — von spontanen Bestellungen bis zu großen Firmenevents." },
      { property: "og:title", content: "Für Partner — Speisely" },
      { property: "og:description", content: "Wachse mit Speisely: erreiche neue Gäste für Bestellungen, Catering und Events." },
      { property: "og:url", content: "/partners" },
    ],
    links: [{ rel: "canonical", href: "/partners" }],
  }),
  component: Partners,
});


function Partners() {
  const { t, lang } = useI18n();
  return (
    <SiteShell>
      <section className="relative overflow-hidden min-h-screen flex items-center -mt-20 lg:-mt-24 pt-36 pb-24 lg:pt-44 lg:pb-36">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.png"
            alt="Partners Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] mb-3 drop-shadow-md">
              {t("p.eyebrow")}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
              {lang === "de" ? "Wachse mit Speisely" : "Grow with Speisely"}
            </span>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[0.95] drop-shadow-sm"
              dangerouslySetInnerHTML={{ __html: t("p.title") }}
            />
            <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed drop-shadow-sm">
              {t("p.subtitle")}
            </p>
            <Link to="/auth" search={{ signup: "partner", message: undefined, logout: undefined }} onClick={() => trackEvent("partner_cta_clicked", { location: "partners_hero", role: "restaurant_owner" })} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-8 py-4 text-sm font-bold shadow-xl shadow-[#b28a3c]/20 transition-all hover:bg-[#9a7633] hover:scale-105">
              {t("p.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] group">
            <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80" alt="Chef preparing food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 flex items-center gap-3">
              <div className="p-2 bg-[#b28a3c]/20 rounded-lg text-[#f2d896]">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-[12px] font-bold text-white leading-none">
                <div>{lang === "de" ? "Neue Kunden" : "New Customers"}</div>
                <div className="text-[10px] text-white/60 font-medium mt-1">{lang === "de" ? "Erreiche tausende Gäste" : "Reach thousands of guests"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Advantages */}
      <TrustSection
        badgeText={lang === "de" ? "DEINE VORTEILE" : "YOUR ADVANTAGES"}
        headline={lang === "de" ? "Warum Partner werden?" : "Why become a partner?"}
        items={[
          {
            icon: Users,
            title: t("p.f1.title"),
            description: t("p.f1.body"),
          },
          {
            icon: CalendarCheck,
            title: t("p.f2.title"),
            description: t("p.f2.body"),
          },
          {
            icon: BarChart3,
            title: t("p.f3.title"),
            description: t("p.f3.body"),
          },
        ]}
      />

      {/* Premium Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-forest">{t("p.f4.title")}</h2>
          <p className="mt-3 text-forest/70">
            {t("Wähle das Modell, das am besten zu deinem Unternehmen passt. Keine Einrichtungsgebühr, jederzeit kündbar.", 
               "Choose the model that fits your business best. No setup fees, cancel anytime.")}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Card 1: Restaurant Plan */}
          <div className="surface-card overflow-hidden flex flex-col justify-between border-2 border-[oklch(0.88_0.06_152)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[oklch(0.88_0.06_152)] text-forest px-3 py-1 rounded-full">
                  {t("Starter Paket", "Starter Plan")}
                </span>
                <span className="text-xs text-forest/60 font-semibold">{t("Für Restaurants", "For Restaurants")}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl text-forest">{t("Direktbestellungen", "Direct Ordering")}</h3>
              <p className="mt-2 text-sm text-forest/70 min-h-[40px] font-medium">
                {t("Kostenlose Kontoerstellung. 0% Provision. 100% Deins.", 
                   "Free account creation. 0% commission. 100% yours.")}
              </p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold font-display text-forest">€34.99</span>
                <span className="text-forest/60 ml-2">/ {t("Monat", "month")}</span>
              </div>
              
              <div className="mt-4 inline-block text-xs font-bold text-[#b28a3c] bg-[#b28a3c]/15 px-3 py-1.5 rounded-lg border border-[#b28a3c]/20">
                ⭐ {t("Keine versteckten Gebühren", "No hidden fees")}
              </div>
              
              <ul className="mt-8 space-y-4 text-sm text-forest/80">
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Eigene Website unter speisely.de/ihr-name", "Your own website under speisely.de/your-name")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Unbegrenzte Direktbestellungen & Tischreservierungen", "Unlimited direct orders & table reservations")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Kostenloser Eintrag im Instant Food Order Entdeckungsportal", "Free listing in the Instant Food Order discovery directory")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Kitchen Display System (KDS) für das Bestellmanagement", "Kitchen Display System (KDS) for order management")}</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-cream/30 border-t border-[#eadfce]/30">
              <Link to="/auth" search={{ signup: "partner", message: undefined, logout: undefined }} onClick={() => trackEvent("partner_cta_clicked", { location: "partners_restaurant_card", role: "restaurant_owner" })} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity shadow-md">
                {t("Jetzt starten", "Get Started")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Catering & Event Planner */}
          <div className="surface-card overflow-hidden flex flex-col justify-between border-2 border-[#eadfce] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#eadfce] text-forest px-3 py-1 rounded-full">
                  {t("Marktplatz", "Marketplace")}
                </span>
                <span className="text-xs text-forest/60 font-semibold">{t("Für Caterer & Planer", "For Caterers & Planners")}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl text-forest">{t("Catering & Events", "Catering & Events")}</h3>
              <p className="mt-2 text-sm text-forest/70 min-h-[40px]">
                {t("Erhalte qualifizierte B2B- & B2C-Eventanfragen über den Marktplatz.", 
                   "Receive qualified B2B & B2C event briefs via the marketplace.")}
              </p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-bold font-display text-forest">10%</span>
                <span className="text-forest/60 ml-2">{t("Vermittlungsprovision", "commission per booking")}</span>
              </div>
              
              <div className="mt-4 inline-block text-xs font-bold text-forest/60 bg-cream/70 px-3 py-1.5 rounded-lg border border-[#eadfce]/50">
                💼 {t("Keine monatliche Grundgebühr", "No fixed monthly fees")}
              </div>
              
              <ul className="mt-8 space-y-4 text-sm text-forest/80">
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Zugang zu hochvolumigen Firmen- und Hochzeits-Leads", "Access to high-volume corporate and wedding leads")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Eigene interaktive Zeitleiste & CRM für Event-Logistik", "Dedicated interactive timeline & CRM for event logistics")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Direktes Messaging & Angebots-Erstellung im Portal", "Direct messaging & proposal building inside the portal")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Blackout-Kalender zur Steuerung der Kapazitäten", "Blackout calendars to manage busy dates")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.6_0.15_152)]">✓</span>
                  <span>{t("Sichere Anzahlungs-Abwicklung (10% Anzahlung)", "Secure deposit processing (10% deposit)")}</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-cream/30 border-t border-[#eadfce]/30">
              <Link to="/auth" search={{ signup: "caterer", message: undefined, logout: undefined }} onClick={() => trackEvent("partner_cta_clicked", { location: "partners_caterer_card", role: "caterer" })} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity shadow-md">
                {t("Caterer / Planer Registrierung", "Caterer / Planner Registration")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20">
        <div className="rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-10 lg:p-16 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">{t("p.ready.title")}</h2>
            <p className="mt-3 opacity-80 max-w-xl">{t("p.ready.body")}</p>
          </div>
          <Link to="/auth" search={{ signup: "partner", message: undefined, logout: undefined }} onClick={() => trackEvent("partner_cta_clicked", { location: "partners_ready_banner", role: "restaurant_owner" })} className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-6 py-3.5 text-sm font-medium hover:opacity-90">
            {t("p.ready.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Supporting Links */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link to="/about" className="font-semibold text-forest hover:text-[#b28a3c] underline decoration-2 underline-offset-4 transition-colors">
            {t("p.learn.mission")}
          </Link>
          <span className="text-forest/30">|</span>
          <Link to="/blog" className="font-semibold text-forest hover:text-[#b28a3c] underline decoration-2 underline-offset-4 transition-colors">
            {t("p.learn.blog")}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
