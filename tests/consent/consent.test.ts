/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from "vitest";
import {
  getConsent,
  setConsent,
  hasAnalyticsConsent,
  clearAnalyticsStorage,
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
} from "@/lib/consent/consent";

// Polyfill localStorage and window for Node.js test environment
const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => mockStorage.get(key) ?? null,
  setItem: (key: string, val: string) => mockStorage.set(key, String(val)),
  removeItem: (key: string) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
  get length() {
    return mockStorage.size;
  },
  key: (i: number) => Array.from(mockStorage.keys())[i] || null,
};

(globalThis as any).localStorage = localStorageMock;
(globalThis as any).window = {
  location: { hostname: "speisely.de" },
  dispatchEvent: () => true,
};

describe("Speisely Cookie Consent Engine", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns null when no consent has been given", () => {
    expect(getConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("persists structured consent record when accepted", () => {
    const record = setConsent("accepted");
    expect(record.consent).toBe("accepted");
    expect(record.policyVersion).toBe(CONSENT_POLICY_VERSION);
    expect(record.categories.analytics).toBe(true);
    expect(record.categories.functional).toBe(true);
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("persists structured consent record when declined", () => {
    const record = setConsent("declined");
    expect(record.consent).toBe("declined");
    expect(record.categories.analytics).toBe(false);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("transparently migrates legacy scalar strings into structured versioned record", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    const migrated = getConsent();
    expect(migrated).not.toBeNull();
    expect(migrated?.consent).toBe("accepted");
    expect(migrated?.policyVersion).toBe(CONSENT_POLICY_VERSION);
    expect(migrated?.categories.analytics).toBe(true);
  });
});
