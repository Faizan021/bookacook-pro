"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, type Locale } from "@/lib/i18n/context";

const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "en", label: "EN", name: "English" },
];

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 text-white/60"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
      >
        <span>{current.label}</span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1610]/95 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {LOCALES.map((l) => {
            const isActive = locale === l.code;

            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#c49840]/12 text-[#c49840]"
                    : "text-white/85 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span
                  className={`w-7 text-xs font-bold ${
                    isActive ? "text-[#c49840]" : "text-white/45"
                  }`}
                >
                  {l.label}
                </span>
                <span className={isActive ? "font-semibold" : ""}>{l.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
