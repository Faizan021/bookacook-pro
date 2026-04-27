"use client";

import { useI18n, type Locale } from "@/lib/i18n/context";

const languages: { code: Locale; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#d8ccb9] bg-[#fffaf0] p-1 shadow-sm">
      {languages.map((language) => {
        const isActive = locale === language.code;

        return (
          <button
            key={language.code}
            type="button"
            onClick={() => setLocale(language.code)}
            aria-pressed={isActive}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-bold transition",
              isActive
                ? "bg-[#173f35] text-white shadow-sm"
                : "text-[#173f35] hover:bg-[#efe4d2]",
            ].join(" ")}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
