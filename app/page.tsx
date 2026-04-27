"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  MapPin,
} from "lucide-react";

// Library imports
import { useT } from "@/lib/i18n/context";
import { parseHeroIntent } from "@/lib/parser";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

// --- DYNAMIC IMAGE ENGINE ---
const getImg = (keyword: string) => `https://source.unsplash.com/featured/?${keyword}&sig=${Math.random()}`;

const occasionCards = [
  { titleKey: "home.occasions.wedding", href: "/request/new?occasion=wedding", imgKey: "wedding-catering" },
  { titleKey: "home.occasions.corporate", href: "/request/new?occasion=corporate", imgKey: "business-lunch" },
  { titleKey: "home.occasions.birthday", href: "/request/new?occasion=birthday", imgKey: "birthday-party-food" },
  { titleKey: "home.occasions.private", href: "/request/new?occasion=private_party", imgKey: "fine-dining" },
  { titleKey: "home.occasions.ramadan", href: "/request/new?occasion=ramadan", imgKey: "middle-eastern-spices" },
];

export default function HomePage() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const intent = useMemo(() => 
    parseHeroIntent(heroQuery || t("home.aiDemo.request")), 
    [heroQuery, t]
  );

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = heroQuery.trim();
    router.push(q ? `/request/new?q=${encodeURIComponent(q)}` : "/request/new");
  };

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#201a17]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#ddd4c8] bg-[#f5f1ea]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-[#2d4736]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d4736]/15 bg-[#2d4736]/5">
              <LogoMark size={18} color="#2d4736" />
            </div>
            <div className="text-xl font-semibold tracking-tight">Speisely</div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#6f675f]">
            <Link href="/caterers" className="hover:text-[#2d4736]">Browse</Link>
            <Link href="/for-caterers" className="hover:text-[#2d4736]">For Caterers</Link>
            <Link href="/about" className="hover:text-[#2d4736]">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/request/new" className="rounded-full bg-[#2d4736] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              {t("home.editorialCtaPrimary")}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Fixed Gradient & Dynamic Image */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getImg("luxury-catering-event")}
            alt="Premium Event"
            fill
            priority
            className="object-cover"
          />
          {/* The magic gradient that blends the image into the cream background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#f5f1ea]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f2dfbf] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.badge")}
          </div>

          <h1 className="mt-8 text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
            {t("home.editorialHeroTitle")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#efe5da] md:text-xl">
            {t("home.editorialHeroSubtitle")}
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex h-16 flex-[1.9] items-center rounded-[1.35rem] bg-white px-5">
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder={t("home.editorialSearchPlaceholder")}
                  className="w-full bg-transparent text-[15px] text-[#201a17] placeholder:text-[#8a8076] focus:outline-none"
                />
              </div>
              <button type="submit" className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#c49840] px-8 font-semibold text-white transition hover:scale-[1.02] lg:flex-[0.75]">
                {t("home.heroSearchCta")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* INTELLIGENCE CARD - Floating effect */}
      <section className="relative z-20 mx-auto -mt-20 max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.5rem] border border-[#e3dbd0] bg-white p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c49840]">
              <BrainCircuit className="h-4 w-4" />
              AI-Guided Matching
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#201a17] md:text-4xl">
              Speisely understands your event before you browse.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {[intent.event, intent.city, intent.guests, intent.diet].map((tag) => (
                <span key={tag} className="rounded-full border border-[#ddd4c8] bg-[#faf7f2] px-4 py-2 text-sm font-medium text-[#3f3833]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4 rounded-[2rem] border border-[#e3dbd0] bg-white p-6 shadow-md">
              <ShieldCheck className="h-8 w-8 text-[#c49840]" />
              <div>
                <div className="font-bold text-[#201a17]">Curated Partners</div>
                <div className="text-sm text-[#6f675f]">Only the highest rated caterers.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[2rem] border border-[#e3dbd0] bg-white p-6 shadow-md">
              <CheckCircle2 className="h-8 w-8 text-[#c49840]" />
              <div>
                <div className="font-bold text-[#201a17]">Smart Briefing</div>
                <div className="text-sm text-[#6f675f]">Structured requests, better results.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OCCASIONS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold md:text-4xl">Start with your occasion</h2>
          <p className="mt-4 text-[#6f675f]">Discover tailored solutions for every moment.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {occasionCards.map((occ) => (
            <Link key={occ.titleKey} href={occ.href} className="group relative h-80 overflow-hidden rounded-[2rem] shadow-lg">
              <Image src={getImg(occ.imgKey)} alt="occasion" fill className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">{t(occ.titleKey)}</h3>
                <span className="text-sm text-[#f0dfbf] opacity-0 transition-opacity group-hover:opacity-100">Start request →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#ddd5ca] bg-[#f3eee6] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center md:text-left">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-[#2d4736]">Speisely</div>
              <p className="mt-4 text-[#6f675f]">The intelligent marketplace for premium catering.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <div className="flex flex-col gap-2 text-[#6f675f]">
                <Link href="/caterers">Caterers</Link>
                <Link href="/about">About Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-[#6f675f]">info@speisely.de</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#ddd5ca] text-sm text-[#8f8777]">
            © 2025 Speisely. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
