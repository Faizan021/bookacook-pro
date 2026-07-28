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

export function CatererOnlinePresence({
  caterer,
  onSave,
}: {
  caterer: any;
  onSave: (
    slug: string,
    domain: string | null,
    seoTitle: string | null,
    seoDescription: string | null,
    serviceCategories?: string | null,
  ) => Promise<void>;
}) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const searchParams = useSearch({ from: "/_authenticated/caterer" }) as any;
  const navigate = useNavigate();

  const activeSubTab: "social" | "categories" | "visibility" | "promo" =
    searchParams.section || "social";

  const [slug, setSlug] = useState(caterer.slug || "");
  const [domain, setDomain] = useState(caterer.custom_domain || "");
  const [seoTitle, setSeoTitle] = useState(caterer.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(caterer.seo_description || "");

  const initialCats = caterer.service_categories
    ? caterer.service_categories.split(",").filter(Boolean)
    : ["events", "daily-catering-subscriptions", "institutional-catering"];

  const [serviceCategories, setServiceCategories] = useState<string[]>(initialCats);

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
          name: caterer.name || "Caterer",
          category: caterer.cuisine_type || caterer.category || null,
          additionalContext: caterer.city || null,
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
      await onSave(
        cleanSlug,
        cleanDomain || null,
        seoTitle.trim() || null,
        seoDescription.trim() || null,
        serviceCategories.join(","),
      );
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

  const handleSubTabChange = (newSubTab: "social" | "categories" | "visibility" | "promo") => {
    navigate({ search: (prev: any) => ({ ...prev, section: newSubTab }) } as any);
  };

  const linkInBioUrl = caterer.custom_domain
    ? `https://${caterer.custom_domain}`
    : `https://speisely.de/catering/${caterer.slug}`;

  return (
    <section className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl text-forest">
            {tt("Online-Praesenz", "Online Presence")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tt(
              "Verwalten Sie Social-Media-Links, Catering-Sparten, Google-Sichtbarkeit und Storefront-Promotion-Tools.",
              "Manage social links, catering service categories, Google visibility, and storefront promotion tools.",
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

      <div className="flex border-b border-[#e2e8e4] gap-6 pb-px overflow-x-auto">
        {(["social", "categories", "visibility", "promo"] as const).map((tab) => {
          const labels: Record<string, [string, string]> = {
            social: ["Link-in-Bio & Social", "Link-in-Bio & Social"],
            categories: ["Catering-Sparten & Zielgruppen", "Service Categories & Focus"],
            visibility: ["Google & Webseiten-Sichtbarkeit", "Google & Website Visibility"],
            promo: ["Aktions-Teaser im Storefront", "Storefront Promo Teaser"],
          };
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleSubTabChange(tab)}
              className={`pb-3 text-sm font-semibold transition-all border-b-2 px-1 whitespace-nowrap cursor-pointer ${
                activeSubTab === tab
                  ? "border-forest text-forest font-bold"
                  : "border-transparent text-muted-foreground hover:text-forest"
              }`}
            >
              {tt(labels[tab][0], labels[tab][1])}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-top-1 duration-200">
        {activeSubTab === "social" && (
          <div className="space-y-6">
            <div className="surface-card p-6 border-2 border-forest/15 rounded-2xl bg-forest/[0.02] max-w-3xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-lg text-forest flex items-center gap-2">
                    {tt("Branded Link-in-Bio", "Branded Link-in-Bio")}
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Live
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tt(
                      "Ihre Catering-Profilseite auf Speisely ist bereit fuer Social-Media-Bios. Teilen Sie den Link auf Instagram, LinkedIn oder in Ihrem Google Unternehmensprofil.",
                      "Your catering profile page on Speisely is ready for social media bios. Share the link on Instagram, LinkedIn, or your Google Business Profile.",
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
                    {linkInBioUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(linkInBioUrl);
                      toast.success(tt("Link kopiert!", "Link copied!"));
                    }}
                    className="h-11 w-11 rounded-xl border-[#eadfce] text-forest hover:bg-forest/5 cursor-pointer shrink-0"
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <a
                    href={linkInBioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-[#eadfce] bg-white text-forest hover:bg-forest/5 cursor-pointer shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 space-y-2">
                <h4 className="font-semibold text-xs text-amber-800 uppercase tracking-wide">
                  {tt("SEO & Konvertierungs-Tipp", "SEO & Conversion Tip")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tt(
                    "Fuegen Sie diesen Link als Hauptlink auf Instagram, LinkedIn oder in Ihrem Google Unternehmensprofil ein, damit potenzielle Kunden direkt Catering-Anfragen stellen koennen.",
                    "Add this link as your main bio link on Instagram, LinkedIn, or Google Business Profile so potential clients can send catering inquiries directly.",
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "categories" && (
          <div className="surface-card p-6 space-y-6 max-w-3xl bg-white border border-forest/10 rounded-2xl shadow-sm text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-display font-bold text-forest text-base flex items-center gap-2">
                  <span>🎯</span>
                  {tt("Angebotene Catering-Sparten & Zielgruppen", "Offered Catering Service Categories")}
                </Label>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {tt("Mehrfachauswahl aktiv", "Multi-Category Supported")}
                </span>
              </div>
              <p className="text-xs text-forest/75 leading-relaxed">
                {tt(
                  "Wählen Sie alle Catering-Bereiche aus, die Ihr Betrieb anbietet. Ihr Profil wird automatisch in den passenden Speisely-Kategorieseiten und Suchfiltern gelistet.",
                  "Select all catering service models your business handles. Your brand will appear in all matching Speisely category pages and regional search filters.",
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Option 1: Event Catering */}
              <label
                className={`flex items-start gap-2.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  serviceCategories.includes("events")
                    ? "bg-emerald-50/50 border-forest ring-1 ring-forest/20 shadow-xs"
                    : "bg-white border-stone-200 hover:border-forest/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={serviceCategories.includes("events")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setServiceCategories([...serviceCategories, "events"]);
                    } else {
                      setServiceCategories(serviceCategories.filter((c) => c !== "events"));
                    }
                  }}
                  className="mt-0.5 accent-forest rounded"
                />
                <div>
                  <span className="text-xs font-bold text-forest block">
                    🥂 {tt("Einmalige Events", "One-Off Events")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-1 leading-normal">
                    {tt("Hochzeiten, Firmenfeiern, Partys", "Weddings, Galas, Private Parties")}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded mt-2 inline-block">
                    /catering/events
                  </span>
                </div>
              </label>

              {/* Option 2: Daily Subscriptions / Corporate */}
              <label
                className={`flex items-start gap-2.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  serviceCategories.includes("daily-catering-subscriptions")
                    ? "bg-emerald-50/50 border-forest ring-1 ring-forest/20 shadow-xs"
                    : "bg-white border-stone-200 hover:border-forest/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={serviceCategories.includes("daily-catering-subscriptions")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setServiceCategories([...serviceCategories, "daily-catering-subscriptions"]);
                    } else {
                      setServiceCategories(
                        serviceCategories.filter((c) => c !== "daily-catering-subscriptions"),
                      );
                    }
                  }}
                  className="mt-0.5 accent-forest rounded"
                />
                <div>
                  <span className="text-xs font-bold text-forest block">
                    🏢 {tt("Firmen-Abos", "Corporate Subscriptions")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-1 leading-normal">
                    {tt("Büro-Lunch, Team-Verpflegung", "Office Lunches, Recurring Teams")}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded mt-2 inline-block">
                    /catering/daily-catering-subscriptions
                  </span>
                </div>
              </label>

              {/* Option 3: Institutional */}
              <label
                className={`flex items-start gap-2.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  serviceCategories.includes("institutional-catering")
                    ? "bg-emerald-50/50 border-forest ring-1 ring-forest/20 shadow-xs"
                    : "bg-white border-stone-200 hover:border-forest/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={serviceCategories.includes("institutional-catering")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setServiceCategories([...serviceCategories, "institutional-catering"]);
                    } else {
                      setServiceCategories(
                        serviceCategories.filter((c) => c !== "institutional-catering"),
                      );
                    }
                  }}
                  className="mt-0.5 accent-forest rounded"
                />
                <div>
                  <span className="text-xs font-bold text-forest block">
                    🏫 {tt("Gemeinschaftsverpflegung", "Institutional")}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-1 leading-normal">
                    {tt("Schulen, Kitas, Pflege & Kantinen", "Schools, Kitas, Clinics & Canteens")}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded mt-2 inline-block">
                    /catering/institutional-catering
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {tt(
                  "Speichern Sie Ihre Sparten-Auswahl, um auf den entsprechenden Seiten gelistet zu werden.",
                  "Save your target categories to enable listing on matching discovery pages.",
                )}
              </p>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-forest hover:bg-forest/90 text-white rounded-full px-6"
              >
                {saving ? tt("Speichere...", "Saving...") : tt("Sparten speichern", "Save Categories")}
              </Button>
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
                    placeholder="z.B. mein-catering"
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
                    "Dies ist Ihre offizielle Adresse auf Speisely. Sie kann nach der Erstellung nicht mehr geaendert werden.",
                    "This is your official URL on Speisely. It cannot be changed after creation. Contact support if needed.",
                  )}
                </p>
              </div>

              <div className="pt-6 border-t border-border space-y-2">
                <Label>{tt("Eigene Domain (Optional)", "Your Custom Domain (Optional)")}</Label>
                <Input
                  placeholder="z.B. www.meincatering.de"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {tt(
                    "Leer lassen zum Entfernen der eigenen Domain.",
                    "Leave blank to revert to the default Speisely URL.",
                  )}
                </p>
              </div>

              {domain && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-2 mt-4 animate-in fade-in duration-200">
                  <h4 className="font-semibold text-sm text-amber-800">
                    {tt("DNS-Konfiguration erforderlich", "DNS Configuration Required")}
                  </h4>
                  <p className="text-xs text-amber-700">
                    {tt(
                      "Bitte folgende DNS-Eintraege bei Ihrem Domain-Provider hinzufuegen:",
                      "Add the following DNS records to your domain provider:",
                    )}
                  </p>
                  <ul className="text-xs text-amber-700 list-disc pl-4 space-y-1 mt-2">
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
                  <ul className="text-xs text-amber-700 list-disc pl-4 space-y-1">
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
                  <p className="text-xs text-amber-700 mt-2">
                    {tt(
                      "DNS-Aenderungen koennen bis zu 48 Stunden dauern.",
                      "DNS changes can take up to 48 hours to propagate.",
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
                    placeholder="z.B. Premium Catering Berlin | Mein Catering Service"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>
                      {tt(
                        "Unter 60 Zeichen fuer beste Ergebnisse.",
                        "Keep under 60 characters for best results.",
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
                    placeholder="z.B. Professionelles Catering fuer Events in Berlin. Jetzt Angebot anfragen!"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    maxLength={160}
                    className="resize-none h-24"
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>{tt("Unter 160 Zeichen.", "Keep under 160 characters.")}</span>
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
            <StorefrontPromoTeaserConfig
              initialData={caterer.announcement_banner}
              categories={(caterer.menu || [])
                .map((m: { category?: string }) => m.category || "")
                .filter(Boolean)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
