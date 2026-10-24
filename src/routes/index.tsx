import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";

import { useServerFn } from "@tanstack/react-start";

import { classifySearchIntent } from "@/lib/search/ai.functions";

import { classifyWithSystem1 } from "@/lib/decision/system1";

import { trackEvent } from "@/utils/posthog";

import { useState, useEffect, useMemo, useCallback, useDeferredValue, useTransition } from "react";

import {
  ArrowRight,
  BookOpen,
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

import { lazy, Suspense } from "react";
const AiConciergeModal = lazy(() =>
  import("@/components/search/AiConciergeModal").then((m) => ({
    default: m.AiConciergeModal,
  })),
);

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
        type: "image/webp",
        media: "(max-width: 1023px)",
      },
      {
        rel: "preload",
        href: "/hero-cinematic.webp",
        as: "image",
        type: "image/webp",
        media: "(min-width: 1024px)",
      },

      { rel: "sitemap", type: "application/xml", href: "https://speisely.de/sitemap.xml" },
    ],

    scripts: [
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

        {/* Unified Responsive Hero Background */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[48%] z-0 pointer-events-none overflow-hidden">
          <picture className="w-full h-full">
            <source
              media="(max-width: 1023px)"
              srcSet="/hero-cinematic-mobile.webp"
              type="image/webp"
            />
            <source media="(min-width: 1024px)" srcSet="/hero-cinematic.webp" type="image/webp" />
            <img
              src="/hero-cinematic-mobile.webp"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={tt(
                "Speisely – Premium Gastronomie & Events",
                "Speisely – Premium Hospitality & Events",
              )}
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {/* Desktop gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent hidden lg:block" />

          {/* Mobile dimming overlay */}
          <div className="absolute inset-0 bg-forest/85 lg:hidden" />
        </div>

        {/* Hero text & interactive content */}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
          {/* Top Control Bar: Audience Toggle & Google for Startups Trust Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mb-8">
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

            <Link
              to="/blog/$slug"
              params={{ slug: "speisely-google-for-startups-immersion-emea" }}
              className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-md border border-white/20 hover:border-[#E6B84A]/60 px-3.5 sm:px-4 py-1.5 text-xs text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer self-start sm:self-auto"
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

              initial={false}
              animate="visible"
              className="lg:col-span-7 max-w-2xl"
            >
              {/* Kicker Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E6B84A]/30 text-xs text-[#E6B84A] font-semibold tracking-wider uppercase mb-4 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" />
                <span>
                  {tt("Das kuratierte Gastronomie-Netzwerk", "The Curated Gastronomy Network")}
                </span>
              </div>

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
                className="font-display text-[1.85rem] sm:text-[3.25rem] lg:text-[4.25rem] leading-[1.12] sm:leading-[1.02] text-white tracking-tight break-words"
              >
                {audienceMode === "foodie" ? (
                  <>
                    {tt("Catering, Partyservice &", "Catering, party service &")}
                    <span className="block font-serif italic font-normal text-[#E6B84A] mt-1 sm:mt-1.5">
                      <span className="block sm:inline">
                        {tt("außergewöhnliche", "exceptional")}
                      </span>{" "}
                      <span className="block sm:inline">{tt("Gastronomie.", "gastronomy.")}</span>
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
                className="mt-5 text-base sm:text-lg text-white/85 max-w-xl leading-relaxed font-sans"
              >
                {audienceMode === "foodie"
                  ? tt(
                      "Handverlesene Caterer und Meisterköche für Firmenfeiern, Hochzeiten und besondere Anlässe in ganz Deutschland — transparent, persönlich und ohne Mittelsmann-Aufschlag.",
                      "Handcrafted catering and master chefs for corporate galas, weddings, and private events across Germany — transparent, personal, and without middlemen markups.",
                    )
                  : tt(
                      "Schluss mit 30 % Drittanbieter-Gebühren. Unbegrenzte Bestellungen, Live-KDS Küchenmonitor und 100 % Gastdaten für faire 34,99 €/Monat.",
                      "Stop giving 30% to delivery portals. Unlimited orders, Live KDS kitchen monitor, and 100% customer data for fair 34.99 €/month.",
                    )}
              </motion.p>

              {/* Unified Floating Luxury Concierge Card (Option A) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: "easeOut" },
                  },
                }}
                className="mt-7 rounded-3xl border border-white/20 bg-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden"
              >
                {/* Ambient subtle warm gold corner glow */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E6B84A]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Integrated Category Pill Selector */}
                <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-black/30 border border-white/10 mb-4 w-full sm:w-fit overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => handleVerticalChange("catering")}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeVertical === "catering"
                        ? "bg-[#E6B84A] text-forest shadow-md font-bold"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>{tt("Catering & Buffets", "Catering & Buffets")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerticalChange("restaurant")}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeVertical === "restaurant"
                        ? "bg-[#E6B84A] text-forest shadow-md font-bold"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{tt("Restaurants", "Restaurants")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerticalChange("planner")}
                    className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeVertical === "planner"
                        ? "bg-[#E6B84A] text-forest shadow-md font-bold"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <PartyPopper className="w-3.5 h-3.5" />
                    <span>{tt("Event-Planung", "Event Planning")}</span>
                  </button>
                </div>

                {/* Search Omnibar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {audienceMode === "partner" ? (
                      <Globe className="h-4 w-4 text-[#b28a3c]" />
                    ) : searching ? (
                      <Loader2 className="h-4 w-4 text-[#b28a3c] animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-[#E6B84A]" />
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
                    className="w-full rounded-2xl bg-white py-3 pl-10 pr-28 sm:py-3.5 sm:pl-11 sm:pr-36 text-xs sm:text-sm text-forest shadow-inner placeholder:text-forest/45 focus:outline-none focus:ring-2 focus:ring-[#E6B84A] transition-all disabled:opacity-80"
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

                  {/* High-End Radiant Action Button */}
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
                      className="bg-forest hover:bg-forest-light text-[#F6F4EB] font-bold rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm shadow-md transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer border border-[#E6B84A]/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#E6B84A] shrink-0" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-[#E6B84A] shrink-0" />
                      )}
                      <span>{tt("Finden", "Find")}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#E6B84A] shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Charming Context Taste Tags & Inline Cities */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider shrink-0">
                      {audienceMode === "partner"
                        ? tt("Werkzeuge:", "Tools:")
                        : tt("Beliebt:", "Trending:")}
                    </span>
                    {audienceMode === "partner"
                      ? partnerChips.map((chip, i) => (
                          <Link
                            key={i}
                            to={chip.to}
                            onClick={() =>
                              trackEvent("hero_partner_chip_clicked", { label: chip.label })
                            }
                            className="inline-flex items-center rounded-full bg-white/10 hover:bg-[#E6B84A] hover:text-forest text-white/85 px-2.5 py-0.5 text-[11px] font-medium transition-colors"
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
                            className="inline-flex items-center rounded-full bg-white/10 hover:bg-[#E6B84A] hover:text-forest text-white/85 px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {chip.label}
                          </button>
                        ))}
                  </div>

                  {/* Direct City Jump Links */}
                  <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                    <MapPin className="h-3 w-3 text-[#E6B84A] shrink-0" />
                    {[
                      { name: "Berlin", slug: "berlin" },
                      { name: "München", slug: "muenchen" },
                      { name: "Hamburg", slug: "hamburg" },
                      { name: "Köln", slug: "koeln" },
                    ].map(({ name, slug }, idx) => (
                      <span key={slug} className="flex items-center gap-1.5">
                        <a
                          href={
                            activeVertical === "restaurant"
                              ? `/restaurant/ort/${slug}`
                              : activeVertical === "planner"
                                ? `/planner/ort/${slug}`
                                : `/catering/ort/${slug}`
                          }
                          className="hover:text-white transition-colors"
                        >
                          {name}
                        </a>
                        {idx < 3 && <span className="text-white/30">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Social Proof & Trust Strip */}
              <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-white/80">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#E6B84A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#E6B84A]" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9/5</span>
                  <span className="text-white/60 font-sans">
                    ({tt("180+ geprüfte Tastings", "180+ verified tastings")})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-white/85 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#E6B84A]" />
                  <span>{tt("0 % Mittelsmann-Aufschlag", "0% Middleman Markup")}</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/85 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#E6B84A]" />
                  <span>{tt("100 % Direkter Caterer-Kontakt", "100% Direct Caterer Contact")}</span>
                </div>

                <Link
                  to="/partners"
                  className="text-[#E6B84A] hover:text-white transition-colors font-semibold inline-flex items-center gap-1 ml-auto"
                >
                  <span>{tt("Partner werden →", "Become a Partner →")}</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Luxury Passe-Partout Food Card / Partner Tech Hub */}

            <div className="lg:col-span-5">
              {audienceMode === "foodie" ? (
                /* Foodie Mode: Breathtaking 4:3 Luxury Culinary Showcase Card (Strict Rule 10 Passe-Partout) */
                <div className="relative group">
                  {/* Subtle warm luxury glow behind the card */}
                  <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#E6B84A]/25 via-emerald-500/10 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                  {/* Passe-Partout Outer Frame */}
                  <div className="relative rounded-3xl border-2 border-white/20 bg-white/[0.08] backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl transition-all duration-300 group-hover:border-[#E6B84A]/60 shadow-[0_0_50px_-12px_rgba(230,184,74,0.18)]">
                    {/* Inner 4:3 Aspect Ratio Image Frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/40 border border-white/10 shadow-inner">
                      <img
                        src="/images/event_catering_hero.webp?v=3"
                        alt={tt(
                          "Exklusives Gourmet Event-Catering auf Speisely",
                          "Exclusive Gourmet Event Catering on Speisely",
                        )}
                        className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                        fetchPriority="high"
                      />

                      {/* Top Corner Subtle Status Tag (Unobstructed: placed neatly in corner) */}
                      <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-forest/85 backdrop-blur-md border border-[#E6B84A]/40 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        <Star className="w-3.5 h-3.5 text-[#E6B84A] fill-[#E6B84A]" />
                        <span>4.9 ★ {tt("Verifizierte Meisterbetriebe", "Verified Caterers")}</span>
                      </div>
                    </div>

                    {/* Figure Caption Bar (Rule 10: 100% Unobstructed Food Showcase) */}
                    <div className="pt-4 pb-1 px-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {tt("Event- & Firmen-Catering", "Event & Corporate Catering")}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                          {tt("0 % Buchungsgebühren", "0% Booking Fees")}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E6B84A] transition-colors leading-snug">
                        {tt(
                          "Gourmet-Buffets, Fingerfood & Live-Cooking",
                          "Gourmet Buffets, Fingerfood & Live Cooking",
                        )}
                      </h3>

                      <p className="mt-1 text-xs text-white/75 leading-relaxed">
                        {tt(
                          "Von geprüften Meisterbetrieben frisch zubereitet. Perfekt für Firmenfeiern, Hochzeiten und private Feste in Berlin & bundesweit.",
                          "Freshly crafted by verified master caterers. Ideal for corporate galas, weddings, and private celebrations across Germany.",
                        )}
                      </p>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            {tt("Direktkontakt & Festpreis", "Direct contact & fixed pricing")}
                          </span>
                        </div>

                        <Link
                          to="/catering"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B84A] hover:bg-[#d4a73b] text-forest font-bold text-xs px-3.5 py-1.5 shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                        >
                          <span>{tt("Catering anfragen", "Request Catering")}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-forest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Partner Mode: Speisely Tech Ecosystem & Agency Showcase (Pillars 1, 2, 3) */
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#E6B84A]/30 via-sky-500/10 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                  <div className="relative rounded-3xl border-2 border-white/20 bg-white/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300 group-hover:border-[#E6B84A]/60 shadow-[0_0_50px_-12px_rgba(230,184,74,0.18)]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {tt("Speisely Partner-Ökosystem", "Speisely Partner Ecosystem")}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#E6B84A] bg-[#E6B84A]/10 px-2.5 py-0.5 rounded-full border border-[#E6B84A]/30 font-bold">
                        3 Säulen
                      </span>
                    </div>

                    {/* 3 Pillars List */}
                    <div className="space-y-2.5">
                      {/* Pillar 1: Webshop inside Marketplace */}
                      <Link
                        to="/partners"
                        className="block p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#E6B84A]/50 transition group/p cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 grid place-items-center shrink-0">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover/p:text-[#E6B84A] transition">
                                {tt(
                                  "1. Speisely Webshop (0 % Provision)",
                                  "1. Speisely Webshop (0% Commission)",
                                )}
                              </div>
                              <div className="text-[11px] text-white/65">
                                {tt(
                                  "34,99 € Flatrate · Live-KDS Küchenmonitor · Gastdaten gehören dir",
                                  "34.99 € flatrate · Live KDS · 100% your customer data",
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/60 group-hover/p:text-white group-hover/p:translate-x-0.5 transition" />
                        </div>
                      </Link>

                      {/* Pillar 2: Bespoke Agency Website (TechGlanz x Speisely) with SEO, AEO & GEO */}
                      <Link
                        to="/partner/webseiten"
                        className="block p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#E6B84A]/50 transition group/p cursor-pointer ring-1 ring-[#E6B84A]/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#E6B84A] grid place-items-center shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover/p:text-[#E6B84A] transition flex items-center gap-1.5">
                                <span>
                                  {tt(
                                    "2. Individuelle Website (TechGlanz)",
                                    "2. Bespoke Website (TechGlanz)",
                                  )}
                                </span>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#E6B84A]/20 text-[#E6B84A] font-extrabold border border-[#E6B84A]/40">
                                  SEO · AEO · GEO
                                </span>
                              </div>
                              <div className="text-[11px] text-white/65">
                                {tt(
                                  "PageSpeed 99+ · Google-KI, ChatGPT & Perplexity Optimierung",
                                  "PageSpeed 99+ · Google AI, ChatGPT & Perplexity ranking",
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/60 group-hover/p:text-white group-hover/p:translate-x-0.5 transition" />
                        </div>
                      </Link>

                      {/* Pillar 3: Speisely Magazin Editorial */}
                      <Link
                        to="/magazin"
                        className="block p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#E6B84A]/50 transition group/p cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 grid place-items-center shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white group-hover/p:text-[#E6B84A] transition">
                                {tt("3. Speisely Magazin Reportage", "3. Speisely Magazine Story")}
                              </div>
                              <div className="text-[11px] text-white/65">
                                {tt(
                                  "Authentischer Restaurant-Visit · 4:3 Food-Fotografie · B2B Vertrauen",
                                  "Authentic dining visit · 4:3 food photography · B2B trust",
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/60 group-hover/p:text-white group-hover/p:translate-x-0.5 transition" />
                        </div>
                      </Link>
                    </div>

                    {/* Bottom CTA for Partners */}
                    <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                      <div className="text-xs text-white/70">
                        {tt("Unverbindliche Beratung & Live-Demo", "Free consultation & live demo")}
                      </div>
                      <Link
                        to="/partner/webseiten"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B84A] hover:bg-[#d4a73b] text-forest font-bold text-xs px-3.5 py-1.5 shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                      >
                        <span>{tt("Lösungen entdecken", "Explore Solutions")}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-forest" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          ILLUMINATED BENTO TRUST GRID — Real USPs Highlight (Compact Luxury)
      ───────────────────────────────────────────────── */}

      <section className="bg-gradient-to-b from-[#0a1f16] to-[#081812] border-t border-b border-white/10 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E6B84A]">
              {tt(
                "WARUM SPEISELY? · DAS FAIRE GASTRO-ÖKOSYSTEM",
                "WHY SPEISELY? · THE FAIR HOSPITALITY ECOSYSTEM",
              )}
            </span>

            <h2 className="mt-2 font-display text-xl sm:text-3xl text-white">
              {tt(
                "Kein Mittelsmann. Echte Wertschöpfung für Gastronomie & Genießer.",
                "Zero Middlemen. Real value for restaurants and foodies.",
              )}
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-white/70 max-w-xl mx-auto">
              {tt(
                "Transparente Konditionen, modernste Web-Technologie und faire Partnerschaft auf Augenhöhe.",
                "Transparent terms, cutting-edge web technology, and fair partnership at eye level.",
              )}
            </p>
          </div>

          {/* Sleek Horizontal Hard-Metrics Bar */}
          <div className="mb-6 rounded-2xl bg-white/[0.04] border border-white/10 p-3 sm:px-6 sm:py-3.5 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 sm:pt-0">
              <span className="text-lg sm:text-xl font-black text-[#E6B84A] whitespace-nowrap shrink-0">
                0 %
              </span>
              <span className="text-[11px] text-white/80 font-medium leading-tight">
                {tt("Provision auf Direktbestellungen", "Direct order commission")}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 sm:pt-0 sm:pl-5">
              <span className="text-lg sm:text-xl font-black text-emerald-400 whitespace-nowrap shrink-0">
                100 %
              </span>
              <span className="text-[11px] text-white/80 font-medium leading-tight">
                {tt("Gastdaten gehören dem Wirt", "Hosts own 100% guest data")}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 sm:pt-0 sm:pl-5">
              <span className="text-lg sm:text-xl font-black text-[#E6B84A] whitespace-nowrap shrink-0">
                ★ 4.9
              </span>
              <span className="text-[11px] text-white/80 font-medium leading-tight">
                {tt("Partner-Zufriedenheit DACH", "Partner satisfaction DACH")}
              </span>
            </div>

            <Link
              to="/blog/$slug"
              params={{ slug: "speisely-google-for-startups-immersion-emea" }}
              className="flex items-center justify-center sm:justify-start gap-2 pt-2 sm:pt-0 sm:pl-5 group cursor-pointer"
            >
              <div className="flex items-center gap-0.5 text-xs font-bold text-white group-hover:text-[#E6B84A] transition shrink-0">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <span className="text-[11px] text-white/80 font-medium leading-tight group-hover:text-white transition">
                {tt("Immersion Alumni 2026", "Immersion Alumni 2026")} →
              </span>
            </Link>
          </div>

          {/* Compact Asymmetric 4-Tile Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Tile 1 (Lg: col-span-7) — 0% Direct Ordering & Webshop */}
            <Link
              to="/restaurants"
              onClick={() => trackEvent("bento_tile_clicked", { tile: "direct_ordering" })}
              className="lg:col-span-7 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-[#E6B84A]/60 p-5 sm:p-6 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E6B84A] uppercase tracking-wider">
                      {tt("Eigener Webshop · 0 % Provision", "Custom Webshop · 0% Commission")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Stripe Connect
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E6B84A] transition-colors leading-snug">
                  {tt(
                    "Direktbestellung ohne 30 % Portal-Abzug",
                    "Direct ordering without 30% aggregator cuts",
                  )}
                </h3>

                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  {tt(
                    "100 % deiner Rechnung gehen ohne Umwege an die Küche. Inklusive Live-KDS Küchenmonitor und CloudPRNT Bondrucker-Steuerung.",
                    "100% of your bill goes straight to the kitchen. Includes Live KDS display and CloudPRNT receipt printing.",
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px]">
                  34,99 € Flatrate · Keine Transaktionsgebühren
                </span>
                <span className="font-bold text-[#E6B84A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{tt("Webshops entdecken", "Explore Webshops")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Tile 2 (Lg: col-span-5) — WhatsApp & Table Booking */}
            <Link
              to="/restaurants"
              onClick={() => trackEvent("bento_tile_clicked", { tile: "whatsapp_reservations" })}
              className="lg:col-span-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-[#E6B84A]/60 p-5 sm:p-6 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E6B84A] uppercase tracking-wider">
                      {tt("1-Klick Reservierung", "1-Click Reservation")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    0 € Gedeck
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E6B84A] transition-colors leading-snug">
                  {tt("WhatsApp & Online-Tischbuchung", "WhatsApp & Online Table Booking")}
                </h3>

                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  {tt(
                    "Tische in Sekunden buchen. Gastronomen zahlen 0 € pro Gast, behalten alle Kontaktdaten und senken No-Shows.",
                    "Book tables in seconds. Hosts pay 0 € per cover, keep all guest data, and reduce no-shows.",
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px]">Direkte WhatsApp-Bestätigung</span>
                <span className="font-bold text-[#E6B84A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{tt("Jetzt buchen", "Book now")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Tile 3 (Lg: col-span-5) — B2B & Event Catering */}
            <Link
              to="/catering"
              onClick={() => trackEvent("bento_tile_clicked", { tile: "b2b_catering" })}
              className="lg:col-span-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-[#E6B84A]/60 p-5 sm:p-6 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 grid place-items-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E6B84A] uppercase tracking-wider">
                      {tt("Geprüfte Meisterbetriebe", "Verified Master Caterers")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Festpreis
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E6B84A] transition-colors leading-snug">
                  {tt("B2B & Hochzeits-Catering", "B2B & Wedding Catering")}
                </h3>

                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  {tt(
                    "Vom Business-Lunch für 20 Gäste bis zur 500-Gäste-Gala: Strukturierte Briefings und transparente Festpreisangebote.",
                    "From 20-guest lunches to 500-guest galas: Structured briefs and transparent fixed-price quotes.",
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px]">Halal, Bio & Vegan zertifiziert</span>
                <span className="font-bold text-[#E6B84A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{tt("Catering anfragen", "Request Catering")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Tile 4 (Lg: col-span-7) — Bespoke Agency Websites & Google KI-SEO / GEO (TechGlanz x Speisely) */}
            <Link
              to="/partner/webseiten"
              onClick={() => trackEvent("bento_tile_clicked", { tile: "custom_websites_ai" })}
              className="lg:col-span-7 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-[#E6B84A] p-5 sm:p-6 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden ring-1 ring-[#E6B84A]/30"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#E6B84A] grid place-items-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E6B84A] uppercase tracking-wider">
                      TechGlanz x Speisely Agency
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E6B84A]/20 text-[#E6B84A] border border-[#E6B84A]/40">
                      SEO · AEO · GEO
                    </span>
                    <span className="text-[10px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                      99+ Speed
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E6B84A] transition-colors leading-snug">
                  {tt(
                    "Individuelle Websites & Google-KI Suchmaschinen-Souveränität",
                    "Bespoke Websites & Google AI Search Dominance",
                  )}
                </h3>

                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  {tt(
                    "High-Speed Websites auf deiner eigenen .de-Domain. Optimiert für Google AI Overviews, Perplexity und ChatGPT Search.",
                    "High-speed websites on your own .de domain. Optimized for Google AI Overviews, Perplexity, and ChatGPT Search.",
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60 text-[11px]">
                  Eigene Domain · ChatGPT Zitate · PageSpeed 99+
                </span>
                <span className="font-bold text-[#E6B84A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{tt("Lösungen ansehen", "View Solutions")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          THREE VERTICALS — High-Density Gourmet Gateway
      ───────────────────────────────────────────────── */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Section header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b28a3c]">
            {tt(
              "KATALOG & DIREKTZUGANG · DREI WEGE ZUM GENUSS",
              "DIRECTORY & ACCESS · THREE PATHS TO EXCELLENCE",
            )}
          </span>

          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-forest leading-tight">
            {tt(
              "Catering, Restaurants & Event-Planung.",
              "Catering, Restaurants & Event Planning.",
            )}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-forest/75 max-w-2xl leading-relaxed">
            {tt(
              "Wähle deinen Bereich: Von der schnellen Direktbestellung im Webshop bis zum 500-Gäste Gourmet-Catering.",
              "Choose your pathway: From zero-commission direct dining to 500-guest corporate catering.",
            )}
          </p>
        </div>

        {/* 3 High-Impact Visual Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Card 1: Catering — flagship */}
          <Link
            id="vertical-catering"
            to="/catering"
            onClick={() => trackEvent("catering_cta_clicked", { location: "homepage_verticals" })}
            className="group relative overflow-hidden rounded-[2rem] bg-forest text-white flex flex-col min-h-[380px] sm:min-h-[400px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/images/event_catering_hero.webp?v=3"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={tt("Catering & Partyservice", "Catering & Partyservice")}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/20" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#E6B84A] text-forest shadow-md">
                  {tt("CATERING & BUFFET", "CATERING & BUFFET")}
                </span>
                <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/20">
                  {tt("Festpreis-Garantie", "Fixed Price")}
                </span>
              </div>

              <div className="mt-auto">
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-2 leading-snug">
                  {tt("Gourmet-Catering & Partyservice", "Gourmet Catering & Partyservice")}
                </h3>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-5">
                  {tt(
                    "Geprüfte Meisterbetriebe für Firmenfeiern, Hochzeiten und Galas ab 10 Personen. Transparent & ohne Mittelsmänner.",
                    "Verified master caterers for corporate events, weddings, and galas from 10 guests up. Transparent & direct.",
                  )}
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-5 py-2.5 text-xs sm:text-sm font-bold group-hover:bg-[#E6B84A] group-hover:text-forest transition-colors shadow-md">
                  <span>{tt("Caterer vergleichen", "Compare caterers")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Restaurants & Instant Order */}
          <Link
            id="vertical-restaurants"
            to="/restaurants"
            onClick={() =>
              trackEvent("instant_order_cta_clicked", { location: "homepage_verticals" })
            }
            className="group relative overflow-hidden rounded-[2rem] bg-[#2a4d3e] text-white flex flex-col min-h-[380px] sm:min-h-[400px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/images/restaurant_hero_food.webp?v=3"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={tt("Restaurants & Webshops", "Restaurants & Webshops")}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a4d3e] via-[#2a4d3e]/70 to-[#2a4d3e]/20" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#E6B84A] text-forest shadow-md">
                  {tt("WEBSHOP & TISCH", "WEBSHOP & TABLE")}
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {tt("0 % Provision", "0% Commission")}
                </span>
              </div>

              <div className="mt-auto">
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-2 leading-snug">
                  {tt("Restaurants & Speisekarten", "Restaurants & Dining")}
                </h3>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-5">
                  {tt(
                    "Direkt beim Partnerbetrieb bestellen oder Tische reservieren. 100 % deiner Rechnung gehen ohne Umwege an die Küche.",
                    "Order directly from verified partner restaurants or book tables. 100% of your bill goes straight to the kitchen.",
                  )}
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-5 py-2.5 text-xs sm:text-sm font-bold group-hover:bg-[#E6B84A] group-hover:text-forest transition-colors shadow-md">
                  <span>{tt("Restaurants entdecken", "Discover restaurants")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3: Event Planner & Locations */}
          <Link
            id="vertical-planner"
            to="/planner"
            onClick={() => trackEvent("planner_cta_clicked", { location: "homepage_verticals" })}
            className="group relative overflow-hidden rounded-[2rem] bg-[#1a3d2e] text-white flex flex-col min-h-[380px] sm:min-h-[400px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0">
              <img
                src="/images/institutional_catering_hero.webp?v=3"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={tt("Event-Planung & Locations", "Event Planning & Venues")}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d2e] via-[#1a3d2e]/70 to-[#1a3d2e]/20" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#E6B84A] text-forest shadow-md">
                  {tt("PLANUNG & LOCATIONS", "PLANNING & VENUES")}
                </span>
                <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/20">
                  {tt("Geprüfte Profis", "Vetted Experts")}
                </span>
              </div>

              <div className="mt-auto">
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-2 leading-snug">
                  {tt("Event-Planung & Locations", "Event Planning & Venues")}
                </h3>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-5">
                  {tt(
                    "Erfahrene Event-Planer und exklusive Festsäle für Hochzeiten, Firmenjubiläen und private Feiern jeder Größenordnung.",
                    "Experienced event coordinators and exclusive celebration venues for weddings, galas, and private gatherings.",
                  )}
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-white text-forest px-5 py-2.5 text-xs sm:text-sm font-bold group-hover:bg-[#E6B84A] group-hover:text-forest transition-colors shadow-md">
                  <span>{tt("Planer entdecken", "Discover planners")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────



          LIVE WEBSITE SHOWCASE FOR RESTAURANTS & CATERERS



          Highlights Agency Capability: Custom Websites, Google KI-SEO, GEO & AEO



      ───────────────────────────────────────────────── */}

      <section className="bg-cream border-t border-b border-[#eadfce] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 border border-forest/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-forest mb-1.5">
                <Sparkles className="h-3 w-3 text-[#b28a3c]" />
                <span>Speisely Digital Suite · High-End Webdesign &amp; GEO / AEO</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-forest font-bold leading-tight">
                Wir bauen High-End Websites <br className="hidden sm:inline" />
                <span className="text-[#A85C36]">mit Google-KI-SEO, GEO &amp; AEO Setup.</span>
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm text-forest/75 max-w-2xl leading-relaxed">
                Schluss mit langsamen 5.000 € WordPress-Seiten. Wir entwickeln maßgeschneiderte,
                blitzschnelle Webauftritte für Caterer &amp; Gastronomen — optimiert für Google AI
                Overviews, Perplexity &amp; ChatGPT-Zitate mit integrierter Buchungsengine.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/partner/webseiten"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-[#b28a3c] transition whitespace-nowrap"
              >
                <span>Kostenlosen Website-Audit starten</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#E6B84A]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Case 1: Partyservice Küpper */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border-2 border-forest/10 p-4 sm:p-5 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
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
                  className="block relative rounded-xl overflow-hidden border border-forest/15 bg-black/5 shadow-inner mb-3 group-hover:border-[#E6B84A] transition-all"
                >
                  <div className="bg-[#1e2922] px-3 py-1.5 flex items-center gap-1.5 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <div className="ml-1.5 text-[10px] text-white/85 font-mono tracking-tight truncate">
                      https://partyservicekuepper.de
                    </div>
                  </div>

                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-forest/20">
                    <img
                      src="/showcase-kuepper.webp"
                      alt="Partyservice Küpper High-End Website"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link
                    to="/case-study/partyservice-kuepper"
                    aria-label="Partyservice Küpper Case Study"
                    className="group-hover:text-[#A85C36] transition"
                  >
                    <h3 className="font-display text-lg sm:text-xl font-bold text-forest group-hover:text-[#A85C36] transition">
                      Partyservice Küpper
                    </h3>
                  </Link>
                  <span className="shrink-0 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    ⚡ 99/100 Core Web Vitals
                  </span>
                </div>

                <p className="text-xs text-forest/75 leading-relaxed mb-3">
                  Von statischem PDF zum volldigitalen Flaggschiff-Auftritt: All-Inclusive
                  BBQ-Pakete, interaktiver Event-Kalkulator und strukturierte GEO / AEO Schema.org
                  Daten für regionale Google-KI-Sichtbarkeit.
                </p>

                {/* Structured 2x2 Feature Grid — Utilizes 100% Horizontal Width */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-forest/80 mb-3.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-800">
                    <span className="shrink-0">⚡</span>
                    <span className="truncate">PageSpeed 99+</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-purple-800">
                    <span className="shrink-0">🤖</span>
                    <span className="truncate">Google AI / AEO</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-amber-800">
                    <span className="shrink-0">🥩</span>
                    <span className="truncate">All-Inclusive BBQ</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-forest/80">
                    <span className="shrink-0">📱</span>
                    <span className="truncate">Event-Kalkulator</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-forest/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-forest/80 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  partyservicekuepper.de
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/partyservice-kuepper"
                    aria-label="Case Study Partyservice Küpper lesen"
                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-3 py-1.5 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <a
                    href="https://partyservicekuepper.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partyservice Küpper Website live ansehen (öffnet in neuem Tab)"
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest/70 hover:text-forest transition"
                  >
                    <span>Live ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Case 2: Haus Spaas */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border-2 border-forest/10 p-4 sm:p-5 shadow-xl hover:border-[#E6B84A] transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
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
                  className="block relative rounded-xl overflow-hidden border border-forest/15 bg-black/5 shadow-inner mb-3 group-hover:border-[#E6B84A] transition-all"
                >
                  <div className="bg-[#1e2922] px-3 py-1.5 flex items-center gap-1.5 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <div className="ml-1.5 text-[10px] text-white/85 font-mono tracking-tight truncate">
                      https://haus-spaas.de
                    </div>
                  </div>

                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-forest/20">
                    <img
                      src="/showcase-haus-spaas.webp"
                      alt="Haus Spaas High-End Website & WhatsApp Engine"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link
                    to="/case-study/haus-spaas"
                    aria-label="Haus Spaas Case Study"
                    className="group-hover:text-[#A85C36] transition"
                  >
                    <h3 className="font-display text-lg sm:text-xl font-bold text-forest group-hover:text-[#A85C36] transition">
                      Haus Spaas
                    </h3>
                  </Link>
                  <span className="shrink-0 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    📈 0 % Provision · 100 % Direkt
                  </span>
                </div>

                <p className="text-xs text-forest/75 leading-relaxed mb-3">
                  Von der PDF-Speisekarte zur direkten WhatsApp-Reservierung: Duales
                  Speisekarten-System (Oktoberfest &amp; Klassik), direkte 1-Klick WhatsApp- &amp;
                  E-Mail-Reservierung und schnelle Google-Ladezeiten ohne Mittelsmann-Provision.
                </p>

                {/* Structured 2x2 Feature Grid — Utilizes 100% Horizontal Width */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-forest/80 mb-3.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-800">
                    <span className="shrink-0">💬</span>
                    <span className="truncate">WhatsApp-Booking</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-purple-800">
                    <span className="shrink-0">⚡</span>
                    <span className="truncate">PageSpeed 99+</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-emerald-700">
                    <span className="shrink-0">🥨</span>
                    <span className="truncate">Duale Speisekarte</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-forest/10 text-amber-800">
                    <span className="shrink-0">📱</span>
                    <span className="truncate">0 % Provision</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-forest/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-forest/80 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  haus-spaas.de
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to="/case-study/haus-spaas"
                    aria-label="Case Study Haus Spaas lesen"
                    className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] text-forest px-3 py-1.5 text-xs font-bold shadow-sm hover:bg-[#d6a538] transition"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <a
                    href="https://haus-spaas.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Haus Spaas Website live ansehen (öffnet in neuem Tab)"
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

      <section className="bg-forest text-white py-10 sm:py-14 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6B84A] mb-2">
                <Sparkles className="h-3 w-3 text-[#E6B84A]" />
                <span>
                  {tt(
                    "Authentische Reportagen & Community · Monatliches Magazin",
                    "Authentic Field Reports & Community · Monthly Magazine",
                  )}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl text-white font-bold leading-tight">
                {tt("Speisely Community & Magazin.", "Speisely Community & Magazine.")} <br />
                <span className="text-[#E6B84A]">
                  {tt(
                    "Echte Gastronomie, monatlich im interaktiven 3D-Flip-Reader.",
                    "Authentic dining, monthly in our interactive 3D flip reader.",
                  )}
                </span>
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
                {tt(
                  "Vor Ort getestet, unabhängig bezahlt. Blättere durch unser 14-seitiges interaktives Digital-Magazin oder entdecke die neuesten Vor-Ort-Reportagen unserer Community.",
                  "Tested on-site, independently paid. Flip through our 14-page interactive digital magazine or discover the latest culinary field reports.",
                )}
              </p>
            </div>

            <Link
              to="/magazin"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-[#E6B84A] transition whitespace-nowrap shrink-0"
            >
              <span>{tt("Alle Magazin-Stories ansehen", "View all magazine stories")}</span>
              <ArrowRight className="h-4 w-4 text-[#E6B84A]" />
            </Link>
          </div>

          {/* 3D Flip Magazine Feature Spotlight Banner */}
          <div className="mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#051a10] via-[#092918] to-[#123824] border-2 border-[#E6B84A]/35 p-5 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative flex flex-col md:flex-row items-center justify-between gap-6 group/banner">
            {/* Ambient Gold Radial Glow */}
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#E6B84A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A]/40 px-3 py-1 text-[11px] font-extrabold text-[#E6B84A] uppercase tracking-wider mb-2.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#E6B84A] animate-pulse" />
                <span>
                  {tt("Ausgabe 01 · Interaktives 3D-E-Paper", "Issue 01 · Interactive 3D E-Paper")}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
                {tt(
                  "Speisely Magazin — Digital Flip Edition",
                  "Speisely Magazine — Digital Flip Edition",
                )}
              </h3>

              <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-4">
                {tt(
                  "Erlebe unsere Reportagen im luxuriösen 3D-Doppelseiten-Layout mit realistischem Blättern, akustischem Papiersound und exklusiven Interviews von Schnitzel Schmiede bis Alzaeem Berlin.",
                  "Experience our reports in luxury dual-page 3D flipbook layout with realistic page curl, paper audio feedback, and exclusive interviews.",
                )}
              </p>

              {/* Luxury Editorial Micro Badges */}
              <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] font-bold text-white mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] border border-[#E6B84A]/30 backdrop-blur-sm shadow-sm">
                  <span className="text-[#E6B84A]">✦</span>
                  <span className="truncate">
                    {tt("14 Seiten Doppellayout", "14 Pages Spread")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] border border-[#E6B84A]/30 backdrop-blur-sm shadow-sm">
                  <span>🎧</span>
                  <span className="truncate">{tt("Mit Papiersound", "Realistic Sound")}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] border border-[#E6B84A]/30 backdrop-blur-sm shadow-sm">
                  <span className="text-[#E6B84A]">⚡</span>
                  <span className="truncate">{tt("100 % Interaktiv", "100% Interactive")}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/magazin/reader"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A] text-forest px-5 py-2.5 text-xs sm:text-sm font-extrabold shadow-lg shadow-[#E6B84A]/30 hover:bg-[#d6a538] hover:shadow-[#E6B84A]/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {tt(
                      "Digital Edition im 3D-Reader öffnen 📖",
                      "Open Digital Edition in 3D Reader 📖",
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="/magazin/edition.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[#E6B84A] transition px-3 py-2"
                >
                  <span>{tt("Vollbild-Viewer ↗", "Fullscreen Viewer ↗")}</span>
                </a>
              </div>
            </div>

            {/* Interactive Visual 3D Magazine Spread Preview with 3D Depth & Foil Sheen */}
            <Link
              to="/magazin/reader"
              aria-label="Speisely Magazin Digital Edition im 3D-Reader öffnen"
              className="relative z-10 w-full md:w-80 lg:w-[420px] rounded-2xl overflow-hidden border-2 border-[#E6B84A]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex-shrink-0 bg-black/60 group cursor-pointer hover:border-[#E6B84A] hover:shadow-[0_25px_60px_rgba(230,184,74,0.3)] transition-all duration-500 transform md:-rotate-1 hover:rotate-0 hover:scale-[1.02]"
            >
              {/* Luxury Corner Ribbon Stamp */}
              <div className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 rounded-md bg-[#E6B84A] text-forest font-black text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-md">
                <span>✦ AUSGABE 01 · HERBST 2026</span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/page4_page5_spread_de_verified.webp"
                  alt="Speisely Magazin 3D Doppelseite Vorschau"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle Sheen Highlight on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 text-white/90">
                    Seiten 04 – 05 · Herbst-Special
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#E6B84A] group-hover:translate-x-1 transition-transform">
                    <span>3D Blättern</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Curated Community Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Story 1: Seydioğlu Baklava Burger */}
            <Link
              to="/magazin/community/seydioglu-baklava-burger"
              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src="/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=3"
                  alt="Seydioğlu Baklava Burger Frankfurt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[10px] font-extrabold px-2.5 py-0.5 shadow">
                    Community Story
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5">
                    📍 Frankfurt
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#E6B84A] transition line-clamp-2">
                  {tt(
                    "Wenn Baklava auf Pistazien-Lava trifft: Seydioğlu",
                    "When Baklava Meets Warm Pistachio Lava: Seydioğlu",
                  )}
                </h3>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed flex-1 mb-3">
                  {tt(
                    "Der virale Baklava Burger mit Maraş-Eis, heiße Künefe und traditionelle Antep-Pistazienspezialitäten im Rhein-Main-Gebiet.",
                    "The viral Baklava Burger with Maraş ice cream, hot künefe, and authentic Antep pistachio craft in Rhine-Main.",
                  )}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>
                  <span className="text-white/60 font-medium text-[11px]">5 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 2: Mandy Berlin-Neukölln */}
            <Link
              to="/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln"
              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src="/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.webp?v=2"
                  alt="Mandy Lamm für zwei Berlin-Neukölln"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="rounded-full bg-[#16382b] text-white border border-[#7FA46B]/50 text-[10px] font-extrabold px-2.5 py-0.5 shadow">
                    Speisely Visits
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5">
                    📍 Berlin-Neukölln
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#E6B84A] transition line-clamp-2">
                  {tt(
                    "Warum wir bei Mandy natürlich Mandy bestellen mussten",
                    "Why at Mandy We Naturally Had to Order Mandy",
                  )}
                </h3>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed flex-1 mb-3">
                  {tt(
                    "Mandy Lamm für zwei mit Safranreis, frischen Kräutern und Chai. Authentischer Vor-Ort-Besuch in der Wildenbruchstraße.",
                    "Mandy Lamb for two with saffron rice, herbs, and chai. Authentic on-site visit in Wildenbruchstraße.",
                  )}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>
                  <span className="text-white/60 font-medium text-[11px]">5 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 3: King Tut Wilmersdorf */}
            <Link
              to="/magazin/community/king-tut-restaurant-berlin"
              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src="/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.webp?v=3"
                  alt="King Tut Restaurant Berlin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[10px] font-extrabold px-2.5 py-0.5 shadow">
                    Community Story
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5">
                    📍 Wilmersdorf
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#E6B84A] transition line-clamp-2">
                  {tt(
                    "Hawawshi & Holzkohlegrill auf Silberplatten: King Tut",
                    "Hawawshi & Charcoal Grill on Silver Platters: King Tut",
                  )}
                </h3>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed flex-1 mb-3">
                  {tt(
                    "Knuspriges Hawawshi, grüne Molokhia und kaiserliche Silberplatten mit Holzkohlegrill am Hohenzollerndamm.",
                    "Crisp hawawshi, green molokhia, and imperial silver platters with charcoal grill at Hohenzollerndamm.",
                  )}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>
                  <span className="text-white/60 font-medium text-[11px]">6 Min.</span>
                </div>
              </div>
            </Link>

            {/* Story 4: Baba Pirzola Wittenbergplatz */}
            <Link
              to="/magazin/community/baba-pirzola-berlin"
              className="group flex flex-col rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 hover:border-[#E6B84A] transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src="/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.webp?v=5"
                  alt="Baba Pirzola Meze und Grill Berlin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="rounded-full bg-[#E6B84A] text-forest text-[10px] font-extrabold px-2.5 py-0.5 shadow">
                    Community Story
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5">
                    📍 Schöneberg
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#E6B84A] transition line-clamp-2">
                  {tt(
                    "Feuer, Meze & große Grillkunst: Baba Pirzola",
                    "Fire, Meze & Masterful Grilling: Baba Pirzola",
                  )}
                </h3>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed flex-1 mb-3">
                  {tt(
                    "Kuzu Pirzola, Lokum Bonfile, rauchiges Nazik Ali und warmes Katmer mit Eis am Wittenbergplatz.",
                    "Kuzu Pirzola, Lokum Bonfile, smoky Nazik Ali, and warm katmer with ice cream at Wittenbergplatz.",
                  )}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E6B84A]">
                  <span>{tt("Story lesen →", "Read story →")}</span>
                  <span className="text-white/60 font-medium text-[11px]">7 Min.</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          id="partner-banner-cta"
          to="/partners"
          onClick={() => trackEvent("partner_cta_clicked", { location: "homepage_banner" })}
          className="group relative block overflow-hidden rounded-3xl sm:rounded-[2.5rem] text-white p-7 sm:p-10 lg:p-12 hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:shadow-forest/30 border border-[#E6B84A]/25"
        >
          {/* Cinematic Image Background */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source
                media="(max-width: 1023px)"
                srcSet="/hero-cinematic-mobile.webp"
                type="image/webp"
              />
              <source media="(min-width: 1024px)" srcSet="/hero-cinematic.webp" type="image/webp" />
              <img
                src="/hero-cinematic-mobile.webp"
                loading="lazy"
                decoding="async"
                sizes="100vw"
                alt="Become a Partner"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-[#061e12] via-[#092b1a]/95 to-[#0e3b24]/85" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#E6B84A]/15 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-[70px] pointer-events-none" />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left 7 Columns: Compelling Value Proposition */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/15 border border-[#E6B84A]/35 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#E6B84A] mb-4 shadow-sm">
                <Building2 className="h-3.5 w-3.5 text-[#E6B84A]" />
                <span>
                  {tt(
                    "Partner-Netzwerk · Für Caterer, Restaurants & Planer",
                    "Partner Network · For Caterers, Restaurants & Planners",
                  )}
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-[1.08] mb-4">
                {tt("Wachse mit Speisely.", "Grow with Speisely.")} <br />
                <span className="text-[#E6B84A]">
                  {tt("0 % Maklerdruck, volle Auslastung.", "0% Broker Fees, Maximum Capacity.")}
                </span>
              </h2>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                {tt(
                  "Erhalte qualifizierte Firmen- und Privatanfragen direkt auf dein Smartphone — mit gesicherter Anzahlung, 100 % Kundeneigentum und ohne Provision.",
                  "Receive qualified corporate and private event inquiries directly on your smartphone — with secured deposits, 100% guest ownership, and zero commission.",
                )}
              </p>

              {/* 4 Value-Proof Check Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mb-7 text-xs font-semibold text-white/90">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0" />
                  <span>{tt("0 % Maklergebühr", "0% Broker Commission")}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0" />
                  <span>{tt("100 % Gast-Eigentum", "100% Guest Ownership")}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0" />
                  <span>{tt("Direktkontakt per Chat", "Direct Client Chat")}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0" />
                  <span>{tt("Garantierte Anzahlung", "Guaranteed Advance Payout")}</span>
                </div>
              </div>

              {/* Action Button & Trust Hint */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-3 rounded-full bg-[#E6B84A] text-forest px-7 py-3.5 text-sm sm:text-base font-extrabold shadow-xl shadow-[#E6B84A]/30 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#d4a73b] whitespace-nowrap">
                  <span>{tt("Als Partner bewerben", "Apply as a Partner")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xs text-white/60 font-medium">
                  {tt(
                    "Kostenlose Registrierung · In 2 Min. startklar",
                    "Free onboarding · Ready in 2 min.",
                  )}
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Eye-Catching B2B Live Inquiry Mockup Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              {/* Amber radial glow behind card */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#E6B84A]/20 via-[#E6B84A]/10 to-transparent rounded-3xl blur-xl pointer-events-none" />

              <div className="relative rounded-2xl bg-black/65 border-2 border-[#E6B84A]/35 p-5 sm:p-6 backdrop-blur-md shadow-2xl transition-all duration-500 group-hover:border-[#E6B84A]/60">
                {/* Live inquiry header pill */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-400">
                      {tt("Live B2B-Anfrage", "Live B2B Inquiry")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    {tt("vor 8 Min.", "8 min. ago")}
                  </span>
                </div>

                {/* Inquiry details */}
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-3 leading-snug">
                  {tt("Corporate Sommerfest & Catering", "Corporate Summer Feast & Catering")}
                </h3>

                <div className="space-y-2 mb-4 text-xs text-white/80">
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">{tt("Gästeanzahl", "Guest Count")}:</span>
                    <span className="font-bold text-white">120 Personen</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">{tt("Budget", "Budget")}:</span>
                    <span className="font-bold text-[#E6B84A] text-sm">6.400 €</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">{tt("Menü & Stil", "Style")}:</span>
                    <span className="font-semibold text-white truncate max-w-[170px]">
                      {tt("BBQ Feast & Fingerfood", "BBQ Feast & Fingerfood")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-white/50">{tt("Status", "Status")}:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      {tt("Anzahlung gesichert", "Deposit Secured")}
                    </span>
                  </div>
                </div>

                {/* Bottom perk banner */}
                <div className="rounded-xl bg-white/[0.08] border border-white/10 px-3.5 py-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-white/70">
                    {tt("Ihre Provision an Speisely", "Your Commission to Speisely")}:
                  </span>
                  <span className="font-black text-[#E6B84A] text-xs">0,00 € (0 %)</span>
                </div>
              </div>
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

      {isConciergeOpen && (
        <Suspense fallback={null}>
          <AiConciergeModal
            isOpen={isConciergeOpen}
            onClose={() => setIsConciergeOpen(false)}
            initialQuery={searchQuery}
          />
        </Suspense>
      )}
    </SiteShell>
  );
}
