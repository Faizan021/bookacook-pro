import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, ChevronDown, Utensils, ClipboardCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { cateringFaqData, plannerFaqData } from "@/data/faq";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

function FaqPage() {
  const { lang, t } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [openCateringIndex, setOpenCateringIndex] = useState<number | null>(0);
  const [openPlannerIndex, setOpenPlannerIndex] = useState<number | null>(null);

  const toggleCatering = (index: number) =>
    setOpenCateringIndex(openCateringIndex === index ? null : index);
  const togglePlanner = (index: number) =>
    setOpenPlannerIndex(openPlannerIndex === index ? null : index);

  const curCateringFaq =
    cateringFaqData[lang as keyof typeof cateringFaqData] || cateringFaqData.en;
  const curPlannerFaq = plannerFaqData[lang as keyof typeof plannerFaqData] || plannerFaqData.en;

  // Build JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...curCateringFaq, ...curPlannerFaq].map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-32 md:py-40 text-left">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-forest/5 mb-4">
            <HelpCircle className="h-8 w-8 text-forest" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-forest">
            {tt("Häufig gestellte Fragen", "Frequently Asked Questions")}
          </h1>
          <p className="text-lg text-forest/70">
            {tt(
              "Hier finden Sie Antworten auf die häufigsten Fragen rund um Speisely und unsere Services.",
              "Here you'll find answers to the most common questions about Speisely and our services.",
            )}
          </p>
        </div>

        <div className="space-y-16">
          {/* Catering FAQs */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-forest/10 pb-4">
              <Utensils className="h-6 w-6 text-[#b28a3c]" />
              <h2 className="text-2xl font-display font-bold text-forest">
                {tt("Catering", "Catering")}
              </h2>
            </div>
            <div className="space-y-4">
              {curCateringFaq.map((item, index) => {
                const isOpen = openCateringIndex === index;
                return (
                  <div
                    key={index}
                    className={`border border-[#eadfce]/50 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-md" : "bg-cream/40 hover:bg-cream/80"}`}
                  >
                    <button
                      onClick={() => toggleCatering(index)}
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

          {/* Event Planner FAQs */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-forest/10 pb-4">
              <ClipboardCheck className="h-6 w-6 text-[#b28a3c]" />
              <h2 className="text-2xl font-display font-bold text-forest">
                {tt("Event Planer", "Event Planners")}
              </h2>
            </div>
            <div className="space-y-4">
              {curPlannerFaq.map((item, index) => {
                const isOpen = openPlannerIndex === index;
                return (
                  <div
                    key={index}
                    className={`border border-[#eadfce]/50 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-md" : "bg-cream/40 hover:bg-cream/80"}`}
                  >
                    <button
                      onClick={() => togglePlanner(index)}
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
        </div>
      </section>
    </SiteShell>
  );
}
