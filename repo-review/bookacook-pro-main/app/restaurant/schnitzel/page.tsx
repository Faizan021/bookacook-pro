import { FloatingAmbientBackground } from "@/components/restaurant/FloatingAmbientBackground";
import { RestaurantHero } from "@/components/restaurant/RestaurantHero";

export default function SchnitzelStorefront() {
  return (
    <main className="bg-[#1a1a1a] text-white min-h-screen">
      <FloatingAmbientBackground />
      <RestaurantHero 
        title="Authentic Schnitzel." 
        subtitle="Modern ordering, timeless quality." 
      />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif mb-16 text-center">Featured Dishes</h2>
        {/* Featured Grid Component would go here */}
      </section>
    </main>
  );
}
