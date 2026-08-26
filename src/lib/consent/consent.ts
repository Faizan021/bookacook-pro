export const CONSENT_POLICY_VERSION = "2026-08-26";
export const CONSENT_STORAGE_KEY = "speisely-cookie-consent";

export interface SpeiselyConsentRecord {
  consent: "accepted" | "declined";
  timestamp: string;
  policyVersion: string;
  categories: {
    functional: true;
    analytics: boolean;
  };
}

/**
 * Parses and returns the current structured consent record,
 * migrating legacy scalar string values ("accepted" / "declined") if encountered.
 */
export function getConsent(): SpeiselyConsentRecord | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.consent === "accepted" || parsed.consent === "declined")) {
      return {
        consent: parsed.consent,
        timestamp: parsed.timestamp || new Date().toISOString(),
        policyVersion: parsed.policyVersion || CONSENT_POLICY_VERSION,
        categories: {
          functional: true,
          analytics: parsed.categories?.analytics ?? parsed.consent === "accepted",
        },
      };
    }
  } catch {
    // Migrate legacy raw scalar strings
    if (raw === "accepted" || raw === "declined") {
      const migrated: SpeiselyConsentRecord = {
        consent: raw,
        timestamp: new Date().toISOString(),
        policyVersion: CONSENT_POLICY_VERSION,
        categories: {
          functional: true,
          analytics: raw === "accepted",
        },
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  }

  return null;
}

/**
 * Checks if the user has explicitly granted analytics consent under the current policy version.
 */
export function hasAnalyticsConsent(): boolean {
  const record = getConsent();
  return record !== null && record.consent === "accepted" && record.categories.analytics === true;
}

/**
 * Persists a new structured consent decision and dispatches a CustomEvent for dynamic listeners.
 */
export function setConsent(consent: "accepted" | "declined"): SpeiselyConsentRecord {
  const isAccepted = consent === "accepted";
  const record: SpeiselyConsentRecord = {
    consent,
    timestamp: new Date().toISOString(),
    policyVersion: CONSENT_POLICY_VERSION,
    categories: {
      functional: true,
      analytics: isAccepted,
    },
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));

    if (!isAccepted) {
      clearAnalyticsStorage();
    }

    window.dispatchEvent(new CustomEvent("speisely-consent-updated", { detail: record }));
  }

  return record;
}

/**
 * Clears cookies and local storage items left by third-party analytics (Ahrefs, PostHog, Vercel).
 */
export function clearAnalyticsStorage(): void {
  if (typeof window === "undefined") return;

  // 1. Remove Ahrefs DOM elements
  const ahrefsScript = document.getElementById("ahrefs-analytics-script");
  if (ahrefsScript) ahrefsScript.remove();

  // 2. Clear known analytics cookies across host and parent domains
  const cookiesToClear = ["ph_", "_ph_", "ahrefs_", "_pk_", "_ga", "_gid", "_gat", "va_session"];

  const currentCookies = document.cookie.split(";");
  const host = window.location.hostname;
  const domainParts = host.split(".");
  const rootDomain = domainParts.length > 1 ? `.${domainParts.slice(-2).join(".")}` : host;

  for (const cookie of currentCookies) {
    const name = cookie.split("=")[0].trim();
    if (cookiesToClear.some((prefix) => name.startsWith(prefix))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  }

  // 3. Clear PostHog & analytics keys from localStorage / sessionStorage
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("ph_") || key.startsWith("posthog") || key.startsWith("ahrefs"))) {
        localStorage.removeItem(key);
      }
    }
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith("ph_") || key.startsWith("posthog") || key.startsWith("ahrefs"))) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (e) {
    void e;
  }
}
