import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGeoMarkdown } from "@/lib/geo/markdown.server";
import { MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { isValidCateringCity } from "@/data/geo/taxonomy";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/vendor/LeadCaptureForm";

const loadCateringGeoData = createServerFn({ method: "GET" })
  .validator(z.object({ citySlug: z.string() }))
  .handler(async ({ data }) => {
    if (!isValidCateringCity(data.citySlug)) {
      return { status: "404", content: null };
    }
    const md = await getGeoMarkdown("catering", data.citySlug);
    if (!md) {
      return { status: "404", content: null };
    }
    return { status: "200", content: md };
  });

export const Route = createFileRoute("/catering/$city")({
  loader: async ({ params }) => {
    const res = await loadCateringGeoData({ data: { citySlug: params.city } });
    if (res.status === "404" || !res.content) {
      throw notFound();
    }
    return { content: res.content, city: params.city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { content, city } = loaderData;
    const canonicalUrl = `https://speisely.de/catering/${city}`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Catering",
      "provider": {
        "@type": "Organization",
        "name": "Speisely Catering Partner",
      },
      "areaServed": {
        "@type": "City",
        "name": content.areaServed
      },
      "description": content.description,
      "potentialAction": {
        "@type": "QuoteAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${canonicalUrl}#quote`,
          "inLanguage": "de-DE",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        }
      }
    };

    return {
      meta: [
        { title: content.title },
        { name: "description", content: content.description },
        { property: "og:title", content: content.title },
        { property: "og:description", content: content.description },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        }
      ]
    };
  },
  component: CateringCityPage,
});

function CateringCityPage() {
  const { content } = Route.useLoaderData();

  return (
    <SiteShell>
      <div className="bg-forest text-[oklch(0.97_0.02_92)] pt-32 pb-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.97_0.02_92)]/10 text-sm font-medium mb-6">
              <MapPin className="h-4 w-4" />
              <span>Catering in {content.areaServed}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-6 leading-tight">
              {content.h1}
            </h1>
            <p className="text-lg text-[oklch(0.97_0.02_92)]/80 mb-8 max-w-xl leading-relaxed">
              {content.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-earth text-forest hover:bg-earth/90 text-lg px-8 h-14" asChild>
                <a href="#quote">Angebot anfordern <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-[oklch(0.97_0.02_92)]/60">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Geprüfte Caterer</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> Schnelle Angebote</div>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Visual placeholder for trust signals or localized image */}
            <div className="aspect-[4/3] rounded-2xl bg-[oklch(0.97_0.02_92)]/5 border border-[oklch(0.97_0.02_92)]/10 p-8 flex flex-col justify-center">
              <div className="space-y-6">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-earth/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-earth" />
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-[oklch(0.97_0.02_92)]/20 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-[oklch(0.97_0.02_92)]/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 grid md:grid-cols-12 gap-16">
        {/* Main Content Area */}
        <div className="md:col-span-8 prose prose-lg prose-headings:font-serif prose-headings:font-normal max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
          
          {content.faq && content.faq.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-serif mb-8">Häufige Fragen zu Catering in {content.areaServed}</h2>
              <div className="space-y-6">
                {content.faq.map((item, idx) => (
                  <div key={idx} className="border-b border-border pb-6">
                    <h3 className="text-xl font-medium mb-3">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Lead Gen Sticky Form */}
        <div className="md:col-span-4">
          <div className="sticky top-24" id="quote">
            <LeadCaptureForm 
              defaultCity={content.areaServed}
              sourceRoute="Catering City Geo Page"
            />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
