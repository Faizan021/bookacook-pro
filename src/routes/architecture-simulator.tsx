import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { ExternalLink, Play, Layers, Cpu, Database, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/architecture-simulator")({
  head: () => ({
    meta: [
      {
        title: "Architecture & Data Flow Simulator — Speisely Engineering",
      },
      {
        name: "description",
        content:
          "Interactive live simulator showing request lifecycles, TanStack Start SSR, Supabase RLS, Stripe Connect payments, ESC/POS thermal printing, and AI SEO graphs.",
      },
    ],
  }),
  component: ArchitectureSimulatorPage,
});

function ArchitectureSimulatorPage() {
  return (
    <SiteShell>
      <div className="bg-[#070a11] min-h-[calc(100vh-80px)] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e6b84a]/10 border border-[#e6b84a]/30 px-3.5 py-1 text-xs font-bold text-[#e6b84a] uppercase tracking-wider mb-3">
                <Cpu className="h-3.5 w-3.5" />
                Engineering Blueprint
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Speisely Interactive Architecture Simulator
              </h1>
              <p className="mt-2 text-white/60 text-sm sm:text-base max-w-2xl">
                Explore real-time data flows, trust boundaries, serverless edge gateways, and hardware integration across our full production stack.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/architecture-simulator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6b84a] text-black px-5 py-3 text-sm font-bold shadow-lg shadow-[#e6b84a]/20 hover:bg-[#c49638] transition"
              >
                <span>Fullscreen Standalone</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#38bdf8] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Edge Compute
              </div>
              <div className="font-bold text-white text-sm sm:text-base">TanStack Start SSR</div>
              <div className="text-xs text-white/50">&lt; 25ms TTFB Nitro Edge</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#10b981] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> Data Security
              </div>
              <div className="font-bold text-white text-sm sm:text-base">Postgres + RLS</div>
              <div className="text-xs text-white/50">Row Level Multi-Tenancy</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#e6b84a] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" /> Event Broker
              </div>
              <div className="font-bold text-white text-sm sm:text-base">WebSockets Pub/Sub</div>
              <div className="text-xs text-white/50">&lt; 45ms Kitchen Dispatch</div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[#a855f7] font-mono text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Payments
              </div>
              <div className="font-bold text-white text-sm sm:text-base">Stripe Connect</div>
              <div className="text-xs text-white/50">0% Direct Vendor Payout</div>
            </div>
          </div>

          {/* Embedded Simulator Iframe */}
          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#090e18]">
            <iframe
              src="/architecture-simulator.html"
              title="Speisely Architecture Simulator"
              className="w-full h-[780px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
