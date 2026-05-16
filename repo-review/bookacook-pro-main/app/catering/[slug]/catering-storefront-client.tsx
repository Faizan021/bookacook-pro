"use client";

import Image from "next/image";
import { useState } from "react";
import { useT } from "@/lib/i18n/context";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { toast } from "sonner";

type CateringStorefrontClientProps = {
  caterer: any;
  settings: any;
  categories: any[];
  products: any[];
};

export function CateringStorefrontClient({
  caterer,
  settings,
  categories,
  products,
}: CateringStorefrontClientProps) {
  const t = useT();
  const addItem = useCartStore((state) => state.addItem);

  const bannerImage = settings?.banner_image_url || caterer.cover_image_url || "/images/speisely-hero.png";

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price_amount,
      quantity: 1,
      image_url: product.image_url,
      caterer_id: caterer.id,
    });
    toast.success(`${product.name} zum Warenkorb hinzugefügt.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Premium Hero */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] mb-12 shadow-xl">
        <Image
          src={bannerImage}
          alt={caterer.business_name}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10 md:p-14">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight">{caterer.business_name}</h1>
          <p className="mt-3 text-lg text-white/90 max-w-xl font-medium tracking-wide">
            {settings?.welcome_message || `Exquisites Catering in ${caterer.city || 'Berlin'}`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-16 lg:grid-cols-1">
        {categories.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-16 text-center">
            <p className="text-[#5c6f68] font-medium text-lg">Bald verfügbar: Unsere Menüauswahl wird gerade kuratiert.</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryProducts = products.filter(p => p.category_id === category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-[#16372f] mb-10 tracking-tight">{category.name}</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-[#eadfce] flex gap-6 hover:shadow-lg transition-all duration-300">
                      {product.image_url && (
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-[1.5rem]">
                          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-xl text-[#16372f]">{product.name}</h3>
                          <p className="text-sm text-[#5c6f68] mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="font-bold text-lg text-[#b28a3c]">€{product.price_amount.toFixed(2)}</span>
                          <button 
                            className="flex items-center gap-2 bg-[#173f35] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#0f2f27] transition-all transform active:scale-95"
                            onClick={() => handleAddToCart(product)}
                          >
                            <Plus size={16} /> Hinzufügen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
