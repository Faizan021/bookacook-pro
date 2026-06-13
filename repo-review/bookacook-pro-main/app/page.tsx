import { PremiumNavbar } from "@/components/layout/PremiumNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { AIEventPlanner } from "@/components/home/AIEventPlanner";

export default function HomePage() {
  return (
    <main className="bg-[#fbf7ef] min-h-screen pb-20">
      <PremiumNavbar />
      <HeroSection />
      
      <section className="px-6">
        <AIEventPlanner />
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-6 mt-32 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#b28a3c] font-bold mb-12">Trusted by hospitality leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:opacity-100 transition-opacity">
          {["Berlin Dining", "Gourmet Group", "The Grand", "Artisan Event", "Hofgarten"].map((partner) => (
            <span key={partner} className="text-2xl font-serif">{partner}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
