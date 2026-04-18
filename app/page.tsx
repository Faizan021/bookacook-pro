"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckIcon, 
  MapPin, 
  Users, 
  Calendar, 
  Euro, 
  ChevronRight, 
  Sparkles,
  Info
} from "lucide-react";

// NOTE: These are your existing server-side functions. 
// Because this is a 'use client' component, we handle the interaction via a standard form action.
// The actual data fetching is handled by the parent (Server Component).
// Therefore, I am providing the CLIENT-SIDE UI structure.

import { getEventRequestById, updateEventRequest } from "@/lib/dashboard/event-requests"; 
import { getMatchesForEventRequest } from "@/lib/dashboard/event-request-matching";

// --- Types ---
type PageProps = {
  params: Promise<{ id: string }>;
};

// --- Constants (Matching your server logic) ---
const EVENT_TYPE_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate Event" },
  { value: "summerfest", label: "Summer Festival" },
  { value: "private_party", label: "Private Party" },
];

const CATERING_TYPE_OPTIONS = [
  { value: "buffet", label: "Buffet" },
  { value: "finger_food", label: "Finger Food" },
  { value: "plated", label: "Plated Menu" },
  { value: "live_station", label: "Live Station" },
  { value: "bbq", label: "BBQ" },
];

const SERVICE_STYLE_OPTIONS = [
  { value: "drop_off", label: "Drop-off" },
  { value: "staffed", label: "Staffed" },
  { value: "full_service", label: "Full Service" },
];

const CUISINE_OPTIONS = ["Turkish", "Mediterranean", "Italian", "Arabic", "German", "BBQ", "Vegan"];
const DIETARY_OPTIONS = ["Halal", "Vegetarian", "Vegan", "Gluten-free"];
const EXTRA_SERVICE_OPTIONS = ["Drinks", "Staff", "Tableware", "Setup & Cleanup"];

// --- Sub-Components ---

function MatchCard({ match }: { match: any }) {
  const caterer = Array.isArray(match.caterers) ? match.caterers[0] : match.caterers;
  const score = Math.round(match.match_score * 100) || 0;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface-dark-mid text-xl font-bold text-accent-gold">
            {caterer?.business_name?.charAt(0) || "C"}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-dark-foreground">{caterer?.business_name || "Premium Caterer"}</h3>
            <p className="text-sm text-surface-dark-muted">{caterer?.city || "Local Specialist"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">{score}% Match</div>
          <div className="mt-1 h-1 w-16 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent-gold" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {match.match_reasons?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {match.match_reasons.map((reason: string) => (
            <span key={reason} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-accent-gold uppercase tracking-wider">
              <CheckIcon className="h-3 w-3" /> {reason}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
        <a href={`/caterers/${caterer?.slug}`} className="text-sm font-bold text-surface-dark-foreground transition hover:text-accent-gold">View Portfolio</a>
        <button className="rounded-full bg-accent-gold px-5 py-2 text-xs font-bold text-black transition hover:scale-105">Inquire Now</button>
      </div>
    </div>
  );
}

// --- Main Component ---

// Note: We use a Server Component wrapper to fetch data, 
// and then pass it to this Client Component for the interactive UI.
// For the sake of this implementation, I'm assuming this is the client component 
// that handles the complex state of the refinement form.

export default function EventRequestClient({ 
  request, 
  matches 
}: { 
  request: any; 
  matches: any[] 
}) {
  const [loading, setLoading] = useState(false);

  async function handleSave(formData: FormData) {
    setLoading(true);
    // Logic to call the server action goes here...
    // (In a real Next.js app, you'd use useFormStatus or a transition)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. HERO DOSSIER SECTION */}
      <section className="relative bg-surface-dark pt-24 pb-20 text-surface-dark-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[120px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow text-accent-gold">Event Dossier</div>
              <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">
                Refine your <span className="italic">vision</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-surface-dark-muted">
                Your initial concept has been captured. Fine-tune the details to ensure your matches are perfectly curated.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 px-6 py-4 border border-white/10 text-sm">
              <span className="text-surface-dark-muted">Ref: </span>
              <span className="font-mono font-bold">#{request.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* THE AI QUOTE */}
          {request.special_requests && (
            <div className="mt-12 relative max-w-4xl">
              <div className="absolute -left-4 top-0 h-full w-1 bg-accent-gold/30" />
              <div className="flex gap-4">
                <SparklesIcon />
                <blockquote className="text-2xl italic leading-relaxed text-surface-dark-foreground/90">
                  "{request.special_requests}"
                </blockquote>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="mx-auto max-w-7xl px-6 -mt-8 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          
          {/* LEFT: THE REFINEMENT FORM */}
          <div className="space-y-10">
            <form action={handleSave} className="space-y-12">
              
              {/* GROUP 1: CORE LOGISTICS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-accent-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">01. Core Logistics</h3>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Event Type</label>
                    <select name="event_type" defaultValue={request.event_type || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold">
                      <option value="">Select type...</option>
                      {EVENT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Catering Style</label>
                    <select name="catering_type" defaultValue={request.catering_type || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold">
                      <option value="">Select style...</option>
                      {CATERING_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Guest Count</label>
                    <div className="relative">
                       <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <input type="number" name="guest_count" defaultValue={request.guest_count || ""} placeholder="e.g. 50" className="w-full rounded-2xl border-border bg-card pl-10 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Budget Total (€)</label>
                    <div className="relative">
                       <Euro className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <input type="number" name="budget_total" defaultValue={request.budget_total || ""} placeholder="e.g. 3000" className="w-full rounded-2xl border-border bg-card pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                    </div>
                  </div>
                </div>
              </div>

              {/* GROUP 2: CULINARY TILE SELECTORS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-accent-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">02. Culinary Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Cuisine Styles</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CUISINE_OPTIONS.map(option => (
                      <label key={option} className="cursor-pointer">
                        <input type="checkbox" name="cuisine_preferences" value={option} defaultChecked={request.cuisine_preferences?.includes(option)} className="peer hidden" />
                        <div className="rounded-xl border border-border bg-card p-3 text-center text-xs font-medium transition peer-checked:border-accent-gold peer-checked:bg-accent-gold/10 peer-checked:text-accent-gold">
                          {option}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Dietary Requirements</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DIETARY_OPTIONS.map(option => (
                      <label key={option} className="cursor-pointer">
                        <input type="checkbox" name="dietary_requirements" value={option} defaultChecked={request.dietary_requirements?.includes(option)} className="peer hidden" />
                        <div className="rounded-xl border border-border bg-card p-3 text-center text-xs font-medium transition peer-checked:border-accent-gold peer-checked:bg-accent-gold/10 peer-checked:text-accent-gold">
                          {option}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full rounded-full bg-primary py-5 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-95 shadow-xl">
                Update Brief & Refresh Matches
              </button>
            </form>
          </div>

          {/* RIGHT: THE MATCHES GALLERY */}
          <div className="space-y-8">
             <div className="rounded-[2rem] border border-border bg-card p-8">
                <h3 className="text-lg font-semibold">Event Summary</h3>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{request.event_type || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{request.guest_count || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-medium">€{request.budget_total || "—"}</span></div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Curated Matches</h3>
                </div>
                
                {matches.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                    Refining your brief will reveal matches.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match: any, idx: number) => (
                      <MatchCard key={idx} match={match} />
                    ))}
                  </div>
                )}
             </div>
          </div>

        </div>
      </section>
    </main>
  );
}
