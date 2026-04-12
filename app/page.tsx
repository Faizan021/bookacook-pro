"use client";

import Link from "next/link";
import { useT, useIsRTL } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default function Home() {
  const t = useT();
  const isRTL = useIsRTL();

  const highlights = [
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
  ];

  const occasionCards = [
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
  ];

  const steps = [
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

  const chips = [
    t("home.chips.wedding"),
    t("home.chips.corporate"),
    t("home.chips.private"),
    t("home.chips.ramadan"),
    t("home.chips.bbq"),
    t("home.chips.office"),
  ];

  return (
    <main
      className="min-h-screen bg-neutral-50 text-neutral-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
              S
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">
                Speisely
              </div>
              <div className="text-xs text-neutral-500">
                {t("home.brandTagline")}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/caterers" className="text-sm text-neutral-600 hover:text-neutral-900">
              {t("home.nav.browse")}
            </Link>
            <a href="#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900">
              {t("home.nav.howItWorks")}
            </a>
            <a href="#why-speisely" className="text-sm text-neutral-600 hover:text-neutral-900">
              {t("home.nav.whySpeisely")}
            </a>
            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
              {t("home.nav.login")}
            </Link>
          </nav>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:inline-flex"
            >
              {t("home.cta.dashboard")}
            </Link>
            <Link
              href="/request/new"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.08),_transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
              {t("home.badge")}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-neutral-950 sm:text-6xl">
              {t("home.heroTitle")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              {t("home.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {chips.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/request/new"
                className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                {t("home.cta.startRequest")}
              </Link>
              <Link
                href="/caterers"
                className="rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
              >
                {t("home.cta.browse")}
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                {t("home.cta.dashboard")}
              </Link>
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
              <div className="rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-orange-900 p-6 text-white">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {t("home.guided.label")}
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  {t("home.guided.title")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {t("home.guided.subtitle")}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="text-xs text-white/60">{t("home.guided.eventType")}</div>
                    <div className="mt-1 font-medium">{t("home.guided.eventTypeValue")}</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                      <div className="text-xs text-white/60">{t("home.guided.guests")}</div>
                      <div className="mt-1 font-medium">{t("home.guided.guestsValue")}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                      <div className="text-xs text-white/60">{t("home.guided.budget")}</div>
                      <div className="mt-1 font-medium">{t("home.guided.budgetValue")}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="text-xs text-white/60">{t("home.guided.preferences")}</div>
                    <div className="mt-1 font-medium">{t("home.guided.preferencesValue")}</div>
                  </div>
                </div>

                <Link
                  href="/request/new"
                  className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
                >
                  {t("home.guided.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-speisely" className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              {t("home.why.label")}
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {t("home.why.title")}
            </h2>
            <p className="mt-4 text-neutral-600">
              {t("home.why.subtitle")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
              >
                <h3 className="text-base font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
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
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              {t("home.occasions.label")}
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {t("home.occasions.title")}
            </h2>
          </div>

          <Link
            href="/caterers"
            className="hidden rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 md:inline-flex"
          >
            {t("home.occasions.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasionCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-lg text-orange-700">
                ✦
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {card.description}
              </p>
              <div className="mt-5 text-sm font-semibold text-orange-700">
                {t("home.occasions.cardCta")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <div className="rounded-[2rem] bg-neutral-950 p-8 text-white lg:p-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">
              {t("home.steps.label")}
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {t("home.steps.title")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {t("home.steps.subtitle")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="text-xs font-semibold tracking-[0.2em] text-orange-300">
                  STEP {item.step}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
            >
              {t("home.cta.planEvent")}
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("home.cta.dashboard")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">Speisely</div>
            <div className="mt-1 text-sm text-neutral-500">
              {t("home.footerTagline")}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <Link href="/caterers" className="hover:text-neutral-900">
              {t("home.nav.browse")}
            </Link>
            <Link href="/request/new" className="hover:text-neutral-900">
              {t("home.cta.planEvent")}
            </Link>
            <Link href="/login" className="hover:text-neutral-900">
              {t("home.nav.login")}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
