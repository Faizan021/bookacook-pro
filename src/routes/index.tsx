import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShoppingBag,
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  ChevronRight,
  Star,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Speisely – Restaurants, Catering & Event-Planung finden" },
      {
        name: "description",
        content:
          "Speisely ist der Premium-Marktplatz für Restaurants, Catering und Event-Planung. Finde den richtigen Partner für dein Essen, dein Event oder dein Catering-Projekt.",
      },
      { property: "og:title", content: "Speisely – Restaurants, Catering & Event-Planung finden" },
      {
        property: "og:description",
        content:
          "Speisely ist der Premium-Marktplatz für Restaurants, Catering und Event-Planung. Finde den richtigen Partner für dein Essen, dein Event oder dein Catering-Projekt.",
      },
      { property: "og:image", content: "https://speisely.de/og-default.jpg" },
      { property: "og:url", content: "https://speisely.de/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preload", href: "/hero-cinematic.png", as: "image", fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Speisely",
          url: "https://speisely.de/",
          description: "Speisely ist der Premium-Marktplatz für Restaurants, Catering und Event-Planung."
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [mounted, setMounted] = useState(false);
  const [activeVertical, setActiveVertical] = useState<"restaurant" | "catering" | "planner">("catering");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const verticals = [
    {
      key: "restaurant" as const,
      emoji: "🍽️",
      label: tt("Restaurants", "Restaurants"),
      sublabel: tt("Sofort bestellen", "Order now"),
      to: "/instant-order" as const,
      trackKey: "instant_order_cta_clicked",
      cta: tt("Restaurants entdecken", "Discover restaurants"),
    },
    {
      key: "catering" as const,
      emoji: "🥂",
      label: tt("Catering", "Catering"),
      sublabel: tt("Events & Business", "Events & Business"),
      to: "/catering" as const,
      trackKey: "catering_cta_clicked",
      cta: tt("Caterer entdecken", "Discover caterers"),
    },
    {
      key: "planner" as const,
      emoji: "✨",
      label: tt("Event-Planung", "Event Planning"),
      sublabel: tt("Hochzeiten & mehr", "Weddings & more"),
      to: "/planner" as const,
      trackKey: "planner_cta_clicked",
      cta: tt("Planer entdecken", "Discover planners"),
    },
  ];

  const current = verticals.find((v) => v.key === activeVertical)!;

  const stats = [
    { value: "47+", label: tt("Geprüfte Partner", "Vetted partners") },
    { value: "3", label: tt("Service-Bereiche", "Service areas") },
    { value: "100%", label: tt("Kostenlos für dich", "Free for you") },
    { value: "0€", label: tt("Versteckte Gebühren", "Hidden fees") },
  ];

  const steps = [
    {
      step: "01",
      icon: <Sparkles className="h-6 w-6" />,
      title: tt("Entdecken", "Discover"),
      body: tt(
        "Stöbere durch geprüfte Restaurants, Caterer und Event-Planer in deiner Region — kostenlos und ohne Anmeldung.",
        "Browse vetted restaurants, caterers, and event planners in your region — free and without sign-up."
      ),
    },
    {
      step: "02",
      icon: <Users className="h-6 w-6" />,
      title: tt("Anfragen", "Inquire"),
      body: tt(
        "Sende dein Catering-Briefing oder deine Event-Anfrage direkt an passende Partner — transparent und ohne Mittelsmänner.",
        "Send your catering brief or event inquiry directly to matched partners — transparent and without middlemen."
      ),
    },
    {
      step: "03",
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: tt("Genießen", "Enjoy"),
      body: tt(
        "Erhalte Angebote, vergleiche Partner und buche direkt. Kein Overhead, keine versteckten Gebühren.",
        "Receive offers, compare partners and book directly. No overhead, no hidden fees."
      ),
    },
  ];

  const partnerFeatures = [
    tt("Neue Kunden", "New customers"),
    tt("Direktkontakt", "Direct contact"),
    tt("Kein Overhead", "No overhead"),
    tt("Transparente Preise", "Transparent pricing"),
  ];

  return (
    <SiteShell>
      {/* ─────────────────────────────────────────────────
          HERO — Cinematic split layout
      ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20 lg:-mt-24">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 hero-gradient-bg" />

        {/* Right-side cinematic image — desktop only */}
        <div className="absolute right-0 top-0 bottom-0 w-[48%] z-0 hidden lg:block">
          <img
            src="/hero-cinematic.png"
            fetchPriority="high"
            alt={tt(
              "Speisely – Premium Gastronomie & Events",
              "Speisely – Premium Hospitality & Events"
            )}
            className="w-full h-full object-cover object-center"
          />
          {/* Left-side gradient fade so text is never blocked */}
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.96_0.04_92)] via-[oklch(0.96_0.04_92/0.45)] to-transparent" />
          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.96_0.04_92/0.3)] via-transparent to-transparent" />
        </div>

        {/* Mobile background image (behind content, heavily dimmed) */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <img
            src="/hero-cinematic.png"
            fetchPriority="high"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[oklch(0.96_0.04_92/0.88)]" />
        </div>

        {/* Hero text content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 lg:pt-44 lg:pb-36">
          <div className="max-w-[42rem]">

            {/* Eyebrow badge */}
            <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-forest shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
                {tt("Marktplatz für Gastronomie & Events", "Marketplace for hospitality & events")}
              </span>
            </div>

            {/* Main headline */}
            <h1
              className={`mt-8 font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.25rem] leading-[0.92] text-forest transition-all duration-700 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {tt("Der richtige", "The right")}<br />
              {tt("Partner für", "partner for")}<br />
              <span className="text-[#b28a3c]">{tt("jedes Erlebnis.", "every experience.")}</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`mt-7 text-lg sm:text-xl text-forest/70 max-w-[34rem] leading-relaxed transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {tt(
                "Speisely verbindet dich mit geprüften Restaurants, Caterern und Event-Planern — von der schnellen Bestellung bis zur perfekten Veranstaltung.",
                "Speisely connects you with vetted restaurants, caterers, and event planners — from a quick order to a perfect event."
              )}
            </p>

            {/* AI Search Bar */}
            <div
              className={`mt-10 relative max-w-2xl transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Sparkles className="h-5 w-5 text-[#b28a3c]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      trackEvent("ai_search_clicked", { query: searchQuery, vertical: activeVertical });
                      navigate({ to: current.to, search: { q: searchQuery } as any });
                    }
                  }}
                  className="w-full rounded-full bg-white/95 backdrop-blur-md border-2 border-white/50 py-4 pl-14 pr-36 text-base sm:text-lg text-forest shadow-xl focus:border-[#b28a3c] focus:bg-white focus:outline-none transition-all placeholder:text-forest/50"
                  placeholder={tt("Was suchst du? z.B. 'Vegan Catering Berlin'", "What are you looking for? e.g. 'Vegan Catering Berlin'")}
                />
                <button 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      trackEvent("ai_search_clicked", { query: searchQuery, vertical: activeVertical });
                      navigate({ to: current.to, search: { q: searchQuery } as any });
                    }
                  }}
                  className="absolute inset-y-2 right-2 bg-forest text-white rounded-full px-5 sm:px-6 font-bold text-sm sm:text-base shadow-md hover:bg-forest/90 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {tt("KI Suche", "AI Search")}
                </button>
              </div>
            </div>

            {/* Vertical selector + CTA */}
            <div
              className={`mt-8 transition-all duration-700 delay-400 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Tab pills */}
              <div className="flex flex-wrap gap-2">
                {verticals.map((v) => (
                  <button
                    key={v.key}
                    id={`hero-tab-${v.key}`}
                    type="button"
                    onClick={() => setActiveVertical(v.key)}
                    className={`flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 border ${
                      activeVertical === v.key
                        ? "bg-forest text-white border-forest shadow-lg shadow-forest/20"
                        : "bg-white/80 backdrop-blur-sm text-forest border-white/80 hover:bg-white hover:border-forest/20 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-base leading-none">{v.emoji}</span>
                    <span>{v.label}</span>
                    {activeVertical !== v.key && (
                      <span className="hidden sm:block text-[10px] text-forest/50 font-medium">{v.sublabel}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Primary + secondary CTAs */}
              <div className="mt-5 flex items-center gap-4">
                <Link
                  id="hero-primary-cta"
                  to={current.to}
                  onClick={() => trackEvent(current.trackKey, { location: "homepage_hero" })}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#b28a3c] text-white px-7 py-4 text-base font-bold shadow-xl shadow-[#b28a3c]/25 hover:bg-[#9a7633] hover:shadow-[#9a7633]/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {current.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  id="hero-partner-cta"
                  to="/partners"
                  onClick={() => trackEvent("partner_cta_clicked", { location: "homepage_hero_secondary" })}
                  className="text-sm font-semibold text-forest/65 hover:text-forest transition-colors inline-flex items-center gap-1.5"
                >
                  {tt("Partner werden", "Become a partner")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Social proof avatars */}
            <div
              className={`mt-10 flex items-center gap-3 transition-all duration-700 delay-[400ms] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex -space-x-1.5">
                {(["🏨", "🍽️", "🎉"] as const).map((e, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-white border-2 border-cream shadow-sm grid place-items-center text-sm"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <p className="text-sm text-forest/55">
                {tt("47+ Partner in ganz Deutschland", "47+ partners across Germany")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          WHAT IS SPEISELY — Dark clarity strip
      ───────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-base sm:text-lg text-white/75 max-w-2xl">
              <span className="text-white font-semibold">Speisely</span>{" "}
              {tt(
                "ist deine Premium-Plattform, um die besten Gastronomie-Partner zu entdecken – von Restaurants bis hin zu maßgeschneidertem Event-Catering.",
                "is your premium platform to discover top hospitality partners — from restaurants to bespoke event catering."
              )}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <CheckCircle2 className="h-5 w-5 text-[#b28a3c]" />
              <span className="text-sm font-semibold text-white/85">
                {tt("Kostenlos entdecken", "Free to explore")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          STATS BAR
      ───────────────────────────────────────────────── */}
      <section className="bg-cream border-b border-[#eadfce] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 md:gap-24">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl sm:text-4xl text-forest">{s.value}</div>
                <div className="mt-1 text-xs text-forest/55 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          THREE VERTICALS — Editorial asymmetric grid
      ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">

        {/* Section header */}
        <div className="mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b28a3c]">
            {tt("Drei Wege zu finden, was du brauchst", "Three ways to find what you need")}
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-forest leading-[1.0]">
            {tt("Restaurants.", "Restaurants.")}<br />
            {tt("Catering.", "Catering.")}<br />
            {tt("Event-Planung.", "Event Planning.")}
          </h2>
        </div>

        {/* Primary: Catering + Event Planner — large cards */}
        <div className="grid gap-5 lg:grid-cols-3 mb-5">

          {/* Instant Food Order — flagship format */}
          <Link
            id="vertical-restaurants"
            to="/instant-order"
            onClick={() => trackEvent("instant_order_cta_clicked", { location: "homepage_verticals" })}
            className="group relative overflow-hidden rounded-[2rem] bg-[#2a4d3e] text-white flex flex-col min-h-[480px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/hero-cinematic.png"
                loading="lazy"
                alt="Restaurants"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4d3e] via-[#2a4d3e]/65 to-[#2a4d3e]/15" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
              <div className="mt-auto">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] mb-3 drop-shadow-md">
                  {t("home.pillar.instant.eyebrow")}
                </div>
                <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">
                  {t("home.pillar.instant.title")}
                </h3>
                <p className="text-white/70 text-base leading-relaxed max-w-sm mb-6">
                  {t("home.pillar.instant.body")}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-6 py-3 text-sm font-bold group-hover:bg-[#b28a3c] group-hover:text-white transition-colors">
                  {t("home.pillar.instant.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Catering — flagship */}
          <Link
            id="vertical-catering"
            to="/catering"
            onClick={() => trackEvent("catering_cta_clicked", { location: "homepage_verticals" })}
            className="group relative overflow-hidden rounded-[2rem] bg-forest text-white flex flex-col min-h-[480px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/catering-clean.png"
                loading="lazy"
                alt="Catering"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/65 to-forest/15" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
              <div className="mt-auto">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] mb-3 drop-shadow-md">
                  {t("home.pillar.catering.eyebrow")}
                </div>
                <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">
                  {t("home.pillar.catering.title")}
                </h3>
                <p className="text-white/70 text-base leading-relaxed max-w-sm mb-6">
                  {t("home.pillar.catering.body")}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-6 py-3 text-sm font-bold group-hover:bg-[#b28a3c] group-hover:text-white transition-colors">
                  {t("home.pillar.catering.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Event Planner — flagship */}
          <Link
            id="vertical-planner"
            to="/planner"
            onClick={() => trackEvent("planner_cta_clicked", { location: "homepage_verticals" })}
            className="group relative overflow-hidden rounded-[2rem] bg-[#1a3d2e] text-white flex flex-col min-h-[480px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/planner-clean.png"
                loading="lazy"
                alt="Event Planner"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2e] via-[#1a3d2e]/65 to-[#1a3d2e]/15" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
              <div className="mt-auto">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] mb-3 drop-shadow-md">
                  {t("home.pillar.planner.eyebrow")}
                </div>
                <h3 className="font-display text-4xl sm:text-5xl text-white mb-4">
                  {t("home.pillar.planner.title")}
                </h3>
                <p className="text-white/70 text-base leading-relaxed max-w-sm mb-6">
                  {t("home.pillar.planner.body")}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-6 py-3 text-sm font-bold group-hover:bg-[#b28a3c] group-hover:text-white transition-colors">
                  {t("home.pillar.planner.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          HOW IT WORKS — 3-step process
      ───────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.png"
            loading="lazy"
            alt="Speisely Experience"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-forest/90 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b28a3c]">
              {tt("So einfach geht's", "How it works")}
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-white">
              {tt("In drei Schritten zum richtigen Partner", "Three steps to the right partner")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group bg-white/5 backdrop-blur-md rounded-[1.75rem] p-8 sm:p-10 shadow-2xl border border-white/10 flex flex-col gap-5 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#b28a3c]/20 text-[#b28a3c] grid place-items-center shadow-inner shrink-0 group-hover:scale-110 group-hover:bg-[#b28a3c] group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <span className="font-display text-5xl text-white/10 font-bold leading-none select-none group-hover:text-white/20 transition-colors">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-[15px] leading-relaxed group-hover:text-white/85 transition-colors">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          PARTNER CTA — Forest editorial banner
      ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <Link
          id="partner-banner-cta"
          to="/partners"
          onClick={() => trackEvent("partner_cta_clicked", { location: "homepage_banner" })}
          className="group relative block overflow-hidden rounded-[2.5rem] text-white p-10 sm:p-14 lg:p-16 hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:shadow-forest/30"
        >
          {/* Cinematic Image Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-cinematic.png"
              loading="lazy"
              alt="Become a Partner"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#b28a3c]/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-[70px] pointer-events-none" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 mb-6">
                <Building2 className="h-3.5 w-3.5 text-[#b28a3c]" />
                {t("home.pillar.partner.eyebrow")}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.0] mb-5">
                {t("home.pillar.partner.title")}
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t("home.pillar.partner.body")}
              </p>

              {/* Feature list */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {partnerFeatures.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-[#b28a3c] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex lg:block">
              <span className="inline-flex items-center gap-3 rounded-full bg-[#b28a3c] text-white px-8 py-5 text-base font-bold shadow-xl shadow-[#b28a3c]/20 transition-all group-hover:scale-105 group-hover:bg-[#9a7633] whitespace-nowrap">
                {t("home.pillar.partner.cta")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </div>
        </Link>
      </section>
    </SiteShell>
  );
}
