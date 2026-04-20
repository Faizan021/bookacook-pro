"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, BrainCircuit, Compass, Star } from "lucide-react";

export default function LandingPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate the AI "thinking" before sending them to the marketplace
    setTimeout(() => {
      window.location.href = "/caterers"; 
    }, 2000);
  };

  return (
    <main className="relative min-h-screen bg-[#faf9f6] text-[#2d2926] overflow-x-hidden font-serif">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c49840]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a5d4e]/5 blur-[120px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      {/* Navigation */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#4a5d4e]">Speisely</div>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2926]/50 md:flex">
          <Link href="/how-it-works" className="hover:text-[#c49840] transition-colors">The Technology</Link>
          <Link href="/philosophy" className="hover:text-[#c49840] transition-colors">Our Philosophy</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#2d2926] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* HERO SECTION: The Emotional Hook */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-12">
          <Sparkles className="h-3.5 w-3.5" /> Intelligent Culinary Concierge
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-[#2d2926] sm:text-7xl md:text-8xl mb-8">
          Crafting <br />
          <span className="italic text-[#c49840]">Unforgettable</span> <br />
          Moments.
        </h1>
        
        <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#4a5d4e]/80 font-light mb-16">
          Don't just search for catering. Describe your vision, and let our AI curate a bespoke culinary experience tailored to your soul.
        </p>

        {/* THE AI SEARCH BOX (The main CTA) */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleAISearch} className="relative group">
            <div className="relative flex items-center rounded-[2rem] border border-[#e0ddd5] bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all focus-within:border-[#c49840]/50">
              <input
                type="text"
                placeholder="Describe your dream event (e.g. 'A minimalist sunset dinner in Berlin'...)"
                className="w-full bg-transparent px-8 py-5 text-xl text-[#2d2926] placeholder:text-[#4a5d4e]/30 focus:outline-none font-light italic"
              />
              <button 
                type="submit"
                disabled={isProcessing}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-white transition hover:scale-110 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
              </button>
            </div>
            <p className="mt-6 text-xs text-[#4a5d4e]/50 uppercase tracking-widest font-medium">
              Powered by Culinary Intelligence
            </p>
          </form>

          {/* THE SECOND PATH: The "Browse" Button */}
          <div className="mt-12">
            <p className="text-xs text-[#4a5d4e]/40 uppercase tracking-[0.2em] mb-4">Or prefer the traditional way?</p>
            <Link 
              href="/caterers" 
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#4a5d4e] hover:text-[#c49840] transition-colors"
            >
              Browse our Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* THE TECHNOLOGY SECTION (The "Grant" Section) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-[#e0ddd5]">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f1ea] text-[#c49840]">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Semantic Intent</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]/70">
              Our engine understands the nuance of your request, matching "mood" to culinary style.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f1ea] text-[#c49840]">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Curated Matching</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]/70">
              We don't just find food; we find the perfect partner for your specific event logistics.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f1ea] text-[#c49840]">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Vetted Excellence</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]/70">
              Every partner in our network is hand-selected for quality, reliability, and style.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#e0ddd5] bg-[#f4f1ea] py-16 text-center">
        <div className="text-sm font-serif tracking-widest uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#4a5d4e]/50">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
