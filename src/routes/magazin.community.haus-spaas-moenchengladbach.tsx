import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/community/haus-spaas-moenchengladbach")({
  head: () => ({
    meta: [
      {
        title: "Haus Spaas Mönchengladbach: Schnitzel-Handwerk | Speisely",
      },
      {
        name: "description",
        content:
          "Haus Spaas in Mönchengladbach: Wirtshauskultur, handgeklopfte Pfannenschnitzel, frisch gezapftes Hannen Alt und Fest-Catering im Speisely Porträt.",
      },
      {
        name: "keywords",
        content:
          "Haus Spaas, Haus Spaas Mönchengladbach, Schnitzel Mönchengladbach, Bettrath Restaurant, Hannen Alt, Catering Mönchengladbach, Speisely Community",
      },
      { name: "geo.region", content: "DE-NW" },
      { name: "geo.placename", content: "Mönchengladbach-Bettrath" },
      { name: "geo.position", content: "51.2185;6.4520" },
      { name: "ICBM", content: "51.2185, 6.4520" },
      {
        property: "og:title",
        content: "Haus Spaas: Das ehrliche Handwerk der heißen Pfanne — Speisely Porträt",
      },
      {
        property: "og:description",
        content:
          "Hinter den Ziegelmauern an der Von-Groote-Straße: Goldgelb gebratene Schnitzel, Hannen Alt vom Fass und 1-Klick Tischreservierung.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/slide1_schnitzel_hero.webp",
      },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/haus-spaas-moenchengladbach",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/haus-spaas-moenchengladbach",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": "https://speisely.de/magazin/community/haus-spaas-moenchengladbach#article",
          headline: "Das ehrliche Handwerk der heißen Pfanne: Haus Spaas im Porträt",
          description:
            "Ein redaktioneller Blick auf das traditionsreiche Gasthaus Haus Spaas in Mönchengladbach-Bettrath: Frische Schnitzelküche, Hannen Alt und familiäres Feier-Catering.",
          image: "https://speisely.de/slide1_schnitzel_hero.webp",
          datePublished: "2026-10-25T10:00:00+01:00",
          dateModified: "2026-10-25T10:00:00+01:00",
          author: {
            "@type": "Organization",
            name: "Speisely Redaktion",
            url: "https://speisely.de",
          },
          publisher: {
            "@type": "Organization",
            name: "Speisely Marketplace",
            url: "https://speisely.de",
            logo: {
              "@type": "ImageObject",
              url: "https://speisely.de/speisely_logo.png",
            },
          },
          contentLocation: {
            "@type": "Restaurant",
            name: "Haus Spaas",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Von-Groote-Straße 125",
              addressLocality: "Mönchengladbach",
              postalCode: "41066",
              addressCountry: "DE",
            },
            telephone: "+492161632115",
            servesCuisine: "Deutsche Hausmannskost, Schnitzel",
            url: "https://haus-spaas.de",
          },
        }),
      },
    ],
  }),
  component: HausSpaasArticlePage,
});

function HausSpaasArticlePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const tt = (de: string, en: string) => (isDe ? de : en);

  return (
    <SiteShell>
      {/* 1. Header / Navigation Backlink */}
      <div className="bg-[#FAF8F5] border-b border-forest/10 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-forest/70">
          <Link
            to="/magazin"
            className="inline-flex items-center gap-1.5 font-bold hover:text-forest transition-colors text-forest/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tt("Zurück zur Magazin-Übersicht", "Back to Magazine Overview")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6B84A]/20 text-forest text-[11px] font-bold uppercase tracking-wider border border-[#E6B84A]/40">
              <Sparkles className="w-3 h-3 text-[#A85C36]" />
              {tt("Partner Feature", "Partner Feature")}
            </span>
          </div>
        </div>
      </div>

      <article className="bg-[#FAF8F5] text-forest min-h-screen pb-24">
        {/* 2. Article Hero */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#A85C36] uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Mönchengladbach-Bettrath · Niederrhein</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-forest tracking-tight leading-[1.15] mb-4">
            {tt(
              "Das ehrliche Handwerk der heißen Pfanne: Haus Spaas im Porträt",
              "The Honest Craft of the Sizzling Pan: Haus Spaas in Profile"
            )}
          </h1>

          <p className="text-base sm:text-xl font-serif text-forest/80 leading-relaxed max-w-3xl mb-6">
            {tt(
              "Hinter den Ziegelmauern an der Von-Groote-Straße bewahrt das Traditionsgasthaus, was vielen modernen Lokalen abhandengekommen ist: unaufgeregte Herzlichkeit, handgeklopfte Pfannenschnitzel und die Seele eines echten Niederrheiner Treffpunkts.",
              "Behind the brick walls on Von-Groote-Straße, this traditional inn preserves what many modern venues have lost: quiet hospitality, hand-tenderized pan schnitzels, and the authentic soul of a Lower Rhine gathering place."
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-forest/60 pb-6 border-b border-forest/15">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>25. Oktober 2026</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{tt("4 Minuten Lesezeit", "4 min read")}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-forest/80 font-semibold">
              <Award className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>Speisely Gastronomie-Dossier</span>
            </div>
          </div>

          {/* Mandatory Disclosure Note (Rule 7) */}
          <div className="mt-4 p-3 rounded-2xl bg-forest/5 border border-forest/10 text-[11px] sm:text-xs text-forest/75 leading-relaxed">
            <strong>{tt("Transparenzhinweis:", "Editorial Disclosure:")}</strong>{" "}
            {tt(
              "Dieser Beitrag ist ein Speisely Partner-Porträt. Die Angaben zu Spezialitäten, Wirtshaus-Tradition und Catering wurden in redaktioneller Abstimmung mit dem Betrieb zusammengestellt.",
              "This article is a Speisely Partner Feature. Details regarding culinary craft, specialties, and event catering were compiled in direct editorial collaboration with the venue."
            )}
          </div>
        </header>

        {/* 3. Hero Image (Passe-Partout Luxury Frame - Rule 10) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <figure className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A]">
            <img
              src="/slide1_schnitzel_hero.webp?v=3"
              alt="Haus Spaas handgeklopftes Schnitzel frisch aus der Pfanne"
              className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              loading="eager"
            />
            <figcaption className="pt-2 px-2 text-center text-xs text-forest/70 font-serif italic">
              {tt(
                "Goldgelb soufflierte Panade: Das Schweineschnitzel im Haus Spaas wird von Hand geklopft und frisch in der Pfanne zubereitet.",
                "Golden-brown soufflé crust: Pork schnitzel at Haus Spaas is tenderized by hand and prepared fresh in the pan."
              )}
            </figcaption>
          </figure>
        </section>

        {/* 4. Article Core Narrative */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10 text-base sm:text-lg leading-relaxed text-forest/90 font-sans">
          {/* Section 1: Atmosphere & Entrance */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest leading-snug">
              {tt(
                "Der Klang der Küche: Wo das Plattiereisen den Takt angibt",
                "The Sound of the Kitchen: Where the Tenderizing Mallet Sets the Rhythm"
              )}
            </h2>
            <p>
              {tt(
                "Es gibt Lokale, die man nicht nach der Speisekarte beurteilt, sondern nach dem Geräusch, das einen beim Eintreten empfängt. Im Haus Spaas an der Von-Groote-Straße ist es das charakteristische, dumpfe Schlagen des Plattiereisens auf den massiven Holztischen der Küche. Ein Klang, der in der heutigen Gastronomie selten geworden ist – denn hier wird nicht aus dem Tiefkühlbeutel geschöpft, sondern Fleisch Stück für Stück von Hand vorbereitet.",
                "There are establishments you do not judge by a printed menu, but by the sound that greets you as you walk in. At Haus Spaas on Von-Groote-Straße, it is the rhythmic thud of the tenderizing mallet on the wooden prep tables of the kitchen. A sound that has grown rare in modern gastronomy—because here, meals are never scooped from frozen pre-packs, but prepared by hand cut by cut."
              )}
            </p>
            <p>
              {tt(
                "Vorne, direkt hinter der schweren Eingangstür, dominiert die klassische rheinische Schankstube: Dunkles Holz, polierte Gläser und ein Zapfhahn, der das bernsteinfarbene Hannen Alt mit cremigem Schaum ins Glas befördert. Hier trifft sich die Nachbarschaft auf das erste Bier nach der Schicht. Weiter hinten breitet sich der gemütliche Gastraum aus – beleuchtet vom warmen Schein der Schirmlampen, getragen von schweren Deckenbalken und gefüllt mit dem unverkennbaren Wohlgeruch frisch gebratener Hausmannskost.",
                "In the front, right behind the heavy door, the classic Rhenish pub counter takes center stage: dark wood, polished glassware, and a tap pouring amber Hannen Alt with a creamy crown. Neighbors gather here for an evening drink, while further back, the warm dining room unfolds under rustic wooden ceiling beams and lampshades."
              )}
            </p>
          </section>

          {/* Image 2: Architectural Facade */}
          <figure className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A]">
            <img
              src="/haus_spaas_sign.webp"
              alt="Haus Spaas historisches Messingschild auf rotem Ziegelstein"
              className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              loading="lazy"
            />
            <figcaption className="pt-2 px-2 text-center text-xs text-forest/70 font-serif italic">
              {tt(
                "Traditioneller Ziegelbau an der Von-Groote-Straße 125: Authentische rheinische Wirtshauskultur in Mönchengladbach-Bettrath.",
                "Traditional red-brick building at Von-Groote-Straße 125: Authentic Rhenish tavern culture in Mönchengladbach-Bettrath."
              )}
            </figcaption>
          </figure>

          {/* Section 2: Craft & Signature Dishes with specific dish profiles */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest leading-snug">
              {tt(
                "Frische verlangt Geduld: Eine Küche des bewussten Entschleunigens",
                "Freshness Demands Patience: A Kitchen of Intentional Deceleration"
              )}
            </h2>
            <p>
              {tt(
                "Das kulinarische Zentrum des Hauses ist und bleibt das handgeklopfte Schweineschnitzel in seinen unverwechselbaren Spezial-Variationen:",
                "The culinary center of the house remains the hand-tenderized pork schnitzel in its distinctive house specialties:"
              )}
            </p>

            {/* Mouth-Watering Specific Dish Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
              <div className="p-4 rounded-2xl bg-white border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold text-[#A85C36] uppercase tracking-wider block mb-1">
                  ✦ {tt("Der Klassiker des Hauses", "House Classic")}
                </span>
                <h4 className="font-serif font-bold text-forest text-base mb-1">
                  Schnitzel „Antje“
                </h4>
                <p className="text-xs text-forest/80 leading-relaxed">
                  {tt(
                    "Herzhaft gefüllt mit würzigem Landschinken, zart schmelzendem Gouda und feinen Kräutern – serviert mit krossen Schmalz-Bratkartoffeln und Speck.",
                    "Heartily filled with country ham, melted Gouda, and fine herbs—served with golden skillet potatoes and crisp bacon."
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold text-[#A85C36] uppercase tracking-wider block mb-1">
                  ✦ {tt("Deftig & Pikant", "Hearty & Spicy")}
                </span>
                <h4 className="font-serif font-bold text-forest text-base mb-1">
                  Schnitzel „à la Kalle“
                </h4>
                <p className="text-xs text-forest/80 leading-relaxed">
                  {tt(
                    "Goldgelb soufflierte Panade, überbacken mit sautierten Champignons, geschmorten Zwiebeln und einer kräftig eingekochten Bratensauce.",
                    "Soufflé-crusted schnitzel topped with sautéed button mushrooms, braised onions, and a rich, slow-simmered reduction sauce."
                  )}
                </p>
              </div>
            </div>

            <p>
              {tt(
                "Dass jedes Gericht à la minute durch die heiße Pfanne wandert, spürt man nicht nur an der lockeren Panade – es prägt auch den Rhythmus des Hauses. An Tagen, an denen alle Tische bis auf den letzten Platz besetzt sind, spürt der Gast die Konsequenz echter Frischeküche: Hier wird nichts auf Vorrat vorgebraten. Wer im Haus Spaas Platz nimmt, entscheidet sich bewusst für eine traditionelle Wirtshauskultur, bei der das Gespräch am Tisch und das kühle Hannen Alt die Zeit bis zum dampfenden Teller angenehm verkürzen.",
                "Every dish is cooked à la minute in the pan, evident in the light, airy breading. When the dining room is filled, guests experience the honest consequence of scratch cooking: nothing is pre-fried in bulk. Diners consciously trade fast-food rush for traditional tavern ease, passing time in good conversation over a cold Hannen Alt."
              )}
            </p>

            {/* Mid-Article Fast Conversion Bar */}
            <div className="my-6 p-4 rounded-2xl bg-[#083822] text-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#E6B84A]/30">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#E6B84A] block">
                  ✦ {tt("Hungrig geworden?", "Feeling Hungry?")}
                </span>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  {tt(
                    "Tische für die beliebten Schnitzeltage rechtzeitig sichern.",
                    "Reserve tables in advance for the popular Schnitzel Days."
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/4917670341602?text=Hallo%20Haus%20Spaas%20Team!%20Ich%20habe%20den%20Speisely-Bericht%20gelesen%20und%20m%C3%B6chte%20einen%20Tisch%20anfragen."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#E6B84A] text-forest font-bold text-xs hover:bg-[#d6a538] transition shadow"
                >
                  {tt("Tisch anfragen ↗", "Book Table ↗")}
                </a>
                <a
                  href="tel:+492161632115"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                >
                  02161 632115
                </a>
              </div>
            </div>
          </section>

          {/* Image 3: Mobile Experience & Reservation Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <figure className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl">
              <img
                src="/spaas_mobile_preview.png"
                alt="Haus Spaas Mobile Speisekarte und WhatsApp Reservierung"
                className="w-full h-auto rounded-2xl object-cover max-h-[380px]"
                loading="lazy"
              />
              <figcaption className="pt-2 text-center text-xs text-forest/70 font-serif italic">
                {tt("Duale Speisekarte & 1-Klick WhatsApp Reservierung", "Dual digital menu & 1-click booking")}
              </figcaption>
            </figure>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E6B84A] bg-forest px-2.5 py-1 rounded-full inline-block">
                {tt("Digitale Gastfreundschaft", "Digital Hospitality")}
              </span>
              <h3 className="text-xl font-serif font-bold text-forest">
                {tt("Direkt reservieren ohne Portalprovision", "Direct Reservations without Commissions")}
              </h3>
              <p className="text-xs sm:text-sm text-forest/80 leading-relaxed">
                {tt(
                  "Statt auf gebührenpflichtige Buchungsplattformen zu setzen, nutzt Haus Spaas das Speisely-System für direkte Tischbuchungen per WhatsApp und Telefon. So bleibt der persönliche Kontakt zwischen Gast und Wirt erhalten.",
                  "Instead of paying hefty commissions to booking portals, Haus Spaas uses Speisely's direct system for WhatsApp and phone reservations, preserving direct guest connection."
                )}
              </p>
              <div className="pt-2">
                <a
                  href="https://haus-spaas.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-[#FAF7F0] text-xs font-bold hover:bg-[#E6B84A] hover:text-forest transition-colors shadow"
                >
                  <span>{tt("haus-spaas.de besuchen", "Visit haus-spaas.de")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Banquets & Catering */}
          <section className="space-y-4 pt-4 border-t border-forest/10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest leading-snug">
              {tt(
                "Wenn der Gastraum zur Festtafel wird: Buffets & Feiern ab 10 Personen",
                "When the Tavern Becomes a Banquet Hall: Buffets & Events for 10+ Guests"
              )}
            </h2>
            <p>
              {tt(
                "Ein Gasthaus dieser Prägung lebt von den Geschichten seiner Gäste. Für Familienfeiern, runde Geburtstage und Vereinsjubiläen verwandelt sich das Haus Spaas regelmäßig in eine weitläufige Festtafel. Was viele Gäste schätzen: Die Küche bereitet auf Vorbestellung reich bestückte Warmbuffets zu, die laufend frisch nachgelegt werden.",
                "A traditional tavern thrives on community gatherings. For anniversaries, birthdays, and club celebrations, Haus Spaas regularly hosts long banquet tables, serving hot buffets replenished fresh from the kitchen."
              )}
            </p>
            <p>
              {tt(
                "Ob Gruppen direkt in der gemütlichen Gaststube unter den Holzbalkendecken feiern oder sich die Schnitzel- und Grillplatten warm an den Wunschort liefern lassen: Haus Spaas beweist, dass gute Festverpflegung keine molekulare Zauberei braucht, sondern Pünktlichkeit, beste Zutaten und Fleisch, das auch bei größeren Runden saftig auf den Tisch kommt.",
                "Whether celebrating on-site under the wooden ceiling beams or ordering warm schnitzel and grill platters delivered to their venue, guests rely on Haus Spaas for punctuality and authentic home-style hospitality."
              )}
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/4917670341602?text=Hallo%20Haus%20Spaas%20Team!%20Wir%20planen%20eine%20Feier%20und%20interessieren%20uns%20f%C3%BCr%20Ihr%20Catering-%20und%20Buffet-Angebot."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest text-[#FAF8F5] text-xs font-bold hover:bg-[#E6B84A] hover:text-forest transition-colors shadow-md"
              >
                <span>{tt("Catering & Feier unverbindlich anfragen", "Inquire Catering & Event Buffets")}</span>
                <ChevronRight className="w-4 h-4 text-[#E6B84A]" />
              </a>
            </div>
          </section>

          {/* Image 4: Catering Showcase */}
          <figure className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A]">
            <img
              src="/images/event_catering_hero.webp"
              alt="Reich bestücktes Festbuffet und Catering für Familien- und Vereinsfeiern"
              className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
              loading="lazy"
            />
            <figcaption className="pt-2 px-2 text-center text-xs text-forest/70 font-serif italic">
              {tt(
                "Warme Buffets und rustikale Festtafeln: Zuverlässiger Partyservice ab 10 Personen für Mönchengladbach und Umgebung.",
                "Warm buffet spreads and rustic banquets: Reliable event catering for 10+ guests across Mönchengladbach."
              )}
            </figcaption>
          </figure>
        </div>

        {/* 5. Factsheet & Contact Box */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-14">
          <div className="rounded-3xl bg-white border-2 border-forest/15 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A85C36]">
                  {tt("Betriebssteckbrief", "Venue Overview")}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-forest">
                  Haus Spaas Mönchengladbach
                </h3>
              </div>
              <UtensilsCrossed className="w-8 h-8 text-[#E6B84A]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-forest/80">
              <div>
                <strong className="text-forest block mb-0.5">{tt("Adresse:", "Address:")}</strong>
                <span>Von-Groote-Straße 125, 41066 Mönchengladbach (Bettrath)</span>
              </div>
              <div>
                <strong className="text-forest block mb-0.5">{tt("Parkmöglichkeiten:", "Parking:")}</strong>
                <span>Kostenfreie Gästeparkplätze direkt am Gebäude</span>
              </div>
              <div>
                <strong className="text-forest block mb-0.5">{tt("Küchenstil:", "Cuisine:")}</strong>
                <span>Traditionelle Hausmannskost, Schnitzel, Steaks & Grillteller</span>
              </div>
              <div>
                <strong className="text-forest block mb-0.5">{tt("Brauerei-Partner:", "Beer:")}</strong>
                <span>Frisch gezapftes Hannen Alt vom Fass & Pils</span>
              </div>
              <div>
                <strong className="text-forest block mb-0.5">{tt("Öffnungszeiten:", "Hours:")}</strong>
                <span>Di & Do–So: ab 17:30 Uhr · Fr: 11:00–14:00 & ab 17:00 Uhr</span>
                <span className="block text-[11px] text-forest/60">Mo & Mi: Ruhetag</span>
              </div>
              <div>
                <strong className="text-forest block mb-0.5">{tt("Feiern & Catering:", "Events & Catering:")}</strong>
                <span>Buffets ab 10 Personen (auf Vorbestellung)</span>
              </div>
            </div>

            {/* Direct CTA Buttons */}
            <div className="pt-4 border-t border-forest/10 flex flex-wrap gap-3">
              <a
                href="https://wa.me/4917670341602?text=Hallo%20Haus%20Spaas%20Team!%20Ich%20habe%20den%20Bericht%20auf%20Speisely%20gelesen%20und%20m%C3%B6chte%20einen%20Tisch%20reservieren."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 transition shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{tt("Tisch via WhatsApp anfragen", "Reserve via WhatsApp")}</span>
              </a>
              <a
                href="tel:+492161632115"
                className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white border border-forest/20 text-forest font-bold text-xs hover:bg-forest/5 transition"
              >
                <Phone className="w-4 h-4 text-forest/70" />
                <span>02161 632115</span>
              </a>
              <a
                href="https://haus-spaas.de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#E6B84A] text-forest font-bold text-xs hover:bg-[#d6a538] transition shadow"
              >
                <span>{tt("Website besuchen ↗", "Visit Website ↗")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 6. Digital Magazine E-Paper Lead Magnet Banner */}
        <aside className="max-w-3xl mx-auto px-4 sm:px-6 mt-14">
          <div className="rounded-3xl bg-gradient-to-r from-[#083822] to-[#124e33] text-[#FAF8F5] p-6 sm:p-8 border-2 border-[#E6B84A]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E6B84A] text-forest">
                <Sparkles className="w-3 h-3" />
                {tt("Speisely Digital Magazine", "Speisely Digital Magazine")}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                {tt(
                  "Mehr echte Food-Stories im interaktiven 3D E-Paper",
                  "More Authentic Food Stories in the Interactive 3D E-Paper"
                )}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
                {tt(
                  "Blättere durch unsere Monatsausgaben: Exklusive Reportagen, kulinarische Trends und handwerkliche Gastronomie in Deutschland.",
                  "Browse through our monthly editions: Exclusive reports, culinary craft, and independent hospitality across Germany."
                )}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/magazin/digital"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#E6B84A] text-forest font-bold text-xs hover:bg-[#d6a538] transition shadow-xl"
              >
                <span>{tt("📖 Zum E-Paper Archiv", "📖 Open E-Paper Archive")}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>
      </article>
    </SiteShell>
  );
}
