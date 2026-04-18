"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRequestDraftAction } from "@/app/request/new/actions";
import { SparklesIcon } from "@/components/ui/sparkles-icon"; // I will provide this below
import { ArrowRightIcon } from "@/components/ui/arrow-right-icon"; // I will provide this below

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [caterer, setCaterer] = useState(initialCaterer);
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  // Simulate "AI intelligence" for the UI
  // In a real app, you'd call a lightweight API to parse the text as they type
  useEffect(() => {
    if (query.length > 10) {
      const timeout = setTimeout(() => {
        setIsThinking(true);
        // Mocking the AI detection of occasion
        if (query.toLowerCase().includes("wedding")) setOccasion("wedding");
        else if (query.toLowerCase().includes("corporate")) setOccasion("corporate");
        else if (query.toLowerCase().includes("party")) setOccasion("private_party");
        else if (query.toLowerCase().includes("ramadan")) setOccasion("ramadan");
        
        setTimeout(() => setIsThinking(false), 800);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [query]);

  async function handleContinue() {
    if (!query.trim()) {
      setError("Please tell us a little about your event.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const draft = await createRequestDraftAction({
        ai_query: query,
        event_type: occasion || null,
        preferred_caterer_id: caterer || null,
      });

      // Elegant transition
      router.push(`/request/${draft.id}`);
    } catch (err) {
      console.error(err);
      setError("The concierge is momentarily unavailable. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dark">
      {/* Ambient Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-3xl px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-accent-gold uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold"></span>
            </span>
            Digital Concierge
          </div>
          <h1 className="text-balance text-4xl font-medium tracking-tight text-surface-dark-foreground sm:text-6xl">
            How can we assist <br />
            <span className="italic text-accent-gold">your event?</span>
          </h1>
          <p className="mt-6 text-lg text-surface-dark-muted">
            Describe your vision in your own words. Our AI will handle the details.
          </p>
        </div>

        <div className="relative group">
          {/* The Input Container */}
          <div className={`relative rounded-[2.5rem] border transition-all duration-500 ${
            isThinking ? "border-accent-gold/50 shadow-[0_0_30px_rgba(196,152,64,0.15)]" : "border-white/10 bg-white/5"
          } backdrop-blur-xl p-4 md:p-6`}>
            
            <div className="flex flex-col gap-6">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={5}
                  placeholder="e.g., An elegant wedding for 80 guests in Berlin, mostly vegetarian, around €35 per person..."
                  className="w-full resize-none bg-transparent px-4 py-2 text-xl leading-relaxed text-surface-dark-foreground placeholder:text-surface-dark-muted/50 focus:outline-none"
                />
                
                {/* AI "Thinking" Indicator */}
                {isThinking && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs font-medium text-accent-gold animate-pulse">
                    <SparklesIcon />
                    <span>AI is analyzing...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                {/* Smart Metadata (Visual only, to show user the AI is working) */}
                <div className="flex flex-wrap gap-2">
                  {occasion && (
                    <span className="flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-3 py-2 text-xs font-medium text-accent-gold">
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </span>
                  )}
                  {query.split(' ').length > 5 && (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-surface-dark-foreground/70">
                      {query.split(' ').length} words
                    </span>
                  )}
                </div>

                <button
                  onClick={handleContinue}
                  disabled={loading || !query.trim()}
                  className={`group flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 ${
                    loading || !query.trim() 
                      ? "bg-white/5 text-white/20 cursor-not-allowed" 
                      : "bg-accent-gold text-black hover:scale-105 hover:brightness-110 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Starting...
                    </span>
                  ) : (
                    <>
                      Continue to Briefing
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute -bottom-12 left-0 right-0 text-center text-sm font-medium text-red-400 animate-bounce">
              {error}
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-xs tracking-widest text-surface-dark-muted/50 uppercase">
          Speisely — The Intelligence of Hospitality
        </p>
      </div>
    </main>
  );
}
