import { CartSummary, Order, CartItem } from './types';

export function calculateCartSummary(
  items: CartItem[],
  deliveryFee: number = 0,
  serviceType: 'pickup' | 'delivery' = 'pickup',
  estimatedPrepTime: number = 30
): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const fee = serviceType === 'delivery' ? deliveryFee : 0;
  return {
    items,
    subtotal,
    deliveryFee: fee,
    total: subtotal + fee,
    totalPeople: items.reduce((sum, item) => sum + item.quantity, 0),
    serviceType,
    estimatedReadyTime: estimatedPrepTime,
  };
}

export function shouldShowCateringCTA(cartSummary: CartSummary): boolean {
  return cartSummary.totalPeople >= 20;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function buildCateringRequestUrl(slug: string, cartSummary: CartSummary): string {
  const params = new URLSearchParams({
    source: 'storefront_catering',
    caterer_slug: slug,
    estimated_guests: String(cartSummary.totalPeople),
    food_type: 'storefront_items',
  });
  return `/request/new?${params.toString()}`;
}
