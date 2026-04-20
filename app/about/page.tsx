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
    title: "AI-guided discovery",
    desc: "Speisely transforms natural-language event requests into a clearer catering brief so customers can start faster and discover more relevant partners.",
  },
  {
    icon: ShieldCheck,
    title: "Curated quality",
    desc: "We focus on a more premium and trustworthy catering experience with clearer presentation, stronger positioning, and a more selective marketplace feel.",
  },
  {
    icon: Users,
    title: "Better for both sides",
    desc: "Customers get a smoother planning flow, while caterers receive more structured inquiries that are easier to understand and respond to.",
  },
];

const principles = [
  {
    icon: Sparkles,
    title: "Start with the event, not filters",
    desc: "Instead of sending people into an endless directory, Speisely begins with the occasion, intent, and event details.",
  },
  {
    icon: Wand2,
    title: "Turn rough ideas into structured briefs",
    desc: "A short request like “Wedding for 80 guests in Berlin” becomes a clearer starting point for matching, browsing, and inquiry.",
  },
  {
    icon: CheckCircle2,
    title: "Premium experience throughout",
    desc: "From homepage to request flow to dashboard, Speisely is designed to feel polished, premium, and easier to trust.",
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
          <Link href="/about" className="text-[#c49840]">
            {t("nav.about", "About Speisely")}
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
            About Speisely
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]">
            A premium catering marketplace,
            <span className="mt-2 block text-[#c49840]">
              shaped by AI-guided event planning.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
            Speisely is built to make catering discovery feel more elegant,
            structured, and intelligent. Instead of forcing customers through a
            generic marketplace flow, Speisely helps turn event intent into a
            clearer request — and helps connect that request to the right
            catering partners.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {valueCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {item.desc}
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
              Why Speisely exists
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              Catering discovery should feel clearer, more premium, and more useful.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              Many catering platforms feel like simple directories. Customers
              often have an idea in mind, but not a perfect specification.
              Caterers, on the other hand, need better context to respond well.
            </p>
            <p className="mt-4 text-base leading-8 text-[#96a592]">
              Speisely sits between those two needs. It helps customers express
              what they want in a more natural way, then structures that intent
              into something more useful for matching, browsing, and booking.
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              The AI role
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              AI should make event planning simpler,
              <span className="block">not more confusing.</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              Speisely uses AI as a layer of interpretation and guidance. A user
              can describe an event in plain language, and the system can help
              identify signals like occasion, city, guest count, dietary needs,
              service style, and budget direction.
            </p>
            <p className="mt-4 text-base leading-8 text-[#96a592]">
              The goal is not “AI for the sake of AI.” The goal is a better
              request flow, stronger partner discovery, and a smoother premium
              experience from homepage to shortlist.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Our approach
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            Built around a smarter hospitality flow
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            Speisely is designed to feel less like a cluttered listing site and
            more like a premium planning experience.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map((item) => {
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
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {item.desc}
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
              For customers
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              From vague idea to better shortlist
            </h3>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              Customers often know the feeling or outcome they want, but not the
              exact catering language. Speisely helps bridge that gap through a
              guided experience that starts with natural intent and moves toward
              more structured planning.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              For caterers
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              Better visibility and better inquiries
            </h3>
            <p className="mt-5 text-base leading-8 text-[#96a592]">
              Caterers benefit from a more premium presentation layer and from
              incoming requests that are more structured than a simple message.
              That creates better clarity, stronger positioning, and more useful
              leads.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
        <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.045] px-8 py-12 text-center backdrop-blur-xl md:px-12 md:py-16">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Start planning
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Start with your event,
            <span className="block">not a directory.</span>
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
            Tell Speisely what you are planning and continue into a smarter,
            more premium catering journey.
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
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
  <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl">
    <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
      <div className="px-8 py-12 md:px-12 md:py-16">
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
          {t("home.catererSection.label", "For Caterers")}
        </div>
        <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
          {t("home.catererSection.title", "Grow with better catering inquiries.")}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
          {t(
            "home.catererSection.subtitle",
            "Speisely helps premium caterers receive clearer event requests, present packages professionally, and manage inquiries through one structured platform."
          )}
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/for-caterers"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("home.catererSection.primaryCta", "For Caterers")}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
          >
            {t("home.catererSection.secondaryCta", "Join Speisely")}
          </Link>
        </div>
      </div>

      <div className="relative min-h-[320px] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
          alt={t("home.images.catererAlt", "Professional catering team")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,17,12,0.55),rgba(7,17,12,0.2))]" />
  </div>
</section>
      </footer>
    </main>
  );
}
