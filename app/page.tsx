"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
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
  return <Sparkles className="h-3.5 w-3.5" />;
}

function SearchIcon() {
  return <Search className="h-4 w-4" />;
}

function ArrowUpRightIcon() {
  return <ArrowUpRight className="h-4 w-4" />;
}

export default function HomePage() {
  const t = useT();
  const isRTL = useIsRTL();
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
  ];

  const handleAiSubmit = () => {
    const query = aiQuery.trim();

    if (!query) {
      window.location.href = "/request/new";
      return;
    }

    const encoded = encodeURIComponent(query);
    window.location.href = `/request/new?q=${encoded}`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm">
              <LogoMark className="h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight">
                Speisely
              </span>
              <span className="text-xs text-muted-foreground">
                {t("home.brandTagline")}
              </span>
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
            <div className="opacity-80 transition hover:opacity-100">
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
              className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[rgb(20,31,22)]">
        <div className="absolute inset-0">
          <Image
            src="/images/speisely-hero.png"
            alt={t("home.images.heroAlt")}
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,22,15,0.72)_0%,rgba(14,22,15,0.82)_45%,rgba(14,22,15,0.92)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/85">
              <SparklesIcon />
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="mt-8 text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl xl:text-7xl">
              {t("home.editorialHeroTitle")}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/78">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mx-auto mt-10 max-w-3xl rounded-[1.75rem] border border-white/10 bg-white/8 p-3 backdrop-blur-xl">
              <div className="flex flex-col gap-3 rounded-[1.2rem] bg-white px-4 py-4 md:flex-row md:items-center">
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
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  {t("home.guided.cta")}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setAiQuery(prompt)}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/14"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-sm text-white/72">
              <span>{t("home.heroBenefit1")}</span>
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span>{t("home.heroBenefit2")}</span>
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span>{t("home.heroBenefit3")}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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

            <div className="mt-8 h-px w-full bg-border" />

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

          <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[rgb(22,34,25)] p-8 lg:p-10">
            <div className="text-xs uppercase tracking-[0.24em] text-amber-300">
              {t("home.steps.label")}
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("home.editorialStepsTitle")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
              {t("home.editorialStepsSubtitle")}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                  {t("home.aiDemo.requestLabel")}
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  {t("home.aiDemo.request")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
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
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                  {t("home.aiDemo.recommended")}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    [
                      t("home.aiDemo.caterer1Name"),
                      t("home.aiDemo.caterer1Meta"),
                    ],
                    [
                      t("home.aiDemo.caterer2Name"),
                      t("home.aiDemo.caterer2Meta"),
                    ],
                    [
                      t("home.aiDemo.caterer3Name"),
                      t("home.aiDemo.caterer3Meta"),
                    ],
                  ].map(([name, meta]) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <div className="text-sm font-semibold text-white">
                        {name}
                      </div>
                      <div className="mt-1 text-xs text-white/60">{meta}</div>
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
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
                  {t("home.occasions.cardCta")}
                  <ArrowUpRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgb(20,31,22)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-10 lg:px-12 lg:py-14">
              <div className="text-xs uppercase tracking-[0.24em] text-amber-300">
                {t("home.editorialCtaLabel")}
              </div>

              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t("home.editorialCtaTitle")}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
                {t("home.editorialCtaSubtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  {t("home.editorialCtaPrimary")}
                </Link>

                <Link
                  href="/caterers"
                  className="rounded-2xl border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
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

      <footer className="mt-8 border-t border-[rgba(255,255,255,0.08)] bg-[rgb(20,31,22)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-white">
                  <LogoMark className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold text-white">
                  Speisely
                </div>
              </div>

              <div className="mt-3 max-w-2xl text-sm leading-7 text-white/74">
                {t("home.editorialFooterTagline")}
              </div>

              <div className="mt-4 text-xs uppercase tracking-[0.22em] text-white/45">
                DE / EN
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/caterers"
                className="rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {t("home.nav.browse")}
              </Link>

              <Link
                href="/request/new"
                className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {t("home.cta.planEvent")}
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {t("home.nav.login")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}fix error and write full code you moron
