import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Eye, Shield, MapPin, Calendar } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { magazineArticles } from "@/data/magazineArticles";

export const Route = createFileRoute("/magazin/speisely-visits/")({
  head: () => ({
    meta: [
      {
        title: "Speisely Visits – Echte Restaurantbesuche",
      },
      {
        name: "description",
        content:
          "Unabhängige Restaurantbesuche und echte Food Stories aus Berlin und ganz Deutschland. Authentisch getestet.",
      },
      {
        name: "keywords",
        content:
          "Speisely Visits, Restaurantbesuch Berlin, Shawarma Berlin Neukölln, Food Stories Deutschland, unabhängige Restaurantbewertung",
      },
      {
        property: "og:title",
        content: "Speisely Visits – Echte Restaurantbesuche und Food Stories",
      },
      {
        property: "og:description",
        content:
          "Echte, redaktionell unabhängige Restaurantbesuche. Speisely besucht und bezahlt selbst – keine Kooperationen, keine Einladungen.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/albaik/albaik-shawarma-rice-hero.webp",
      },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/speisely-visits",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/speisely-visits",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://speisely.de/magazin/speisely-visits#page",
              name: "Speisely Visits",
              url: "https://speisely.de/magazin/speisely-visits",
              description:
                "Echte, redaktionell unabhängige Restaurantbesuche von Speisely. Kein gesponserter Inhalt – alle Besuche werden selbst bezahlt.",
              inLanguage: "de",
              isPartOf: {
                "@type": "CollectionPage",
                "@id": "https://speisely.de/magazin#page",
                name: "Speisely Magazin",
                url: "https://speisely.de/magazin",
              },
              publisher: {
                "@type": "Organization",
                "@id": "https://speisely.de/#organization",
                name: "Speisely",
                url: "https://speisely.de",
                logo: {
                  "@type": "ImageObject",
                  url: "https://speisely.de/speisely_logo.png",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://speisely.de/magazin/speisely-visits#breadcrumb",
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
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SpeiselyVisitsPage,
});

function SpeiselyVisitsPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <PageHero
        eyebrow={
          isDe
            ? "Speisely Magazin · Redaktionelle Kategorie"
            : "Speisely Magazine · Editorial Category"
        }
        heading="Speisely Visits"
        subtext={
          isDe
            ? "Mit Speisely Visits entdecken wir Restaurants, Imbisse und besondere gastronomische Orte persönlich. Wir zeigen, was auf unserem Tisch stand, teilen unsere authentischen Eindrücke und machen lokale Food-Adressen in Berlin und darüber hinaus sichtbar."
            : "With Speisely Visits, we explore restaurants, local eateries, and unique culinary places in person. We share what was on our table, report our genuine impressions, and spotlight standout food destinations in Berlin and beyond."
        }
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-[#173C32]/80 font-semibold">
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
            <li aria-current="page" className="text-[#173C32] font-semibold">
              Speisely Visits
            </li>
          </ol>
        </nav>

        {/* How Speisely Visits works */}
        <section className="mb-16" aria-labelledby="visits-erklaerung">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-white border border-[#173C32]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DDEEE3] flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#173C32]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#173C32]">
                {isDe ? "Persönlicher Besuch" : "Personal Visit"}
              </h3>
              <p className="text-sm text-[#173C32]/70 leading-relaxed">
                {isDe
                  ? "Jedes Restaurant unter Speisely Visits wurde von uns persönlich besucht. Wir wählen die Orte selbst aus – ohne Anfrage, Einladung oder Absprache."
                  : "Every restaurant in Speisely Visits is visited in person. We select locations independently — without invitations, requests, or arrangements."}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#173C32]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DDEEE3] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#173C32]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#173C32]">
                {isDe ? "Selbst bezahlt" : "Paid by Us"}
              </h3>
              <p className="text-sm text-[#173C32]/70 leading-relaxed">
                {isDe
                  ? "Das Essen wird von Speisely selbst bezahlt. Es bestehen zum Zeitpunkt des Besuchs keine bezahlten Kooperationen mit den besuchten Betrieben."
                  : "All food is paid for directly by Speisely. At the time of the visit, no paid sponsorship or commercial relationship exists."}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#173C32]/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DDEEE3] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#173C32]" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#173C32]">
                {isDe ? "Lokal und authentisch" : "Local & Authentic"}
              </h3>
              <p className="text-sm text-[#173C32]/70 leading-relaxed">
                {isDe
                  ? "Speisely Visits stellt lokale Betriebe vor, die wir für besonders, überraschend oder entdeckenswert halten – unabhängig von Marketplace-Mitgliedschaft oder Partnerschaft."
                  : "Speisely Visits showcases local eateries that we find remarkable or worth discovering — regardless of marketplace membership or partner status."}
              </p>
            </div>
          </div>
        </section>

        {/* Distinction from Partner Stories */}
        <section
          className="mb-16 p-8 rounded-3xl bg-[#173C32]/5 border border-[#173C32]/10"
          aria-labelledby="unterschied-heading"
        >
          <h2 id="unterschied-heading" className="font-serif text-xl font-bold text-[#173C32] mb-4">
            {isDe ? "Speisely Visits vs. Partner Stories" : "Speisely Visits vs. Partner Stories"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#173C32]/80 leading-relaxed">
            <div className="space-y-2">
              <p className="font-bold text-[#173C32] flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full bg-[#7FA46B]"
                  aria-hidden="true"
                />
                Speisely Visits
              </p>
              <ul className="space-y-1 pl-5 list-disc">
                <li>
                  {isDe
                    ? "Unabhängig besucht und selbst bezahlt"
                    : "Independently visited and self-paid"}
                </li>
                <li>
                  {isDe
                    ? "Kein kommerzielles Verhältnis zum besuchten Betrieb"
                    : "No commercial relationship with the establishment"}
                </li>
                <li>
                  {isDe
                    ? "Kein Partner oder Marketplace-Mitglied"
                    : "Not a partner or marketplace member"}
                </li>
                <li>
                  {isDe
                    ? "Ausgewählt allein durch redaktionelles Interesse"
                    : "Chosen purely for editorial interest"}
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#173C32] flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full bg-[#E6B84A]"
                  aria-hidden="true"
                />
                Partner Stories
              </p>
              <ul className="space-y-1 pl-5 list-disc">
                <li>
                  {isDe
                    ? "Speisely Marketplace-Partner oder Kooperationspartner"
                    : "Speisely marketplace partners or collaborations"}
                </li>
                <li>
                  {isDe
                    ? "Redaktionelle Zusammenarbeit mit dem Betrieb"
                    : "Editorial collaboration with the partner"}
                </li>
                <li>
                  {isDe
                    ? "Inhalt zur Vorstellung des Partners auf Speisely"
                    : "Content introducing the partner on Speisely"}
                </li>
                <li>{isDe ? "Entsprechend gekennzeichnet" : "Clearly labeled accordingly"}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Published Articles */}
        <section aria-labelledby="beitraege-heading" className="mb-16">
          <h2
            id="beitraege-heading"
            className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] mb-8"
          >
            {isDe ? "Bisher erschienen" : "Published Articles"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazineArticles
              .filter((a) => a.isVisit)
              .map((article) => (
                <Link
                  key={article.id}
                  to={article.to}
                  className="group flex flex-col overflow-hidden rounded-3xl shadow-lg border border-[#173C32]/10 bg-white hover:ring-2 hover:ring-[#7FA46B] transition hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden h-60 bg-[#0c1813]">
                    <img
                      src={`${article.image}${article.image.includes("?") ? "&" : "?"}v=2`}
                      alt={isDe ? article.titleDe : article.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width="800"
                      height="600"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16382b] text-white border border-[#7FA46B]/50 px-3 py-1 text-xs font-extrabold shadow">
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        Speisely Visits
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-[#173C32] px-2.5 py-1 text-xs font-bold shadow">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {article.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#173C32]/60 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
                        <span>
                          {isDe
                            ? `Besuch: ${article.visitDateDe || article.dateDe}`
                            : `Visited: ${article.visitDateEn || article.dateEn}`}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        {isDe ? "100% Selbst bezahlt" : "100% Self-paid"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                      {isDe ? article.titleDe : article.titleEn}
                    </h3>
                    <p className="text-sm text-[#173C32]/85 leading-relaxed flex-1">
                      {isDe ? article.excerptDe : article.excerptEn}
                    </p>
                    <div className="pt-2 border-t border-[#173C32]/10 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                        {isDe ? "Story lesen" : "Read Story"}{" "}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs text-[#173C32]/75 font-medium">
                        {article.readTime} {isDe ? "Lesezeit" : "read"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* Back link */}
        <div className="border-t border-[#173C32]/10 pt-8">
          <Link
            to="/magazin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b4d3e] hover:text-[#b8860b] transition-colors"
          >
            ← {isDe ? "Zurück zur Magazin-Übersicht" : "Back to Magazine Overview"}
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
