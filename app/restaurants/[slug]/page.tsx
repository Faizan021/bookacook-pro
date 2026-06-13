import { RESTAURANTS } from "@/lib/restaurant/registry";
import { notFound } from "next/navigation";

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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">{restaurant.name}</h1>
      </div>
    </main>
  );
}
