import { notFound } from "next/navigation";
import { getStorefrontData } from "@/lib/storefront/queries";
import { CateringStorefrontClient } from "./catering-storefront-client";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStorefrontData(slug);
  if (!data) return { title: "Caterer Not Found" };
  const { caterer } = data;
  const imageUrl = caterer.cover_image_url || caterer.logo_url || "/images/speisely-hero.png";
  return {
    title: `${caterer.business_name} | Speisely`,
    description: `Bestes Catering von ${caterer.business_name} in ${caterer.city || "Berlin"}.`,
    openGraph: {
      title: caterer.business_name || "Speisely Caterer",
      description: `Bestes Catering von ${caterer.business_name} in ${caterer.city || "Berlin"}.`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: caterer.business_name || "Speisely Caterer",
    },
  };
}

export default async function CateringPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getStorefrontData(slug);
  if (!data) notFound();

  const { caterer, settings, categories, products } = data;

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />
      
      {products.length === 0 && categories.length === 0 ? (
        <div className="p-16 text-center text-xl">Aktuell keine Angebote verfügbar.</div>
      ) : (
        <CateringStorefrontClient 
          caterer={caterer}
          settings={settings}
          categories={categories}
          products={products}
        />
      )}
      <CartDrawer />
    </main>
  );
}
