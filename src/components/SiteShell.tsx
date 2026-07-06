import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * SiteShell — the global layout wrapper.
 *
 * Props:
 *   dotted    — show the mint-dotted page background (default: true)
 *   darkHero  — set the outermost container to bg-forest so the sticky
 *               transparent header shows a dark background on cinematic
 *               landing pages rather than the page's cream/mint bg.
 */
export function SiteShell({
  children,
  dotted = true,
  darkHero = false,
}: {
  children: ReactNode;
  dotted?: boolean;
  darkHero?: boolean;
}) {
  return (
    <div
      className={`min-h-screen ${darkHero ? "bg-forest" : dotted ? "bg-mint-dotted" : "bg-background"}`}
    >
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
