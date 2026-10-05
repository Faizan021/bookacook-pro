import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { classifySearchIntent } from "@/lib/search/ai.functions";
import { classifyWithSystem1 } from "@/lib/decision/system1";
import { trackEvent } from "@/utils/posthog";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  Search,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import { motion, LayoutGroup, useReducedMotion, AnimatePresence } from "framer-motion";
import { AiConciergeModal } from "@/components/search/AiConciergeModal";

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
      { title: "Speisely — Catering, Restaurants & Eventplanung" },
      {
        name: "description",
        content:
          "Speisely verbindet spontane Restaurant-Bestellungen, erstklassiges Event-Catering und professionelle Eventplanung auf einer Plattform in ganz Deutschland.",
      },
      {
        property: "og:title",
        content: "Speisely — Catering, Restaurants & Eventplanung",
      },
      {
        property: "og:description",
        content:
          "Speisely verbindet spontane Restaurant-Bestellungen, erstklassiges Event-Catering und professionelle Eventplanung auf einer Plattform in ganz Deutschland.",
      },
      { property: "og:image", content: "https://speisely.de/hero-cinematic.webp" },
      { property: "og:url", content: "https://speisely.de" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Speisely — Marktplatz für Catering, Restaurants & Eventplanung",
      },
      {
        name: "twitter:description",
        content:
          "Catering buchen, Essen bei lokalen Restaurants bestellen und Eventplaner in ganz Deutschland finden.",
      },
      { name: "twitter:image", content: "https://speisely.de/hero-cinematic.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://speisely.de" },
      { rel: "preload", href: "/hero-cinematic.webp", as: "image", fetchpriority: "high" },
      { rel: "sitemap", type: "application/xml", href: "https://speisely.de/sitemap.xml" },
    ],
    scripts: [
      {
        children: `(function(){try{var h=window.location.hostname.toLowerCase();if(h.endsWith('.speisely.de')&&h!=='speisely.de'&&h!=='www.speisely.de'&&h!=='app.speisely.de'&&h!=='admin.speisely.de'){var sub=h.replace('.speisely.de','').trim();if(sub&&!window.location.pathname.startsWith('/catering/')&&!window.location.pathname.startsWith('/restaurant/')&&!window.location.pathname.startsWith('/planner/')){window.location.replace('/catering/'+sub+window.location.search);}}}catch(e){}})();`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": "https://speisely.de/#service-catering",
              name: "Event & Business Catering",
              serviceType: "Catering Marketplace",
              provider: {
                "@id": "https://speisely.de/#organization",
              },
              areaServed: {
                "@type": "Country",
                name: "Germany",
              },
              description:
                "Verifizierte Caterer für Firmenfeiern, Hochzeiten, Fingerfood, Buffets und Messecatering in Deutschland.",
            },
            {
              "@type": "Service",
              "@id": "https://speisely.de/#service-instant-order",
              name: "Direkte Restaurantbestellungen",
              serviceType: "Food Ordering Marketplace",
              provider: {
                "@id": "https://speisely.de/#organization",
              },
              areaServed: {
                "@type": "Country",
                name: "Germany",
              },
              description:
                "Direkte digitale Bestellkanäle für Restaurants mit 0 % Provision pro Bestellung.",
            },
            {
              "@type": "Service",
              "@id": "https://speisely.de/#service-planner",
              name: "Event-Planung & CRM",
              serviceType: "Event Planning Platform",
              provider: {
                "@id": "https://speisely.de/#organization",
              },
              areaServed: {
                "@type": "Country",
                name: "Germany",
              },
              description:
                "Vermittlung und Koordination professioneller Eventplaner für private und geschäftliche Veranstaltungen.",
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://speisely.de/#breadcrumbs",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://speisely.de",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Catering",
                  item: "https://speisely.de/catering",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Restaurants",
                  item: "https://speisely.de/restaurants",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Event-Planung",
                  item: "https://speisely.de/planner",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const tt = useCallback((de: string, en: string) => (lang === "de" ? de : en), [lang]);
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeVertical, setActiveVertical] = useState<"restaurant" | "catering" | "planner">(
    "catering",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const rotatingPlaceholders = useMemo(
    () =>
      lang === "de"
        ? [
            "Sommerfest 40 Personen München mit veganem Fingerfood...",
            "Fingerfood Buffet für 30 Gäste ohne Schweinefleisch...",
            "Hochzeitscatering für 80 Personen in Köln...",
            "Business Lunch für 15 Personen morgen in Hamburg...",
            "Live BBQ Station für 50 Gäste in Berlin...",
          ]
        : [
            "Summer party 40 guests in Munich with vegan finger food...",
            "Finger food buffet for 30 people, pork-free...",
            "Wedding catering for 80 guests in Cologne...",
            "Business lunch for 15 colleagues tomorrow in Hamburg...",
            "Live BBQ station for 50 guests in Berlin...",
          ],
    [lang],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [rotatingPlaceholders.length]);

  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scenarioChips = useMemo(
    () => [
      {
        label: tt("🏢 Office Teamevent", "🏢 Office Team Event"),
        query: tt("Office Teamevent für 30 Personen", "Office team event for 30 guests"),
      },
      {
        label: tt("🍢 Fingerfood Buffet", "🍢 Finger Food Buffet"),
        query: tt("Fingerfood Buffet für Firmenfeier", "Finger food buffet for corporate event"),
      },
      {
        label: tt("💍 Hochzeit & Feier", "💍 Wedding & Gala"),
        query: tt("Hochzeitscatering für 70 Gäste", "Wedding catering for 70 guests"),
      },
      {
        label: tt("🌱 100% Vegan & Bio", "🌱 100% Vegan & Organic"),
        query: tt("Veganes Bio Catering Buffet", "Vegan organic catering buffet"),
      },
    ],
    [tt],
  );

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
          import("@/lib/caterer/menu.functions")
            .then(({ resolveSubdomainVendor }) => {
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
            })
            .catch(() => {});
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
        to: "/restaurants" as const,
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
    [tt],
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
      // 1. Instant System 1 Reflex Classification (< 2ms)
      const system1 = classifyWithSystem1(searchQuery.trim());

      let toPath: "/restaurants" | "/catering" | "/planner" = "/restaurants";
      if (system1.vertical === "catering") {
        toPath = "/catering";
      } else if (system1.vertical === "events") {
        toPath = "/planner";
      }

      const searchParams: Record<string, string | number | undefined> = {
        q: searchQuery.trim(),
      };
      if (system1.parameters?.location) {
        searchParams.location = system1.parameters.location;
      }
      if (system1.parameters?.guests) {
        searchParams.guests = system1.parameters.guests;
      }
      if (system1.parameters?.cuisine) {
        searchParams.cuisine = system1.parameters.cuisine;
      }

      // Instant UI Navigation
      navigate({
        to: toPath,
        search: searchParams as Record<string, string>,
      });

      if (system1.intent === "B2B") {
        toast.success(
          tt(
            `⚡ System 1 Reflex: B2B ${system1.vertical === "catering" ? "Catering" : "Event-Planer"} erkannt (${system1.latencyMs}ms)`,
            `⚡ System 1 Reflex: B2B ${system1.vertical === "catering" ? "Catering" : "Event Planner"} detected (${system1.latencyMs}ms)`,
          ),
        );
      } else {
        toast.info(
          tt(
            `⚡ System 1 Reflex: Restaurant-Suche (${system1.latencyMs}ms)`,
            `⚡ System 1 Reflex: Restaurant Search (${system1.latencyMs}ms)`,
          ),
        );
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
    [tt],
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
    [tt],
  );

  const partnerFeatures = useMemo(
    () => [
      tt("Neue Kunden", "New customers"),
      tt("Direktkontakt", "Direct contact"),
      tt("Kein Overhead", "No overhead"),
      tt("Transparente Preise", "Transparent pricing"),
    ],
    [tt],
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

            {/* Category Intent Selector (Above Search Bar) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="mt-8 mb-4"
            >
              <LayoutGroup id="heroTabs">
                <div className="flex flex-wrap gap-2 relative">
                  {verticals.map((v) => (
                    <Link
                      key={v.key}
                      id={`hero-tab-${v.key}`}
                      to={v.to}
                      onMouseEnter={() => setActiveVertical(v.key)}
                      onClick={() => setActiveVertical(v.key)}
                      className={`relative flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none overflow-hidden ${
                        activeVertical === v.key
                          ? "text-forest border-transparent"
                          : "bg-white/[0.08] backdrop-blur-sm text-white/80 border-white/15 hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-sm"
                      }`}
                    >
                      {activeVertical === v.key && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-white rounded-full -z-10 shadow-md"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {v.icon}
                        <span>{v.label}</span>
                        {activeVertical !== v.key && (
                          <span className="hidden sm:block text-[10px] text-white/50 font-medium">
                            {v.sublabel}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </LayoutGroup>
            </motion.div>

            {/* AI Search & Omnibar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                },
              }}
              className="relative max-w-2xl"
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
                  className="w-full rounded-full bg-white/95 backdrop-blur-md border-2 border-white/50 py-4 pl-14 pr-44 sm:pr-48 text-base sm:text-lg text-forest shadow-xl focus:border-[#b28a3c] focus:bg-white focus:outline-none transition-all placeholder:text-forest/45 disabled:opacity-80"
                  placeholder={
                    activeVertical === "restaurant"
                      ? tt(
                          "z.B. Neapolitanische Pizza, Sushi oder Tagesmenü...",
                          "e.g. Neapolitan Pizza, Sushi or lunch specials...",
                        )
                      : activeVertical === "planner"
                        ? tt(
                            "z.B. Hochzeitsplanung für 80 Gäste mit Location...",
                            "e.g. Wedding planning for 80 guests with venue...",
                          )
                        : rotatingPlaceholders[placeholderIndex]
                  }
                />

                {/* Single High-End Radiant Action Button */}
                <div className="absolute inset-y-2 right-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        handleAISearch();
                      } else {
                        setIsConciergeOpen(true);
                      }
                    }}
                    disabled={searching}
                    className="bg-gradient-to-r from-[#b28a3c] via-[#c69a45] to-[#d6a538] hover:from-[#9a7633] hover:to-[#b28a3c] text-forest font-black rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm shadow-lg shadow-[#b28a3c]/30 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-[#f4d58d]/50 hover:scale-[1.02] active:scale-[0.98]"
                    title={tt("Finden & KI-Berater starten", "Find & start AI advisor")}
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-forest" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-forest" />
                    )}
                    <span>{tt("Finden & Beraten", "Find & Consult")}</span>
                  </button>
                </div>
              </div>

              {/* Vorschläge Chips (Balanced, perfectly wrapped, no clipping) */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider shrink-0 mr-1">
                  {tt("Beliebt:", "Popular:")}
                </span>
                {scenarioChips.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip.query);
                      setIsConciergeOpen(true);
                    }}
                    className="rounded-full bg-white/[0.08] hover:bg-[#b28a3c] hover:text-forest text-white/85 border border-white/15 px-3 py-1 text-xs font-medium transition cursor-pointer backdrop-blur-sm shadow-sm"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Social Proof & Trust Strip (Replaces clutter with proof) */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/75 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#b28a3c]" />
                  <span>{tt("47+ Geprüfte Partner", "47+ Vetted Partners")}</span>
                </div>
                <span className="text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="h-4 w-4 text-[#b28a3c] fill-[#b28a3c]" />
                  <span>{tt("4.9/5 Bewertung", "4.9/5 Rating")}</span>
                </div>
                <span className="text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-medium text-white/90">
                  <span className="text-[#f4d58d] font-bold">0 €</span>
                  <span>{tt("Kostenlos für dich", "100% Free")}</span>
                </div>
                <span className="text-white/20 hidden sm:inline">•</span>
                <Link
                  to="/partners"
                  className="text-[#f4d58d] hover:text-white transition-colors font-semibold inline-flex items-center gap-1 text-xs sm:text-sm"
                >
                  <span>{tt("Partner werden →", "Become a Partner →")}</span>
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
            to="/restaurants"
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
          LIVE WEBSITE SHOWCASE FOR RESTAURANTS & CATERERS
      ───────────────────────────────────────────────── */}
      <section className="bg-cream border-t border-b border-[#eadfce] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b28a3c] block mb-2">
                Speisely Digital Suite
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-forest font-bold leading-tight">
                Wir bauen High-End Websites <br />
                <span className="text-[#A85C36]">für Caterer &amp; Gastronomen.</span>
              </h2>
            </div>
            <Link
              to="/partner/webseiten"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-[#b28a3c] transition whitespace-nowrap"
            >
              <span>Alle Referenzen &amp; Angebot ansehen</span>
              <ArrowRight className="h-4 w-4 text-[#E6B84A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case 1: Partyservice Küpper */}
            <div className="rounded-3xl bg-white border-2 border-forest/10 p-7 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-[#A85C36] tracking-wider">
                    BBQ &amp; Event-Catering NRW
                  </span>
                  <Link
                    to="/case-study/partyservice-kuepper"
                    className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 hover:bg-emerald-200 transition"
                  >
                    Live Case Study ⭐
                  </Link>
                </div>
                <Link
                  to="/case-study/partyservice-kuepper"
                  className="block group-hover:text-[#A85C36] transition"
                >
                  <h3 className="font-display text-2xl font-bold text-forest mb-2 group-hover:text-[#A85C36] transition">
                    Partyservice Küpper
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-forest/75 line-clamp-3 leading-relaxed mb-6">
                  Moderner Webauftritt mit All-Inclusive BBQ-Paketen, Event-Kalkulator, lokaler
                  Google-KI-SEO-Struktur und direkter Angebotsanfrage.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-forest/80 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    ⚡ PageSpeed 99+
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    🥩 All-Inclusive BBQ
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    📱 100% Mobiloptimiert
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                <span className="text-xs text-forest/50 font-mono">partyservicekuepper.de</span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/partyservice-kuepper"
                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-3.5 py-1.5 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <a
                    href="https://partyservicekuepper.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest/70 hover:text-forest transition"
                  >
                    <span>Live ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Case 2: Haus Spaas */}
            <div className="rounded-3xl bg-white border-2 border-forest/10 p-7 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-[#A85C36] tracking-wider">
                    Traditions-Gastronomie &amp; Eventlokal
                  </span>
                  <Link
                    to="/case-study/haus-spaas"
                    className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 hover:bg-emerald-200 transition"
                  >
                    Live Case Study ⭐
                  </Link>
                </div>
                <Link
                  to="/case-study/haus-spaas"
                  className="block group-hover:text-[#A85C36] transition"
                >
                  <h3 className="font-display text-2xl font-bold text-forest mb-2 group-hover:text-[#A85C36] transition">
                    Haus Spaas
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-forest/75 line-clamp-3 leading-relaxed mb-6">
                  Vom statischen PDF zum vollen Gastraum: Duales Menü-System, 1-Klick WhatsApp
                  Reservierung &amp; 44 Besucher in den ersten 24 Stunden.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-forest/80 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    📈 +44 Gäste in 24h
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    🥨 Duale Speisekarte
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    ⚡ 0.48s Ladezeit
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                <span className="text-xs text-forest/50 font-mono">haus-spaas.de</span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/haus-spaas"
                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-3.5 py-1.5 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <a
                    href="https://haus-spaas.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest/70 hover:text-forest transition"
                  >
                    <span>Live ↗</span>
                  </a>
                </div>
              </div>
            </div>
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

      {/* Floating AI Concierge Launcher (Only visible after scrolling past hero) */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConciergeOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-forest via-[#1a382c] to-[#b28a3c] text-white px-5 py-3 shadow-2xl border border-white/20 hover:border-[#b28a3c] transition-all cursor-pointer group backdrop-blur-md"
            title={tt("KI Event-Berater öffnen", "Open AI Event Concierge")}
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4d58d] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f4d58d]" />
            </span>
            <Sparkles className="w-4 h-4 text-[#f4d58d] group-hover:rotate-12 transition-transform" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {tt("✨ KI Event-Berater", "✨ AI Event Concierge")}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Google Gemini AI Concierge Modal */}
      <AiConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        initialQuery={searchQuery}
      />
    </SiteShell>
  );
}
