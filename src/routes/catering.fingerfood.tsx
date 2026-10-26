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
  Coffee,
  Briefcase,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/catering/fingerfood")({
  head: () => ({
    meta: [
      { title: "Fingerfood Catering & Flying Buffet — Speisely" },
      {
        name: "description",
        content:
          "Exklusives Fingerfood Catering & Flying Buffets für Firmenfeiern, Messen & Empfänge: Canapés, Mini-Burger & Spieße frisch geliefert in ganz DE.",
      },
      {
        name: "keywords",
        content:
          "Fingerfood Catering Berlin, Flying Buffet Firmenfeier, Fingerfood München, Canapes Catering Frankfurt, Business Lunch Fingerfood, Messe Catering Fingerfood, Fingerfood Hamburg",
      },
      { property: "og:title", content: "Fingerfood Catering & Flying Buffet — Speisely" },
      {
        property: "og:description",
        content:
          "Handliches Gourmet-Fingerfood & Flying Buffets für Messen, Meetings und Empfänge. Unverbindlich vergleichen & konfigurieren.",
      },
      { property: "og:url", content: "https://speisely.de/catering/fingerfood" },
      { property: "og:type", content: "website" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/catering/fingerfood" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Fingerfood & Flying Buffet Catering",
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
            "Exklusives Fingerfood Catering und Flying Buffets für Firmenfeiern, Konferenzen und Empfänge in Berlin, München, Frankfurt und ganz Deutschland.",
        }),
      },
    ],
  }),
  component: FingerfoodCateringPage,
});

function FingerfoodCateringPage() {
  const { lang } = useI18n();
  const [b2bOpen, setB2bOpen] = useState(false);
  const isDe = lang === "de";

  const formats = [
    {
      icon: Briefcase,
      titleDe: "Business Meetings & Office Fingerfood",
      titleEn: "Business Meetings & Office Bites",
      descDe:
        "Perfekt für Konferenzen und Kundenmeetings: Sauberes, handliches Fingerfood ohne Besteck. Canapés, Wraps und Mini-Quiches, die konzentriertes Arbeiten ermöglichen.",
      descEn:
        "Clean, fork-free bites designed for boardrooms and conferences. Canapés, wraps, and mini quiches that keep meetings productive.",
    },
    {
      icon: Sparkles,
      titleDe: "Flying Buffet für Empfänge",
      titleEn: "Flying Buffet for Receptions",
      descDe:
        "Elegante Häppchen auf Designer-Schiefer oder Silbertabletts, von aufmerksamem Servicepersonal direkt unter den Gästen serviert. Ideal für Stehempfänge und Galas.",
      descEn:
        "Refined portions served continuously by attentive waitstaff among mingling guests on slate tiles or silver trays. Ideal for receptions and galas.",
    },
    {
      icon: Users,
      titleDe: "Messe- & Event-Catering",
      titleEn: "Trade Fair & Exhibition Catering",
      descDe:
        "Pünktliche Standverpflegung für Fachmessen in Berlin, Frankfurt, Köln, Düsseldorf und München. Frische Snack-Platten, Energy-Bowls und Kaffeeservice.",
      descEn:
        "Punctual booth catering for major trade expos in Berlin, Frankfurt, Cologne, and Munich. Fresh platters, energy bowls, and artisan coffee.",
    },
    {
      icon: UtensilsCrossed,
      titleDe: "Mini-Burger & Gourmet Sliders",
      titleEn: "Gourmet Sliders & Mini Skewers",
      descDe:
        "Saftige Mini-Brioche-Burger (Rind, Pulled Chicken oder vegan), aromatische Saté-Spieße und knusprige Falafel-Bällchen mit hausgemachten Dips.",
      descEn:
        "Savory mini brioche sliders (beef, pulled chicken, or vegan), aromatic chicken satay skewers, and crispy falafel bites with homemade dips.",
    },
    {
      icon: Coffee,
      titleDe: "Süßes Fingerfood & Pasticceria",
      titleEn: "Sweet Canapés & Dessert Bites",
      descDe:
        "Mini-Törtchen, Pistazien-Eclairs, Macarons, feine Baklava-Häppchen und Fruchtspieße als stilvoller Abschluss oder Begleitung zum Nachmittagskaffee.",
      descEn:
        "Mini tartlets, pistachio éclairs, macarons, delicate baklava bites, and fresh fruit skewers as a refined finish or coffee accompaniment.",
    },
    {
      icon: ShieldCheck,
      titleDe: "Vielfalt für alle Ernährungsformen",
      titleEn: "Inclusive Dietary Diversity",
      descDe:
        "Klar deklarierte Platten für vegetarische, vegane, glutenfreie und Halal-Ernährung. Garantiert volle Zufriedenheit für jedes Teammitglied.",
      descEn:
        "Clearly labeled platters for vegetarian, vegan, gluten-free, and Halal diets to ensure complete satisfaction for every guest.",
    },
  ];

  return (
    <SiteShell>
      <PageHero
        eyebrow={isDe ? "FINGERFOOD & FLYING BUFFET CATERING" : "FINGER FOOD & FLYING BUFFET CATERING"}
        heading={
          isDe ? (
            <>
              Exklusives Fingerfood Catering für{" "}
              <span className="text-[#f2d896]">Firmenfeiern, Messen &amp; Events.</span>
            </>
          ) : (
            <>
              Premium Finger Food Catering for{" "}
              <span className="text-[#f2d896]">Corporate Galas, Expos &amp; Receptions.</span>
            </>
          )
        }
        subtext={
          isDe
            ? "Handliche Canapés, Mini-Burger, Gourmet-Spieße und süße Petit Fours: Entdecke geprüfte Fingerfood-Caterer für Meetings, Stehempfänge und Kongresse in ganz Deutschland."
            : "Handheld canapés, mini sliders, artisan skewers, and delicate petit fours: Connect with vetted finger food caterers for meetings, standing receptions, and summits across Germany."
        }
        primaryCta={{
          label: isDe ? "Fingerfood Caterer finden" : "Discover Finger Food Caterers",
          href: "/catering",
        }}
        secondaryCta={{
          label: isDe ? "Unverbindlich anfragen" : "Request Custom Quote",
          onClick: () => setB2bOpen(true),
        }}
        imageUrl="/images/office_catering_hero.webp"
        imageAlt="Fingerfood and Flying Buffet Platter"
      />

      {/* Trust & Guarantee Bar */}
      <section className="bg-forest text-cream py-6 border-b border-forest/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Gabel- & Besteckfrei genießbar" : "Fork-Free & Easy to Handle"}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Frischegarantie am Eventtag" : "Fresh on Event Day"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#E6B84A]" />
            <span>{isDe ? "Vegan, Veggie & Halal Optionen" : "Vegan, Veggie & Halal Options"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#E6B84A] fill-[#E6B84A]" />
            <span>{isDe ? "Individuelle Stückzahl-Planung" : "Exact Portion Calculation"}</span>
          </div>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            {isDe ? "FLEXIBLE FORMATE" : "FLEXIBLE FORMATS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {isDe
              ? "Fingerfood-Konzepte für jede Gelegenheit"
              : "Finger Food Concepts for Every Occasion"}
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed">
            {isDe
              ? "Vom lockeren Get-Together bis zum VIP-Empfang: Unsere Partner erstellen transparente Angebote, passgenau abgestimmt auf die Dauer deines Events und dein Budget."
              : "From casual team mixers to VIP product launches: Our catering partners craft transparent proposals tailored to your timeline and budget."}
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

      {/* Mid-Page Call-To-Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="rounded-[2.5rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] items-center gap-12 relative overflow-hidden shadow-xl border border-forest/10">
          <div className="relative z-10 space-y-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
              {isDe ? "FLEXIBEL & TRANSPARENT" : "FLEXIBLE & TRANSPARENT"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
              {isDe
                ? "Fingerfood Catering unverbindlich anfragen"
                : "Request Finger Food Catering with Zero Obligation"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {isDe
                ? "Teile uns einfach Gästezahl, Ort und Datum mit. Wir ermitteln die optimale Häppchen-Menge pro Person und senden dir maßgeschneiderte Menü-Optionen."
                : "Simply share your headcount, city, and event date. We calculate the ideal portions per guest and provide custom menu proposals tailored to your occasion."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setB2bOpen(true)}
                className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {isDe ? "Jetzt Angebot anfordern" : "Request Proposals Now"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/catering"
                className="rounded-full border border-cream/20 bg-transparent hover:bg-cream/10 px-6 py-3.5 text-sm font-semibold text-cream transition"
              >
                {isDe ? "Caterer-Katalog ansehen" : "Explore Caterer Catalog"}
              </Link>
            </div>
          </div>
          <div className="relative z-10 w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
            <img
              src="/images/business_lunch_plating.webp"
              alt="Artisan Fingerfood Plating"
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
