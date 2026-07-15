import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGeoMarkdown } from "@/lib/geo/markdown.server";
import { MapPin, ArrowRight, CalendarHeart, Sparkles, CheckCircle2 } from "lucide-react";
import { isValidEventType, isValidCateringCity } from "@/data/geo/taxonomy";
import { Button } from "@/components/ui/button";

const loadPlannerGeoData = createServerFn({ method: "GET" })
  .validator(z.object({ citySlug: z.string(), eventType: z.string() }))
  .handler(async ({ data }) => {
    if (!isValidCateringCity(data.citySlug) || !isValidEventType(data.eventType)) {
      return { status: "404", content: null };
    }
    const md = await getGeoMarkdown("planner", `${data.citySlug}-${data.eventType}`);
    if (!md) {
      return { status: "404", content: null };
    }
    return { status: "200", content: md };
  });

export const Route = createFileRoute("/planner/$city-$eventType")({
  loader: async ({ params }) => {
    const res = await loadPlannerGeoData({ data: { citySlug: params.city, eventType: params.eventType } });
    if (res.status === "404" || !res.content) {
      throw notFound();
    }
    return { content: res.content, city: params.city, eventType: params.eventType };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { content, city, eventType } = loaderData;
    const canonicalUrl = `https://speisely.de/planner/${city}-${eventType}`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Event Planning",
      "provider": {
        "@type": "Organization",
        "name": "Speisely Event Planner Partner",
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
          "urlTemplate": `${canonicalUrl}#consultation`,
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
  component: PlannerCityEventPage,
});

function PlannerCityEventPage() {
  const { content } = Route.useLoaderData();

  return (
    <SiteShell>
      <div className="bg-sand text-foreground pt-32 pb-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-medium mb-6">
              <CalendarHeart className="h-4 w-4" />
              <span className="capitalize">{content.eventType}splaner in {content.areaServed}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-6 leading-tight text-forest">
              {content.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {content.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-forest text-[oklch(0.97_0.02_92)] hover:bg-forest/90 text-lg px-8 h-14" asChild>
                <a href="#consultation">Kostenlose Erstberatung <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4"/> Lokale Expertise</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Geprüfte Profis</div>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Visual placeholder for event imagery */}
            <div className="aspect-[4/3] rounded-2xl bg-forest/5 border border-forest/10 p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent"></div>
                <div className="relative z-10 space-y-6">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-forest/20 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-forest/10 rounded"></div>
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
        <div className="md:col-span-8 prose prose-lg prose-headings:font-serif prose-headings:font-normal max-w-none prose-a:text-forest">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
          
          {content.faq && content.faq.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-serif mb-8 text-forest">Häufige Fragen</h2>
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
          <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-sm" id="consultation">
            <h3 className="text-xl font-medium mb-2">Erstberatung vereinbaren</h3>
            <p className="text-sm text-muted-foreground mb-6">Sichern Sie sich ein unverbindliches Gespräch mit einem Experten für Ihr Event in {content.areaServed}.</p>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Lead capture flow integrated here."); }}>
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input type="text" placeholder="Vorname Nachname" className="w-full h-10 px-3 rounded-md border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">E-Mail</label>
                <input type="email" placeholder="mail@example.com" className="w-full h-10 px-3 rounded-md border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Geplantes Datum (Optional)</label>
                <input type="date" className="w-full h-10 px-3 rounded-md border bg-background" />
              </div>
              <Button type="submit" className="w-full bg-forest text-[oklch(0.97_0.02_92)] hover:bg-forest/90" size="lg">Termin anfragen</Button>
            </form>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
