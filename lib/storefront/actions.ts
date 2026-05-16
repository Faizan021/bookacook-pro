"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type CreateStorefrontOrderInput = {
  caterer_id: string;
  storefront_slug: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  fulfillment_type: "pickup" | "delivery";
  delivery_address?: string;
  delivery_city?: string;
  delivery_postal_code?: string;
  requested_time?: string;
  notes?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    notes?: string;
  }>;
};

function clean(value?: string | null) {
  const trimmed = (value || "").trim();
  return trimmed.length ? trimmed : null;
}

export async function createStorefrontOrder(input: CreateStorefrontOrderInput) {
  const supabase = await createClient();

  const cleanItems = input.items
    .map((item) => ({
      product_id: item.product_id,
      quantity: Math.max(1, Math.min(99, Number(item.quantity || 1))),
      notes: clean(item.notes),
    }))
    .filter((item) => item.product_id);

  if (!input.caterer_id || !input.storefront_slug || !cleanItems.length) {
    throw new Error("Bitte wählen Sie mindestens ein Produkt aus.");
  }

  if (!clean(input.customer_name) || !clean(input.customer_phone)) {
    throw new Error("Name und Telefonnummer sind erforderlich.");
  }

  const productIds = cleanItems.map((item) => item.product_id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,caterer_id,name_de,price,service_type,is_active")
    .eq("caterer_id", input.caterer_id)
    .in("id", productIds)
    .eq("service_type", "instant")
    .eq("is_active", true);

  if (productsError) throw new Error(productsError.message);

  const productMap = new Map((products || []).map((product) => [product.id, product]));

  if (productMap.size !== productIds.length) {
    throw new Error("Ein Produkt ist nicht mehr verfügbar. Bitte aktualisieren Sie die Seite.");
  }

  const subtotal = cleanItems.reduce((sum, item) => {
    const product = productMap.get(item.product_id);
    return sum + Number(product?.price || 0) * item.quantity;
  }, 0);

  const platformFeeRate = 3;
  const platformFeeAmount = Number(((subtotal * platformFeeRate) / 100).toFixed(2));
  const totalAmount = Number(subtotal.toFixed(2));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      caterer_id: input.caterer_id,
      source: "direct_storefront",
      order_type: "instant_order",
      status: "pending",
      customer_name: clean(input.customer_name),
      customer_email: clean(input.customer_email),
      customer_phone: clean(input.customer_phone),
      fulfillment_type: input.fulfillment_type,
      delivery_address: clean(input.delivery_address),
      delivery_city: clean(input.delivery_city),
      delivery_postal_code: clean(input.delivery_postal_code),
      requested_time: clean(input.requested_time),
      notes: clean(input.notes),
      subtotal,
      delivery_fee: 0,
      platform_fee_rate: platformFeeRate,
      platform_fee_amount: platformFeeAmount,
      total_amount: totalAmount,
      payment_status: "unpaid",
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  const rows = cleanItems.map((item) => {
    const product = productMap.get(item.product_id)!;
    const unitPrice = Number(product.price || 0);
    return {
      order_id: order.id,
      product_id: item.product_id,
      product_name: product.name_de,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: Number((unitPrice * item.quantity).toFixed(2)),
      notes: item.notes,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(rows);

  if (itemsError) throw new Error(itemsError.message);

  revalidatePath(`/r/${input.storefront_slug}`);

  return { order_id: order.id };
}

export async function updateStorefrontOrderStatus(orderId: string, status: string) {
  const allowed = new Set(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]);
  if (!allowed.has(status)) throw new Error("Invalid order status.");

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error(error.message);

  revalidatePath("/caterer/orders");
}
