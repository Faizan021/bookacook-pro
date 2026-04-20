"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";

import de from "@/messages/de.json";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json"; 

// 1. Define the allowed locales
export type Locale = "de" | "en" | "ar"; 

// This type allows for deeply nested objects in your JSON
type NestedMessages = { [key: string]: any };

// 2. Map locales to their imported JSON files
const MESSAGES: Record<Locale, NestedMessages> = { 
  de, 
  en, 
  ar 
};

const STORAGE_KEY = "speisely_lang";
const LEGACY_STORAGE_KEY = "bookacook_lang";
const DEFAULT_LOCALE: Locale = "de";

// List of languages that should read from Right-to-Left (e.g., Arabic)
const RTL_LOCALES: Locale[] = ["ar"]; 

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
  isRTL: false,
});

/**
 * HELPER FUNCTION: Digs through a nested object using a dot-notation string.
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  // 1. Handle initial language load from LocalStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved =
        (localStorage.getItem(STORAGE_KEY) as Locale | null) ||
        (localStorage.getItem(LEGACY_STORAGE_KEY) as Locale | null);

      if (saved && MESSAGES[saved]) {
        setLocaleState(saved);
        localStorage.setItem(STORAGE_KEY, saved);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to load locale from storage", error);
    }
  }, []);

  // 2. Detect if current language is RTL (for Arabic support)
  const isRTL = useMemo(() => RTL_LOCALES.includes(locale), [locale]);

  // 3. Update HTML attributes (lang and dir) when locale changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL, mounted]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to save locale", error);
    }
  }

  /**
   * TRANSLATION FUNCTION
   */
  function t(key: string, fallback?: string): string {
    const value = getNestedValue(MESSAGES[locale], key);
    
    if (value !== undefined) return String(value);

    const defaultValue = getNestedValue(MESSAGES[DEFAULT_LOCALE], key);
    if (defaultValue !== undefined) return String(defaultValue);

    return fallback ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

// Custom hooks for easy usage
export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useContext(I18nContext).t;
}

export function useLocale(): [Locale, (l: Locale) => void] {
  const { locale, setLocale } = useContext(I18nContext);
  return [locale, setLocale];
}

export function useIsRTL() {
  return useContext(I18nContext).isRTL;
}
