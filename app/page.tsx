"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useIsRTL, useT } from "@/lib/i18n/context";
import { LogoMark } from "@/components/ui/logo-mark";

type OccasionCard = {
  title: string;
  description: string;
  href: string;
  image: string;
};

type StepItem = {
  step: string;
  title: string;
  description: string;
};

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M12 3l1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3L7.5 7.5l3.3-1.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14.5l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const t = useT();
  const isRTL = useIsRTL();
  const router = useRouter();
  const [aiQuery, setAiQuery] = useState("");

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
    {
      step: "01",
      title: t("home.steps.step1Title"),
      description: t("home.steps.step1Desc"),
    },
    {
      step: "02",
      title: t("home.steps.step2Title"),
      description: t("home.steps.step2Desc"),
    },
    {
      step: "03",
      title: t("home.steps.step3Title"),
      description: t("home.steps.step3Desc"),
    },
  ];

  const occasions: OccasionCard[] = [
    {
      title: t("home.occasions.wedding"),
      description: t("home.occasions.weddingDesc"),
      href: "/request/new?occasion=wedding",
      image: "/images/speisely-wedding.png",
    },
    {
      title: t("home.occasions.corporate"),
      description: t("home.occasions.corporateDesc"),
      href: "/caterers?occasion=corporate",
      image: "/images/speisely-business.png",
    },
    {
      title: t("home.occasions.private"),
      description: t("home.occasions.privateDesc"),
      href: "/caterers?occasion=private",
      image: "/images/speisely-private.png",
    },
    {
      title: t("home.occasions.ramadan"),
      description: t("home.occasions.ramadanDesc"),
      href: "/request/new?occasion=ramadan",
      image: "/images/speisely-ramadan.png",
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
    <main className="min-h-screen bg-background text-foreground">

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
          Fix: removed tagline sub-text under wordmark.
          Premium brands don't explain themselves in the nav.
          Logo now uses the new LogoMark API (size + color props).
      ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

          <Link
            href="/"
            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LogoMark size={24} color="var(--primary)" showWordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/caterers"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.nav.browse")}
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.nav.howItWorks")}
            </a>
            <Link
              href="/signup?role=caterer"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.nav.forCaterers")}
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.nav.login")}
            </Link>
          </nav>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="opacity-80 transition hover:opacity-100">
              <LanguageSwitcher />
            </div>
            <Link
              href="/login"
              className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary sm:inline-flex"
            >
              {t("home.cta.dashboard")}
            </Link>
            <Link
              href="/request/new"
              className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          Fixes applied:
          1. bg-surface-dark token replaces hardcoded rgb(20,31,22)
          2. Radial vignette layer — subtle warm lift at content
             centre adds atmospheric depth vs a flat colour wall
          3. AI input promoted ABOVE the two CTA buttons —
             it is the product, it must be the first action
          4. CTAs demoted to small text links below the input
          5. Headline tracking eased from -0.05em to -0.03em —
             slightly less blunt, more hospitality-appropriate
          6. Bronze dots on benefit strip use accent-gold token
          7. Enter key support on AI input
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-surface-dark">

        <div className="absolute inset-0">
          <Image
            src="/images/speisely-hero.png"
            alt={t("home.images.heroAlt")}
            fill
            priority
            className="object-cover opacity-20"
          />
          {/* Primary overlay — darkens bottom for legibility */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,12,0.68)_0%,rgba(10,18,12,0.78)_50%,rgba(10,18,12,0.93)_100%)]" />
          {/* Radial vignette — adds atmospheric warmth at text centre.
              This is the difference between a flat wall and an environment. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_38%_38%,rgba(58,94,60,0.18)_0%,transparent_68%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">

            {/* ── Left column ── */}
            <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:max-w-none lg:text-left">

              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/90 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <SparklesIcon />
                <span>{t("home.badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl xl:text-7xl">
                {t("home.editorialHeroTitle")}
              </h1>

              {/* Subtitle */}
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 lg:max-w-3xl">
                {t("home.editorialHeroSubtitle")}
              </p>

              {/* ── AI INPUT — PRIMARY ACTION ──
                  Sits above CTAs. This is the product centrepiece.
              ── */}
              <div className="mt-10 max-w-4xl rounded-[1.75rem] border border-white/12 bg-white/10 p-3 backdrop-blur-xl transition focus-within:border-white/22">
                <div className="flex flex-col gap-3 rounded-[1.2rem] bg-white px-4 py-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <SearchIcon />
                  </div>
                  <input
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                    placeholder={t("home.editorialSearchPlaceholder")}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    onClick={handleAiSubmit}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.98]"
                  >
                    {t("home.guided.cta")}
                  </button>
                </div>

                {/* Example chips */}
                <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setAiQuery(prompt)}
                      className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs text-white/90 transition hover:bg-white/18 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary CTAs — demoted to text links below input */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                <Link
                  href="/caterers"
                  className="text-sm text-white/58 underline-offset-4 transition hover:text-white/82 hover:underline"
                >
                  {t("home.heroBrowseCta")}
                </Link>
                <span className="select-none text-xs text-white/26" aria-hidden="true">·</span>
                <Link
                  href="/request/new"
                  className="text-sm text-white/58 underline-offset-4 transition hover:text-white/82 hover:underline"
                >
                  {t("home.heroPlanCta")}
                </Link>
              </div>

              {/* Benefits strip — bronze dots use accent-gold token */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/70 lg:justify-start">
                <span>{t("home.heroBenefit1")}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: "var(--accent-gold)" }}
                  aria-hidden="true"
                />
                <span>{t("home.heroBenefit2")}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: "var(--accent-gold)" }}
                  aria-hidden="true"
                />
                <span>{t("home.heroBenefit3")}</span>
              </div>
            </div>

            {/* ── Right column — occasion preview cards (unchanged) ── */}
            <div className="hidden lg:block">
              <div className="grid gap-4">
                <Link
                  href="/caterers?occasion=wedding"
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-1"
                >
                  <div className="relative h-44">
                    <Image
                      src="/images/speisely-wedding.png"
                      alt={t("home.occasions.wedding")}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,24,17,0.88)] via-[rgba(15,24,17,0.24)] to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-lg font-semibold text-white">
                      {t("home.occasions.wedding")}
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      {t("home.occasions.weddingDesc")}
                    </div>
                  </div>
                </Link>

                <Link
                  href="/caterers?occasion=corporate"
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-1"
                >
                  <div className="relative h-56">
                    <Image
                      src="/images/speisely-business.png"
                      alt={t("home.occasions.corporate")}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,24,17,0.88)] via-[rgba(15,24,17,0.24)] to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-lg font-semibold text-white">
                      {t("home.occasions.corporate")}
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      {t("home.occasions.corporateDesc")}
                    </div>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          Left panel fix: replaced nested bg-secondary/70 step boxes
          (SaaS checklist pattern) with a clean vertical timeline.
          Number circles + connecting line = editorial, not generic.
          Right panel (AI demo) is unchanged — it was already strong.
      ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

          {/* Left panel — editorial timeline */}
          <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm lg:p-10">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              {t("home.principles.label")}
            </div>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.principles.title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              {t("home.principles.subtitle")}
            </p>

            {/* Vertical timeline — replaces nested step boxes */}
            <div className="mt-10">
              {steps.map((item, index) => (
                <div key={item.step} className="relative flex gap-6 pb-9 last:pb-0">
                  {/* Connecting line to next step */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute left-[19px] top-11 bottom-0 w-px bg-border"
                      aria-hidden="true"
                    />
                  )}
                  {/* Step number circle */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-xs font-bold text-primary">
                    {item.step}
                  </div>
                  {/* Step content */}
                  <div className="pt-1.5">
                    <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel — AI demo (unchanged) */}
          <div className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-surface-dark-mid p-8 lg:p-10">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--accent-gold)" }}
            >
              {t("home.steps.label")}
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("home.editorialStepsTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/82">
              {t("home.editorialStepsSubtitle")}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                  {t("home.aiDemo.requestLabel")}
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  {t("home.aiDemo.request")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                  {t("home.aiDemo.understands")}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    t("home.aiDemo.tagEvent"),
                    t("home.aiDemo.tagCity"),
                    t("home.aiDemo.tagGuests"),
                    t("home.aiDemo.tagDiet"),
                    t("home.aiDemo.tagStyle"),
                    t("home.aiDemo.tagBudget"),
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                  {t("home.aiDemo.recommended")}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    [t("home.aiDemo.caterer1Name"), t("home.aiDemo.caterer1Meta")],
                    [t("home.aiDemo.caterer2Name"), t("home.aiDemo.caterer2Meta")],
                    [t("home.aiDemo.caterer3Name"), t("home.aiDemo.caterer3Meta")],
                  ].map(([name, meta]) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4"
                    >
                      <div className="text-sm font-semibold text-white">{name}</div>
                      <div className="mt-1 text-xs text-white/68">{meta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OCCASIONS
          Fixes: removed border/bg-card wrapper from photo cards
          (the photo is the card — no border needed).
          Bronze accent-gold token on card CTA link.
      ═══════════════════════════════════════════════════════════ */}
      <section id="occasions" className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              {t("home.occasions.label")}
            </div>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.editorialOccasionsTitle")}
            </h2>
          </div>
          <Link
            href="/caterers"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary md:inline-flex"
          >
            {t("home.occasions.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {occasions.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-[1.75rem] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(18,28,18,0.14)]"
            >
              <div className="relative h-80">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(25,43,26,0.90)] via-[rgba(25,43,26,0.22)] to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-white/84">{card.description}</p>
                <div
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {t("home.occasions.cardCta")}
                  <ArrowUpRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          Fix: bg-surface-dark token, consistent accent-gold label.
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-surface-dark">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-10 lg:px-12 lg:py-14">
              <div
                className="text-xs uppercase tracking-[0.24em]"
                style={{ color: "var(--accent-gold)" }}
              >
                {t("home.editorialCtaLabel")}
              </div>
              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t("home.editorialCtaTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
                {t("home.editorialCtaSubtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                >
                  {t("home.editorialCtaPrimary")}
                </Link>
                <Link
                  href="/caterers"
                  className="rounded-2xl border border-white/28 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/18"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px]">
              <Image
                src="/images/speisely-private.png"
                alt={t("home.images.ctaAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(18,30,21,0.18)] via-[rgba(18,30,21,0.54)] to-[rgba(18,30,21,0.82)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          Fixes:
          - bg-surface-dark token replaces hardcoded rgb(20,31,22)
          - LogoMark uses new size + color API (no className sizing)
          - Removed "DE / EN" placeholder hardcode
          - Added proper nav + legal links (Impressum, Datenschutz
            are proper nouns in German law — fine to hardcode)
          - Added copyright year
          - Bronze accent-gold on footer CTA button
      ═══════════════════════════════════════════════════════════ */}
      <footer className="mt-8 border-t border-white/8 bg-surface-dark">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>
              {/* Logo — hardcoded ivory (#e4d9c2 = var(--surface-dark-foreground))
                  for SVG fill reliability across all browsers */}
              <LogoMark size={22} color="#e4d9c2" showWordmark wordmarkColor="#e4d9c2" />

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/68">
                {t("home.editorialFooterTagline")}
              </p>

              {/* Footer links */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  href="/caterers"
                  className="text-xs text-white/44 underline-offset-4 transition hover:text-white/70 hover:underline"
                >
                  {t("home.nav.browse")}
                </Link>
                <Link
                  href="/signup?role=caterer"
                  className="text-xs text-white/44 underline-offset-4 transition hover:text-white/70 hover:underline"
                >
                  {t("home.nav.forCaterers")}
                </Link>
                <Link
                  href="/login"
                  className="text-xs text-white/44 underline-offset-4 transition hover:text-white/70 hover:underline"
                >
                  {t("home.nav.login")}
                </Link>
                <Link
                  href="/impressum"
                  className="text-xs text-white/44 underline-offset-4 transition hover:text-white/70 hover:underline"
                >
                  Impressum
                </Link>
                <Link
                  href="/datenschutz"
                  className="text-xs text-white/44 underline-offset-4 transition hover:text-white/70 hover:underline"
                >
                  Datenschutz
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link
                href="/request/new"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--accent-gold)" }}
              >
                {t("home.cta.planEvent")}
              </Link>
              <span className="text-xs text-white/32">
                © {new Date().getFullYear()} Speisely
              </span>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}
