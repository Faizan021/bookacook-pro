import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Calendar, Eye, Shield, Globe, Utensils, Info } from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln")({
  head: () => ({
    meta: [
      {
        title: "Mandy Restaurant Berlin: Jemenitisches Essen in Neukölln | Speisely",
      },
      {
        name: "description",
        content:
          "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Getränke und Chai – und zahlen zusammen rund 45 Euro.",
      },
      {
        name: "keywords",
        content:
          "Mandy Restaurant Berlin, Mandy Happy Jemen Restaurant, Mandi Berlin, Jemenitisches Restaurant Berlin, Mandy Lamm Neukölln, Wildenbruchstraße Essen, Speisely Visits",
      },
      {
        name: "geo.region",
        content: "DE-BE",
      },
      {
        name: "geo.placename",
        content: "Berlin-Neukölln",
      },
      {
        name: "geo.position",
        content: "52.4842;13.4441",
      },
      {
        name: "ICBM",
        content: "52.4842, 13.4441",
      },
      {
        property: "og:title",
        content: "Mandy Restaurant Berlin: Jemenitisches Essen in Neukölln | Speisely",
      },
      {
        property: "og:description",
        content:
          "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Getränke und Chai – und zahlen zusammen rund 45 Euro.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.jpg",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
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
        href: "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
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
              inLanguage: "de-DE",
              contentLocation: {
                "@type": "Restaurant",
                name: "Mandy – Happy Jemen Restaurant",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Wildenbruchstraße 4",
                  addressLocality: "Berlin",
                  postalCode: "12045",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.4842,
                  longitude: 13.4441,
                },
              },
            },
            {
              "@type": "CollectionPage",
              "@id": "https://speisely.de/magazin/speisely-visits#page",
              name: "Speisely Visits",
              url: "https://speisely.de/magazin/speisely-visits",
            },
            {
              "@type": "Article",
              "@id":
                "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                  "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
              },
              headline: "Warum wir bei Mandy natürlich Mandy bestellen mussten",
              description:
                "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Getränke und Chai – und zahlen zusammen rund 45 Euro.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.jpg",
                width: 779,
                height: 716,
              },
              datePublished: "2026-08-17",
              dateModified: "2026-08-17",
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
                "Mandy Restaurant Berlin, Mandi Berlin, Jemenitisches Essen Neukölln, Wildenbruchstraße, Speisely Visits",
              isPartOf: {
                "@id": "https://speisely.de/magazin/speisely-visits#page",
              },
              contentLocation: {
                "@type": "Place",
                name: "Mandy – Happy Jemen Restaurant",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Wildenbruchstraße 4",
                  postalCode: "12045",
                  addressLocality: "Berlin",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
              },
              about: {
                "@type": "Place",
                name: "Mandy – Happy Jemen Restaurant, Wildenbruchstraße 4, 12045 Berlin-Neukölln",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Wildenbruchstraße 4",
                  postalCode: "12045",
                  addressLocality: "Berlin",
                  addressCountry: "DE",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id":
                "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln#breadcrumb",
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
                  name: "Mandy – Happy Jemen Restaurant",
                  item: "https://speisely.de/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: MandyArticlePage,
});

function MandyArticlePage() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { lang } = useI18n();
  const isDe = lang === "de";

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#173C32] selection:bg-[#7FA46B]/20">
      {/* Reading Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-1 bg-[#7FA46B] z-50 transition-all duration-75"
        style={{ width: "0%" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#173C32]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/magazin/speisely-visits"
            className="flex items-center gap-2 group text-white/90 hover:text-[#E6B84A] transition-colors"
          >
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7FA46B] text-white text-xs font-black uppercase tracking-wider">
              <Eye className="w-3 h-3" aria-hidden="true" />
              Speisely Visits
            </span>
            <span className="hidden sm:inline text-xs text-white/60 group-hover:text-white/80 transition-colors">
              · Berlin-Neukölln
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/magazin"
              className="hidden md:inline-block text-xs font-semibold text-[#DDEEE3] hover:text-[#E6B84A] uppercase tracking-wider transition-colors"
            >
              ← {isDe ? "Magazin Übersicht" : "Magazine Overview"}
            </Link>

            <LanguageToggle variant="light" />

            <Link
              to="/restaurants"
              className="px-4 py-2 bg-[#E6B84A] hover:bg-white text-[#173C32] rounded-full text-xs font-extrabold tracking-tight transition-all shadow-md"
            >
              {isDe ? "Speisely öffnen" : "Open Speisely"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[#173C32]/60 font-medium">
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
              <Link
                to="/magazin/speisely-visits"
                className="hover:text-[#173C32] transition-colors"
              >
                Speisely Visits
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-[#173C32] font-semibold">
              Mandy Restaurant
            </li>
          </ol>
        </nav>

        {/* Editorial Transparency Notice Bar */}
        <aside
          aria-label={isDe ? "Redaktioneller Transparenzhinweis" : "Editorial Transparency Notice"}
          className="mb-8 p-4 rounded-2xl bg-[#DDEEE3]/50 border border-[#7FA46B]/30 flex items-start sm:items-center gap-3 text-xs text-[#173C32]/90"
        >
          <Shield className="w-4 h-4 text-[#7FA46B] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p>
            <strong>{isDe ? "Speisely Visits:" : "Speisely Visits:"}</strong>{" "}
            {isDe
              ? "Unabhängig besucht und vollständig selbst bezahlt. Keine bezahlte Kooperation mit dem Betrieb."
              : "Independently visited and fully self-paid. No paid commercial collaboration with the restaurant."}
          </p>
        </aside>

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#7FA46B] text-white px-3 py-1 text-xs font-bold shadow-sm">
              <Eye className="w-3 h-3" aria-hidden="true" />
              Speisely Visits
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#173C32]/10 text-[#173C32] px-3 py-1 text-xs font-semibold">
              <MapPin className="w-3 h-3 text-[#173C32]" aria-hidden="true" />
              Berlin-Neukölln · Wildenbruchstraße 4
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A]/20 text-[#173C32] px-3 py-1 text-xs font-semibold">
              <Calendar className="w-3 h-3 text-[#b8860b]" aria-hidden="true" />
              {isDe ? "17. August 2026" : "August 17, 2026"}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#173C32] leading-tight tracking-tight">
            {isDe
              ? "Warum wir bei Mandy natürlich Mandy bestellen mussten"
              : "Why at Mandy We Naturally Had to Order Mandy"}
          </h1>

          <p className="text-lg sm:text-xl text-[#173C32]/75 font-serif italic leading-relaxed">
            {isDe
              ? "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Getränke und Chai – und zahlen zusammen rund 45 Euro."
              : "Speisely visits Mandy in Berlin-Neukölln. We order Mandy Lamb for two, drinks, and chai — paying around 45 Euros total."}
          </p>
        </header>

        {/* Hero Image */}
        <figure className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-[#173C32]/10 bg-[#0c1813]">
          <img
            src="/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.jpg"
            alt={
              isDe
                ? "Mandy Lamm für zwei mit Reis, Cashews, Kräutern und roter Sauce in Berlin-Neukölln"
                : "Mandy Lamb for two with rice, cashews, herbs and red spicy sauce in Berlin-Neukölln"
            }
            className="w-full h-auto object-cover max-h-[620px]"
            width="779"
            height="716"
            fetchPriority="high"
          />
          <figcaption className="p-4 bg-white/95 border-t border-[#173C32]/10 text-xs text-[#173C32]/70 italic flex items-center justify-between">
            <span>
              {isDe
                ? "Unsere Wahl bei Mandy: Lamm für zwei auf einer großen gemeinsamen Reisplatte."
                : "Our choice at Mandy: Lamb for two on a large shared rice platter."}
            </span>
            <span className="text-[10px] font-mono not-italic text-[#173C32]/40 uppercase tracking-wider">
              {isDe ? "Foto: Speisely Redaktion" : "Photo: Speisely Editorial"}
            </span>
          </figcaption>
        </figure>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-[#173C32]/85 leading-relaxed space-y-6 text-base sm:text-lg">
          {/* Section: Opening Hook */}
          <section aria-labelledby="opening-hook" className="space-y-4">
            <h2 id="opening-hook" className="sr-only">
              {isDe ? "Einleitung" : "Introduction"}
            </h2>
            <p className="font-serif text-xl sm:text-2xl text-[#173C32] font-semibold leading-snug">
              {isDe
                ? "Manchmal ist die Bestellung schon entschieden, bevor man die Karte richtig gelesen hat."
                : "Sometimes the order is already decided before you even read the menu properly."}
            </p>
            <p>
              {isDe
                ? "Wir sitzen bei Mandy – Happy Jemen Restaurant in der Wildenbruchstraße. Vor uns: eine erstaunlich lange Auswahl an Reisgerichten. Mandy, Haneeth, Biryani, Zirbean, Ouzi. Mit Lamm, mit Hähnchen, als einzelne Portion oder für zwei. Je länger wir schauen, desto schwieriger wird es."
                : "We are seated at Mandy – Happy Jemen Restaurant on Wildenbruchstraße. Before us: a surprisingly extensive selection of rice dishes. Mandy, Haneeth, Biryani, Zirbean, Ouzi. With lamb, with chicken, as a single portion or for two. The longer we browse, the harder it gets."}
            </p>
            <p>
              {isDe
                ? "Und dann ist die Lösung plötzlich ganz einfach: Wenn ein Restaurant Mandy heißt, sollten wir beim ersten Besuch auch Mandy bestellen."
                : "And then the solution is suddenly very simple: If a restaurant is called Mandy, we should order Mandy on our very first visit."}
            </p>
            <p className="font-medium text-[#173C32]">
              {isDe
                ? "Also fällt unsere Wahl auf Mandy Lamm für zwei."
                : "So our choice falls on Mandy Lamb for two."}
            </p>
          </section>

          {/* Section: Dann kommt die Platte */}
          <section aria-labelledby="platte-heading" className="space-y-4 pt-6">
            <h2
              id="platte-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe ? "Dann kommt die Platte" : "Then the Platter Arrives"}
            </h2>
            <p>
              {isDe
                ? "Keine zwei getrennten Teller. Keine kleinen, sorgfältig voneinander abgegrenzten Portionen."
                : "Not two separate plates. Not small, neatly portioned dishes."}
            </p>
            <p>
              {isDe
                ? "Stattdessen wird eine große Platte in die Mitte gestellt: zwei Stücke Lamm auf einer großzügigen Menge Langkornreis, darüber Cashews und frische Kräuter. Daneben steht eine kleine Schale mit roter Sauce."
                : "Instead, a large platter is placed right in the center: two pieces of lamb over a generous serving of long-grain rice, topped with cashews and fresh herbs. Beside it sits a small bowl of red spicy sauce."}
            </p>
            <p>
              {isDe
                ? "Genau in diesem Moment versteht man das Gericht besser. Es geht nicht nur um Lamm und Reis. Es geht darum, dass alle am Tisch von derselben Platte essen. Einer nimmt etwas Reis, der andere reicht die Sauce weiter, und zwischendurch wird diskutiert, was beim nächsten Besuch bestellt werden sollte."
                : "Right in this moment, you understand the dish better. It's not just about lamb and rice. It's about everyone at the table eating from the same platter. One scoops some rice, the other passes the sauce, and in between there's conversation about what to try next time."}
            </p>
            <p>
              {isDe
                ? "Zu zweit funktioniert die Portion für uns genau so, wie ihr Name es verspricht: als gemeinsames Essen."
                : "For two people, the portion works for us exactly as its name promises: as a shared meal."}
            </p>
          </section>

          {/* Platter Gallery Image */}
          <figure className="my-10 rounded-3xl overflow-hidden shadow-xl border border-[#173C32]/10 bg-[#0c1813]">
            <img
              src="/magazin/mandy/mandy-reisplatte-lamm-fuer-zwei.jpg"
              alt={
                isDe
                  ? "Große gemeinsame Platte mit zwei Lammstücken und Reis bei Mandy Restaurant Berlin"
                  : "Large shared platter with two pieces of lamb and rice at Mandy Restaurant Berlin"
              }
              className="w-full h-auto object-cover max-h-[580px]"
              width="819"
              height="1024"
              loading="lazy"
            />
            <figcaption className="p-4 bg-white/95 border-t border-[#173C32]/10 text-xs text-[#173C32]/70 italic flex items-center justify-between">
              <span>
                {isDe
                  ? "Zwei Lammstücke, reichlich Reis, Cashews, Kräuter und die rote Sauce zum Teilen."
                  : "Two pieces of lamb, plenty of rice, cashews, herbs, and red sauce for sharing."}
              </span>
              <span className="text-[10px] font-mono not-italic text-[#173C32]/40 uppercase tracking-wider">
                {isDe ? "Foto: Speisely Redaktion" : "Photo: Speisely Editorial"}
              </span>
            </figcaption>
          </figure>

          {/* Section: Was ist Mandi eigentlich? */}
          <section aria-labelledby="was-ist-mandi" className="space-y-4 pt-4">
            <h2
              id="was-ist-mandi"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe ? "Was ist Mandi eigentlich?" : "What Exactly Is Mandi?"}
            </h2>
            <p>
              {isDe
                ? "Das Restaurant schreibt seinen Namen Mandy. Das Gericht ist international meist als Mandi bekannt und eng mit der jemenitischen Küche verbunden. Seine Wurzeln werden besonders mit Hadhramaut im Jemen in Verbindung gebracht."
                : "The restaurant spells its name Mandy. The dish is internationally known primarily as Mandi and is closely linked to Yemeni cuisine, with its roots rooted in Hadhramaut, Yemen."}
            </p>
            <p>
              {isDe
                ? "Im Mittelpunkt stehen Fleisch – häufig Lamm oder Hähnchen – und gewürzter Reis. Traditionell wird Mandi mit einer besonderen Ofen- beziehungsweise Grubengarmethode verbunden. Das Fleisch gart über der Hitze, während der Reis darunter Aromen aufnimmt. Je nach Region, Familie und Restaurant sieht das Ergebnis natürlich unterschiedlich aus."
                : "At its core are meat — often lamb or chicken — and spiced rice. Traditionally, Mandi is connected to a special tandoor or pit-cooking method where the meat cooks above the heat while the rice below absorbs the drippings and aromas. Depending on region, family, and restaurant, variations naturally exist."}
            </p>
            <p>
              {isDe
                ? "Was viele Varianten verbindet, ist die Art des Servierens: eine große Reisplatte, Fleisch darauf und eine scharfe Sauce dazu. Es ist ein Essen, das nicht nach einem einzelnen, perfekten Bissen verlangt. Es lädt dazu ein, länger am Tisch zu bleiben."
                : "What unites many variations is the style of serving: a large rice platter, meat on top, and a spicy sauce alongside. It's a meal that doesn't demand a single hasty bite; it invites you to linger at the table."}
            </p>
            <div className="p-4 rounded-2xl bg-[#173C32]/5 border border-[#173C32]/10 text-sm text-[#173C32]/80 space-y-2">
              <p className="flex items-center gap-2 font-bold text-[#173C32]">
                <Info className="w-4 h-4 text-[#7FA46B]" aria-hidden="true" />
                {isDe ? "Redaktioneller Hinweis zur Zubereitung" : "Editorial Note on Preparation"}
              </p>
              <p>
                {isDe
                  ? "Wir haben nicht in die Küche von Mandy geschaut. Deshalb beschreiben wir die konkrete Zubereitung des Restaurants nicht als eigene Beobachtung. Laut veröffentlichter Online-Speisekarte wird das Mandy-Lamm mit klassischem Mandy-Gewürz angeboten und im unterirdischen Steinofen gebacken."
                  : "We did not look inside Mandy's kitchen. Therefore, we do not describe the restaurant's concrete preparation as a personal observation. According to the published online menu, the Mandy lamb is prepared with classic Mandi spices and baked in an underground stone oven."}
              </p>
            </div>
          </section>

          {/* Section: Unsere Bestellung – und was wir bezahlt haben */}
          <section aria-labelledby="bestellung-preis" className="space-y-4 pt-6">
            <h2
              id="bestellung-preis"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe
                ? "Unsere Bestellung – und was wir bezahlt haben"
                : "Our Order — and What We Paid"}
            </h2>
            <p>
              {isDe
                ? "Neben Mandy Lamm für zwei bestellen wir:"
                : "Alongside Mandy Lamb for two, we ordered:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-base">
              <li>{isDe ? "zwei kalte Getränke," : "two cold drinks,"}</li>
              <li>{isDe ? "einen Saft und" : "one juice, and"}</li>
              <li>
                {isDe ? "einen indisch-pakistanischen Chai." : "one Indian/Pakistani-style chai."}
              </li>
            </ul>
            <p className="font-semibold text-lg text-[#173C32]">
              {isDe
                ? "Am Ende zahlen wir für zwei Erwachsene rund 45 Euro insgesamt."
                : "In the end, we paid approximately 45 Euros in total for two adults."}
            </p>
            <p className="text-sm text-[#173C32]/75 leading-relaxed bg-[#DDEEE3]/30 p-4 rounded-2xl border border-[#7FA46B]/20">
              {isDe
                ? "Das ist der ungefähre Gesamtbetrag unseres Restaurantbesuchs, nicht nur der Preis der Lammplatte. Auf der Lieferkarte war Mandy Lamm für zwei zum Zeitpunkt unserer Recherche mit 35,90 Euro gelistet. Lieferpreise, Aktionen und Preise im Restaurant können jedoch voneinander abweichen."
                : "This is the approximate total bill of our restaurant visit, not solely the price of the lamb platter. On the delivery menu at research time, Mandy Lamb for two was listed at 35.90 Euros. Delivery prices, promotions, and in-restaurant prices may differ."}
            </p>
            <p>
              {isDe
                ? "Der Chai ist ein schöner Abschluss. Nach der großen Platte bleiben wir noch einen Moment sitzen, trinken den warmen Tee und schauen noch einmal auf die Karte. Denn dort stehen einige Gerichte, die unsere Entscheidung beinahe geändert hätten."
                : "The chai provides a pleasant finish. After the generous platter, we sit for a while, sip the warm tea, and take another look at the menu. Because there are several dishes that almost swayed our decision."}
            </p>
          </section>

          {/* Section: Fast hätten wir etwas anderes bestellt (6 Alternatives) */}
          <section aria-labelledby="alternativen-heading" className="space-y-6 pt-6">
            <h2
              id="alternativen-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe ? "Fast hätten wir etwas anderes bestellt" : "We Almost Ordered Something Else"}
            </h2>
            <p>
              {isDe
                ? "Wer zum ersten Mal vor der Karte sitzt, muss nicht nur zwischen Lamm und Hähnchen wählen. Auch der Reis und die Würzung verändern die Richtung des Gerichts. Diese sechs Alternativen sind uns besonders aufgefallen:"
                : "Sitting in front of the menu for the first time, you don't just choose between lamb and chicken. The style of rice and spices also steers the direction. These six alternatives stood out to us:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              {/* Dish 1: Mandy Hähnchen */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">Mandy Hähnchen</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#173C32]/10 text-[#173C32] font-semibold">
                    {isDe ? "Geflügel" : "Chicken"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Der direkte Einstieg für alle, die lieber Geflügel essen. In der Online-Speisekarte wird es als gebackenes Hähnchen mit klassischem Mandy-Gewürz beschrieben. Es gibt unterschiedliche Portionsgrößen, vom Viertel bis zum ganzen Hähnchen."
                    : "The direct entry for those who prefer poultry. On the online menu, it is described as baked chicken with classic Mandi spices. Various portion sizes are available, from a quarter to a whole chicken."}
                </p>
              </div>

              {/* Dish 2: Haneeth Lamm */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">Haneeth Lamm</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#173C32]/10 text-[#173C32] font-semibold">
                    {isDe ? "Langsam gegart" : "Slow-cooked"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Haneeth gehört ebenfalls zur jemenitischen Küche und wird allgemein mit langsam gegartem, gewürztem Fleisch verbunden. Bei Mandy steht es als Lammgericht für eine oder zwei Personen auf der Karte."
                    : "Haneeth is also a cornerstone of Yemeni cuisine, associated with slowly braised, spiced meat. At Mandy, it is listed as a lamb dish for one or two persons."}
                </p>
              </div>

              {/* Dish 3: Biryani Lamm */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">Biryani Lamm</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E6B84A]/20 text-[#173C32] font-semibold">
                    {isDe ? "Kräftig & Scharf" : "Spicy & Bold"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Eine Option für Gäste, die kräftigere Gewürze und etwas Schärfe suchen. Mandy bietet Biryani sowohl mit Lamm als auch mit Hähnchen an; einzelne Varianten werden ausdrücklich als scharf gekennzeichnet."
                    : "An option for guests seeking bolder spices and heat. Mandy offers Biryani with both lamb and chicken; individual variations are explicitly marked as spicy."}
                </p>
              </div>

              {/* Dish 4: Zirbean Lamm */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">Zirbean Lamm</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#173C32]/10 text-[#173C32] font-semibold">
                    {isDe ? "Zurbian Reis" : "Zurbian Rice"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Zirbean, auch Zurbian geschrieben, ist ein aromatisch gewürztes jemenitisches Reisgericht. Die genaue Zubereitung variiert. Auf Mandys Karte kann man es mit Lamm oder Hähnchen bestellen."
                    : "Zirbean, also spelled Zurbian, is an aromatic Yemeni spiced rice dish. Preparation varies. On Mandy's menu, it can be ordered with lamb or chicken."}
                </p>
              </div>

              {/* Dish 5: Ouzi Lamm */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">Ouzi Lamm</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#173C32]/10 text-[#173C32] font-semibold">
                    {isDe ? "Mit Erbsen & Karotten" : "With Peas & Carrots"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Ouzi hebt sich bereits in der Beschreibung ab: Das Restaurant führt es als Lammfleisch in einer Spezialsoße mit Erbsen und Karotten. Damit klingt es deutlich anders als die schlichtere Kombination aus Fleisch und gewürztem Reis."
                    : "Ouzi stands out in description: The restaurant lists it as lamb meat in a special sauce with peas and carrots, distinct from simpler spiced meat-and-rice combinations."}
                </p>
              </div>

              {/* Dish 6: Halbe Lammschulter mit Mandy-Reis */}
              <div className="p-5 rounded-2xl bg-white border border-[#173C32]/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#173C32]">
                    Halbe Lammschulter
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7FA46B]/20 text-[#173C32] font-semibold">
                    {isDe ? "Große Runde" : "Large Group"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed">
                  {isDe
                    ? "Wer mit mehr Hunger oder in größerer Runde kommt, findet auch eine halbe Lammschulter auf Reis, mit Nüssen garniert. Alternativ wird die Lammschulter mit Zirbean- oder Biryani-Reis angeboten."
                    : "For larger appetites or groups, a half lamb shoulder on rice garnished with nuts is available. It is also offered with Zirbean or Biryani rice."}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#173C32]/70 italic bg-[#173C32]/5 p-4 rounded-xl">
              {isDe
                ? "Wir haben diese sechs Gerichte bei diesem Besuch nicht probiert. Sie sind keine Speisely-Bewertung, sondern unsere Orientierung für alle, die vor derselben Entscheidung stehen wie wir."
                : "We did not taste these six dishes during this visit. They do not constitute a Speisely review, but serve as menu orientation for anyone facing the same decision."}
            </p>
          </section>

          {/* Section: Und die rote Sauce? */}
          <section aria-labelledby="sauce-heading" className="space-y-4 pt-6">
            <h2
              id="sauce-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe ? "Und die rote Sauce?" : "And the Red Sauce?"}
            </h2>
            <p>
              {isDe
                ? "Zur Platte bekommen wir eine rote, scharfe Sauce. Auf der Karte steht Sahaweq, eine jemenitische Chilisauce, die auch unter Schreibweisen wie Sahawiq bekannt ist."
                : "Along with the platter, we received a red spicy sauce. On the menu it is called Sahaweq, a traditional Yemeni chili sauce also spelled Sahawiq."}
            </p>
            <p>
              {isDe
                ? "Je nach Rezept können Chili, Kräuter, Knoblauch und Gewürze hineingehören. Welche Zutaten genau in der bei uns servierten Sauce waren, haben wir nicht erfragt. Deshalb bleiben wir bei dem, was wir sicher sagen können: Sie brachte Schärfe an den Tisch und wurde zur gemeinsamen Platte gereicht."
                : "Depending on the recipe, chili, herbs, garlic, and spices may be included. We did not inquire about the exact ingredients in the sauce served to us. We stick to what we can confirm: It brought heat to the table and was served with the shared platter."}
            </p>
          </section>

          {/* Section: Unser Speisely-Moment */}
          <section aria-labelledby="speisely-moment" className="space-y-4 pt-6">
            <h2
              id="speisely-moment"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#173C32]"
            >
              {isDe ? "Unser Speisely-Moment" : "Our Speisely Moment"}
            </h2>
            <p>
              {isDe
                ? "Unser Besuch bei Mandy war keiner dieser Abende, an denen jeder schweigend auf seinen eigenen Teller schaut. Die große Platte lag zwischen uns, die Sauce wanderte über den Tisch, und am Ende kam noch Chai."
                : "Our visit to Mandy was not one of those evenings where everyone silently gazes into their own plate. The large platter sat between us, the sauce traveled across the table, and at the end arrived chai."}
            </p>
            <p>
              {isDe
                ? "Vielleicht ist genau das der Grund, warum solche Reisgerichte in einer großen Platte serviert werden: Das Essen nimmt die Mitte ein – und alle anderen rücken automatisch ein bisschen näher zusammen."
                : "Perhaps that is precisely why such rice dishes are served on one big platter: The food takes center stage — and everyone automatically moves a little closer together."}
            </p>
            <p>
              {isDe
                ? "Beim ersten Besuch haben wir das Gericht bestellt, das den Namen des Restaurants trägt. Beim nächsten Mal? Wahrscheinlich Haneeth oder Zirbean. Oder wir sitzen wieder zehn Minuten vor der Karte und bestellen am Ende doch noch einmal Mandy."
                : "On our first visit we ordered the dish bearing the restaurant's name. Next time? Probably Haneeth or Zirbean. Or we'll sit for ten minutes looking at the menu and end up ordering Mandy all over again."}
            </p>
          </section>

          {/* Restaurant Sign Image */}
          <figure className="my-10 rounded-3xl overflow-hidden shadow-xl border border-[#173C32]/10 bg-[#0c1813]">
            <img
              src="/magazin/mandy/mandy-happy-jemen-restaurant-schild-berlin.jpg"
              alt={
                isDe
                  ? "Schild von Mandy Happy Jemen Restaurant in der Wildenbruchstraße in Berlin"
                  : "Sign of Mandy Happy Jemen Restaurant on Wildenbruchstraße in Berlin"
              }
              className="w-full h-auto object-cover max-h-[500px]"
              width="1024"
              height="630"
              loading="lazy"
            />
            <figcaption className="p-4 bg-white/95 border-t border-[#173C32]/10 text-xs text-[#173C32]/70 italic flex items-center justify-between">
              <span>
                {isDe
                  ? "Mandy – Happy Jemen Restaurant in der Wildenbruchstraße in Berlin-Neukölln."
                  : "Mandy – Happy Jemen Restaurant on Wildenbruchstraße in Berlin-Neukölln."}
              </span>
              <span className="text-[10px] font-mono not-italic text-[#173C32]/40 uppercase tracking-wider">
                {isDe ? "Foto: Speisely Redaktion" : "Photo: Speisely Editorial"}
              </span>
            </figcaption>
          </figure>

          {/* Section: Mandy auf einen Blick (Fact Box) */}
          <section
            aria-labelledby="auf-einen-blick"
            className="my-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#173C32]/10 shadow-lg space-y-6 not-prose"
          >
            <div className="flex items-center gap-3 border-b border-[#173C32]/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#DDEEE3] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-[#173C32]" aria-hidden="true" />
              </div>
              <div>
                <h3 id="auf-einen-blick" className="font-serif text-2xl font-bold text-[#173C32]">
                  {isDe ? "Mandy auf einen Blick" : "Mandy at a Glance"}
                </h3>
                <p className="text-xs text-[#173C32]/60">
                  {isDe ? "Fakten & Details unseres Besuchs" : "Facts & details of our visit"}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Restaurant" : "Restaurant"}
                </dt>
                <dd className="font-bold text-[#173C32] mt-0.5">Mandy – Happy Jemen Restaurant</dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Adresse" : "Address"}
                </dt>
                <dd className="font-medium text-[#173C32] mt-0.5">
                  Wildenbruchstraße 4, 12045 Berlin-Neukölln
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Küche" : "Cuisine"}
                </dt>
                <dd className="font-medium text-[#173C32] mt-0.5">
                  {isDe
                    ? "Jemenitisch, arabisch und nahöstlich"
                    : "Yemeni, Arabic & Middle Eastern"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Unsere Bestellung" : "Our Order"}
                </dt>
                <dd className="font-medium text-[#173C32] mt-0.5">
                  {isDe
                    ? "Mandy Lamm für zwei, 2 kalte Getränke, 1 Saft, 1 indisch-pakistanischer Chai"
                    : "Mandy Lamb for two, 2 cold drinks, 1 juice, 1 Indian/Pakistani chai"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Unser Gesamtpreis" : "Total Bill"}
                </dt>
                <dd className="font-bold text-[#7FA46B] mt-0.5 text-base">
                  {isDe ? "Rund 45 Euro für 2 Erwachsene" : "Around 45 Euros for 2 adults"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-[#173C32]/60 uppercase tracking-wider">
                  {isDe ? "Besuchsart" : "Visit Type"}
                </dt>
                <dd className="font-medium text-[#173C32] mt-0.5">
                  {isDe
                    ? "Unabhängig besucht & selbst bezahlt"
                    : "Independently visited & self-paid"}
                </dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-[#173C32]/10 text-xs text-[#173C32]/70">
              <p>
                {isDe
                  ? "Die online angezeigten Öffnungszeiten unterscheiden sich je nach Plattform. Am besten prüft ihr die aktuellen Zeiten vor eurem Besuch direkt beim Restaurant."
                  : "Online opening hours differ depending on the platform. Please verify current hours directly with the restaurant before visiting."}
              </p>
            </div>
          </section>

          {/* Transparency Statement */}
          <section
            aria-labelledby="transparenzhinweis"
            className="my-10 p-6 rounded-3xl bg-[#DDEEE3]/60 border border-[#7FA46B]/40 space-y-2 not-prose"
          >
            <h3
              id="transparenzhinweis"
              className="font-serif text-lg font-bold text-[#173C32] flex items-center gap-2"
            >
              <Shield className="w-5 h-5 text-[#7FA46B]" aria-hidden="true" />
              {isDe ? "Transparenzhinweis" : "Transparency Notice"}
            </h3>
            <p className="text-sm text-[#173C32]/80 leading-relaxed">
              {isDe
                ? "Speisely hat Mandy – Happy Jemen Restaurant unabhängig besucht und die gesamte Bestellung selbst bezahlt. Zum Zeitpunkt des Besuchs bestand keine bezahlte Kooperation."
                : "Speisely visited Mandy – Happy Jemen Restaurant independently and paid for the entire meal. At the time of visit, no paid commercial partnership existed."}
            </p>
          </section>

          {/* Sources & Editorial Reference */}
          <section
            aria-labelledby="quellen-heading"
            className="my-8 p-6 rounded-3xl bg-white border border-[#173C32]/10 text-xs text-[#173C32]/70 space-y-2 not-prose"
          >
            <h4 id="quellen-heading" className="font-bold text-[#173C32] text-sm">
              {isDe
                ? "Redaktionelle Quellen & Faktenabgrenzung"
                : "Editorial Sources & Fact Boundary"}
            </h4>
            <p>
              {isDe
                ? "Die persönlichen Aussagen beziehen sich ausschließlich auf den tatsächlichen Speisely-Besuch. Nicht probierte Gerichte werden nicht bewertet. Es werden keine Öffnungszeiten, Halal-Angaben, Bewertungen oder konkreten Zubereitungsmethoden als verifizierte Restaurantdaten behauptet, sofern sie nicht direkt vom Betreiber bestätigt wurden."
                : "Personal statements refer strictly to the actual Speisely visit. Dishes not tasted are not rated. No opening hours, halal claims, ratings or internal kitchen methods are asserted without direct operator confirmation."}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#173C32]/60 pt-1">
              <li>
                <a
                  href="https://www.ubereats.com/de/store/mandy-restaurant-wildenbruchstr/XLi-6TSOUwij8yJj2HJaVg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#173C32]"
                >
                  Mandy Restaurant bei Uber Eats
                </a>{" "}
                –{" "}
                {isDe
                  ? "veröffentlichte Speisekarte, Gerichte und Preise (abgerufen August 2026)"
                  : "published menu, items and prices (accessed August 2026)"}
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Mandi_%28food%29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#173C32]"
                >
                  Mandi – kulinarischer Hintergrund
                </a>{" "}
                –{" "}
                {isDe
                  ? "Herkunft, Grundbestandteile und traditionelle Garmethode"
                  : "Origin, key ingredients and traditional cooking method"}
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Yemeni_cuisine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#173C32]"
                >
                  Yemeni cuisine
                </a>{" "}
                –{" "}
                {isDe
                  ? "Überblick über Mandi, Haneeth, Zurbian und Sahawiq"
                  : "Overview of Mandi, Haneeth, Zurbian and Sahawiq"}
              </li>
            </ul>
          </section>

          {/* Related Articles in Speisely Visits */}
          <section
            aria-labelledby="related-heading"
            className="pt-8 border-t border-[#173C32]/10 not-prose"
          >
            <h3 id="related-heading" className="font-serif text-xl font-bold text-[#173C32] mb-6">
              {isDe ? "Weitere Speisely Visits entdecken" : "Explore More Speisely Visits"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Shawarma Albaik Card */}
              <Link
                to="/magazin/speisely-visits/shawarma-albaik-berlin"
                className="group flex flex-col rounded-2xl overflow-hidden border border-[#173C32]/10 bg-white hover:ring-2 hover:ring-[#7FA46B] transition shadow-md"
              >
                <div className="h-44 bg-[#0c1813] overflow-hidden">
                  <img
                    src="/magazin/albaik/albaik-shawarma-rice-hero.jpg"
                    alt={
                      isDe
                        ? "Chicken Shawarma und gelber Reis bei Shawarma Albaik in Berlin-Neukölln"
                        : "Chicken Shawarma and yellow rice at Shawarma Albaik in Berlin-Neukölln"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#7FA46B] uppercase tracking-wider">
                      Speisely Visits · Sonnenallee
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                      {isDe
                        ? "Ein Abend bei Shawarma Albaik auf der Sonnenallee"
                        : "An Evening at Shawarma Albaik on Sonnenallee"}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#173C32] flex items-center gap-1 group-hover:text-[#b8860b] pt-2">
                    {isDe ? "Story lesen" : "Read Story"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              {/* Speisely Visits Hub Link */}
              <Link
                to="/magazin/speisely-visits"
                className="p-6 rounded-2xl bg-[#7FA46B]/10 border border-[#7FA46B]/30 hover:bg-[#7FA46B]/20 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#7FA46B] text-white flex items-center justify-center">
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#173C32]">
                    {isDe ? "Alle Speisely Visits" : "All Speisely Visits"}
                  </h4>
                  <p className="text-xs text-[#173C32]/75 leading-relaxed">
                    {isDe
                      ? "Erfahre mehr über unser redaktionelles Format und alle unabhängig besuchten Restaurants."
                      : "Learn more about our editorial format and all independently visited restaurants."}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#173C32] flex items-center gap-1 pt-4">
                  {isDe ? "Kategorie ansehen" : "View Category"}{" "}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </section>

          {/* Back Navigation */}
          <div className="pt-8 border-t border-[#173C32]/10 not-prose flex items-center justify-between">
            <Link
              to="/magazin/speisely-visits"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#173C32]/70 hover:text-[#173C32] transition-colors"
            >
              ← {isDe ? "Zurück zu Speisely Visits" : "Back to Speisely Visits"}
            </Link>
            <Link
              to="/magazin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#173C32]/70 hover:text-[#173C32] transition-colors"
            >
              {isDe ? "Magazin Übersicht" : "Magazine Overview"} →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
