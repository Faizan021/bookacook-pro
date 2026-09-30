import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Shield,
  Users,
  Mail,
  Instagram,
  Sparkles,
  Share2,
  Check,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/san-sebastian-berlin")({
  head: () => ({
    meta: [
      { title: "San Sebastian Cheesecake Berlin — Speisely Magazin" },
      {
        name: "description",
        content:
          "Baskischer Cheesecake, Pistazien & Schokolade bei San Sebastian The Original® in Berlin-Charlottenburg erleben.",
      },
      {
        name: "keywords",
        content:
          "San Sebastian Cheesecake Berlin, Basque Burnt Cheesecake Berlin, San Sebastian The Original Uhlandstraße, Käsekuchen Berlin Charlottenburg, Pistazien Cheesecake, Lotus Biscoff Cheesecake, Schoko Guss Cheesecake, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Charlottenburg" },
      { name: "geo.position", content: "52.5025;13.3245" },
      { name: "ICBM", content: "52.5025, 13.3245" },
      {
        property: "og:title",
        content:
          "Community Story: San Sebastian The Original® Berlin — Wo baskische Tradition auf Schokofluss trifft | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely-Community-Besuch bei San Sebastian The Original® in Berlin: Dunkel karamellisierte Kruste, samtig fließender Kern, warme Saucen und die Geschichte des weltberühmten Kuchens aus San Sebastián.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.webp?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/san-sebastian-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/san-sebastian-berlin",
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
              "@id": "https://speisely.de/magazin/community/san-sebastian-berlin#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/san-sebastian-berlin",
                url: "https://speisely.de/magazin/community/san-sebastian-berlin",
                name: "Community Story: San Sebastian The Original® Berlin | Speisely",
              },
              headline:
                "Karamellisierte Kruste, samtiger Kern und Schokofluss: San Sebastian Cheesecake in Berlin",
              description:
                "Ein Speisely-Community-Besuch bei San Sebastian The Original® in Berlin-Charlottenburg: Baskische Käsekuchenkultur, Pistazienstaub, warmer Schokoguss und die Entstehungsgeschichte des Kultkuchens.",
              image:
                "https://speisely.de/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.webp?v=2",
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
                "@type": "CafeOrCoffeeShop",
                name: "San Sebastian The Original® Berlin",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Uhlandstraße 167",
                  addressLocality: "Berlin",
                  postalCode: "10719",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5025,
                  longitude: 13.3245,
                },
                url: "https://www.sansebastian.berlin",
                servesCuisine: "Cheesecake, Specialty Coffee, Desserts",
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
                  name: "San Sebastian Berlin",
                  item: "https://speisely.de/magazin/community/san-sebastian-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SanSebastianCommunityPage,
});

function SanSebastianCommunityPage() {
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

Restaurant, Café, Event oder Ort:
Stadt:
Datum:
Meine Geschichte:
Was habe ich bestellt, entdeckt oder erlebt?
Foto-/Videocredit:
War etwas kostenlos, vergünstigt, eingeladen oder gesponsert?

Ich füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,
I would like to share an experience with the Speisely Community.

Restaurant, café, event or location:
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
                  San Sebastian Berlin
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
              ? "Karamellisierte Kruste, samtiger Kern und Schokofluss in Berlin"
              : "Caramelized Crust, Custardy Molten Core and Flowing Chocolate in Berlin"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Ein Community-Mitglied hat San Sebastian The Original® in Berlin-Charlottenburg besucht: Das legendäre spanische Dessert mit gerösteter Karamellkruste, löffelweichem Kern, flüssigen Gourmet-Saucen und einer Vielfalt von Pistazie bis Lotus Biscoff."
              : "A Speisely community member visited San Sebastian The Original® in Berlin-Charlottenburg: the legendary Spanish dessert with scorched caramel crust, luscious custard center, velvety warm sauces, and toppings ranging from Sicilian pistachio to Lotus Biscoff."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm shadow-xs">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">San Sebastian The Original®</strong>
                <span className="block text-forest/70 text-xs">
                  Uhlandstraße 167, 10719 Berlin &amp; Gropius Passagen
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
            {/* Hero Photo 1 — Compact Luxury Passe-Partout Card */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.webp?v=2"
                    alt={
                      isDe
                        ? "Frisch servierter San Sebastian Cheesecake Slice in HD-Klarheit, übergossen mit warmer Schokoladensauce"
                        : "Freshly served San Sebastian cheesecake slice in HD clarity drenched in warm chocolate sauce"
                    }
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    🍫 Signature Schokofluss
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Der Signature Moment: Ein Kuchenstück versinkt unter einem dichten, warmen Schokoladenguss."
                    : "The signature moment: A generous slice enveloped in a warm, glossy stream of chocolate."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Wenn der Löffel ohne jeden Widerstand durch die dunkel geröstete Oberseite gleitet und im Inneren ein fast flüssiger, seidiger Kern zum Vorschein kommt, wird sofort klar: Das hier ist kein gewöhnlicher Käsekuchen. San Sebastian The Original® in Berlin widmet sich ganz dem Phänomen des baskischen Käsekuchens – einem Dessert, das mit seiner unverwechselbaren Textur weltweit Genießer begeistert."
                : "When the spoon glides effortlessly through the dark caramelized crust to reveal a silky, molten custard center, you understand immediately: this is no ordinary cheesecake. San Sebastian The Original® in Berlin is devoted entirely to the Basque cheesecake phenomenon — a dessert that has captivated palates worldwide with its unique texture."}
            </p>

            {/* History Section: Santiago Rivera & La Viña */}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Die Geburt einer Legende: Aus San Sebastián in die Welt"
                : "The Birth of a Legend: From San Sebastián to the World"}
            </h2>

            <p>
              {isDe
                ? "Die Geschichte dieses Kultkuchens beginnt 1990 in der baskischen Küstenstadt San Sebastián (Donostia) im Norden Spaniens. In der malerischen Altstadtgasse Calle 31 de Agosto führte Küchenchef Santiago Rivera die traditionelle Pintxos-Bar La Viña. Rivera experimentierte jahrelang an einer ganz eigenen Rezeptur, die alle bisherigen Konditorregeln auf den Kopf stellte: Kein Keksboden, kein Wasserbad, keine niedrige Backtemperatur."
                : "The history of this iconic dessert began in 1990 in the Basque coastal town of San Sebastián (Donostia) in northern Spain. In the historic alley of Calle 31 de Agosto, chef Santiago Rivera ran the traditional pintxos bar La Viña. Rivera spent years refining a recipe that turned classic baking rules upside down: no biscuit base, no water bath, and no low-and-slow baking."}
            </p>

            <p>
              {isDe
                ? "Stattdessen wird der Kuchen bei extrem hoher Hitze gebacken. Das Ergebnis: Die Maillard-Reaktion lässt die Oberseite tief dunkelbraun bis fast schwarz karamellisieren, wodurch feine Aromen von geröstetem Karamell und Haselnuss entstehen. Gleichzeitig bleibt das Innere herrlich cremig, fast wie eine warme Vanillecreme. Was in den 1990ern ein lokales Geheimnis in den baskischen Pintxos-Bars war, entwickelte sich über die Jahrzehnte zu einem der gefragtesten Dessert-Trends der internationalen Gourmetszene."
                : "Instead, the cake is baked at intense heat. The Maillard reaction scorches the surface to a deep mahogany-black caramel, imparting toasty toffee notes, while the interior remains intensely creamy and custardy. What started as a local Basque pintxos bar secret in the 1990s grew into one of the most celebrated dessert sensations worldwide."}
            </p>

            {/* Photo 2 — Pistachio Dust on Gold Plate (Compact Framed) */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/san-sebastian-berlin/san-sebastian-hd-02-pistachio-gold.webp?v=2"
                    alt={
                      isDe
                        ? "San Sebastian Cheesecake Slice auf golden verziertem Teller, bestreut mit feinem sizilianischem Pistazienstaub"
                        : "San Sebastian cheesecake slice on gold-rimmed plate generously dusted with Sicilian pistachio powder"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    🌱 Sizilianischer Pistazienstaub
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Fein gemahlener Pistazienstaub auf goldverziertem Teller: Aromatischer Kontrast zum cremigen Kern."
                    : "Finely ground pistachio dust on a gold-accented plate: aromatic contrast to the creamy core."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Die Berliner Interpretation: Handwerk trifft Topping-Kunst"
                : "The Berlin Interpretation: Craftsmanship Meets Topping Artistry"}
            </h2>

            <p>
              {isDe
                ? "Bei San Sebastian The Original® in Berlin wird diese spanische Tradition mit zeitgemäßer Handwerkskunst gefeiert. Jeden Tag werden die Kuchen frisch vor Ort gebacken. Beim Blick in die beleuchtete Vitrine fällt sofort die enorme Bandbreite auf: Neben dem klassischen baskischen Original gibt es durchdachte Sorten wie Lotus Biscoff, Kinder Bueno, Oreo, Strawberry Lemon, fruchtiges Solero, Tiramisu, Raffaello und sogar proteinreiche sowie vegane und laktosefreie Optionen."
                : "At San Sebastian The Original® in Berlin, this Spanish heritage is crafted fresh daily. Stepping up to the illuminated showcase reveals a vast culinary spectrum: alongside the classic Basque original, you discover thoughtfully curated creations like Lotus Biscoff, Kinder Bueno, Oreo, Strawberry Lemon, vibrant Solero, Tiramisu, Raffaello, plus vegan and lactose-free versions."}
            </p>

            {/* Photo 3 — Showcase with Varieties (Compact Framed) */}
            <figure className="my-8 max-w-xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/san-sebastian-berlin/san-sebastian-hd-03-showcase-varieties.webp?v=2"
                    alt={
                      isDe
                        ? "Große Kuchentheke bei San Sebastian Berlin mit Sorten wie Lotus, Oreo, Bueno, Strawberry Lemon, Solero, Raffaello, Vegan und Protein"
                        : "Cheesecake display at San Sebastian Berlin featuring Lotus, Oreo, Bueno, Strawberry Lemon, Solero, Raffaello, Vegan and Protein varieties"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    🍰 Große Sortenvielfalt
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Vielfalt in der Vitrine: Von Lotus Biscoff, Bueno und Oreo bis zu veganen und glutenfreien Kreationen."
                    : "Showcase variety: From Lotus Biscoff, Bueno, and Oreo to vegan and gluten-free variations."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Geschmacksprofil: Crunch, Säure und Kaffee-Pairing"
                : "Flavor Profile: Crunch, Acidity, and Coffee Pairing"}
            </h2>

            <p>
              {isDe
                ? "Das Geheimnis des Genusses liegt im Kontrast: Die karamellisierte, leicht herbe Kruste fängt die milde Süße des Frischkäses ab. Wird das Stück dann mit heißer belgischer Vollmilch- oder Zartbitterschokolade, nussigem Pistazienpüree oder flüssigem Salted Caramel übergossen, verschmelzen die Temperaturen zu einem reichhaltigen Gaumenerlebnis. Ein frisch gezapfter doppelter Espresso oder samtiger Flat White liefert dazu die ideale herbe Balance."
                : "The magic is in the interplay of contrasts: the deep caramelized crust cuts through the lush richness of the cream cheese. When drizzled with hot Belgian milk chocolate, dark chocolate, nutty pistachio cream, or silky salted caramel, temperature and texture harmonize beautifully. A freshly pulled double espresso or velvety flat white provides the ideal bitter counterbalance."}
            </p>

            {/* Photo 4 & 5 Grid — Lotus Crumble & Mango/Hazelnut (Compact Framed 2-Column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
              <figure>
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/san-sebastian-berlin/san-sebastian-hd-04-lotus-biscoff.webp?v=2"
                      alt={
                        isDe
                          ? "San Sebastian Cheesecake in der To-Go-Box mit reichlich Lotus Biscoff Crumble und fließendem Kern"
                          : "San Sebastian cheesecake in a takeaway box with abundant Lotus Biscoff crumble and soft center"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                      🍪 Lotus Crumble
                    </div>
                  </div>
                </div>
                <figcaption className="mt-2 text-xs text-forest/70 px-1 font-medium">
                  {isDe
                    ? "Knuspriges Lotus Biscoff Crumble auf fließend cremigem Kern."
                    : "Crispy Lotus Biscoff crumble atop a luscious custardy core."}
                </figcaption>
              </figure>

              <figure>
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/san-sebastian-berlin/san-sebastian-hd-05-mango-hazelnut.webp?v=2"
                      alt={
                        isDe
                          ? "San Sebastian Cheesecake Slice mit sonnengelbem Mango-Maracuja-Spiegel und gehackten Haselnüssen"
                          : "San Sebastian cheesecake slice with bright mango-passionfruit coulis and chopped hazelnuts"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#173C32]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                      🥭 Mango &amp; Haselnuss
                    </div>
                  </div>
                </div>
                <figcaption className="mt-2 text-xs text-forest/70 px-1 font-medium">
                  {isDe
                    ? "Fruchtige Frische: Sonnengelber Mango-Spiegel mit gerösteten Haselnüssen."
                    : "Fruity contrast: Golden mango coulis paired with crunchy roasted hazelnuts."}
                </figcaption>
              </figure>
            </div>

            <p className="font-medium text-forest text-lg pt-2">
              {isDe
                ? "Ein Ort für echte Genießer: San Sebastian The Original® beweist eindrucksvoll, warum die baskische Käsekuchenkultur von Santiago Riveras kleiner Küche in San Sebastián bis nach Berlin zu einem weltweiten Phänomen geworden ist."
                : "A destination for genuine dessert enthusiasts: San Sebastian The Original® proves why Basque cheesecake culture has traveled from Santiago Rivera's kitchen in northern Spain all the way to Berlin as an international icon."}
            </p>

            {/* Editorial Disclosure Box */}
            <div className="rounded-2xl bg-cream p-5 text-xs text-forest/75 border border-forest/15 space-y-2 mt-8">
              <div className="flex items-center gap-2 font-bold text-forest text-xs">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p className="leading-relaxed">
                {isDe
                  ? "Dieser redaktionelle Beitrag basiert auf einem Besuch und Fotografien aus der Speisely Community bei San Sebastian The Original® in Berlin. Speisely war nicht selbst vor Ort. Der Beitrag gibt die visuellen Eindrücke der geteilten Fotos und öffentlich zugänglichen Informationen wieder und stellt keine bezahlte Werbeplatzierung dar. Fotocredit: Speisely Community."
                  : "This editorial story is based on a visit and photographs shared by members of the Speisely Community at San Sebastian The Original® in Berlin. Speisely was not directly on-site. It reflects visual impressions and public culinary information and does not constitute a paid endorsement. Photo credit: Speisely Community."}
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
