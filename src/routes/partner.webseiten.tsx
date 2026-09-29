import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Search,
  Users,
  Send,
  Loader2,
  Star,
  Layers,
  ChefHat,
  Building2,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/partner/webseiten")({
  head: () => ({
    meta: [
      {
        title: "Website-Erstellung für Caterer & Gastronomie — Speisely Digital Suite",
      },
      {
        name: "description",
        content:
          "Deine eigene High-End Website für Catering & Restaurants: PageSpeed 99+, integrierte Speisely-Buchungsengine, 100% mobiloptimiert und Google-KI-ready. Jetzt anfragen.",
      },
      {
        property: "og:title",
        content: "Website-Erstellung für Caterer & Gastronomie — Speisely Digital Suite",
      },
      {
        property: "og:description",
        content:
          "Moderne Webseiten für Gastronomen & Caterer ohne teuren Agentur-Overhead. Inklusive Online-Menüs, Event-Kalkulator und direkter Anfragen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://speisely.de/partner/webseiten" },
    ],
  }),
  component: WebsiteCreationPage,
});

const SHOWCASE_PROJECTS = [
  {
    title: "Partyservice Küpper",
    category: "BBQ & Event-Catering NRW",
    location: "Mönchengladbach & NRW",
    url: "https://partyservicekuepper.de/",
    badge: "Live · Catering & BBQ",
    description:
      "Kompletter Webauftritt mit All-Inclusive BBQ-Paketen, Event-Kalkulator, regionaler Google-KI-SEO-Struktur und nahtloser Angebotsanfrage.",
    highlights: ["PageSpeed 99/100", "Google AI Overview Schema", "All-Inclusive BBQ Menüs", "100% Mobiloptimiert"],
  },
  {
    title: "Haus Späas",
    category: "Boutique Event Location & Gastronomie",
    location: "Deutschland",
    url: "https://haus-spaas.vercel.app/",
    badge: "Live · Event Location",
    description:
      "Elegante, bildgewaltige Eventlocation-Website für Hochzeiten, Firmenfeiern und Bankette mit modernem Buchungs- und Raumüberblick.",
    highlights: ["Cinematic Hero Layout", "Event-Pakete & Raumplaner", "Direkte Terminanfrage", "Ultra-schnelle Ladezeiten"],
  },
];

function WebsiteCreationPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    type: "catering",
    currentWebsite: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const emailSubject = `Neue Website-Anfrage von ${form.businessName || form.contactName}`;
    const emailBody = `Hallo Speisely Team,

Ich interessiere mich für eine moderne Website für mein Gastro-/Catering-Business:

Betrieb / Name: ${form.businessName}
Ansprechpartner: ${form.contactName}
E-Mail: ${form.email}
Telefon: ${form.phone}
Stadt: ${form.city}
Typ: ${form.type === "catering" ? "Caterer / Partyservice" : form.type === "restaurant" ? "Restaurant / Café" : "Eventlocation"}
Aktuelle Website (falls vorhanden): ${form.currentWebsite || "Keine"}
Besondere Wünsche:
${form.notes}
`;

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.location.href = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      toast.success(isDe ? "Vielen Dank! Dein E-Mail-Programm öffnet sich jetzt." : "Thank you! Opening your email client.");
    }, 600);
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* ─────────────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────────────── */}
        <section className="relative bg-forest text-[#FAF7F0] pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e5242] via-forest to-[#0a1f1a] opacity-90" />
          
          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#E6B84A] backdrop-blur-md border border-white/15">
              <Sparkles className="h-4 w-4" />
              <span>Speisely Digital Suite für Partner</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Deine eigene High-End Website <br className="hidden sm:inline" />
              <span className="text-[#E6B84A]">für Catering &amp; Gastronomie.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Schluss mit veralteten WordPress-Seiten und teuren 5.000 € Agenturen. Wir bauen deinen blitzschnellen,
              mobilen Online-Auftritt mit <strong>integrierter Speisely-Buchungsengine</strong>, Google-KI-SEO und
              Online-Menüs.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#anfrage"
                className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A] text-forest px-8 py-4 text-sm font-black shadow-xl hover:bg-[#f7ca5e] hover:scale-105 transition"
              >
                <span>Website anfragen</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#referenzen"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-7 py-4 text-sm font-bold border border-white/20 hover:bg-white/20 transition"
              >
                <Globe className="h-4 w-4 text-[#E6B84A]" />
                <span>Live-Referenzen ansehen</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            CORE ADVANTAGES (4 Feature Cards)
        ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Zap className="h-7 w-7 text-[#E6B84A] mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">PageSpeed 99+</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Ladezeiten unter 0.8 Sekunden. Keine Ladebalken, keine Abbrüche – maximale Conversion auf jedem Handy.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Search className="h-7 w-7 text-emerald-700 mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">Google &amp; KI-SEO ready</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Strukturierte Schema.org-Daten für Google AI Overviews, Bing und Perplexity – damit Kunden dich lokal sofort finden.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Smartphone className="h-7 w-7 text-[#A85C36] mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">Integrierte Buchung</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Kunden können direkt Menüs zusammenstellen, Gästezahlen kalkulieren und verbindliche Event-Anfragen senden.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <ShieldCheck className="h-7 w-7 text-forest mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">Alles aus einer Hand</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Eigene Domain, Hosting, Wartung, Marktplatz-Reichweite und Speisely-Kassensystem in einem Paket.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            LIVE SHOWCASE / REFERENZEN
        ───────────────────────────────────────────────── */}
        <section id="referenzen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#A85C36] mb-2 block">
              Echte Erfolgsgeschichten
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-forest">
              Websites, die wir für Partner gebaut haben
            </h2>
            <p className="mt-4 text-forest/75 text-base">
              Sieh dir an, wie moderne Gastronomie-Websites heute aussehen und performen:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SHOWCASE_PROJECTS.map((proj, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border-2 border-forest/15 p-7 shadow-xl flex flex-col justify-between hover:border-[#E6B84A] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#A85C36] tracking-wider block mb-1">
                        {proj.category} · {proj.location}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-forest">{proj.title}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 shrink-0">
                      {proj.badge}
                    </span>
                  </div>

                  <p className="text-sm text-forest/80 leading-relaxed mb-6">{proj.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {proj.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-forest/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                  <span className="text-xs text-forest/60 font-medium">Domain: {new URL(proj.url).hostname}</span>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest text-[#FAF7F0] px-5 py-2.5 text-xs font-bold hover:bg-[#E6B84A] hover:text-forest transition"
                  >
                    <span>Website öffnen</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            INQUIRY FORM
        ───────────────────────────────────────────────── */}
        <section id="anfrage" className="bg-forest text-[#FAF7F0] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#E6B84A] mb-2 block">
                Jetzt unverbindlich anfragen
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Lass uns deine neue Website bauen
              </h2>
              <p className="mt-3 text-white/75 text-sm sm:text-base">
                Fülle kurz das Formular aus. Wir melden uns innerhalb von 24 Stunden mit einer kostenlosen
                Ersteinschätzung und einem Designkonzept.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Name deines Betriebs *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="z. B. Gourmet Catering Berlin"
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
                    placeholder="kontakt@meinbetrieb.de"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Telefonnummer
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
                    Standort / Stadt *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="z. B. Köln oder München"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Art des Betriebs
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0f2720] border border-white/20 text-white text-sm focus:outline-none focus:border-[#E6B84A] cursor-pointer"
                  >
                    <option value="catering">Catering &amp; Partyservice</option>
                    <option value="restaurant">Restaurant &amp; Café</option>
                    <option value="location">Eventlocation &amp; Saal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                  Bestehende Website (falls vorhanden)
                </label>
                <input
                  type="text"
                  value={form.currentWebsite}
                  onChange={(e) => setForm({ ...form, currentWebsite: e.target.value })}
                  placeholder="https://mein-altes-restaurant.de"
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                  Was ist dir bei der neuen Website besonders wichtig?
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="z. B. Online-Speisekarte, Terminkalender, moderne Fotos, schnelle Ladezeit..."
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
                      <span>Kostenlose Anfrage absenden</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
