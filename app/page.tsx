// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { LogoMark } from "@/components/ui/logo-mark";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-surface-dark overflow-hidden">
      {/* 1. LUXURY AMBIENT LAYERING */}
      <div className="grain-overlay" />
      
      {/* The "Spotlight" effect using your EXACT CSS variables */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{ background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)' }}
      />
      
      {/* Bottom Glow */}
      <div 
        className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full blur-[120px] opacity-20" 
        style={{ backgroundColor: 'var(--accent-gold)' }}
      />

      <header className="relative z-50 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <LogoMark size={32} color="#e4d9c2" showWordmark />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-dark-foreground/70">
          <Link href="/caterers" className="hover:text-accent-gold transition">Caterer entdecken</Link>
          <Link href="/request/new" className="hover:text-accent-gold transition">Event planen</Link>
        </nav>
        <Link href="/login" className="text-sm font-bold text-surface-dark-foreground">Anmelden</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-120px)] items-center gap-12">
        
        {/* LEFT SIDE: THE INTELLIGENCE (TEXT) */}
        <div className="text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-accent-gold uppercase mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Digitaler Concierge
          </div>
          
          <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-white sm:text-7xl">
            Kulinarische Exzellenz, <br />
            <span className="italic text-accent-gold">perfekt für Sie.</span>
          </h1>
          
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-surface-dark-muted">
            Verwandeln Sie Ihr Event in ein unvergessliches Erlebnis. Unsere KI verbindet Ihre Vision mit den exklusivsten Caterern der Region.
          </p>

          {/* LUXURY AI SEARCH BOX */}
          <div className="mt-10 relative max-w-xl">
            <div className="relative flex items-center rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-2xl shadow-2xl">
              <input 
                type="text" 
                placeholder="z. B. Eine elegante Hochzeit für 80 Gäste in Berlin..."
                className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none"
              />
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold text-black transition hover:scale-105 hover:brightness-110">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-6 text-[10px] font-medium text-surface-dark-muted uppercase tracking-[0.2em]">
            <span>Hochzeiten</span>
            <span>•</span>
            <span>Corporate</span>
            <span>•</span>
            <span>Private Dining</span>
          </div>
        </div>

        {/* RIGHT SIDE: THE BEAUTY (IMAGE) */}
        <div className="relative h-[450px] lg:h-[650px] w-full order-1 lg:order-2">
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <Image 
              src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Catering Experience"
              fill
              className="object-cover transition duration-1000 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-60" />
          </div>
          
          {/* Floating Luxury Badge */}
          <div className="absolute -bottom-8 -left-8 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-md p-6 shadow-2xl hidden md:block">
            <div className="text-accent-gold font-bold text-2xl">4.9/5</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Exzellenz-Bewertung</div>
          </div>
        </div>

      </section>
    </main>
  );
}
