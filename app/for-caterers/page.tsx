"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, LayoutDashboard } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

const benefitKeys = [
  {
    icon: Sparkles,
    title: "forCaterers.benefit1Title",
    desc: "forCaterers.benefit1Desc",
  },
  {
    icon: CheckCircle2,
    title: "forCaterers.benefit2Title",
    desc: "forCaterers.benefit2Desc",
  },
  {
    icon: LayoutDashboard,
    title: "forCaterers.benefit3Title",
    desc: "forCaterers.benefit3Desc",
  },
  {
    icon: ShieldCheck,
    title: "forCaterers.benefit4Title",
    desc: "forCaterers.benefit4Desc",
  },
];

export default function ForCaterersPage() {
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
          <Link href="/for-caterers" className="text-[#c49840]">
            {t("home.nav.forCaterers")}
          </Link>
          <Link href="/about" className="transition hover:text-[#c49840]">
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
            href="/signup"
            className="rounded-full bg-[#c49840] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("forCaterers.heroCta")}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("forCaterers.badge")}
            </div>

            <h1 className="mt-8 text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
              {t("forCaterers.heroTitle")}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
              {t("forCaterers.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
              >
                {t("forCaterers.heroCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
              >
                {t("forCaterers.secondaryCta")}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(7,17,12,0.68),rgba(7,17,12,0.18))]" />
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
              alt={t("forCaterers.imageAlt")}
              width={1400}
              height={1000}
              className="h-[520px] w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("forCaterers.benefitsLabel")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            {t("forCaterers.benefitsTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t("forCaterers.benefitsSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {benefitKeys.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {t(item.title)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {t(item.desc)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-8">
        <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-12 md:px-12 md:py-16">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                {t("forCaterers.finalLabel")}
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
                {t("forCaterers.finalTitle")}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
                {t("forCaterers.finalSubtitle")}
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
                >
                  {t("forCaterers.heroCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
                >
                  {t("forCaterers.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
              <Image
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt={t("forCaterers.secondImageAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,17,12,0.55),rgba(7,17,12,0.2))]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
