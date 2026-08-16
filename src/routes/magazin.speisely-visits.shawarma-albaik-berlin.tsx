import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Calendar, Eye, Shield, Globe } from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/speisely-visits/shawarma-albaik-berlin")({
  head: () => ({
    meta: [
      {
        title: "Shawarma Albaik Berlin: Unser Besuch auf der Sonnenallee | Speisely",
      },
      {
        name: "description",
        content:
          "Unser Besuch bei Shawarma Albaik in Berlin-Neukölln: Chicken Shawarma, gelber Reis, Fladenbrot und ein gemeinsamer Abend auf der Sonnenallee.",
      },
      {
        name: "keywords",
        content:
          "Shawarma Albaik Berlin, Shawarma Sonnenallee, Shawarma Berlin Neukölln, Chicken Shawarma Berlin, nahöstliches Essen Neukölln, Restaurantbesuch Sonnenallee, Speisely Visits",
      },
      {
        property: "og:title",
        content: "Shawarma Albaik Berlin: Unser Besuch auf der Sonnenallee | Speisely",
      },
      {
        property: "og:description",
        content:
          "Unser Besuch bei Shawarma Albaik in Berlin-Neukölln: Chicken Shawarma, gelber Reis, Fladenbrot und ein gemeinsamer Abend auf der Sonnenallee.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/albaik/albaik-shawarma-rice-hero.jpg",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://speisely.de/#organization",
              name: "Speisely",
              url: "https://speisely.de",
              logo: {
                "@type": "ImageObject",
                url: "https://speisely.de/speisely_logo.png",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://speisely.de/#website",
              url: "https://speisely.de",
              name: "Speisely",
              publisher: {
                "@id": "https://speisely.de/#organization",
              },
              inLanguage: "de",
            },
            {
              "@type": "CollectionPage",
              "@id": "https://speisely.de/magazin/speisely-visits#page",
              name: "Speisely Visits",
              url: "https://speisely.de/magazin/speisely-visits",
            },
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin",
              },
              headline: "Ein Abend bei Shawarma Albaik auf der Sonnenallee",
              description:
                "Speisely besucht Shawarma Albaik in Berlin-Neukölln: Chicken Shawarma, gelber Reis, Fladenbrot und ein gemeinsamer Abend mit Freunden auf der Sonnenallee.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/albaik/albaik-shawarma-rice-hero.jpg",
                width: 831,
                height: 1039,
              },
              datePublished: "2026-08-16",
              dateModified: "2026-08-16",
              author: {
                "@type": "Organization",
                "@id": "https://speisely.de/#organization",
                name: "Speisely Redaktion",
                url: "https://speisely.de/magazin",
              },
              publisher: {
                "@id": "https://speisely.de/#organization",
              },
              inLanguage: "de",
              articleSection: "Speisely Visits",
              keywords:
                "Shawarma Albaik Berlin, Shawarma Sonnenallee, Chicken Shawarma Berlin-Neukölln, nahöstliches Essen Berlin",
              isPartOf: {
                "@id": "https://speisely.de/magazin/speisely-visits#page",
              },
              contentLocation: {
                "@type": "Place",
                name: "Shawarma Albaik",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Sonnenallee 28",
                  postalCode: "12047",
                  addressLocality: "Berlin",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
              },
              about: {
                "@type": "Place",
                name: "Shawarma Albaik, Sonnenallee 28, 12047 Berlin-Neukölln",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Sonnenallee 28",
                  postalCode: "12047",
                  addressLocality: "Berlin",
                  addressCountry: "DE",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id":
                "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin#breadcrumb",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Speisely",
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
                  name: "Speisely Visits",
                  item: "https://speisely.de/magazin/speisely-visits",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Shawarma Albaik Berlin",
                  item: "https://speisely.de/magazin/speisely-visits/shawarma-albaik-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AlbaikVisitPage,
});

function AlbaikVisitPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const elements = document.querySelectorAll(".story-reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const tischItems = isDe
    ? [
        "Chicken Shawarma",
        "Gelber Reis",
        "Pommes",
        "Fladenbrot",
        "Hummus",
        "Krautsalat",
        "Eingelegte Gurken",
        "Knoblauchsauce",
        "Cocktailsauce",
      ]
    : [
        "Chicken Shawarma",
        "Yellow Rice",
        "French Fries",
        "Flatbread",
        "Hummus",
        "Coleslaw",
        "Pickled Cucumbers",
        "Garlic Sauce",
        "Cocktail Sauce",
      ];

  return (
    <div
      ref={articleRef}
      className="min-h-screen bg-[#FBF7EE] text-[#173C32] font-sans antialiased selection:bg-[#E6B84A] selection:text-[#173C32]"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#173C32]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-auto rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src="/speisely_logo.png"
              alt="Speisely"
              className="h-full w-auto object-contain"
              width="40"
              height="40"
            />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/magazin/speisely-visits"
            className="hidden sm:inline-block text-xs font-semibold text-[#DDEEE3] hover:text-[#E6B84A] uppercase tracking-wider transition-colors"
          >
            {isDe ? "← Speisely Visits" : "← Speisely Visits"}
          </Link>
          <Link
            to="/magazin"
            className="hidden md:inline-block text-xs font-semibold text-[#DDEEE3]/70 hover:text-[#E6B84A] uppercase tracking-wider transition-colors"
          >
            {isDe ? "Magazin" : "Magazine"}
          </Link>
          <LanguageToggle variant="light" />
          <Link
            to="/restaurants"
            className="px-4 py-2 bg-[#E6B84A] hover:bg-white text-[#173C32] rounded-full text-xs font-extrabold tracking-tight transition-all shadow-md"
          >
            {isDe ? "Speisely öffnen" : "Open Speisely"}
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-4 sm:px-8 lg:px-20 pt-5 pb-2 max-w-7xl mx-auto">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#173C32]/50 font-medium">
          <li>
            <Link to="/" className="hover:text-[#173C32] transition-colors">
              Speisely
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link to="/magazin" className="hover:text-[#173C32] transition-colors">
              {isDe ? "Magazin" : "Magazine"}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link to="/magazin/speisely-visits" className="hover:text-[#173C32] transition-colors">
              Speisely Visits
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-[#173C32] font-semibold truncate max-w-[200px]">
            Shawarma Albaik Berlin
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] w-full flex items-end justify-start bg-[#0c1813] text-[#FBF7EE] overflow-hidden px-6 sm:px-12 lg:px-20 pb-16 lg:pb-24 pt-10"
        aria-label="Artikel-Hero"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/magazin/albaik/albaik-shawarma-rice-hero.jpg"
            alt={
              isDe
                ? "Chicken Shawarma und gelber Reis im Tablett bei Shawarma Albaik, Sonnenallee 28, Berlin-Neukölln"
                : "Chicken Shawarma and yellow rice platter at Shawarma Albaik, Sonnenallee 28, Berlin-Neukölln"
            }
            className="w-full h-full object-cover object-center opacity-55 filter contrast-105"
            width="831"
            height="1039"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1813] via-[#0c1813]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1813]/80 via-[#0c1813]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-5 story-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 bg-[#7FA46B] text-white rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3 h-3" aria-hidden="true" />
              Speisely Visits
            </span>
            <span className="text-xs font-semibold text-[#DDEEE3]/80 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#E6B84A]" aria-hidden="true" />
              {isDe ? "16. August 2026" : "August 16, 2026"}
            </span>
            <span className="text-xs font-semibold text-[#DDEEE3]/80 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E6B84A]" aria-hidden="true" />
              Sonnenallee, Berlin-Neukölln
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-base sm:text-lg font-bold text-[#E6B84A] uppercase tracking-wider">
              {isDe
                ? "Shawarma · Nahöstliche Küche · Berlin"
                : "Shawarma · Middle Eastern Cuisine · Berlin"}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-[#FBF7EE] leading-[0.95] tracking-tight">
              {isDe
                ? "Ein Abend bei Shawarma Albaik auf der Sonnenallee"
                : "An Evening at Shawarma Albaik on Sonnenallee"}
            </h1>
            <p className="font-serif text-lg sm:text-2xl text-[#DDEEE3] font-medium italic leading-snug max-w-2xl">
              {isDe
                ? "Chicken Shawarma, gelber Reis und ein gemeinsamer Abend mit Freunden auf einer der lebendigsten Straßen Berlins."
                : "Chicken shawarma, yellow rice, and an evening shared with friends on one of Berlin's liveliest streets."}
            </p>
          </div>

          <div className="pt-2 text-xs font-semibold text-[#DDEEE3]/60 uppercase tracking-widest animate-pulse">
            {isDe ? "Weiterlesen ↓" : "Read more ↓"}
          </div>
        </div>
      </section>

      {/* Transparency Notice — Prominent */}
      <div className="bg-[#DDEEE3] border-b border-[#7FA46B]/30 px-4 sm:px-8 lg:px-20 py-4">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#173C32] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-[#173C32] leading-relaxed font-medium">
            <strong>{isDe ? "Transparenzhinweis:" : "Transparency Notice:"}</strong>{" "}
            {isDe
              ? "Speisely hat dieses Restaurant unabhängig besucht und das Essen selbst bezahlt. Zum Zeitpunkt des Besuchs bestand keine bezahlte Kooperation."
              : "Speisely visited this restaurant independently and paid for all food directly. At the time of this visit, no paid partnership or sponsored relationship existed."}
          </p>
        </div>
      </div>

      {/* Article Body */}
      <article
        className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-0 py-16 sm:py-24 space-y-16"
        lang={isDe ? "de" : "en"}
      >
        {/* AEO: Auf einen Blick / At a Glance */}
        <section
          aria-labelledby="auf-einen-blick"
          className="p-7 sm:p-8 rounded-3xl bg-white border border-[#173C32]/10 shadow-sm story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <h2
            id="auf-einen-blick"
            className="font-serif text-xl font-bold text-[#173C32] mb-5 flex items-center gap-2"
          >
            {isDe ? "Shawarma Albaik auf einen Blick" : "Shawarma Albaik at a Glance"}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Restaurant" : "Restaurant"}
              </dt>
              <dd className="font-semibold text-[#173C32]">Shawarma Albaik</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Adresse" : "Address"}
              </dt>
              <dd className="font-semibold text-[#173C32]">
                Sonnenallee 28, 12047 Berlin-Neukölln
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Küche" : "Cuisine"}
              </dt>
              <dd className="font-semibold text-[#173C32]">
                {isDe ? "Shawarma und nahöstliche Gerichte" : "Shawarma & Middle Eastern Dishes"}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Besuchsdatum" : "Visit Date"}
              </dt>
              <dd className="font-semibold text-[#173C32]">
                {isDe ? "16. August 2026" : "August 16, 2026"}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Besuchsart" : "Visit Type"}
              </dt>
              <dd className="font-semibold text-[#173C32]">
                {isDe ? "Unabhängig besucht · Selbst bezahlt" : "Independently visited · Self-paid"}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-bold text-[#173C32]/50 uppercase tracking-wider">
                {isDe ? "Auf unserem Tisch" : "On Our Table"}
              </dt>
              <dd className="font-semibold text-[#173C32]">
                {isDe
                  ? "Chicken Shawarma, Reis, Pommes, Fladenbrot, Hummus, Salat, Gurken, Saucen"
                  : "Chicken Shawarma, Rice, Fries, Flatbread, Hummus, Salad, Pickles, Sauces"}
              </dd>
            </div>
          </dl>
        </section>

        {/* Wo befindet sich Shawarma Albaik? */}
        <section
          aria-labelledby="wo-section"
          className="space-y-5 story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <h2 id="wo-section" className="font-serif text-2xl sm:text-3xl font-black text-[#173C32]">
            {isDe ? "Wo befindet sich Shawarma Albaik?" : "Where is Shawarma Albaik located?"}
          </h2>
          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Shawarma Albaik liegt in <strong>Berlin-Neukölln auf der Sonnenallee 28</strong> –
                einer Straße, die für ihre Dichte an nahöstlichen und arabischen
                Lebensmittelgeschäften, Restaurants und Cafés bekannt ist. Die Sonnenallee ist eine
                der lebhaftesten Adressen im Berliner Straßenfoodbereich und ein fester Anlaufpunkt
                für Shawarma und verwandte Gerichte in der Hauptstadt.
              </>
            ) : (
              <>
                Shawarma Albaik is located at <strong>Sonnenallee 28 in Berlin-Neukölln</strong> — a
                street renowned for its vibrant array of Middle Eastern eateries, bakeries, and
                spice markets. Sonnenallee stands as one of Berlin's most lively street food
                destinations and an established hub for authentic shawarma and Levantine culinary
                experiences.
              </>
            )}
          </p>
        </section>

        {/* Unser Besuch */}
        <section
          aria-labelledby="besuch-section"
          className="space-y-6 story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <h2
            id="besuch-section"
            className="font-serif text-2xl sm:text-3xl font-black text-[#173C32]"
          >
            {isDe ? "Unser Besuch – Was auf dem Tisch stand" : "Our Visit – What Was on the Table"}
          </h2>

          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Heute waren wir mit Freunden bei Shawarma Albaik in Berlin-Neukölln. Auf unserem
                Tisch standen reichlich <strong>Chicken Shawarma</strong>, duftender{" "}
                <strong>gelber Reis</strong>, warmes <strong>Fladenbrot</strong>,{" "}
                <strong>Pommes</strong>, <strong>Krautsalat</strong>, <strong>Hummus</strong>,
                eingelegte Gurken sowie Knoblauch- und Cocktailsauce.
              </>
            ) : (
              <>
                We visited Shawarma Albaik in Berlin-Neukölln with a group of friends. Our table was
                filled with generous portions of <strong>Chicken Shawarma</strong>, aromatic{" "}
                <strong>yellow rice</strong>, warm <strong>flatbread</strong>,{" "}
                <strong>crispy fries</strong>, <strong>coleslaw</strong>,{" "}
                <strong>creamy hummus</strong>, pickled cucumbers, and house garlic and cocktail
                dipping sauces.
              </>
            )}
          </p>

          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Genau so macht Essen mit Freunden Spaß: verschiedene Schalen und Teller in die Mitte
                stellen, Brot teilen, Saucen weiterreichen und von allem etwas probieren. Das
                Chicken Shawarma wurde großzügig serviert. Zusammen mit dem Reis, den säuerlichen
                Gurken und der cremigen Knoblauchsauce entstand eine herzhafte und sättigende
                Kombination.
              </>
            ) : (
              <>
                This is the way dining with friends is most enjoyable: setting platters in the
                center of the table, breaking warm bread together, passing dipping bowls around, and
                sampling everything. The chicken shawarma was served in generous portions. Combined
                with fragrant rice, tangy pickles, and rich garlic sauce, it delivered a satisfying,
                savory shared meal.
              </>
            )}
          </p>

          {/* Gallery Image 2 */}
          <figure className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src="/magazin/albaik/albaik-shared-platter.jpg"
              alt={
                isDe
                  ? "Warmes Fladenbrot im Vordergrund, dahinter Albaik-Schalen mit Chicken Shawarma und gelbem Reis sowie eingelegte Gurken auf dem Tisch bei Shawarma Albaik Berlin"
                  : "Warm flatbread in foreground, with bowls of chicken shawarma, yellow rice, and pickles at Shawarma Albaik Berlin"
              }
              className="w-full h-auto object-cover"
              width="831"
              height="1039"
              loading="lazy"
            />
            <figcaption className="px-5 py-3 text-xs text-[#173C32]/55 bg-white border-t border-[#173C32]/10">
              {isDe
                ? "Warmes Fladenbrot und Albaik-Schalen — der gemeinsame Tisch auf der Sonnenallee."
                : "Warm flatbread and Albaik bowls — the shared table experience on Sonnenallee."}
            </figcaption>
          </figure>

          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Es war ein entspannter Abend mit Freunden, einem vollen Tisch und gutem Essen auf
                der Sonnenallee. Genau solche authentischen gastronomischen Entdeckungen möchten wir
                in der Reihe „Speisely Visits" vorstellen.
              </>
            ) : (
              <>
                It was a relaxed evening with friends, a full table, and good food on Sonnenallee.
                Authentic local discoveries like this are precisely what we spotlight in our
                editorial series “Speisely Visits.”
              </>
            )}
          </p>
        </section>

        {/* Wie war unser Eindruck? */}
        <section
          aria-labelledby="eindruck-section"
          className="space-y-5 story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <h2
            id="eindruck-section"
            className="font-serif text-2xl sm:text-3xl font-black text-[#173C32]"
          >
            {isDe ? "Wie war unser persönlicher Eindruck?" : "What was our personal impression?"}
          </h2>
          <div className="p-7 rounded-3xl bg-[#173C32]/5 border-l-4 border-[#7FA46B]">
            <blockquote className="font-serif text-xl sm:text-2xl text-[#173C32] font-semibold italic leading-snug">
              {isDe
                ? "„Chicken Shawarma, Reis und warmes Brot – in die Mitte stellen, teilen, genießen.“"
                : "“Chicken shawarma, rice and warm flatbread — set in the middle, share, and enjoy.”"}
            </blockquote>
            <p className="text-xs font-bold text-[#7FA46B] uppercase tracking-widest mt-4">
              {isDe
                ? "— Speisely Redaktion, Besuch 16. August 2026"
                : "— Speisely Editorial Team, Visit August 16, 2026"}
            </p>
          </div>
          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Shawarma Albaik auf der Sonnenallee steht für großzügige Portionen und ein typisches
                nahöstliches Tafelerlebnis: verschiedene Schüsseln und Beilagen in der Mitte des
                Tisches, alles zum Teilen. Die Kombination aus dem herzhaften Chicken Shawarma, dem
                aromatischen gelben Reis, dem frischen Fladenbrot und den begleitenden Saucen hat
                uns an diesem Abend gut gesättigt.
              </>
            ) : (
              <>
                Shawarma Albaik on Sonnenallee delivers generous portions and an authentic Middle
                Eastern communal dining format: a variety of bowls and sides placed in the center
                for everyone to share. The pairing of hearty chicken shawarma, fragrant yellow rice,
                warm flatbread, and rich sauces made for a satisfying and comforting meal.
              </>
            )}
          </p>
        </section>

        {/* Gallery Image 3 */}
        <figure className="rounded-3xl overflow-hidden shadow-lg story-reveal opacity-0 translate-y-6 transition-all duration-700">
          <img
            src="/magazin/albaik/albaik-beilagen-platte.jpg"
            alt={
              isDe
                ? "Teller mit Beilagen bei Shawarma Albaik Berlin: Knoblauchsauce, Cocktailsauce, Krautsalat, Pommes und gebackenes Fladenbrot"
                : "Side platter at Shawarma Albaik Berlin: garlic sauce, cocktail sauce, coleslaw, fries, and warm flatbread"
            }
            className="w-full h-auto object-cover"
            width="831"
            height="1039"
            loading="lazy"
          />
          <figcaption className="px-5 py-3 text-xs text-[#173C32]/55 bg-white border-t border-[#173C32]/10">
            {isDe
              ? "Beilagen und Saucen — ein vollständiges Tischerlebnis bei Shawarma Albaik auf der Sonnenallee."
              : "Sides and dips — a complete table spread at Shawarma Albaik on Sonnenallee."}
          </figcaption>
        </figure>

        {/* Für wen geeignet? */}
        <section
          aria-labelledby="fuer-wen-section"
          className="space-y-5 story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <h2
            id="fuer-wen-section"
            className="font-serif text-2xl sm:text-3xl font-black text-[#173C32]"
          >
            {isDe
              ? "Für wen könnte der Besuch interessant sein?"
              : "Who is this visit suitable for?"}
          </h2>
          <p className="text-lg text-[#173C32]/85 leading-relaxed">
            {isDe ? (
              <>
                Shawarma Albaik auf der Sonnenallee eignet sich gut für einen Abend mit Freunden,
                bei dem alle satt werden und gemeinsam von verschiedenen Gerichten kosten möchten.
                Wer Shawarma in Berlin-Neukölln sucht oder die Sonnenallee als gastronomische
                Adresse entdecken möchte, findet hier eine Anlaufstelle mit einem nahöstlich
                geprägten Angebot.
              </>
            ) : (
              <>
                Shawarma Albaik on Sonnenallee is well-suited for group dining with friends who want
                generous portions and shared dishes. Anyone exploring Berlin-Neukölln or looking for
                genuine shawarma in the German capital will find a welcoming spot with a rich Middle
                Eastern flavor profile.
              </>
            )}
          </p>
        </section>

        {/* Auf unserem Tisch */}
        <section
          aria-labelledby="tisch-section"
          className="story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#173C32]/10 shadow-sm space-y-5">
            <h2 id="tisch-section" className="font-serif text-xl font-bold text-[#173C32]">
              {isDe ? "Auf unserem Tisch" : "On Our Table"}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#173C32]/80">
              {tischItems.map((item) => (
                <li key={item} className="flex items-center gap-2 font-medium">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#7FA46B] shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Restaurant Info Card */}
        <section
          aria-labelledby="restaurant-info"
          className="story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <div className="p-7 sm:p-8 rounded-3xl bg-[#173C32] text-[#FBF7EE] shadow-xl space-y-5">
            <h2 id="restaurant-info" className="font-serif text-xl font-bold text-[#FBF7EE]">
              {isDe ? "Restaurantinformationen" : "Restaurant Information"}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-bold text-[#DDEEE3]/60 uppercase tracking-wider">
                  {isDe ? "Name" : "Name"}
                </dt>
                <dd className="font-semibold text-[#FBF7EE]">Shawarma Albaik</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-bold text-[#DDEEE3]/60 uppercase tracking-wider">
                  {isDe ? "Adresse" : "Address"}
                </dt>
                <dd className="font-semibold text-[#FBF7EE]">
                  Sonnenallee 28
                  <br />
                  12047 Berlin-Neukölln
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-bold text-[#DDEEE3]/60 uppercase tracking-wider">
                  {isDe ? "Küche" : "Cuisine"}
                </dt>
                <dd className="font-semibold text-[#FBF7EE]">
                  {isDe ? "Shawarma · Nahöstliche Küche" : "Shawarma · Middle Eastern Cuisine"}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-bold text-[#DDEEE3]/60 uppercase tracking-wider">
                  {isDe ? "Besuchsart" : "Visit Type"}
                </dt>
                <dd className="font-semibold text-[#FBF7EE]">
                  {isDe ? "Unabhängiger Besuch · Selbst bezahlt" : "Independent Visit · Self-Paid"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Ist dieser Beitrag gesponsert? */}
        <section
          aria-labelledby="transparenz-section"
          className="story-reveal opacity-0 translate-y-6 transition-all duration-700"
        >
          <div className="p-7 rounded-3xl bg-[#DDEEE3] border border-[#7FA46B]/30 space-y-3">
            <h2
              id="transparenz-section"
              className="text-sm font-extrabold text-[#173C32] uppercase tracking-widest flex items-center gap-2"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              {isDe ? "Ist dieser Beitrag gesponsert?" : "Is this article sponsored?"}
            </h2>
            <p className="text-sm text-[#173C32] leading-relaxed">
              {isDe ? (
                <>
                  Nein. <strong>Transparenzhinweis:</strong> Speisely hat dieses Restaurant
                  unabhängig besucht und das Essen selbst bezahlt. Zum Zeitpunkt des Besuchs bestand
                  keine bezahlte Kooperation. Shawarma Albaik ist kein Speisely-Partner und kein
                  Mitglied auf dem Speisely-Marktplatz.
                </>
              ) : (
                <>
                  No. <strong>Transparency Notice:</strong> Speisely visited this restaurant
                  independently and paid for all meals directly. At the time of this visit, no paid
                  sponsorship or commercial relationship existed. Shawarma Albaik is not a Speisely
                  partner or marketplace member.
                </>
              )}
            </p>
            <p className="text-xs text-[#173C32]/70 leading-relaxed">
              {isDe
                ? "Speisely Visits ist eine redaktionelle Reihe für genuine Restaurantentdeckungen, die unabhängig vom Partnernetzwerk stattfinden."
                : "Speisely Visits is an editorial series dedicated to authentic food discoveries created independently of our commercial partner network."}
            </p>
          </div>
        </section>
      </article>

      {/* CTA & Navigation Footer */}
      <section className="bg-[#173C32] text-[#FBF7EE] py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <span className="text-xs font-bold text-[#E6B84A] uppercase tracking-widest">
              {isDe ? "Weitere Food Stories" : "More Food Stories"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#FBF7EE] leading-tight">
              {isDe ? "Weitere Food Stories entdecken" : "Discover More Food Stories"}
            </h2>
            <p className="text-base text-[#DDEEE3]/80 leading-relaxed max-w-xl">
              {isDe
                ? "Speisely Visits erscheint unregelmäßig, wenn wir einen Ort entdecken, über den wir schreiben möchten. Folgt uns auf Instagram, um keine neue Story zu verpassen."
                : "Speisely Visits publishes periodically whenever we encounter a local place worth sharing. Follow us on Instagram to stay updated on future editorial visits."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <Link
              to="/magazin/speisely-visits"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#7FA46B] hover:bg-white text-white hover:text-[#173C32] font-bold text-sm uppercase tracking-wider rounded-2xl transition-all"
            >
              <span>{isDe ? "Alle Speisely Visits" : "All Speisely Visits"}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/magazin"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white text-[#FBF7EE] hover:text-[#173C32] border border-white/20 font-bold text-sm uppercase tracking-wider rounded-2xl transition-all"
            >
              <span>{isDe ? "Magazin-Übersicht" : "Magazine Overview"}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="border-t border-white/10 pt-8 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs text-[#FBF7EE]/40 leading-relaxed">
              {isDe
                ? "© 2026 Speisely · Redaktionell unabhängiger Besuch · Speisely Visits ist kein Bewertungsportal und keine Empfehlungsplattform. Alle Inhalte basieren auf dem eigenen Besuchserlebnis der Speisely Redaktion."
                : "© 2026 Speisely · Editorially independent visit · Speisely Visits is not a review platform or paid recommendation engine. All content is based on the genuine experience of the Speisely editorial team."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
