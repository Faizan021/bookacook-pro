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
  const data = await getFullStorefrontData(slug);
  
  if (!data) {
    notFound();
  }
  
  return <StorefrontPageClient initialData={data} slug={slug} />;
}
