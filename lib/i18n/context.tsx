"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import de from "@/messages/de.json";
import en from "@/messages/en.json";

export type Locale = "de" | "en";

type Messages = Record<string, string>;

const MESSAGES: Record<Locale, Messages> = { de, en };

const STORAGE_KEY = "speisely_lang";
const LEGACY_STORAGE_KEY = "bookacook_lang";
const DEFAULT_LOCALE: Locale = "de";

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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

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
      } else {
        localStorage.setItem(STORAGE_KEY, DEFAULT_LOCALE);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      // localStorage may not be available
    }
  }, []);

  const isRTL = false;

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.dir = "ltr";
    document.documentElement.lang = locale;
  }, [locale, mounted]);

  function setLocale(l: Locale) {
    setLocaleState(l);

    try {
      localStorage.setItem(STORAGE_KEY, l);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function t(key: string, fallback?: string): string {
    return (
      MESSAGES[locale][key] ??
      MESSAGES[DEFAULT_LOCALE][key] ??
      fallback ??
      key
    );
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

export function useLocale(): [Locale, (l: Locale) => void] {
  const { locale, setLocale } = useContext(I18nContext);
  return [locale, setLocale];
}

export function useIsRTL() {
  return useContext(I18nContext).isRTL;
}
