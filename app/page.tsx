import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* NAVIGATION */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#c49840]">
            SPEISLEY
          </Link>

          <nav className="hidden gap-8 md:flex">
            <Link href="/caterers" className="text-sm font-medium text-white/70 transition hover:text-[#c49840]">
              Caterer entdecken
            </Link>
            <Link href="/request/new" className="text-sm font-medium text-white/70 transition hover:text-[#c49840]">
              Event planen
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/70 transition hover:text-white">
              Anmelden
            </Link>
            <Link 
              href="/signup/caterer" 
              className="rounded-full bg-[#c49840] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#d4a950]"
            >
              Partner werden
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen items-center pt-20">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#c49840]/10 blur-[120px]" />
        
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          {/* Left Content */}
          <div className="z-10">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#c49840]/30 bg-[#c49840]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#c49840]">
              Exklusive Catering-Plattform
            </div>
            
            <h1 className="text-5xl font-bold leading-[1.1] sm:text-7xl">
              Kulinarische <br />
              <span className="text-[#c49840] italic">Exzellenz,</span> <br />
              perfekt für Sie.
            </h1>

            <p className="mt-8 max-w-lg text-lg text-white/60 leading-relaxed">
              Finden Sie die besten Catering-Profis für Ihr nächstes Event oder 
              erweitern Sie Ihr Business als Partner auf Speisely.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/request/new"
                className="rounded-xl bg-[#c49840] px-8 py-4 text-lg font-bold text-black transition hover:scale-105 active:scale-95"
              >
                Jetzt Event planen
              </Link>
              <Link
                href="/caterers"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Caterer finden
              </Link>
            </div>
          </div>

          {/* Right Image - High End Food Image */}
          <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px]">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl" />
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
              alt="Premium Catering"
              className="absolute inset-0 h-full w-full rounded-[2rem] object-cover opacity-80"
            />
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-[#111] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <div className="text-[#c49840] text-3xl">✦</div>
              <h3 className="text-xl font-bold">Kuratiert & Exklusiv</h3>
              <p className="text-white/50">Nur geprüfte Profis für höchste Ansprüche.</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#c49840] text-3xl">✦</div>
              <h3 className="text-xl font-bold">Einfache Planung</h3>
              <p className="text-white/50">In wenigen Schritten zum perfekten Menü.</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#c49840] text-3xl">✦</div>
              <h3 className="text-xl font-bold">Wachsen als Partner</h3>
              <p className="text-white/50">Erreichen Sie exklusive Kunden in Ihrer Region.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
