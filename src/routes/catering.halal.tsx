import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Heart,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  UtensilsCrossed,
  CheckCircle2,
  Flame,
  Clock,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/catering/halal")({
  head: () => ({
    meta: [
      { title: "100% Halal Catering in Deutschland — Speisely" },
      {
        name: "description",
        content:
          "Zertifiziertes Halal Catering für Firmenfeiern, Hochzeiten & Events: Feinstes Fleisch, Buffets & Fingerfood in Berlin, Frankfurt, München & ganz DE.",
      },
      {
        name: "keywords",
        content:
          "Halal Catering Berlin, Halal Catering Frankfurt, Halal Catering München, Halal Buffet Hochzeit, Halal Firmenevent Catering, Halal Fingerfood, Halal BBQ Catering",
      },
      { property: "og:title", content: "100% Halal Catering in Deutschland — Speisely" },
      {
        property: "og:description",
        content:
          "Zertifizierte Halal Caterer für Firmenfeiern, Hochzeiten und private Events. Jetzt Angebote vergleichen und unverbindlich anfragen.",
      },
      { property: "og:url", content: "https://speisely.de/catering/halal" },
      { property: "og:type", content: "website" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/catering/halal" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Halal Catering Service",
          serviceType: "Catering",
          provider: {
            "@type": "Organization",
            name: "Speisely",
            url: "https://speisely.de",
          },
          areaServed: {
            "@type": "Country",
            name: "Germany",
          },
          description:
            "Zertifiziertes Halal Catering für Firmenfeiern, Hochzeiten und Events in Berlin, München, Frankfurt und ganz Deutschland.",
        }),
      },
    ],
  }),
  component: HalalCateringPage,
});

function HalalCateringPage() {
  const { lang } = useI18n();
  const [b2bOpen, setB2bOpen] = useState(false);
  const isDe = lang === "de";

  const formats = [
    {
      icon: Heart,
      titleDe: "Halal Hochzeiten & Verlobungen",
      titleEn: "Halal Weddings & Engagements",
      descDe:
        "Reichhaltige Festbuffets, orientalische Meze-Tafeln, saftige Grillspieße und traditionelle Dessert-Spezialitäten (wie frische Baklava) für unvergessliche Hochzeitsfeste.",
      descEn:
        "Lavish festive buffets, mezze spreads, succulent charcoal skewers, and traditional dessert highlights for unforgettable wedding celebrations.",
    },
    {
      icon: Users,
      titleDe: "Firmenfeiern & Team-Events",
      titleEn: "Corporate Events & Team Days",
      descDe:
        "Inklusive Speisekonzepte für moderne Unternehmen. Zertifiziertes Halal-Fleisch, vegetarische und vegane Optionen – damit alle Mitarbeiter gemeinsam genießen.",
      descEn:
        "Inclusive dining for forward-thinking companies. Certified Halal meats with vegetarian and vegan pairings so everyone dines together.",
    },
    {
      icon: Flame,
      titleDe: "Live BBQ & Holzkohlegrill",
      titleEn: "Live BBQ & Charcoal Grilling",
      descDe:
        "Zischende Grillstationen mit marinierten Lammkoteletts, Adana-Kebabs, Rindermedaillons und Hähnchenspießen, frisch vor den Gästen zubereitet.",
      descEn:
        "Sizzling live grill stations featuring marinated lamb cutlets, kebabs, beef medallions, and chicken skewers cooked fresh on-site.",
    },
    {
      icon: Calendar,
      titleDe: "Iftar & Ramadan Firmenempfänge",
      titleEn: "Iftar & Ramadan Corporate Events",
      descDe:
        "Pünktliche Abendverpflegung für Iftar-Empfänge mit Datteln, wärmenden Suppen, Schmorgerichten und erfrischenden Getränken für Unternehmen und Gemeinden.",
      descEn:
        "Punctual sunset dining for corporate Iftar gatherings featuring dates, warm soups, slow-braised mains, and refreshing specialty drinks.",
    },
    {
      icon: Sparkles,
      titleDe: "Fingerfood & Flying Buffet",
      titleEn: "Halal Finger Food & Canapés",
      descDe:
        "Handliche Gourmet-Häppchen, Mini-Brioche-Burger mit Halal-Beef, marinierte Mini-Spieße und feine Teigtaschen für unkomplizierte Stehempfänge.",
      descEn:
        "Handheld gourmet bites, mini beef sliders, marinated skewers, and delicate pastries tailored for stand-up receptions and conferences.",
    },
    {
      icon: ShieldCheck,
      titleDe: "100% Zertifizierte Herkunft",
      titleEn: "100% Certified Sourcing",
      descDe:
        "Strenge Qualitätskriterien: Unsere geprüften Halal-Partner garantieren lückenlose Zertifikate, getrennte Küchenabläufe und allerhöchste Frische.",
      descEn:
        "Strict quality standards: Verified Halal partners guarantee full certification, separate preparation workflows, and prime freshness.",
    },
  ];

  return (
    <SiteShell>
      <PageHero
        eyebrow={isDe ? "ZERTIFIZIERTES HALAL CATERING" : "CERTIFIED HALAL CATERING"}
        heading={
          isDe ? (
            <>
              100% Halal Catering für Events,{" "}
              <span className="text-[#f2d896]">Firmenfeiern &amp; Hochzeiten.</span>
            </>
          ) : (
            <>
              100% Certified Halal Catering for{" "}
              <span className="text-[#f2d896]">Events, Galas &amp; Weddings.</span>
            </>
          )
        }
        subtext={
          isDe
            ? "Von saftigen Holzkohlegrill-Spezialitäten und orientalischen Buffets bis hin zu modernem Business-Fingerfood: Entdecke geprüfte Halal-Caterer in Berlin, Frankfurt, München, Köln und ganz Deutschland."
            : "From succulent charcoal BBQ and authentic mezze buffets to modern corporate finger food: Connect with vetted Halal caterers across Berlin, Frankfurt, Munich, Cologne, and all of Germany."
        }
        primaryCta={{
          label: isDe ? "Halal Caterer finden" : "Discover Halal Caterers",
          href: "/catering",
        }}
        secondaryCta={{
          label: isDe ? "Event-Anfrage starten" : "Start Catering Request",
          onClick: () => setB2bOpen(true),
        }}
        imageUrl="/images/event_catering_hero.webp"
        imageAlt="Halal Catering Event Tablescape and Feast"
      />

      {/* Trust & Guarantee Bar */}
      <section className="bg-forest text-cream py-6 border-b border-forest/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-sans">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Zertifiziertes Halal-Fleisch" : "Certified Halal Sourcing"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Geprüfte Küchen & Caterer" : "Vetted Kitchens & Partners"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Maßgeschneiderte Menüs" : "Custom Tailored Menus"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#E6B84A] fill-[#E6B84A]" />
            <span>{isDe ? "Transparente Festpreise" : "Transparent Fixed Pricing"}</span>
          </div>
        </div>
      </section>

      {/* Halal Formats Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            {isDe ? "KULINARISCHE VIELFALT" : "CULINARY DIVERSITY"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {isDe
              ? "Halal Catering nach deinen Vorstellungen"
              : "Halal Catering Tailored to Your Vision"}
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed">
            {isDe
              ? "Ob Firmenjubiläum, traditionelle Verlobung oder lockeres Get-Together: Unsere Partner stimmen jedes Menü individuell auf deine Gästezahl und dein Budget ab."
              : "Whether a milestone company gala, traditional engagement, or casual gathering: Our partners configure every menu to match your guest count and budget."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((fmt, i) => {
            const Icon = fmt.icon;
            return (
              <div
                key={i}
                className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left hover:border-[#E6B84A] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                    <Icon className="h-6 w-6 text-forest" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-forest">
                    {isDe ? fmt.titleDe : fmt.titleEn}
                  </h3>
                  <p className="text-sm text-forest/75 leading-relaxed">
                    {isDe ? fmt.descDe : fmt.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Halal Partner Spotlight Strip */}
      <section className="bg-cream/20 py-16 border-b border-[#eadfce]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                {isDe ? "GEPRÜFTE PARTNER" : "VERIFIED PARTNERS"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest mt-1">
                {isDe ? "Bekannt aus dem Speisely Magazin" : "Featured in Speisely Magazine"}
              </h2>
            </div>
            <Link
              to="/catering"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-forest hover:text-[#E6B84A] transition"
            >
              <span>{isDe ? "Alle Caterer anzeigen" : "View all caterers"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/magazin/community/bebeq-restaurant-berlin"
              className="group bg-white rounded-2xl p-4 border border-forest/10 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src="/magazin/bebeq-berlin/bebeq_steak_slate.webp?v=4"
                  alt="BebeQ Berlin Halal Steaks & Grill"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
              <h4 className="font-serif font-bold text-forest group-hover:text-[#E6B84A] transition">
                BebeQ Restaurant Berlin
              </h4>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Holzkohlegrill-Steaks, Spieße & fangfrischer Fisch an der Spree"
                  : "Charcoal steaks, skewers & fresh seafood by the Spree"}
              </p>
            </Link>

            <Link
              to="/magazin/community/baba-pirzola-berlin"
              className="group bg-white rounded-2xl p-4 border border-forest/10 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src="/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.webp"
                  alt="Baba Pirzola Meze & Grill"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
              <h4 className="font-serif font-bold text-forest group-hover:text-[#E6B84A] transition">
                Baba Pirzola Berlin
              </h4>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Anatolische Grillkultur, Lammkoteletts & kalte Meze am Wittenbergplatz"
                  : "Anatolian charcoal grill, lamb chops & mezze near Wittenbergplatz"}
              </p>
            </Link>

            <Link
              to="/magazin/community/seydioglu-baklava-burger"
              className="group bg-white rounded-2xl p-4 border border-forest/10 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=3"
                  alt="Seydioğlu Baklava Desserts"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
              <h4 className="font-serif font-bold text-forest group-hover:text-[#E6B84A] transition">
                Seydioğlu Baklava
              </h4>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Traditionelle Antep-Konditorkunst & Dessert-Buffets im Rhein-Main"
                  : "Authentic Antep pastry craft & dessert buffets in Rhine-Main"}
              </p>
            </Link>

            <Link
              to="/magazin/community/partyservice-kuepper-nrw"
              className="group bg-white rounded-2xl p-4 border border-forest/10 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src="/magazin/partyservice-kuepper/kuepper_bbq_grill_platter.webp?v=1"
                  alt="Partyservice Küpper BBQ Catering"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
              <h4 className="font-serif font-bold text-forest group-hover:text-[#E6B84A] transition">
                Partyservice Küpper
              </h4>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Zischendes BBQ & Buffet-Catering für Großevents in ganz NRW"
                  : "Sizzling live BBQ & buffet catering across North Rhine-Westphalia"}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Mid-Page Call-To-Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="rounded-[2.5rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] items-center gap-12 relative overflow-hidden shadow-xl border border-forest/10">
          <div className="relative z-10 space-y-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
              {isDe ? "TRANSPARENT & GEPRÜFT" : "TRANSPARENT & CERTIFIED"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
              {isDe
                ? "Halal Catering einfach online konfigurieren"
                : "Configure Halal Catering Online with Ease"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {isDe
                ? "Keine versteckten Vermittlungsgebühren. Sag uns einfach Datum, Gästeanzahl und Anlass – wir stellen dir die besten geprüften Angebote zusammen."
                : "Zero hidden intermediary fees. Simply share your event date, headcount, and vision – we assemble verified proposals tailored to your budget."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setB2bOpen(true)}
                className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {isDe ? "Unverbindlich anfragen" : "Request Free Quote"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/catering"
                className="rounded-full border border-cream/20 bg-transparent hover:bg-cream/10 px-6 py-3.5 text-sm font-semibold text-cream transition"
              >
                {isDe ? "Alle Caterer vergleichen" : "Compare All Caterers"}
              </Link>
            </div>
          </div>
          <div className="relative z-10 w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
            <img
              src="/images/business_lunch_plating.webp"
              alt="Halal Catering Buffet Plating"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Reusable B2B Dialog */}
      <B2bCateringDialog open={b2bOpen} onOpenChange={setB2bOpen} />
    </SiteShell>
  );
}
