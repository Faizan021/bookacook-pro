import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window === "undefined") return;

  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

  if (key) {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // Track manually for SPA route changes
      capture_heatmaps: true,
      persistence: "cookie",
      opt_out_capturing_by_default: true, // GDPR opt-in compliance
      disable_session_recording: true,    // Prevent recording before consent
      enable_recording_console_log: false, // Disable console log recording to prevent leak of debug data
    });

    // Expose posthog globally on window for debugging/testing
    if (typeof window !== "undefined") {
      (window as any).posthog = posthog;
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
    posthog.capture(eventName, properties);
  }
};
