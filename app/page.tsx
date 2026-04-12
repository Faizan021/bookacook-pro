"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useT, useIsRTL } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

export default function Home() {
  const t = useT();
  const isRTL = useIsRTL();
  const [aiQuery, setAiQuery] = useState("");

  const highlights = useMemo(
    () => [
      {
        title: t("home.highlight1.title"),
        description: t("home.highlight1.desc"),
      },
      {
        title: t("home.highlight2.title"),
        description: t("home.highlight2.desc"),
      },
      {
        title: t("home.highlight3.title"),
        description: t("home.highlight3.desc"),
      },
      {
        title: t("home.highlight4.title"),
        description: t("home.highlight4.desc"),
      },
    ],
    [t],
  );

  const occasionCards = useMemo(
    () => [
      {
        title: t("home.occasions.wedding"),
        description: t("home.occasions.weddingDesc"),
        href: "/request/new",
      },
      {
        title: t("home.occasions.corporate"),
        description: t("home.occasions.corporateDesc"),
        href: "/request/new",
      },
      {
        title: t("home.occasions.private"),
        description: t("home.occasions.privateDesc"),
        href: "/request/new",
      },
      {
        title: t("home.occasions.ramadan"),
        description: t("home.occasions.ramadanDesc"),
        href: "/request/new",
      },
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

  const chips = useMemo(
    () => [
      t("home.chips.wedding"),
      t("home.chips.corporate"),
      t("home.chips.private"),
      t("home.chips.ramadan"),
      t("home.chips.bbq"),
      t("home.chips.office"),
    ],
    [t],
  );

  const aiPrompts = useMemo(
    () => [
      t("home.chips.wedding"),
      t("home.chips.corporate"),
      t("home.chips.private"),
      t("home.chips.office"),
    ],
    [t],
  );

  const stats = [
    { value: "700+", label: t("metrics.registeredCaterers") },
    { value: "10%", label: t("metrics.platformShare") },
    { value: "24h", label: t("metrics.waitingResponse") },
    { value: "4", label: t("home.steps.title") },
  ];

  const handleAiSubmit = () => {
    const params = new URLSearchParams();
    if (aiQuery.trim()) {
      params.set("q", aiQuery.trim());
    }
    window.location.href = `/request/new${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              S
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">Speisely</div>
              <div className="text-sm text-muted-foreground">{t("home.brandTagline")}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/caterers" className="text-sm text-muted-foreground transition hover:text-foreground">
              {t("home.nav.browse")}
            </Link>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">
              {t("home.nav.howItWorks")}
            </a>
            <a href="#why-speisely" className="text-sm text-muted-foreground transition hover:text-foreground">
              {t("home.nav.whySpeisely")}
            </a>
            <Link href="/login" className="text-sm text-muted-foreground transition hover:text-foreground">
              {t("home.nav.login")}
            </Link>
          </nav>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
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

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,162,122,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(85,98,74,0.10),transparent_20%),linear-gradient(to_bottom,rgba(255,255,255,0.24),transparent)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-primary">
              <SparklesIcon />
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              {t("home.heroTitle")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t("home.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {chips.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/request/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {t("home.cta.startRequest")}
                <ArrowUpRightIcon />
              </Link>

              <Link
                href="/caterers"
                className="rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                {t("home.cta.browse")}
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-border bg-secondary px-6 py-3.5 text-sm font-semibold text-primary transition hover:opacity-90"
              >
                {t("home.cta.dashboard")}
              </Link>
            </div>

            <div className="mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.value + item.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="text-2xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
              <div className="rounded-[1.6rem] border border-border bg-secondary p-6 text-foreground">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary">
                  <SparklesIcon />
                  <span>{t("home.guided.label")}</span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  {t("home.guided.title")}
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {t("home.guided.subtitle")}
                </p>

                <div className="mt-6 rounded-3xl border border-border bg-card p-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                    <SearchIcon />
                    <input
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder={t("home.guided.title")}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      onClick={handleAiSubmit}
                      className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      {t("home.guided.cta")}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {aiPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setAiQuery(prompt)}
                        className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">{t("home.guided.eventType")}</div>
                    <div className="mt-1 font-medium">{t("home.guided.eventTypeValue")}</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="text-xs text-muted-foreground">{t("home.guided.guests")}</div>
                      <div className="mt-1 font-medium">{t("home.guided.guestsValue")}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="text-xs text-muted-foreground">{t("home.guided.budget")}</div>
                      <div className="mt-1 font-medium">{t("home.guided.budgetValue")}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground">{t("home.guided.preferences")}</div>
                    <div className="mt-1 font-medium">{t("home.guided.preferencesValue")}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/request/new"
                    className="inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    {t("home.guided.cta")}
                  </Link>

                  <Link
                    href="/caterers"
                    className="inline-flex rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                  >
                    {t("home.cta.browse")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:py-8">
        <div className="rounded-[2rem] border border-border bg-card px-6 py-6 shadow-sm">
          <div className="text-center text-sm font-medium text-muted-foreground">
            Built for weddings, office catering, private events, and premium occasions
          </div>
        </div>
      </section>

      <section id="why-speisely" className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("home.why.label")}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("home.why.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("home.why.subtitle")}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-border bg-secondary p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                  <SparklesIcon />
                </div>

                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("home.occasions.label")}
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("home.occasions.title")}
            </h2>
          </div>

          <Link
            href="/caterers"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary md:inline-flex"
          >
            {t("home.occasions.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasionCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary text-lg">
                ✦
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t("home.occasions.cardCta")}
                <ArrowUpRightIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-card-foreground shadow-sm lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("home.steps.label")}
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("home.steps.title")}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {t("home.steps.subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  {t("home.cta.planEvent")}
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  {t("home.cta.dashboard")}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-border bg-secondary p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Premium positioning
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Designed to feel premium before the booking even begins.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Speisely should feel like a modern product, not a messy directory. The website
              should inspire confidence, the request flow should reduce friction, and the
              dashboard should make planning feel controlled.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Premium brand feel across website and dashboard",
                "AI-style discovery plus structured booking flow",
                "Built for weddings, office catering, and premium private events",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-secondary p-1 text-primary">
                    <CheckIcon />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-secondary p-8 text-foreground shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">
              Smart request entry
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Add AI search now, then evolve it into true matching later.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Start with a premium AI-style prompt bar that forwards user intent into your
              request flow. Later, connect it to real caterer matching, package suggestions,
              cuisine filtering, and city-aware discovery.
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-card p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Phase 1</div>
                  <div className="mt-1 font-semibold text-foreground">Intent capture</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    User types a request and continues into `/request/new`.
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Phase 2</div>
                  <div className="mt-1 font-semibold text-foreground">Smart matching</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Suggest caterers, packages, cuisines, and service styles.
                  </div>
                </div>
              </div>

              <Link
                href="/request/new"
                className="mt-5 inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Launch the request flow
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-[2rem] border border-border bg-background p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="text-base font-semibold">Speisely</div>
                <div className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {t("home.footerTagline")}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/caterers"
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  {t("home.nav.browse")}
                </Link>
                <Link
                  href="/request/new"
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  {t("home.cta.planEvent")}
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  {t("home.nav.login")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
