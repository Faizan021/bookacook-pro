// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { LogoMark } from "@/components/ui/logo-mark";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-surface-dark overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent-gold/5 blur-[100px]" />

      <header className="relative z-50 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <LogoMark size={32} color="#e4d9c2" showWordmark />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-dark-foreground/70">
          <Link href="/caterers" className="hover:text-accent-gold transition">Browse Caterers</Link>
          <Link href="/request/new" className="hover:text-accent-gold transition">Plan Event</Link>
        </nav>
        <Link href="/login" className="text-sm font-bold text-surface-dark-foreground">Login</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] items-center gap-12">
        
        {/* LEFT SIDE: THE INTELLIGENCE */}
        <div className="order-2 lg:order-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-accent-gold uppercase mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Digital Concierge
          </div>
          
          <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-white sm:text-7xl">
            Premium Catering, <br />
            <span className="italic text-accent-gold">Intelligently Matched.</span>
          </h1>
          
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-surface-dark-muted">
            Describe your vision in your own words. Our AI finds the perfect caterers for your weddings, corporate events, and celebrations.
          </p>

          {/* AI SEARCH BOX (STYLIZED) */}
          <div className="mt-10 group relative max-w-xl">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-accent-gold/20 to-primary/20 opacity-50 blur-xl group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-2xl">
              <input 
                type="text" 
                placeholder="e.g. Elegant wedding for 80 guests in Berlin..."
                className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none"
              />
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold text-black transition hover:scale-105">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-6 text-xs font-medium text-surface-dark-muted uppercase tracking-widest">
            <span>Weddings</span>
            <span>•</span>
            <span>Corporate</span>
            <span>•</span>
            <span>Private Dining</span>
          </div>
        </div>

        {/* RIGHT SIDE: THE VISUAL (LIFESTYLE IMAGE) */}
        <div className="order-1 lg:order-2 relative h-[400px] lg:h-[650px] w-full">
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src="/images/speisely-wedding.png" // REPLACE THIS with a high-end lifestyle image
              alt="Luxury Catering Experience"
              fill
              className="object-cover transition duration-700 hover:scale-105"
              priority
            />
            {/* Subtle Gradient Overlay to blend image into dark background */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-60" />
          </div>
          // Inside your Hero <section> in app/page.tsx
<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-dark">
  {/* 1. The Grain Overlay */}
  <div className="grain-overlay" />

  {/* 2. The "Spotlight" (Radial Gradient) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-30" />

  {/* 3. The Ambient Glow (The light coming from the bottom) */}
  <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent-gold/10 blur-[120px]" />

  <div className="relative z-10 ...">
     {/* Your Hero Content */}
  </div>
</section>
          
          {/* Floating "Premium" Badge */}
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-card p-6 shadow-xl hidden md:block">
            <div className="text-accent-gold font-bold text-xl">4.9/5</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Average Rating</div>
          </div>
        </div>

      </section>
    </main>
  );
}
