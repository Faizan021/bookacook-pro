import { useI18n } from "@/i18n/I18nProvider";
import { X, Smartphone, Share, MoreVertical } from "lucide-react";

interface PwaInstallHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallHelpModal({ isOpen, onClose }: PwaInstallHelpModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-4 animate-in fade-in duration-200 print:hidden">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-[calc(100vw-24px)] max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#eadfce] pb-3 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-forest text-amber-300 grid place-items-center font-bold shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-forest">
              {t("App installieren", "Install App")}
            </h3>
            <p className="text-xs text-forest/60 font-medium">
              {t("Anleitung zur Installation auf Ihrem Gerät", "Instructions for installing on your device")}
            </p>
          </div>
        </div>

        {/* Installation Instructions for Android & iPhone/iPad */}
        <div className="space-y-3 text-xs">
          {/* iPhone / iPad (Safari) */}
          <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-2">
            <div className="flex items-center gap-2 text-forest font-extrabold">
              <Share className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <p className="text-forest/80 leading-relaxed font-medium">
              {t(
                "Safari öffnen → Teilen-Symbol (Teilen-Icon) antippen → Zum Home-Bildschirm wählen.",
                "Open in Safari → Share icon → Add to Home Screen."
              )}
            </p>
          </div>

          {/* Android (Chrome) */}
          <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-2">
            <div className="flex items-center gap-2 text-forest font-extrabold">
              <MoreVertical className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Android (Chrome / Edge)</span>
            </div>
            <p className="text-forest/80 leading-relaxed font-medium">
              {t(
                "Browser-Menü (Drei Punkte ⋮) öffnen → Zum Startbildschirm hinzufügen / App installieren.",
                "Open the browser menu (Three dots ⋮) → Add to Home screen / Install app."
              )}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-forest text-white font-extrabold text-xs hover:bg-forest/90 transition shadow-sm cursor-pointer min-h-[44px]"
        >
          {t("Verstanden", "Got it")}
        </button>
      </div>
    </div>
  );
}
