"use client";

import { useState } from "react";
import Image from "next/image";
import { Store, MapPin, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { RestaurantStorefrontData, RestaurantProduct } from "@/lib/restaurant/types";
import { createRestaurantOrder } from "@/lib/restaurant/actions";
import { formatEuro } from "@/lib/utils/formatters";

type CartItem = RestaurantProduct & { quantity: number };

export function RestaurantStorefrontClient({ data }: { data: RestaurantStorefrontData }) {
  const { restaurant, products } = data;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">(restaurant.accepts_delivery ? "delivery" : "pickup");
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
  });

  const addToCart = (product: RestaurantProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillmentType === "delivery" ? Number(restaurant.delivery_fee) || 0 : 0;
  const total = subtotal + deliveryFee;

  const minOrderAmt = Number(restaurant.min_order_amount) || 0;
  const isBelowMin = subtotal < minOrderAmt;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isBelowMin) return;
    
    if (!formData.customer_name || !formData.customer_phone) {
      alert("Bitte füllen Sie Name und Telefon aus.");
      return;
    }
    
    if (fulfillmentType === "delivery" && !formData.delivery_address) {
      alert("Bitte füllen Sie die Lieferadresse aus.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        restaurant_id: restaurant.id,
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        fulfillment_type: fulfillmentType,
        ...formData,
      };
      
      const result = await createRestaurantOrder(payload);
      if (result.success) {
        setIsSuccess(true);
        setCart([]);
      } else {
        alert("Fehler bei der Bestellung: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf6ee] text-[#173f35] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#eadfce] text-center shadow-sm">
          <div className="w-16 h-16 bg-[#faf6ee] border border-[#d8ccb9] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#b28a3c]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Bestellung erfolgreich!</h2>
          <p className="text-[#5c6f68] mb-8">
            Vielen Dank für Ihre Bestellung bei {restaurant.business_name}. Wir bereiten alles für Sie vor.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full bg-[#173f35] text-white py-4 rounded-xl font-semibold hover:bg-[#0f2f27] transition"
          >
            Zurück zur Speisekarte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ee] text-[#173f35] pb-24">
      {/* Header / Hero */}
      <div className="bg-white border-b border-[#eadfce]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {restaurant.logo_url ? (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border border-[#eadfce] shadow-sm flex-shrink-0">
                <Image src={restaurant.logo_url} alt={restaurant.business_name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border border-[#eadfce] bg-[#faf6ee] flex items-center justify-center flex-shrink-0">
                <Store className="h-10 w-10 text-[#c49840]" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                {restaurant.business_name}
              </h1>
              {restaurant.description && (
                <p className="text-[#5c6f68] text-lg max-w-2xl mb-4">
                  {restaurant.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-[#5c6f68]">
                {restaurant.cuisine_type && (
                  <span className="flex items-center gap-1.5 bg-[#faf6ee] px-3 py-1.5 rounded-lg border border-[#eadfce]">
                    {restaurant.cuisine_type}
                  </span>
                )}
                {restaurant.city && (
                  <span className="flex items-center gap-1.5 bg-[#faf6ee] px-3 py-1.5 rounded-lg border border-[#eadfce]">
                    <MapPin className="h-4 w-4" /> {restaurant.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        {/* Menu Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Speisekarte
          </h2>
          
          {products.length === 0 ? (
            <div className="p-8 border border-dashed border-[#d8ccb9] rounded-3xl text-center">
              <p className="text-[#5c6f68]">Keine Produkte verfügbar.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => {
                const cartItem = cart.find(i => i.id === product.id);
                return (
                  <div key={product.id} className="bg-white border border-[#eadfce] rounded-2xl p-5 shadow-sm hover:border-[#d8ccb9] transition group flex flex-col">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                      <span className="font-semibold text-[#b28a3c] whitespace-nowrap bg-[#faf6ee] px-2.5 py-1 rounded-lg border border-[#eadfce]">
                        {formatEuro(product.price)}
                      </span>
                    </div>

                    <div className="flex gap-4 mb-4 flex-1">
                      <div className="flex-1 flex flex-col">
                        {product.description && (
                          <p className="text-sm text-[#5c6f68] mb-3 flex-1">
                            {product.description}
                          </p>
                        )}
                        
                        {product.allergen_info && (
                          <p className="text-xs text-[#8a9b95] mb-3">
                            <span className="font-medium text-[#5c6f68]">Allergene:</span> {product.allergen_info}
                          </p>
                        )}
                        
                        {product.dietary_tags && product.dietary_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {product.dietary_tags.map(tag => (
                              <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold bg-[#faf6ee] text-[#173f35] px-2 py-0.5 rounded-md border border-[#eadfce]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {product.image_url && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#faf6ee] border border-[#eadfce] flex-shrink-0">
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#faf6ee]">
                      {cartItem ? (
                        <div className="flex items-center gap-3 bg-[#faf6ee] rounded-xl p-1 border border-[#eadfce]">
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold w-4 text-center">{cartItem.quantity}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-2 text-sm font-semibold bg-[#faf6ee] border border-[#eadfce] px-4 py-2 rounded-xl hover:bg-white transition"
                        >
                          Hinzufügen <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart & Checkout */}
        <div className="lg:w-[400px]">
          <div className="bg-white border border-[#eadfce] rounded-3xl p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#b28a3c]" />
              Warenkorb
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-[#5c6f68]">
                Ihr Warenkorb ist leer.
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between text-sm">
                      <div className="flex gap-3">
                        <span className="font-semibold text-[#b28a3c]">{item.quantity}x</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[#5c6f68]">{formatEuro(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{formatEuro(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-[#eadfce] pt-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-[#5c6f68]">
                    <span>Zwischensumme</span>
                    <span>{formatEuro(subtotal)}</span>
                  </div>
                  {fulfillmentType === "delivery" && (
                    <div className="flex justify-between text-[#5c6f68]">
                      <span>Liefergebühr</span>
                      <span>{formatEuro(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#faf6ee]">
                    <span>Gesamt</span>
                    <span>{formatEuro(total)}</span>
                  </div>
                </div>

                {isBelowMin && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
                    Mindestbestellwert: {formatEuro(minOrderAmt)}. Es fehlen noch {formatEuro(minOrderAmt - subtotal)}.
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5c6f68] uppercase mb-1">
                      Bestellart
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`cursor-pointer text-center py-2.5 rounded-xl text-sm font-semibold border transition ${fulfillmentType === 'pickup' ? 'bg-[#173f35] border-[#173f35] text-white' : 'bg-[#faf6ee] border-[#eadfce] text-[#5c6f68]'}`}>
                        <input type="radio" value="pickup" checked={fulfillmentType === 'pickup'} onChange={() => setFulfillmentType('pickup')} className="hidden" />
                        Abholung
                      </label>
                      {restaurant.accepts_delivery && (
                        <label className={`cursor-pointer text-center py-2.5 rounded-xl text-sm font-semibold border transition ${fulfillmentType === 'delivery' ? 'bg-[#173f35] border-[#173f35] text-white' : 'bg-[#faf6ee] border-[#eadfce] text-[#5c6f68]'}`}>
                          <input type="radio" value="delivery" checked={fulfillmentType === 'delivery'} onChange={() => setFulfillmentType('delivery')} className="hidden" />
                          Lieferung
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#eadfce]">
                    <input 
                      type="text" 
                      placeholder="Name*" 
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData(p => ({ ...p, customer_name: e.target.value }))}
                      className="w-full bg-[#faf6ee] border border-[#eadfce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b28a3c] transition"
                    />
                    
                    <input 
                      type="text" 
                      placeholder="Telefon*" 
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData(p => ({ ...p, customer_phone: e.target.value }))}
                      className="w-full bg-[#faf6ee] border border-[#eadfce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b28a3c] transition"
                    />
                    
                    {fulfillmentType === "delivery" && (
                      <textarea 
                        placeholder="Lieferadresse*" 
                        required
                        value={formData.delivery_address}
                        onChange={(e) => setFormData(p => ({ ...p, delivery_address: e.target.value }))}
                        className="w-full bg-[#faf6ee] border border-[#eadfce] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b28a3c] transition min-h-[80px]"
                      />
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || cart.length === 0 || isBelowMin}
                    className="w-full mt-4 bg-[#173f35] text-white py-4 rounded-xl font-bold hover:bg-[#0f2f27] transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Bitte warten...</>
                    ) : (
                      `Kostenpflichtig bestellen (${formatEuro(total)})`
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
