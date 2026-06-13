import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFullStorefrontData } from '@/lib/storefront/queries';
import { getRestaurantStorefrontData } from '@/lib/restaurant/queries';
import { StorefrontClient } from './StorefrontClient';
import { RestaurantStorefrontClient } from './RestaurantStorefrontClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const [catererData, restaurantData] = await Promise.all([
    getFullStorefrontData(slug),
    getRestaurantStorefrontData(slug)
  ]);

  if (catererData) {
    return {
      title: `${catererData.caterer.business_name || catererData.storefront.slug} | Speisely`,
      description: catererData.storefront.description || `Bestelle online bei ${catererData.caterer.business_name || catererData.storefront.slug}`,
    };
  }

  if (restaurantData) {
    return {
      title: `${restaurantData.restaurant.business_name || restaurantData.restaurant.slug} | Speisely`,
      description: restaurantData.restaurant.description || `Bestelle online bei ${restaurantData.restaurant.business_name || restaurantData.restaurant.slug}`,
    };
  }
  
  return {
    title: 'Nicht gefunden | Speisely',
    description: 'Das gesuchte Profil existiert nicht.',
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const [catererData, restaurantData] = await Promise.all([
      getFullStorefrontData(slug),
      getRestaurantStorefrontData(slug)
    ]);

    if (catererData) {
      return <StorefrontClient data={catererData} />;
    }
    
    if (restaurantData) {
      return <RestaurantStorefrontClient data={restaurantData} />;
    }
    
    notFound();
  } catch (error) {
    console.error("Error fetching storefront:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-white rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Storefront nicht verfügbar</h2>
          <p className="text-[#5a5047]">Entschuldigung, es gab ein Problem beim Laden des Shops. Bitte versuchen Sie es später noch einmal.</p>
        </div>
      </div>
    );
  }
}
