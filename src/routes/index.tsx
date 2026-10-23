import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";

import { useServerFn } from "@tanstack/react-start";

import { classifySearchIntent } from "@/lib/search/ai.functions";

import { classifyWithSystem1 } from "@/lib/decision/system1";

import { trackEvent } from "@/utils/posthog";

import { useState, useEffect, useMemo, useCallback, useDeferredValue, useTransition } from "react";

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
  ShieldCheck,
  Percent,
  Clock,
  Smartphone,
  MapPin,
  Receipt,
  ChefHat,
  Globe,
  Bot,
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
          "Speisely: Die Plattform für Catering, Office Lunch & Restaurants. Catering für Meetings & Events vergleichen, konfigurieren und direkt buchen.",
      },

      {
        property: "og:title",

        content: "Speisely — Catering, Restaurants & Eventplanung",
      },

      {
        property: "og:description",

        content:
          "Speisely: Die Plattform für Catering, Office Lunch & Restaurants. Catering für Meetings & Events vergleichen, konfigurieren und direkt buchen.",
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

      {
        rel: "preload",
        href: "/hero-cinematic-mobile.webp",
        as: "image",
        media: "(max-width: 768px)",
        fetchpriority: "high",
      },
      {
        rel: "preload",
        href: "/hero-cinematic.webp",
        as: "image",
        media: "(min-width: 769px)",
        fetchpriority: "high",
      },

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

  const [audienceMode, setAudienceMode] = useState<"foodie" | "partner">("foodie");

  const [activeVertical, setActiveVertical] = useState<"restaurant" | "catering" | "planner">(
    "catering",
  );

  const [searchQuery, setSearchQuery] = useState("");

  // React 18/19 INP Optimization: Keep input responsiveness instant (<16ms)

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [, startTransition] = useTransition();

  const handleAudienceChange = (mode: "foodie" | "partner") => {
    startTransition(() => {
      setAudienceMode(mode);
    });
  };

  const handleVerticalChange = (verticalKey: "restaurant" | "catering" | "planner") => {
    startTransition(() => {
      setActiveVertical(verticalKey);
    });
  };

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

  const partnerChips = useMemo(
    () => [
      {
        label: tt("⚡ Schnelle Ladezeiten & KI-SEO", "⚡ Fast Speed & AI SEO"),

        to: "/partner/webseiten",
      },

      {
        label: tt("💶 34,99 € Rechner", "💶 34.99 € Calculator"),

        to: "/partners#calculator",
      },

      {
        label: tt("💬 WhatsApp Buchung", "💬 WhatsApp Booking"),

        to: "/case-study/haus-spaas",
      },

      {
        label: tt("🖥️ Live-KDS Küchenmonitor", "🖥️ Live KDS Display"),

        to: "/restaurant/kitchen",
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
      { value: "0%", label: tt("Provision auf Direktbestellungen", "Commission on direct orders") },

      {
        value: "100%",

        label: tt("Unabhängige Visits (selbst bezahlt)", "Independent visits (self-paid)"),
      },

      { value: "0€", label: tt("Kostenlos für Genießer", "Free for foodies") },

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
          "Entdecke Restaurants, Caterer und Event-Planer in deiner Region. Kostenlos und ohne Anmeldung.",

          "Discover restaurants, caterers, and event planners in your region. Free and without sign-up.",
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
            <source
              media="(max-width: 768px)"
              srcSet="/hero-cinematic-mobile.webp"
              type="image/webp"
            />
            <source srcSet="/hero-cinematic.webp" type="image/webp" />

            <img
              src="/hero-cinematic-mobile.webp"

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

        {/* Hero text & interactive content */}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
          {/* Dual Perspective Audience Toggle */}

          <div className="flex items-center justify-start mb-6">
            <div className="inline-flex items-center p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <button
                type="button"

                onClick={() => handleAudienceChange("foodie")}

                className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  audienceMode === "foodie"
                    ? "bg-[#E6B84A] text-forest shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />

                <span>{tt("Für Genießer & Events", "For Foodies & Events")}</span>
              </button>

              <button
                type="button"

                onClick={() => handleAudienceChange("partner")}

                className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  audienceMode === "partner"
                    ? "bg-[#E6B84A] text-forest shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />

                <span>{tt("Für Gastronomen & Caterer", "For Restaurants & Caterers")}</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Headline, Subheadline & Search Omnibar */}

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

              className="lg:col-span-7 max-w-2xl"
            >
              {/* Eyebrow Milestone Announcement */}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },

                  visible: {
                    opacity: 1,

                    y: 0,

                    transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: "easeOut" },
                  },
                }}

                className="mb-4"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: "speisely-google-for-startups-immersion-emea" }}
                  className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-md border border-white/20 hover:border-[#E6B84A]/60 px-3.5 sm:px-4 py-1.5 text-xs text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span className="flex items-center gap-0.5 font-bold tracking-tight">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                    <span className="text-white/90 font-normal ml-1">for Startups</span>
                  </span>

                  <span className="text-white/30">|</span>

                  <span className="font-extrabold tracking-wider text-rose-300 text-[11px]">
                    ANTLER
                  </span>

                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/30 text-amber-300 font-semibold">
                    Immersion EMEA
                  </span>

                  <span className="hidden sm:inline text-white/30">·</span>

                  <span className="hidden sm:inline text-white/80 group-hover:text-white transition-colors">
                    {tt("Offiziell ausgewählt", "Officially selected")}
                  </span>

                  <ArrowRight className="w-3.5 h-3.5 text-[#E6B84A] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
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

                className="mt-5 sm:mt-6 font-display text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[0.98] sm:leading-[0.95] text-white"
              >
                {audienceMode === "foodie" ? (
                  <>
                    {tt("Essen bestellen,", "Order food,")}

                    <br />

                    {tt("Tische reservieren &", "reserve tables &")}

                    <br />

                    <span className="text-[#E6B84A]">
                      {tt("Catering buchen.", "book catering.")}
                    </span>
                  </>
                ) : (
                  <>
                    {tt("Dein Restaurant.", "Your restaurant.")}

                    <br />

                    {tt("Dein Webshop.", "Your webshop.")}

                    <br />

                    <span className="text-[#E6B84A]">{tt("0 % Provision.", "0% Commission.")}</span>
                  </>
                )}
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

                className="mt-6 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed"
              >
                {audienceMode === "foodie"
                  ? tt(
                      "Direkt bestellen, ohne dass dein Lieblingslokal 30 % an Lieferportale abgibt. Plus bald verfügbare Rettertüten gegen Lebensmittelverschwendung und maßgeschneidertes B2B-Catering.",

                      "Order directly without your favorite restaurant paying 30% to middleman portals. Plus upcoming surplus food rescue and bespoke corporate catering.",
                    )
                  : tt(
                      "Schluss mit 30 % Lieferando-Gebühren. Unbegrenzte Bestellungen, Live-KDS Küchenmonitor und 100 % Gastdaten für faire 34,99 €/Monat.",

                      "Stop giving 30% to delivery portals. Unlimited orders, Live KDS kitchen monitor, and 100% customer data for fair 34.99 €/month.",
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
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 relative">
                    {verticals.map((v) => (
                      <Link
                        key={v.key}

                        id={`hero-tab-${v.key}`}

                        to={v.to}

                        onMouseEnter={() => handleVerticalChange(v.key)}

                        onClick={() => handleVerticalChange(v.key)}

                        className={`relative flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-5 py-2 sm:py-2.5 text-center text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none overflow-hidden ${
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

                        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 truncate">
                          {v.icon}

                          <span className="truncate">{v.label}</span>

                          {activeVertical !== v.key && (
                            <span className="hidden md:inline text-[10px] text-white/80 font-medium">
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

                className="relative max-w-xl"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    {audienceMode === "partner" ? (
                      <Globe className="h-5 w-5 text-[#b28a3c]" />
                    ) : searching ? (
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
                        if (audienceMode === "partner") {
                          if (searchQuery.trim()) {
                            trackEvent("partner_audit_hero_searched", {
                              query: searchQuery.trim(),
                            });
                          }

                          navigate({ to: "/partner/webseiten" });
                        } else {
                          handleAISearch();
                        }
                      }
                    }}

                    disabled={searching}

                    className="w-full rounded-full bg-white/95 backdrop-blur-md border-2 border-white/50 py-3.5 pl-14 pr-36 sm:pr-44 text-sm sm:text-base text-forest shadow-xl focus:border-[#b28a3c] focus:bg-white focus:outline-none transition-all placeholder:text-forest/45 disabled:opacity-80"

                    placeholder={
                      audienceMode === "partner"
                        ? tt(
                            "z.B. deine-domain.de für kostenlosen Speed- & SEO-Check...",

                            "e.g. your-domain.com for free speed & SEO check...",
                          )
                        : activeVertical === "restaurant"
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

                  <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                    <button
                      type="button"

                      onClick={() => {
                        if (audienceMode === "partner") {
                          if (searchQuery.trim()) {
                            trackEvent("partner_audit_hero_searched", {
                              query: searchQuery.trim(),
                            });
                          }

                          navigate({ to: "/partner/webseiten" });

                          return;
                        }

                        if (searchQuery.trim()) {
                          handleAISearch();
                        } else {
                          setIsConciergeOpen(true);
                        }
                      }}

                      disabled={searching}

                      className="bg-gradient-to-r from-[#b28a3c] via-[#c69a45] to-[#d6a538] hover:from-[#9a7633] hover:to-[#b28a3c] text-forest font-black rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm shadow-lg shadow-[#b28a3c]/30 hover:shadow-xl transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer border border-[#f4d58d]/50 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"

                      title={
                        audienceMode === "partner"
                          ? tt("Kostenlosen Website-Audit starten", "Start free website audit")
                          : tt("Finden & KI-Berater starten", "Find & start AI advisor")
                      }
                    >
                      {audienceMode === "partner" ? (
                        <>
                          <Globe className="h-4 w-4 text-forest shrink-0" />

                          <span>{tt("Audit starten", "Start Audit")}</span>
                        </>
                      ) : (
                        <>
                          {searching ? (
                            <Loader2 className="h-4 w-4 animate-spin text-forest shrink-0" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-forest shrink-0" />
                          )}

                          <span>{tt("Finden", "Find")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Refined Context Chips Row: Contextual suggestions & 6-city jump links */}

                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-bold text-white/85 uppercase tracking-wider shrink-0 mr-1">
                    {audienceMode === "partner"
                      ? tt("Werkzeuge:", "Tools:")
                      : tt("Vorschläge:", "Suggestions:")}
                  </span>

                  {audienceMode === "partner"
                    ? partnerChips.map((chip, i) => (
                        <Link
                          key={i}

                          to={chip.to}

                          onClick={() =>
                            trackEvent("hero_partner_chip_clicked", { label: chip.label })
                          }

                          className="inline-flex items-center rounded-full bg-white/[0.08] hover:bg-[#E6B84A] hover:text-forest text-white/85 border border-white/15 px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm"
                        >
                          {chip.label}
                        </Link>
                      ))
                    : scenarioChips.map((chip, i) => (
                        <button
                          key={i}

                          type="button"

                          onClick={() => {
                            startTransition(() => {
                              setSearchQuery(chip.query);

                              setIsConciergeOpen(true);
                            });
                          }}

                          className="inline-flex items-center rounded-full bg-white/[0.08] hover:bg-[#E6B84A] hover:text-forest text-white/85 border border-white/15 px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm"
                        >
                          {chip.label}
                        </button>
                      ))}

                  {/* 6 Direct City Jump Links for SEO & Quick Navigation */}

                  <div className="w-full sm:w-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5 sm:pt-0 sm:ml-auto">
                    <span className="text-[11px] font-bold text-white/85 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#E6B84A]" />

                      {tt("Städte:", "Cities:")}
                    </span>

                    {[
                      { name: "Berlin", slug: "berlin" },

                      { name: "München", slug: "muenchen" },

                      { name: "Hamburg", slug: "hamburg" },

                      { name: "Frankfurt", slug: "frankfurt" },

                      { name: "Köln", slug: "koeln" },

                      { name: "Düsseldorf", slug: "duesseldorf" },
                    ].map(({ name, slug }) => (
                      <a
                        key={slug}

                        href={
                          activeVertical === "restaurant"
                            ? `/restaurant/ort/${slug}`
                            : activeVertical === "planner"
                              ? `/planner/ort/${slug}`
                              : `/catering/ort/${slug}`
                        }

                        className="text-white/60 hover:text-[#E6B84A] underline-offset-4 hover:underline text-xs transition-colors"
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Social Proof & Trust Strip (Clean separation with luxury micro-cards) */}

                <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-y-3 text-white/80 text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A]" />

                    <span>
                      {tt("0 % Provision auf Direktbestellungen", "0% Commission on Direct Orders")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-medium">
                    <Star className="h-4 w-4 text-[#E6B84A] fill-[#E6B84A]" />

                    <span>
                      {tt(
                        "100 % unabhängige Visits: selbst besucht, selbst bezahlt",

                        "100% independent visits: self-visited, self-paid",
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-medium text-white/90">
                    <span className="text-[#f4d58d] font-bold">0 €</span>

                    <span>{tt("Kostenlos für Genießer", "100% Free for Foodies")}</span>
                  </div>

                  <Link
                    to="/partners"

                    aria-label={tt(
                      "Partner-Modell und Vorteile ansehen",
                      "View Partner benefits and pricing",
                    )}
                    className="text-[#f4d58d] hover:text-white transition-colors font-semibold inline-flex items-center gap-1"
                  >
                    <span>{tt("Partner werden →", "Become a Partner →")}</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Live Hospitality Hub 3D Floating Preview */}

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white/[0.07] backdrop-blur-xl border-2 border-white/20 p-6 sm:p-7 shadow-2xl overflow-hidden hover:border-[#E6B84A]/60 transition-all duration-500 ring-1 ring-[#E6B84A]/20 shadow-[0_0_50px_-12px_rgba(230,184,74,0.18)]">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#E6B84A]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Speisely Live Platform
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#E6B84A] bg-[#E6B84A]/10 px-2.5 py-0.5 rounded-full border border-[#E6B84A]/30">
                    {audienceMode === "foodie" ? "0 % Gebühren" : "34,99 € Flat"}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {audienceMode === "foodie" ? (
                    <>
                      {/* Capability 1: Direct Ordering */}

                      <Link
                        to="/restaurants"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "direct_ordering",

                            mode: "foodie",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 grid place-items-center">
                            <ShoppingBag className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt(
                                "1. Direktbestellung (0 % Provision)",

                                "1. Direct Ordering (0% Commission)",
                              )}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Stripe Connect Direktzahlung · Keine Mittelsmänner",

                                "Stripe Connect Direct · Zero Middlemen",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>

                      {/* Capability 2: Table & WhatsApp Reservations */}

                      <Link
                        to="/restaurants"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "whatsapp_reservations",

                            mode: "foodie",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 grid place-items-center">
                            <Clock className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt(
                                "2. Tisch & WhatsApp Reservierung",

                                "2. Table & WhatsApp Booking",
                              )}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "1-Klick WhatsApp & E-Mail · 0 € Pro-Kopf-Kosten",

                                "1-Click WhatsApp & E-Mail · Zero per-cover fees",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>

                      {/* Capability 3: Surplus Food Rescue */}

                      <Link
                        to="/restaurants"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "surplus_rescue",

                            mode: "foodie",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 grid place-items-center">
                            <Sparkles className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt("3. Rettertüten: bald verfügbar", "3. Food Rescue: coming soon")}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Gutes Essen retten & Food-Waste aktiv senken",

                                "Rescue delicious food & reduce food waste",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>

                      {/* Capability 4: B2B Event Catering */}

                      <Link
                        to="/catering"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "b2b_catering",

                            mode: "foodie",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 grid place-items-center">
                            <Users className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt("4. B2B Event-Catering", "4. B2B Event Catering")}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Geprüfte Caterer & strukturierte Briefings",

                                "Vetted caterers & structured briefs",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Partner Feature 1: High-End Webdesign */}

                      <Link
                        to="/partner/webseiten"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "high_end_website",

                            mode: "partner",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#E6B84A] grid place-items-center">
                            <Globe className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt("1. High-End Gastro-Website", "1. High-End Gastro Website")}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Schnelle Ladezeiten · Eigene Domain · Mobiloptimiert",

                                "Fast loading · Custom domain · Mobile-optimized",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>

                      {/* Partner Feature 2: Google KI-SEO, GEO & AEO */}

                      <Link
                        to="/partner/webseiten"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "google_ai_seo",

                            mode: "partner",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 grid place-items-center">
                            <Bot className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt(
                                "2. Google-KI & AEO Optimierung",

                                "2. Google AI & AEO Optimization",
                              )}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "ChatGPT & Perplexity Zitate · Lokales Ranking",

                                "ChatGPT & Perplexity citations · Local GEO rank",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>

                      {/* Partner Feature 3: Live-KDS & CloudPRNT */}

                      <a
                        href="/restaurant/kitchen"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "live_kds_monitor",

                            mode: "partner",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 grid place-items-center">
                            <Receipt className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt("3. Live-KDS Küchenmonitor", "3. Live KDS Kitchen Display")}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Bondrucker & Tablet-Steuerung ohne App-Zwang",

                                "Receipt printer & tablet control, zero app lock-in",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </a>

                      {/* Partner Feature 4: 0% Direct Checkout */}

                      <Link
                        to="/partners"

                        hash="calculator"

                        onClick={() =>
                          trackEvent("hero_capability_clicked", {
                            capability: "savings_calculator",

                            mode: "partner",
                          })
                        }

                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 grid place-items-center">
                            <Percent className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#E6B84A] transition">
                              {tt(
                                "4. Rechner: 30 % Lieferando sparen",

                                "4. Calculator: Save 30% cuts",
                              )}
                            </div>

                            <div className="text-xs text-white/60">
                              {tt(
                                "Bis zu 23.000 € Ersparnis/Jahr berechnen",

                                "Calculate up to €23,000 yearly savings",
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/75 group-hover:text-white group-hover:translate-x-1 transition" />
                      </Link>
                    </>
                  )}
                </div>

                {/* Live KDS & Printer Integration Badge */}

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#E6B84A]" />

                    <span>{tt("Live-KDS & CloudPRNT fähig", "Live KDS & CloudPRNT ready")}</span>
                  </div>

                  <a
                    href="/restaurant/kitchen"

                    className="font-bold text-[#E6B84A] hover:underline"
                  >
                    {tt("KDS Demo ↗", "KDS Demo ↗")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────



          ILLUMINATED BENTO TRUST GRID — Real USPs Highlight



      ───────────────────────────────────────────────── */}

      <section className="bg-gradient-to-b from-[#0a1f16] to-[#081812] border-t border-b border-white/10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E6B84A]">
              {tt("Warum Speisely?", "Why Speisely?")}
            </span>

            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-white">
              {tt(
                "Kein Mittelsmann. Echte Wertschöpfung für Gastronomie & Genießer.",

                "Zero Middlemen. Real value for restaurants and foodies.",
              )}
            </h2>
          </div>

          {/* Accelerator & Institutional Validation Card */}

          <div className="mb-8 rounded-3xl bg-gradient-to-r from-forest via-[#0d3f28] to-forest border-2 border-white/15 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-white p-1">
                <img
                  src="/images/google-antler-immersion-thumb.webp"
                  loading="lazy"
                  decoding="async"

                  alt="Google for Startups Immersion EMEA powered by Antler"

                  className="w-full h-full object-cover rounded-xl"

                  width="64"

                  height="64"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E6B84A] text-forest mb-1">
                  OFFIZIELL AUSGEWÄHLT · EMEA 2026
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Google for Startups Immersion · Powered by Antler
                </h3>

                <p className="text-xs text-white/70 max-w-xl">
                  {tt(
                    "Speisely baut Deutschlands faire digitale Gastronomie- und Catering-Infrastruktur – offiziell ausgewählt für das Google for Startups Immersion Programm.",

                    "Speisely builds Germany's direct hospitality and catering ecosystem – selected for the Google for Startups Immersion program.",
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#E6B84A] whitespace-nowrap">
                Phase 1: Selected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Tile 1: 0% Commission */}

            <Link
              to="/restaurants"

              onClick={() => trackEvent("bento_tile_clicked", { tile: "direct_ordering" })}

              className="rounded-3xl bg-white/[0.05] backdrop-blur-md border border-white/15 p-6 hover:border-[#E6B84A]/60 hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-white mb-1">
                0 % {tt("Provision", "Commission")}
              </div>

              <div className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                {tt("Direktbestellung", "Direct Ordering")}
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {tt(
                  "100 % deiner Rechnung geht an die Küche. Keine 30 % Lieferando-Gebühren für das Restaurant.",

                  "100% of your bill goes straight to the kitchen. Zero 30% aggregator cuts.",
                )}
              </p>
            </Link>

            {/* Tile 2: Table & WhatsApp Reservations */}

            <Link
              to="/restaurants"

              onClick={() => trackEvent("bento_tile_clicked", { tile: "whatsapp_reservations" })}

              className="rounded-3xl bg-white/[0.05] backdrop-blur-md border border-white/15 p-6 hover:border-[#E6B84A]/60 hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-white mb-1">
                {tt("WhatsApp & Tisch", "WhatsApp & Tables")}
              </div>

              <div className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                {tt("1-Klick & 0 € Provision", "1-Click & Zero Commission")}
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {tt(
                  "Tische via WhatsApp & E-Mail in Sekunden buchen. Restaurants behalten 100 % Gastdaten und zahlen 0 € pro Gast.",

                  "Book tables via WhatsApp & E-Mail in seconds. Hosts retain 100% guest data and pay zero per cover.",
                )}
              </p>
            </Link>

            {/* Tile 3: Surplus Food Rescue */}

            <Link
              to="/restaurants"

              onClick={() => trackEvent("bento_tile_clicked", { tile: "surplus_food_rescue" })}

              className="rounded-3xl bg-white/[0.05] backdrop-blur-md border border-white/15 p-6 hover:border-[#E6B84A]/60 hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-white mb-1">
                {tt("Rettertüten: bald verfügbar", "Surplus Rescue: coming soon")}
              </div>

              <div className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                {tt("Gegen Food-Waste", "Against Food Waste")}
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {tt(
                  "Überhanggerichte zu fairen Preisen retten. Nachhaltig für die Umwelt, rentabel für die Küche.",

                  "Rescue fresh surplus meals at fair prices. Sustainable for the planet, profitable for the kitchen.",
                )}
              </p>
            </Link>

            {/* Tile 4: B2B Event Catering */}

            <Link
              to="/catering"

              onClick={() => trackEvent("bento_tile_clicked", { tile: "b2b_catering" })}

              className="rounded-3xl bg-white/[0.05] backdrop-blur-md border border-white/15 p-6 hover:border-[#E6B84A]/60 hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-white mb-1">
                B2B &amp; {tt("Events", "Events")}
              </div>

              <div className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                {tt("Geprüfte Caterer", "Vetted Caterers")}
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {tt(
                  "Vom Office Lunch bis zur 500-Gäste-Gala: Strukturierte Briefings und transparente Direktangebote.",

                  "From team lunches to 500-guest galas: Structured briefs and transparent direct proposals.",
                )}
              </p>
            </Link>

            {/* Tile 5: Custom Websites & Google KI-SEO / GEO */}

            <Link
              to="/partner/webseiten"

              onClick={() => trackEvent("bento_tile_clicked", { tile: "custom_websites_ai" })}

              className="rounded-3xl bg-white/[0.05] backdrop-blur-md border border-white/15 p-6 hover:border-[#E6B84A] hover:bg-white/[0.08] transition-all duration-300 group cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black text-white mb-1">
                Websites &amp; KI
              </div>

              <div className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                {tt("Google KI-SEO & AEO", "Google AI SEO & AEO")}
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {tt(
                  "Schnelle Ladezeiten, eigene Domain & ChatGPT / Perplexity Zitate. Powered by TechGlanz.",

                  "Fast loading, custom domain & ChatGPT / Perplexity citations. Powered by TechGlanz.",
                )}
              </p>
            </Link>
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



          Highlights Agency Capability: Custom Websites, Google KI-SEO, GEO & AEO



      ───────────────────────────────────────────────── */}

      <section className="bg-cream border-t border-b border-[#eadfce] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-forest/5 border border-forest/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-forest mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />

                <span>Speisely Digital Suite · High-End Webdesign &amp; GEO / AEO</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl text-forest font-bold leading-tight">
                Wir bauen High-End Websites <br />
                <span className="text-[#A85C36]">mit Google-KI-SEO, GEO &amp; AEO Setup.</span>
              </h2>

              <p className="mt-3 text-sm sm:text-base text-forest/75 max-w-2xl leading-relaxed">
                Schluss mit langsamen 5.000 € WordPress-Seiten. Wir entwickeln maßgeschneiderte,
                blitzschnelle Webauftritte für Caterer &amp; Gastronomen — optimiert für Google AI
                Overviews, Perplexity &amp; ChatGPT-Zitate mit integrierter Buchungsengine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/partner/webseiten"

                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-6 py-3.5 text-sm font-bold shadow-lg hover:bg-[#b28a3c] transition whitespace-nowrap"
              >
                <span>Kostenlosen Website-Audit starten</span>

                <ArrowRight className="h-4 w-4 text-[#E6B84A]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case 1: Partyservice Küpper */}

            <div className="rounded-3xl bg-white border-2 border-forest/10 p-7 sm:p-8 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-[#A85C36] tracking-wider">
                    BBQ &amp; Event-Catering NRW · Live Referenz
                  </span>

                  <Link
                    to="/case-study/partyservice-kuepper"

                    aria-label="Live Case Study: Partyservice Küpper BBQ & Event-Catering NRW"
                    className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 hover:bg-emerald-200 transition"
                  >
                    Live Case Study ⭐
                  </Link>
                </div>

                {/* Luxury Browser Mockup Preview */}

                <Link
                  to="/case-study/partyservice-kuepper"

                  className="block relative rounded-2xl overflow-hidden border border-forest/15 bg-black/5 shadow-inner mb-6 group-hover:border-[#E6B84A] transition-all"
                >
                  <div className="bg-[#1e2922] px-3.5 py-2 flex items-center gap-1.5 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />

                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />

                    <div className="ml-2 text-[10px] text-white/85 font-mono tracking-tight truncate">
                      https://partyservicekuepper.de
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden bg-forest/20">
                    <img
                      src="/showcase-kuepper.png"

                      alt="Partyservice Küpper High-End Website"

                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"

                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>

                <Link
                  to="/case-study/partyservice-kuepper"

                  className="block group-hover:text-[#A85C36] transition"
                >
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-forest mb-2 group-hover:text-[#A85C36] transition">
                    Partyservice Küpper
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-forest/75 leading-relaxed mb-6">
                  Von statischem PDF zum volldigitalen Flaggschiff-Auftritt: All-Inclusive
                  BBQ-Pakete, interaktiver Event-Kalkulator und strukturierte GEO / AEO Schema.org
                  Daten für regionale Google-KI-Sichtbarkeit.
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-bold text-forest/80 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-800">
                    ⚡ Schnelle Ladezeiten, mobiloptimiert
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-purple-800">
                    🤖 Google AI / AEO Ready
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-amber-800">
                    🥩 All-Inclusive BBQ
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10">
                    📱 Event-Kalkulator
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                <span className="text-xs text-forest/80 font-mono font-medium">
                  partyservicekuepper.de
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/partyservice-kuepper"

                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-4 py-2 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
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

            <div className="rounded-3xl bg-white border-2 border-forest/10 p-7 sm:p-8 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-[#A85C36] tracking-wider">
                    Traditions-Gastronomie &amp; Eventlokal · Live Referenz
                  </span>

                  <Link
                    to="/case-study/haus-spaas"

                    aria-label="Live Case Study: Haus Spaas Traditions-Gastronomie & Eventlokal"
                    className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 hover:bg-emerald-200 transition"
                  >
                    Live Case Study ⭐
                  </Link>
                </div>

                {/* Luxury Browser Mockup Preview */}

                <Link
                  to="/case-study/haus-spaas"

                  className="block relative rounded-2xl overflow-hidden border border-forest/15 bg-black/5 shadow-inner mb-6 group-hover:border-[#E6B84A] transition-all"
                >
                  <div className="bg-[#1e2922] px-3.5 py-2 flex items-center gap-1.5 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />

                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />

                    <div className="ml-2 text-[10px] text-white/85 font-mono tracking-tight truncate">
                      https://haus-spaas.de
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden bg-forest/20">
                    <img
                      src="/showcase-haus-spaas.png"

                      alt="Haus Spaas High-End Website & WhatsApp Engine"

                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"

                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>

                <Link
                  to="/case-study/haus-spaas"

                  className="block group-hover:text-[#A85C36] transition"
                >
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-forest mb-2 group-hover:text-[#A85C36] transition">
                    Haus Spaas
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-forest/75 leading-relaxed mb-6">
                  Von der PDF-Speisekarte zur direkten WhatsApp-Reservierung: Duales
                  Speisekarten-System (Oktoberfest &amp; Klassik), direkte 1-Klick WhatsApp- &amp;
                  E-Mail-Reservierung und schnelle Google-Ladezeiten ohne Mittelsmann-Provision.
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-bold text-forest/80 mb-6">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-800">
                    💬 WhatsApp-Reservierung
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-purple-800">
                    ⚡ Schnelle Ladezeiten, mobiloptimiert
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-700">
                    🥨 Duale Speisekarte
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-forest/10 text-amber-800">
                    📱 0 % Provision
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                <span className="text-xs text-forest/80 font-mono font-medium">haus-spaas.de</span>

                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/haus-spaas"

                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-4 py-2 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
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



          SPEISELY VISITS & COMMUNITY EDITORIAL REEL



      ───────────────────────────────────────────────── */}

      <section className="bg-forest text-white py-20 lg:py-28 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E6B84A] block mb-2">
                {tt("Echte Restaurantbesuche & Stories", "Authentic Field Reports & Stories")}
              </span>

              <h2 className="font-display text-3xl sm:text-5xl text-white font-bold leading-tight">
                {tt("Speisely Visits.", "Speisely Visits.")} <br />
                <span className="text-[#E6B84A]">
                  {tt(
                    "Vor Ort getestet, unabhängig bezahlt.",

                    "Tested on-site, independently paid.",
                  )}
                </span>
              </h2>
            </div>

            <Link
              to="/magazin"

              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#E6B84A] transition whitespace-nowrap"
            >
              <span>{tt("Alle Magazin-Stories ansehen", "View all magazine stories")}</span>

              <ArrowRight className="h-4 w-4 text-[#E6B84A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Story 1: Seydioğlu Baklava Burger (Frankfurt & Rhein-Main) */}

            <Link
              to="/magazin/community/seydioglu-baklava-burger"

              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-black/40">
                <img
                  src="/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=3"

                  alt="Seydioğlu Baklava Burger Frankfurt"

                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"

                  loading="lazy"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[11px] font-extrabold px-3 py-1 shadow">
                    Community Story
                  </span>

                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1">
                    📍 Frankfurt
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#E6B84A] transition">
                  {tt(
                    "Wenn Baklava auf Pistazien-Lava trifft: Seydioğlu",

                    "When Baklava Meets Warm Pistachio Lava: Seydioğlu",
                  )}
                </h3>

                <p className="text-xs text-white/70 line-clamp-3 leading-relaxed flex-1 mb-4">
                  {tt(
                    "Der virale Baklava Burger mit Maraş-Eis, heiße Künefe und traditionelle Antep-Pistazienspezialitäten im Rhein-Main-Gebiet.",

                    "The viral Baklava Burger with Maraş ice cream, hot künefe, and authentic Antep pistachio craft in Rhine-Main.",
                  )}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>

                  <span className="text-white/80 font-medium">5 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 2: Mandy Berlin-Neukölln */}

            <Link
              to="/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln"

              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative h-60 overflow-hidden bg-black/40">
                <img
                  src="/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.webp?v=2"

                  alt="Mandy Lamm für zwei Berlin-Neukölln"

                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"

                  loading="lazy"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-[#16382b] text-white border border-[#7FA46B]/50 text-[11px] font-extrabold px-3 py-1 shadow">
                    Speisely Visits
                  </span>

                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1">
                    📍 Berlin-Neukölln
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#E6B84A] transition">
                  {tt(
                    "Warum wir bei Mandy natürlich Mandy bestellen mussten",

                    "Why at Mandy We Naturally Had to Order Mandy",
                  )}
                </h3>

                <p className="text-xs sm:text-sm text-white/70 line-clamp-3 leading-relaxed flex-1 mb-4">
                  {tt(
                    "Mandy Lamm für zwei mit Safranreis, frischen Kräutern und Chai. Authentischer Vor-Ort-Besuch in der Wildenbruchstraße.",

                    "Mandy Lamb for two with saffron rice, herbs, and chai. Authentic on-site visit in Wildenbruchstraße.",
                  )}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>

                  <span className="text-white/80 font-medium">5 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 2: King Tut Wilmersdorf */}

            <Link
              to="/magazin/community/king-tut-restaurant-berlin"

              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative h-60 overflow-hidden bg-black/40">
                <img
                  src="/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg?v=2"

                  alt="King Tut Restaurant Berlin"

                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"

                  loading="lazy"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[11px] font-extrabold px-3 py-1 shadow">
                    Community Story
                  </span>

                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1">
                    📍 Berlin-Wilmersdorf
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#E6B84A] transition">
                  {tt(
                    "Hawawshi & Holzkohlegrill auf Silberplatten: King Tut",

                    "Hawawshi & Charcoal Grill on Silver Platters: King Tut",
                  )}
                </h3>

                <p className="text-xs sm:text-sm text-white/70 line-clamp-3 leading-relaxed flex-1 mb-4">
                  {tt(
                    "Knuspriges Hawawshi, grüne Molokhia und kaiserliche Silberplatten mit Holzkohlegrill am Hohenzollerndamm.",

                    "Crisp hawawshi, green molokhia, and imperial silver platters with charcoal grill at Hohenzollerndamm.",
                  )}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>

                  <span className="text-white/80 font-medium">6 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 3: Baba Pirzola Wittenbergplatz */}

            <Link
              to="/magazin/community/baba-pirzola-berlin"

              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative h-60 overflow-hidden bg-black/40">
                <img
                  src="/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=4"

                  alt="Baba Pirzola Meze und Grill Berlin"

                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"

                  loading="lazy"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[11px] font-extrabold px-3 py-1 shadow">
                    Community Story
                  </span>

                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1">
                    📍 Berlin-Schöneberg
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#E6B84A] transition">
                  {tt(
                    "Feuer, Meze & große Grillkunst: Baba Pirzola",

                    "Fire, Meze & Masterful Grilling: Baba Pirzola",
                  )}
                </h3>

                <p className="text-xs sm:text-sm text-white/70 line-clamp-3 leading-relaxed flex-1 mb-4">
                  {tt(
                    "Kuzu Pirzola, Lokum Bonfile, rauchiges Nazik Ali und warmes Katmer mit Eis am Wittenbergplatz.",

                    "Kuzu Pirzola, Lokum Bonfile, smoky Nazik Ali, and warm katmer with ice cream at Wittenbergplatz.",
                  )}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>

                  <span className="text-white/80 font-medium">7 Min.</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

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
              <span className="inline-flex items-center gap-3 rounded-full bg-[#E6B84A] text-forest px-8 py-5 text-base font-bold shadow-xl shadow-[#E6B84A]/25 transition-all group-hover:scale-105 group-hover:bg-[#d4a73b] whitespace-nowrap">
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
