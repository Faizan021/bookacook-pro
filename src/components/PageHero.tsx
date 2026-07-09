import { Sparkles } from "lucide-react";

/**
 * PageHero — Shared cinematic dark hero section.
 *
 * Matches the homepage / partners / blog visual language:
 * - Dark forest background with /hero-cinematic.png
 * - Gold (#b28a3c) accent badge
 * - White headline + subtitle text
 * - Optional primary CTA button and secondary ghost button
 *
 * Usage:
 *   <PageHero
 *     eyebrow="EVENT CATERING"
 *     heading={<>Unforgettable moments<br />with <span className="text-[#f2d896]">premium catering.</span></>}
 *     subtext="We connect you with vetted food partners..."
 *     primaryCta={{ label: "Find a Caterer", onClick: () => {} }}
 *     secondaryCta={{ label: "Daily Subscriptions", onClick: () => {} }}
 *   />
 */

export interface PageHeroCta {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface PageHeroProps {
  eyebrow: string;
  heading: React.ReactNode;
  subtext: string;
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  /** Optional right-side image URL. Falls back to hero-cinematic.png */
  imageUrl?: string;
  imageAlt?: string;
}

import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function PageHero({
  eyebrow,
  heading,
  subtext,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt = "Speisely",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* ── Cinematic Background (matches homepage / partners) ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-cinematic.png"
          alt="Speisely Background"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/50" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* ── Left: Text content ── */}
        <div>
          {/* Gold eyebrow badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/90 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
            {eyebrow}
          </span>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.0] drop-shadow-sm">
            {heading}
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed drop-shadow-sm">
            {subtext}
          </p>

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && (
                primaryCta.href ? (
                  <Link
                    to={primaryCta.href as any}
                    className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-7 py-3.5 text-sm font-bold shadow-xl shadow-[#b28a3c]/20 transition-all hover:bg-[#9a7633] hover:scale-105"
                  >
                    {primaryCta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={primaryCta.onClick}
                    className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-7 py-3.5 text-sm font-bold shadow-xl shadow-[#b28a3c]/20 transition-all hover:bg-[#9a7633] hover:scale-105 cursor-pointer"
                  >
                    {primaryCta.label} <ArrowRight className="h-4 w-4" />
                  </button>
                )
              )}
              {secondaryCta && (
                secondaryCta.href ? (
                  <Link
                    to={secondaryCta.href as any}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white/20"
                  >
                    {secondaryCta.label}
                  </Link>
                ) : (
                  <button
                    onClick={secondaryCta.onClick}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white/20 cursor-pointer"
                  >
                    {secondaryCta.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* ── Right: Optional feature image ── */}
        {imageUrl && (
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] group">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent opacity-60" />
          </div>
        )}
      </div>
    </section>
  );
}
