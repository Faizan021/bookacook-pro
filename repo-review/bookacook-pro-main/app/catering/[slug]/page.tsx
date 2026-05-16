import { notFound } from "next/navigation";
import { getStorefrontData } from "@/lib/storefront/queries";
import { CateringStorefrontClient } from "./catering-storefront-client";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

export default async function CateringPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const data = await getStorefrontData(slug);

  if (!data) {
    notFound();
  }

  const { caterer, settings, categories, products } = data;

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />
      
      <CateringStorefrontClient 
        caterer={caterer}
        settings={settings}
        categories={categories}
        products={products}
      />
    </main>
  );
}
