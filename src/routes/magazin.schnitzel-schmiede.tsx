import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, MapPin, Calendar, Award, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/magazin/schnitzel-schmiede")({
  head: () => ({
    meta: [
      { title: "Schnitzel Schmiede beim EineStadt-Fest 2026 — Speisely Magazin" },
      {
        name: "description",
        content:
          "Kulinarische Meile Mönchengladbach: Die Fest-Story der Schnitzel Schmiede beim EineStadt-Fest 2026. Tradition seit 2013, Live-Gastronomie, Catering & Partyservice.",
      },
      {
        name: "keywords",
        content:
          "Schnitzel Schmiede, EineStadt-Fest 2026, Mönchengladbach, Gourmet-Meile, Catering Mönchengladbach, Schnitzel Catering NRW, Speisely Magazin, Live-Gastronomie",
      },
      {
        property: "og:title",
        content: "Schnitzel Schmiede beim EineStadt-Fest 2026 — Speisely Magazin",
      },
      {
        property: "og:description",
        content:
          "Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach. Tradition seit 2013: Entdecke die redaktionelle Fest-Story auf Speisely.",
      },
      { property: "og:image", content: "https://speisely.de/speisely_magazine_cover_v2.png" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://speisely.de/magazin/schnitzel-schmiede" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsArticle",
              "@id": "https://speisely.de/magazin/schnitzel-schmiede#article",
              isPartOf: {
                "@type": "Periodical",
                name: "Speisely Magazin",
                issn: "Ausgabe 01 · 2026",
                publisher: {
                  "@type": "Organization",
                  name: "Speisely",
                  url: "https://speisely.de",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://speisely.de/speisely_logo.png",
                  },
                },
              },
              headline:
                "Schnitzel Schmiede beim EineStadt-Fest 2026: Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach",
              description:
                "Die Fest-Story der Schnitzel Schmiede beim 22. EineStadt-Fest in Mönchengladbach. 13 Jahre Fest-Tradition und handwerkliche Gastronomie.",
              datePublished: "2026-08-16T10:00:00+02:00",
              dateModified: "2026-08-16T18:00:00+02:00",
              author: {
                "@type": "Organization",
                name: "Speisely Redaktion",
                url: "https://speisely.de/magazin",
              },
              publisher: {
                "@type": "Organization",
                name: "Speisely",
                url: "https://speisely.de",
                logo: {
                  "@type": "ImageObject",
                  url: "https://speisely.de/speisely_logo.png",
                },
              },
              image: "https://speisely.de/speisely_magazine_cover_v2.png",
              contentLocation: {
                "@type": "Place",
                name: "EineStadt-Fest (Brucknerallee & Richard-Wagner-Straße)",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Mönchengladbach",
                  postalCode: "41238",
                  addressRegion: "Nordrhein-Westfalen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 51.1611,
                  longitude: 6.4444,
                },
              },
              about: [
                {
                  "@type": "Event",
                  name: "EineStadt-Fest Mönchengladbach 2026",
                  startDate: "2026-08-14",
                  endDate: "2026-08-16",
                  location: {
                    "@type": "Place",
                    name: "Gourmet-Meile Mönchengladbach",
                    address: "Brucknerallee, 41236 Mönchengladbach",
                  },
                },
                {
                  "@type": "LocalBusiness",
                  name: "Schnitzel Schmiede",
                  servesCuisine: "German, Schnitzel, Event Catering",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Mönchengladbach",
                    addressRegion: "NRW",
                    addressCountry: "DE",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SchnitzelSchmiedeStoryPage,
});

function SchnitzelSchmiedeStoryPage() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [showFlipbook, setShowFlipbook] = useState(false);

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

  return (
    <div
      ref={storyRef}
      className="min-h-screen bg-[#FBF7EE] text-[#173C32] font-sans antialiased selection:bg-[#E6B84A] selection:text-[#173C32]"
    >
      {/* 1. SINGLE STICKY HEADER WITH OFFICIAL LOGO & 3D FLIPBOOK TOGGLE */}
      <header className="sticky top-0 z-50 w-full bg-[#173C32]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-auto rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/speisely_logo.png" alt="Speisely" className="h-full w-auto object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/magazin"
            className="hidden sm:inline-block text-xs font-semibold text-[#DDEEE3] hover:text-[#E6B84A] uppercase tracking-wider transition-colors"
          >
            ← Magazin Übersicht
          </Link>

          <a
            href="/magazin_flipbook.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#FBF7EE] border border-white/20 rounded-full text-xs font-bold tracking-tight transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E6B84A]" />
            <span className="hidden sm:inline">3D Flipbook</span>
          </a>

          <Link
            to="/restaurants"
            className="px-4 py-2 bg-[#E6B84A] hover:bg-white text-[#173C32] rounded-full text-xs font-extrabold tracking-tight transition-all shadow-md"
          >
            Speisely öffnen
          </Link>
        </div>
      </header>

      {/* CHAPTER 1 — CINEMATIC HERO */}
      <section className="relative min-h-[92vh] w-full flex items-end justify-start bg-[#173C32] text-[#FBF7EE] overflow-hidden px-6 sm:px-12 lg:px-20 pb-16 lg:pb-24 pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=2000&q=85"
            alt="Goldbraunes Schnitzel frisch aus der Pfanne"
            className="w-full h-full object-cover object-center opacity-40 filter contrast-110 brightness-95 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173C32] via-[#173C32]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#173C32]/95 via-[#173C32]/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl space-y-6 story-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 bg-[#E6B84A]/20 border border-[#E6B84A]/40 text-[#E6B84A] rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Speisely Partner-Story
            </span>
            <span className="text-xs font-semibold text-[#DDEEE3]/80 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#E6B84A]" /> 14. – 16. August 2026
            </span>
            <span className="text-xs font-semibold text-[#DDEEE3]/80 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E6B84A]" /> Mönchengladbach, NRW
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-lg sm:text-2xl font-bold text-[#E6B84A] uppercase tracking-wider">
              EineStadt-Fest 2026 · Mönchengladbach
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black text-[#FBF7EE] leading-[0.95] tracking-tight">
              SCHNITZEL
              <br />
              SCHMIEDE
            </h1>
            <p className="font-serif text-xl sm:text-3xl text-[#DDEEE3] font-semibold italic">
              Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-3 text-xs font-semibold text-[#DDEEE3]/70 uppercase tracking-widest animate-pulse">
            <span>Scrollen um den Festbericht zu lesen</span>
            <span>↓</span>
          </div>
        </div>
      </section>

      {/* CHAPTER 2 — DIE FESTMEILE 2026 (GEO & DEO OPTIMIZED BODY) */}
      <section className="relative min-h-[85vh] w-full bg-[#FBF7EE] text-[#173C32] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none">
          <span className="font-mono font-black text-[35vw] leading-none text-[#173C32]">2026</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-10 text-left">
          <div className="space-y-3 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <span className="px-3.5 py-1 bg-[#DDEEE3] text-[#173C32] font-bold text-xs uppercase tracking-widest rounded-full">
              22. Stadtfest-Jubiläum
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#173C32] leading-tight">
              Schnitzel Schmiede beim EineStadt-Fest 2026
            </h2>
          </div>

          <div className="space-y-6 text-lg sm:text-xl text-[#173C32]/85 leading-relaxed font-normal story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <p>
              Vom <strong>14. bis 16. August 2026</strong> verwandelte das EineStadt-Fest die
              Brucknerallee, Richard-Wagner-Straße und Breite Straße in Mönchengladbach erneut in
              eine lebendige kulinarische, musikalische und künstlerische Meile.
            </p>
            <p>
              Zum zweiundzwanzigsten Mal verband das Fest die Stadtteile mit einem
              abwechslungsreichen Bühnenprogramm, der großen KidsWorld, einem Kunst- und
              Handwerkermarkt sowie der beliebten Gourmet-Meile mit internationalen kulinarischen
              Angeboten.
            </p>
            <p>
              Auch die <strong>Schnitzel Schmiede</strong> war 2026 wieder Teil des gastronomischen
              Angebots. Mit frisch zubereiteten und heiß servierten Schnitzeln ergänzte sie die
              kulinarische Vielfalt des Stadtfestes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#173C32]/5 border-l-4 border-[#E6B84A] story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <blockquote className="font-serif text-xl sm:text-2xl text-[#173C32] font-bold italic leading-snug">
              „Die Messe des guten Geschmacks für Mönchengladbach und die Region.“
            </blockquote>
            <div className="text-xs font-extrabold text-[#7FA46B] uppercase tracking-widest mt-3">
              — WDR Lokalzeit Düsseldorf, Live-Berichterstattung vom EineStadt-Fest 2013
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — TRADITION SEIT 2013 */}
      <section className="relative min-h-[90vh] w-full bg-[#173C32] text-[#FBF7EE] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <img
                src="https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=1200&q=85"
                alt="Frisch zubereitetes Schnitzel Wiener Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173C32]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-1.5 bg-[#E6B84A] text-[#173C32] text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                  Heiß serviert
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3 story-reveal opacity-0 translate-y-6 transition-all duration-700">
              <span className="font-mono text-5xl sm:text-7xl font-black text-[#E6B84A]">2013</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#FBF7EE]">
                Beständigkeit auf der Gourmet-Meile
              </h3>
              <p className="text-base sm:text-lg text-[#FBF7EE]/80 leading-relaxed pt-2">
                Bereits seit 2013 nimmt die Schnitzel Schmiede am EineStadt-Fest teil. Durch diese
                langjährige Beteiligung ist sie für viele Besucherinnen und Besucher zu einem
                vertrauten Bestandteil der Gourmet-Meile geworden.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4 story-reveal opacity-0 translate-y-6 transition-all duration-700">
                <span className="font-mono text-2xl font-bold text-[#E6B84A]/60">01</span>
                <p className="text-lg font-semibold text-[#FBF7EE]">
                  Die Musik läuft über die Festmeile.
                </p>
              </div>
              <div className="flex items-start gap-4 story-reveal opacity-0 translate-y-6 transition-all duration-700">
                <span className="font-mono text-2xl font-bold text-[#E6B84A]/60">02</span>
                <p className="text-lg font-semibold text-[#FBF7EE]">
                  Besucherinnen und Besucher ziehen durch die Straßen.
                </p>
              </div>
              <div className="flex items-start gap-4 story-reveal opacity-0 translate-y-6 transition-all duration-700">
                <span className="font-mono text-2xl font-bold text-[#E6B84A]/60">03</span>
                <p className="text-lg font-semibold text-[#FBF7EE]">
                  Frisch zubereitete Schnitzel werden heiß serviert.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border-l-4 border-[#E6B84A] backdrop-blur-sm story-reveal opacity-0 translate-y-6 transition-all duration-700">
              <blockquote className="font-serif text-xl font-bold text-[#E6B84A] italic">
                „Frisch zubereitet. Heiß serviert.“
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 4 — AUF SPEISELY ENTDECKT (Clean Centered Editorial) */}
      <section className="relative min-h-[75vh] w-full bg-[#FBF7EE] text-[#173C32] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center justify-center text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DDEEE3] text-[#173C32] font-bold text-xs uppercase tracking-widest rounded-full story-reveal opacity-0 translate-y-6 transition-all duration-700">
            Partnernetzwerk
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#173C32] leading-[1.05] tracking-tight story-reveal opacity-0 translate-y-6 transition-all duration-700">
            AUF SPEISELY ENTDECKT.
          </h2>

          <p className="text-xl sm:text-2xl text-[#173C32]/90 font-medium leading-relaxed max-w-2xl mx-auto story-reveal opacity-0 translate-y-6 transition-all duration-700">
            Speisely stellt lokale Restaurants, Caterer und Eventanbieter vor und macht die
            Geschichten hinter ihren Angeboten sichtbar.
          </p>

          <div className="pt-4 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#173C32] text-[#E6B84A] hover:bg-[#E6B84A] hover:text-[#173C32] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Partner auf Speisely entdecken</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CHAPTER 5 — EIN PARTNER. FÜNF MÖGLICHKEITEN. */}
      <section className="relative min-h-[90vh] w-full bg-[#173C32] text-[#FBF7EE] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center">
        <div className="max-w-5xl mx-auto w-full space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 flex items-center justify-center story-reveal opacity-0 translate-y-6 transition-all duration-700">
              <div className="font-mono font-black text-[30vw] lg:text-[18vw] text-[#E6B84A]/90 leading-none select-none drop-shadow-2xl">
                5
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-3 story-reveal opacity-0 translate-y-6 transition-all duration-700">
                <span className="text-xs font-bold text-[#DDEEE3] uppercase tracking-widest">
                  Leistungsangebot
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-black text-[#FBF7EE] leading-tight">
                  EIN PARTNER.
                  <br />
                  FÜNF MÖGLICHKEITEN.
                </h2>
              </div>

              <div className="space-y-4 border-t border-white/15 pt-6 story-reveal opacity-0 translate-y-6 transition-all duration-700">
                <div className="flex items-center gap-6 py-2 border-b border-white/10">
                  <span className="font-mono text-lg font-bold text-[#E6B84A]">01</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#FBF7EE] tracking-wide">
                    RESTAURANT
                  </span>
                </div>
                <div className="flex items-center gap-6 py-2 border-b border-white/10">
                  <span className="font-mono text-lg font-bold text-[#E6B84A]">02</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#FBF7EE] tracking-wide">
                    SCHNITZELGERICHTE
                  </span>
                </div>
                <div className="flex items-center gap-6 py-2 border-b border-white/10">
                  <span className="font-mono text-lg font-bold text-[#E6B84A]">03</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#FBF7EE] tracking-wide">
                    CATERING
                  </span>
                </div>
                <div className="flex items-center gap-6 py-2 border-b border-white/10">
                  <span className="font-mono text-lg font-bold text-[#E6B84A]">04</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#FBF7EE] tracking-wide">
                    PARTYSERVICE
                  </span>
                </div>
                <div className="flex items-center gap-6 py-2 border-b border-white/10">
                  <span className="font-mono text-lg font-bold text-[#E6B84A]">05</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#FBF7EE] tracking-wide">
                    LIEFERSERVICE
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 max-w-4xl mx-auto text-center story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-base sm:text-lg text-[#FBF7EE]/90 leading-relaxed">
              Die Schnitzel Schmiede ist Teil des Speisely Partnernetzwerks. Über Speisely entdecken
              Gäste lokale Betriebe, lernen ihre Angebote kennen und finden Restaurant-, Catering-
              oder Eventmöglichkeiten für ihren Anlass.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER 6 — SPEISELY GATEWAY */}
      <section className="relative min-h-[85vh] w-full bg-[#FBF7EE] text-[#173C32] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="space-y-6 text-center max-w-3xl mx-auto story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#173C32] leading-[1.05] tracking-tight">
              GUTES ESSEN ENTDECKEN.
              <br />
              LOKALE PARTNER FINDEN.
            </h2>
            <p className="text-lg sm:text-xl text-[#173C32]/80 font-normal leading-relaxed">
              Speisely verbindet Gäste mit Restaurants, Caterern und Eventanbietern. Entdecke
              authentische Geschichten, finde passende Angebote und frage direkt beim jeweiligen
              Anbieter an.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 story-reveal opacity-0 translate-y-6 transition-all duration-700">
            <Link
              to="/restaurants"
              className="group p-8 rounded-3xl bg-white border border-[#173C32]/10 hover:border-[#E6B84A] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#E6B84A] uppercase tracking-widest">
                  01 · Speiselokal
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#173C32]">
                  RESTAURANTS ENTDECKEN
                </h3>
                <p className="text-xs text-[#173C32]/70 leading-relaxed">
                  Lokale Restaurants, ihre Angebote und die Geschichten dahinter kennenlernen.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#173C32] group-hover:text-[#E6B84A] transition-colors pt-2">
                <span>Restaurants ansehen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to="/catering"
              className="group p-8 rounded-3xl bg-[#173C32] text-[#FBF7EE] border border-[#173C32] hover:border-[#E6B84A] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#E6B84A] uppercase tracking-widest">
                  02 · Event-Food
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#FBF7EE] group-hover:text-[#E6B84A] transition-colors">
                  CATERING ANFRAGEN
                </h3>
                <p className="text-xs text-[#FBF7EE]/70 leading-relaxed">
                  Anforderungen beschreiben und passende Cateringpartner entdecken.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#E6B84A] pt-2">
                <span>Catering finden</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to="/planner"
              className="group p-8 rounded-3xl bg-white border border-[#173C32]/10 hover:border-[#E6B84A] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#E6B84A] uppercase tracking-widest">
                  03 · Full-Service
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#173C32]">EVENTS PLANEN</h3>
                <p className="text-xs text-[#173C32]/70 leading-relaxed">
                  Passende Anbieter für private und geschäftliche Veranstaltungen finden.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#173C32] group-hover:text-[#E6B84A] transition-colors pt-2">
                <span>Planung starten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CHAPTER 7 — CONVERSION FINALE */}
      <section className="relative min-h-[80vh] w-full bg-[#173C32] text-[#FBF7EE] py-24 px-6 sm:px-12 lg:px-20 flex flex-col justify-between items-center text-center">
        <div className="max-w-4xl mx-auto space-y-10 my-auto story-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#E6B84A] uppercase tracking-widest">
              Gemeinsam Genießen
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#FBF7EE] leading-tight">
              DEIN NÄCHSTES KULINARISCHES ERLEBNIS BEGINNT HIER.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <div className="w-full sm:w-auto space-y-2">
              <span className="block text-[11px] font-bold text-[#DDEEE3] uppercase tracking-wider">
                Für Gäste
              </span>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E6B84A] hover:bg-white text-[#173C32] font-bold text-sm uppercase tracking-wider rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Speisely Entdecken</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="w-full sm:w-auto space-y-2">
              <span className="block text-[11px] font-bold text-[#DDEEE3] uppercase tracking-wider">
                Für Betriebe
              </span>
              <Link
                to="/partners"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white hover:text-[#173C32] text-[#FBF7EE] border border-white/25 font-bold text-sm uppercase tracking-wider rounded-2xl backdrop-blur-md shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Partner Werden</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* REFINED PUBLIC FOOTER DISCLAIMER */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-white/10 text-center space-y-3 story-reveal opacity-0 translate-y-6 transition-all duration-700">
          <p className="text-xs text-[#FBF7EE]/60 leading-relaxed font-normal">
            Diese redaktionelle Partner-Story basiert auf öffentlich zugänglichen Informationen
            sowie auf freigegebenem Bildmaterial. Sie ist eine redaktionelle Präsentation und keine
            unabhängige Restaurantbewertung.
          </p>
          <div className="text-[11px] text-[#FBF7EE]/40 font-semibold tracking-wider">
            © 2026 Speisely · Redaktionelle Partner-Story · speisely.de
          </div>
        </div>
      </section>
    </div>
  );
}
