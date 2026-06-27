import { useI18n, type Lang } from "@/i18n/I18nProvider";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const btn = (l: Lang) =>
    `px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition ${
      lang === l ? "bg-forest text-[oklch(0.97_0.02_92)]" : "text-forest/70 hover:text-forest"
    }`;
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-cream p-1" role="group" aria-label="Language">
      <button onClick={() => setLang("de")} className={btn("de")}>DE</button>
      <button onClick={() => setLang("en")} className={btn("en")}>EN</button>
    </div>
  );
}
