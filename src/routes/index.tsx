import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { classifySearchIntent } from "@/lib/search/ai.functions";
import { trackEvent } from "@/utils/posthog";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ShoppingBag,
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  ChevronRight,
  Star,
  Loader2,
  UtensilsCrossed,
  GlassWater,
  PartyPopper,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      if (
        host.endsWith(".speisely.de") &&
        host !== "speisely.de" &&
        host !== "www.speisely.de" &&
        host !== "app.speisely.de" &&
        host !== "admin.speisely.de"
      ) {
        const subdomain = host.replace(".speisely.de", "").trim();
        if (subdomain) {
          try {
            const { resolveSubdomainVendor } = await import("@/lib/caterer/menu.functions");
            const res = await resolveSubdomainVendor({ data: { subdomain } });
            if (res.type === "catering") {
              throw redirect({ to: "/catering/$slug", params: { slug: res.slug } });
            } else if (res.type === "planner") {
              throw redirect({ to: "/planner/$slug", params: { slug: res.slug } });
            } else {
              throw redirect({ to: "/restaurant/$slug", params: { slug: res.slug } });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            if (
              e?.isRedirect ||
              e?.status === 301 ||
              e?.status === 302 ||
              e?.to ||
              e?.href ||
              e?.options
            ) {
              throw e;
            }
            throw redirect({ to: "/catering/$slug", params: { slug: subdomain } });
          }
        }
      }
    }
  },
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
    links: [{ rel: "preload", href: "/hero-cinematic.webp", as: "image", fetchpriority: "high" }],
    scripts: [
      {
        children: `(function(){try{var h=window.location.hostname.toLowerCase();if(h.endsWith('.speisely.de')&&h!=='speisely.de'&&h!=='www.speisely.de'&&h!=='app.speisely.de'&&h!=='admin.speisely.de'){var sub=h.replace('.speisely.de','').trim();if(sub&&!window.location.pathname.startsWith('/catering/')&&!window.location.pathname.startsWith('/restaurant/')&&!window.location.pathname.startsWith('/planner/')){window.location.replace('/catering/'+sub+window.location.search);}}}catch(e){}})();`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Speisely",
          url: "https://speisely.de/",
          description:
            "Speisely ist der Premium-Marktplatz für Restaurants, Catering und Event-Planung.",
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
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeVertical, setActiveVertical] = useState<"restaurant" | "catering" | "planner">(
    "catering",
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      if (
        host.endsWith(".speisely.de") &&
        host !== "speisely.de" &&
        host !== "www.speisely.de" &&
        host !== "app.speisely.de" &&
        host !== "admin.speisely.de"
      ) {
        const subdomain = host.replace(".speisely.de", "").trim();
        if (
          subdomain &&
          !window.location.pathname.startsWith("/catering/") &&
          !window.location.pathname.startsWith("/restaurant/") &&
          !window.location.pathname.startsWith("/planner/")
        ) {
          import("@/lib/caterer/menu.functions").then(({ resolveSubdomainVendor }) => {
            resolveSubdomainVendor({ data: { subdomain } })
              .then((res) => {
                const target =
                  res.type === "catering"
                    ? `/catering/${res.slug}${window.location.search}`
                    : res.type === "planner"
                      ? `/planner/${res.slug}${window.location.search}`
                      : `/restaurant/${res.slug}${window.location.search}`;
                window.location.replace(target);
              })
              .catch(() => {
                window.location.replace(`/catering/${subdomain}${window.location.search}`);
              });
          });
        }
      }
    }
  }, []);

  const verticals = useMemo(
    () => [
      {
        key: "restaurant" as const,
        icon: <UtensilsCrossed className="h-4 w-4" />,
        label: tt("Restaurants", "Restaurants"),
        sublabel: tt("Sofort bestellen", "Order now"),
        to: "/instant-order" as const,
        trackKey: "instant_order_cta_clicked",
        cta: tt("Restaurants entdecken", "Discover restaurants"),
      },
      {
        key: "catering" as const,
        icon: <GlassWater className="h-4 w-4" />,
        label: tt("Catering", "Catering"),
        sublabel: tt("Events & Business", "Events & Business"),
        to: "/catering" as const,
        trackKey: "catering_cta_clicked",
        cta: tt("Caterer entdecken", "Discover caterers"),
      },
      {
        key: "planner" as const,
        icon: <Sparkles className="h-4 w-4" />,
        label: tt("Event-Planung", "Event Planning"),
        sublabel: tt("Hochzeiten & mehr", "Weddings & more"),
        to: "/planner" as const,
        trackKey: "planner_cta_clicked",
        cta: tt("Planer entdecken", "Discover planners"),
      },
    ],
    [lang],
  );

  const current = useMemo(
    () => verticals.find((v) => v.key === activeVertical)!,
    [verticals, activeVertical],
  );

  const classify = useServerFn(classifySearchIntent);
  const [searching, setSearching] = useState(false);

  async function handleAISearch() {
    if (!searchQuery.trim() || searching) return;
    setSearching(true);
    try {
      const res = await classify({ data: { query: searchQuery.trim() } });

      let toPath: "/instant-order" | "/catering" | "/planner" = "/instant-order";
      if (res.vertical === "catering") {
        toPath = "/catering";
      } else if (res.vertical === "events") {
        toPath = "/planner";
      }

      const searchParams: Record<string, string | number | undefined> = {
        q: searchQuery.trim(),
      };
      if (res.parameters?.location) {
        searchParams.location = res.parameters.location;
      }
      if (res.parameters?.guests) {
        searchParams.guests = res.parameters.guests;
      }
      if (res.parameters?.cuisine) {
        searchParams.cuisine = res.parameters.cuisine;
      }

      navigate({
        to: toPath,
        search: searchParams as Record<string, string>,
      });

      if (res.intent === "B2B") {
        toast.info(
          tt(
            `KI hat B2B-Anfrage erkannt (${res.vertical === "catering" ? "Catering" : "Event-Planer"}). Leite weiter...`,
            `AI detected B2B query (${res.vertical === "catering" ? "Catering" : "Event Planner"}). Routing...`,
          ),
        );
      } else {
        toast.info(tt("Leite weiter zur Restaurantsuche...", "Routing to restaurant search..."));
      }
    } catch (e: unknown) {
      navigate({ to: current.to, search: { q: searchQuery } as Record<string, string> });
    } finally {
      setSearching(false);
    }
  }

  const stats = useMemo(
    () => [
      { value: "47+", label: tt("Geprüfte Partner", "Vetted partners") },
      { value: "3", label: tt("Service-Bereiche", "Service areas") },
      { value: "100%", label: tt("Kostenlos für dich", "Free for you") },
      { value: "0€", label: tt("Versteckte Gebühren", "Hidden fees") },
    ],
    [lang],
  );

  const steps = useMemo(
    () => [
      {
        step: "01",
        icon: <Sparkles className="h-6 w-6" />,
        title: tt("Entdecken", "Discover"),
        body: tt(
          "Stöbere durch geprüfte Restaurants, Caterer und Event-Planer in deiner Region — kostenlos und ohne Anmeldung.",
          "Browse vetted restaurants, caterers, and event planners in your region — free and without sign-up.",
        ),
      },
      {
        step: "02",
        icon: <Users className="h-6 w-6" />,
        title: tt("Anfragen", "Inquire"),
        body: tt(
          "Sende dein Catering-Briefing oder deine Event-Anfrage direkt an passende Partner — transparent und ohne Mittelsmänner.",
          "Send your catering brief or event inquiry directly to matched partners — transparent and without middlemen.",
        ),
      },
      {
        step: "03",
        icon: <CheckCircle2 className="h-6 w-6" />,
        title: tt("Genießen", "Enjoy"),
        body: tt(
          "Erhalte Angebote, vergleiche Partner und buche direkt. Kein Overhead, keine versteckten Gebühren.",
          "Receive offers, compare partners and book directly. No overhead, no hidden fees.",
        ),
      },
    ],
    [lang],
  );

  const partnerFeatures = useMemo(
    () => [
      tt("Neue Kunden", "New customers"),
      tt("Direktkontakt", "Direct contact"),
      tt("Kein Overhead", "No overhead"),
      tt("Transparente Preise", "Transparent pricing"),
    ],
    [lang],
  );

  return (
    <SiteShell>
      {/* ─────────────────────────────────────────────────
          HERO — Cinematic split layout
      ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden ">
        {/* Dark forest background */}
        <div className="absolute inset-0 z-0 bg-forest" />

        {/* Right-side cinematic image — desktop only */}
        <div className="absolute right-0 top-0 bottom-0 w-[48%] z-0 hidden lg:block">
          <picture>
            <source srcSet="/hero-cinematic.webp" type="image/webp" />
            <img
              src="/hero-cinematic.webp"
              fetchPriority="high"
              decoding="async"
              sizes="50vw"
              alt={tt(
                "Speisely – Premium Gastronomie & Events",
                "Speisely – Premium Hospitality & Events",
              )}
              className="w-full h-full object-cover object-center"
            />
          </picture>
          {/* Left-side gradient fade so text is never blocked */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent" />
        </div>

        {/* Mobile background image (behind content, heavily dimmed) */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <picture>
            <source srcSet="/hero-cinematic.webp" type="image/webp" />
            <img
              src="/hero-cinematic.webp"
              fetchPriority="high"
              decoding="async"
              sizes="100vw"
              alt={tt(
                "Speisely – Premium Gastronomie & Events",
                "Speisely – Premium Hospitality & Events",
              )}
              className="w-full h-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-forest/85" />
        </div>

        {/* Hero text content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-36">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="max-w-[42rem]"
          >
            {/* Eyebrow badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
                {tt("Marktplatz für Gastronomie & Events", "Marketplace for hospitality & events")}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-8 font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.25rem] leading-[0.92] text-white"
            >
              {tt("Der richtige", "The right")}
              <br />
              {tt("Partner für", "partner for")}
              <br />
              <span className="text-[#b28a3c]">{tt("jedes Erlebnis.", "every experience.")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-7 text-lg sm:text-xl text-white/80 max-w-[34rem] leading-relaxed"
            >
              {tt(
                "Speisely verbindet dich mit geprüften Restaurants, Caterern und Event-Planern — von der schnellen Bestellung bis zur perfekten Veranstaltung.",
                "Speisely connects you with vetted restaurants, caterers, and event planners — from a quick order to a perfect event.",
              )}
            </motion.p>

            {/* AI Search Bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-10 relative max-w-2xl"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  {searching ? (
                    <Loader2 className="h-5 w-5 text-[#b28a3c] animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-[#b28a3c]" />
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAISearch();
                    }
                  }}
                  disabled={searching}
                  className="w-full rounded-full bg-white/95 backdrop-blur-md border-2 border-white/50 py-4 pl-14 pr-36 text-base sm:text-lg text-forest shadow-xl focus:border-[#b28a3c] focus:bg-white focus:outline-none transition-all placeholder:text-forest/50 disabled:opacity-80"
                  placeholder={tt(
                    "Was suchst du? z.B. 'Vegan Catering Berlin'",
                    "What are you looking for? e.g. 'Vegan Catering Berlin'",
                  )}
                />
                <button
                  onClick={handleAISearch}
                  disabled={searching || !searchQuery.trim()}
                  className="absolute inset-y-2 right-2 bg-forest text-white rounded-full px-5 sm:px-6 font-bold text-sm sm:text-base shadow-md hover:bg-forest/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {searching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {tt("Sucht...", "Searching...")}
                    </>
                  ) : (
                    tt("KI Suche", "AI Search")
                  )}
                </button>
              </div>
            </motion.div>

            {/* Vertical selector + CTA */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-8"
            >
              {/* Tab pills */}
              <LayoutGroup id="heroTabs">
                <div className="flex flex-wrap gap-2 relative">
                  {verticals.map((v) => (
                    <button
                      key={v.key}
                      id={`hero-tab-${v.key}`}
                      type="button"
                      onClick={() => setActiveVertical(v.key)}
                      className={`relative flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 border cursor-pointer select-none overflow-hidden ${
                        activeVertical === v.key
                          ? "text-forest border-transparent"
                          : "bg-white/[0.08] backdrop-blur-sm text-white/80 border-white/15 hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-sm"
                      }`}
                    >
                      {activeVertical === v.key && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-white rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2.5">
                        {v.icon}
                        <span>{v.label}</span>
                        {activeVertical !== v.key && (
                          <span className="hidden sm:block text-[10px] text-white/50 font-medium">
                            {v.sublabel}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>

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
                  onClick={() =>
                    trackEvent("partner_cta_clicked", { location: "homepage_hero_secondary" })
                  }
                  className="text-sm font-semibold text-white/65 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  {tt("Partner werden", "Become a partner")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Social proof avatars */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-10 flex items-center gap-4 text-white/70"
            >
              <div className="flex items-center gap-2 pb-0.5">
                <Building2 className="h-4 w-4 text-[#b28a3c] shrink-0" />
                <span className="text-[10px] text-white/30">•</span>
                <UtensilsCrossed className="h-4 w-4 text-[#b28a3c] shrink-0" />
                <span className="text-[10px] text-white/30">•</span>
                <PartyPopper className="h-4 w-4 text-[#b28a3c] shrink-0" />
              </div>
              <p className="text-sm text-white/55">
                {tt("47+ Partner in ganz Deutschland", "47+ partners across Germany")}
              </p>
            </motion.div>
          </motion.div>
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
                "is your premium platform to discover top hospitality partners — from restaurants to bespoke event catering.",
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
            {tt("Restaurants.", "Restaurants.")}
            <br />
            {tt("Catering.", "Catering.")}
            <br />
            {tt("Event-Planung.", "Event Planning.")}
          </h2>
        </div>

        {/* Primary: Catering + Event Planner — large cards */}
        <div className="grid gap-5 lg:grid-cols-3 mb-5">
          {/* Instant Food Order — flagship format */}
          <Link
            id="vertical-restaurants"
            to="/instant-order"
            onClick={() =>
              trackEvent("instant_order_cta_clicked", { location: "homepage_verticals" })
            }
            className="group relative overflow-hidden rounded-[2rem] bg-[#2a4d3e] text-white flex flex-col min-h-[480px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/hero-cinematic.webp"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
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
                src="/catering-clean.webp"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
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
                src="/planner-clean.webp"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
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
          SPEISELY MAGAZIN — Partner-Stories & City Festivals (DEO / GEO)
      ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-t border-forest/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b28a3c] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {tt("Speisely Magazin · Partner-Stories", "Speisely Magazine · Partner Stories")}
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-forest leading-[1.05]">
              {tt("Echte Geschichten.", "Real Stories.")}
              <br />
              {tt("Regionale Meister & Feste.", "Regional Masters & Festivals.")}
            </h2>
          </div>

          <Link
            to="/magazin"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-[#b28a3c] transition-colors self-start md:self-auto"
          >
            <span>{tt("Alle Magazin-Stories ansehen", "View all magazine stories")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Pilot Story Banner */}
        <Link
          to="/magazin/schnitzel-schmiede"
          className="group relative block overflow-hidden rounded-[2.5rem] bg-[#173C32] text-white shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-forest/30"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#E6B84A] text-[#173C32] rounded-full text-xs font-black uppercase tracking-wider">
                  Ausgabe 01 · 2026
                </span>
                <span className="text-xs font-semibold text-[#DDEEE3]">
                  Mönchengladbach · EineStadt-Fest
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight group-hover:text-[#E6B84A] transition-colors">
                Schnitzel Schmiede beim EineStadt-Fest 2026
              </h3>

              <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">
                Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach: 13 Jahre
                Fest-Tradition, handwerkliche Frische und Live-Gastronomie.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A] text-[#173C32] px-6 py-3 text-sm font-extrabold shadow-lg group-hover:bg-white transition-colors">
                  Story lesen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xs text-white/50 font-medium">5 Min. Lesezeit</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black">
              <img
                src="/speisely_magazine_cover_v2.png"
                alt="Schnitzel Schmiede Magazin Cover"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────────
          HOW IT WORKS — 3-step process
      ───────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.webp"
            loading="lazy"
            decoding="async"
            sizes="100vw"
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
                  <p className="text-white/70 text-[15px] leading-relaxed group-hover:text-white/85 transition-colors">
                    {item.body}
                  </p>
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
              src="/hero-cinematic.webp"
              loading="lazy"
              decoding="async"
              sizes="100vw"
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
