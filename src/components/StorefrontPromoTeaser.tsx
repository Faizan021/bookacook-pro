import React, { useState, useEffect } from "react";
import { Sparkles, X, ChevronRight, Megaphone } from "lucide-react";
import { trackEvent } from "@/utils/posthog";

export const STOREFRONT_PROMO_TEASER_ENABLED = true;

export interface StorefrontPromoData {
  enabled: boolean;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  target_type: "category" | "reserve" | "catering";
  target_value?: string | null;
}

interface Props {
  restaurantId: string;
  data?: StorefrontPromoData | null;
  isCartOpen?: boolean;
  onSelectCategory?: (category: string) => void;
}

export function StorefrontPromoTeaser({
  restaurantId,
  data,
  isCartOpen = false,
  onSelectCategory,
}: Props) {
  const [scrolledPast300, setScrolledPast300] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [hasLoggedImpression, setHasLoggedImpression] = useState(false);

  // Session dismissal check (Defensive try/catch)
  useEffect(() => {
    try {
      const storageKey = `speisely_dismissed_promo_${restaurantId}`;
      if (typeof window !== "undefined" && window.sessionStorage.getItem(storageKey) === "true") {
        setIsDismissed(true);
      }
    } catch (e) {
      // In-memory state acts as fallback if sessionStorage is blocked
    }
  }, [restaurantId]);

  // Desktop scroll threshold listener (>300px)
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setScrolledPast300(true);
      } else {
        setScrolledPast300(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // PostHog Impression Tracking
  useEffect(() => {
    if (scrolledPast300 && !isDismissed && !hasLoggedImpression && data?.title) {
      trackEvent("promo_teaser_impression", {
        restaurant_id: restaurantId,
        title: data.title,
        target_type: data.target_type,
      });
      setHasLoggedImpression(true);
    }
  }, [scrolledPast300, isDismissed, hasLoggedImpression, restaurantId, data]);

  if (!STOREFRONT_PROMO_TEASER_ENABLED || !data || !data.enabled || !data.title) {
    return null;
  }

  // Flow suppression: Hide if cart drawer is open or if dismissed
  if (isDismissed || isCartOpen) {
    return null;
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setIsDismissed(true);
    if (!data) return;
    trackEvent("promo_teaser_dismissed", {
      restaurant_id: restaurantId,
      title: data.title,
    });
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(`speisely_dismissed_promo_${restaurantId}`, "true");
      }
    } catch (e) {
      // Memory fallback
    }
  }

  function handleCtaClick() {
    if (!data) return;
    trackEvent("promo_teaser_cta_clicked", {
      restaurant_id: restaurantId,
      title: data.title,
      target_type: data.target_type,
      target_value: data.target_value,
    });

    // Save attribution payload for same-session last-click conversion
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "speisely_promo_last_click",
          JSON.stringify({
            restaurant_id: restaurantId,
            title: data.title,
            timestamp: Date.now(),
          }),
        );
      }
    } catch (e) {
      // Ignore storage errors
    }

    if (data.target_type === "category" && data.target_value) {
      if (onSelectCategory) {
        onSelectCategory(data.target_value);
      }
      const catEl = document.getElementById(`category-${data.target_value}`);
      if (catEl) {
        catEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (data.target_type === "reserve") {
      const resEl = document.getElementById("reservations");
      if (resEl) {
        resEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (data.target_type === "catering") {
      const catEl = document.getElementById("catering") || document.getElementById("contact");
      if (catEl) {
        catEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = "/catering";
      }
    }

    setIsMobileExpanded(false);
  }

  return (
    <>
      {/* Mobile Teaser Pill (Visible on small screens, bottom-left, non-blocking) */}
      <div className="md:hidden fixed bottom-20 left-4 z-40">
        {!isMobileExpanded ? (
          <button
            onClick={() => {
              setIsMobileExpanded(true);
              trackEvent("promo_teaser_expanded", {
                restaurant_id: restaurantId,
                title: data.title,
              });
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-forest/95 text-cream rounded-full text-xs font-medium shadow-xl border border-white/20 backdrop-blur-md animate-fade-in"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="font-semibold">{data.title}</span>
            <span className="text-[10px] opacity-70">• Tippen</span>
          </button>
        ) : (
          <div className="bg-white border border-forest/15 rounded-2xl p-4 shadow-2xl max-w-[280px] text-forest space-y-3 relative animate-scale-in">
            <button
              onClick={handleDismiss}
              aria-label="Schließen"
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-forest rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="w-12 h-12 rounded-xl object-cover border border-forest/10 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 grid place-items-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
              <div className="pr-4">
                <h4 className="font-display text-xs font-bold text-forest leading-snug">
                  {data.title}
                </h4>
                {data.subtitle && (
                  <p className="text-[11px] text-forest/70 mt-1 line-clamp-2 leading-relaxed">
                    {data.subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCtaClick}
              className="w-full py-2 bg-forest text-cream text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <span>
                {data.target_type === "category"
                  ? `Zu ${data.target_value || "Speisen"}`
                  : data.target_type === "reserve"
                    ? "Tisch reservieren"
                    : "Catering anfragen"}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop Floating Card (Triggers only after scrolling >300px, bottom-6 left-6) */}
      {scrolledPast300 && (
        <div className="hidden md:block fixed bottom-6 left-6 z-40 max-w-sm animate-slide-up">
          <div className="relative p-4 bg-white/95 backdrop-blur-md border border-forest/15 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <button
              onClick={handleDismiss}
              aria-label="Schließen"
              className="absolute top-2.5 right-2.5 p-1 text-muted-foreground hover:text-forest rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-4">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="w-14 h-14 rounded-xl object-cover border border-forest/10 shrink-0 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 grid place-items-center shrink-0">
                  <Megaphone className="h-6 w-6 text-amber-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full mb-1">
                  <Sparkles className="h-3 w-3" /> Angebot
                </span>
                <h4 className="font-display text-sm font-bold text-forest leading-snug truncate">
                  {data.title}
                </h4>
                {data.subtitle && (
                  <p className="text-xs text-forest/75 mt-0.5 line-clamp-2 leading-normal">
                    {data.subtitle}
                  </p>
                )}

                <button
                  onClick={handleCtaClick}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest text-cream text-xs font-semibold rounded-xl hover:bg-forest/90 transition shadow-sm"
                >
                  <span>
                    {data.target_type === "category"
                      ? `Zu ${data.target_value || "Speisen"}`
                      : data.target_type === "reserve"
                        ? "Tisch reservieren"
                        : "Catering anfragen"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
