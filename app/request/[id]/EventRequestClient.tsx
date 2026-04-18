// app/request/[id]/EventRequestClient.tsx
"use client";

import { useState } from "react";
import { CheckIcon, Sparkles } from "lucide-react";

// --- Types ---
type Props = {
  request: any;
  matches: any[];
  handleSave: (formData: FormData) => Promise<void>;
};

// --- Sub-Components ---
function MatchCard({ match }: { match: any }) {
  const caterer = Array.isArray(match.caterers) ? match.caterers[0] : match.caterers;
  const score = Math.round(match.match_score * 100) || 0;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
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
            <span key={reason} className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-medium text-accent-gold uppercase tracking-wider">
              <CheckIcon className="h-3 w-3" /> {reason}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <a href={`/caterers/${caterer?.slug}`} className="text-sm font-bold text-surface-dark-foreground transition group-hover:text-accent-gold">View Portfolio</a>
        <button className="rounded-full bg-accent-gold px-5 py-2 text-xs font-bold text-black transition hover:scale-105">Inquire Now</button>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function EventRequestClient({ request, matches, handleSave }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await handleSave(formData);
    } catch (error) {
      console.error("Error saving request:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative bg-surface-dark pt-24 pb-20 text-surface-dark-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[100px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow text-accent-gold">Your Event Dossier</div>
              <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">
                Refine your <span className="italic">vision</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-surface-dark-muted">
                Your initial concept has been captured. Fine-tune the details below to ensure your matches are perfectly curated.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-6 py-4 border border-white/10 text-sm">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-surface-dark-muted">Request Reference</div>
                <div className="font-mono font-bold">#{request.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
          </div>

          {request.special_requests && (
            <div className="mt-12 relative max-w-4xl">
              <div className="absolute -left-4 top-0 h-full w-1 bg-accent-gold/30" />
              <div className="flex gap-4">
                <Sparkles className="h-6 w-6 text-accent-gold shrink-0" />
                <blockquote className="text-2xl italic leading-relaxed text-surface-dark-foreground/90">
                  "{request.special_requests}"
                </blockquote>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 -mt-8 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            <form action={onSubmit} className="space-y-12">
              <input type="hidden" name="request_id" value={request.id} />

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
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="private_party">Private Party</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Catering Style</label>
                    <select name="catering_type" defaultValue={request.catering_type || ""} className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold">
                      <option value="">Select style...</option>
                      <option value="buffet">Buffet</option>
                      <option value="finger_food">Finger Food</option>
                      <option value="plated">Plated Menu</option>
                      <option value="live_station">Live Station</option>
                      <option value="bbq">BBQ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Guest Count</label>
                    <input type="number" name="guest_count" defaultValue={request.guest_count || ""} placeholder="e.g. 50" className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Budget Total (€)</label>
                    <input type="number" name="budget_total" defaultValue={request.budget_total || ""} placeholder="e.g. 3000" className="w-full rounded-2xl border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-accent-gold" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-accent-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">02. Culinary Preferences</h3>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Cuisine Styles</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Turkish", "Mediterranean", "Italian", "Arabic", "German", "BBQ", "Vegan"].map(option => (
                      <label key={option} className="cursor-pointer">
                        <input type="checkbox" name="cuisine_preferences" value={option} defaultChecked={request.cuisine_preferences?.includes(option)} className="peer hidden" />
                        <div className="rounded-xl border border-border bg-card p-3 text-center text-xs font-medium transition peer-checked:border-accent-gold peer-checked:bg-accent-gold/10 peer-checked:text-accent-gold">
                          {option}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary py-5 text-lg font-bold text-primary-foreground transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Updating Dossier..." : "Finalize Brief & Reveal Matches"}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <h3 className="mb-6 text-lg font-semibold">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{request.event_type || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{request.guest_count || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-medium">€{request.budget_total || "—"}</span></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary px-2">Curated Matches</h3>
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
