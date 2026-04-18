"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useIsRTL, useT } from "@/lib/i18n/context";
import { LogoMark } from "@/components/ui/logo-mark";

// --- Types ---
type OccasionCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  size: "large" | "small"; // For editorial grid
};

type StepItem = {
  step: string;
  title: string;
  description: string;
};

// --- Icons ---
function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent-gold" aria-hidden="true">
      <path d="M12 3l1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3L7.5 7.5l3.3-1.2L12 3Z" fill="currentColor" />
      <path d="M18.5 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" fill="currentColor" />
      <path d="M6 14.5l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const t = useT();
  const isRTL = useIsRTL();
  const router = useRouter();
  const [aiQuery, setAiQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const prompts = useMemo(
    () => [
      t("home.chips.wedding"),
      t("home.chips.corporate"),
      t("home.chips.private"),
      t("home.chips.ramadan"),
    ],
    [t]
  );

  const steps: StepItem[] = [
    { step: "01", title: t("home.steps.step1Title"), description: t("home.steps.step1Desc") },
    { step: "02", title: t("home.steps.step2Title"), description: t("home.steps.step2Desc") },
    { step: "03", title: t("home.steps.step3Title"), description: t("home.steps.step3Desc") },
  ];

  const occasions: OccasionCard[] = [
    {
      title: t("home.occasions.wedding"),
      description: t("home.occasions.weddingDesc"),
      href: "/request/new?occasion=wedding",
      image: "/images/speisely-wedding.png",
      size: "large",
    },
    {
      title: t("home.occasions.corporate"),
      description: t("home.occasions.corporateDesc"),
      href: "/caterers?occasion=corporate",
      image: "/images/speisely-business.png",
      size: "small",
    },
    {
      title: t("home.occasions.private"),
      description: t("home.occasions.privateDesc"),
      href: "/caterers?occasion=private",
      image: "/images/speisely-private.png",
      size: "small",
    },
    {
      title: t("home.occasions.ramadan"),
      description: t("home.occasions.ramadanDesc"),
      href: "/request/new?occasion=ramadan",
      image: "/images/speisely-ramadan.png",
      size: "large",
    },
  ];

  const handleAiSubmit = () => {
    const query = aiQuery.trim();
    if (!query) {
      router.push("/request/new");
      return;
    }
    router.push(`/request/new?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent-gold/30">

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR: Minimalist & Elegant
      ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-surface-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <LogoMark size={28} color="#e4d9c2" showWordmark />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {[
              { label: t("home.nav.browse"), href: "/caterers" },
              { label: t("home.nav.howItWorks"), href: "#how-it-works" },
              { label: t("home.nav.forCaterers"), href: "/signup?role=caterer" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium tracking-wide text-surface-dark-foreground/70 transition hover:text-accent-gold">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-sm font-semibold text-surface-dark-foreground sm:block">
              {t("home.nav.login")}
            </Link>
            <Link
              href="/request/new"
              className="rounded-full bg-accent-gold px-6 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:brightness-110 active:scale-95"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO: The "Concierge" Experience
          Visual: Deep Forest Background + Glowing AI Input
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-dark pt-20">
        {/* Ambient Background Elements */}
        <div className="absolute inset-0">
          <Image src="/images/speisely-hero.png" alt="" fill className="object-cover opacity-10" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-dark via-surface-dark/80 to-background" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-accent-gold uppercase">
              <SparklesIcon /> {t("home.badge")}
            </span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-medium leading-[1.1] tracking-tight text-surface-dark-foreground sm:text-7xl xl:text-8xl">
            {t("home.editorialHeroTitle")}
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-surface-dark-muted sm:text-xl">
            {t("home.editorialHeroSubtitle")}
          </p>

          {/* THE AI CONCIERGE INPUT */}
          <div 
            className={`group relative mx-auto max-w-3xl transition-all duration-500 ${isFocused ? "scale-[1.02]" : "scale-100"}`}
          >
            <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-accent-gold/20 to-primary/20 opacity-0 blur-xl transition duration-500 ${isFocused ? "opacity-100" : "opacity-0"}`} />
            
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-2xl">
              <div className="flex flex-col gap-2 rounded-[1.5rem] bg-white/5 p-4 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-3 pl-2 text-accent-gold">
                  <SparklesIcon />
                </div>
                <input
                  value={aiQuery}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                  placeholder={t("home.editorialSearchPlaceholder")}
                  className="w-full bg-transparent py-3 text-lg text-surface-dark-foreground placeholder:text-surface-dark-muted focus:outline-none"
                />
                <button
                  onClick={handleAiSubmit}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-gold px-8 py-3.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95"
                >
                  {t("home.guided.cta")}
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setAiQuery(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-surface-dark-foreground/80 transition hover:border-accent-gold/50 hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS: The "Transformation" Section
      ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <span className="text-sm font-bold tracking-[0.3em] text-accent-gold uppercase">{t("home.principles.label")}</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {t("home.principles.title")}
            </h2>
          </div>

          <div className="grid gap-16 lg:grid-cols-3">
            {steps.map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-bold text-primary transition group-hover:border-accent-gold group-hover:text-accent-gold">
                  {item.step}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                {idx < 2 && (
                  <div className="absolute left-[50%] top-16 hidden h-24 w-px bg-gradient-to-b from-accent-gold/50 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OCCASIONS: Editorial Gallery
          Visual: Large, beautiful imagery with elegant typography
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-surface-dark-mid py-24 text-surface-dark-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-xl text-right">
              <span className="text-sm font-bold tracking-[0.3em] text-accent-gold uppercase">{t("home.occasions.label")}</span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">{t("home.editorialOccasionsTitle")}</h2>
            </div>
            <Link href="/caterers" className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              {t("home.occasions.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {occasions.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className={`group relative overflow-hidden rounded-[2rem] ${
                  card.size === "large" ? "md:col-span-7" : "md:col-span-5"
                }`}
              >
                <div className="relative h-[500px] w-full transition-transform duration-700 group-hover:scale-105">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-80" />
                </div>
                <div className="absolute bottom-0 p-8 text-white">
                  <h3 className="text-3xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-white/70">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA: Final Premium Touch
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-background py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl font-medium tracking-tight text-foreground sm:text-6xl">
              {t("home.editorialCtaTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              {t("home.editorialCtaSubtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/request/new"
                className="w-full rounded-full bg-primary px-10 py-4 text-lg font-bold text-white transition hover:scale-105 sm:w-auto"
              >
                {t("home.editorialCtaPrimary")}
              </Link>
              <Link
                href="/caterers"
                className="w-full rounded-full border border-border px-10 py-4 text-lg font-semibold text-foreground transition hover:bg-secondary sm:w-auto"
              >
                {t("home.editorialCtaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER: Clean & Structured
      ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border bg-card py-16 text-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2">
              <LogoMark size={32} color="var(--primary)" showWordmark />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("home.editorialFooterTagline")}
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Explore</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/caterers" className="hover:text-primary">Browse Caterers</Link></li>
                <li><Link href="/request/new" className="hover:text-primary">Plan an Event</Link></li>
                <li><Link href="/signup?role=caterer" className="hover:text-primary">Join as Caterer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/impressum" className="hover:text-primary">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link></li>
                <li><Link href="/about" className="hover:text-primary">About Speisely</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Speisely. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span>Germany</span>
              <span>English</span>
              <span>Deutsch</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
