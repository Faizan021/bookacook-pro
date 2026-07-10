import React, { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getMyConsent, updateMyConsent } from "@/lib/consent.functions";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export function CommunicationPreferences() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const fetchConsent = useServerFn(getMyConsent);
  const saveConsent = useServerFn(updateMyConsent);

  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchConsent();
        setOptIn(res?.marketing_opt_in ?? false);
      } catch (e) {
        console.error("Failed to load consent preferences", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveConsent({ data: { marketing_opt_in: optIn } });
      toast.success(
        tt(
          "Kommunikationseinstellungen erfolgreich aktualisiert!",
          "Communication preferences updated successfully!",
        ),
      );
    } catch (e: any) {
      toast.error(e.message || "Failed to update preferences");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded-xl mt-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
        <h3 className="font-display text-xl text-forest">
          {tt("Kommunikationseinstellungen", "Communication Preferences")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {tt(
            "Verwalten Sie, wie wir Sie kontaktieren und welche E-Mails Sie erhalten.",
            "Manage how we contact you and the emails you receive from us.",
          )}
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="flex items-start gap-3">
          <Checkbox
            id="marketing-opt"
            checked={optIn}
            onCheckedChange={(checked) => setOptIn(!!checked)}
            className="mt-1 border-forest/20 text-forest data-[state=checked]:bg-forest data-[state=checked]:border-forest"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="marketing-opt"
              className="text-sm font-medium text-forest cursor-pointer"
            >
              {tt(
                "Ja, ich möchte Updates, Branchen-Tipps und Angebote von Speisely erhalten",
                "Yes, I want to receive updates, industry tips, and promotions from Speisely",
              )}
            </Label>
            <p className="text-xs text-muted-foreground">
              {tt(
                "Sie können diese Einwilligung jederzeit widerrufen, indem Sie dieses Häkchen entfernen.",
                "You can withdraw your consent at any time by unchecking this box.",
              )}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer"
          >
            {saving
              ? tt("Wird gespeichert...", "Saving...")
              : tt("Einstellungen speichern", "Save Preferences")}
          </Button>
        </div>
      </div>
    </div>
  );
}
