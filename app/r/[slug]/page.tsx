import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFullStorefrontData } from '@/lib/storefront/queries';
import { StorefrontPageClient } from './page-client';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFullStorefrontData(slug);
  
  if (!data) {
    return {
      title: 'Restaurant nicht gefunden | Speisely',
      description: 'Das gesuchte Restaurant existiert nicht.',
    };
  }
  
  return {
    title: `${data.caterer.business_name || data.storefront.slug} | Speisely`,
    description: data.storefront.description || `Bestelle online bei ${data.caterer.business_name || data.storefront.slug}`,
  };
}

export default async function StorefrontPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const data = await getFullStorefrontData(slug);
    
    if (!data) {
      notFound();
    }
    
    return <StorefrontPageClient initialData={data} slug={slug} />;
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
