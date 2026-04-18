"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getEventRequestById, 
  updateEventRequest, 
  generateMatchesForEventRequest, 
  getMatchesForEventRequest 
} from "@/lib/dashboard/event-requests"; // NOTE: You may need to adjust these imports based on your actual file structure
import { SparklesIcon } from "@/components/ui/sparkles-icon";
import { ArrowRightIcon } from "@/components/ui/arrow-right-icon";
import { CheckIcon } from "lucide-react"; // Install lucide-react if not present: npm install lucide-react

// --- Constants ---
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
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-surface-dark-mid">
            {/* Placeholder for Caterer Logo */}
            <div className="flex h-full w-full items-center justify-center text-accent-gold font-bold">
              {caterer?.business_name?.charAt(0) || "C"}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-dark-foreground">{caterer?.business_name || "Premium Caterer"}</h3>
            <p className="text-sm text-surface-dark-muted">{caterer?.city || "Local Specialist"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-widard text-accent-gold">{score}% Match</div>
          <div className="mt-1 h-1 w-12 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent-gold" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {/* Match Reasons - The "Why" */}
      {match.match_reasons?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {match.match_reasons.map((reason: string) => (
            <span key={reason} className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-medium text-accent-gold uppercase tracking-wider">
              <CheckIcon className="h-3 w-3" /> {reason}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <Link 
          href={`/caterers/${caterer?.slug}`}
          className="text-sm font-bold text-surface-dark-foreground transition group-hover:text-accent-gold"
        >
          View Portfolio
        </Link>
        <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-accent-gold">
          Inquire Now
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---

export default async function EventRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getEventRequestById(id);
  const matches = await getMatchesForEventRequest(id).catch(() => []);

  // Server Action Wrapper
  async function handleSave(formData: FormData) {
    "use server";
    // (Logic remains the same as your provided saveRequest but cleaned up)
    const guest_count = formData.get("guest_count") ? Number(formData.get("guest_count") as string) : undefined;
    const budget_total = formData.get("budget_total") ? Number(formData.get("budget_total") as string) : undefined;

    await updateEventRequest(id, {
      event_type: formData.get("event_type") as string || undefined,
      catering_type: formData.get("catering_type") as string || undefined,
      guest_count,
      city: formData.get("city") as string || undefined,
      postal_code: formData.get("postal_code") as string || undefined,
      service_style: formData.get("service_style") as string || undefined,
      event_date: formData.get("event_date") as string || undefined,
      budget_total,
      special_requests: formData.get("special_requests") as string || undefined,
      cuisine_preferences: formData.getAll("cuisine_preferences").map(v => String(v)),
      dietary_requirements: formData.getAll("dietary_requirements").map(v => String(v)),
      extra_services: formData.getAll("extra_services").map(v => String(v)),
      status: "submitted",
    });

    await generateMatchesForEventRequest(id);
    // In a real Next.js app with Server Actions, you might use redirect() 
    // but for a client-side feeling, we'll rely on the transition.
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* 1. HERO DOSSIER SECTION */}
      <section className="relative bg-surface-dark pt-24 pb-16 text-surface-dark-foreground">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[100px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow text-accent-gold">Your Event Dossier</div>
              <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
                Refine your <span className="italic">vision</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-surface-dark-muted">
                We've captured your initial thoughts. Fine-tune the details below to ensure your matches are perfectly curated.
              </p>
            </div>
            
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-6 py-4 backdrop-blur-md border border-white/10">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-surface-dark-muted">Request Reference</div>
                <div className="text-sm font-mono font-bold">#{request.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* The AI Quote - This is the emotional hook */}
          {request.special_requests && (
            <div className="mt-12 relative max-w-4xl">
              <SparklesIcon />
              <blockquote className="relative z-10 text-2xl italic leading-relaxed text-surface-dark-foreground/90">
                "{request.special_requests}"
              </blockquote>
              <div className="absolute -left-4 top-0 h-full w-1 bg-accent-gold/30" />
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          
          {/* LEFT: THE REFINEMENT FORM */}
          <div className="space-y-10">
            <form action={handleSave} className="space-y-12">
              <input type="hidden" name="request_id" value={request.id} />

              {/* GROUP 1: CORE LOGISTICS */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">01. Core Logistics</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Event Type</label>
                    <select name="event_type" defaultValue={request.event_type || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm focus:ring-2 focus:ring-accent-gold outline-none">
                      <option value="">Select type...</option>
                      {EVENT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Catering Style</label>
                    <select name="catering_type" defaultValue={request.catering_type || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm focus:ring-2 focus:ring-accent-gold outline-none">
                      <option value="">Select style...</option>
                      {CATERING_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Guest Count</label>
                    <input type="number" name="guest_count" defaultValue={request.guest_count || ""} placeholder="e.g. 50" className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Event Date</label>
                    <input type="date" name="event_date" defaultValue={request.event_date || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Location (City)</label>
                    <input type="text" name="city" defaultValue={request.city || ""} placeholder="e.g. Berlin" className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Total Budget (€)</label>
                    <input type="number" name="budget_total" defaultValue={request.budget_total || ""} placeholder="e.g. 3000" className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                </div>
              </div>

              {/* GROUP 2: CULINARY PREFERENCES (TILE SELECTOR) */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">02. Culinary Preferences</h3>
                
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Dietary Needs</label>
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

              {/* GROUP 3: FINAL NOTES */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Additional Details</label>
                <textarea 
                  name="special_requests" 
                  rows={4} 
                  defaultValue={request.special_requests || ""}
                  className="w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Any specific atmosphere or service needs?"
                />
              </div>

              <button type="submit" className="w-full rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-95">
                Finalize Brief & Reveal Matches
              </button>
            </form>
          </div>

          {/* RIGHT: MATCHES & SUMMARY */}
          <div className="space-y-8">
            {/* SUMMARY CARD */}
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <h3 className="mb-6 text-lg font-semibold">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{request.event_type || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{request.guest_count || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-medium">€{request.budget_total || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{request.city || "—"}</span></div>
              </div>
            </div>

            {/* MATCHES CARD */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Curated Matches</h3>
                <span className="text-xs text-muted-foreground">{matches.length} found</span>
              </div>
              
              {matches.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  Click "Finalize" to generate matches.
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
