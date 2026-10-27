import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Calculator,
  Users,
  Clock,
  Utensils,
  Wine,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Printer,
  Send,
  HelpCircle,
  Building,
  Heart,
  PartyPopper,
  Briefcase,
  Flame,
  ShieldCheck,
  Info,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/i18n/I18nProvider";
import { Slider } from "@/components/ui/slider";
import { submitLeadCapture } from "@/lib/api/leads.functions";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/catering/rechner")({
  head: () => ({
    meta: [
      { title: "Catering Kosten & Mengen Rechner | Speisely" },
      {
        name: "description",
        content:
          "Catering-Kosten & Mengen pro Person berechnen: Buffet, Fingerfood, Getränke & Personal für Hochzeit, Firmenfeier & Event präzise kalkulieren.",
      },
      { property: "og:title", content: "Catering Kosten & Mengen Rechner | Speisely" },
      {
        property: "og:description",
        content:
          "Kostenloser Mengenplaner & Budget-Kalkulator für Events, Buffets, Hochzeiten und Firmenfeiern. Speisen, Getränke und Personal sofort berechnen.",
      },
      { property: "og:url", content: "https://speisely.de/catering/rechner" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/catering/rechner" }],
  }),
  component: CateringRechnerPage,
});

type EventType = "corporate" | "wedding" | "private" | "business_lunch" | "summer_bbq";
type CateringFormat = "fingerfood" | "buffet" | "bbq" | "menu";
type DrinkPackage = "none" | "soft" | "standard" | "premium";
type PriceTier = "budget" | "standard" | "premium";

interface PriceTierOption {
  id: PriceTier;
  labelDe: string;
  labelEn: string;
  badgeDe: string;
  badgeEn: string;
  multiplier: number;
}

const PRICE_TIERS: PriceTierOption[] = [
  {
    id: "budget",
    labelDe: "Solide & Fair",
    labelEn: "Value & Budget",
    badgeDe: "Günstig (~ -15%)",
    badgeEn: "Budget (~ -15%)",
    multiplier: 0.85,
  },
  {
    id: "standard",
    labelDe: "Klassik Handwerk",
    labelEn: "Standard Craft",
    badgeDe: "Branchenschnitt (Ø)",
    badgeEn: "Benchmark (Ø)",
    multiplier: 1.0,
  },
  {
    id: "premium",
    labelDe: "Gourmet & Bio",
    labelEn: "Gourmet & Organic",
    badgeDe: "Exklusiv (~ +30%)",
    badgeEn: "Premium (~ +30%)",
    multiplier: 1.3,
  },
];

interface EventTypeOption {
  id: EventType;
  titleDe: string;
  titleEn: string;
  icon: typeof Building;
  descDe: string;
  descEn: string;
}

const EVENT_TYPES: EventTypeOption[] = [
  {
    id: "corporate",
    titleDe: "Firmenfeier & Event",
    titleEn: "Corporate Event",
    icon: Building,
    descDe: "Sommerfest, Jubiläum oder Kick-off",
    descEn: "Summer party, anniversary or kick-off",
  },
  {
    id: "wedding",
    titleDe: "Hochzeit & Gala",
    titleEn: "Wedding & Gala",
    icon: Heart,
    descDe: "Festlich, elegant mit hoher Verweildauer",
    descEn: "Festive, elegant with long duration",
  },
  {
    id: "private",
    titleDe: "Geburtstag & Privat",
    titleEn: "Birthday & Party",
    icon: PartyPopper,
    descDe: "Gesellige Feier im lockeren Rahmen",
    descEn: "Casual get-together with family and friends",
  },
  {
    id: "business_lunch",
    titleDe: "Business Lunch / Tagung",
    titleEn: "Business Lunch / Seminar",
    icon: Briefcase,
    descDe: "Fokus auf Energie, leicht bekömmlich",
    descEn: "Focus on vitality, light and nutritious",
  },
  {
    id: "summer_bbq",
    titleDe: "Live Cooking & BBQ",
    titleEn: "Live Cooking & BBQ",
    icon: Flame,
    descDe: "Grillstation mit Koch vor Ort",
    descEn: "Live grilling station with on-site chef",
  },
];

interface FormatOption {
  id: CateringFormat;
  titleDe: string;
  titleEn: string;
  gramsPerPerson: number;
  priceMin: number;
  priceMax: number;
  descDe: string;
  descEn: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: "fingerfood",
    titleDe: "Fingerfood & Flying Buffet",
    titleEn: "Finger Food & Flying Buffet",
    gramsPerPerson: 420,
    priceMin: 22,
    priceMax: 34,
    descDe: "8–10 mundgerechte Happen p.P. Ideal für Empfänge und Networking ohne festes Besteck.",
    descEn: "8–10 bite-sized bites p.p. Ideal for receptions and networking.",
  },
  {
    id: "buffet",
    titleDe: "Warmes & Kaltes Buffet",
    titleEn: "Warm & Cold Buffet",
    gramsPerPerson: 680,
    priceMin: 28,
    priceMax: 44,
    descDe:
      "Der beliebte Klassiker: 2–3 Hauptgänge, reichhaltige Beilagen, frische Salate & Desserts.",
    descEn: "The crowd favourite: 2–3 mains, sides, fresh salads & desserts.",
  },
  {
    id: "bbq",
    titleDe: "Live BBQ & Smoker Buffet",
    titleEn: "Live BBQ & Smoker Station",
    gramsPerPerson: 740,
    priceMin: 38,
    priceMax: 56,
    descDe:
      "Grillmeister vor Ort: Steaks, Geflügel, Halloumi, Grillgemüse, Dips und knuspriges Brot.",
    descEn: "Pitmaster on-site: Steaks, poultry, halloumi, roasted vegetables & dips.",
  },
  {
    id: "menu",
    titleDe: "Gesetztes 3–4 Gang Menü",
    titleEn: "Plated 3–4 Course Menu",
    gramsPerPerson: 580,
    priceMin: 48,
    priceMax: 85,
    descDe: "Exklusives Fine Dining: Jeder Gang wird festlich am Tisch serviert.",
    descEn: "Exclusive fine dining: Each course plated and served at the table.",
  },
];

const DRINK_PACKAGES = [
  {
    id: "none" as DrinkPackage,
    titleDe: "Keine Getränke (Nur Speisen)",
    titleEn: "No drinks (Food only)",
    priceMin: 0,
    priceMax: 0,
    descDe: "Sie stellen alle Getränke selbst bereit.",
    descEn: "You provide all drinks yourself.",
  },
  {
    id: "soft" as DrinkPackage,
    titleDe: "Basis Alkoholfrei",
    titleEn: "Soft Drinks & Coffee",
    priceMin: 8,
    priceMax: 12,
    descDe: "Mineralwasser (still/sprudel), Bio-Säfte, Limonaden & frischer Filterkaffee.",
    descEn: "Mineral water (still/sparkling), organic juices, sodas & filter coffee.",
  },
  {
    id: "standard" as DrinkPackage,
    titleDe: "Klassisch (Bier, Wein, Softs)",
    titleEn: "Standard (Beer, Wine, Softs)",
    priceMin: 16,
    priceMax: 24,
    descDe: "Softdrinks, regionales Bier, Rot- & Weißwein sowie Sekt zum Anstoßen.",
    descEn: "Soft drinks, regional beers, red & white wine and bubbly for toasts.",
  },
  {
    id: "premium" as DrinkPackage,
    titleDe: "Premium All-Inclusive (inkl. Longdrinks)",
    titleEn: "Premium All-Inclusive (Open Bar)",
    priceMin: 28,
    priceMax: 42,
    descDe:
      "Volle Bar-Pauschale inkl. Prosecco/Champagner, Signature Drinks & Barkeeper-Equipment.",
    descEn: "Full bar package including prosecco/champagne, signature drinks & bartender gear.",
  },
];

function CateringRechnerPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  // Calculator State
  const [guests, setGuests] = useState<number>(45);
  const [eventType, setEventType] = useState<EventType>("corporate");
  const [format, setFormat] = useState<CateringFormat>("buffet");
  const [durationHours, setDurationHours] = useState<number>(5);
  const [veggiePercent, setVeggiePercent] = useState<number>(35);
  const [drinkPackage, setDrinkPackage] = useState<DrinkPackage>("standard");
  const [priceTier, setPriceTier] = useState<PriceTier>("standard");
  const [needTableware, setNeedTableware] = useState<boolean>(true);
  const [needStaff, setNeedStaff] = useState<boolean>(true);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCity, setInquiryCity] = useState("Köln");
  const [inquiryDate, setInquiryDate] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLead = useServerFn(submitLeadCapture);

  // Active format and drink configurations
  const activeFormat = useMemo(
    () => FORMAT_OPTIONS.find((f) => f.id === format) ?? FORMAT_OPTIONS[1],
    [format],
  );
  const activeDrink = useMemo(
    () => DRINK_PACKAGES.find((d) => d.id === drinkPackage) ?? DRINK_PACKAGES[2],
    [drinkPackage],
  );

  // Calculation Math
  const calculations = useMemo(() => {
    // 1. Food Quantities
    const totalFoodGramsPerPerson = activeFormat.gramsPerPerson;
    const totalFoodKg = Number(((totalFoodGramsPerPerson * guests) / 1000).toFixed(1));

    // Distribution
    const meatGramsRatio = (100 - veggiePercent) / 100;
    const veggieGramsRatio = veggiePercent / 100;

    let mainDishKg = 0;
    let sidesKg = 0;
    let saladKg = 0;
    let dessertKg = 0;
    let breadKg = 0;

    if (format === "fingerfood") {
      mainDishKg = Number((totalFoodKg * 0.45).toFixed(1));
      sidesKg = Number((totalFoodKg * 0.25).toFixed(1));
      saladKg = Number((totalFoodKg * 0.15).toFixed(1));
      dessertKg = Number((totalFoodKg * 0.15).toFixed(1));
    } else if (format === "bbq") {
      mainDishKg = Number((totalFoodKg * 0.42).toFixed(1));
      sidesKg = Number((totalFoodKg * 0.28).toFixed(1));
      saladKg = Number((totalFoodKg * 0.18).toFixed(1));
      dessertKg = Number((totalFoodKg * 0.12).toFixed(1));
    } else {
      // standard buffet & menu
      mainDishKg = Number((totalFoodKg * 0.38).toFixed(1));
      sidesKg = Number((totalFoodKg * 0.3).toFixed(1));
      saladKg = Number((totalFoodKg * 0.18).toFixed(1));
      dessertKg = Number((totalFoodKg * 0.14).toFixed(1));
    }
    breadKg = Number(((guests * 45) / 1000).toFixed(1));

    const meatKg = Number((mainDishKg * meatGramsRatio).toFixed(1));
    const vegKg = Number((mainDishKg * veggieGramsRatio).toFixed(1));

    // 2. Drinks Quantities
    // Rule: First hour 0.5L, each additional hour 0.25L
    const litersPerPerson = 0.5 + Math.max(0, durationHours - 1) * 0.25;
    const totalLitersAll = Number((litersPerPerson * guests).toFixed(0));

    // Breakdown for standard/premium
    let waterLiters = 0;
    let softLiters = 0;
    let beerLiters = 0;
    let wineBottles = 0;
    let coffeeCups = 0;

    if (drinkPackage === "none") {
      waterLiters = 0;
      softLiters = 0;
      beerLiters = 0;
      wineBottles = 0;
      coffeeCups = 0;
    } else if (drinkPackage === "soft") {
      waterLiters = Math.ceil(totalLitersAll * 0.6);
      softLiters = Math.ceil(totalLitersAll * 0.4);
      coffeeCups = Math.ceil(guests * 1.5);
    } else {
      // Standard or Premium
      waterLiters = Math.ceil(totalLitersAll * 0.35);
      softLiters = Math.ceil(totalLitersAll * 0.2);
      beerLiters = Math.ceil(totalLitersAll * 0.25);
      // Wine: ~0.4 to 0.5 bottle (0.75L) per person
      wineBottles = Math.ceil(guests * (drinkPackage === "premium" ? 0.55 : 0.45));
      coffeeCups = Math.ceil(guests * 1.2);
    }

    const beerCrates = Math.ceil(beerLiters / 10); // crate ~10L (20x0.5L or 24x0.33L)

    // 3. Staff & Equipment
    // Buffet: 1 server per 30 guests; Plated Menu: 1 per 18 guests
    const staffRatio = format === "menu" ? 18 : 30;
    const staffCount = needStaff ? Math.max(1, Math.ceil(guests / staffRatio)) : 0;
    const staffCostPerHour = 36;
    const totalStaffCost = staffCount * staffCostPerHour * (durationHours + 2); // +2h for prep/cleanup

    // Tableware cost p.p.
    const tablewareCostPerGuest = needTableware ? 5.5 : 0;
    const totalTablewareCost = guests * tablewareCostPerGuest;

    // 4. Budget Totals (Factoring individual caterer pricing tiers)
    const tierMultiplier = PRICE_TIERS.find((t) => t.id === priceTier)?.multiplier ?? 1.0;

    const foodMin = Math.round(guests * activeFormat.priceMin * tierMultiplier);
    const foodMax = Math.round(guests * activeFormat.priceMax * tierMultiplier);

    const drinkMin = Math.round(
      guests * activeDrink.priceMin * (drinkPackage === "none" ? 1 : tierMultiplier),
    );
    const drinkMax = Math.round(
      guests * activeDrink.priceMax * (drinkPackage === "none" ? 1 : tierMultiplier),
    );

    const totalMin = Math.round(foodMin + drinkMin + totalTablewareCost + totalStaffCost);
    const totalMax = Math.round(foodMax + drinkMax + totalTablewareCost + totalStaffCost);

    const perPersonMin = Math.round(totalMin / guests);
    const perPersonMax = Math.round(totalMax / guests);

    return {
      totalFoodKg,
      meatKg,
      vegKg,
      sidesKg,
      saladKg,
      dessertKg,
      breadKg,
      totalLitersAll,
      waterLiters,
      softLiters,
      beerLiters,
      beerCrates,
      wineBottles,
      coffeeCups,
      staffCount,
      totalStaffCost,
      totalTablewareCost,
      foodMin,
      foodMax,
      drinkMin,
      drinkMax,
      totalMin,
      totalMax,
      perPersonMin,
      perPersonMax,
    };
  }, [
    guests,
    format,
    durationHours,
    veggiePercent,
    drinkPackage,
    priceTier,
    needTableware,
    needStaff,
    activeFormat,
    activeDrink,
  ]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError("");

    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryDate) {
      setInquiryError(
        isDe
          ? "Bitte füllen Sie Name, E-Mail und Wunschdatum aus."
          : "Please complete name, email and event date.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const notes = [
        `Catering-Kalkulator Anfrage:`,
        `- Anlass: ${eventType}`,
        `- Gäste: ${guests} Personen`,
        `- Preissegment (Orientierung): ${priceTier}`,
        `- Format: ${activeFormat.titleDe}`,
        `- Dauer: ${durationHours} Stunden`,
        `- Vegetarisch: ${veggiePercent}%`,
        `- Getränkepaket: ${activeDrink.titleDe}`,
        `- Geschirr gewünscht: ${needTableware ? "Ja" : "Nein"}`,
        `- Personal gewünscht: ${needStaff ? "Ja" : "Nein"}`,
        `- Errechnetes Budget: ca. € ${calculations.totalMin.toLocaleString("de-DE")} – € ${calculations.totalMax.toLocaleString("de-DE")} (€ ${calculations.perPersonMin} – € ${calculations.perPersonMax} p.P.)`,
        `- Errechnete Speisemenge: ca. ${calculations.totalFoodKg} kg`,
      ].join("\n");

      await submitLead({
        data: {
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone || undefined,
          city: inquiryCity,
          eventType,
          eventDate: inquiryDate,
          guestCount: guests,
          budgetRange: `€ ${calculations.totalMin} - € ${calculations.totalMax}`,
          notes,
          sourceRoute: "/catering/rechner",
          sourceChannel: "catering_calculator",
        },
      });

      trackEvent("catering_calculator_lead_submitted", {
        guests,
        eventType,
        format,
        budgetMin: calculations.totalMin,
        budgetMax: calculations.totalMax,
      });

      setInquirySubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fehler beim Absenden";
      setInquiryError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5]">
        <PageHero
          eyebrow={isDe ? "EVENT-KALKULATION & MENGENPLANER" : "EVENT COST & PORTION CALCULATOR"}
          heading={
            isDe ? (
              <>
                Catering Kosten &amp; Mengen
                <br />
                <span className="text-[#f2d896]">präzise für Ihr Event kalkulieren.</span>
              </>
            ) : (
              <>
                Calculate Catering Costs &amp; Portions
                <br />
                <span className="text-[#f2d896]">precisely for your event.</span>
              </>
            )
          }
          subtext={
            isDe
              ? "Ermitteln Sie Speisemengen (in kg), Getränkebedarf (Liter & Flaschen), Servicepersonal und realistische Budgetrahmen pro Gast für Hochzeit, Firmenfeier oder Jubiläum."
              : "Calculate food portions (in kg), drink quantities (litres & bottles), staff and realistic budget brackets per guest for weddings, corporate events or parties."
          }
          primaryCta={{
            label: isDe ? "Zum Rechner scrollen" : "Go to Calculator",
            href: "#rechner",
          }}
          secondaryCta={{
            label: isDe ? "Caterer direkt anfragen" : "Direct Caterer Inquiry",
            href: "#angebot",
          }}
          imageUrl="/images/event_catering_hero.webp"
          imageAlt="Festlich arrangiertes Catering Buffet mit feinstem Food Plating"
        />

        {/* Main Content Container */}
        <main id="rechner" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* USPs Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="surface-card p-4 rounded-2xl border border-[#eadfce]/60 flex items-center space-x-3">
              <Calculator className="h-5 w-5 text-forest shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-forest">
                  {isDe ? "Echtzeit-Berechnung" : "Real-time Math"}
                </p>
                <p className="text-forest/70">
                  {isDe ? "DEHOGA-Richtwerte 2026" : "Industry Standards"}
                </p>
              </div>
            </div>
            <div className="surface-card p-4 rounded-2xl border border-[#eadfce]/60 flex items-center space-x-3">
              <Utensils className="h-5 w-5 text-forest shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-forest">
                  {isDe ? "Exakte Mengenangaben" : "Precise Portions"}
                </p>
                <p className="text-forest/70">
                  {isDe ? "Speisen in kg & Gängen" : "Food in kg & courses"}
                </p>
              </div>
            </div>
            <div className="surface-card p-4 rounded-2xl border border-[#eadfce]/60 flex items-center space-x-3">
              <Wine className="h-5 w-5 text-forest shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-forest">
                  {isDe ? "Getränke-Planer" : "Beverage Planner"}
                </p>
                <p className="text-forest/70">
                  {isDe ? "Wasser, Bier, Wein & Bar" : "Water, beer, wine & bar"}
                </p>
              </div>
            </div>
            <div className="surface-card p-4 rounded-2xl border border-[#eadfce]/60 flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-forest shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-forest">{isDe ? "100% Unverbindlich" : "100% Free"}</p>
                <p className="text-forest/70">
                  {isDe ? "Transparente Kostensicherheit" : "Transparent Budget"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Controls & Configuration (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Anlass & Gästezahl */}
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-[#eadfce]/60 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#eadfce]/40">
                  <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-forest">
                      {isDe ? "Gästeanzahl & Veranstaltungsart" : "Guest Count & Event Type"}
                    </h2>
                    <p className="text-xs text-forest/70">
                      {isDe
                        ? "Basisdaten für die genaue Portions- und Personalkalkulation"
                        : "Core metrics for portions and staffing"}
                    </p>
                  </div>
                </div>

                {/* Event Type Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-forest/80">
                    {isDe ? "Art des Events" : "Event Type"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EVENT_TYPES.map((et) => {
                      const Icon = et.icon;
                      const isSelected = eventType === et.id;
                      return (
                        <button
                          key={et.id}
                          type="button"
                          onClick={() => setEventType(et.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all min-h-[44px] flex flex-col justify-between ${
                            isSelected
                              ? "border-forest bg-forest text-cream shadow-md"
                              : "border-[#eadfce] bg-white text-forest hover:border-forest/50"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 mb-2 ${isSelected ? "text-[#f2d896]" : "text-forest"}`}
                          />
                          <div>
                            <p className="text-xs font-bold leading-tight">
                              {isDe ? et.titleDe : et.titleEn}
                            </p>
                            <p
                              className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? "text-cream/80" : "text-forest/60"}`}
                            >
                              {isDe ? et.descDe : et.descEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest/80 flex items-center space-x-1.5">
                      <Users className="h-4 w-4 text-forest" />
                      <span>{isDe ? "Anzahl der Gäste" : "Number of Guests"}</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={guests}
                        onChange={(e) =>
                          setGuests(Math.max(10, Math.min(500, Number(e.target.value) || 10)))
                        }
                        className="w-20 px-2.5 py-1 text-right text-base font-bold text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                      <span className="text-xs font-semibold text-forest/70">
                        {isDe ? "Personen" : "guests"}
                      </span>
                    </div>
                  </div>

                  <Slider
                    value={[guests]}
                    min={10}
                    max={300}
                    step={5}
                    onValueChange={(val) => setGuests(val[0])}
                    className="py-4"
                  />

                  <div className="flex justify-between text-[11px] text-forest/60 px-1">
                    <span>10 {isDe ? "Gäste" : "guests"}</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150</span>
                    <span>200</span>
                    <span>300+</span>
                  </div>
                </div>

                {/* Event Duration */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest/80 flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-forest" />
                      <span>{isDe ? "Geplante Dauer" : "Planned Duration"}</span>
                    </label>
                    <span className="text-sm font-bold text-forest">
                      {durationHours} {isDe ? "Stunden" : "hours"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { hours: 3, labelDe: "2–3 Std. (Kurz)", labelEn: "2–3 hrs" },
                      { hours: 5, labelDe: "4–6 Std. (Standard)", labelEn: "4–6 hrs" },
                      { hours: 8, labelDe: "7–10 Std. (Open End)", labelEn: "7–10 hrs" },
                    ].map((d) => (
                      <button
                        key={d.hours}
                        type="button"
                        onClick={() => setDurationHours(d.hours)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all min-h-[44px] ${
                          durationHours === d.hours
                            ? "bg-forest text-cream border-forest"
                            : "bg-white text-forest border-[#eadfce] hover:border-forest/40"
                        }`}
                      >
                        {isDe ? d.labelDe : d.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Speise-Format & Ernährung */}
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-[#eadfce]/60 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#eadfce]/40">
                  <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-forest">
                      {isDe ? "Catering-Format & Speisen" : "Catering Format & Menu Style"}
                    </h2>
                    <p className="text-xs text-forest/70">
                      {isDe
                        ? "Wählen Sie Buffet, Fingerfood, BBQ oder gesetztes Menü"
                        : "Choose buffet, finger food, BBQ or seated dinner"}
                    </p>
                  </div>
                </div>

                {/* Format Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FORMAT_OPTIONS.map((f) => {
                    const isSelected = format === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={`p-4 rounded-2xl border text-left transition-all min-h-[44px] flex flex-col justify-between ${
                          isSelected
                            ? "border-forest bg-[#F3EDE2] shadow-sm ring-1 ring-forest"
                            : "border-[#eadfce] bg-white hover:border-forest/40"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-serif font-bold text-sm text-forest">
                              {isDe ? f.titleDe : f.titleEn}
                            </span>
                            <span className="text-xs font-bold text-forest/90 bg-forest/10 px-2 py-0.5 rounded-full">
                              ~{f.gramsPerPerson}g p.P.
                            </span>
                          </div>
                          <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                            {isDe ? f.descDe : f.descEn}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#eadfce]/50 flex justify-between items-center text-xs">
                          <span className="text-forest/60">
                            {isDe ? "Richtwert:" : "Guide price:"}
                          </span>
                          <span className="font-bold text-forest">
                            {f.priceMin} € – {f.priceMax} € p.P.
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Preissegment / Caterer-Niveau */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest/80 flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-forest" />
                      <span>{isDe ? "Preissegment des Caterers" : "Caterer Price Tier"}</span>
                    </label>
                    <span className="text-[11px] font-medium text-forest/65">
                      {isDe
                        ? "Jeder Caterer kalkuliert individuell"
                        : "Every caterer prices individually"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRICE_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setPriceTier(tier.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all min-h-[44px] flex flex-col justify-center ${
                          priceTier === tier.id
                            ? "bg-forest text-cream border-forest shadow-sm"
                            : "bg-white text-forest border-[#eadfce] hover:border-forest/40"
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight">
                          {isDe ? tier.labelDe : tier.labelEn}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            priceTier === tier.id ? "text-[#f2d896]" : "text-forest/60"
                          }`}
                        >
                          {isDe ? tier.badgeDe : tier.badgeEn}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Veggie vs Meat Ratio Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-forest/80">
                      {isDe
                        ? "Ernährungsausrichtung (Fleisch vs. Veggie)"
                        : "Dietary Split (Meat vs. Veggie)"}
                    </label>
                    <span className="text-xs font-bold text-forest">
                      {100 - veggiePercent}% {isDe ? "Fleisch" : "Meat"} / {veggiePercent}%{" "}
                      {isDe ? "Veggie & Vegan" : "Veggie"}
                    </span>
                  </div>

                  <Slider
                    value={[veggiePercent]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(val) => setVeggiePercent(val[0])}
                    className="py-2"
                  />

                  <div className="flex justify-between text-[11px] text-forest/60">
                    <span>100% {isDe ? "Fleisch & Fisch" : "Meat"}</span>
                    <span>50 / 50</span>
                    <span>100% {isDe ? "Rein Vegetarisch / Vegan" : "Pure Veggie / Vegan"}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Getränke & Ausstattung */}
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-[#eadfce]/60 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#eadfce]/40">
                  <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-forest">
                      {isDe ? "Getränkepauschale & Service" : "Beverage Package & Service"}
                    </h2>
                    <p className="text-xs text-forest/70">
                      {isDe
                        ? "Getränkeauswahl, Geschirr-Leihe und Servicepersonal"
                        : "Drinks, tableware hire and service staff"}
                    </p>
                  </div>
                </div>

                {/* Drink Packages */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-forest/80">
                    {isDe ? "Getränkepaket" : "Drink Package"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DRINK_PACKAGES.map((dp) => {
                      const isSelected = drinkPackage === dp.id;
                      return (
                        <button
                          key={dp.id}
                          type="button"
                          onClick={() => setDrinkPackage(dp.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all min-h-[44px] flex flex-col justify-between ${
                            isSelected
                              ? "border-forest bg-[#F3EDE2] shadow-sm ring-1 ring-forest"
                              : "border-[#eadfce] bg-white hover:border-forest/40"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-xs text-forest">
                                {isDe ? dp.titleDe : dp.titleEn}
                              </span>
                              <span className="text-[11px] font-bold text-forest/80">
                                {dp.priceMin === 0 ? "0 €" : `+${dp.priceMin}–${dp.priceMax} €`}
                              </span>
                            </div>
                            <p className="text-[11px] text-forest/70 leading-relaxed">
                              {isDe ? dp.descDe : dp.descEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Equipment & Staff Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-start space-x-3 p-3.5 rounded-2xl border border-[#eadfce] bg-white cursor-pointer hover:border-forest/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={needTableware}
                      onChange={(e) => setNeedTableware(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-forest">
                        {isDe ? "Geschirr, Besteck & Gläser" : "Tableware & Glasses"}
                      </p>
                      <p className="text-forest/65 mt-0.5">
                        {isDe
                          ? "Inklusive Spülservice (~5,50 € p.P.)"
                          : "Includes cleaning service (~€5.50 p.p.)"}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3.5 rounded-2xl border border-[#eadfce] bg-white cursor-pointer hover:border-forest/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={needStaff}
                      onChange={(e) => setNeedStaff(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-forest">
                        {isDe ? "Servicepersonal vor Ort" : "Service Staff On-site"}
                      </p>
                      <p className="text-forest/65 mt-0.5">
                        {isDe
                          ? `Empfehlung: ${calculations.staffCount} Kraft/Kräfte (~36 €/Std.)`
                          : `Recommended: ${calculations.staffCount} staff member(s)`}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Calculation Output Dashboard (5 cols sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {/* Main Result Card */}
              <div className="bg-forest text-cream p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-[#f2d896]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#f2d896]">
                      {isDe ? "ERGEBNIS-PROGNOSE" : "PROJECTED ESTIMATE"}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-cream mt-1">
                      {isDe ? "Kalkulierter Budgetrahmen" : "Calculated Budget Range"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrint}
                    aria-label="Kalkulation drucken"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream transition-colors"
                    title={isDe ? "Kalkulation drucken" : "Print calculation"}
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>

                {/* Big Price Display */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wider text-cream/70 font-medium">
                      {isDe ? `Gesamtkosten für ${guests} Gäste` : `Total for ${guests} guests`}
                    </p>
                    <p className="text-3xl sm:text-4xl font-serif font-bold text-[#f2d896] mt-1">
                      € {calculations.totalMin.toLocaleString("de-DE")} – €{" "}
                      {calculations.totalMax.toLocaleString("de-DE")}
                    </p>
                    <p className="text-xs text-cream/80 mt-1 font-medium">
                      Ø {calculations.perPersonMin} € – {calculations.perPersonMax} €{" "}
                      {isDe ? "pro Person (netto Richtwert)" : "per person"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs text-cream/75">
                    <div>
                      <span>{isDe ? "Speisen:" : "Food:"}</span>{" "}
                      <strong className="text-cream">
                        € {calculations.foodMin}–{calculations.foodMax}
                      </strong>
                    </div>
                    <div>
                      <span>{isDe ? "Getränke:" : "Drinks:"}</span>{" "}
                      <strong className="text-cream">
                        € {calculations.drinkMin}–{calculations.drinkMax}
                      </strong>
                    </div>
                    {needTableware && (
                      <div>
                        <span>{isDe ? "Geschirr:" : "Tableware:"}</span>{" "}
                        <strong className="text-cream">€ {calculations.totalTablewareCost}</strong>
                      </div>
                    )}
                    {needStaff && (
                      <div>
                        <span>{isDe ? "Personal:" : "Staff:"}</span>{" "}
                        <strong className="text-cream">€ {calculations.totalStaffCost}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantities Breakdown Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2d896] flex items-center space-x-1.5">
                    <Utensils className="h-3.5 w-3.5" />
                    <span>{isDe ? "Mengenbedarf Speisen" : "Food Portions Breakdown"}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-cream/60">{isDe ? "Gesamtgewicht" : "Total Weight"}</p>
                      <p className="text-sm font-bold text-cream mt-0.5">
                        {calculations.totalFoodKg} kg
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-cream/60">
                        {isDe ? "Fleisch / Geflügel" : "Meat / Poultry"}
                      </p>
                      <p className="text-sm font-bold text-cream mt-0.5">
                        {calculations.meatKg} kg
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-cream/60">
                        {isDe ? "Veggie & Beilagen" : "Veggie & Sides"}
                      </p>
                      <p className="text-sm font-bold text-cream mt-0.5">
                        {(calculations.vegKg + calculations.sidesKg).toFixed(1)} kg
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-cream/60">
                        {isDe ? "Salate & Desserts" : "Salad & Dessert"}
                      </p>
                      <p className="text-sm font-bold text-cream mt-0.5">
                        {(calculations.saladKg + calculations.dessertKg).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Drinks Quantities */}
                {drinkPackage !== "none" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2d896] flex items-center space-x-1.5">
                      <Wine className="h-3.5 w-3.5" />
                      <span>{isDe ? "Mengenbedarf Getränke" : "Beverage Quantities"}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-cream/60">{isDe ? "Mineralwasser" : "Mineral Water"}</p>
                        <p className="text-sm font-bold text-cream mt-0.5">
                          ca. {calculations.waterLiters} Liter
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-cream/60">
                          {isDe ? "Softdrinks & Säfte" : "Soft Drinks"}
                        </p>
                        <p className="text-sm font-bold text-cream mt-0.5">
                          ca. {calculations.softLiters} Liter
                        </p>
                      </div>
                      {(drinkPackage === "standard" || drinkPackage === "premium") && (
                        <>
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-cream/60">{isDe ? "Bierbedarf" : "Beer Volume"}</p>
                            <p className="text-sm font-bold text-cream mt-0.5">
                              {calculations.beerLiters}L ({calculations.beerCrates}{" "}
                              {isDe ? "Kästen" : "crates"})
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-cream/60">
                              {isDe ? "Wein & Sekt (0,75L)" : "Wine & Bubbly"}
                            </p>
                            <p className="text-sm font-bold text-cream mt-0.5">
                              ca. {calculations.wineBottles} Flaschen
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Transparent Disclaimer Badge */}
                <div className="p-3.5 rounded-2xl bg-white/10 border border-[#f2d896]/30 text-[11px] leading-relaxed text-cream/90 flex items-start space-x-2.5">
                  <Sparkles className="h-4 w-4 text-[#f2d896] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#f2d896] block mb-0.5">
                      {isDe ? "Individuelle Caterer-Kalkulation" : "Custom Caterer Pricing"}
                    </span>
                    {isDe
                      ? "Dieser Rechner ermittelt verlässliche DEHOGA-Branchendurchschnitte. Jeder Caterer kalkuliert nach eigener Menü-Rezeptur, Mindestbestellmenge und regionaler Anfahrt. Die finale Kalkulation erhalten Sie verbindlich im konkreten Angebot."
                      : "This calculator provides trusted industry averages. Every caterer prices according to their own recipes, minimums, and local logistics. Final prices are determined in the caterer's custom quote."}
                  </div>
                </div>

                {/* CTA Jump to Form */}
                <a
                  href="#angebot"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#f2d896] text-forest font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:bg-[#e4c983] transition-all min-h-[44px]"
                >
                  <span>
                    {isDe
                      ? "Catering-Angebote für dieses Event anfragen"
                      : "Request Quotes For This Event"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Informational Hint */}
              <div className="p-4 rounded-2xl border border-[#eadfce]/70 bg-white/70 text-xs text-forest/75 flex items-start space-x-3">
                <Info className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                <p>
                  {isDe
                    ? "Hinweis: Alle Zahlen basieren auf realen Branchendurchschnitten deutscher Qualitäts-Caterer für 2026. Individuelle Wünsche wie Bio-Zertifizierung oder Trüffel-Spezialitäten können variieren."
                    : "Note: All figures represent real 2026 German catering benchmarks. Special organic certificates or premium truffle dishes may adjust totals."}
                </p>
              </div>
            </div>
          </div>

          {/* INQUIRY SECTION (Lead Magnet Conversion) */}
          <section
            id="angebot"
            className="mt-16 sm:mt-24 surface-card p-8 sm:p-12 rounded-3xl border border-[#eadfce]/70 shadow-sm"
          >
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                {isDe ? "DIREKTE VERMITTLUNG" : "DIRECT CATERER MATCH"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
                {isDe
                  ? "Passende Caterer mit diesen Daten unverbindlich anfragen"
                  : "Request Vetted Caterers with These Specs"}
              </h2>
              <p className="text-xs sm:text-sm text-forest/70 leading-relaxed">
                {isDe
                  ? "Wir übermitteln Ihre berechneten Mengenangaben an geprüfte Catering-Partner in Ihrer Region. Sie erhalten innerhalb von 24 Stunden transparente Menüvorschläge."
                  : "We forward your calculated parameters to vetted regional caterers. Receive transparent proposals within 24 hours."}
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="max-w-lg mx-auto mt-8 p-6 rounded-2xl bg-[#E8F3EB] border border-[#2E6B48]/30 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[#2E6B48] mx-auto" />
                <h3 className="text-lg font-serif font-bold text-forest">
                  {isDe
                    ? "Vielen Dank! Ihre Anfrage ist eingegangen."
                    : "Thank You! Your inquiry was sent."}
                </h3>
                <p className="text-xs text-forest/80 leading-relaxed">
                  {isDe
                    ? `Wir haben Ihre Kalkulation für ${guests} Personen in ${inquiryCity} registriert. Unsere geprüften Partner melden sich in Kürze mit konkreten Menüvorschlägen bei Ihnen.`
                    : `We recorded your calculation for ${guests} guests in ${inquiryCity}. Partner caterers will reach out soon.`}
                </p>
                <div className="pt-2">
                  <Link
                    to="/catering"
                    className="inline-flex items-center text-xs font-bold text-forest hover:underline"
                  >
                    <span>
                      {isDe ? "Alle Caterer auf Speisely ansehen" : "Explore all caterers"}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="max-w-2xl mx-auto mt-8 space-y-4">
                {inquiryError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {inquiryError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest">
                      {isDe ? "Ihr Name / Ansprechpartner *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z. B. Julia Schneider"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest">
                      {isDe ? "E-Mail-Adresse *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="julia@firma.de"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest">
                      {isDe ? "Telefonnummer (für Rückfragen)" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      placeholder="+49 170 1234567"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest">
                      {isDe ? "Stadt / PLZ des Events *" : "City / Postcode *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z. B. Köln, Düsseldorf, Berlin"
                      value={inquiryCity}
                      onChange={(e) => setInquiryCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-forest">
                      {isDe ? "Geplantes Eventdatum *" : "Event Date *"}
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-forest bg-white border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Summary snippet */}
                <div className="p-3.5 rounded-xl bg-[#F3EDE2]/60 border border-[#eadfce] text-xs text-forest/80">
                  <p className="font-semibold text-forest mb-0.5">
                    {isDe ? "Mitgesendete Kalkulationsdaten:" : "Included Calculation Data:"}
                  </p>
                  <p>
                    {guests} {isDe ? "Gäste" : "guests"} · {activeFormat.titleDe} · {durationHours}h
                    · {veggiePercent}% Veggie · {activeDrink.titleDe} · Budget: €{" "}
                    {calculations.totalMin}–{calculations.totalMax}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-forest text-cream font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:bg-forest/90 transition-all min-h-[44px] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {isSubmitting
                      ? isDe
                        ? "Wird übermittelt..."
                        : "Sending..."
                      : isDe
                        ? "Kostenlose Caterer-Angebote anfordern"
                        : "Request Free Caterer Quotes"}
                  </span>
                </button>
              </form>
            )}
          </section>

          {/* SEO & Wissens-FAQ Accordion */}
          <section className="mt-16 sm:mt-24 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                {isDe ? "CATERING RATGEBER & PRAXISTIPPS" : "CATERING GUIDE & ADVICE"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
                {isDe
                  ? "Häufig gestellte Fragen zur Event-Kalkulation"
                  : "Frequently Asked Questions on Catering Costs"}
              </h2>
            </div>

            <div className="grid gap-4 max-w-4xl mx-auto">
              {[
                {
                  qDe: "Warum hat jeder Caterer andere Preise trotz gleicher Gästezahl?",
                  qEn: "Why does each caterer have different prices for the same guest count?",
                  aDe: "Catering ist eine individuelle Handwerksleistung. Die Preise variieren je nach Wareneinsatz (z. B. regionales Bio-Fleisch vs. konventionell), Frischegrad, Menü-Aufwand, Personalschlüssel und Anfahrtsweg. Unser Rechner liefert Ihnen die verlässliche Orientierung – die finale Kalkulation erstellt jeder Caterer maßgeschneidert auf Ihre Wünsche.",
                  aEn: "Catering is handcrafted hospitality. Prices vary based on ingredient sourcing (e.g. local organic vs. standard), dish complexity, staffing and logistics. Our calculator gives you the market benchmark, while each caterer tailors their exact quote to your needs.",
                },
                {
                  qDe: "Wie viel Gramm Essen kalkuliert man pro Person beim Catering?",
                  qEn: "How many grams of food per person should you calculate?",
                  aDe: "Bei einem vollständigen Hauptbuffet (warm/kalt) rechnet man im Schnitt mit 600g bis 700g Speisen pro Gast. Davon entfallen etwa 200–250g auf Fleisch/Fisch bzw. vegetarische Hauptkomponenten, 150–200g auf Sättigungsbeilagen, 100–120g auf Gemüse und 100–120g auf Desserts. Bei reinem Fingerfood genügen 350g bis 450g (ca. 8–10 Teile).",
                  aEn: "For a full buffet, caterers estimate between 600g and 700g of food per guest. Finger food receptions require 350g to 450g (about 8–10 pieces).",
                },
                {
                  qDe: "Wie viele Getränke trinken Gäste im Schnitt pro Stunde?",
                  qEn: "How many drinks do guests consume per hour on average?",
                  aDe: "Als verlässliche Faustregel gilt: In der ersten Stunde trinken Gäste ca. 0,5 Liter Flüssigkeit. Für jede weitere Stunde werden 0,25 bis 0,35 Liter pro Person kalkuliert. Bei einer 5-stündigen Abendfeier liegt der Gesamtwert bei rund 1,5 bis 1,8 Litern Flüssigkeit pro Gast.",
                  aEn: "In the first hour, guests consume approx. 0.5L. For each subsequent hour, plan 0.25 to 0.35L per person.",
                },
                {
                  qDe: "Was kostet Catering pro Person im Jahr 2026?",
                  qEn: "What does catering cost per person in 2026?",
                  aDe: "Die Preise variieren je nach Format: Einfaches Fingerfood startet bei 22 € bis 34 € p.P. Ein reichhaltiges Buffet liegt zwischen 28 € und 45 € p.P. Exklusives Live-Cooking BBQ oder mehrgängige Hochzeitsmenüs kosten zwischen 38 € und 85 € p.P. Hinzu kommen eventuelle Getränkepauschalen (16 € bis 38 € p.P.) sowie Geschirr und Servicepersonal.",
                  aEn: "Finger food starts at €22–€34 p.p., classic buffets range from €28–€45 p.p., and live BBQ or fine dining seated menus range from €38–€85 p.p.",
                },
                {
                  qDe: "Wie viel Servicepersonal benötigt man bei einem Event?",
                  qEn: "How many service staff members are needed for an event?",
                  aDe: "Bei einem Buffet rechnet man mit 1 Servicekraft pro 25 bis 35 Gäste, um Teller abzuräumen und das Buffet nachzufüllen. Bei einem gesetzten Menü, bei dem Speisen und Wein am Tisch serviert werden, wird 1 Servicekraft pro 15 bis 20 Gäste empfohlen.",
                  aEn: "For buffets, plan 1 staff member per 25–35 guests. For seated plated menus, plan 1 per 15–20 guests.",
                },
                {
                  qDe: "Lohnt sich eine Getränkepauschale oder ist Abrechnung nach Verbrauch günstiger?",
                  qEn: "Is a flat-rate beverage package better than paying by consumption?",
                  aDe: "Bei Events mit einer Dauer von mehr als 4 Stunden (wie Hochzeiten, Sommerfesten oder Weihnachtsfeiern) lohnt sich eine Pauschale fast immer, da sie vor unerwarteten Kostenspitzen schützt. Bei kurzen Business-Meetings unter 2 Stunden ist die Abrechnung nach tatsächlichem Verbrauch meist wirtschaftlicher.",
                  aEn: "For events longer than 4 hours, all-inclusive beverage flat rates provide cost security and prevent unexpected budget spikes.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="surface-card p-6 rounded-2xl border border-[#eadfce]/60 space-y-2 text-left"
                >
                  <h3 className="text-sm sm:text-base font-serif font-bold text-forest flex items-start space-x-2">
                    <HelpCircle className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                    <span>{isDe ? faq.qDe : faq.qEn}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed pl-6">
                    {isDe ? faq.aDe : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Regional Caterer Links (Interlinking for SEO) */}
          <section className="mt-16 sm:mt-20 pt-12 border-t border-[#eadfce]/50 text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest/70">
              {isDe
                ? "Geprüfte Caterer nach Städten entdecken"
                : "Discover Vetted Regional Caterers"}
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {[
                { name: "Köln", path: "/catering/ort/koeln" },
                { name: "Düsseldorf", path: "/catering/ort/duesseldorf" },
                { name: "Berlin", path: "/catering/ort/berlin" },
                { name: "München", path: "/catering/ort/muenchen" },
                { name: "Frankfurt", path: "/catering/ort/frankfurt" },
                { name: "Hamburg", path: "/catering/ort/hamburg" },
                { name: "Bonn", path: "/catering/ort/bonn" },
                { name: "Essen", path: "/catering/ort/essen" },
              ].map((c) => (
                <Link
                  key={c.name}
                  to={c.path}
                  className="px-3.5 py-1.5 rounded-full border border-[#eadfce] bg-white text-xs font-medium text-forest hover:border-forest/60 hover:bg-[#F3EDE2] transition-colors"
                >
                  Catering {c.name}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </SiteShell>
  );
}
