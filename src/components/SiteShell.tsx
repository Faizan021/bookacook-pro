import type { ReactNode } from "react";
import { useEffect } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * SiteShell — the global layout wrapper.
 *
 * Props:
 *   dotted    — show the mint-dotted page background (default: true)
 */
export function SiteShell({ children, dotted = true }: { children: ReactNode; dotted?: boolean }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let animationFrameId: number;
    let lenisInstance: { raf: (time: number) => void; destroy?: () => void } | null = null;

    const modName = "lenis";
    import(/* @vite-ignore */ modName)
      .then((LenisModule) => {
        const Lenis = LenisModule.default || LenisModule;
        lenisInstance = new Lenis();
        function raf(time: number) {
          if (lenisInstance) {
            lenisInstance.raf(time);
            animationFrameId = requestAnimationFrame(raf);
          }
        }
        animationFrameId = requestAnimationFrame(raf);
      })
      .catch(() => {});

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenisInstance) lenisInstance.destroy?.();
    };
  }, []);

  return (
    <div className={`min-h-screen ${dotted ? "bg-mint-dotted" : "bg-background"}`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
