import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

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
  if (cat.includes("menu") || cat.includes("menü") || cat.includes("buffet")) return "🍽️";
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
    <div
      className="overflow-hidden border-b border-[oklch(0.85_0.05_152)] pb-4 mt-6"
      ref={emblaRef}
    >
      <div className="flex gap-3 px-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex shrink-0 flex-col items-center gap-2 rounded-xl border p-3 min-w-[84px] transition-all
                ${
                  isActive
                    ? "border-forest bg-forest text-[oklch(0.97_0.02_92)] shadow-md"
                    : "border-border/60 bg-cream/80 shadow-sm text-forest hover:border-forest/50 hover:bg-cream"
                }
              `}
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-full text-2xl ${isActive ? "bg-white/20" : "bg-mint"}`}
              >
                {getCategoryIcon(cat)}
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
