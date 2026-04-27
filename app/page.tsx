"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context"; // Using your existing lib
import { parseHeroIntent } from "@/lib/parser";
import { LogoMark } from "@/components/ui/logo-mark";

export default function HomePage() {
  const t = useT();
  const [heroQuery, setHeroQuery] = useState("");
  
  // Performance: Only re-calculates when query changes
  const intent = useMemo(() => parseHeroIntent(heroQuery), [heroQuery]);

  return (
    <main className="bg-[#f5f1ea]">
      {/* Navigation using your existing components */}
      <header className="sticky top-0 z-50 backdrop-blur-md">
        <LogoMark size={18} color="#2d4736" />
        {/* ... Rest of your clean nav ... */}
      </header>

      {/* Sophisticated Hero Section */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-bold">{t("home.editorialHeroTitle")}</h1>
        
        {/* Using a form for better mobile 'Enter' key support */}
        <form className="mt-10 mx-auto max-w-4xl">
          <input 
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            className="rounded-full px-8 py-4 w-full"
          />
        </form>
      </section>
    </main>
  );
}
