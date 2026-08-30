/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Utensils, Mail, Instagram, Sparkles, ExternalLink, BookOpen } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/magazin/community/kokio-berlin")({
  head: () => ({
    meta: [
      { title: "Community Story: KOKIO Berlin-Prenzlauer Berg | Speisely" },
      {
        name: "description",
        content:
          "Zwischen Crunch, Sauce und koreanischer Esskultur: Knuspriges Fried Chicken, hausgemachte Saucen und Chimaek-Tradition bei KOKIO in Berlin-Prenzlauer Berg.",
      },
      {
        name: "keywords",
        content:
          "KOKIO Berlin, Korean Fried Chicken Berlin, Halal Chicken Berlin, Chimaek Berlin, Prenzlauer Berg Fried Chicken, Yangnyeom Chicken, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Prenzlauer Berg" },
      { name: "geo.position", content: "52.5376;13.4144" },
      { name: "ICBM", content: "52.5376, 13.4144" },
      {
        property: "og:title",
        content: "Community Story: KOKIO Berlin-Prenzlauer Berg | Speisely",
      },
      {
        property: "og:description",
        content:
          "Knuspriges Fried Chicken, verschiedene hausgemachte Saucen und ein Essen, das am schönsten gemeinsam schmeckt. Ein Community-Besuch bei KOKIO Berlin.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/kokio-berlin/kokio-boneless-02.jpg",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/kokio-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/kokio-berlin",
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
              "@id": "https://speisely.de/magazin/community/kokio-berlin#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/kokio-berlin",
                url: "https://speisely.de/magazin/community/kokio-berlin",
                name: "Community Story: KOKIO Berlin-Prenzlauer Berg | Speisely",
              },
              headline: "Zwischen Crunch, Sauce und koreanischer Esskultur",
              description:
                "Ein Speisely-Community-Besuch bei KOKIO Berlin: knuspriges Fried Chicken, verschiedene hausgemachte Saucen und ein Essen, das am schönsten gemeinsam schmeckt.",
              image: "https://speisely.de/magazin/kokio-berlin/kokio-boneless-02.jpg",
              datePublished: "2026-08-30",
              dateModified: "2026-08-30",
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
                name: "KOKIO Berlin",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Hagenauer Straße 9",
                  addressLocality: "Berlin",
                  postalCode: "10435",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5376,
                  longitude: 13.4144,
                },
                url: "https://de.kokioberlin.com",
                servesCuisine: "Korean",
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
                  name: "KOKIO Berlin",
                  item: "https://speisely.de/magazin/community/kokio-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: KokioCommunityPage,
});

function KokioCommunityPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Erlebnis für die Speisely Community"
    : "My experience for the Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely,\nIch möchte ein Erlebnis mit der Speisely Community teilen.\n\nRestaurant, Caterer, Event oder Ort:\nStadt:\nDatum:\nMeine Geschichte:\nWas habe ich bestellt, entdeckt oder erlebt?\nFoto-/Videocredit:\nWar etwas kostenlos, vergünstigt, eingeladen oder gesponsert?\n\nIch füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,\nI would like to share an experience with the Speisely Community.\n\nRestaurant, caterer, event or location:\nCity:\nDate:\nMy story:\nWhat did I order, discover or experience?\nPhoto/video credit:\nWas anything free, discounted, invited or sponsored?\n\nI will attach my own photos or videos to this email.`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const instagramHref = "https://www.instagram.com/speisely/";

  const menuUrl = "https://mylightspeed.app/DPJKBUDB/C-ordering?utm_source=speisely&utm_medium=referral&utm_campaign=kokio_community_visit";
  const websiteUrl = "https://de.kokioberlin.com/?utm_source=speisely&utm_medium=referral&utm_campaign=kokio_community_visit";

  const handleMenuClick = () => {
    trackEvent("restaurant_menu_click", {
      restaurant_name: "KOKIO Berlin",
      article_slug: "kokio-berlin",
      destination: "lightspeed_menu",
    });
  };

  const handleWebsiteClick = () => {
    trackEvent("restaurant_website_click", {
      restaurant_name: "KOKIO Berlin",
      article_slug: "kokio-berlin",
      destination: "official_website",
    });
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-forest/10 bg-white/60 backdrop-blur-md sticky top-16 z-30">
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
                  KOKIO Berlin
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
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDEEE3] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
            <span>{isDe ? "Aus der Speisely Community" : "From the Speisely Community"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.15] tracking-tight">
            {isDe
              ? "Zwischen Crunch, Sauce und koreanischer Esskultur"
              : "Where Crunch Meets Korean Chicken Culture"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Ein Speisely-Community-Besuch bei KOKIO Berlin: knuspriges Fried Chicken, verschiedene hausgemachte Saucen und ein Essen, das am schönsten gemeinsam schmeckt."
              : "A Speisely Community visit to KOKIO Berlin, filled with glossy sauces, crisp fried chicken and the unmistakable pleasure of ordering for the whole group."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">KOKIO Berlin</strong>
                <span className="block text-forest/70 text-xs">
                  Hagenauer Straße 9, 10435 Berlin-Prenzlauer Berg
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
            {/* Photo 1 (Hero candidate: classic fries & chicken) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/kokio-berlin/kokio-boneless-02.jpg"
                  alt={
                    isDe
                      ? "Knuspriges Fried Chicken mit Sauce und klassischen Pommes bei KOKIO Berlin"
                      : "Crisp fried chicken with glaze and classic fries at KOKIO Berlin"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Knusprig glasiertes Chicken mit klassischen Pommes auf KOKIO-Papier serviert."
                    : "Crisp glazed chicken paired with classic fries, served on KOKIO paper."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Schon beim ersten Blick auf die Platten wird deutlich: Bei KOKIO geht es nicht um ein einzelnes Stück Chicken. Hier kommen verschiedene Portionen zusammen – einige mit klassischen Pommes, andere mit Süßkartoffel-Pommes, alle mit reichlich knusprigem Hähnchen und Sauce."
                : "The photographs tell the story before the first sentence does: this was not one small serving. Several platters reached the group, pairing generous portions of fried chicken with classic fries and sweet potato fries."}
            </p>

            <p>
              {isDe
                ? "Die Auswahl beginnt mit einer Frage, die den ganzen Charakter des Essens bestimmt: Welche Sauce darf es sein?"
                : "Every order begins with the most important decision—the sauce."}
            </p>

            <p>
              {isDe
                ? "Zur Wahl stehen unter anderem Soy Garlic, Soy Wasabi, Spicy Sour, Super Spicy und Sweet Chili. Wer den ursprünglichen Crunch ganz ohne Sauce erleben möchte, kann Crispy Original bestellen. Die Sauce kann das Chicken vollständig umhüllen oder separat zum Dippen serviert werden."
                : "KOKIO’s selection includes Soy Garlic, Soy Wasabi, Spicy Sour, Super Spicy and Sweet Chili. Crispy Original keeps the chicken unsauced for anyone who wants the fried coating to lead. The chosen sauce can coat the chicken completely or arrive separately for dipping."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Wenn die Sauce auf den Crunch trifft" : "Built around contrast"}
            </h2>

            <p>
              {isDe
                ? "Das Chicken zeigt eine unregelmäßige, strukturierte Oberfläche – mit kleinen Rändern und Vertiefungen, in denen sich die glänzende Sauce sammelt. Dadurch wirkt jedes Stück auf der Platte optisch eigenständig."
                : "Sauced Korean fried chicken is an exercise in texture. The glaze settles into every ridge of the coating, creating a visible interplay between the glossy surface and the underlying crust."}
            </p>

            <p>
              {isDe
                ? "Dazwischen wird das Fleisch von der knusprigen Hülle und der Glasur umrahmt. Genau diese Kombination aus unregelmäßiger Panade, glänzender Sauce und warmen Pommes prägt das Bild der servierten Platten."
                : "Beneath the glaze, the chicken is framed by its crisp, textured coating. That visual balance between coating, sauce and warm fries defines the appearance of the platters."}
            </p>

            {/* Photo 2 (Sweet potato fries section) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/kokio-berlin/kokio-boneless-01.jpg"
                  alt={
                    isDe
                      ? "Korean Fried Chicken kombiniert mit Süßkartoffel-Pommes bei KOKIO Berlin"
                      : "Korean fried chicken served with sweet potato fries at KOKIO Berlin"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Farbenfroher Kontrast: Dunkel glasiertes Chicken kombiniert mit knusprigen Süßkartoffel-Pommes."
                    : "Colourful contrast: glazed chicken paired with crisp sweet potato fries."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Die Beilagen setzen optische Akzente: Klassische Pommes bringen die vertraute goldene Beilage auf den Tisch, während Süßkartoffel-Pommes für einen kräftigen orangefarbenen Kontrast sorgen. Laut Karte können alternativ auch Kimchi oder Coleslaw gewählt werden."
                : "Classic fries provide the familiar golden side, while sweet potato fries introduce a warm orange contrast across the table. Kimchi and coleslaw are also listed as alternatives on the menu."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Wie Fried Chicken in Korea eine eigene Identität bekam" : "How Korea transformed fried chicken"}
            </h2>

            <p>
              {isDe
                ? "Frittiertes Hähnchen, wie wir es heute mit Südkorea verbinden, verbreitete sich dort besonders ab den 1960er- und 1970er-Jahren. Mit besserer Verfügbarkeit von Speiseöl entstanden neue Chicken-Restaurants und schließlich die ersten modernen koreanischen Fried-Chicken-Ketten."
                : "Modern fried chicken began spreading widely in South Korea during the decades after the Korean War, particularly as cooking oil became more accessible in the 1970s. Korean restaurants gradually turned an imported frying method into a food culture with its own techniques, flavours and rituals."}
            </p>

            <p>
              {isDe
                ? "In den 1980er-Jahren entwickelte sich daraus ein deutlich eigener Stil. Neben schlicht frittiertem Chicken wurde besonders Yangnyeom Chicken populär: knuspriges Hähnchen, das mit einer süßen, würzigen und häufig leicht scharfen Sauce überzogen wird."
                : "One defining development came in the 1980s with the rise of yangnyeom chicken—fried chicken coated in a sweet, savoury and often spicy glaze. Instead of treating sauce as a dip added at the end, this style made it an essential part of the dish."}
            </p>

            <p>
              {isDe ? (
                <>
                  Entscheidend ist dabei nicht nur die Sauce. Viele koreanische Zubereitungen arbeiten mit einer dünneren Panade und doppeltem Frittieren. Dadurch entsteht eine leichte, besonders knusprige Oberfläche, die auch unter einer großzügigen Glasur noch Struktur behält. KOKIO beschreibt ebenfalls das doppelte Frittieren als Grundlage seines Chicken-Crunchs.{" "}
                  <a
                    href="https://de.kokioberlin.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [KOKIO Berlin]
                  </a>
                </>
              ) : (
                <>
                  Double-frying also became closely associated with Korean fried chicken. The method creates a thinner, lighter crust capable of holding sauce while preserving its crackle. KOKIO identifies double-frying as the secret behind its own crisp coating.{" "}
                  <a
                    href="https://de.kokioberlin.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [KOKIO Berlin]
                  </a>
                </>
              )}
            </p>

            <p>
              {isDe ? (
                <>
                  Aus dem Essen entwickelte sich zugleich eine moderne gesellige Tradition: <strong>Chimaek</strong>. Das Wort verbindet „Chicken“ mit „Maekju“, dem koreanischen Wort für Bier. Gemeint ist jedoch mehr als nur eine Getränkebegleitung. Chimaek steht für gemeinsame Abende, Gespräche und große Chicken-Platten, die in der Mitte stehen und miteinander geteilt werden. Koreanische Filme und Serien machten diese Esskultur später weltweit bekannt.{" "}
                  <a
                    href="https://www.korean-culture.org/eng/webzine/202406/sub07.html"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Korean Cultural Center]
                  </a>
                </>
              ) : (
                <>
                  Then there is <strong>chimaek</strong>, a word combining “chicken” and <em>maekju</em>, the Korean word for beer. It describes one of South Korea’s favourite social pairings, but its meaning reaches beyond the drink: friends gathering, platters being passed around and an evening unfolding around fried chicken. Korean television helped carry this ritual to audiences around the world, turning chimaek into an internationally recognised part of contemporary K-food culture.{" "}
                  <a
                    href="https://www.korean-culture.org/eng/webzine/202406/sub07.html"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Korean Cultural Center]
                  </a>
                </>
              )}
            </p>

            {/* Photo 3 (Shared feast section) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/kokio-berlin/kokio-boneless-03.jpg"
                  alt={
                    isDe
                      ? "Großzügige Portion Fried Chicken zum Teilen bei KOKIO Berlin"
                      : "Generous portion of fried chicken made for sharing at KOKIO Berlin"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Mehrere Platten auf dem Tisch: Ein Essen, das zum gemeinsamen Probieren einlädt."
                    : "Platters on the table: a meal made for passing around and trying different flavours."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Ein Stück moderner koreanischer Esskultur in Berlin" : "A Korean social ritual, served in Berlin"}
            </h2>

            <p>
              {isDe
                ? "Genau dieses gemeinschaftliche Gefühl prägt die Bilder dieses Community-Besuchs. Mehrere Platten, verschiedene Saucen und zwei Arten von Pommes machen aus der Bestellung ein gemeinsames Essen, bei dem am Tisch geteilt wird."
                : "That sense of shared dining is what characterizes this community visit. Multiple platters, different sauces and two types of fries turn the order into a shared meal made for the whole table."}
            </p>

            <p>
              {isDe ? (
                <>
                  KOKIO bringt diese koreanische Fried-Chicken-Kultur nach Prenzlauer Berg. Das Restaurant gibt auf seiner offiziellen Website an, frisch geliefertes, halal-zertifiziertes Hähnchen zu verwenden, seine Saucen selbst zuzubereiten und das Chicken doppelt zu frittieren.{" "}
                  <a
                    href="https://de.kokioberlin.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [KOKIO Berlin]
                  </a>
                </>
              ) : (
                <>
                  KOKIO brings that contemporary Korean chicken culture to Prenzlauer Berg. According to information published on KOKIO's official website, the restaurant uses freshly supplied, halal-certified chicken, prepares its sauces in-house, and double-fries its chicken.{" "}
                  <a
                    href="https://de.kokioberlin.com/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [KOKIO Berlin]
                  </a>
                </>
              )}
            </p>

            <p className="font-medium text-forest text-lg">
              {isDe
                ? "Glänzende Saucen, strukturierte Kruste und Pommes zum Teilen – ein Food-Moment aus der Speisely Community in Berlin-Prenzlauer Berg."
                : "Glossy sauces, crisp coating and fries for the table—a food moment shared by the Speisely Community in Berlin-Prenzlauer Berg."}
            </p>

            {/* Restaurant Info & Action Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/15 bg-white my-10 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b28a3c] mb-2">
                <Utensils className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Restaurant-Informationen" : "Restaurant Details"}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-forest mb-2">
                KOKIO Berlin
              </h3>
              <p className="text-sm text-forest/75 mb-4">
                Hagenauer Straße 9, 10435 Berlin-Prenzlauer Berg
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs text-forest/70 mb-6">
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Korean Fried Chicken" : "Korean Fried Chicken"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Halal Chicken" : "Halal Chicken"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Hausgemachte Saucen" : "House-made Sauces"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Chimaek-Kultur" : "Chimaek Culture"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleMenuClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-forest/90 transition-all hover:gap-2.5 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                  <span>{isDe ? "Speisekarte ansehen" : "Explore the menu"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </a>

                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleWebsiteClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-6 py-3 text-xs sm:text-sm font-semibold border border-forest/15 hover:bg-[#eadfce] transition-colors cursor-pointer"
                >
                  <span>{isDe ? "Website besuchen" : "Visit KOKIO"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Editorial Disclosure Box */}
            <div className="rounded-2xl bg-cream p-5 text-xs text-forest/75 border border-forest/15 space-y-2 mt-8">
              <div className="flex items-center gap-2 font-bold text-forest text-xs">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p className="leading-relaxed">
                {isDe
                  ? "Dieser redaktionelle Beitrag basiert auf einem Besuch und Fotos aus der Speisely Community. Speisely war nicht selbst vor Ort. Der Beitrag gibt die visuellen Eindrücke der geteilten Fotos wieder und stellt keine Sternebewertung oder offizielle Restaurantbewertung dar. Fotocredit: Speisely Community."
                  : "This editorial story is based on a visit and photographs shared by a member of the Speisely Community. Speisely was not present at the restaurant. It reflects the visual impressions of the shared photographs and does not constitute a star rating or official restaurant review. Photo credit: Speisely Community."}
              </p>
            </div>
          </div>
        </article>

        {/* CTA Banner: Share Your Own Food Story */}
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
                    ? "Teile deine Restaurantbesuche, Catering-Erlebnisse oder Food-Entdeckungen mit der Speisely Community. Schick uns deine Geschichte und Fotos."
                    : "Share your restaurant visits, catering experiences or food discoveries with the Speisely Community. Send us your story and photos."}
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
