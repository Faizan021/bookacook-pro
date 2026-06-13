import { RESTAURANTS } from "@/lib/restaurant/registry";
import { notFound } from "next/navigation";
import { RestaurantHero } from "@/components/restaurant/hero/RestaurantHero";
import { RestaurantMenu } from "@/components/restaurant/menu/RestaurantMenu";
import { RestaurantCart } from "@/components/restaurant/cart/RestaurantCart";
import { RestaurantTrustPanel } from "@/components/restaurant/trust/RestaurantTrustPanel";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = RESTAURANTS[slug];

  if (!restaurant) notFound();

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <RestaurantHero restaurant={restaurant} />
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <RestaurantMenu menu={restaurant.menu} />
          <RestaurantTrustPanel />
        </div>
        
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <RestaurantCart />
          </div>
        </aside>
      </div>
    </main>
  );
}
