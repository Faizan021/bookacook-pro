import { useI18n, type Lang } from "@/i18n/I18nProvider";

export function LanguageToggle({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { lang, setLang } = useI18n();
  const isLight = variant === "light";

  const containerClass = isLight
    ? "inline-flex items-center gap-0.5 rounded-full bg-white/10 border border-white/20 p-1"
    : "inline-flex items-center gap-0.5 rounded-full bg-cream p-1";

  const btn = (l: Lang) =>
    `px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition ${
      lang === l
        ? isLight
          ? "bg-white text-forest"
          : "bg-forest text-[oklch(0.97_0.02_92)]"
        : isLight
          ? "text-white/70 hover:text-white"
          : "text-forest/70 hover:text-forest"
    }`;

  return (
    <div className={containerClass} role="group" aria-label="Language">
      <button onClick={() => setLang("de")} className={btn("de")}>
        DE
      </button>
      <button onClick={() => setLang("en")} className={btn("en")}>
        EN
      </button>
    </div>
  );
}
