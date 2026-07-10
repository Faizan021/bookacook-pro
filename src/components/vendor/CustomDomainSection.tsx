import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomDomainSection({
  entity,
  onSave,
}: {
  entity: any;
  onSave: (slug: string, domain: string | null) => Promise<void>;
}) {
  const [slug, setSlug] = useState(entity.slug || "");
  const [domain, setDomain] = useState(entity.custom_domain || "");
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
      await onSave(cleanSlug, cleanDomain || null);
      alert("Domain settings updated!");
    } catch (e: any) {
      setError(e.message || "Failed to update domain settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Storefront Domains</h2>
        <p className="text-sm text-muted-foreground">
          Manage your default Speisely subdomain or connect your own custom domain.
        </p>
      </div>

      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="space-y-4">
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
              broken links. Contact support if you need to change it.
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
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 p-4 space-y-2">
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={saving || !slug} className="w-full">
            {saving ? "Saving..." : "Save Domain Settings"}
          </Button>
        </div>
      </div>
    </section>
  );
}
