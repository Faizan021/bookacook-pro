// app/page.tsx

import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-surface-dark pt-20">
        <div className="relative z-10 px-6 text-center">
          <LogoMark size={48} color="#e4d9c2" showWordmark />
          <h1 className="mt-8 text-5xl font-bold text-white sm:text-7xl">
            Premium Catering, <br />
            <span className="text-accent-gold">Intelligently Matched.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-dark-muted">
            Discover curated catering for weddings, corporate events, and private gatherings.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              href="/request/new" 
              className="rounded-full bg-accent-gold px-8 py-4 text-lg font-bold text-black transition hover:scale-105"
            >
              Start Your Event
            </Link>
            <Link 
              href="/caterers" 
              className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10"
            >
              Browse Caterers
            </Link>
          </div>
        </div>
      </section>

      {/* Rest of your landing page sections go here... */}
    </main>
  );
}
