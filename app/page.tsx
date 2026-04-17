"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useT, useIsRTL } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
      <path d="M5 15l.9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Home() {
  const t = useT();
  const isRTL = useIsRTL();
  const [aiQuery, setAiQuery] = useState("");

  const occasions = useMemo(
    () => [
      {
        title: t("home.occasions.wedding"),
        description: t("home.occasions.weddingDesc"),
        href: "/request/new",
        image: "/images/speisely-wedding.png",
      },
      {
        title: t("home.occasions.corporate"),
        description: t("home.occasions.corporateDesc"),
        href: "/request/new",
        image: "/images/speisely-business.png",
      },
      {
        title: t("home.occasions.private"),
        description: t("home.occasions.privateDesc"),
        href: "/request/new",
        image: "/images/speisely-private.png",
      },
      {
        title: t("home.occasions.ramadan"),
        description: t("home.occasions.ramadanDesc"),
        href: "/request/new",
        image: "/images/speisely-ramadan.png",
      },
    ],
    [t],
  );

  const prompts = useMemo(
    () => [
      t("home.chips.wedding"),
      t("home.chips.corporate"),
      t("home.chips.private"),
    ],
    [t],
  );

  const steps = useMemo(
    () => [
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
    ],
    [t],
  );

  const handleAiSubmit = () => {
    const params = new URLSearchParams();
    if (aiQuery.trim()) {
      params.set("q", aiQuery.trim());
    }
    window.location.href = `/request/new${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <LogoMark className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">
                Speisely
              </div>
              <div className="text-sm text-muted-foreground">
                {t("home.brandTagline")}
              </div>
            </div>
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
            <a
              href="#occasions"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.occasions.title")}
            </a>
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {t("home.nav.login")}
            </Link>
          </nav>

          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="opacity-80 hover:opacity-100 transition">
              <LanguageSwitcher />
            </div>

            <Link
              href="/login"
              className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary sm:inline-flex"
            >
              {t("home.cta.dashboard")}
            </Link>

            <Link
              href="/request/new"
              className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-[color:var(--primary-hover)]"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>
        </div>
      </header>

      <section className="section-dark grain-overlay relative overflow-hidden">
        <div className="hero-overlay absolute inset-0 z-0" />
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/speisely-hero.png"
            alt={t("home.images.heroAlt")}
            fill
            priority
            className="object-cover opacity-35"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-surface-dark-border bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-surface-dark-foreground/85">
              <SparklesIcon />
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="text-balance mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-surface-dark-foreground sm:text-6xl xl:text-7xl">
              {t("home.editorialHeroTitle")}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-surface-dark-foreground/78">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mx-auto mt-10 max-w-3xl rounded-[1.75rem] border border-surface-dark-border bg-white/8 p-3 backdrop-blur-xl">
              <div className="flex flex-col gap-3 rounded-[1.2rem] bg-card px-4 py-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <SearchIcon />
                </div>

                <input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={t("home.editorialSearchPlaceholder")}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <button
                  onClick={handleAiSubmit}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-[color:var(--primary-hover)]"
                >
                  {t("home.guided.cta")}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setAiQuery(prompt)}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-surface-dark-foreground/85 transition hover:bg-white/14"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-sm text-surface-dark-foreground/72">
              <span>{t("home.heroBenefit1")}</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>{t("home.heroBenefit2")}</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>{t("home.heroBenefit3")}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-10 lg:py-14"
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="premium-card p-8 lg:p-10">
            <div className="text-xs uppercase tracking-[0.24em] text-accent">
              {t("home.principles.label")}
            </div>

            <h2 className="text-balance mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.principles.title")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              {t("home.principles.subtitle")}
            </p>

            <div className="divider-accent mt-8" />

            <div className="mt-8 space-y-4">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 rounded-2xl bg-secondary/70 p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-dark-mid overflow-hidden rounded-[1.75rem] border border-surface-dark-border p-8 lg:p-10">
            <div className="text-xs uppercase tracking-[0.24em] text-accent-gold">
              {t("home.steps.label")}
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-surface-dark-foreground sm:text-4xl">
              {t("home.editorialStepsTitle")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-surface-dark-foreground/78">
              {t("home.editorialStepsSubtitle")}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="dark-card p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-surface-dark-muted">
                  {t("home.aiDemo.requestLabel", "Your request")}
                </div>
                <div className="mt-3 text-lg font-semibold text-surface-dark-foreground">
                  {t(
                    "home.aiDemo.request",
                    "Wedding for 80 guests in Berlin, mostly vegetarian, elegant, around €35 p.p."
                  )}
                </div>
              </div>

              <div className="dark-card p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-surface-dark-muted">
                  {t("home.aiDemo.understands", "Speisely understands")}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    t("home.aiDemo.tagEvent", "Wedding"),
                    t("home.aiDemo.tagCity", "Berlin"),
                    t("home.aiDemo.tagGuests", "80 guests"),
                    t("home.aiDemo.tagDiet", "Vegetarian"),
                    t("home.aiDemo.tagStyle", "Elegant"),
                    t("home.aiDemo.tagBudget", "€35 / person"),
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-surface-dark-border bg-white/6 px-3 py-1.5 text-xs text-surface-dark-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dark-card p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-surface-dark-muted">
                  {t("home.aiDemo.recommended", "Suggested matches")}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    [
                      t("home.aiDemo.caterer1Name", "Berliner Genussküche"),
                      t("home.aiDemo.caterer1Meta", "Fine Dining · Vegetarian"),
                    ],
                    [
                      t("home.aiDemo.caterer2Name", "Grüne Tafel Events"),
                      t("home.aiDemo.caterer2Meta", "Weddings · Organic"),
                    ],
                    [
                      t("home.aiDemo.caterer3Name", "Villa Catering"),
                      t("home.aiDemo.caterer3Meta", "Premium · Multi-cuisine"),
                    ],
                  ].map(([name, meta]) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-surface-dark-border bg-surface-dark-card px-4 py-4"
                    >
                      <div className="text-sm font-semibold text-surface-dark-foreground">
                        {name}
                      </div>
                      <div className="mt-1 text-xs text-surface-dark-muted">
                        {meta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="occasions" className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-accent">
              {t("home.occasions.label")}
            </div>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
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
              className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,22,16,0.10)]"
            >
              <div className="relative h-80">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(25,43,26,0.88)] via-[rgba(25,43,26,0.20)] to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  {card.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-gold)]">
                  {t("home.occasions.cardCta")}
                  <ArrowUpRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="section-dark overflow-hidden rounded-[2rem] border border-surface-dark-border">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-10 lg:px-12 lg:py-14">
              <div className="text-xs uppercase tracking-[0.24em] text-accent-gold">
                {t("home.editorialCtaLabel")}
              </div>

              <h2 className="text-balance mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-surface-dark-foreground sm:text-4xl">
                {t("home.editorialCtaTitle")}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-surface-dark-foreground/78">
                {t("home.editorialCtaSubtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  {t("home.editorialCtaPrimary")}
                </Link>

                <Link
                  href="/caterers"
                  className="rounded-2xl border border-surface-dark-border px-6 py-3 text-sm font-semibold text-surface-dark-foreground transition hover:bg-white/8"
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
              <div className="absolute inset-0 bg-gradient-to-l from-[rgba(25,43,26,0.10)] via-[rgba(25,43,26,0.40)] to-[rgba(25,43,26,0.75)]" />
            </div>
          </div>
        </div>
      </section>

      <footer className="section-dark mt-8 border-t border-surface-dark-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-surface-dark-foreground">
                  <LogoMark className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold text-surface-dark-foreground">
                  Speisely
                </div>
              </div>

              <div className="mt-3 max-w-2xl text-sm leading-7 text-surface-dark-foreground/74">
                {t("home.editorialFooterTagline")}
              </div>

              <div className="mt-4 text-xs uppercase tracking-[0.22em] text-surface-dark-muted">
                DE / EN / TR / AR
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/caterers"
                className="rounded-xl border border-surface-dark-border bg-white/6 px-4 py-2.5 text-sm font-medium text-surface-dark-foreground transition hover:bg-white/10"
              >
                {t("home.nav.browse")}
              </Link>

              <Link
                href="/request/new"
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                {t("home.cta.planEvent")}
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-surface-dark-border bg-white/6 px-4 py-2.5 text-sm font-medium text-surface-dark-foreground transition hover:bg-white/10"
              >
                {t("home.nav.login")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
