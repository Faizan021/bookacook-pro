import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { 
  Search, Star, Calendar as CalendarIcon, Users, PartyPopper, Utensils, 
  MapPin, BadgeCheck, UtensilsCrossed, ArrowUpDown, Clock, Building, 
  ShieldCheck, Sparkles, BookOpen, GraduationCap, ChevronRight, HelpCircle, ArrowRight
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { getCaterers, type Caterer } from "@/data/caterers";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { trackEvent } from "@/utils/posthog";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";
import { TrustSection } from "@/components/TrustSection";

import { z } from "zod";

export const Route = createFileRoute("/catering/")({
  head: () => ({
    meta: [
      { title: "Premium-Catering für Events, Teams & Institutionen — Speisely" },
      { name: "description", content: "Entdecke geprüfte Caterer für Hochzeiten, Firmenevents, tägliche Büro-Verpflegung, Schulen und Pflege-Einrichtungen. Vergleichen und direkt buchen." },
      { property: "og:title", content: "Event-, Büro- & Groß-Catering — Speisely" },
      { property: "og:description", content: "Geprüfte Caterer für jeden Anlass. Finde das perfekte Menü für Events, Büros oder Institutionen." },
      { property: "og:url", content: "/catering" },
    ],
    links: [
      { rel: "preload", href: "/catering-clean.png", as: "image", fetchpriority: "high" },
      { rel: "preload", href: "/images/event_catering_hero.png", as: "image", fetchpriority: "high" },
    ],
  }),
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  loader: async () => await getCaterers(),
  component: Catering,
});

type CatId = "all" | "wedding" | "business" | "corporate" | "private" | "ramadan" | "christmas";
type SortKey = "price-asc" | "price-desc";

const CITY_LIST = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig"];

function Catering() {
  const search = Route.useSearch();
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<CatId>("all");
  const [query, setQuery] = useState(search.q || "");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [city, setCity] = useState("");
  const [menu, setMenu] = useState("");
  const [sort, setSort] = useState<SortKey>("price-asc");

  // B2B Dialog State
  const [b2bOpen, setB2bOpen] = useState(false);
  const [selectedCatererSlug, setSelectedCatererSlug] = useState<string | undefined>(undefined);

  const allCaterers = Route.useLoaderData() as Caterer[];

  const corporateCaterers = useMemo(() => {
    return allCaterers.filter(c => c.cat === "corporate" || c.cat === "business" || c.tags.includes("Office") || c.tags.includes("Business"));
  }, [allCaterers]);

  const cats: { id: CatId; label: string }[] = [
    { id: "all", label: lang === "de" ? "Alle" : "All" },
    { id: "corporate", label: lang === "de" ? "B2B & Office Catering" : "B2B & Office Catering" },
    { id: "wedding", label: lang === "de" ? "Hochzeit" : "Wedding" },
    { id: "business", label: lang === "de" ? "Business Lunch" : "Business Lunch" },
    { id: "private", label: lang === "de" ? "Privates Dinner" : "Private Dinner" },
    { id: "ramadan", label: lang === "de" ? "Ramadan Iftar" : "Ramadan Iftar" },
    { id: "christmas", label: lang === "de" ? "Weihnachtsfeier" : "Christmas Party" },
  ];

  const menuOptions = useMemo(() => {
    const s = new Set<string>();
    allCaterers.forEach((c) => c.menu?.forEach((m) => s.add(m.category || "Menü")));
    return Array.from(s);
  }, [allCaterers]);

  const resetFilters = () => {
    setCat("all"); setQuery(""); setDate(""); setGuests(""); setCity(""); setMenu(""); setSort("price-asc");
  };

  const filtered = allCaterers.filter((c) => {
    if (cat !== "all" && c.cat !== cat) return false;
    if (city && !c.area.toLowerCase().includes(city.toLowerCase())) return false;
    if (guests && c.minGuests > Number(guests)) return false;
    if (menu && !c.menu?.some((m) => (m.category || "Menü") === menu)) return false;
    if (query && !`${c.name} ${c.tagline[lang]} ${c.area}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const visible = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.perPerson - b.perPerson;
    return b.perPerson - a.perPerson;
  });

  const handleOpenB2bDialog = (catererSlug?: string) => {
    setSelectedCatererSlug(catererSlug);
    trackEvent("partner_cta_clicked", { location: "catering_index_hero", role: "customer" });
    setB2bOpen(true);
  };

  const scrollToListing = () => {
    document.getElementById("listings-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const cateringFaqs = [
    {
      question: { de: "Wie lange im Voraus sollte ich Catering buchen?", en: "How far in advance should I book catering?" },
      answer: { de: "Für kleinere Meetings empfehlen wir 2-3 Tage, für große Events wie Hochzeiten oder Firmenfeiern idealerweise 4-8 Wochen im Voraus.", en: "For smaller meetings, we recommend 2-3 days, for large events like weddings or corporate parties ideally 4-8 weeks in advance." }
    },
    {
      question: { de: "Gibt es einen Mindestbestellwert?", en: "Is there a minimum order value?" },
      answer: { de: "Das hängt vom jeweiligen Partner ab. Viele Caterer bieten Menüs ab 10 Personen an, während sich andere auf Großevents spezialisieren.", en: "This depends on the respective partner. Many caterers offer menus for 10 people or more, while others specialize in large-scale events." }
    },
    {
      question: { de: "Können Allergien und Ernährungsformen (vegan, glutenfrei) berücksichtigt werden?", en: "Can allergies and diets (vegan, gluten-free) be accommodated?" },
      answer: { de: "Ja, die meisten unserer Partner bieten flexible Anpassungen für vegane, vegetarische, glutenfreie oder halal-zertifizierte Menüs an.", en: "Yes, most of our partners offer flexible adjustments for vegan, vegetarian, gluten-free, or halal-certified menus." }
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": visible.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "FoodEstablishment",
          "name": c.name,
          "url": `https://speisely.de/catering/${c.id}`
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": cateringFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question[lang as "de" | "en"],
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer[lang as "de" | "en"]
        }
      }))
    }
  ];

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/catering-clean.png"
            fetchPriority="high"
            alt="Catering Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" /> {lang === "de" ? "100% Kostenloser Service." : "100% Free Service."}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight drop-shadow-sm">
              {lang === "de" ? (
                <>Finde & buche die besten Caterer. <br/><span className="text-[#b28a3c]">Ohne versteckte Gebühren.</span></>
              ) : (
                <>Find & book the best caterers. <br/><span className="text-[#b28a3c]">With zero hidden fees.</span></>
              )}
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              {lang === "de"
                ? "Entdecke handverlesene Premium-Caterer für dein nächstes Event oder das tägliche Office-Mittagessen. Stelle eine kostenlose Anfrage und erhalte unverbindliche Angebote direkt vom Caterer."
                : "Discover hand-picked premium caterers for your next event or daily office lunch. Submit a free inquiry and receive non-binding offers directly from the caterer."}
            </p>

            <ul className="space-y-2.5 pt-2 text-sm sm:text-base text-white/90 font-medium">
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {lang === "de" ? "100% kostenloser Service für Besteller" : "100% free service for requesters"}
              </li>
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {lang === "de" ? "Direkter Kontakt ohne Zwischenhändler" : "Direct contact without middlemen"}
              </li>
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {lang === "de" ? "Qualitätsgeprüfte Premium-Partner" : "Quality-checked premium partners"}
              </li>
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={scrollToListing}
                className="group flex items-center gap-2 rounded-full bg-[#b28a3c] hover:bg-[#9a7633] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-xl shadow-[#b28a3c]/20 transition-all cursor-pointer"
              >
                {lang === "de" ? "Jetzt Caterer anfragen" : "Request caterers now"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => handleOpenB2bDialog()}
                className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-7 py-3.5 text-sm sm:text-base font-semibold transition-all cursor-pointer"
              >
                {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
              </button>
            </div>
          </div>

          {/* Hero Image Component */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#b28a3c]/20 to-transparent rounded-[2.5rem] blur-2xl -z-10" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
              <img
                src="/images/event_catering_hero.png"
                fetchPriority="high"
                alt="Premium Event and Wedding Buffet Plating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-transparent opacity-60" />
              
              {/* Floating Badges */}
              <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 flex items-center gap-3">
                <div className="p-2 bg-[#b28a3c]/20 rounded-lg text-[#f2d896]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-[12px] font-bold text-white leading-none">
                  <div>100% Vetted</div>
                  <div className="text-[10px] text-white/60 font-medium mt-1">{lang === "de" ? "Geprüfte Partner" : "Verified partners"}</div>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="text-[12px] font-bold text-white leading-none">
                  <div>4.9 / 5.0</div>
                  <div className="text-[10px] text-white/60 font-medium mt-1">{lang === "de" ? "Kundenbewertung" : "Customer rating"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Search Section */}
      <section id="listings-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-16 pb-6 scroll-mt-6 relative z-10">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">{t("cat.eyebrow")}</div>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-forest leading-tight text-left">
            {lang === "de" ? "Partner-Caterer finden" : "Find Partner Caterers"}
          </h2>
          <div className="surface-card rounded-xl flex items-center gap-3 px-5 py-3 lg:w-[380px] border border-[#eadfce]/40 shadow-sm">
            <Search className="h-4 w-4 text-forest/60 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("cat.subtitle")}
              className="w-full bg-transparent outline-none text-sm placeholder:text-forest/50 text-forest"
            />
          </div>
        </div>

        {/* Booking search bar */}
        <div className="surface-card rounded-2xl mt-6 p-3 sm:p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 border border-[#eadfce]/40 shadow-sm">
          <FilterField icon={<CalendarIcon className="h-4 w-4 text-emerald-600" />} label={lang === "de" ? "Datum" : "Date"} htmlFor="cat-date">
            <input
              id="cat-date"
              type="date"
              aria-label={lang === "de" ? "Datum" : "Date"}
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-forest"
            />
          </FilterField>
          <FilterField icon={<Users className="h-4 w-4 text-emerald-600" />} label={lang === "de" ? "Gäste" : "Guests"} htmlFor="cat-guests">
            <input
              id="cat-guests"
              type="number"
              aria-label={lang === "de" ? "Gäste" : "Guests"}
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="50"
              className="w-full bg-transparent outline-none text-sm text-forest placeholder:text-forest/40"
            />
          </FilterField>
          <FilterField icon={<PartyPopper className="h-4 w-4 text-emerald-600" />} label={lang === "de" ? "Event" : "Event"} htmlFor="cat-event">
            <select
              id="cat-event"
              aria-label={lang === "de" ? "Event" : "Event"}
              value={cat}
              onChange={(e) => setCat(e.target.value as CatId)}
              className="w-full bg-transparent outline-none text-sm text-forest"
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </FilterField>
          <FilterField icon={<Utensils className="h-4 w-4 text-emerald-600" />} label={lang === "de" ? "Menü" : "Menu"} htmlFor="cat-menu">
            <select
              id="cat-menu"
              aria-label={lang === "de" ? "Menü" : "Menu"}
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-forest"
            >
              <option value="">{lang === "de" ? "Alle" : "All"}</option>
              {menuOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </FilterField>
          <FilterField icon={<MapPin className="h-4 w-4 text-emerald-600" />} label={lang === "de" ? "Stadt" : "City"} htmlFor="cat-city">
            <select
              id="cat-city"
              aria-label={lang === "de" ? "Stadt" : "City"}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-forest"
            >
              <option value="">{lang === "de" ? "Alle" : "All"}</option>
              {CITY_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FilterField>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer shadow-sm border ${
                  cat === c.id ? "bg-forest text-white border-forest shadow-forest/20" : "bg-white/60 text-forest border-[#eadfce]/40 hover:bg-white hover:text-forest"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label htmlFor="cat-sort" className="flex items-center gap-2 rounded-full bg-white/60 border border-[#eadfce]/40 px-4 py-2 text-sm text-forest cursor-pointer shadow-sm hover:bg-white transition-all duration-300">
            <ArrowUpDown className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-forest/60">{lang === "de" ? "Sortieren" : "Sort by"}</span>
            <select
              id="cat-sort"
              aria-label={lang === "de" ? "Sortieren" : "Sort by"}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent outline-none text-sm text-forest"
            >

              <option value="price-asc">{lang === "de" ? "Preis (aufsteigend)" : "Price (low to high)"}</option>
              <option value="price-desc">{lang === "de" ? "Preis (absteigend)" : "Price (high to low)"}</option>
            </select>
          </label>
        </div>
      </section>

      {/* Curated Listings Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 pt-10 relative z-10">
        {visible.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center text-center py-20 px-6 border border-[#eadfce]/40 rounded-3xl shadow-sm">
            <UtensilsCrossed className="h-12 w-12 text-forest/40" />
            <h3 className="mt-4 font-display text-xl text-forest">{lang === "de" ? "Keine Caterer gefunden" : "No caterers found"}</h3>
            <p className="mt-2 text-sm text-forest/70 max-w-md">
              {lang === "de" ? "Versuche andere Filter oder ein anderes Datum." : "Try different filters or another date."}
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-full bg-forest text-white px-6 py-2.5 text-sm font-semibold hover:bg-forest/90 transition-all cursor-pointer shadow-md"
            >
              {lang === "de" ? "Filter zurücksetzen" : "Reset filters"}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c) => (
              <Link
                key={c.id}
                to="/catering/$slug"
                params={{ slug: c.id }}
                className="surface-card overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl border border-[#eadfce]/40 hover:border-emerald-600/30 group text-left"
              >
                <div className="overflow-hidden aspect-[4/3] relative">
                  <img 
                    src={c.img} 
                    alt={c.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    loading="lazy" 
                    width={600} 
                    height={450} 
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-md flex items-center gap-1 border border-emerald-500/20 uppercase tracking-wider">
                    {lang === "de" ? "Buchbar" : "Bookable"}
                  </div>
                  {c.isShowcase && (
                    <div className="absolute top-4 left-4 bg-forest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1 uppercase tracking-wider">
                      Demo Provider
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl font-bold text-forest group-hover:text-emerald-600 transition-colors truncate">{c.name}</h3>
                      {c.verified && (
                        <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-forest/70 line-clamp-2 min-h-[2rem]">{c.tagline[lang]}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.dietary.map((d) => (
                        <span key={d} className="rounded-full bg-[#eadfce]/40 px-2.5 py-0.5 text-[10px] font-semibold text-forest border border-[#eadfce]/60">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#eadfce]/30 flex items-center justify-between text-xs text-forest/60">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-emerald-600" /> {c.area}</span>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-forest/50">{lang === "de" ? "Budget ab" : "Min. order"}</div>
                      <div className="text-sm text-forest font-bold">€{c.minOrder}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pathway Sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 drop-shadow-sm">
            {lang === "de" ? "DREI WEGE ZUM PERFEKTEN LUNCH" : "THREE PATHWAYS TO PERFECT DINING"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {lang === "de" ? "Catering für jeden Bedarf" : "Catering Tailored to Your Needs"}
          </h2>
          <p className="text-sm sm:text-base text-forest/70 leading-relaxed">
            {lang === "de"
              ? "Egal ob ein einmaliges unvergessliches Event, tägliches Mittagessen für Ihre Mitarbeiter oder Groß-Verpflegung für soziale Einrichtungen – wir decken das gesamte Spektrum ab."
              : "Whether it is a one-off unforgettable event, daily lunch delivery for your employees, or large-scale catering for social institutions – we cover the full spectrum."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Events Catering */}
          <Link
            to="/catering/events"
            className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
          >
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <PartyPopper className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest group-hover:text-emerald-600 transition-colors">
                {lang === "de" ? "Event-Catering" : "Event Catering"}
              </h3>
              <p className="text-sm text-forest/70 leading-relaxed">
                {lang === "de"
                  ? "Individuelle Angebote für Hochzeiten, Geburtstage, Firmenfeiern und Konferenzen. Buffets, Fingerfood und Full-Service Menüs."
                  : "Custom packages for weddings, birthdays, corporate parties, and conferences. Buffets, finger food, and full-service dining."}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
              <span>{lang === "de" ? "Event-Catering ansehen" : "Explore Event Catering"}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 2: Daily Catering Subscriptions */}
          <Link
            to="/catering/daily-catering-subscriptions"
            className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
          >
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <Utensils className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest group-hover:text-emerald-600 transition-colors">
                {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
              </h3>
              <p className="text-sm text-forest/70 leading-relaxed">
                {lang === "de"
                  ? "Wiederkehrende Mittagsmenüs und Kantinen-Alternativen für Büros und Teams. Flexibel planbar, vegetarisch-freundlich und pünktlich geliefert."
                  : "Recurring lunch plans and flexible canteen alternatives for offices and teams. Simple scheduling, diet-friendly, and reliable delivery."}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
              <span>{lang === "de" ? "Büroverpflegung ansehen" : "Explore Office Subscriptions"}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 3: Institutional Catering */}
          <Link
            to="/catering/institutional-catering"
            className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left"
          >
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest group-hover:text-emerald-600 transition-colors">
                {lang === "de" ? "Institutionelles Catering" : "Institutional Catering"}
              </h3>
              <p className="text-sm text-forest/70 leading-relaxed">
                {lang === "de"
                  ? "Zuverlässige, gesunde Groß-Verpflegung für Schulen, Kitas, Kliniken und Pflegeeinrichtungen nach höchsten Qualitätsstandards."
                  : "Dependable, healthy large-scale meal plans for schools, daycares, clinics, and care homes matching strict quality criteria."}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:translate-x-2 transition-transform">
              <span>{lang === "de" ? "Großverpflegung ansehen" : "Explore Institutional Catering"}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              {lang === "de" ? "EINSATZBEREICHE" : "USE CASES"}
            </span>
            <h2 className="text-3xl font-display font-bold text-forest">
              {lang === "de" ? "Das richtige Konzept für jedes Vorhaben" : "The Right Concept for Every Event"}
            </h2>
            <p className="text-sm sm:text-base text-forest/70 leading-relaxed">
              {lang === "de"
                ? "Unsere Partner bieten massgeschneiderte Speisepläne für jeden Zweck an. Filtere einfach nach dem gewünschten Event und entdecke passende Caterer auf Speisely."
                : "Our partners provide custom-tailored dining profiles for every occasion. Simply filter by your target occasion and discover suitable caterers on Speisely."}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-cream/35 p-6 rounded-2xl border border-[#eadfce]/20 text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Hochzeiten & Jubiläen" : "Weddings & Anniversaries"}</h4>
              <p className="text-xs sm:text-sm text-forest/70 mt-2 leading-relaxed">{lang === "de" ? "Elegante Plating-Menüs, Sektempfänge und traumhafte Buffets für deinen großen Tag." : "Sophisticated plated multi-course dinners, sparkling champagne receptions, and wedding buffets."}</p>
            </div>
            <div className="bg-cream/35 p-6 rounded-2xl border border-[#eadfce]/20 text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Täglicher Office-Lunch" : "Daily Office Lunch"}</h4>
              <p className="text-xs sm:text-sm text-forest/70 mt-2 leading-relaxed">{lang === "de" ? "Regelmäßiges, gesundes warmes Mittagessen für Büros und Co-Working Spaces." : "Fresh, healthy hot lunch subscriptions for tech teams, agencies, and co-working locations."}</p>
            </div>
            <div className="bg-cream/35 p-6 rounded-2xl border border-[#eadfce]/20 text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Tagungen & Konferenzen" : "Conferences & Seminars"}</h4>
              <p className="text-xs sm:text-sm text-forest/70 mt-2 leading-relaxed">{lang === "de" ? "Praktisches Fingerfood, Kaffeepausen-Pakete und handliches Business-Lunch-Buffet." : "Uncomplicated savory finger food platters, hot coffee pairings, and warm lunch trays."}</p>
            </div>
            <div className="bg-cream/35 p-6 rounded-2xl border border-[#eadfce]/20 text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Schul- & Kitaverpflegung" : "School & Daycare Meals"}</h4>
              <p className="text-xs sm:text-sm text-forest/70 mt-2 leading-relaxed">{lang === "de" ? "Ausgewogene, DGE-zertifizierte Mahlzeiten für heranwachsende Kinder und Schüler." : "Nutritionally balanced, certified daily meal programs for kids, kitas, and schools."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Corporate / Office Catering Section (Highlighted lower on the page) */}
      {(cat === "all" || cat === "corporate") && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
          <div className="rounded-[2rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden shadow-xl border border-forest/10">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Building className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-xl space-y-4 text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
                <Star className="h-3 w-3 fill-current" /> B2B & Office Subscriptions
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
                {lang === "de" ? "Regelmäßiges Catering für Ihr Office" : "Recurring Meals for Your Workspace"}
              </h2>
              <p className="text-cream/80 text-base leading-relaxed">
                {lang === "de" 
                  ? "Entlasten Sie Ihre HR- & Office-Verantwortlichen. Speisely ermöglicht flexible wöchentliche Büro-Meal-Lunches oder tägliche Kantinen-Lösungen inklusive konsolidierter Rechnungsstellung."
                  : "Support your HR and Office leads. Speisely facilitates flexible weekly office lunches or daily canteen solutions, including full consolidated monthly invoicing."}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button 
                  onClick={() => handleOpenB2bDialog("officement-catering")}
                  className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md"
                >
                  {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
                </button>
                <Link
                  to="/catering/daily-catering-subscriptions"
                  className="rounded-full border border-cream/20 bg-transparent hover:bg-cream/10 px-6 py-3.5 text-sm font-semibold text-cream transition"
                >
                  {lang === "de" ? "Mehr erfahren" : "Learn More"}
                </Link>
              </div>
            </div>
            <div className="relative z-10 hidden md:block w-1/3 min-w-[280px]">
              <img 
                src="/images/office_catering_hero.png" 
                alt="Corporate Office Plating Buffet" 
                className="rounded-2xl shadow-2xl aspect-[4/3] object-cover border-2 border-white/10"
              />
            </div>
          </div>
        </section>
      )}

      {/* Trust and Compliance Section */}
      <TrustSection
        badgeText={lang === "de" ? "SICHERHEIT & VERTRAUEN" : "TRUST & QUALITY"}
        headline={lang === "de" ? "Warum Speisely?" : "Why Choose Speisely?"}
        items={[
          {
            icon: BadgeCheck,
            title: lang === "de" ? "Geprüfte Qualität" : "Verified Partners",
            description: lang === "de" 
              ? "Alle unsere Partner-Caterer durchlaufen strenge Hygiene- und Qualitätskontrollen, bevor sie auf unserer Plattform freigeschaltet werden." 
              : "All food partners undergo strict hygiene and quality compliance assessments before joining the Speisely marketplace.",
          },
          {
            icon: UtensilsCrossed,
            title: lang === "de" ? "Dietary Flexibility" : "Dietary Flexibility",
            description: lang === "de" 
              ? "Ob vegan, vegetarisch, glutenfrei oder halal – unsere Caterer passen ihre Menüs präzise an die Bedürfnisse deiner Gäste an." 
              : "From vegan and vegetarian to gluten-free and halal - our partners adapt their menus precisely to your guests' requirements.",
          },
          {
            icon: Clock,
            title: lang === "de" ? "Logistische Zuverlässigkeit" : "Logistical Confidence",
            description: lang === "de" 
              ? "Pünktliche Lieferung und fachgerechter Aufbau mit Warmhaltebehältern. Wir garantieren einen reibungslosen Ablauf vor Ort." 
              : "On-time delivery and professional on-site setup. We guarantee smooth logistics for team lunches or major corporate events.",
          },
        ]}
      />

      {/* Visible FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest mb-4">
            {lang === "de" ? "Häufig gestellte Fragen zum Catering" : "Frequently Asked Questions about Catering"}
          </h2>
          <p className="text-forest/70 max-w-xl mx-auto">
            {lang === "de" 
              ? "Die wichtigsten Antworten rund um deine Catering-Planung." 
              : "The most important answers for your catering planning."}
          </p>
        </div>
        <div className="space-y-6">
          {cateringFaqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-[#eadfce] shadow-sm">
              <h3 className="text-lg font-bold text-forest mb-2">
                {faq.question[lang as "de" | "en"]}
              </h3>
              <p className="text-forest/80 leading-relaxed">
                {faq.answer[lang as "de" | "en"]}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link 
            to="/faq" 
            className="inline-flex items-center gap-2 rounded-full border border-forest/20 text-forest px-6 py-3 font-medium hover:bg-forest/5 transition"
          >
            {lang === "de" ? "Alle FAQs ansehen" : "View all FAQs"}
          </Link>
        </div>
      </section>
      {/* Bottom CTA Block */}
      <MarketplacePromiseCTA />

      {/* General Corporate B2B Inquiry Modal Dialog */}
      <B2bCateringDialog
        open={b2bOpen}
        onOpenChange={setB2bOpen}
        defaultCatererSlug={selectedCatererSlug}
        corporateCaterers={corporateCaterers}
      />
    </SiteShell>
  );
}

function FilterField({ icon, label, children, htmlFor }: { icon: ReactNode; label: string; children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2.5 rounded-full bg-[#eadfce]/40 hover:bg-[#eadfce]/60 transition-colors px-4 py-2 ring-1 ring-[#eadfce] cursor-pointer shadow-sm">
      <span className="text-emerald-600">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/60 leading-none mb-1">{label}</span>
        {children}
      </span>
    </label>
  );
}
