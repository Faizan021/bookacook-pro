"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Users,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

const valueCards = [
  {
    icon: BrainCircuit,
    titleKey: "about.value1Title",
    descKey: "about.value1Desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "about.value2Title",
    descKey: "about.value2Desc",
  },
  {
    icon: Users,
    titleKey: "about.value3Title",
    descKey: "about.value3Desc",
  },
];

const principles = [
  {
    icon: Sparkles,
    titleKey: "about.principle1Title",
    descKey: "about.principle1Desc",
  },
  {
    icon: Wand2,
    titleKey: "about.principle2Title",
    descKey: "about.principle2Desc",
  },
  {
    icon: CheckCircle2,
    titleKey: "about.principle3Title",
    descKey: "about.principle3Desc",
  },
];

export default function AboutPage() {
  const t = useT();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.16) 0%, transparent 30%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
            <LogoMark size={18} color="#e8ddc8" />
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
          <Link href="/for-caterers" className="transition hover:text-[#c49840]">
            {t("home.nav.forCaterers")}
          </Link>
          <Link href="/about" className="text-[#c49840]">
            {t("nav.about")}
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

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            {t("about.badge")}
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]">
            {t("about.heroTitle")}
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
            {t("about.heroSubtitle")}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {valueCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.titleKey}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">
                  {t(item.titleKey)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("about.whyLabel")}
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              {t("about.whyTitle")}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              {t("about.whyDesc1")}
            </p>
            <p className="mt-4 text-base leading-8 text-[#96a592]">
              {t("about.whyDesc2")}
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("about.aiLabel")}
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              {t("about.aiTitle")}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              {t("about.aiDesc1")}
            </p>
            <p className="mt-4 text-base leading-8 text-[#96a592]">
              {t("about.aiDesc2")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("about.approachLabel")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            {t("about.approachTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t("about.approachSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map((item) => {
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
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("about.customersLabel")}
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              {t("about.customersTitle")}
            </h3>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              {t("about.customersDesc")}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("about.caterersLabel")}
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              {t("about.caterersTitle")}
            </h3>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              {t("about.caterersDesc")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
        <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.045] px-8 py-12 text-center backdrop-blur-xl md:px-12 md:py-16">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("about.ctaLabel")}
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            {t("about.ctaTitle")}
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
            {t("about.ctaSubtitle")}
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
        <p className="text-sm text-[#7f9380]">
          {t("home.editorialFooterTagline")}
        </p>
      </footer>
    </main>
  );
}
