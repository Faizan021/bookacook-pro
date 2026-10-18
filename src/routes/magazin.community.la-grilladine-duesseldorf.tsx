import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Utensils,
  Sparkles,
  Users,
  CheckCircle2,
  Heart,
  Camera,
  Info,
  Flame,
  Coffee,
  Coins,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Fish,
  Beef,
} from "lucide-react";
import { useState, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/la-grilladine-duesseldorf")({
  head: () => ({
    meta: [
      { title: "La Grilladine Düsseldorf — Speisely Magazin" },
      {
        name: "description",
        content:
          "Speisely Community bei La Grilladine in Düsseldorf-Oberbilk: Marokkanischer Holzkohlegrill, zarte Tajine mit Pflaumen & frischer Fisch.",
      },
      {
        name: "keywords",
        content:
          "La Grilladine Düsseldorf, Marokkanisches Restaurant Düsseldorf, Holzkohlegrill Düsseldorf, Tajine Pflaumen Mandeln, Oberbilk Maghreb Viertel, Dorade vom Grill, Gambas Holzkohlegrill, Halal Restaurant Düsseldorf, Speisely Community Story",
      },
      { name: "geo.region", content: "DE-NW" },
      { name: "geo.placename", content: "Düsseldorf-Oberbilk" },
      { name: "geo.position", content: "51.2155;6.7972" },
      { name: "ICBM", content: "51.2155, 6.7972" },
      {
        property: "og:title",
        content: "Community-Besuch: La Grilladine Düsseldorf | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely Community-Mitglied teilt sein Erlebnis bei La Grilladine in Düsseldorf: Marokkanischer Holzkohlegrill, Entrecôte, Pflaumen-Tajine & Gambas.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_theke_3d.webp?v=1",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/la-grilladine-duesseldorf#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
              },
              headline:
                "Community-Besuch bei La Grilladine in Düsseldorf-Oberbilk — Marokkanisches vom Holzkohlegrill",
              description:
                "Ein Speisely Community-Mitglied hat das Restaurant La Grilladine in der Dreieckstraße 26 besucht: Rauchiges Entrecôte, echte Tajine mit Pflaumen und frischer Minztee.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_theke_3d.webp?v=1",
                width: 1200,
                height: 900,
              },
              datePublished: "2026-10-18",
              dateModified: "2026-10-18",
              author: {
                "@type": "Organization",
                name: "Speisely Community",
                url: "https://speisely.de/community",
              },
              publisher: {
                "@type": "Organization",
                name: "Speisely",
                url: "https://speisely.de",
                logo: {
                  "@type": "ImageObject",
                  url: "https://speisely.de/speisely_logo.png",
                },
              },
              inLanguage: "de-DE",
              contentLocation: {
                "@type": "Restaurant",
                name: "La Grilladine",
                url: "https://la-grilladine.de",
                telephone: "+49 211 94216796",
                priceRange: "€€",
                servesCuisine: "Moroccan",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Dreieckstraße 26",
                  addressLocality: "Düsseldorf",
                  postalCode: "40227",
                  addressRegion: "Nordrhein-Westfalen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 51.2155,
                  longitude: 6.7972,
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    opens: "12:00",
                    closes: "22:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Sunday"],
                    opens: "13:00",
                    closes: "21:00",
                  },
                ],
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Startseite",
                  item: "https://speisely.de",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Community",
                  item: "https://speisely.de/community",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "La Grilladine Düsseldorf",
                  item: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: LaGrilladineDuesseldorfArticle,
});

/**
 * 3D Interactive Card Component
 * Adds mouse-tracked perspective tilt, floating 3D depth layers, and luxury border glow
 */
function ThreeDCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered
          ? "transform 0.08s ease-out"
          : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
      }}
      className={`group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl hover:border-[#E6B84A] hover:shadow-[0_24px_50px_rgba(230,184,74,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

function LaGrilladineDuesseldorfArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  // 3D Dish Showcase State
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const showcaseDishes = [
    {
      id: "theke",
      titleDe: "Theke, Berber-Keramik & Holzkohlegrill",
      titleEn: "Artisanal Counter, Pottery & Charcoal Hearth",
      subtitleDe: "Handbemalte Tajine-Schalen, مشاوي-Schriftzug und offenes Buchenfeuer",
      subtitleEn: "Hand-painted tagines, Arabic calligraphy and open beechwood flame",
      badgeDe: "Tradition & Handwerk",
      badgeEn: "Heritage & Craft",
      badgeIcon: Sparkles,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_theke_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Buchenglut-Licht",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Amber Firelight",
    },
    {
      id: "dorade",
      titleDe: "Ganze Dorade Royale 'Papillon'",
      titleEn: "Whole Sea Bream 'Papillon' Over Coals",
      subtitleDe: "Schmetterlingsschnitt mit Chermoula-Glasur, Knusper-Rondelles & Frischesalat",
      subtitleEn: "Butterflied flat with chermoula glaze, potato rondelles & garden salad",
      badgeDe: "🐟 Ganzer Fisch vom Grill",
      badgeEn: "🐟 Whole Flame-Grilled Fish",
      badgeIcon: Fish,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Warmer Holztisch",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Warm Wood Table",
    },
    {
      id: "tajine-poulet",
      titleDe: "Tajine de Poulet aux Citrons Confits",
      titleEn: "Chicken Tagine with Preserved Lemons & Olives",
      subtitleDe: "Zart geschmortes Huhn, Salzzitronen, geröstete Mandeln & grüne Oliven",
      subtitleEn: "Slow-braised chicken, salted lemons, toasted almonds & green olives",
      badgeDe: "🍲 Geschmort im Tontopf",
      badgeEn: "🍲 Slow-Braised Claypot",
      badgeIcon: Sparkles,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_tajine_poulet_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Warmer Holztisch",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Warm Wood Table",
    },
    {
      id: "entrecote",
      titleDe: "Rinder-Entrecôte vom Holzkohlegrill",
      titleEn: "Charcoal-Grilled Beef Entrecôte",
      subtitleDe: "Karamellisierte Grillkruste, schmelzende Kräuterbutter & Kartoffelscheiben",
      subtitleEn: "Smoky seared crust, melting herb butter & crispy potato rondelles",
      badgeDe: "🥩 Fleisch-Handwerk",
      badgeEn: "🥩 Charcoal Steak Craft",
      badgeIcon: Beef,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_entrecote_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Warmer Holztisch",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Warm Wood Table",
    },
    {
      id: "gambas",
      titleDe: "Riesengambas-Spieße vom Grill",
      titleEn: "Grilled Tiger Prawn Skewers",
      subtitleDe: "Knoblauch-Koriander-Öl, karamellisierte Röstaromen & Salat",
      subtitleEn: "Garlic-coriander oil, flame-kissed shells & crisp salad",
      badgeDe: "🦐 Frische Meeresfrüchte",
      badgeEn: "🦐 Fresh Seafood",
      badgeIcon: Sparkles,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_gambas_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Warmer Holztisch",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Warm Wood Table",
    },
    {
      id: "minztee",
      titleDe: "Klassische Minztee-Zeremonie",
      titleEn: "Authentic Moroccan Mint Tea Ceremony",
      subtitleDe: "Silberkännchen auf gehämmertem Tablett mit feiner R'gwa-Schaumkrone",
      subtitleEn: "Silver teapot on hammered tray poured with signature frothy crown",
      badgeDe: "🫖 Maghreb Teekultur",
      badgeEn: "🫖 Moroccan Tea Culture",
      badgeIcon: Coffee,
      image: "/magazin/la-grilladine-duesseldorf/la_grilladine_minztee_3d.webp?v=1",
      cameraDe: "50mm f/1.8 · 45° Feste Perspektive · Warmer Holztisch",
      cameraEn: "50mm f/1.8 · 45° Fixed Perspective · Warm Wood Table",
    },
  ];

  const currentDish = showcaseDishes[activeDishIndex];

  const emailSubject = isDe
    ? "Mein Besuch bei La Grilladine Düsseldorf – Feedback für Speisely Community"
    : "My visit to La Grilladine Düsseldorf – Feedback for Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely-Team,\n\nich habe La Grilladine in Düsseldorf besucht und möchte meine Erfahrung teilen.\n\nMein Lieblingsgericht:\nAtmosphäre & Service:\nFotos anbei:`
    : `Hello Speisely Team,\n\nI visited La Grilladine in Düsseldorf and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nPhotos attached:`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb Bar */}
        <div className="border-b border-forest/10 bg-white/70 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-forest/70 truncate">
              <ol className="flex items-center gap-1.5 flex-wrap">
                <li>
                  <Link to="/" className="hover:text-forest transition">
                    {isDe ? "Startseite" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link to="/community" className="hover:text-forest transition">
                    Community
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-forest font-bold truncate">
                  La Grilladine Düsseldorf
                </li>
              </ol>
            </nav>
            <Link
              to="/community"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-[#7FA46B] transition"
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isDe ? "Alle Community Stories" : "All Community Stories"}</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF4EC] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs border border-[#7FA46B]/20">
            <Users className="h-3.5 w-3.5 text-[#7FA46B]" aria-hidden="true" />
            <span>
              {isDe
                ? "Erfahrungsbericht aus der Speisely Community"
                : "Experience from the Speisely Community"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.18] tracking-tight">
            {isDe
              ? "Marokkanisches vom Holzkohlegrill: Unser Besuch bei La Grilladine in Düsseldorf"
              : "Moroccan from the Charcoal Grill: Our Visit to La Grilladine in Düsseldorf"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed font-normal">
            {isDe
              ? "Düsseldorf-Oberbilk gilt als das Herz der marokkanischen Gastronomie im Rheinland. Mitten im pulsierenden Maghreb-Viertel liegt La Grilladine in der Dreieckstraße 26: Ein unprätentiöser, herzlicher Treffpunkt für echten Buchen-Holzkohlegrill, stundenlang geschmorte Tajines im Tontopf und traditionelle Minztee-Kultur."
              : "Düsseldorf-Oberbilk stands as the culinary heart of Moroccan gastronomy in the Rhineland. In the bustling Maghreb district, La Grilladine at Dreieckstraße 26 is an authentic sanctuary for real beechwood charcoal grilling, slow-simmered earthenware tagines, and traditional Moroccan mint tea culture."}
          </p>

          {/* Verification & Disclosure Meta Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe ? "Community-Besuch vor Ort" : "Community on-site visit"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Halal
            </span>
            <span className="text-forest/30">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <Flame className="h-3.5 w-3.5" />
              {isDe ? "Echter Buchenholz-Grill" : "Beech Charcoal Hearth"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="text-forest/60">
              {isDe ? "Selbst bezahlt · Unabhängig" : "Self-paid · Independent"}
            </span>
          </div>

          {/* Operational Facts & Scraped Details Grid */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
            {/* Location & Contact */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Adresse & Anfahrt" : "Location & Transit"}
                </span>
                <strong className="font-semibold text-forest block">La Grilladine</strong>
                <p className="text-forest/75 text-xs leading-snug">
                  Dreieckstraße 26, 40227 Düsseldorf
                </p>
                <p className="text-forest/60 text-[11px]">
                  {isDe
                    ? "Oberbilk (Maghreb-Viertel, 5 Min. vom Hbf)"
                    : "Oberbilk (Maghreb Quarter, 5 min from Central Station)"}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <a
                    href="tel:+4921194216796"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:text-[#7FA46B] transition"
                  >
                    <Phone className="h-3 w-3 text-[#7FA46B]" />
                    <span>0211 94216796</span>
                  </a>
                  <a
                    href="https://la-grilladine.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:text-[#7FA46B] transition"
                  >
                    <Globe className="h-3 w-3 text-[#E6B84A]" />
                    <span>la-grilladine.de</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Times (Scraped verified from Visit Düsseldorf) */}
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Öffnungszeiten" : "Opening Hours"}
                </span>
                <div className="text-xs text-forest/80 space-y-0.5">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{isDe ? "Di – Sa:" : "Tue – Sat:"}</span>
                    <strong className="font-semibold text-forest">12:00 – 22:00</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{isDe ? "Sonntag:" : "Sunday:"}</span>
                    <strong className="font-semibold text-forest">13:00 – 21:00</strong>
                  </div>
                  <div className="flex justify-between gap-2 text-forest/50">
                    <span>{isDe ? "Montag:" : "Monday:"}</span>
                    <span>{isDe ? "Ruhetag (geschlossen)" : "Closed"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crucial House Policies (First Come First Served + Cash Only) */}
            <div className="flex items-start gap-3">
              <Coins className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Wichtige Gästetipps" : "Essential Guest Tips"}
                </span>
                <div className="space-y-1.5 text-xs text-forest/80">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                    <AlertCircle className="h-3 w-3 text-amber-700 shrink-0" />
                    <span>{isDe ? "Nur Barzahlung (Cash Only)" : "Cash Only"}</span>
                  </div>
                  <p className="text-[11px] text-forest/70 leading-snug">
                    {isDe
                      ? "Keine Reservierungen: Es gilt strikt „First Come, First Served“."
                      : "Strictly 'First Come, First Served'. No phone reservations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 space-y-12 pb-20">
          {/* INTERACTIVE 3D DISH SPOTLIGHT / SINGLE-CAMERA STUDIO SHOWCASE */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7FA46B] mb-1">
                  <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
                  <span>{isDe ? "Speisely 3D Studio-Kamera" : "Speisely 3D Studio Camera"}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                  {isDe
                    ? "Die 6 Signature-Gerichte aus einer Kameraperspektive"
                    : "The 6 Signature Dishes Captured from One Camera"}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 border border-forest/10 px-3 py-1 text-[11px] font-mono text-forest/70">
                  <span>📷</span>
                  <span>{isDe ? currentDish.cameraDe : currentDish.cameraEn}</span>
                </span>
              </div>
            </div>

            {/* 3D Interactive Main Stage */}
            <ThreeDCard>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src={currentDish.image}
                  alt={isDe ? currentDish.titleDe : currentDish.titleEn}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />

                {/* Floating 3D Badge Overlay */}
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(30px)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-lg border border-white/10">
                    <currentDish.badgeIcon
                      className="h-3.5 w-3.5 text-[#E6B84A]"
                      aria-hidden="true"
                    />
                    <span>{isDe ? currentDish.badgeDe : currentDish.badgeEn}</span>
                  </span>
                </div>

                {/* Floating 3D Description Bottom Bar */}
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest/90 backdrop-blur-md p-3.5 text-white border border-white/10 shadow-xl"
                  style={{ transform: "translateZ(24px)" }}
                >
                  <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                    {isDe ? currentDish.titleDe : currentDish.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 leading-snug">
                    {isDe ? currentDish.subtitleDe : currentDish.subtitleEn}
                  </p>
                </div>
              </div>

              <div className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span className="italic">
                  {isDe
                    ? "Tipp: Bewege den Cursor über das Bild für interaktive 3D-Tiefe."
                    : "Tip: Hover your cursor over the frame for interactive 3D perspective tilt."}
                </span>
                <span className="text-[10px] text-forest/50 font-mono">
                  {activeDishIndex + 1} / {showcaseDishes.length}
                </span>
              </div>
            </ThreeDCard>

            {/* Dish Selector Thumbnails / Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {showcaseDishes.map((dish, idx) => {
                const isActive = idx === activeDishIndex;
                return (
                  <button
                    key={dish.id}
                    onClick={() => setActiveDishIndex(idx)}
                    className={`relative overflow-hidden rounded-xl border-2 p-1.5 text-left transition-all ${
                      isActive
                        ? "border-[#E6B84A] bg-white shadow-md scale-102"
                        : "border-forest/10 bg-white/70 hover:border-forest/30 hover:bg-white"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-forest/5 mb-1.5">
                      <img
                        src={dish.image}
                        alt={isDe ? dish.titleDe : dish.titleEn}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={`block text-[11px] font-bold truncate leading-tight ${
                        isActive ? "text-forest" : "text-forest/70"
                      }`}
                    >
                      {isDe ? dish.titleDe : dish.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 1: THE ATMOSPHERE & THE MAGHREB QUARTER */}
          <section className="space-y-4 pt-4 border-t border-forest/10">
            <div className="text-forest/85 leading-relaxed text-base sm:text-lg space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "„Mitten in Oberbilk – ein Tempel für echte Holzkohle-Liebhaber“"
                  : "“In the heart of Oberbilk – a true sanctuary for charcoal aficionados”"}
              </h2>
              <p>
                {isDe
                  ? "Düsseldorf-Oberbilk gilt weit über Nordrhein-Westfalen hinaus als die kulinarische Hochburg für nordafrikanische Esskultur. Wer die Kölner Straße entlangschlendert, entdeckt Gewürzläden, Minzteestuben, marokkanische Bäckereien mit ofenfrischem Khobz und Metzgereien mit traditionellem Zuschnitt. Doch wer nach dem unverfälschten Beherrschen der offenen Glut sucht, biegt in die ruhigere Dreieckstraße 26 ab: Zu La Grilladine."
                  : "Düsseldorf-Oberbilk is renowned far beyond North Rhine-Westphalia as the epicenter of North African food culture in Germany. Strolling down Kölner Straße reveals spice merchants, mint tea rooms, Moroccan bakeries baking fresh Khobz flatbreads, and halal butchers. Yet those seeking the uncompromised mastery of the open charcoal hearth turn into the quiet Dreieckstraße 26: La Grilladine."}
              </p>
              <p>
                {isDe
                  ? "Schon beim Betreten empfängt einen der feine, nussige Duft glühender Buchenholzkohle und angeröstetem Kreuzkümmel. Auf der massiven Holztheke thronen traditionelle, handbemalte Berber-Keramiken, Tonkrüge und Terracotta-Tajines. An der Wand prangt der arabische Schriftzug مشاوي (Mashawee – Gegrilltes). Hier gibt es keine künstliche Show, sondern echte, herzliche Gastfreundschaft und ein kompromissloses Qualitätsversprechen."
                  : "Stepping inside greets you with the fragrant aroma of natural beechwood embers and roasted cumin. Authentic hand-painted Berber pottery and earthenware tagines crown the wooden counter beneath the Arabic script مشاوي (Mashawee — Grills). There is no staged gimmickry here — just genuine, heartfelt hospitality and an unwavering commitment to culinary craft."}
              </p>
            </div>
          </section>

          {/* SECTION 2: CHARCOAL STEAK & ROUND CRISPY POTATOES */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Fleisch-Handwerk & Offene Flamme" : "Butcher's Craft & Open Flame"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Das Entrecôte: Zarte Röstaromen & schmelzende Kräuterbutter"
                  : "The Entrecôte: Caramelized Sear & Melting Herb Butter"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "Auf dem offenen Holzkohlegrill schlägt das Herz des Hauses: Ein gut marmoriertes Rinder-Entrecôte wird bei hoher Strahlungshitze scharf angegrillt. Durch das Buchenholzfeuer karamellisieren die Fleischsäfte an der Oberfläche, während das Innere herrlich saftig und zartrosa bleibt."
                    : "The beating heart of the kitchen is the open charcoal grill: A marbled beef ribeye is seared over glowing beechwood coals. The intense radiant heat creates a crisp, savory crust while preserving deep succulence inside."}
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <strong className="text-forest block mb-1 flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-amber-600" />
                      {isDe ? "Hausgemachte Kräuterbutter" : "Housemade Chilled Herb Butter"}
                    </strong>
                    <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Auf dem heißen Steak schmilzt eine Nocke frische Kräuterbutter mit Petersilie, Knoblauch und Meersalz, die sich mit dem Fleischsaft zu einer aromatischen Sauce verbindet."
                        : "Freshly whipped herb butter melts slowly into the piping-hot steak, blending parsley, garlic, and sea salt into the rich natural juices."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <strong className="text-forest block mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#E6B84A]" />
                      {isDe ? "Die goldenen Kartoffel-Rondelles" : "Golden Potato Rondelles"}
                    </strong>
                    <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Statt industrieller Tiefkühl-Pommes serviert La Grilladine hauchdünn geschnittene, goldgelb ausgebackene Kartoffel-Rondellen – außen kross wie handgemachte Chips, innen wunderbar fluffig."
                        : "In place of standard frozen fries, La Grilladine slices fresh potatoes into thin medallions, frying them golden and crisp like artisanal chips with a tender core."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3D Card for Steak */}
              <ThreeDCard>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5">
                  <img
                    src="/magazin/la-grilladine-duesseldorf/la_grilladine_entrecote_3d.webp?v=1"
                    alt={
                      isDe
                        ? "Saftiges Entrecôte vom Holzkohlegrill mit schmelzender Kräuterbutter und Kartoffel-Rondelles"
                        : "Juicy charcoal-grilled entrecôte with herb butter and potato rondelles"
                    }
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-3 left-3"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <span className="rounded-lg bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe
                        ? "🥩 Rinder-Entrecôte vom Holzkohlegrill"
                        : "🥩 Charcoal-Grilled Entrecôte"}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] text-forest/50 italic">
                  {isDe
                    ? "Perfekter Garpunkt: Saftiges Fleisch mit Buchenholz-Röstaromen"
                    : "Perfect cook: Succulent beef with beechwood char"}
                </p>
              </ThreeDCard>
            </div>
          </section>

          {/* SECTION 3: THE TAJINE & MINT TEA CEREMONY */}
          <section className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Tontopf-Handwerk & Gastfreundschaft" : "Claypot Mastery & Hospitality"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Tajine de Poulet & die Maghreb-Minztee-Zeremonie"
                  : "Chicken Tagine & the Moroccan Mint Tea Ritual"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* 3D Card for Tajine */}
              <ThreeDCard>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5">
                  <img
                    src="/magazin/la-grilladine-duesseldorf/la_grilladine_tajine_poulet_3d.webp?v=1"
                    alt={
                      isDe
                        ? "Traditionelle marokkanische Tajine de Poulet mit eingelegten Salzzitronen, gerösteten Mandeln und Oliven"
                        : "Traditional Moroccan chicken tagine with preserved lemons, toasted almonds, and green olives"
                    }
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-3 left-3"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <span className="rounded-lg bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🍲 Tajine de Poulet aux Citrons" : "🍲 Lemon & Olive Chicken Tagine"}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] text-forest/50 italic">
                  {isDe
                    ? "Stundenlang im traditionellen Tontopf geschmort"
                    : "Slow-simmered for hours in traditional earthenware"}
                </p>
              </ThreeDCard>

              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "Wer marokkanische Festtagsküche schätzt, kommt an den Tajines von La Grilladine nicht vorbei: Das Fleisch schmort im glasierten Tontopf mit Zwiebeln, frischem Ingwer, Kurkuma und Safran, bis es butterzart vom Knochen fällt. Die eingelegten Salzzitronen bringen eine elegante Frische, die von den fruchtigen grünen Oliven und dem Knusper gerösteter Mandeln harmonisch abgerundet wird."
                    : "For lovers of traditional Moroccan feasts, La Grilladine's tagines are legendary: Meat slow-simmers gently in earthenware with sweet onions, fresh ginger, turmeric, and saffron until falling off the bone. Salt-preserved lemons deliver a bright, citrus zest that balances effortlessly against plump green olives and crunchy toasted almonds."}
                </p>
                <div className="p-4 rounded-2xl bg-white border border-forest/10 space-y-2">
                  <strong className="text-forest flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-[#E6B84A]" />
                    {isDe
                      ? "Frischer marokkanischer Minztee (Atay)"
                      : "Fresh Moroccan Mint Tea (Atay)"}
                  </strong>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Der krönende Abschluss: Grüner Gunpowder-Tee, üppige Bündel frischer marokkanischer Minze und feiner Zucker, traditionell aus der polierten Silberkanne aus hohem Bogen eingegossen, um die begehrte Schaumkrone (R'gwa) im Glas zu formen."
                      : "The ultimate finale: Chinese gunpowder tea brewed with abundant fresh spearmint leaves, poured high from a polished silver teapot to create the revered frothy crown (R'gwa) in delicate patterned glassware."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: MEDITERRANEAN SEAFOOD SPREAD (Dorade & Gambas) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Frische aus dem Mittelmeer" : "Fresh Catch of the Mediterranean"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Meeresfrüchte & Ganzer Fisch über glühender Kohle"
                  : "Seafood & Whole Fish Over Glowing Coals"}
              </h2>
              <p className="mt-2 text-forest/75 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Marokkos Atlantik- und Mittelmeerküsten von Tanger bis Essaouira sind weltberühmt für ihre Fischmärkte. Bei La Grilladine wird dieser Küstenzauber auf den Rost geholt:"
                  : "From Tangier to Essaouira, Morocco's coastal cuisine is celebrated for seafood cooked immediately over woodfire. La Grilladine brings that coastal magic to life:"}
              </p>
            </div>

            {/* 2-Column 3D Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dorade Card */}
              <ThreeDCard>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5">
                  <img
                    src="/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1"
                    alt={
                      isDe
                        ? "Ganze Dorade Royale butterflied vom Holzkohlegrill mit Zitrone und Kartoffelscheiben"
                        : "Whole butterflied sea bream grilled over charcoal with lemon and potato rounds"
                    }
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-3 left-3"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <span className="rounded-lg bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🐟 Ganze Dorade Royale" : "🐟 Whole Sea Bream"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 px-1 text-xs sm:text-sm text-forest/80 space-y-1">
                  <strong className="text-forest font-semibold block">
                    {isDe ? "Dorade Royale 'Papillon'" : "Whole Grilled Dorade"}
                  </strong>
                  <p>
                    {isDe
                      ? "Im Schmetterlingsschnitt flach aufgefaltet und mit hausgemachter marokkanischer Chermoula (Kreuzkümmel, Paprika, frischer Koriander, Zitrone & Knoblauch) bestrichen. Knusprige Haut, saftiges weißes Fleisch."
                      : "Butterflied flat and basted with house Chermoula (ground cumin, sweet paprika, fresh cilantro, garlic & lemon) over intense coals. Blistered skin with tender, flaky fillets."}
                  </p>
                </div>
              </ThreeDCard>

              {/* Gambas Card */}
              <ThreeDCard>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5">
                  <img
                    src="/magazin/la-grilladine-duesseldorf/la_grilladine_gambas_3d.webp?v=1"
                    alt={
                      isDe
                        ? "Gegrillte Riesengarnelen auf Spieß mit Knusper-Kartoffeln und gemischtem Salat"
                        : "Grilled tiger prawns on skewers with crispy potato rondelles and mixed salad"
                    }
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-3 left-3"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <span className="rounded-lg bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🦐 Gegrillte Riesengambas" : "🦐 Grilled Tiger Prawns"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 px-1 text-xs sm:text-sm text-forest/80 space-y-1">
                  <strong className="text-forest font-semibold block">
                    {isDe ? "Gambas-Spieße vom Grill" : "Grilled Gambas Skewers"}
                  </strong>
                  <p>
                    {isDe
                      ? "Große, saftige Riesengarnelen auf Holzspießen mit Kräuter-Knoblauch-Glasur auf den Punkt über glühender Holzkohle gegrillt, bis die Schale leicht karamellisiert und das Fleisch knackig bleibt."
                      : "Plump tiger prawns skewered and basted with garlic-herb oil, grilled over open coals until the shells caramelize and the meat stays sweet and crisp."}
                  </p>
                </div>
              </ThreeDCard>
            </div>
          </section>

          {/* SECTION 5: COMMUNITY VERDICT */}
          <section className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-forest/15 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E6B84A]/20 text-forest">
                <Heart className="h-6 w-6 text-[#E6B84A]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60 block">
                  {isDe ? "Unser Fazit" : "Community Verdict"}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                  {isDe
                    ? "Warum La Grilladine ein absolutes Highlight in NRW ist"
                    : "Why La Grilladine is a true North Rhine-Westphalia highlight"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-forest/80">
              <div className="p-4 rounded-2xl bg-white border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Echter Holzkohlegeschmack" : "Genuine Charcoal Aroma"}
                </span>
                <p>
                  {isDe
                    ? "Kein Gas- oder Elektrogrill: Fleisch, Gambas und Fisch tragen das feine, nussige Raucharoma natürlicher Holzkohle."
                    : "Zero electric or gas shortcuts: meats, prawns, and fish carry the unmistakable, gentle smoke signature of natural charcoal."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Hausgemacht & Frisch zubereitet" : "Fresh & Made from Scratch"}
                </span>
                <p>
                  {isDe
                    ? "Von den frisch ausgestochenen Kartoffel-Rondellen über die Chermoula bis zur Kräuterbutter ist jedes Detail hausgemacht."
                    : "From hand-sliced potato rounds and house chermoula to chilled herb butter, every component is prepared fresh."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Faire Preise & Reiche Portionen" : "Generous Portions & Fair Pricing"}
                </span>
                <p>
                  {isDe
                    ? "Die Teller sind reichlich bemessen, Beilagen wie Salat, Brot und Kartoffeln werden großzügig serviert. Exzellentes Preis-Leistungs-Verhältnis."
                    : "Generously portioned plates accompanied by abundant fresh salads, bread, and potato rounds. Outstanding value for money."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Zentral erreichbar in Düsseldorf" : "Centrally Located in Düsseldorf"}
                </span>
                <p>
                  {isDe
                    ? "Nur 5 Gehminuten vom Düsseldorfer Hauptbahnhof und der Haltestelle Oberbilk S-Bahnhof entfernt."
                    : "Just a 5-minute walk from Düsseldorf Central Station and Oberbilk public transit."}
                </p>
              </div>
            </div>
          </section>

          {/* EDITORIAL DISCLOSURE & SOURCES */}
          <aside className="p-6 rounded-2xl bg-white border border-forest/10 text-xs text-forest/70 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Info className="w-4 h-4 text-[#E6B84A]" />
              <span>
                {isDe ? "Transparenzhinweis & Quellenangaben" : "Editorial Transparency & Sources"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isDe
                ? "Dieser redaktionelle Beitrag entstand im Rahmen unserer Speisely Community: Fotos und Vor-Ort-Erfahrungen wurden von einem engagierten Community-Mitglied geteilt. Ergänzende Öffnungszeiten, Standortdaten und kulinarische Details wurden über die offizielle Website (la-grilladine.de) sowie das Tourismusportal Visit Düsseldorf (visitduesseldorf.de) redaktionell recherchiert und abgeglichen. Es bestanden zum Zeitpunkt der Veröffentlichung keine bezahlten Werbeabsprachen mit dem Betreiber."
                : "This editorial article was created within our Speisely Community: Photography and on-site tasting notes were contributed by an active community member. Operational hours, location specifications, and culinary facts were verified via the official restaurant website (la-grilladine.de) and the Visit Düsseldorf tourism directory (visitduesseldorf.de). No commercial sponsorship existed at the time of publication."}
            </p>
          </aside>

          {/* STANDARDIZED RESTAURANT CLAIM & FOODIE RECOMMENDATION BRIDGE */}
          <RestaurantClaimBridge restaurantName="La Grilladine" city="Düsseldorf" />

          {/* COMMUNITY PARTICIPATION CTA */}
          <section className="bg-forest text-white rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="max-w-xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E6B84A] border border-white/10">
                <Users className="h-3.5 w-3.5" />
                <span>{isDe ? "Werde Teil der Community" : "Join the Community"}</span>
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                {isDe ? "Warst du schon bei La Grilladine?" : "Have you visited La Grilladine?"}
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Teile deine eigenen Restaurant-Entdeckungen, Lieblingsgerichte oder Catering-Erlebnisse mit Genießerinnen und Genießern auf Speisely."
                  : "Share your own restaurant discoveries, favorite dishes, or catering moments with food lovers across Speisely."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={mailtoHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6B84A] hover:bg-[#d4a73d] text-forest font-bold px-6 py-3.5 text-sm transition shadow-lg"
              >
                <Camera className="h-4 w-4" />
                <span>{isDe ? "Deine Food Story einsenden" : "Submit your food story"}</span>
              </a>
              <Link
                to="/community"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 text-sm transition border border-white/20"
              >
                <span>{isDe ? "Alle Community Stories" : "Browse all stories"}</span>
              </Link>
            </div>
          </section>

          {/* Back Navigation Link */}
          <div className="pt-2 text-center">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#083822] hover:text-[#E6B84A] transition-colors font-mono"
            >
              ← {isDe ? "Zurück zur Community-Übersicht" : "Back to Community Overview"}
            </Link>
          </div>

          {/* About Speisely Trust Section */}
          <AboutSpeiselySection />
        </main>
      </div>
    </SiteShell>
  );
}
