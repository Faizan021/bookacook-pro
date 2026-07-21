/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  updateStorefrontPromoTeaser,
  StorefrontPromoTeaserInput,
} from "@/lib/restaurant/mutations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Megaphone, Save, Eye, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  initialData?: StorefrontPromoTeaserInput | null;
  categories?: string[];
  onSaved?: () => void;
}

export function StorefrontPromoTeaserConfig({ initialData, categories = [], onSaved }: Props) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [enabled, setEnabled] = useState(initialData?.enabled ?? false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [targetType, setTargetType] = useState<"category" | "reserve" | "catering">(
    initialData?.target_type ?? "category",
  );
  const [targetValue, setTargetValue] = useState(
    initialData?.target_value ?? (categories[0] || ""),
  );
  const [saving, setSaving] = useState(false);

  const saveMutation = useServerFn(updateStorefrontPromoTeaser);

  async function handleSave() {
    if (enabled && !title.trim()) {
      toast.error(
        tt(
          "Bitte geben Sie einen Titel für die Aktion an.",
          "Please enter a title for the promotion.",
        ),
      );
      return;
    }

    setSaving(true);
    try {
      await saveMutation({
        data: {
          enabled,
          title: title.trim().slice(0, 40),
          subtitle: subtitle.trim().slice(0, 80),
          image_url: imageUrl.trim() || null,
          target_type: targetType,
          target_value: targetType === "category" ? targetValue : null,
        },
      });
      toast.success(
        tt(
          "Storefront-Aktionsteaser erfolgreich gespeichert!",
          "Storefront promo teaser saved successfully!",
        ),
      );
      if (onSaved) onSaved();
    } catch (e: any) {
      toast.error(
        e.message ||
          tt(
            "Fehler beim Speichern der Aktionsteaser-Einstellungen.",
            "Failed to save promo teaser settings.",
          ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-forest/10 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-forest/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-forest">
              {tt("Storefront-Aktionsteaser", "Storefront Promo Teaser")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tt(
                "Heben Sie Angebote oder Events hervor, ohne die Bestellung des Kunden zu stören.",
                "Highlight special offers or events without disrupting the customer's ordering flow.",
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor="promo-toggle"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
          >
            {enabled ? tt("Aktiviert", "Enabled") : tt("Deaktiviert", "Disabled")}
          </Label>
          <Switch id="promo-toggle" checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Interactive Marketing Templates Box */}
          <div className="bg-forest/5 border border-forest/10 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-xs text-forest uppercase tracking-wider flex items-center gap-1.5">
              💡 {tt("Ideen für Aktions-Teaser", "Promo Teaser Inspiration")}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {tt(
                "Verwenden Sie diese Beispiele, um Ihren Umsatz zu steigern. Klicken Sie auf eine Vorlage, um sie als Entwurf zu übernehmen:",
                "Use these templates to boost orders. Click any layout to load it as a draft:",
              )}
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTitle(tt("20% Mittags-Rabatt", "20% Lunch Discount"));
                  setSubtitle(
                    tt(
                      "Gültig Mo-Fr von 11:30 bis 14:00 Uhr auf alle Hauptspeisen",
                      "Valid Mon-Fri from 11:30 to 14:00 on all mains",
                    ),
                  );
                  setTargetType("category");
                }}
                className="p-2.5 bg-white border border-forest/10 rounded-lg text-left hover:border-forest hover:bg-forest/5 transition-all text-[11px]"
              >
                <strong>{tt("Mittagsangebot", "Lunch Special")}</strong>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {tt("20% Rabatt auf Hauptspeisen", "20% off all main courses")}
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle(tt("Kostenloses Dessert", "Free Dessert"));
                  setSubtitle(
                    tt(
                      "Bestellen Sie ein Hauptgericht und erhalten Sie ein Dessert gratis dazu",
                      "Order any main course and get a free dessert tonight",
                    ),
                  );
                  setTargetType("category");
                }}
                className="p-2.5 bg-white border border-forest/10 rounded-lg text-left hover:border-forest hover:bg-forest/5 transition-all text-[11px]"
              >
                <strong>{tt("Gratis Beigabe", "Free Gift")}</strong>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {tt("Kostenloses Dessert am Abend", "Free dessert with purchase")}
                </p>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs font-semibold text-forest">
                {tt("Titel (Max. 40 Zeichen)", "Title (Max. 40 characters)")}
              </Label>
              <span
                className={`text-[10px] ${title.length > 40 ? "text-red-500 font-bold" : "text-muted-foreground"}`}
              >
                {title.length}/40
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder={tt("z.B. 20% Mittagsangebot", "e.g. 20% Lunch Discount")}
              maxLength={40}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs font-semibold text-forest">
                {tt("Beschreibung (Max. 80 Zeichen)", "Description (Max. 80 characters)")}
              </Label>
              <span
                className={`text-[10px] ${subtitle.length > 80 ? "text-red-500 font-bold" : "text-muted-foreground"}`}
              >
                {subtitle.length}/80
              </span>
            </div>
            <Textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value.slice(0, 80))}
              placeholder={tt(
                "z.B. Gültig von 12:00 bis 14:00 Uhr auf alle Hauptspeisen",
                "e.g. Valid Monday–Friday from 11:30 to 14:00 on all mains",
              )}
              maxLength={80}
              rows={2}
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-forest mb-1 block">
              {tt("Bild URL (Optional)", "Image URL (Optional)")}
            </Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={tt(
                "https://... (Empfohlen WebP, max 100KB)",
                "https://... (Recommended WebP, max 100KB)",
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-forest mb-1 block">
                {tt("Ziel-Aktion", "Target Action")}
              </Label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="category">{tt("Menü-Kategorie", "Menu Category")}</option>
                <option value="reserve">{tt("Tisch Reservieren", "Book Table")}</option>
                <option value="catering">{tt("Catering Anfrage", "Catering Request")}</option>
              </select>
            </div>

            {targetType === "category" && (
              <div>
                <Label className="text-xs font-semibold text-forest mb-1 block">
                  {tt("Kategorie wählen", "Select Category")}
                </Label>
                {categories.length > 0 ? (
                  <select
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={tt("Kategoriename", "Category name")}
                  />
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-forest text-cream hover:bg-forest/90 mt-2"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving
              ? tt("Wird gespeichert...", "Saving...")
              : tt("Aktions-Teaser speichern", "Save Promo Teaser")}
          </Button>
        </div>

        {/* Live Visual Preview */}
        <div className="bg-neutral-50 rounded-xl border border-forest/10 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider">
              <Eye className="h-3.5 w-3.5 text-amber-600" />
              {tt("Live-Vorschau (Schwebender Banner)", "Live Preview (Floating Banner)")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {tt(
                "So erscheint der Promo Teaser dezent für Kunden auf Ihrer Speisely Storefront.",
                "How the promo teaser will discreetly appear to customers on your Speisely Storefront.",
              )}
            </p>
          </div>

          {/* Desktop Preview Card */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {tt(
                "Desktop-Ansicht (Erscheint nach 300px Scroll)",
                "Desktop View (Appears after 300px scroll)",
              )}
            </span>
            <div className="relative p-3.5 bg-white border border-forest/15 rounded-xl shadow-md flex items-start gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Promo"
                  className="w-12 h-12 rounded-lg object-cover border border-forest/10 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-700 grid place-items-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-display text-xs font-bold text-forest truncate">
                  {title || tt("Ihr Promo-Titel", "Your Promo Title")}
                </h4>
                <p className="text-[11px] text-forest/70 line-clamp-2 mt-0.5">
                  {subtitle || tt("Ihre Angebotsbeschreibung...", "Your offer description...")}
                </p>
                <div className="mt-2 inline-block px-2.5 py-1 bg-forest text-cream text-[10px] font-medium rounded-full">
                  {targetType === "category"
                    ? `${tt("Zu ", "Go to ")}${targetValue || tt("Speisen", "Dishes")}`
                    : targetType === "reserve"
                      ? tt("Tisch reservieren", "Book table")
                      : tt("Catering anfragen", "Request catering")}
                </div>
              </div>
              <button className="absolute top-2 right-2 text-muted-foreground hover:text-forest">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Preview Pill */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {tt(
                "Smartphone-Ansicht (Dezent unten verankert)",
                "Smartphone View (Discreetly anchored at bottom)",
              )}
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest text-cream rounded-full text-[11px] font-medium shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{title || tt("Mittagsangebot", "Lunch Special")}</span>
              <span className="opacity-60">{tt("• Tippen für Info", "• Tap for info")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
