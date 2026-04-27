"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, BrainCircuit, CheckCircle2, ShieldCheck, 
  Sparkles 
} from "lucide-react";

// Using your existing library paths from your file structure
import { useT } from "@/lib/i18n/context";
import { parseHeroIntent } from "@/lib/parser";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

export default function HomePage() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const intent = useMemo(() => 
    parseHeroIntent(heroQuery || t("home.aiDemo.request")), 
    [heroQuery, t]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    router.push(q ? `/request/new?q=${encodeURIComponent(q)}` : "/request/new");
  };

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#201a17]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#ddd4c8] bg-[#f5f1ea]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark size={18} color="#2d4736" />
            <span className="text-xl font-bold text-[#2d4736]">Speisely</span>
          </Link>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/request/new" className="rounded-full bg-[#2d4736] px-6 py-2.5 text-sm font-bold text-white shadow-md">
              {t("home.editorialCtaPrimary")}
            </Link>
          </div>
        </div>
      </header>

      {/* --- Restored Hero Section --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#2d4736]">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80"
          alt="Premium Event"
          fill
          priority
          className="object-cover opacity-50"
        />
        {/* Gradient overlay fixes the "messed up" dark block */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#f5f1ea]" />
        
        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#f2dfbf] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.badge")}
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight text-white">
            {t("home.editorialHeroTitle")}
          </h1>

          <form onSubmit={handleSearch} className="mt-12 rounded-[2.5rem] bg-white p-2 shadow-2xl transition-transform focus-within:scale-[1.01]">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={t("home.editorialSearchPlaceholder")}
                className="h-16 flex-[3] rounded-[2rem] bg-[#f8f5ef] px-8 text-lg focus:outline-none"
              />
              <button type="submit" className="flex h-16 items-center justify-center gap-2 rounded-[2rem] bg-[#c49840] px-10 font-bold text-white hover:bg-[#b38a3a] transition-all">
                {t("home.heroSearchCta")}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* --- Intelligence Card --- */}
      <section className="mx-auto -mt-20 max-w-5xl px-6 pb-24 relative z-20">
        <div className="rounded-[3rem] border border-[#e3dbd0] bg-white p-10 md:p-14 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c49840]">
                <BrainCircuit className="h-4 w-4" />
                Live Analysis
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Smart catering briefings.</h2>
              <div className="flex flex-wrap gap-2">
                {[intent.event, intent.city, intent.guests, intent.diet].map((tag) => (
                  <span key={tag} className="rounded-xl border border-[#ddd4c8] bg-[#fcfaf7] px-4 py-2 text-sm font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                <ShieldCheck className="h-6 w-6 text-[#2d4736]" />
                <span className="font-bold">Premium Vetted Partners</span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
                <CheckCircle2 className="h-6 w-6 text-[#2d4736]" />
                <span className="font-bold">Transparent Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
