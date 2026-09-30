import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Mail, Instagram, Sparkles, Share2, Check } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/chicken-krush-prag")({
  head: () => ({
    meta: [
      { title: "Chicken Krush Prag — Speisely Community" },
      {
        name: "description",
        content:
          "Korean Fried Chicken, Snow Flake & Tteokbokki in Prag: Unser Community-Erlebnis bei Chicken Krush in Nové Město.",
      },
      {
        name: "keywords",
        content:
          "Chicken Krush Prag, Korean Fried Chicken Prague, Yangnyeom Chicken, Snow Flake Chicken, Rose Tteokbokki Prag, Chimaek Prag, Korean Food Nové Město, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "CZ-10" },
      { name: "geo.placename", content: "Prag-Nové Město" },
      { name: "geo.position", content: "50.0782;14.4231" },
      { name: "ICBM", content: "50.0782, 14.4231" },
      {
        property: "og:title",
        content:
          "Community Story: Chicken Krush Prag — Wo Crunch auf K-Food-Tradition trifft | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely-Community-Besuch bei Chicken Krush in Prag: Knuspriges Korean Fried Chicken, traditionelle Yangnyeom-Glasur, digitale Touchscreen-Bestellung und gemeinsame Sharing-Boards.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/chicken-krush-prag/ck-hd-01-neon-emblem.webp?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/chicken-krush-prag",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/chicken-krush-prag",
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
              "@id": "https://speisely.de/magazin/community/chicken-krush-prag#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/chicken-krush-prag",
                url: "https://speisely.de/magazin/community/chicken-krush-prag",
                name: "Community Story: Chicken Krush Prag | Speisely",
              },
              headline:
                "Goldener Crunch, Yangnyeom-Glanz und Sharing Boards in den Gassen von Prag",
              description:
                "Ein Speisely-Community-Besuch bei Chicken Krush in Prag-Nové Město: Knusprig frittiertes Hähnchen, traditionelle Saucen, digitale Tisch-Bestellung und echtes Chimaek-Feeling.",
              image: "https://speisely.de/magazin/chicken-krush-prag/ck-hd-01-neon-emblem.webp?v=2",
              datePublished: "2026-09-29",
              dateModified: "2026-09-29",
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
                name: "Chicken Krush",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Příčná 1632/9",
                  addressLocality: "Praha 1 - Nové Město",
                  postalCode: "11000",
                  addressRegion: "Hlavní město Praha",
                  addressCountry: "CZ",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.0782,
                  longitude: 14.4231,
                },
                url: "https://chickenkrush.cz",
                servesCuisine: "Korean Fried Chicken, K-Food Fusion",
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
                  name: "Magazin",
                  item: "https://speisely.de/magazin",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Community",
                  item: "https://speisely.de/community",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Chicken Krush Prag",
                  item: "https://speisely.de/magazin/community/chicken-krush-prag",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ChickenKrushCommunityPage,
});

function ChickenKrushCommunityPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const [copied, setCopied] = useState(false);

  const copyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const emailSubject = isDe
    ? "Mein Erlebnis für die Speisely Community"
    : "My experience for the Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely,
Ich möchte ein Erlebnis mit der Speisely Community teilen.

Restaurant, Caterer, Event oder Ort:
Stadt:
Datum:
Meine Geschichte:
Was habe ich bestellt, entdeckt oder erlebt?
Foto-/Videocredit:
War etwas kostenlos, vergünstigt, eingeladen oder gesponsert?

Ich füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,
I would like to share an experience with the Speisely Community.

Restaurant, caterer, event or location:
City:
Date:
My story:
What did I order, discover or experience?
Photo/video credit:
Was anything free, discounted, invited or sponsored?

I will attach my own photos or videos to this email.`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const instagramHref = "https://www.instagram.com/speisely/";

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-forest/10 bg-white/70 backdrop-blur-md sticky top-16 z-30 shadow-xs">
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
                  <Link to="/magazin" className="hover:text-forest transition">
                    {isDe ? "Magazin" : "Magazine"}
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
                  Chicken Krush Prag
                </li>
              </ol>
            </nav>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyPageLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-forest/5 text-forest hover:bg-forest/10 transition cursor-pointer"
                title={isDe ? "Link kopieren" : "Copy Link"}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700">{isDe ? "Kopiert!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-[#A85C36]" aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {isDe ? "Story teilen" : "Share Story"}
                    </span>
                  </>
                )}
              </button>
              <Link
                to="/community"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-[#7FA46B] transition"
              >
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isDe ? "Alle Stories" : "All Stories"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDEEE3] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
            <span>{isDe ? "Aus der Speisely Community" : "From the Speisely Community"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.15] tracking-tight">
            {isDe
              ? "Goldener Crunch, Yangnyeom-Glanz und Sharing Boards in Prag"
              : "Golden Crunch, Yangnyeom Glaze and Sharing Boards in Prague"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Ein Speisely-Community-Mitglied hat auf seiner Prag-Reise einen besonderen Food-Stopp eingelegt: Chicken Krush in der Příčná-Straße, Nové Město — slow-gefrittiertes Korean Chicken, dickflüssige Gochujang-Glasuren und geteilte Holzbretter."
              : "A Speisely community member took a memorable food break during their trip to Prague: Chicken Krush on Příčná Street, Nové Město — slow-fried Korean chicken, rich gochujang glazes, and shared wooden platters."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm shadow-xs">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Chicken Krush</strong>
                <span className="block text-forest/70 text-xs">
                  Příčná 1632/9, Praha 1 – Nové Město
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Beitragstyp" : "Story Type"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Community Story" : "Community Story"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Aus der Speisely Community" : "From the Speisely Community"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Fotocredit" : "Photo Credit"}
                </span>
                <strong className="font-semibold text-forest">Speisely Community</strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Redaktionell aufbereitet" : "Editorially prepared"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          <div className="prose prose-lg max-w-none text-forest/85 space-y-8 leading-relaxed font-normal">
            {/* Photo 1 — Iconic Neon Logo (Compact Luxury Passe-Partout Card) */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/chicken-krush-prag/ck-hd-01-neon-emblem.webp?v=2"
                    alt={
                      isDe
                        ? "Beleuchtetes THE CHICKEN KRUSH Neonschild auf rustikaler Ziegelwand in Prag"
                        : "Illuminated THE CHICKEN KRUSH neon sign on exposed brick wall in Prague"
                    }
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    ✨ The Chicken Krush
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Das beleuchtete Markenzeichen von Chicken Krush auf rustikaler Backsteinwand in Prag-Nové Město."
                    : "The illuminated Chicken Krush emblem on the rustic exposed brick wall in Prague-Nové Město."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Unser Community-Mitglied hatte keinen großen Plan für den Abend — nur Hunger und eine Notiz auf dem Handy: Příčná-Straße, Nové Město. Der goldene Schriftzug über dem Eingang leuchtete warm in die Abendgasse. Dahinter: ein stimmungsvoller Raum, volle Holzbretter und der unverwechselbare Geruch von frisch frittiertem Hähnchen."
                : "There was no big plan for that evening — just hunger and a note on the phone: Příčná Street, Nové Město. The golden sign above the entrance glowed warmly into the evening alley. Inside: an atmospheric dining room, loaded wooden boards, and the unmistakable scent of freshly fried chicken."}
            </p>

            <p>
              {isDe
                ? "An jedem Tisch wartet ein eigener Touchscreen — auf Tschechisch, Englisch oder Koreanisch. Man bestellt ganz unkompliziert selbst, lehnt sich zurück und genießt die Atmosphäre. Das Essen kommt schnell und heiß auf dem Brett."
                : "Every table has its own touchscreen — in Czech, English, or Korean. You order at your own pace, lean back, and soak in the atmosphere. The food arrives fast and piping hot on the wooden board."}
            </p>

            {/* Photo 2 — Golden Exterior Facade (Compact Framed) */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/chicken-krush-prag/ck-hd-02-facade-sign.webp?v=2"
                    alt={
                      isDe
                        ? "Fassade von Chicken Krush in Prag mit leuchtendem goldenem Schriftzug über dem Eingang"
                        : "Exterior of Chicken Krush Prague with glowing golden sign above the entrance"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    📍 Příčná-Straße · Nové Město
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Der goldene Schriftzug an der Fassade: Chicken Krush in der Přičná-Straße, Prag-Nové Město."
                    : "The golden sign on the facade: Chicken Krush on Přičná Street, Prague-Nové Město."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Der erste Crunch am Tisch: Slow-Fried Perfektion"
                : "The First Crunch at the Table: Slow-Fried Perfection"}
            </h2>

            <p>
              {isDe
                ? "Auf jedem servierten Holzbrett steckt eine kleine Flagge: Slow Fried und Taste Respect. Die Kruste ist hauchdünn, extrem kross und bricht beim ersten Hineinbeißen mit einem deutlichen Knacken. Innen dampft das Fleisch saftig und zart — genau die Balance, die gutes Korean Fried Chicken ausmacht."
                : "Every wooden board arrives with a small flag: Slow Fried and Taste Respect. The batter is paper-thin, shatteringly crisp and cracks with a clean snap at the first bite. Inside, the chicken steams tender and juicy — the perfect balance that defines great Korean Fried Chicken."}
            </p>

            {/* Photo 3 — Classic Fried Born in Seoul (Compact Framed) */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/chicken-krush-prag/ck-hd-03-classic-fried.webp?v=2"
                    alt={
                      isDe
                        ? "Klassisches knuspriges Korean Fried Chicken mit Born in Seoul Flagge, Pommes, Coleslaw und Dips auf Holzbrett"
                        : "Classic crispy Korean fried chicken with Born in Seoul flag, fries, coleslaw and dipping sauces on wooden board"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    🍗 Born in Seoul · Slow Fried
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Born in Seoul: Goldgelb frittiertes Korean Fried Chicken auf dem Holzbrett mit Pommes, Coleslaw und Dips."
                    : "Born in Seoul: Golden Korean Fried Chicken on the board with fries, fresh coleslaw and dipping sauces."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Süße Schärfe und samtiger Kontrast" : "Sweet Heat and Snowy Contrast"}
            </h2>

            <p>
              {isDe
                ? "Beim Teilen am Tisch greift man automatisch von einem Brett zum nächsten: Das tiefrot glänzende Yangnyeom Chicken ist dick eingekocht mit Gochujang, Honig und Knoblauch, bestreut mit gerösteten Mandelsplittern — klebrig, scharf und süß zugleich. Eine Kombination, die jeden Bissen zu einem Erlebnis macht. Die Dipsaucen und der frische Krautsalat sorgen für die perfekte Balance."
                : "Sharing across the table means constantly switching flavours: deeply glazed Yangnyeom chicken simmered with gochujang, garlic, and honey, topped with toasted almond slivers for a sticky sweet-heat kick. A combination that makes every bite an experience. The dipping sauces and fresh coleslaw provide the perfect balance."}
            </p>

            {/* Photo 4 & 5 Grid — Yangnyeom & Sharing Board (Compact Framed 2-Column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
              <figure>
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/chicken-krush-prag/ck-hd-04-yangnyeom-glaze.webp?v=2"
                      alt={
                        isDe
                          ? "Yangnyeom Chicken mit Taste Respect Flagge, Pommes und Dips auf Chicken Krush Serviertablett"
                          : "Yangnyeom chicken with Taste Respect flag, fries and dipping sauces on Chicken Krush serving tray"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                      🔥 Yangnyeom Glaze
                    </div>
                  </div>
                </div>
                <figcaption className="mt-2 text-xs text-forest/70 px-1 font-medium">
                  {isDe
                    ? "Kräftig rot glasiertes Yangnyeom Chicken mit Taste Respect Fähnchen."
                    : "Deeply glazed Yangnyeom chicken with Taste Respect flag."}
                </figcaption>
              </figure>

              <figure>
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/chicken-krush-prag/ck-hd-05-sharing-board.webp?v=2"
                      alt={
                        isDe
                          ? "Grosses Sharing-Brett bei Chicken Krush Prag mit weißglasierten Boneless Bites, Yangnyeom Chicken, Pommes, Coleslaw, Burger und Dips"
                          : "Large sharing board at Chicken Krush Prague with white-glazed boneless bites, Yangnyeom chicken, fries, coleslaw, burger and dipping sauces"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                      🍽️ Sharing Board Feast
                    </div>
                  </div>
                </div>
                <figcaption className="mt-2 text-xs text-forest/70 px-1 font-medium">
                  {isDe
                    ? "Das große Sharing-Brett: Boneless Bites, Yangnyeom Chicken, Pommes und Dips."
                    : "The big sharing board: white-glazed bites, Yangnyeom chicken, fries and dips."}
                </figcaption>
              </figure>
            </div>

            <p className="font-medium text-forest text-lg pt-2">
              {isDe
                ? "Ein lebendiger, unkomplizierter Abend in Prag: Reinkommen, per Touchscreen bestellen, gemeinsam Holzbretter teilen und authentisches Korean Fried Chicken in Bestform genießen — mitten in der Prager Neustadt."
                : "A vibrant, effortless evening in Prague: walk in, order via touchscreen, share the wooden platters together, and enjoy authentic Korean Fried Chicken at its very best — right in the heart of Nové Město."}
            </p>

            {/* Editorial Disclosure Box */}
            <div className="rounded-2xl bg-cream p-5 text-xs text-forest/75 border border-forest/15 space-y-2 mt-8">
              <div className="flex items-center gap-2 font-bold text-forest text-xs">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p className="leading-relaxed">
                {isDe
                  ? "Dieser redaktionelle Beitrag basiert auf einem Besuch und Fotografien aus der Speisely Community bei Chicken Krush in Prag. Speisely war nicht selbst vor Ort. Der Beitrag gibt die visuellen Eindrücke der geteilten Fotos und öffentlich zugänglichen Informationen wieder und stellt keine bezahlte Werbeplatzierung dar. Fotocredit: Speisely Community."
                  : "This editorial story is based on a visit and photographs shared by members of the Speisely Community at Chicken Krush in Prague. Speisely was not directly on-site. It reflects visual impressions and public culinary information and does not constitute a paid endorsement. Photo credit: Speisely Community."}
              </p>
            </div>
          </div>

          <AboutSpeiselySection />
        </article>

        {/* CTA Banner */}
        <section className="border-t border-forest/10 pt-16 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#f2d896] backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isDe ? "Speisely Community" : "Speisely Community"}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold">
                  {isDe
                    ? "Hast du auch einen besonderen Food-Moment erlebt?"
                    : "Had a memorable food experience of your own?"}
                </h2>
                <p className="text-sm sm:text-base opacity-85 leading-relaxed">
                  {isDe
                    ? "Teile deine Restaurantbesuche, Café-Momente oder Food-Entdeckungen mit der Speisely Community. Schick uns deine Geschichte und Fotos."
                    : "Share your café visits, dining highlights or sweet discoveries with the Speisely Community. Send us your story and photos."}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-[#9a7633] transition"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>{isDe ? "Per E-Mail teilen" : "Share via Email"}</span>
                  </a>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-6 py-3 text-xs sm:text-sm font-semibold hover:bg-white/25 transition backdrop-blur-xs"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
