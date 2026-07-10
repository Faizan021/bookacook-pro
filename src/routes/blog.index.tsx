import { createFileRoute, Link } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { blogPosts } from "@/data/blog";
import { ArrowRight, CalendarDays, User, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Speisely" },
      {
        name: "description",
        content:
          "Insights, Trends und Tipps rund um Catering, Eventplanung und Food Delivery in Deutschland.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Speisely Blog"
        heading={tt("News, Insights & Trends", "News, Insights & Trends")}
        subtext={tt(
          "Die neuesten Entwicklungen in den Bereichen Food Delivery, Eventplanung und Premium-Catering in Deutschland.",
          "The latest developments in food delivery, event planning, and premium catering in Germany.",
        )}
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 lg:pb-24">
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              onClick={() =>
                trackEvent("blog_article_opened", { slug: post.slug, title: post.title.en })
              }
              className="group surface-card flex flex-col overflow-hidden hover:ring-2 hover:ring-forest transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={800}
                  height={600}
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-cream/90 backdrop-blur text-forest px-3 py-1 text-xs font-semibold shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4 text-xs font-medium text-forest/60 mb-3">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> {post.author}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-forest mb-3 line-clamp-3 group-hover:text-[#b28a3c] transition-colors">
                  {post.title[lang]}
                </h2>
                <p className="text-sm text-forest/70 line-clamp-3 mb-6">{post.description[lang]}</p>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-forest group-hover:text-[#b28a3c]">
                  {tt("Weiterlesen", "Read more")} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Internal Navigation Section */}
        <div className="mt-20 border-t border-forest/10 pt-12 text-center">
          <h3 className="font-display text-2xl text-forest mb-4">
            {tt("Mehr von Speisely", "More from Speisely")}
          </h3>
          <p className="text-sm text-forest/70 mb-6 max-w-md mx-auto">
            {tt(
              "Erkunde unseren fairen Marktplatz für Gastronomie und Event-Profis in ganz Deutschland.",
              "Explore our fair marketplace for gastronomy and event professionals across Germany.",
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/partners"
              onClick={() =>
                trackEvent("partner_cta_clicked", {
                  location: "blog_index_footer",
                  role: "restaurant_owner",
                })
              }
              className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-2.5 text-xs font-semibold hover:bg-forest hover:text-white transition"
            >
              {tt("Für Partner / Preise", "For Partners / Pricing")}
            </Link>
            <Link
              to="/instant-order"
              onClick={() =>
                trackEvent("nav_cta_clicked", {
                  location: "blog_index_footer",
                  destination: "instant-order",
                })
              }
              className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-2.5 text-xs font-semibold hover:bg-forest hover:text-white transition"
            >
              {t("nav.instant")}
            </Link>
            <Link
              to="/catering"
              className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-2.5 text-xs font-semibold hover:bg-forest hover:text-white transition"
            >
              {t("nav.catering")}
            </Link>
            <Link
              to="/about"
              className="rounded-full bg-cream text-forest border border-forest/20 px-6 py-2.5 text-xs font-semibold hover:bg-forest hover:text-white transition"
            >
              {t("nav.about")}
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
