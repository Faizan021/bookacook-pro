"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, Clock, MapPin, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { createStorefrontOrder } from "@/lib/storefront/actions";
import type { StorefrontData, StorefrontProduct } from "@/lib/storefront/types";

type Props = {
  data: StorefrontData;
};

type CartLine = {
  product: StorefrontProduct;
  quantity: number;
};

function formatMoney(value?: number | null) {
  return `€${Number(value || 0).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function productDescription(product: StorefrontProduct) {
  return product.description_de || product.description_en || "Direkt bestellbar über Speisely.";
}

export function StorefrontClient({ data }: Props) {
  const { storefront, caterer, categories, products } = data;
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const lines = Object.values(cart);
  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.product.price || 0) * line.quantity,
    0
  );
  const minimumOrderAmount = Number(storefront.minimum_order_amount || 0);
  const belowMinimum = subtotal > 0 && subtotal < minimumOrderAmount;

  const productsByCategory = useMemo(() => {
    const map = new Map<string, StorefrontProduct[]>();

    for (const category of categories) {
      map.set(category.id, products.filter((product) => product.category_id === category.id));
    }

    const uncategorized = products.filter((product) => !product.category_id);
    if (uncategorized.length) map.set("uncategorized", uncategorized);

    return map;
  }, [categories, products]);

  function addProduct(product: StorefrontProduct) {
    setCart((current) => ({
      ...current,
      [product.id]: {
        product,
        quantity: (current[product.id]?.quantity || 0) + 1,
      },
    }));
    setSuccessOrderId(null);
    setError(null);
  }

  function changeQuantity(productId: string, delta: number) {
    setCart((current) => {
      const existing = current[productId];
      if (!existing) return current;
      const nextQuantity = existing.quantity + delta;
      if (nextQuantity <= 0) {
        const copy = { ...current };
        delete copy[productId];
        return copy;
      }
      return {
        ...current,
        [productId]: { ...existing, quantity: nextQuantity },
      };
    });
  }

  function clearCart() {
    setCart({});
  }

  async function submitOrder() {
    setError(null);
    setSuccessOrderId(null);

    if (!lines.length) {
      setError("Bitte wählen Sie mindestens ein Produkt aus.");
      return;
    }

    if (belowMinimum) {
      setError(`Der Mindestbestellwert beträgt ${formatMoney(minimumOrderAmount)}.`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await createStorefrontOrder({
          caterer_id: caterer.id,
          storefront_slug: storefront.slug,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          fulfillment_type: fulfillmentType,
          delivery_address: fulfillmentType === "delivery" ? deliveryAddress : undefined,
          delivery_city: storefront.city || undefined,
          delivery_postal_code: storefront.postal_code || undefined,
          requested_time: requestedTime || undefined,
          notes,
          items: lines.map((line) => ({
            product_id: line.product.id,
            quantity: line.quantity,
          })),
        });

        setSuccessOrderId(result.order_id);
        clearCart();
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setDeliveryAddress("");
        setRequestedTime("");
        setNotes("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bestellung konnte nicht gespeichert werden.");
      }
    });
  }

  const heroImage =
    storefront.hero_image_url ||
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85";

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#173f35]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden border-b border-[#eadfce] bg-[#102c25] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c25] via-[#102c25]/85 to-[#102c25]/40" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f3d79c] backdrop-blur">
              Speisely Direktbestellung
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              {storefront.display_name}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              {storefront.headline || storefront.description || "Direkt bestellen, abholen oder liefern lassen."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
              {storefront.city ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <MapPin className="h-4 w-4" /> {storefront.city}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                <Clock className="h-4 w-4" /> Pickup {storefront.pickup_enabled ? "aktiv" : "pausiert"}
              </span>
              {caterer.average_rating ? (
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  ★ {Number(caterer.average_rating).toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>

          {storefront.catering_cta_enabled ? (
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:self-end">
              <div className="inline-flex rounded-full bg-[#f3d79c]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f3d79c]">
                Für größere Anfragen
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Essen für 20+ Personen?</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Für Office Lunch, Events, Geburtstage oder Catering erstellt Speisely ein strukturiertes Briefing statt normalem Warenkorb.
              </p>
              <Link
                href={`/request/new?source=storefront_catering&caterer_slug=${encodeURIComponent(storefront.slug)}&query=${encodeURIComponent(`Catering Anfrage bei ${storefront.display_name} für 20+ Personen in ${storefront.city || "Deutschland"}`)}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f3d79c] px-5 py-3 font-semibold text-[#173f35] transition hover:bg-white"
              >
                Catering anfragen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryProducts = productsByCategory.get(category.id) || [];
            if (!categoryProducts.length) return null;

            return (
              <section key={category.id} className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">Menü</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#173f35]">{category.name_de}</h2>
                  {category.description_de ? <p className="mt-2 text-sm text-[#5c6f68]">{category.description_de}</p> : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {categoryProducts.map((product) => (
                    <article key={product.id} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#eadfce] bg-[#fffaf2]">
                      {product.image_url ? (
                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${product.image_url})` }} />
                      ) : null}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-[#173f35]">{product.name_de}</h3>
                            <p className="mt-2 text-sm leading-6 text-[#5c6f68]">{productDescription(product)}</p>
                          </div>
                          <p className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[#173f35] shadow-sm">
                            {formatMoney(product.price)}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(product.dietary_tags || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-[#eadfce] bg-white px-3 py-1 text-xs font-semibold text-[#5c6f68]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
                        >
                          Hinzufügen <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          {(productsByCategory.get("uncategorized") || []).length ? (
            <section className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-semibold tracking-tight text-[#173f35]">Weitere Produkte</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(productsByCategory.get("uncategorized") || []).map((product) => (
                  <article key={product.id} className="rounded-[1.5rem] border border-[#eadfce] bg-[#fffaf2] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#173f35]">{product.name_de}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#5c6f68]">{productDescription(product)}</p>
                      </div>
                      <p className="font-bold">{formatMoney(product.price)}</p>
                    </div>
                    <button type="button" onClick={() => addProduct(product)} className="mt-4 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white">
                      Hinzufügen
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {!products.length ? (
            <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-semibold">Noch keine Produkte veröffentlicht</h2>
              <p className="mt-2 text-sm text-[#5c6f68]">Dieses Restaurant bereitet sein Speisely-Menü noch vor.</p>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">Warenkorb</p>
                <h2 className="mt-1 text-2xl font-semibold">Ihre Bestellung</h2>
              </div>
              <ShoppingBag className="h-6 w-6 text-[#b28a3c]" />
            </div>

            <div className="mt-5 space-y-3">
              {!lines.length ? (
                <p className="rounded-2xl bg-[#faf6ee] p-4 text-sm text-[#5c6f68]">Wählen Sie Produkte aus dem Menü.</p>
              ) : (
                lines.map((line) => (
                  <div key={line.product.id} className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#173f35]">{line.product.name_de}</p>
                        <p className="mt-1 text-sm text-[#5c6f68]">{formatMoney(line.product.price)} × {line.quantity}</p>
                      </div>
                      <button type="button" onClick={() => changeQuantity(line.product.id, -line.quantity)} className="text-[#8a6d35] hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" onClick={() => changeQuantity(line.product.id, -1)} className="rounded-full border border-[#d8ccb9] bg-white p-2">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-semibold">{line.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(line.product.id, 1)} className="rounded-full border border-[#d8ccb9] bg-white p-2">
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="ml-auto font-bold">{formatMoney(Number(line.product.price || 0) * line.quantity)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-[#eadfce] pt-5">
              <div className="flex items-center justify-between font-semibold">
                <span>Zwischensumme</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#5c6f68]">
                Zahlung ist im MVP noch nicht aktiviert. Das Restaurant bestätigt die Bestellung direkt.
              </p>
              {minimumOrderAmount > 0 ? (
                <p className={`mt-2 text-xs font-semibold ${belowMinimum ? "text-red-700" : "text-[#5c6f68]"}`}>
                  Mindestbestellwert: {formatMoney(minimumOrderAmount)}
                </p>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#faf6ee] p-1">
              <button
                type="button"
                onClick={() => setFulfillmentType("pickup")}
                disabled={!storefront.pickup_enabled}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${fulfillmentType === "pickup" ? "bg-white shadow-sm" : "text-[#5c6f68]"}`}
              >
                Abholung
              </button>
              <button
                type="button"
                onClick={() => setFulfillmentType("delivery")}
                disabled={!storefront.delivery_enabled}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${fulfillmentType === "delivery" ? "bg-white shadow-sm" : "text-[#5c6f68] disabled:opacity-40"}`}
              >
                Lieferung
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name*" className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Telefon*" className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
              <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="E-Mail optional" className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
              {fulfillmentType === "delivery" ? (
                <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Lieferadresse" className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
              ) : null}
              <input type="datetime-local" value={requestedTime} onChange={(e) => setRequestedTime(e.target.value)} className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hinweise zur Bestellung" rows={3} className="w-full rounded-2xl border border-[#d8ccb9] bg-[#fffaf2] px-4 py-3 text-sm outline-none focus:border-[#b28a3c]" />
            </div>

            {error ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            {successOrderId ? (
              <p className="mt-4 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4" /> Bestellung gespeichert. Das Restaurant meldet sich zur Bestätigung.
              </p>
            ) : null}

            <button
              type="button"
              onClick={submitOrder}
              disabled={isPending || !lines.length || belowMinimum}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f35] px-5 py-4 font-semibold text-white transition hover:bg-[#0f2f27] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Speichern..." : "Bestellung absenden"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 rounded-[2rem] border border-[#eadfce] bg-[#fffaf2] p-5 text-sm leading-6 text-[#5c6f68] shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-[#b28a3c]" />
              <p>
                Größere Gruppen- und Eventanfragen laufen bewusst über den Speisely Catering-Flow, damit Briefing, Angebot und Details sauber strukturiert werden.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
