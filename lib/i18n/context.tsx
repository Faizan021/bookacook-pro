"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import de from "@/messages/de.json";
import en from "@/messages/en.json";

export type Locale = "de" | "en";

type Messages = Record<string, any>;

const MESSAGES: Record<Locale, Messages> = {
  de,
  en,
};

const STORAGE_KEY = "speisely_lang";
const LEGACY_STORAGE_KEY = "bookacook_lang";
const DEFAULT_LOCALE: Locale = "de";
const RTL_LOCALES: Locale[] = [];

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

function isValidLocale(value: string | null): value is Locale {
  return value === "de" || value === "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY);

      if (isValidLocale(saved)) {
        setLocaleState(saved);
        localStorage.setItem(STORAGE_KEY, saved);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to load locale from storage", error);
    }
  }, []);

  const isRTL = useMemo(() => RTL_LOCALES.includes(locale), [locale]);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL, mounted]);

  function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);

    try {
      localStorage.setItem(STORAGE_KEY, nextLocale);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to save locale", error);
    }
  }

  function t(key: string, fallback?: string): string {
    const localeMessages = MESSAGES[locale];
    const defaultMessages = MESSAGES[DEFAULT_LOCALE];

    const directValue = localeMessages[key];
    if (directValue !== undefined) return String(directValue);

    const nestedValue = getNestedValue(localeMessages, key);
    if (nestedValue !== undefined) return String(nestedValue);

    const directDefaultValue = defaultMessages[key];
    if (directDefaultValue !== undefined) return String(directDefaultValue);

    const nestedDefaultValue = getNestedValue(defaultMessages, key);
    if (nestedDefaultValue !== undefined) return String(nestedDefaultValue);

    return fallback ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useContext(I18nContext).t;
}

export function useLocale(): [Locale, (locale: Locale) => void] {
  const { locale, setLocale } = useContext(I18nContext);
  return [locale, setLocale];
}

export function useIsRTL() {
  return useContext(I18nContext).isRTL;
}
