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
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 
          PASTE YOUR FULL UI CODE HERE 
          (The beautiful JSX code with the form, the tiles, 
          and the match cards that I provided in the previous step)
      */}
      <div className="p-10">
         <h1 className="text-2xl font-bold">Refinement UI Loaded</h1>
         <p>If you see this, the split is working. Now paste your beautiful UI code here.</p>
         <form action={onSubmit}>
            <input type="hidden" name="request_id" value={request.id} />
            {/* ... rest of your form ... */}
            <button type="submit" disabled={isSubmitting} className="bg-primary p-4 text-white rounded-xl">
               {isSubmitting ? "Saving..." : "Save & Find Matches"}
            </button}
         </form>
      </div>
    </main>
  );
}
