"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

const occasionKeys = [
  {
    titleKey: "home.occasions.wedding",
    descKey: "home.occasions.weddingDesc",
  },
  {
    titleKey: "home.occasions.corporate",
    descKey: "home.occasions.corporateDesc",
  },
  {
    titleKey: "home.occasions.private",
    descKey: "home.occasions.privateDesc",
  },
  {
    titleKey: "home.occasions.ramadan",
    descKey: "home.occasions.ramadanDesc",
  },
];

const principleKeys = [
  {
    icon: BrainCircuit,
    titleKey: "home.principles.item1Title",
    descKey: "home.principles.item1Desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "home.principles.item2Title",
    descKey: "home.principles.item2Desc",
  },
  {
    icon: CheckCircle2,
    titleKey: "home.principles.item3Title",
    descKey: "home.principles.item3Desc",
  },
];

export default function HomePage() {
  const t = useT();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.16) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10 text-sm font-semibold">
            S
          </div>
          <div className="text-xl font-semibold tracking-tight">Speisely</div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#d8d1c2]/75 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            {t("home.nav.browse")}
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            {t("home.heroPlanCta")}
          </Link>
          <Link href="/about" className="transition hover:text-[#c49840]">
            {t("nav.about", "Über Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#eadfca] transition hover:border-[#c49840]/40 hover:text-[#c49840] md:inline-flex"
          >
            {t("home.nav.login")}
          </Link>
          <Link
            href="/request/new"
            className="rounded-full bg-[#c49840] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("home.editorialCtaPrimary")}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.badge")}
            </div>

            <h1 className="mt-8 text-5xl font-medium leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]">
              {t("home.editorialHeroTitle")}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex h-16 flex-1 items-center rounded-[1.4rem] bg-black/10 px-5">
                  <input
                    type="text"
                    placeholder={t("home.editorialSearchPlaceholder")}
                    className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                <Link
                  href="/request/new"
                  className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#c49840] px-7 font-semibold text-black transition hover:scale-[1.02]"
                >
                  {t("home.editorialCtaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/caterers"
                  className="flex h-16 items-center justify-center rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-7 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit1")}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit2")}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit3")}
              </span>
            </div>
          </div>

          <div className="rounded-[2.3rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("home.heroPanel.label")}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">
                {t("home.heroPanel.title")}
              </h2>
              <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
                {t("home.heroPanel.badge")}
              </span>
            </div>

            <p className="mt-4 text-base leading-7 text-[#96a592]">
              {t("home.heroPanel.occasionDesc")}
            </p>

            <div className="mt-8 space-y-5">
              <div className="rounded-[1.4rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  {t("home.heroPanel.guestLabel")}
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {t("home.heroPanel.guestValue")}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  {t("home.heroPanel.notesLabel")}
                </div>
                <div className="mt-2 text-base leading-7 text-white/90">
                  {t("home.heroPanel.notesValue")}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#ddd5c6]">
                {t("home.heroPanel.tag1")}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#ddd5c6]">
                {t("home.heroPanel.tag2")}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#ddd5c6]">
                {t("home.heroPanel.tag3")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("home.principles.label")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            {t("home.principles.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t("home.principles.subtitle")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {principleKeys.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.titleKey}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("home.occasions.label")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            {t("home.editorialOccasionsTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t(
              "home.occasions.subtitle",
              "Entdecken Sie Catering-Lösungen für Hochzeiten, Business-Events und private Anlässe.",
            )}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasionKeys.map((occasion) => (
            <div
              key={occasion.titleKey}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold text-white">
                {t(occasion.titleKey)}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#92a18f]">
                {t(occasion.descKey)}
              </p>
              <div className="mt-6">
                <Link
                  href="/request/new"
                  className="text-sm font-semibold text-[#c49840] transition hover:text-white"
                >
                  {t("home.occasions.cardCta")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
        <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.045] px-8 py-12 text-center backdrop-blur-xl md:px-12 md:py-16">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("home.editorialCtaLabel")}
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            {t("home.editorialCtaTitle")}
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
            {t("home.editorialCtaSubtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              {t("home.editorialCtaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/caterers"
              className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
            >
              {t("home.editorialCtaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#7f9380]">{t("home.editorialFooterTagline")}</p>
      </footer>
    </main>
  );
}
