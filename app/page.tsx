import Link from "next/link";
import Image from "next/image";
import { LogoMark } from "@/components/ui/logo-mark";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#192b1a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a4a2c_0%,transparent_70%)] opacity-30" />
      <div className="absolute bottom-[-120px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#c49840] opacity-15 blur-[120px]" />

      <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <LogoMark
          size={32}
          color="#e4d9c2"
          showWordmark
          wordmarkColor="#e4d9c2"
        />

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#e4d9c2]/75 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            Caterer entdecken
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            Event planen
          </Link>
        </nav>

        <Link href="/login" className="text-sm font-bold text-[#e4d9c2]">
          Anmelden
        </Link>
      </header>

      <section className="relative z-20 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-8 lg:grid-cols-2">
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            Digitaler Concierge
          </div>

          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Kulinarische Exzellenz,
            <br />
            <span className="italic text-[#c49840]">perfekt für Sie.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#b7c3b0]">
            Verwandeln Sie Ihr Event in ein unvergessliches Erlebnis. Unsere KI
            verbindet Ihre Vision mit den exklusivsten Caterern der Region.
          </p>

          <div className="mt-10 max-w-xl">
            <div className="flex items-center rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl">
              <input
                type="text"
                placeholder="z. B. Eine elegante Hochzeit für 80 Gäste in Berlin..."
                className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none"
              />
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-105">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8ea18a]">
            <span>Hochzeiten</span>
            <span>•</span>
            <span>Corporate</span>
            <span>•</span>
            <span>Private Dining</span>
          </div>
        </div>

        <div className="relative hidden h-[520px] w-full lg:block">
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
            <Image
              src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Catering Experience"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#192b1a]/70 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-[#faf6ee]/90 p-6 text-black shadow-2xl backdrop-blur-md">
            <div className="text-2xl font-bold text-[#c49840]">4.9/5</div>
            <div className="text-[10px] uppercase tracking-widest text-black/60">
              Exzellenz-Bewertung
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
