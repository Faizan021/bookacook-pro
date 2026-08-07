import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { X, Settings, Download, Utensils, Banknote, Store, Globe, Check } from "lucide-react";
import { exportFullDataBackupJSON } from "@/lib/festival/exportUtils";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  restaurantName: string;
  eventName: string;
  standName: string;
  tableModeEnabled: boolean;
  onToggleTableMode: (enabled: boolean) => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  restaurantName,
  eventName,
  standName,
  tableModeEnabled,
  onToggleTableMode,
  onClose,
}: SettingsModalProps) {
  const { t, lang, setLang } = useI18n();
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      await exportFullDataBackupJSON();
      toast.success("Komplett-Sicherung (JSON) erfolgreich heruntergeladen!");
    } catch (err) {
      console.error("Backup export error:", err);
      toast.error("Sicherung konnte nicht erstellt werden.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-[calc(100vw-24px)] max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#eadfce] pb-3 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-forest text-cream grid place-items-center font-bold shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-forest">
              {t("Einstellungen", "Settings")}
            </h3>
            <p className="text-xs text-forest/60 font-medium">
              {t("Betriebsparameter & Daten-Sicherung", "Operational configuration & data backup")}
            </p>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-3.5 text-xs">
          {/* Restaurant & Festival Info Display */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#eadfce] space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest/60 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-forest/50" />
              {t("Standort & Veranstaltung", "Location & Event")}
            </span>
            <div className="space-y-1 font-semibold text-forest">
              <div className="flex justify-between">
                <span className="text-forest/60">Restaurant:</span>
                <span className="font-bold">{restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest/60">Event:</span>
                <span className="font-bold">{eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest/60">Stand:</span>
                <span className="font-bold">{standName}</span>
              </div>
            </div>
          </div>

          {/* Table Numbers Toggle */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#eadfce] flex items-center justify-between gap-2">
            <div className="space-y-0.5 max-w-[65%]">
              <span className="font-extrabold text-forest text-xs flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-700 shrink-0" />
                {t("Tischnummern Abfragen", "Enable Table Numbers")}
              </span>
              <p className="text-[11px] text-forest/60">
                {t(
                  "Bei Deaktivierung wird die Tischabfrage für maximales Ausgabetempo ausgeblendet.",
                  "When disabled, table selection is hidden for maximum counter speed."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleTableMode(!tableModeEnabled)}
              className={`px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center gap-1 min-h-[44px] shrink-0 ${
                tableModeEnabled
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {tableModeEnabled && <Check className="w-3.5 h-3.5 text-amber-800" />}
              <span>{tableModeEnabled ? t("Aktiviert", "Enabled") : t("Deaktiviert", "Disabled")}</span>
            </button>
          </div>

          {/* Language Switcher */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#eadfce] flex items-center justify-between">
            <span className="font-extrabold text-forest text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-forest/70" />
              {t("Sprache / Language", "Language")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLang("de")}
                className={`px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer min-h-[44px] ${
                  lang === "de"
                    ? "bg-forest text-white border-forest"
                    : "bg-cream text-forest border-[#eadfce]"
                }`}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer min-h-[44px] ${
                  lang === "en"
                    ? "bg-forest text-white border-forest"
                    : "bg-cream text-forest border-[#eadfce]"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Data Backup (JSON Export) */}
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>{t("Lokale Daten-Sicherung", "Local Data Backup")}</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              {t(
                "Exportieren Sie alle Schichten und Bestellungen als JSON-Datei zur lokalen Sicherung.",
                "Export all shifts and transactions as a JSON file for local backup recovery."
              )}
            </p>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportBackup}
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>{t("⬇ Komplett-Sicherung (JSON)", "⬇ Export All Data (JSON)")}</span>
            </button>
          </div>
        </div>

        {/* Close Action */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition cursor-pointer min-h-[44px]"
        >
          {t("Fertig", "Done")}
        </button>
      </div>
    </div>
  );
}
