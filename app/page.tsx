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

function DecorativePlate() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2.5rem] border border-border bg-[linear-gradient(180deg,#fffdf9_0%,#f3ece3_100%)] shadow-[0_30px_80px_rgba(31,28,23,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,162,122,0.22),transparent_28%),radial-gradient(circle_at_78%_14%,rgba(85,98,74,0.18),transparent_24%),radial-gradient(circle_at_70%_82%,rgba(198,162,122,0.12),transparent_30%)]" />

      <div className="absolute left-8 top-8 right-8 rounded-[2rem] border border-border bg-card/90 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-primary/80">
              Curated request
            </div>
            <div className="mt-2 text-xl font-semibold text-foreground">
              A cleaner way to start event catering
            </div>
          </div>
          <div className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            Premium
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-3">
          <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
            <SearchIcon />
            <span className="text-sm text-muted-foreground">
              Wedding dinner in Berlin for 60 guests, elegant buffet, halal options
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-8 right-8 top-[150px] grid gap-3">
        <div className="rounded-[1.75rem] border border-border bg-card/90 p-5 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Occasion
          </div>
          <div className="mt-2 text-lg font-semibold text-foreground">Wedding reception</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Refined service, seasonal menu direction, premium presentation.
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-border bg-card/90 p-5 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Guest count
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">20 to 300+</div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card/90 p-5 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Service style
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">Buffet / staffed</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-primary p-5 text-primary-foreground shadow-sm">
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/70">
            Selection notes
          </div>
          <div className="mt-2 text-base font-semibold">
            Cuisine, dietary preferences, service format, budget, city
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-3">
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
          Weddings
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
          Corporate events
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
          Private occasions
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const t = useT();
  const isRTL = useIsRTL();
  const [aiQuery, setAiQuery] = useState("");

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

  const aiPrompts = useMemo(
    () => [
      t("home.chips.wedding"),
      t("home.chips.corporate"),
      t("home.chips.private"),
    ],
    [t],
  );

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
            <a href="#occasions" className="text-sm text-muted-foreground transition hover:text-foreground">
              {t("home.occasions.title")}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,162,122,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(85,98,74,0.10),transparent_20%)]" />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
              <SparklesIcon />
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-foreground sm:text-6xl xl:text-7xl">
              Premium catering,
              <br />
              curated with more clarity.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Speisely helps you move from broad event ideas to refined catering selections — with a premium request flow built for weddings, business events, and private occasions.
            </p>

            <div className="mt-8 max-w-xl rounded-[1.75rem] border border-border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3 rounded-[1.2rem] bg-background px-4 py-3">
                <SearchIcon />
                <input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Describe your event, city, guest count, and menu direction"
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

            <div className="mt-8 flex flex-wrap gap-4">
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
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                "Structured request flow",
                "Premium positioning for caterers",
                "Built for modern event planning",
              ].map((item) => (
                <div key={item} className="text-sm leading-6 text-muted-foreground">
                  <div className="mb-2 h-px w-10 bg-border" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <DecorativePlate />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="grid gap-8 rounded-[2.5rem] border border-border bg-card p-8 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Curated, not crowded
            </div>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A stronger product experience than a simple caterer list.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Speisely is designed to feel closer to a refined event concierge than a directory. You begin with intent, shape your request with clarity, and continue into a more premium planning journey.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Curated discovery",
                desc: "Start from the occasion, not from endless filters and scattered listings.",
              },
              {
                title: "Structured selection",
                desc: "Turn your event details into a request that actually helps caterers respond well.",
              },
              {
                title: "Clear continuation",
                desc: "Move naturally from website discovery into your dashboard and booking flow.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-border bg-secondary p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-card p-2 text-primary">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="occasions" className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {t("home.occasions.label")}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Explore catering by occasion
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
          {occasionCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[2rem] border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(31,28,23,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary text-lg">
                ✦
              </div>

              <h3 className="mt-6 text-xl font-semibold text-foreground">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {t("home.occasions.cardCta")}
                <ArrowUpRightIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {t("home.steps.label")}
              </div>
              <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                A cleaner path from discovery to event planning.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground">
                Instead of sending people into a noisy marketplace, Speisely can guide them through a more premium flow — from first request to better-matched caterers.
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
                  className="rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  {t("home.cta.dashboard")}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((item) => (
                <div key={item.step} className="rounded-[1.75rem] border border-border bg-secondary p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
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

      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="rounded-[2.5rem] border border-border bg-primary px-8 py-10 text-primary-foreground shadow-sm lg:px-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-primary-foreground/70">
                Premium request entry
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Describe the event. Refine the selection. Continue with clarity.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/80">
                Speisely is built to feel composed from the first click — with a request flow that captures intent, improves discovery, and prepares the ground for better matching later.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/request/new"
                className="rounded-2xl bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Start your event request
              </Link>
              <Link
                href="/caterers"
                className="rounded-2xl border border-primary-foreground/20 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-white/10"
              >
                Browse caterers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-base font-semibold">Speisely</div>
              <div className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                Premium catering marketplace for weddings, business events, and private occasions.
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
      </footer>
    </main>
  );
}
