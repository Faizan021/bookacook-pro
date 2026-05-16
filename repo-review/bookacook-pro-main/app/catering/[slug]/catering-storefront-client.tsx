"use client";

import Image from "next/image";
import { useState } from "react";
import { useT } from "@/lib/i18n/context";

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
  const [cart, setCart] = useState<any[]>([]);

  const bannerImage = settings?.banner_image_url || caterer.cover_image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=85";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden rounded-[2.5rem] shadow-sm">
        <Image
          src={bannerImage}
          alt={caterer.business_name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-10">
          <div className="text-white">
            <h1 className="text-4xl font-bold">{caterer.business_name}</h1>
            <p className="mt-2 text-lg opacity-90">{settings?.description || caterer.city}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_350px]">
        {/* Menu Section */}
        <div className="space-y-12">
          {categories.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center">
              <p className="text-[#5c6f68]">{t("storefront.noProducts", "No products available yet.")}</p>
            </div>
          ) : (
            categories.map((category) => {
              const categoryProducts = products.filter(p => p.category_id === category.id);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category.id}>
                  <h2 className="text-2xl font-bold border-b border-[#eadfce] pb-4 mb-6">{category.name}</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#eadfce] flex gap-4">
                        {product.image_url && (
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-[#5c6f68] mt-1 line-clamp-2">{product.description}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="font-bold">€{product.price.toFixed(2)}</span>
                            <button 
                              className="bg-[#173f35] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#0f2f27] transition"
                              onClick={() => setCart([...cart, product])}
                            >
                              + Add
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

        {/* Sidebar / Cart */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-[#eadfce] p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4">{t("storefront.cartTitle", "Your Order")}</h2>
            
            {cart.length === 0 ? (
              <p className="text-sm text-[#5c6f68] py-8 text-center">{t("storefront.emptyCart", "Your cart is empty")}</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-semibold">€{item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#eadfce] pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-[#173f35] text-white py-4 rounded-full font-semibold mt-6 hover:bg-[#0f2f27] transition">
                  {t("storefront.checkout", "Go to Checkout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
