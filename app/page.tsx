"use client";

import Image from "next/image";
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

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 3 4.2 6 4.2 9s-1.4 6-4.2 9c-2.8-3-4.2-6-4.2-9s1.4-6 4.2-9z" />
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

  const occasions = useMemo(
    () => [
      {
        title: t("home.occasions.wedding"),
        description: t("home.occasions.weddingDesc"),
        href: "/request/new",
        image: "/images/speisely-wedding.jpg",
      },
      {
        title: t("home.occasions.corporate"),
        description: t("home.occasions.corporateDesc"),
        href: "/request/new",
        image: "/images/speisely-business.jpg",
      },
      {
        title: t("home.occasions.private"),
        description: t("home.occasions.privateDesc"),
        href: "/request/new",
        image: "/images/speisely-private.jpg",
      },
      {
        title: t("home.occasions.ramadan"),
        description: t("home.occasions.ramadanDesc"),
        href: "/request/new",
        image: "/images/speisely-ramadan.jpg",
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

  const prompts = useMemo(
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
    <main
      className="min-h-screen bg-[#e7efe3] text-[#2f392f]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-40 border-b border-[#d6dfd0] bg-[#e7efe3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4f6044] text-sm font-bold text-[#fbf8f1] shadow-sm">
              S
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">Speisely</div>
              <div className="text-sm text-[#6a7367]">{t("home.brandTagline")}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/caterers" className="text-sm text-[#5d665b] transition hover:text-[#2f392f]">
              {t("home.nav.browse")}
            </Link>
            <a href="#how-it-works" className="text-sm text-[#5d665b] transition hover:text-[#2f392f]">
              {t("home.nav.howItWorks")}
            </a>
            <a href="#occasions" className="text-sm text-[#5d665b] transition hover:text-[#2f392f]">
              {t("home.occasions.title")}
            </a>
            <Link href="/login" className="text-sm text-[#5d665b] transition hover:text-[#2f392f]">
              {t("home.nav.login")}
            </Link>
          </nav>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden rounded-xl border border-[#d6dfd0] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-[#2f392f] transition hover:bg-[#f3ecde] sm:inline-flex"
            >
              {t("home.cta.dashboard")}
            </Link>
            <Link
              href="/request/new"
              className="inline-flex rounded-xl bg-[#4f6044] px-4 py-2 text-sm font-semibold text-[#fbf8f1] transition hover:opacity-90"
            >
              {t("home.cta.planEvent")}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,100,60,0.14),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(79,96,68,0.12),transparent_24%)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6dfd0] bg-[#fbf8f1] px-3 py-1 text-xs font-medium text-[#4f6044]">
              <SparklesIcon />
              <span>{t("home.badge")}</span>
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#2f392f] sm:text-6xl xl:text-7xl">
              {t("home.editorialHeroTitle")}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#667063]">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mt-8 max-w-xl rounded-[1.75rem] border border-[#d6dfd0] bg-[#fbf8f1] p-3 shadow-[0_18px_40px_rgba(47,57,47,0.06)]">
              <div className="flex items-center gap-3 rounded-[1.15rem] bg-white px-4 py-3">
                <SearchIcon />
                <input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={t("home.editorialSearchPlaceholder")}
                  className="w-full bg-transparent text-sm text-[#2f392f] placeholder:text-[#798274] focus:outline-none"
                />
                <button
                  onClick={handleAiSubmit}
                  className="shrink-0 rounded-xl bg-[#4f6044] px-4 py-2 text-xs font-semibold text-[#fbf8f1] transition hover:opacity-90"
                >
                  {t("home.guided.cta")}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setAiQuery(prompt)}
                    className="rounded-full border border-[#d6dfd0] bg-[#f3ecde] px-3 py-1.5 text-xs text-[#667063] transition hover:bg-[#ece4d4]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/request/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#4f6044] px-6 py-3.5 text-sm font-semibold text-[#fbf8f1] transition hover:opacity-90"
              >
                {t("home.cta.startRequest")}
                <ArrowUpRightIcon />
              </Link>

              <Link
                href="/caterers"
                className="rounded-2xl border border-[#d6dfd0] bg-[#fbf8f1] px-6 py-3.5 text-sm font-semibold text-[#2f392f] transition hover:bg-[#f3ecde]"
              >
                {t("home.cta.browse")}
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-5 sm:grid-cols-3">
              <div className="text-sm leading-6 text-[#667063]">
                <div className="mb-2 h-px w-10 bg-[#cfd8ca]" />
                {t("home.heroBenefit1")}
              </div>
              <div className="text-sm leading-6 text-[#667063]">
                <div className="mb-2 h-px w-10 bg-[#cfd8ca]" />
                {t("home.heroBenefit2")}
              </div>
              <div className="text-sm leading-6 text-[#667063]">
                <div className="mb-2 h-px w-10 bg-[#cfd8ca]" />
                {t("home.heroBenefit3")}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-[#d6dfd0] bg-[#fbf8f1] shadow-[0_30px_80px_rgba(47,57,47,0.08)]">
                <Image
                  src="/images/speisely-hero.jpg"
                  alt={t("home.images.heroAlt")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(47,57,47,0.50),rgba(47,57,47,0.10),transparent)]" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="max-w-md rounded-[1.75rem] bg-[#fbf8f1]/92 p-5 backdrop-blur">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#4f6044]">
                      {t("home.heroPanel.label")}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-[#2f392f]">
                      {t("home.heroPanel.title")}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-[#667063]">
                      {t("home.heroPanel.occasionDesc")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[2rem] border border-[#d6dfd0] bg-[#fbf8f1] shadow-sm">
                  <div className="relative h-52">
                    <Image
                      src="/images/speisely-business.jpg"
                      alt={t("home.images.businessAlt")}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#7a846f]">
                      {t("home.heroPanel.guestLabel")}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-[#2f392f]">
                      {t("home.heroPanel.guestValue")}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-[#d6dfd0] bg-[#4f6044] text-[#fbf8f1] shadow-sm">
                  <div className="p-5">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#fbf8f1]/70">
                      {t("home.heroPanel.notesLabel")}
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {t("home.heroPanel.notesValue")}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-[#6f7f63]/30">
                    <div className="bg-[#5b6d4e] px-4 py-3 text-sm">{t("home.heroPanel.tag1")}</div>
                    <div className="bg-[#5b6d4e] px-4 py-3 text-sm">{t("home.heroPanel.tag2")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="rounded-full border border-[#d6dfd0] bg-[#fbf8f1] px-4 py-2 text-sm text-[#2f392f]">
                {t("home.heroPanel.tag1")}
              </div>
              <div className="rounded-full border border-[#d6dfd0] bg-[#fbf8f1] px-4 py-2 text-sm text-[#2f392f]">
                {t("home.heroPanel.tag2")}
              </div>
              <div className="rounded-full border border-[#d6dfd0] bg-[#fbf8f1] px-4 py-2 text-sm text-[#2f392f]">
                {t("home.heroPanel.tag3")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="grid gap-8 rounded-[2.5rem] border border-[#d6dfd0] bg-[#fbf8f1] p-8 shadow-sm lg:grid-cols-[1.02fr_0.98fr] lg:p-12">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#7a846f]">
              {t("home.principles.label")}
            </div>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-[#2f392f] sm:text-4xl">
              {t("home.principles.title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#667063]">
              {t("home.principles.subtitle")}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-[#d6dfd0] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-[#f3ecde] p-2 text-[#4f6044]">
                  <CheckIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2f392f]">
                    {t("home.principles.item1Title")}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#667063]">
                    {t("home.principles.item1Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#d6dfd0] bg-[#f3ecde] p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-white p-2 text-[#4f6044]">
                  <CheckIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2f392f]">
                    {t("home.principles.item2Title")}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#667063]">
                    {t("home.principles.item2Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#d6dfd0] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-[#f3ecde] p-2 text-[#4f6044]">
                  <CheckIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2f392f]">
                    {t("home.principles.item3Title")}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#667063]">
                    {t("home.principles.item3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:py-6">
        <div className="rounded-[2rem] border border-[#d6dfd0] bg-[#fbf8f1] px-6 py-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a846f]">
                {t("home.languagesLabel")}
              </div>
              <div className="mt-2 text-lg font-semibold text-[#2f392f]">
                {t("home.languagesTitle")}
              </div>
              <div className="mt-2 text-sm leading-7 text-[#667063]">
                {t("home.languagesSubtitle")}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e7efe3] px-4 py-2 text-sm font-medium text-[#2f392f]">
                <GlobeIcon />
                <span>DE</span>
              </div>
              <div className="rounded-full border border-[#d6dfd0] bg-white px-4 py-2 text-sm text-[#2f392f]">
                EN
              </div>
              <div className="rounded-full border border-[#d6dfd0] bg-white px-4 py-2 text-sm text-[#2f392f]">
                TR
              </div>
              <div className="rounded-full border border-[#d6dfd0] bg-white px-4 py-2 text-sm text-[#2f392f]">
                AR
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="occasions" className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#7a846f]">
              {t("home.occasions.label")}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2f392f] sm:text-4xl">
              {t("home.editorialOccasionsTitle")}
            </h2>
          </div>

          <Link
            href="/caterers"
            className="hidden rounded-xl border border-[#d6dfd0] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-[#2f392f] transition hover:bg-[#f3ecde] md:inline-flex"
          >
            {t("home.occasions.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {occasions.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-[2rem] border border-[#d6dfd0] bg-[#fbf8f1] shadow-sm transition hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(47,57,47,0.08)]"
            >
              <div className="relative h-56">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2f392f]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#667063]">{card.description}</p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4f6044]">
                  {t("home.occasions.cardCta")}
                  <ArrowUpRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 lg:py-14">
        <div className="rounded-[2.5rem] border border-[#d6dfd0] bg-[#fbf8f1] p-8 shadow-sm lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#7a846f]">
                {t("home.steps.label")}
              </div>
              <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-[#2f392f] sm:text-4xl">
                {t("home.editorialStepsTitle")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#667063]">
                {t("home.editorialStepsSubtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-[#4f6044] px-5 py-3 text-sm font-semibold text-[#fbf8f1] transition hover:opacity-90"
                >
                  {t("home.cta.planEvent")}
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-[#d6dfd0] bg-white px-5 py-3 text-sm font-semibold text-[#2f392f] transition hover:bg-[#f3ecde]"
                >
                  {t("home.cta.dashboard")}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((item) => (
                <div key={item.step} className="rounded-[1.75rem] border border-[#d6dfd0] bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4f6044] text-sm font-bold text-[#fbf8f1]">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2f392f]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#667063]">
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
        <div className="overflow-hidden rounded-[2.5rem] border border-[#d6dfd0] bg-[#4f6044] text-[#fbf8f1] shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-10 lg:px-12 lg:py-14">
              <div className="text-xs uppercase tracking-[0.24em] text-[#fbf8f1]/70">
                {t("home.editorialCtaLabel")}
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("home.editorialCtaTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#fbf8f1]/80">
                {t("home.editorialCtaSubtitle")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-2xl bg-[#fbf8f1] px-6 py-3 text-sm font-semibold text-[#2f392f] transition hover:bg-[#f3ecde]"
                >
                  {t("home.editorialCtaPrimary")}
                </Link>
                <Link
                  href="/caterers"
                  className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-[#fbf8f1] transition hover:bg-white/10"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px]">
              <Image
                src="/images/speisely-private.jpg"
                alt={t("home.images.ctaAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(79,96,68,0.08),rgba(79,96,68,0.42))]" />
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-[#d6dfd0] bg-[#fbf8f1]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-base font-semibold text-[#2f392f]">Speisely</div>
              <div className="mt-2 max-w-2xl text-sm leading-7 text-[#667063]">
                {t("home.editorialFooterTagline")}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/caterers"
                className="rounded-xl border border-[#d6dfd0] bg-white px-4 py-2.5 text-sm font-medium text-[#2f392f] transition hover:bg-[#f3ecde]"
              >
                {t("home.nav.browse")}
              </Link>
              <Link
                href="/request/new"
                className="rounded-xl bg-[#4f6044] px-4 py-2.5 text-sm font-semibold text-[#fbf8f1] transition hover:opacity-90"
              >
                {t("home.cta.planEvent")}
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-[#d6dfd0] bg-white px-4 py-2.5 text-sm font-medium text-[#2f392f] transition hover:bg-[#f3ecde]"
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
