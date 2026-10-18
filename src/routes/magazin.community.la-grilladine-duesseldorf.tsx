import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
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
  Fish,
  Utensils,
  ChevronRight,
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
          "Ein Community-Besuch bei La Grilladine in Düsseldorf-Oberbilk: Ganze Dorade über Buchenglut, Salzzitronen-Tajine und die Kunst des Atay-Tees.",
      },
      {
        name: "keywords",
        content:
          "La Grilladine Düsseldorf, Marokkanisches Restaurant Düsseldorf, Holzkohlegrill Düsseldorf, Tajine Salzzitronen Oliven, Oberbilk Maghreb Viertel, Dorade Royale Grill, Atay Minztee, Halal Restaurant Düsseldorf, Speisely Community Visit",
      },
      { name: "geo.region", content: "DE-NW" },
      { name: "geo.placename", content: "Düsseldorf-Oberbilk" },
      { name: "geo.position", content: "51.2155;6.7972" },
      { name: "ICBM", content: "51.2155, 6.7972" },
      {
        property: "og:title",
        content: "Glut, Ton & Minze: Community-Besuch bei La Grilladine Düsseldorf | Speisely",
      },
      {
        property: "og:description",
        content:
          "Sensorischer Erlebnisbericht aus dem Düsseldorfer Maghreb-Viertel: Meisterhafte Buchenholzkohle-Röstaromen, schmorende Tajine im Tontopf und Atay-Zeremonie.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1",
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
                "Glut, Ton & Minze: Ein sensorischer Community-Besuch bei La Grilladine in Düsseldorf-Oberbilk",
              description:
                "Ein Mitglied der Speisely Community berichtet aus der Dreieckstraße 26: Ganze Dorade Royale über offener Buchenglut, Salzzitronen-Tajine und die Zeremonie des Atay-Tees.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1",
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
  component: LaGrilladineCommunityVisitArticle,
});

/**
 * 3D Interactive Perspective Tilt Card
 * High-end micro-interaction with hardware acceleration
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
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

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

function LaGrilladineCommunityVisitArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

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
      <div className="bg-[#FAF7F0] text-forest min-h-screen selection:bg-[#E6B84A]/30">
        {/* Sticky Breadcrumb Bar */}
        <div className="border-b border-forest/10 bg-white/70 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-forest/70 truncate">
              <ol className="flex items-center gap-1.5 flex-wrap">
                <li>
                  <Link to="/" className="hover:text-forest transition">
                    {isDe ? "Startseite" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-forest/30">
                  ›
                </li>
                <li>
                  <Link to="/community" className="hover:text-forest transition">
                    Community
                  </Link>
                </li>
                <li aria-hidden="true" className="text-forest/30">
                  ›
                </li>
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

        {/* Editorial Article Header */}
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF4EC] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs border border-[#7FA46B]/25">
            <Users className="h-3.5 w-3.5 text-[#7FA46B]" aria-hidden="true" />
            <span>{isDe ? "Community Story · Selbst bezahlt" : "Community Story · Self-paid"}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[46px] font-bold text-forest leading-[1.16] tracking-tight">
            {isDe
              ? "Glut, Ton & Minze: Ein Abend bei La Grilladine in Düsseldorf-Oberbilk"
              : "Embers, Clay & Mint: An Evening at La Grilladine in Düsseldorf-Oberbilk"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/85 leading-relaxed font-normal">
            {isDe
              ? "Wer gutes Essen wirklich verstehen will, muss den Sinnen folgen: Dem Knistern glühender Buchenholzkohle, dem ersten Duft von geröstetem Kreuzkümmel und der samtigen Tiefe einer stundenlang geschmorten Tajine. Unser Community-Mitglied hat das kleine marokkanische Traditionslokal in der Dreieckstraße 26 besucht – ein Bericht über die feine Poesie unberührten Handwerks."
              : "To truly understand honest culinary craft, one must follow the senses: the gentle crackle of beechwood embers, the perfume of roasted cumin, and the velvety reduction of a tagine braised in clay for hours. A Speisely community member visited the intimate Moroccan dining room on Dreieckstraße 26 — an evocative chronicle of raw devotion to fire, earth, and hospitality."}
          </p>

          {/* Verification & Sensoric Meta Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe ? "Fotografiert & dokumentiert vor Ort" : "Photographed & documented on-site"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% Halal
            </span>
            <span className="text-forest/30">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <Flame className="h-3.5 w-3.5" />
              {isDe ? "Echte Buchenholzkohle" : "Natural Beechwood Charcoal"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="text-forest/60">{isDe ? "Oktober 2026" : "October 2026"}</span>
          </div>

          {/* Scraped Operational Quick-Dossier */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort & Anfahrt" : "Location"}
                </span>
                <strong className="font-semibold text-forest block">La Grilladine</strong>
                <p className="text-forest/75 text-xs leading-snug">
                  Dreieckstraße 26, 40227 Düsseldorf
                </p>
                <p className="text-forest/60 text-[11px]">
                  {isDe
                    ? "Oberbilk (Maghreb-Viertel, nahe Hbf)"
                    : "Oberbilk (Maghreb Quarter, near Central Station)"}
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
                    <span>Website</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Öffnungszeiten" : "Hours"}
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
                    <span>{isDe ? "Ruhetag" : "Closed"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coins className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Gästehinweise" : "House Notes"}
                </span>
                <div className="space-y-1.5 text-xs text-forest/80">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                    <AlertCircle className="h-3 w-3 text-amber-700 shrink-0" />
                    <span>{isDe ? "Nur Barzahlung (Cash Only)" : "Cash Only"}</span>
                  </div>
                  <p className="text-[11px] text-forest/70 leading-snug">
                    {isDe
                      ? "First Come, First Served — keine Reservierungen."
                      : "Strictly walk-ins only — no telephone reservations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Narrative Body: 4 Curated Chapters with Focused 3D Imagery */}
        <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 space-y-16 pb-20">
          {/* CHAPTER 1: THE SANCTUARY OF CHARCOAL & CLAY */}
          <section className="space-y-6">
            <ThreeDCard>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_theke_3d.webp?v=1"
                  alt={
                    isDe
                      ? "Die Theke von La Grilladine mit traditioneller Berber-Keramik, Terracotta-Töpfen und offener Holzkohleglut im Hintergrund"
                      : "The counter of La Grilladine with traditional Moroccan pottery, earthenware vessels, and open woodfire embers"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(28px)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md border border-white/10">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" />
                    <span>{isDe ? "Kapitel 01 · Der Ort" : "Chapter 01 · The Sanctuary"}</span>
                  </span>
                </div>
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest/90 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {isDe
                      ? "Handgeformte Tonkrüge, der arabische Schriftzug مشاوي (Mashawee) und im Hintergrund das leise Lodern der Buchenglut."
                      : "Hand-thrown earthenware, the Arabic script مشاوي (Grills), and the quiet glow of beechwood embers behind the wood counter."}
                  </p>
                </div>
              </div>
            </ThreeDCard>

            <div className="prose prose-forest max-w-none text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 font-sans">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "Der Eintritt in eine andere Zeit: Dreieckstraße 26"
                  : "Entering Another Rhythm: Dreieckstraße 26"}
              </h2>
              <p>
                {isDe
                  ? "Wer die geschäftige Kölner Straße in Düsseldorf-Oberbilk verlässt und in die Dreieckstraße einbiegt, spürt sofort, wie der Takt der Stadt langsamer wird. Noch bevor man die schwere Holztür von La Grilladine berührt, kündigt sich das Lokal in der kühlen Abendluft an: Mit dem trockenen, harzigen Aroma verbrennender Buchenholzkohle und der fernen, warmen Note von angeröstetem Kreuzkümmel."
                  : "Turning off the bustling Kölner Straße in Düsseldorf-Oberbilk into the quieter Dreieckstraße instantly shifts the tempo of the evening. Before your hand even touches the wooden door of La Grilladine, the restaurant announces itself in the cool evening air: with the dry, resinous perfume of beechwood charcoal and the distant, warm note of lightly toasted cumin."}
              </p>
              <p>
                {isDe
                  ? "Der Raum selbst verzichtet auf jede künstliche Inszenierung. Auf dem massiven Holztresen stehen handbemalte Tajine-Gefäße aus Fès und Terracotta-Krüge. Dahinter: Die offene Glut, betreut von einem Grillmeister, der die Hitze nicht mit Displays oder Reglern misst, sondern mit der Handfläche und dem geübten Blick für das Farbspektrum der Asche. Hier gilt kein formaler Reservierungsplan; man tritt ein, wird mit einem kurzen, herzlichen Lächeln begrüßt und nimmt Platz."
                  : "The room itself rejects all decorative vanity. Across the solid wooden counter sit hand-painted Fassi tagine vessels and porous terracotta jugs. Behind it: open coals tended by a grillmaster who measures temperature not with digital probes, but with his palm and an instinctive eye for the changing palette of white ash. There are no reservation buzzers here; you step inside, receive an understated nod, and take your seat."}
              </p>
            </div>
          </section>

          {/* CHAPTER 2: THE ANATOMY OF WOODFIRE (DORADE ROYALE) */}
          <section className="space-y-6 pt-6 border-t border-forest/10">
            <ThreeDCard>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1"
                  alt={
                    isDe
                      ? "Ganze Dorade Royale im Schmetterlingsschnitt über Buchenholzkohle gegrillt mit goldenen Kartoffel-Rondellen und Salat"
                      : "Whole butterflied Sea Bream grilled over beechwood coals with golden potato rondelles and salad"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(28px)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md border border-white/10">
                    <Fish className="h-3.5 w-3.5 text-[#E6B84A]" />
                    <span>{isDe ? "Kapitel 02 · Das Feuer" : "Chapter 02 · The Fire"}</span>
                  </span>
                </div>
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest/90 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {isDe
                      ? "Dorade Royale 'Papillon': Knusprig karamellisierte Haut, berauschende Chermoula-Glasur und saftiges weißes Filet."
                      : "Dorade Royale 'Papillon': Crisp blistered skin, fragrant chermoula glaze, and moist white fillets."}
                  </p>
                </div>
              </div>
            </ThreeDCard>

            <div className="prose prose-forest max-w-none text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 font-sans">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "Die Textur des Feuers: Dorade Royale im Schmetterlingsschnitt"
                  : "The Texture of Fire: Butterflied Dorade Royale"}
              </h2>
              <p>
                {isDe
                  ? "Guter Fisch über Holzkohle ist eine Frage von Sekunden und Berührung. Bei La Grilladine wird die Dorade Royale der Länge nach im Schmetterlingsschnitt aufgefaltet. Durch die vergrößerte Oberfläche trifft die intensive Strahlungshitze der Buchenglut direkt auf das Fleisch, während die Haut in Sekunden kross aufknuspert, ohne dass das feine Meerwasser-Aroma verloren geht."
                  : "Grilling fish over woodfire is an art of seconds and tactile precision. At La Grilladine, the sea bream is butterflied flat across the grate. By expanding the surface area, intense radiant heat crisps the silver skin in moments while sealing moisture inside the delicate white flesh."}
              </p>
              <p>
                {isDe
                  ? "Die Veredelung geschieht durch eine hauseigene Chermoula: Frischer Koriander, glatte Petersilie, zerstoßener Knoblauch, Kreuzkümmel, edelsüßes Paprikapulver und frisch gepresste Zitrone. Die Säure bricht die Fettstruktur des Fisches, während die Gewürze an den Rändern leicht anrösten. Dazu reicht die Küche keine gewöhnlichen Pommes Frites, sondern hauchdünn geschnittene, frische Kartoffel-Rondellen – kreisrunde Knusperscheiben, die im Mund knacken wie hausgemachte Chips und innen weich nach Kartoffel schmecken."
                  : "The dish is basted with house chermoula: fresh cilantro, flat-leaf parsley, crushed garlic, cumin, sweet paprika, and cold-pressed lemon juice. The citrus acidity balances the richness of the fish, while the herbs caramelize delicately along the blistered edges. Alongside it, the kitchen serves thin potato rondelles — circular discs that snap with the crispness of artisanal chips before revealing a fluffy, steaming core."}
              </p>
            </div>
          </section>

          {/* CHAPTER 3: THE ALCHEMY OF CLAY & TIME (TAJINE AUX CITRONS) */}
          <section className="space-y-6 pt-6 border-t border-forest/10">
            <ThreeDCard>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_tajine_poulet_3d.webp?v=1"
                  alt={
                    isDe
                      ? "Traditionelle Tajine de Poulet mit eingelegten Salzzitronen, gerösteten Mandeln und grünen Oliven im Tontopf"
                      : "Traditional Chicken Tagine with preserved lemons, toasted almonds, and green olives in earthenware"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(28px)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md border border-white/10">
                    <Utensils className="h-3.5 w-3.5 text-[#E6B84A]" />
                    <span>{isDe ? "Kapitel 03 · Der Ton" : "Chapter 03 · The Earth"}</span>
                  </span>
                </div>
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest/90 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {isDe
                      ? "Tajine de Poulet aux Citrons: Sanftes Blubbern im schweren Tontopf, confierte Salzzitronen und der Kontrast gerösteter Mandeln."
                      : "Tajine de Poulet aux Citrons: Gentle bubbling within dense clay, preserved lemon peel, and the crunch of toasted almonds."}
                  </p>
                </div>
              </div>
            </ThreeDCard>

            <div className="prose prose-forest max-w-none text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 font-sans">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "Die Alchemie der Geduld: Tajine de Poulet aux Citrons Confits"
                  : "The Alchemy of Patience: Tagine with Preserved Lemons"}
              </h2>
              <p>
                {isDe
                  ? "Wenn der schwere, konische Tondeckel am Tisch angehoben wird, entweicht eine dichte Wolke aus Ingwer, Safran und karamellisierten Zwiebeln. In der marokkanischen Küche ist die Tajine kein bloßes Gefäß, sondern ein Mikrokosmos: Der Dampf steigt an den kühlen Wänden empor, kondensiert und tropft kontinuierlich auf das Fleisch zurück. Das Ergebnis ist eine samtige, tief konzentrierte Sauce (M'qalli), die das Huhn so mürbe macht, dass es sich ohne Messer mit einem Stück warmem Fladenbrot teilen lässt."
                  : "When the conical clay lid is lifted tableside, a scented plume of ginger, saffron, and sweet braised onions fills the air. In Moroccan cooking, the tagine is not merely cookware, but an ecosystem: steam rises along the cooling ceramic slopes, condenses, and returns continuously to baste the ingredients. The resulting sauce is velvety and deeply concentrated, rendering the chicken so tender it requires no knife — only a tear of warm crusty bread."}
              </p>
              <p>
                {isDe
                  ? "Der sensorische Reiz liegt in der Balance dreier Elemente: Die herbe Frische monatelang in Meersalz fermentierter Zitronenschale, die herbe Würze grüner Oliven und der nussige Biss goldbraun gerösteter Mandeln. Es ist dieser ruhige Zusammenklang aus Säure, Salz und milder Süße, der zeigt, wie vollkommen traditionelle Rezepturen sein können, wenn ihnen nichts hinzugefügt und nichts genommen wird."
                  : "The sensory elegance hinges on three harmonized textures: the bright citrus depth of lemons aged in sea salt for months, the earthy brine of green olives, and the satisfying bite of golden almonds. It is this quiet interplay of acidity, savory depth, and gentle sweetness that demonstrates the timeless power of heritage recipes preserved without shortcuts."}
              </p>
            </div>
          </section>

          {/* CHAPTER 4: THE TEA RITUAL (ATAY BI NA'NA) */}
          <section className="space-y-6 pt-6 border-t border-forest/10">
            <ThreeDCard>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_minztee_3d.webp?v=1"
                  alt={
                    isDe
                      ? "Traditioneller marokkanischer Minztee aus polierter Silberkanne in feines Glas mit Schaumkrone auf gehämmertem Silbertablett"
                      : "Traditional Moroccan mint tea poured from silver teapot with frothy crown on hammered tray"
                  }
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(28px)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md border border-white/10">
                    <Coffee className="h-3.5 w-3.5 text-[#E6B84A]" />
                    <span>{isDe ? "Kapitel 04 · Das Ritual" : "Chapter 04 · The Ritual"}</span>
                  </span>
                </div>
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl bg-forest/90 backdrop-blur-md p-3 text-white border border-white/10 shadow-lg"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {isDe
                      ? "Atay bi Na'na: Frisch aufgebrüht in der Silberkanne, mit hoher Geste eingegossen für die zarte Schaumkrone (R'gwa)."
                      : "Atay bi Na'na: Brewed fresh in a silver teapot, poured from an elevated height to create the delicate crown of foam."}
                  </p>
                </div>
              </div>
            </ThreeDCard>

            <div className="prose prose-forest max-w-none text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 font-sans">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "Der krönende Abschluss: Das Zeremoniell des Atay"
                  : "The Final Act: The Living Ritual of Atay"}
              </h2>
              <p>
                {isDe
                  ? "Ein marokkanisches Mahl endet nicht mit dem Besteck, sondern mit dem Klingen von Glas auf Silber. Der Atay bi Na'na wird in einer schweren, polierten Silberkanne serviert. Grüner Gunpowder-Tee, ein üppiger Strauß frischer Nanaminze und dezente Süße ziehen darin zu einem bernsteinfarbenen Elixier heran."
                  : "A Moroccan meal does not conclude with cutlery; it ends with the gentle clink of patterned glass on hammered silver. Atay bi Na'na is served in a polished teapot. Chinese gunpowder tea leaves, a generous bouquet of fresh spearmint, and measured sweetness steep into an amber elixir."}
              </p>
              <p>
                {isDe
                  ? "Das Einschenken aus halber Armlänge Höhe ist keine Show, sondern Physik: Durch den Fallstrahl kühlt der heiße Tee leicht ab, belüftet sich mit Sauerstoff und bildet im filigranen Glas jene dichte, cremige Schaumkrone ('R'gwa' oder 'Rezza'), die in Marokko als Siegel wahrer Gastfreundschaft gilt. Der erste Schluck reinigt den Gaumen von den Röstaromen des Holzkohlegrills und hinterlässt eine kühle, anhaltende Klarheit."
                  : "Pouring from an elevated height is not mere theater; it is purposeful: the falling arc cools the infusion slightly, aerates the tea, and crowns the glass with a silky, delicate foam ring ('R'gwa'), revered as the hallmark of authentic hospitality. The first sip lifts the smoky intensity of the grill from the palate, leaving an enduring, refreshing clarity."}
              </p>
            </div>
          </section>

          {/* COMMUNITY SUMMARY & PRACTICAL TAKEAWAY */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/15 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E6B84A]/20 text-forest">
                <Heart className="h-6 w-6 text-[#E6B84A]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60 block">
                  {isDe ? "Persönliches Fazit" : "Community Reflection"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  {isDe
                    ? "Warum dieser Besuch in Erinnerung bleibt"
                    : "Why This Visit Remains Unforgettable"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-forest/80">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Echte Buchenholzkohle" : "Pure Beechwood Embers"}
                </span>
                <p>
                  {isDe
                    ? "Kein Gas, kein Elektro-Heizstab. Fisch und Fleisch tragen jene reine Holzfeuer-Signatur, die man heute nur noch selten findet."
                    : "Zero electric elements or gas shortcuts. Meats and seafood carry an authentic woodfire imprint rare to find today."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Echtes Schmoren im Ton" : "Slow Claypot Braising"}
                </span>
                <p>
                  {isDe
                    ? "Die Tajines werden nicht in Edelstahltöpfen vorgekocht und umgefüllt, sondern schmoren langsam in porösem Ton zu tiefem Aroma."
                    : "Tagines are braised genuinely in unglazed clay, concentrating juices naturally over hours without industrial shortcuts."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Gästefreundliche Preise" : "Transparent, Fair Value"}
                </span>
                <p>
                  {isDe
                    ? "Großzügige Portionen mit reichlich frischem Salat, Fladenbrot und Kartoffel-Rondellen zu sehr fairen Preisen."
                    : "Substantial portions accompanied by crisp potato discs, bread, and fresh salad at very fair neighborhood pricing."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-1.5 shadow-xs">
                <span className="font-bold text-forest flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isDe ? "Ehrliche Nachbarschaft" : "Authentic Neighborhood Soul"}
                </span>
                <p>
                  {isDe
                    ? "Keine Schickimicki-Attitüde. Man kommt als Gast und wird mit der unkomplizierten Herzlichkeit des Maghreb empfangen."
                    : "No pretentious velvet ropes. You arrive hungry and are greeted with the heartfelt ease of genuine Maghrebi hospitality."}
                </p>
              </div>
            </div>
          </section>

          {/* EDITORIAL DISCLOSURE & SOURCES */}
          <aside className="p-6 rounded-2xl bg-white border border-forest/10 text-xs text-forest/70 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Info className="w-4 h-4 text-[#E6B84A]" />
              <span>
                {isDe
                  ? "Transparenzhinweis & redaktionelle Recherche"
                  : "Editorial Transparency & Background"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isDe
                ? "Dieser Beitrag basiert auf den Vor-Ort-Eindrücken und Fotografien eines aktiven Speisely Community-Mitglieds (selbst bezahlt, ohne Einladung oder Gegenleistung). Die Betriebszeiten, Standortangaben und Küchenspezifikationen wurden über die offizielle Webpräsenz (la-grilladine.de) sowie das Tourismusportal Visit Düsseldorf (visitduesseldorf.de) redaktionell geprüft. Speisely führt keine bezahlten Ranking-Einträge."
                : "This story is based on the verified on-site experience and photography contributed by a Speisely community member (self-paid, without invitation or promotional perks). Operating hours, location details, and culinary data were cross-checked via the restaurant's official presence (la-grilladine.de) and Visit Düsseldorf (visitduesseldorf.de). Speisely publishes zero paid rating rankings."}
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
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                {isDe
                  ? "Kennst du ein Restaurant mit echter Seele?"
                  : "Know a Restaurant with Genuine Soul?"}
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Ob Holzkohlegrill, Familienbäckerei oder Spezialitätenküche: Teile deine ehrlichen Genuss-Momente mit der Speisely Community."
                  : "Whether open woodfire, family bakery, or heritage cuisine: share your genuine food discoveries with the Speisely Community."}
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
