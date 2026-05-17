import { Metadata } from "next";
import { notFound } from "next/navigation";

import { restaurants } from "@/data/restaurants";

import { RestaurantHero } from "@/components/restaurant/RestaurantHero";
import { RestaurantMenu } from "@/components/restaurant/RestaurantMenu";
import { RestaurantCart } from "@/components/restaurant/RestaurantCart";
import { RestaurantTrustPanel } from "@/components/restaurant/RestaurantTrustPanel";

type PageProps = {
  params: {
    slug: string;
  };
};

const getRestaurantBySlug = (slug: string) => {
  return restaurants.find((restaurant) => restaurant.slug === slug);
};

export async function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const restaurant = getRestaurantBySlug(params.slug);

  if (!restaurant) {
    return {
      title: "Restaurant Not Found | Speisely",
    };
  }

  return {
    title: `${restaurant.name} | Speisely`,
    description:
      restaurant.description ||
      `Discover ${restaurant.name} on Speisely.`,
    openGraph: {
      title: restaurant.name,
      description:
        restaurant.description ||
        `Discover ${restaurant.name} on Speisely.`,
      images: restaurant.coverImage
        ? [
            {
              url: restaurant.coverImage,
            },
          ]
        : [],
    },
  };
}

export default function RestaurantPage({ params }: PageProps) {
  const restaurant = getRestaurantBySlug(params.slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-8 lg:px-10">
        <RestaurantHero restaurant={restaurant} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <RestaurantTrustPanel restaurant={restaurant} />

            <RestaurantMenu
              restaurant={restaurant}
              categories={restaurant.categories}
            />
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <RestaurantCart restaurant={restaurant} />
          </aside>
        </div>
      </div>
    </main>
  );
}
