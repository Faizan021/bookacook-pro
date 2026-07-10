import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/I18nProvider";

interface SubscriptionTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function SubscriptionTermsModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SubscriptionTermsModalProps) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [agreed, setAgreed] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-forest">
            {tt("Abonnement besttigen", "Confirm Subscription")}
          </DialogTitle>
          <DialogDescription>
            {tt(
              "Bitte besttigen Sie die Bedingungen Ihres Starter-Pakets.",
              "Please review and confirm the terms for your Starter Plan.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 my-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-muted-foreground">{tt("Plan", "Plan")}</span>
            <span className="font-semibold text-forest">{tt("Starter-Paket", "Starter Plan")}</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-muted-foreground">{tt("Preis", "Price")}</span>
            <span className="font-semibold text-forest">€34.99 / {tt("Monat", "month")}</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-muted-foreground">
              {tt("Abrechnungszyklus", "Billing Cycle")}
            </span>
            <span className="font-semibold text-forest">
              {tt("Automatische monatliche Verlngerung", "Auto-renews monthly")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{tt("Kndigung", "Cancellation")}</span>
            <span className="font-semibold text-forest">
              {tt("Jederzeit kndbar", "Cancel anytime")}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3 mt-4 mb-6">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(c) => setAgreed(c as boolean)}
            className="mt-1"
          />
          <Label
            htmlFor="terms"
            className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
          >
            {tt(
              "Ich stimme den Nutzungsbedingungen zu und autorisiere Speisely, den oben genannten Betrag monatlich wiederkehrend abzubuchen, bis das Abonnement gekndigt wird.",
              "I agree to the Terms of Service and authorize Speisely to charge my payment method for the recurring amount above on a monthly basis until canceled.",
            )}
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {tt("Abbrechen", "Cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!agreed || isLoading}
            className="bg-forest hover:bg-forest/90 text-cream"
          >
            {isLoading
              ? tt("Ldt...", "Loading...")
              : tt("Zustimmen & Abonnieren", "Agree & Subscribe")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
