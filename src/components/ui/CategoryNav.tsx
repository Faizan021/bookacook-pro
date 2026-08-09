import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("bowl") || cat.includes("salad") || cat.includes("salat")) return "🥗";
  if (cat.includes("pizza") || cat.includes("pizze")) return "🍕";
  if (cat.includes("burger")) return "🍔";
  if (
    cat.includes("drink") ||
    cat.includes("getränk") ||
    cat.includes("beverage") ||
    cat.includes("getränke")
  )
    return "🥤";
  if (cat.includes("dessert") || cat.includes("sweet") || cat.includes("dolci")) return "🍰";
  if (cat.includes("ice cream") || cat.includes("eis")) return "🍨";
  if (cat.includes("coffee") || cat.includes("kaffee")) return "☕";
  if (cat.includes("pastry") || cat.includes("bakery") || cat.includes("brot")) return "🥐";
  if (cat.includes("soup") || cat.includes("suppe") || cat.includes("ramen")) return "🍜";
  if (cat.includes("pasta") || cat.includes("noodle")) return "🍝";
  if (cat.includes("sushi") || cat.includes("maki")) return "🍣";
  if (cat.includes("antipasti") || cat.includes("starter") || cat.includes("vorspeise"))
    return "🧀";
  if (cat.includes("side") || cat.includes("beilage")) return "🍟";
  if (cat.includes("wein") || cat.includes("wine")) return "🍷";
  if (
    cat.includes("meat") ||
    cat.includes("fleisch") ||
    cat.includes("steak") ||
    cat.includes("grill")
  )
    return "🥩";
  if (cat.includes("fish") || cat.includes("fisch") || cat.includes("seafood")) return "🐟";
  if (cat.includes("vegan") || cat.includes("vegetarian")) return "🌱";
  if (cat.includes("biryani") || cat.includes("rice") || cat.includes("pulao")) return "🍚";
  if (cat.includes("chicken")) return "🍗";
  if (cat.includes("mutton") || cat.includes("beef") || cat.includes("gosht")) return "🥩";
  if (cat.includes("bbq") || cat.includes("grill")) return "🔥";
  if (cat.includes("daal") || cat.includes("vegetarian") || cat.includes("sabzi")) return "🥦";
  if (cat.includes("street") || cat.includes("starter") || cat.includes("snack")) return "🧆";
  if (cat.includes("bread") || cat.includes("naan") || cat.includes("roti")) return "🫓";
  if (cat.includes("menu") || cat.includes("menü") || cat.includes("buffet")) return "🍽️";
  if (cat.includes("traditional") || cat.includes("special")) return "⭐";
  return "🍽️"; // Default
};

interface CategoryNavProps {
  categories: string[];
  activeCategory?: string;
  onSelect: (cat: string) => void;
}

export function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
    emblaApi.on("scroll", updateScrollState);
    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
      emblaApi.off("scroll", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  useEffect(() => {
    if (emblaApi && activeCategory) {
      const index = categories.indexOf(activeCategory);
      if (index > -1) {
        emblaApi.scrollTo(index);
      }
    }
  }, [emblaApi, activeCategory, categories]);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="sticky top-[96px] md:top-[72px] z-30 mt-4 sm:mt-6 bg-[#fdfaf5]/95 backdrop-blur-md border-b border-[oklch(0.85_0.05_152)] shadow-sm">
      <div className="relative">
        {/* Left fade + button */}
        {canScrollPrev && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#fdfaf5] to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-[oklch(0.85_0.05_152)] shadow-sm grid place-items-center text-forest hover:bg-cream transition hidden sm:grid"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Right fade + button */}
        {canScrollNext && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fdfaf5] to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-[oklch(0.85_0.05_152)] shadow-sm grid place-items-center text-forest hover:bg-cream transition hidden sm:grid"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3 py-3 sm:py-4 px-4 sm:px-6 lg:px-10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelect(cat)}
                  className={`flex shrink-0 flex-col items-center gap-2 rounded-xl border p-3 min-w-[80px] max-w-[100px] transition-all cursor-pointer
                    ${
                      isActive
                        ? "border-forest bg-forest text-[oklch(0.97_0.02_92)] shadow-md"
                        : "border-border/60 bg-cream/80 shadow-sm text-forest hover:border-forest/50 hover:bg-cream"
                    }
                  `}
                >
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-xl ${isActive ? "bg-white/20" : "bg-mint"}`}
                  >
                    {getCategoryIcon(cat)}
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight line-clamp-2">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
