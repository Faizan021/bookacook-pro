import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowLeft, BookOpen, ExternalLink, Maximize2, Sparkles, Volume2 } from "lucide-react";

export const Route = createFileRoute("/magazin/reader")({
  head: () => ({
    meta: [
      {
        title: "Digital Flip Magazin — Speisely Edition",
      },
      {
        name: "description",
        content:
          "Das interaktive Speisely 3D-Flip-Magazin: Reportagen, Schnitzel Schmiede, Alzaeem Berlin und FoodTech-Trends 2026.",
      },
      {
        property: "og:title",
        content: "Digital Flip Magazin — Speisely Edition",
      },
      {
        property: "og:description",
        content:
          "Das interaktive Speisely 3D-Flip-Magazin: Reportagen, Schnitzel Schmiede, Alzaeem Berlin und FoodTech-Trends 2026.",
      },
      { property: "og:image", content: "https://speisely.de/hero-cinematic.webp" },
      { property: "og:url", content: "https://speisely.de/magazin/reader" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/magazin/reader" }],
  }),
  component: MagazineReaderPage,
});

function MagazineReaderPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <div className="bg-[#0b0f15] min-h-screen text-white pt-16 sm:pt-20 pb-8 sm:pb-12 px-2 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/magazin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-[#E6B84A] transition"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">
                  {isDe ? "Zurück zur Übersicht" : "Back to Magazine"}
                </span>
                <span className="sm:hidden">{isDe ? "Übersicht" : "Back"}</span>
              </Link>
              <span className="text-white/20">|</span>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#E6B84A] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>{isDe ? "Ausgabe 01" : "Issue 01"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/magazin/edition.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E6B84A] text-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold shadow-md shadow-[#E6B84A]/20 hover:bg-[#c49638] transition shrink-0"
              >
                <span className="hidden sm:inline">
                  {isDe ? "Vollbild-Viewer öffnen ↗" : "Open Fullscreen Viewer ↗"}
                </span>
                <span className="sm:hidden">{isDe ? "Vollbild ↗" : "Fullscreen ↗"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Flipbook Frame */}
          <div className="rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#0d1217] relative">
            <iframe
              src="/magazin/edition.html"
              title="Speisely Magazin Digital Edition"
              className="w-full h-[76vh] min-h-[560px] sm:h-[860px] border-0"
              allow="fullscreen"
              loading="lazy"
            />
          </div>

          {/* Feature Highlights beneath Flipbook */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E6B84A]/10 text-[#E6B84A]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {isDe ? "Realistisches 3D-Blättern" : "Realistic 3D Flip"}
                </h4>
                <p className="text-xs text-white/60 mt-1">
                  {isDe
                    ? "Blättern per Mausklick, Ziehen, Pfeiltasten oder Wischgeste auf Mobilgeräten."
                    : "Turn pages via click, drag, keyboard arrows or mobile touch swipe."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
                <Volume2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {isDe ? "Akustisches Feedback" : "Acoustic Feedback"}
                </h4>
                <p className="text-xs text-white/60 mt-1">
                  {isDe
                    ? "Synthetischer Papier-Sound beim Umblättern für ein authentisches Magazingefühl."
                    : "Synthetic paper friction audio synthesized in real-time."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981]">
                <Maximize2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {isDe ? "Zoom & Seitenübersicht" : "Zoom & Thumbnails"}
                </h4>
                <p className="text-xs text-white/60 mt-1">
                  {isDe
                    ? "Stufenlose Vergrößerung und Schnellnavigation über die Seitenleiste."
                    : "Fluid zoom slider and quick thumbnail navigation drawer."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
