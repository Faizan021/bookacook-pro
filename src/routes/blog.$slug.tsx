import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { trackEvent } from "@/utils/posthog";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { blogPosts } from "@/data/blog";
import { ArrowLeft, CalendarDays, User, Share2, HelpCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Blog — Speisely" }] };
    const rawDesc = loaderData.description.de;
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "..." : rawDesc;
    const title = `${loaderData.title.de} | Speisely Blog`;
    const ogImage = loaderData.image || "https://speisely.de/og-default.jpg";
    const canonicalUrl = `https://speisely.de/blog/${loaderData.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: loaderData.title.de },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title.de,
            description: description,
            image: ogImage,
            datePublished: loaderData.date,
            author: {
              "@type": "Organization",
              name: "Speisely",
              url: "https://speisely.de",
            },
            publisher: {
              "@type": "Organization",
              name: "Speisely",
              logo: {
                "@type": "ImageObject",
                url: "https://speisely.de/favicon.svg",
              },
            },
            url: canonicalUrl,
          }),
        },
        ...(loaderData.faq && loaderData.faq.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: loaderData.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer,
                    },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    trackEvent("blog_article_opened", {
      slug: post.slug,
      title: post.title.en,
    });
  }, [post.slug]);

  return (
    <SiteShell>
      <main className="bg-background pb-20">
        <article>
          {/* Header */}
          <header className="relative pt-10 lg:pt-16 pb-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={post.image}
                alt={post.title[lang]}
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest/60 hover:text-forest mb-8 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {tt("Zurück zum Blog", "Back to Blog")}
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center rounded-full bg-[#b28a3c] text-[#16372f] px-3 py-1 text-xs font-semibold shadow-sm">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-forest/70">
                  <CalendarDays className="h-3.5 w-3.5" /> {post.date}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-forest leading-[1.05] mb-6">
                {post.title[lang]}
              </h1>

              <p className="text-xl text-forest/80 leading-relaxed font-medium">
                {post.description[lang]}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-forest/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#eadfce] text-[#b28a3c] grid place-items-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-forest">{post.author}</div>
                    <div className="text-xs text-forest/60">Speisely Content Team</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(
                      tt("Link in die Zwischenablage kopiert!", "Link copied to clipboard!"),
                    );
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest hover:bg-cream transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" /> {tt("Teilen", "Share")}
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-forest/10">
              <img
                src={post.image}
                alt={post.title[lang]}
                className="w-full h-auto aspect-video object-cover"
                width={1200}
                height={675}
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* TLDR Box */}
            {post.tldr && post.tldr[lang] && post.tldr[lang].length > 0 && (
              <div className="mb-10 rounded-2xl bg-[#eadfce]/30 border border-[#eadfce] p-6 sm:p-8">
                <h2 className="text-xl font-display font-bold text-forest mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#b28a3c]" />
                  {tt("Kurz & Knapp", "Quick Answer")}
                </h2>
                <ul className="space-y-3">
                  {post.tldr[lang].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-forest/80 leading-relaxed text-[15px]">
                      <span className="text-[#b28a3c] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* The raw HTML from our content engine */}
            <div
              className="prose prose-forest prose-lg max-w-none 
                         prose-headings:font-display prose-headings:text-forest
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6
                         prose-p:text-forest/80 prose-p:leading-8 prose-p:mb-10
                         prose-strong:text-forest
                         prose-a:text-[#b28a3c] hover:prose-a:text-[#8a6a2e]"
              dangerouslySetInnerHTML={{ __html: post.content[lang] }}
            />

            {/* FAQ Section (if exists) */}
            {post.faq && post.faq.length > 0 && (
              <div className="mt-16 border-t border-forest/10 pt-16">
                <div className="flex items-center gap-3 mb-8">
                  <HelpCircle className="h-8 w-8 text-forest" />
                  <h2 className="text-3xl font-display font-bold text-forest">
                    Häufig gestellte Fragen (FAQ)
                  </h2>
                </div>

                <div className="space-y-4">
                  {post.faq.map((item, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className={`border border-[#eadfce]/50 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-md" : "bg-cream/40 hover:bg-cream/80"}`}
                      >
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <h3 className="font-bold text-forest text-base sm:text-lg pr-8">
                            {item.question}
                          </h3>
                          <ChevronDown
                            className={`h-5 w-5 text-forest shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div
                          className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}
                          aria-hidden={!isOpen}
                        >
                          <p className="text-sm text-forest/80 leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Content / Services Component */}
            <div className="mt-16 rounded-2xl bg-cream border border-[#eadfce] p-8 sm:p-10 text-center shadow-sm">
              <h3 className="font-display text-3xl text-forest mb-4">
                {post.category === "Catering"
                  ? tt(
                      "Bereit für dein nächstes Event-Catering?",
                      "Ready for your next event catering?",
                    )
                  : post.category === "Event Planning"
                    ? tt("Brauchst du Unterstützung bei der Planung?", "Need help with planning?")
                    : post.category === "Company"
                      ? tt("Werde Teil von Speisely", "Become part of Speisely")
                      : tt("Essen bestellen ohne Provision?", "Order food without commission?")}
              </h3>
              <p className="text-forest/75 mb-8 max-w-lg mx-auto">
                {post.category === "Catering"
                  ? tt(
                      "Entdecke handverlesene Caterer auf unserem Marktplatz.",
                      "Discover hand-picked caterers on our marketplace.",
                    )
                  : post.category === "Event Planning"
                    ? tt(
                        "Finde geprüfte Eventplaner für dein nächstes großes Projekt.",
                        "Find vetted event planners for your next big project.",
                      )
                    : post.category === "Company"
                      ? tt(
                          "Registriere dein Unternehmen als Partner und profitiere von 0% Bestellprovision.",
                          "Register your business as a partner and benefit from 0% order commission.",
                        )
                      : tt(
                          "Unterstütze lokale Restaurants und bestelle direkt über Speisely.",
                          "Support local restaurants and order directly via Speisely.",
                        )}
              </p>
              <Link
                to={
                  post.category === "Catering"
                    ? "/catering"
                    : post.category === "Event Planning"
                      ? "/planner"
                      : post.category === "Company"
                        ? "/partners"
                        : "/instant-order"
                }
                onClick={() =>
                  trackEvent("related_service_cta_clicked", {
                    location: "blog_detail_footer",
                    category: post.category,
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-[#16372f] px-8 py-3.5 text-sm font-semibold hover:opacity-90 shadow-lg transition-transform hover:scale-105"
              >
                {post.category === "Catering"
                  ? tt("Caterer entdecken", "Discover Caterers")
                  : post.category === "Event Planning"
                    ? tt("Eventplaner finden", "Find Planners")
                    : post.category === "Company"
                      ? tt("Partner werden", "Become a Partner")
                      : tt("Jetzt lokal bestellen", "Order Local Now")}
              </Link>
            </div>
          </div>
        </article>
      </main>
    </SiteShell>
  );
}
