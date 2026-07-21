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

interface Props {
  initialData?: StorefrontPromoTeaserInput | null;
  categories?: string[];
  onSaved?: () => void;
}

export function StorefrontPromoTeaserConfig({ initialData, categories = [], onSaved }: Props) {
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
      toast.error("Bitte geben Sie einen Titel für die Promo an.");
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
      toast.success("Storefront Promo Teaser erfolgreich gespeichert!");
      if (onSaved) onSaved();
    } catch (e: any) {
      toast.error(e.message || "Fehler beim Speichern der Promo Teaser Einstellungen.");
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
              Storefront Promo Teaser
            </h3>
            <p className="text-xs text-muted-foreground">
              Heben Sie Angebote oder Events hervor, ohne die Bestellung des Kunden zu stören.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor="promo-toggle"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
          >
            {enabled ? "Aktiviert" : "Deaktiviert"}
          </Label>
          <Switch id="promo-toggle" checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs font-semibold text-forest">Titel (Max. 40 Zeichen)</Label>
              <span
                className={`text-[10px] ${title.length > 40 ? "text-red-500 font-bold" : "text-muted-foreground"}`}
              >
                {title.length}/40
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="z.B. 20% Mittagsangebot"
              maxLength={40}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs font-semibold text-forest">
                Beschreibung (Max. 80 Zeichen)
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
              placeholder="z.B. Gültig von 12:00 bis 14:00 Uhr auf alle Hauptspeisen"
              maxLength={80}
              rows={2}
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-forest mb-1 block">
              Bild URL (Optional)
            </Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... (Empfohlen WebP, max 100KB)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-forest mb-1 block">Ziel-Aktion</Label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="category">Menü-Kategorie</option>
                <option value="reserve">Tisch Reservieren</option>
                <option value="catering">Catering Anfrage</option>
              </select>
            </div>

            {targetType === "category" && (
              <div>
                <Label className="text-xs font-semibold text-forest mb-1 block">
                  Kategorie wählen
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
                    placeholder="Kategoriename"
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
            {saving ? "Wird gespeichert..." : "Promo Teaser Speichern"}
          </Button>
        </div>

        {/* Live Visual Preview */}
        <div className="bg-neutral-50 rounded-xl border border-forest/10 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider">
              <Eye className="h-3.5 w-3.5 text-amber-600" />
              Live Vorschau (Verschiebbare Vorschau)
            </div>
            <p className="text-[11px] text-muted-foreground">
              So erscheint der Promo Teaser dezent für Kunden auf Ihrer Speisely Storefront.
            </p>
          </div>

          {/* Desktop Preview Card */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Desktop Ansicht (Erscheint nach 300px Scroll)
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
                  {title || "Ihr Promo Titel"}
                </h4>
                <p className="text-[11px] text-forest/70 line-clamp-2 mt-0.5">
                  {subtitle || "Ihre Angebotsbeschreibung..."}
                </p>
                <div className="mt-2 inline-block px-2.5 py-1 bg-forest text-cream text-[10px] font-medium rounded-full">
                  {targetType === "category"
                    ? `Zu ${targetValue || "Speisen"}`
                    : targetType === "reserve"
                      ? "Tisch reservieren"
                      : "Catering anfragen"}
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
              Smartphone Ansicht (Dezent unten verankert)
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest text-cream rounded-full text-[11px] font-medium shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{title || "Mittagsangebot"}</span>
              <span className="opacity-60">• Tippen für Info</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
