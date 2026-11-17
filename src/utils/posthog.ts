import posthog from "posthog-js";

export interface AiReferralContext {
  is_ai_traffic: boolean;
  ai_source?: string;
  ai_detection_method?: string;
  ai_landing_page?: string;
  ai_referrer?: string;
}

export const getAiReferralContext = (): AiReferralContext => {
  if (typeof window === "undefined") {
    return { is_ai_traffic: false };
  }

  type CustomWindow = Window & { __speisely_ai_referrer?: string };
  const customWin = window as CustomWindow;

  let source = customWin.__speisely_ai_referrer;
  let method: string | null = null;
  let landing: string | null = null;
  let rawReferrer: string | null = null;

  try {
    source = source || sessionStorage.getItem("speisely_ai_source") || undefined;
    method = sessionStorage.getItem("speisely_ai_medium");
    landing = sessionStorage.getItem("speisely_ai_landing");
    rawReferrer = sessionStorage.getItem("speisely_ai_referrer");
  } catch {
    // sessionStorage might be restricted in private mode
  }

  if (source) {
    return {
      is_ai_traffic: true,
      ai_source: source,
      ai_detection_method: method || "inferred",
      ai_landing_page: landing || window.location.pathname,
      ai_referrer: rawReferrer || document.referrer || undefined,
    };
  }

  return { is_ai_traffic: false };
};

export const initPostHog = () => {
  if (typeof window === "undefined") return;

  const key = import.meta.env.VITE_POSTHOG_KEY || "phc_yJ3z5w4uX07lE6m97O720t72U8Qz7B09vD1gV6oI8vO";
  const host = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

  if (key) {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // Track manually for SPA route changes
      capture_heatmaps: true,
      persistence: "cookie",
      opt_out_capturing_by_default: true, // GDPR opt-in compliance
      disable_session_recording: true, // Prevent recording before consent
      enable_recording_console_log: false, // Disable console log recording to prevent leak of debug data
    });

    // Expose posthog globally on window for debugging/testing
    if (typeof window !== "undefined") {
      (window as any).posthog = posthog;
    }

    // Attach AI Referral attribution super-properties if detected
    const aiContext = getAiReferralContext();
    if (aiContext.is_ai_traffic) {
      posthog.register({
        is_ai_traffic: true,
        ai_source: aiContext.ai_source,
        ai_detection_method: aiContext.ai_detection_method,
        ai_landing_page: aiContext.ai_landing_page,
      });
    }

    // If already accepted, opt in and start session recording
    const consent = localStorage.getItem("speisely-cookie-consent");
    if (consent === "accepted") {
      posthog.opt_in_capturing();
      posthog.startSessionRecording();
    }
  } else {
    console.warn("PostHog: VITE_POSTHOG_KEY is not defined. Tracking is disabled.");
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === "undefined") return;

  // Safely check if PostHog has been initialized
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (key) {
    const aiContext = getAiReferralContext();
    const enrichedProperties = {
      ...properties,
      ...(aiContext.is_ai_traffic
        ? {
            is_ai_traffic: true,
            ai_source: aiContext.ai_source,
            ai_detection_method: aiContext.ai_detection_method,
          }
        : {}),
    };
    posthog.capture(eventName, enrichedProperties);
  }
};
