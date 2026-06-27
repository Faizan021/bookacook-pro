import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Printer, X, Info, HelpCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PrintOnboardingBannerProps {
  type: "thermal" | "a4";
  brandName: string;
}

export function PrintOnboardingBanner({ type, brandName }: PrintOnboardingBannerProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const storageKey = `speisely-dismiss-print-onboarding-${type}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) {
        setVisible(true);
      }
    }
  }, [storageKey]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 pr-12 shadow-sm animate-fade-in mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-brand-orange/10 p-1.5 text-brand-orange">
            <Printer className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-forest">
              {type === "thermal"
                ? t("Direct POS Ticket Printing Active", "Direkter POS-Belegdruck aktiv")
                : t("A4 Brief & Lead PDF Export Ready", "A4 Lead- & Brief-Druck bereit")}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
              {type === "thermal"
                ? t(
                    `You can now print physical orders from ${brandName} directly to your 80mm thermal receipt printer.`,
                    `Du kannst jetzt Bestellungen von ${brandName} direkt auf deinem 80mm Thermo-Bondrucker ausdrucken.`
                  )
                : t(
                    `Print neat event summaries from ${brandName} formatted for standard A4 clipboards, binders, or kitchen prep sheets.`,
                    `Drucke strukturierte Veranstaltungszettel für ${brandName} optimiert für A4-Klemmbretter, Ordner oder die Küche aus.`
                  )}
              {" "}
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-0.5 font-semibold text-brand-orange hover:underline focus:outline-none cursor-pointer"
              >
                {t("Learn how to configure", "Einrichtungs-Anleitung ansehen")} &rarr;
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-forest/5 hover:text-forest transition cursor-pointer"
          title={t("Dismiss", "Ausblenden")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Printer className="h-5 w-5 text-brand-orange" />
              {type === "thermal"
                ? t("POS Printer Settings Guide", "Druckereinstellungen für Bondrucker")
                : t("A4 Document Print Settings Guide", "A4 Druckereinstellungen")}
            </DialogTitle>
            <DialogDescription>
              {type === "thermal"
                ? t(
                    "Follow these print settings in the browser dialog for perfect 80mm receipts:",
                    "Befolge diese Schritte im Browser-Druckdialog für perfekte 80mm Quittungsbelege:"
                  )
                : t(
                    "Follow these print settings in your browser for premium, clean A4 event pages:",
                    "Nutze diese Einstellungen im Browser für saubere, professionelle A4-Eventzettel:"
                  )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {type === "thermal" ? (
              <>
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">1</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Set margins to None", "Ränder auf 'Keine' setzen")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Under 'More Settings', set Margins to 'None'. This ensures the print fills the 80mm roll width perfectly.", "Setze unter 'Weitere Einstellungen' die Ränder auf 'Keine', damit der Druck die 80mm Breite voll ausfüllt.")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">2</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Turn off Headers & Footers", "Kopf- und Fußzeilen deaktivieren")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Uncheck 'Headers and footers' to remove browser-generated URL links and dates from the receipt edge.", "Deaktiviere 'Kopf- und Fußzeilen', um unerwünschte URL-Links und Datumstexte am Rand zu entfernen.")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">3</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Choose correct paper width", "Korrekte Papierbreite auswählen")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Ensure paper size is set to '80mm' or 'Roll Paper' rather than Letter/A4.", "Vergewissere dich, dass das Papierformat auf '80mm' oder 'Rollenpapier' steht, nicht auf A4.")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">1</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Enable Background Graphics", "Hintergrundgrafiken aktivieren")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Check the 'Background graphics' option in the print preview. This preserves the status badges, timelines, and grid styling.", "Aktiviere das Kontrollkästchen 'Hintergrundgrafiken' in der Druckvorschau, um Status-Badges und Tabellendesigns darzustellen.")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">2</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Keep margins Default or Minimum", "Standard-Ränder verwenden")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Set Margins to 'Default' or 'Minimum' to give the event checklist and notes grid perfect spacing on paper.", "Belasse die Ränder auf 'Standard' oder 'Minimum', um perfekte Abstände auf dem A4-Blatt zu gewährleisten.")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">3</div>
                  <div>
                    <h5 className="font-semibold text-sm">{t("Select Portrait Layout", "Hochformat auswählen")}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Make sure the printing orientation is set to 'Portrait' layout.", "Stelle sicher, dass die Ausrichtung auf 'Hochformat' eingestellt ist.")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={() => setModalOpen(false)} className="rounded-full bg-forest text-white hover:opacity-90">
              <Check className="mr-1.5 h-4 w-4" /> {t("Got it", "Verstanden")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
