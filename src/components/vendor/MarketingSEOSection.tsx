import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MarketingSEOSection({
  entity,
  onSave,
}: {
  entity: any;
  onSave: (slug: string, domain: string | null, seoTitle: string | null, seoDescription: string | null) => Promise<void>;
  vertical?: string;
}) {
  const [slug, setSlug] = useState(entity.slug || "");
  const [domain, setDomain] = useState(entity.custom_domain || "");
  const [seoTitle, setSeoTitle] = useState(entity.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(entity.seo_description || "");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!slug) {
      setError("Storefront Subdomain is mandatory.");
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
      alert("Marketing & SEO settings updated!");
    } catch (e: any) {
      setError(e.message || "Failed to update Marketing & SEO settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Marketing & SEO</h2>
        <p className="text-sm text-muted-foreground">
          Manage your default Speisely subdomain, custom domains, and search engine optimization (SEO) fields.
        </p>
      </div>

      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Storefront Subdomain (Mandatory)</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g. my-restaurant"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                required
                disabled
              />
              <span className="text-muted-foreground whitespace-nowrap">.speisely.de</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is your official URL on Speisely. It cannot be changed after creation to prevent
              broken links, 404 errors, and loss of existing SEO rankings. Contact support if you need to change it.
            </p>
          </div>

          <div className="pt-6 border-t border-border space-y-2">
            <Label>Your Custom Domain (Optional)</Label>
            <Input
              placeholder="e.g. www.myrestaurant.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to remove your custom domain and revert to the default Speisely URL.
            </p>
          </div>

          {domain && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 p-4 space-y-2 mt-4">
              <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                DNS Configuration Required
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                To complete the setup, please add the following DNS records to your domain provider:
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
                Note: DNS changes can take up to 48 hours to propagate.
              </p>
            </div>
          )}

          <div className="pt-6 border-t border-border space-y-4">
            <div className="space-y-2">
              <Label>SEO Meta Title (Optional)</Label>
              <Input
                placeholder="e.g. Best Italian Restaurant in Berlin | My Restaurant"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground flex justify-between">
                <span>This title appears in browser tabs and search engine results. Keep it under 60 characters for best results.</span>
                <span className={seoTitle.length > 60 ? "text-destructive" : ""}>{seoTitle.length}/60</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>SEO Meta Description (Optional)</Label>
              <Textarea
                placeholder="e.g. Experience authentic Italian cuisine at My Restaurant in the heart of Berlin. Book your table now!"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
                className="resize-none h-24"
              />
              <p className="text-xs text-muted-foreground flex justify-between">
                <span>This description appears under your link in search results and helps attract customers. Keep it under 160 characters.</span>
                <span className={seoDescription.length > 160 ? "text-destructive" : ""}>{seoDescription.length}/160</span>
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={saving || !slug} className="w-full">
            {saving ? "Saving..." : "Save Marketing & SEO Settings"}
          </Button>
        </div>
      </div>
    </section>
  );
}
