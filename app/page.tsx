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

type FeaturedCard = {
  title: string;
  meta: string;
  description: string;
  href: string;
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
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
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

  const featured: FeaturedCard[] = [
    {
      title: t("home.featured.card1Title"),
      meta: t("home.featured.card1Meta"),
      description: t("home.featured.card1Desc"),
      href: "/caterers",
    },
    {
      title: t("home.featured.card2Title"),
      meta: t("home.featured.card2Meta"),
      description: t("home.featured.card2Desc"),
      href: "/caterers",
    },
    {
      title: t("home.featured.card3Title"),
      meta: t("home.featured.card3Meta"),
      description: t("home.featured.card3Desc"),
      href: "/caterers",
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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="flex items-center justify-center text-primary">
  <LogoMark className="h-7 w-7" />
</div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight">Speisely</span>
              <span className="text-xs text-muted-foreground">{t("home.brandTagline")}</span>
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

          <Link
  href="/caterer"
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,22,15,0.56)_0%,rgba(14,22,15,0.70)_45%,rgba(14,22,15,0.84)_100%)]" />
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

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/84">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/caterers"
                className="rounded-2xl border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                {t("home.heroBrowseCta")}
              </Link>
              <Link
                href="/request/new"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                {t("home.heroPlanCta")}
              </Link>
            </div>

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

            <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-sm text-white/80">
              <span>{t("home.heroBenefit1")}</span>
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span>{t("home.heroBenefit2")}</span>
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span>{t("home.heroBenefit3")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-5 text-sm text-muted-foreground md:grid-cols-3">
          <div className="font-medium">{t("home.trust.curated")}</div>
          <div className="font-medium">{t("home.trust.verified")}</div>
          <div className="font-medium">{t("home.trust.transparent")}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              {t("home.featured.label")}
            </div>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.featured.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              {t("home.featured.subtitle")}
            </p>
          </div>

          <Link
            href="/caterers"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary md:inline-flex"
          >
            {t("home.featured.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featured.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,22,16,0.08)]"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-primary">{item.meta}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                {t("home.featured.cardCta")}
                <ArrowUpRightIcon />
              </div>
            </Link>
          ))}
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

            <p className="mt-5 max-w-xl text-base leading-8 text-white/84">
              {t("home.editorialStepsSubtitle")}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/68">
                  {t("home.aiDemo.requestLabel")}
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  {t("home.aiDemo.request")}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/68">
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
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/68">
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
                      className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <div className="text-sm font-semibold text-white">{name}</div>
                      <div className="mt-1 text-xs text-white/72">{meta}</div>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(25,43,26,0.76)] via-[rgba(25,43,26,0.14)] to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/86">{card.description}</p>
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

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white shadow-sm">
  <LogoMark className="h-7 w-7" />
</div>
                <div className="text-base font-semibold text-white">Speisely</div>
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
}
