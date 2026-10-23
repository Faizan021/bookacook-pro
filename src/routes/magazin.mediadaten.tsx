import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Globe,
  Users,
  Building2,
  UtensilsCrossed,
  Layers,
  Send,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/magazin/mediadaten")({
  head: () => ({
    meta: [
      {
        title: "Speisely Magazin Mediadaten — B2B-Werbung & Spotlights",
      },
      {
        name: "description",
        content:
          "Erreiche über 25.000 Gastronomen, Caterer und anspruchsvolle Event-Kunden. Entdecke unsere Mediadaten, Sponsored Storys, B2B-Spotlights und Werbepakete.",
      },
      {
        property: "og:title",
        content: "Speisely Magazin Mediadaten — Werbung & Editorial im HoReCa-Sektor",
      },
      {
        property: "og:description",
        content:
          "Erreiche gezielt Gastronomie-Entscheider, Caterer und Feinschmecker in ganz Deutschland. Jetzt Mediadaten & Partner-Pakete anfordern.",
      },
      { property: "og:image", content: "https://speisely.de/hero-cinematic.webp" },
      { property: "og:url", content: "https://speisely.de/magazin/mediadaten" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/magazin/mediadaten" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://speisely.de/magazin/mediadaten#page",
          name: "Speisely Magazin Mediadaten & Werbepartner",
          url: "https://speisely.de/magazin/mediadaten",
          description:
            "Offizielle Mediadaten und Partnerschaftsoptionen für das Speisely Magazin. Zielgruppe: Gastronomie, Catering, HoReCa, POS-Systeme und Food-Tech.",
          publisher: {
            "@type": "Organization",
            "@id": "https://speisely.de/#organization",
            name: "Speisely",
            url: "https://speisely.de",
            logo: "https://speisely.de/speisely_logo.png",
          },
        }),
      },
    ],
  }),
  component: MagazinMediadatenPage,
});

function MagazinMediadatenPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    segment: "restaurant",
    packageType: "visit",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const emailSubject = `Mediadaten- & Werbeanfrage von ${form.companyName || form.contactName}`;
    const emailBody = `Hallo Speisely Redaktions- & Werbeteam,

Ich interessiere mich für eine Medienpartnerschaft im Speisely Magazin:

Unternehmen / Betrieb: ${form.companyName}
Ansprechpartner: ${form.contactName}
E-Mail: ${form.email}
Telefon: ${form.phone || "Nicht angegeben"}
Branche / Segment: ${form.segment}
Gewünschtes Paket: ${form.packageType}
Nachricht / Projekt:
${form.notes}

---
Anfrage über: https://speisely.de/magazin/mediadaten`;

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.location.href = `mailto:redaktion@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      toast.success(
        isDe
          ? "Vielen Dank! Dein E-Mail-Programm öffnet sich jetzt."
          : "Thank you! Opening your email client.",
      );
    }, 600);
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5] text-forest min-h-screen">
        {/* ─────────────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────────────── */}
        <section className="relative bg-forest text-[#FAF8F5] pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d4d38] via-forest to-[#0a1811] opacity-95" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#E6B84A] backdrop-blur-md border border-white/15">
              <Sparkles className="h-4 w-4" />
              <span>Speisely Magazin · Mediadaten &amp; Brand-Partnerschaften 2026</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              {isDe ? (
                <>
                  Erreiche Entscheider der <br className="hidden sm:inline" />
                  <span className="text-[#E6B84A]">Gastronomie &amp; Food-Kultur.</span>
                </>
              ) : (
                <>
                  Reach Decision-Makers in <br className="hidden sm:inline" />
                  <span className="text-[#E6B84A]">Gastronomy &amp; Hospitality.</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed font-sans">
              {isDe
                ? "Das Speisely Magazin verbindet anspruchsvollen Gastro-Journalismus mit digitaler Reichweite, Google-AI-Indexierung und exklusiven B2B-Kooperationen für Restaurants, Caterer, POS-Systeme und HoReCa-Marken."
                : "Speisely Magazine combines luxury culinary journalism with digital reach, Google AI indexing, and B2B partnerships for restaurants, caterers, POS software, and HoReCa brands."}
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            AUDIENCE STATS / METRICS BAR
        ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-forest/10">
            <div className="text-center p-3 border-r border-forest/10 last:border-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-forest font-display">
                25.000+
              </span>
              <span className="text-xs font-semibold text-forest/70 uppercase tracking-wider mt-1 block">
                {isDe ? "Monatliche Leser" : "Monthly Readers"}
              </span>
            </div>
            <div className="text-center p-3 border-r border-forest/10 last:border-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#b8860b] font-display">
                100%
              </span>
              <span className="text-xs font-semibold text-forest/70 uppercase tracking-wider mt-1 block">
                {isDe ? "Gastro & Event Fokus" : "Gastro & Event Focus"}
              </span>
            </div>
            <div className="text-center p-3 border-r border-forest/10 last:border-0">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-700 font-display">
                Top 1
              </span>
              <span className="text-xs font-semibold text-forest/70 uppercase tracking-wider mt-1 block">
                {isDe ? "Google AI & LLMs.txt" : "Google AI & LLMs.txt"}
              </span>
            </div>
            <div className="text-center p-3">
              <span className="block text-3xl sm:text-4xl font-extrabold text-forest font-display">
                0%
              </span>
              <span className="text-xs font-semibold text-forest/70 uppercase tracking-wider mt-1 block">
                {isDe ? "Streuverlust" : "Ad Waste"}
              </span>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            COMMERCIAL PACKAGES & TIERS
        ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#A85C36] mb-2 block">
              {isDe ? "Transparente Mediapakete" : "Transparent Media Packages"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-forest">
              {isDe ? "Wähle deine Partnerschaft" : "Choose Your Partnership"}
            </h2>
            <p className="mt-4 text-forest/75 text-base">
              {isDe
                ? "Maßgeschneiderte Veröffentlichungen im digitalen Magazin, im 3D-Flip-Reader und auf unseren reichweitenstarken Social-Media-Kanälen."
                : "Tailored publications across our digital magazine, 3D flip reader, and social channels."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TIER 1: Restaurant & Caterer Feature */}
            <div className="rounded-3xl bg-white p-8 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-bold mb-4">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>Für Restaurants &amp; Caterer</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-forest">
                  Speisely Visit &amp; Portrait
                </h3>
                <p className="text-xs text-forest/70 mt-2 mb-6">
                  Vor-Ort-Besuch, professionelle Food-Fotografie und redaktionelles Feature für mehr
                  Gäste und Event-Aufträge.
                </p>

                <div className="text-3xl font-black text-forest font-display mb-6">
                  ab 490 €{" "}
                  <span className="text-xs font-normal text-forest/60">einmalig zzgl. MwSt.</span>
                </div>

                <ul className="space-y-3 text-xs text-forest/80 border-t border-forest/10 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Eigener ausführlicher Magazin-Artikel mit Luxus-Editorial-Layout</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Aufnahme in das 3D-Flip-Magazin (E-Paper)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instagram-Carousel (8 Slides nach King-Tut-Standard) &amp; Story</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Google AI &amp; ChatGPT-Zitierung über Speisely /llms.txt</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100 % Nutzungsrechte an allen redaktionellen Fotos für deine Website</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#anfrage"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      segment: "restaurant",
                      packageType: "visit",
                    }))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-white py-3.5 text-xs font-bold hover:bg-[#1f4030] transition shadow-md"
                >
                  <span>Portrait anfragen ↓</span>
                </a>
              </div>
            </div>

            {/* TIER 2: B2B HoReCa & Tech Spotlight */}
            <div className="rounded-3xl bg-forest text-white p-8 border-2 border-[#E6B84A] shadow-2xl relative flex flex-col justify-between transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E6B84A] text-forest font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Empfehlung für B2B &amp; HoReCa
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E6B84A] text-xs font-bold mb-4">
                  <Building2 className="w-3.5 h-3.5 text-[#E6B84A]" />
                  <span>Für POS, Tech, Textil &amp; Großhandel</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  HoReCa B2B Spotlight &amp; Guide
                </h3>
                <p className="text-xs text-white/75 mt-2 mb-6">
                  Positioniere dein Produkt (Kassensystem, Berufskleidung, Küchengeräte) als #1
                  Lösung vor Restaurant-Inhabern.
                </p>

                <div className="text-3xl font-black text-[#E6B84A] font-display mb-6">
                  ab 950 €{" "}
                  <span className="text-xs font-normal text-white/60">einmalig zzgl. MwSt.</span>
                </div>

                <ul className="space-y-3 text-xs text-white/80 border-t border-white/15 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>Sponsored Ratgeber / Best-Practice-Case mit DoFollow-Backlink</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>Lead-Generierungsformular direkt im Artikel eingebettet</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>Aufnahme in das Speisely B2B-Partner-Netzwerk (/partner/webseiten)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>LinkedIn B2B-Spotlight-Post im Netzwerk von Speisely &amp; TechGlanz</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>Dauerhafte Indexierung in Google-Suchergebnissen &amp; KI-Engines</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#anfrage"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      segment: "pos_horeca",
                      packageType: "b2b_spotlight",
                    }))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E6B84A] text-forest py-3.5 text-xs font-black hover:bg-[#fad36f] transition shadow-lg"
                >
                  <span>B2B-Spotlight anfragen ↓</span>
                </a>
              </div>
            </div>

            {/* TIER 3: Digital Display & Ad Space */}
            <div className="rounded-3xl bg-white p-8 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-bold mb-4">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Für Brands &amp; Event-Zulieferer</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-forest">
                  Digital Display &amp; Ad Banner
                </h3>
                <p className="text-xs text-forest/70 mt-2 mb-6">
                  Exklusive Banner-Platzierung auf der Magazin-Startseite, in beliebten Artikeln und
                  im E-Paper Reader.
                </p>

                <div className="text-3xl font-black text-forest font-display mb-6">
                  ab 290 €{" "}
                  <span className="text-xs font-normal text-forest/60">/ Monat zzgl. MwSt.</span>
                </div>

                <ul className="space-y-3 text-xs text-forest/80 border-t border-forest/10 pt-6">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Prominenter Header- oder Sidebar-Banner auf /magazin</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Platzierung im interaktiven 3D-Flip-Magazin</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>UTM-Tracking &amp; monatlicher Performance-Report via PostHog</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Keine automatische Verlängerung, monatlich kündbar</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#anfrage"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      segment: "brand",
                      packageType: "banner",
                    }))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-white py-3.5 text-xs font-bold hover:bg-[#1f4030] transition shadow-md"
                >
                  <span>Banner-Plätze anfragen ↓</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            INQUIRY FORM SECTION
        ───────────────────────────────────────────────── */}
        <section id="anfrage" className="bg-forest text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <span className="text-xs font-bold text-[#E6B84A] uppercase tracking-widest">
                Jetzt unverbindlich anfragen
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Mediadaten anfordern &amp; Story planen
              </h2>
              <p className="text-white/70 text-sm max-w-xl mx-auto">
                Fülle kurz das Formular aus. Wir melden uns innerhalb von 24 Stunden mit unseren
                vollständigen Mediadaten und einem maßgeschneiderten Veröffentlichungsplan.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Unternehmen / Betrieb *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="z. B. Lightspeed POS oder Gourmet Catering"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Dein Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    E-Mail Adresse *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="marketing@unternehmen.de"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Telefonnummer / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+49 176 12345678"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Branche / Segment
                  </label>
                  <select
                    value={form.segment}
                    onChange={(e) => setForm({ ...form, segment: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0f2720] border border-white/20 text-white text-sm focus:outline-none focus:border-[#E6B84A] cursor-pointer"
                  >
                    <option value="restaurant">Restaurant / Café / Bar</option>
                    <option value="caterer">Caterer / Partyservice</option>
                    <option value="pos_horeca">POS-System / Software / Food-Tech</option>
                    <option value="beverage_food">Getränke / Food-Hersteller / Großhandel</option>
                    <option value="workwear_equipment">Berufsbekleidung / Küchentechnik</option>
                    <option value="agency">Agentur / Werbepartner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Interesse an Paket
                  </label>
                  <select
                    value={form.packageType}
                    onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0f2720] border border-white/20 text-white text-sm focus:outline-none focus:border-[#E6B84A] cursor-pointer"
                  >
                    <option value="visit">Speisely Visit &amp; Portrait (ab 490 €)</option>
                    <option value="b2b_spotlight">HoReCa B2B Spotlight &amp; Guide (ab 950 €)</option>
                    <option value="banner">Digital Display &amp; Ad Banner (ab 290 €/Mo)</option>
                    <option value="individual">Individuelle Sonderkampagne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                  Deine Vorstellungen / Ziele
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="z. B. Wir möchten unser neues Kassensystem für Event-Caterer vorstellen..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E6B84A] text-forest px-8 py-4 text-sm font-black shadow-xl hover:bg-[#f7ca5e] transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Wird vorbereitet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Mediadaten &amp; Angebot anfordern</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-white/50">
                  Direkter Kontakt zur Redaktion:{" "}
                  <a href="mailto:redaktion@speisely.de" className="text-[#E6B84A] hover:underline font-bold">
                    redaktion@speisely.de
                  </a>{" "}
                  · Telefon / WhatsApp:{" "}
                  <span className="text-white/80 font-semibold">+49 176 43218282</span>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
