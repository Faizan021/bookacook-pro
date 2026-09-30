import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { ExternalLink, Play, Layers, Cpu, Database, ShieldCheck, Globe } from "lucide-react";

export const Route = createFileRoute("/architecture-simulator")({
  head: () => ({
    meta: [
      {
        title: "Architecture & Data Flow Simulator — Speisely Engineering",
      },
      {
        name: "description",
        content:
          "Interactive live simulator showing request lifecycles, TanStack Start SSR, Supabase RLS, Stripe Connect payments, ESC/POS thermal printing, and AI SEO graphs in English and German.",
      },
    ],
  }),
  component: ArchitectureSimulatorPage,
});

function ArchitectureSimulatorPage() {
  const { lang, t } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <div className="bg-[#070a11] min-h-[calc(100vh-80px)] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e6b84a]/10 border border-[#e6b84a]/30 px-3.5 py-1 text-xs font-bold text-[#e6b84a] uppercase tracking-wider mb-3">
                <Cpu className="h-3.5 w-3.5" />
                {isDe ? "System-Architektur & Datenfluss" : "Engineering Blueprint & Data Flow"}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {isDe
                  ? "Interaktiver Speisely Architektur-Simulator"
                  : "Speisely Interactive Architecture Simulator"}
              </h1>
              <p className="mt-2 text-white/60 text-sm sm:text-base max-w-2xl">
                {isDe
                  ? "Erlebe Datenströme, Sicherheitsgrenzen, Serverless Edge Gateways und Kassenhardware live in Aktion — für Gastronomen und Entwickler verständlich aufbereitet."
                  : "Explore real-time request lifecycles, trust boundaries, serverless edge gateways, and hardware integrations across our production stack in simple words & deep technical detail."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/architecture-simulator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6b84a] text-black px-5 py-3 text-sm font-bold shadow-lg shadow-[#e6b84a]/20 hover:bg-[#c49638] transition"
              >
                <span>{isDe ? "Vollbild-Simulator öffnen ↗" : "Open Fullscreen Simulator ↗"}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#38bdf8] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> {isDe ? "Edge Compute" : "Edge Compute"}
              </div>
              <div className="font-bold text-white text-sm sm:text-base">TanStack Start SSR</div>
              <div className="text-xs text-white/50">{isDe ? "< 25ms Ladezeit in ganz DE" : "< 25ms TTFB Nitro Edge"}</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#10b981] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> {isDe ? "Datensicherheit" : "Data Security"}
              </div>
              <div className="font-bold text-white text-sm sm:text-base">Postgres + RLS</div>
              <div className="text-xs text-white/50">{isDe ? "100% Mandantentrennung" : "Strict Row Level Security"}</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#e6b84a] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" /> {isDe ? "Live-Funk" : "Live Event Bus"}
              </div>
              <div className="font-bold text-white text-sm sm:text-base">WebSockets Pub/Sub</div>
              <div className="text-xs text-white/50">{isDe ? "< 45ms Küchenalarm" : "< 45ms Kitchen Alert"}</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#a855f7] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> {isDe ? "Bezahlung" : "Payments"}
              </div>
              <div className="font-bold text-white text-sm sm:text-base">Stripe Connect</div>
              <div className="text-xs text-white/50">{isDe ? "0% Speisely-Provision" : "0% Direct Vendor Payout"}</div>
            </div>
          </div>

          {/* Embedded Simulator Iframe */}
          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#090e18]">
            <iframe
              src="/architecture-simulator.html"
              title="Speisely Architecture Simulator"
              className="w-full h-[820px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
