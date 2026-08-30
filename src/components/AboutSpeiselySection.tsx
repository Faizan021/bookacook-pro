import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface AboutSpeiselySectionProps {
  className?: string;
}

export function AboutSpeiselySection({ className = "" }: AboutSpeiselySectionProps) {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <section
      className={`surface-card p-6 sm:p-8 rounded-3xl border border-forest/15 bg-white my-10 shadow-xs ${className}`}
      aria-labelledby="about-speisely-title"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b28a3c] mb-2">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <span>{isDe ? "Über Speisely" : "About Speisely"}</span>
      </div>

      <h3
        id="about-speisely-title"
        className="font-display text-xl sm:text-2xl font-bold text-forest mb-3"
      >
        {isDe ? "Über Speisely" : "About Speisely"}
      </h3>

      <p className="text-sm sm:text-base text-forest/80 leading-relaxed">
        {isDe
          ? "Speisely macht die Geschichten hinter Restaurants, Caterern und besonderen Food-Momenten sichtbar. In unserem Magazin teilen wir ausgewählte Erfahrungen aus der Community, stellen kulinarische Konzepte vor und verbinden Leserinnen und Leser mit lokalen Food-Anbietern."
          : "Speisely brings greater visibility to the stories behind restaurants, caterers and memorable food moments. Our magazine shares selected Community experiences, introduces distinctive food concepts and connects readers with local food businesses."}
      </p>

      <p className="text-sm sm:text-base text-forest/80 leading-relaxed mt-3">
        {isDe ? (
          <>
            Du möchtest einen Food-Moment teilen oder dein Restaurant beziehungsweise Catering-Angebot präsentieren? Entdecke die{" "}
            <Link
              to="/community"
              className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
            >
              Speisely Community
            </Link>{" "}
            oder erfahre mehr über eine{" "}
            <Link
              to="/partners"
              className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
            >
              Partnerschaft mit Speisely
            </Link>
            .
          </>
        ) : (
          <>
            Would you like to share a food moment or present your restaurant or catering service? Discover the{" "}
            <Link
              to="/community"
              className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
            >
              Speisely Community
            </Link>{" "}
            or learn more about{" "}
            <Link
              to="/partners"
              className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
            >
              partnering with Speisely
            </Link>
            .
          </>
        )}
      </p>
    </section>
  );
}
