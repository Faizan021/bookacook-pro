'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { StorefrontData, CartItem } from '@/lib/storefront/types';
import { calculateCartSummary, shouldShowCateringCTA, buildCateringRequestUrl, formatCurrency } from '@/lib/storefront/helpers';

interface Props {
  initialData: StorefrontData;
  slug: string;
}

export function StorefrontPageClient({ initialData, slug }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>('pickup');
  
  const { storefront, caterer, categories, products } = initialData;
  
  const cartSummary = useMemo(() => {
    return calculateCartSummary(cart, storefront.delivery_fee, serviceType, storefront.estimated_prep_time_minutes);
  }, [cart, storefront, serviceType]);
  
  const showCateringCTA = shouldShowCateringCTA(cartSummary);
  
  const handleAddToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 max-w-7xl mx-auto">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#173f35] mb-2">{caterer.business_name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-[#5a5047] mb-4">
            {caterer.city && <div className="flex items-center gap-1"><MapPin size={16} /><span>{caterer.city}</span></div>}
            <div className="flex items-center gap-1"><Clock size={16} /><span>~{storefront.estimated_prep_time_minutes} Min</span></div>
          </div>
          <p className="text-[#5a5047] mb-4">{storefront.description}</p>
          <div className="flex gap-2">
            <button onClick={() => setServiceType('pickup')} className={`px-4 py-2 rounded-lg font-medium ${serviceType === 'pickup' ? 'bg-[#173f35] text-white' : 'bg-white border text-[#173f35]'}`}>Abholung</button>
            <button onClick={() => setServiceType('delivery')} className={`px-4 py-2 rounded-lg font-medium ${serviceType === 'delivery' ? 'bg-[#173f35] text-white' : 'bg-white border text-[#173f35]'}`}>Lieferung</button>
          </div>
        </div>

        <div className="space-y-8">
          {categories.map(category => {
            const categoryProducts = products.filter(p => p.category_id === category.id);
            if (categoryProducts.length === 0) return null;
            return (
              <div key={category.id}>
                <h2 className="text-2xl font-bold text-[#173f35] mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg border p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[#173f35] mb-1">{product.name}</h3>
                        <p className="text-sm text-[#5a5047] mb-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-bold text-[#173f35]">{formatCurrency(product.price)}</span>
                        <button onClick={() => handleAddToCart(product)} className="bg-[#173f35] text-white px-3 py-1 rounded hover:bg-[#0d2220]">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:w-96 bg-white rounded-lg border p-4 h-fit sticky top-4">
        <h3 className="text-xl font-bold text-[#173f35] mb-4">Warenkorb</h3>
        {cart.length === 0 ? (
          <p className="text-[#5a5047] text-sm">Dein Warenkorb ist noch leer.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-[#173f35]">{item.product.name}</p>
                  <p className="text-xs text-[#5a5047]">{formatCurrency(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-0.5 border rounded">-</button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-0.5 border rounded">+</button>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t text-sm space-y-2 text-[#5a5047]">
              <div className="flex justify-between">
                <span>Zwischensumme</span>
                <span>{formatCurrency(cartSummary.subtotal)}</span>
              </div>
              {serviceType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Lieferung</span>
                  <span>{formatCurrency(cartSummary.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#173f35] text-lg pt-2 border-t">
                <span>Gesamt</span>
                <span>{formatCurrency(cartSummary.total)}</span>
              </div>
            </div>
            {showCateringCTA ? (
              <a href={buildCateringRequestUrl(slug, cartSummary)} className="block w-full bg-[#c88d5b] text-white text-center py-3 rounded-lg font-bold hover:bg-[#b57a49]">
                Als Catering anfragen
              </a>
            ) : (
              <button className="w-full bg-[#173f35] text-white py-3 rounded-lg font-bold hover:bg-[#0d2220]">
                Zur Kasse
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
