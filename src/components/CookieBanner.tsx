import { useState, useEffect } from "react";

import { useI18n } from "@/i18n/I18nProvider";
import posthog from "posthog-js";

export function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already gave consent
    const consent = localStorage.getItem("speisely-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("speisely-cookie-consent", "accepted");
    if (typeof window !== "undefined") {
      posthog.opt_in_capturing();
      posthog.startSessionRecording();
      // Track the landing pageview that was blocked prior to opt-in
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: window.location.pathname,
      });
    }
    setVisible(false);
  };

  const handleCustomize = () => {
    localStorage.setItem("speisely-cookie-consent", "declined");
    if (typeof window !== "undefined") {
      posthog.opt_out_capturing();
      posthog.stopSessionRecording();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[oklch(0.85_0.05_152)] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-3.5 sm:p-5 transition-transform duration-300">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="text-[13px] md:text-sm text-forest/80 text-center md:text-left leading-normal">
          <span>
            {t(
              "We use cookies to improve our website and provide you with a better experience.",
              "Wir verwenden Cookies, um unsere Website zu verbessern und dir ein besseres Erlebnis zu bieten."
            )}
          </span>{" "}
          <a
            href="/privacy-policy"
            className="text-[#22C55E] font-medium underline hover:text-[#22C55E]/90 transition"
          >
            {t("Privacy Policy", "Datenschutzbestimmungen")}
          </a>
        </div>
        <div className="flex flex-row gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleCustomize}
            className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-full border border-forest/20 bg-transparent px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium text-forest hover:bg-cream transition cursor-pointer"
          >
            {t("Customize", "Anpassen")}
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 md:flex-initial inline-flex items-center justify-center rounded-full bg-[#22C55E] text-white px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold hover:opacity-90 transition shadow-sm cursor-pointer"
          >
            {t("Accept all", "Alle akzeptieren")}
          </button>
        </div>
      </div>
    </div>
  );
}
