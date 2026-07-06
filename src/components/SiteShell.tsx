import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * SiteShell — the global layout wrapper.
 *
 * Props:
 *   dotted    — show the mint-dotted page background (default: true)
 */
export function SiteShell({ children, dotted = true }: { children: ReactNode; dotted?: boolean }) {
  return (
    <div className={`min-h-screen ${dotted ? "bg-mint-dotted" : "bg-background"}`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
