/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { generateGastronomyCopy } from "@/lib/restaurant/ai.functions";
import { Sparkles, Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { StorefrontPromoTeaserConfig } from "./StorefrontPromoTeaserConfig";
import { useI18n } from "@/i18n/I18nProvider";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { LanguageToggle } from "@/components/LanguageToggle";

export function RestaurantOnlinePresence({
  restaurant,
  onSave,
}: {
  restaurant: any;
  onSave: (
    slug: string,
    domain: string | null,
    seoTitle: string | null,
    seoDescription: string | null,
  ) => Promise<void>;
}) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const searchParams = useSearch({ from: "/_authenticated/restaurant" }) as any;
  const navigate = useNavigate();

  const activeSubTab = searchParams.section || "social";

  const [slug, setSlug] = useState(restaurant.slug || "");
  const [domain, setDomain] = useState(restaurant.custom_domain || "");
  const [seoTitle, setSeoTitle] = useState(restaurant.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(restaurant.seo_description || "");

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAiCopy = useServerFn(generateGastronomyCopy);

  async function handleGenerateAI() {
    setGenerating(true);
    try {
      const res = await generateAiCopy({
        data: {
          type: "seo",
          name: restaurant.name || "Restaurant",
          category: restaurant.cuisine_type || null,
          additionalContext: restaurant.city || null,
        },
      });

      if (res.seo_title) setSeoTitle(res.seo_title.slice(0, 60));
      if (res.seo_description) setSeoDescription(res.seo_description.slice(0, 160));

      toast.success(
        tt("SEO-Metadaten wurden erfolgreich generiert!", "SEO metadata generated successfully!"),
      );
    } catch (e: any) {
      toast.error(
        e.message ||
          tt("Fehler beim Generieren der KI-Metadaten", "Failed to generate AI metadata"),
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!slug) {
      setError(tt("Storefront Subdomain ist erforderlich.", "Storefront Subdomain is mandatory."));
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const cleanDomain = domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
      const cleanSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");

      const cleanSeoTitle = seoTitle.trim() || null;
      const cleanSeoDescription = seoDescription.trim() || null;

      await onSave(cleanSlug, cleanDomain || null, cleanSeoTitle, cleanSeoDescription);
      toast.success(
        tt("Marketing & SEO Einstellungen aktualisiert!", "Marketing & SEO settings updated!"),
      );
    } catch (e: any) {
      setError(
        e.message ||
          tt("Aktualisierung fehlgeschlagen", "Failed to update Marketing & SEO settings"),
      );
    } finally {
      setSaving(false);
    }
  }

  const handleSubTabChange = (newSubTab: "social" | "visibility" | "promo") => {
    navigate({
      search: {
        ...searchParams,
        section: newSubTab,
      },
    });
  };

  return (
    <section className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl text-forest">
            {tt("Online-Präsenz", "Online Presence")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tt(
              "Verwalten Sie die Social-Media-Links, Google-Sichtbarkeit, Website-Einstellungen und Storefront-Promotion-Tools Ihres Restaurants an einem Ort.",
              "Manage your restaurant’s social links, Google visibility, website settings, and storefront promotion tools in one place.",
            )}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-cream p-1.5 rounded-full border border-forest/10 self-start sm:self-auto">
          <span className="text-[10px] text-forest/70 font-semibold px-2 uppercase tracking-wide">
            {tt("Sprache", "Language")}
          </span>
          <LanguageToggle />
        </div>
      </div>

      {/* Internal Sub-navigation Bar */}
      <div className="flex border-b border-[#e2e8e4] gap-6 pb-px overflow-x-auto">
        <button
          type="button"
          onClick={() => handleSubTabChange("social")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 whitespace-nowrap cursor-pointer ${
            activeSubTab === "social"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-muted-foreground hover:text-forest"
          }`}
        >
          {tt("Link-in-Bio & Social", "Link-in-Bio & Social")}
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange("visibility")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 whitespace-nowrap cursor-pointer ${
            activeSubTab === "visibility"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-muted-foreground hover:text-forest"
          }`}
        >
          {tt("Google & Webseiten-Sichtbarkeit", "Google & Website Visibility")}
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange("promo")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 whitespace-nowrap cursor-pointer ${
            activeSubTab === "promo"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-muted-foreground hover:text-forest"
          }`}
        >
          {tt("Aktions-Teaser im Storefront", "Storefront Promo Teaser")}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="animate-in fade-in slide-in-from-top-1 duration-200">
        {activeSubTab === "social" && (
          <div className="space-y-6">
            {/* Branded Link-in-Bio Card */}
            <div className="surface-card p-6 border-2 border-forest/15 rounded-2xl bg-forest/[0.02] max-w-3xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-lg text-forest flex items-center gap-2">
                    {tt("Branded Link-in-Bio", "Branded Link-in-Bio")}
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Live
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tt(
                      "Wir haben eine ansprechende, leichtgewichtige Landingpage für Ihre Social-Media-Profile (Instagram, TikTok, Facebook) erstellt. Sie hilft Gästen dabei, unkompliziert Tische zu reservieren, Bestellungen aufzugeben und Ihre Kontaktdaten zu finden.",
                      "We have generated a premium, lightweight landing page for your social media bios (Instagram, TikTok, Facebook). It helps customers easily order food, reserve tables, and find your location.",
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-xs font-semibold text-forest/70 uppercase tracking-wider">
                  {tt("Ihr Link-in-Bio URL", "Your Link-in-Bio URL")}
                </Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="grow bg-white border border-[#eadfce] rounded-xl px-4 py-3 text-sm font-mono text-forest/80 overflow-x-auto select-all">
                    {restaurant.custom_domain
                      ? `https://${restaurant.custom_domain}/links`
                      : `https://speisely.de/restaurant/${restaurant.slug}/links`}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const url = restaurant.custom_domain
                        ? `https://${restaurant.custom_domain}/links`
                        : `https://speisely.de/restaurant/${restaurant.slug}/links`;
                      navigator.clipboard.writeText(url);
                      toast.success(
                        tt("Link in die Zwischenablage kopiert!", "Link copied to clipboard!"),
                      );
                    }}
                    className="h-11 w-11 rounded-xl border-[#eadfce] text-forest hover:bg-forest/5 cursor-pointer shrink-0"
                    title={tt("Link kopieren", "Copy Link")}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <a
                    href={
                      restaurant.custom_domain
                        ? `https://${restaurant.custom_domain}/links`
                        : `https://speisely.de/restaurant/${restaurant.slug}/links`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-[#eadfce] bg-white text-forest hover:bg-forest/5 cursor-pointer shrink-0"
                    title={tt("Link öffnen", "Open Link")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 space-y-2">
                <h4 className="font-semibold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  💡 {tt("SEO & Konvertierungs-Tipp", "SEO & Conversion Tip")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tt(
                    "Fügen Sie diesen Link als Hauptlink auf Instagram, TikTok oder in Ihrem Google Maps Profil ein. Dadurch können Kunden Tische reservieren oder Essen bestellen, ohne Speisely verlassen zu müssen – das erhöht Ihre Conversion-Rate, spart Provisionen und bringt Ihnen mehr direkte Kunden über Google.",
                    "Add this link as your main website link on Instagram, TikTok, or Google Maps. It lets local searchers book a table or order delivery in just a few clicks. This drives higher conversion rates, eliminates commission fees, and brings more direct organic customers through Google.",
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "visibility" && (
          <div className="surface-card p-6 space-y-8 max-w-3xl bg-white border border-forest/10 rounded-2xl shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>
                  {tt("Storefront Subdomain (Erforderlich)", "Storefront Subdomain (Mandatory)")}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="z.B. mein-restaurant"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                    }
                    required
                    disabled
                  />
                  <span className="text-muted-foreground whitespace-nowrap">.speisely.de</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tt(
                    "Dies ist Ihre offizielle Adresse auf Speisely. Sie kann nach der Erstellung nicht mehr geändert werden, um fehlerhafte Links und den Verlust des SEO-Rankings zu vermeiden.",
                    "This is your official URL on Speisely. It cannot be changed after creation to prevent broken links, 404 errors, and loss of existing SEO rankings. Contact support if you need to change it.",
                  )}
                </p>
              </div>

              <div className="pt-6 border-t border-border space-y-2">
                <Label>{tt("Eigene Domain (Optional)", "Your Custom Domain (Optional)")}</Label>
                <Input
                  placeholder="z.B. www.meinrestaurant.de"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {tt(
                    "Leer lassen, um Ihre eigene Domain zu entfernen und zur Standard-Speisely-Adresse zurückzukehren.",
                    "Leave blank to remove your custom domain and revert to the default Speisely URL.",
                  )}
                </p>
              </div>

              {domain && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 p-4 space-y-2 mt-4 animate-in fade-in duration-200">
                  <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                    {tt("DNS-Konfiguration erforderlich", "DNS Configuration Required")}
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {tt(
                      "Um die Einrichtung abzuschließen, fügen Sie bitte folgende DNS-Einträge bei Ihrem Domain-Provider hinzu:",
                      "To complete the setup, please add the following DNS records to your domain provider:",
                    )}
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 list-disc pl-4 space-y-1 mt-2">
                    <li>
                      <strong>Type:</strong> A Record
                    </li>
                    <li>
                      <strong>Name:</strong> @ (or empty)
                    </li>
                    <li>
                      <strong>Value:</strong> 76.76.21.21
                    </li>
                  </ul>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 list-disc pl-4 space-y-1">
                    <li>
                      <strong>Type:</strong> CNAME
                    </li>
                    <li>
                      <strong>Name:</strong> www
                    </li>
                    <li>
                      <strong>Value:</strong> cname.vercel-dns.com.
                    </li>
                  </ul>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    {tt(
                      "Hinweis: DNS-Änderungen können bis zu 48 Stunden dauern, bis sie weltweit aktiv sind.",
                      "Note: DNS changes can take up to 48 hours to propagate.",
                    )}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-border space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{tt("SEO-Titel (Optional)", "SEO Meta Title (Optional)")}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAI}
                      disabled={generating}
                      className="h-8 gap-1.5 text-xs text-forest hover:bg-forest/5"
                      type="button"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {generating
                        ? tt("Generiere...", "Generating...")
                        : tt("Mit KI optimieren", "Optimize with AI")}
                    </Button>
                  </div>
                  <Input
                    placeholder="z.B. Bestes italienisches Restaurant in Berlin | Mein Restaurant"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>
                      {tt(
                        "Dieser Titel wird in Browser-Tabs und Suchergebnissen angezeigt. Halten Sie ihn unter 60 Zeichen.",
                        "This title appears in browser tabs and search engine results. Keep it under 60 characters for best results.",
                      )}
                    </span>
                    <span className={seoTitle.length > 60 ? "text-destructive" : ""}>
                      {seoTitle.length}/60
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>
                    {tt("SEO-Beschreibung (Optional)", "SEO Meta Description (Optional)")}
                  </Label>
                  <Textarea
                    placeholder="z.B. Genießen Sie authentische gastronomische Momente. Reservieren Sie jetzt Ihren Tisch!"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    maxLength={160}
                    className="resize-none h-24"
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>
                      {tt(
                        "Diese Beschreibung erscheint unter Ihrem Link in Suchmaschinen und hilft dabei, Kunden anzuziehen. Halten Sie sie unter 160 Zeichen.",
                        "This description appears under your link in search results and helps attract customers. Keep it under 160 characters.",
                      )}
                    </span>
                    <span className={seoDescription.length > 160 ? "text-destructive" : ""}>
                      {seoDescription.length}/160
                    </span>
                  </p>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button onClick={handleSave} disabled={saving || !slug} className="w-full">
                {saving
                  ? tt("Wird gespeichert...", "Saving...")
                  : tt("Marketing & SEO Einstellungen speichern", "Save Marketing & SEO Settings")}
              </Button>
            </div>
          </div>
        )}

        {activeSubTab === "promo" && (
          <div className="max-w-3xl animate-in fade-in duration-200">
            {/* Storefront Promo Teaser Section */}
            <StorefrontPromoTeaserConfig
              initialData={restaurant.announcement_banner}
              categories={(restaurant.menu || [])
                .map((m: { category?: string }) => m.category || "")
                .filter(Boolean)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
