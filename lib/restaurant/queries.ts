import { createClient } from '@/lib/supabase/server';
import {
  Restaurant,
  RestaurantProduct,
  RestaurantOrder,
  RestaurantOrderItem,
  RestaurantOrderWithItems,
  RestaurantStorefrontData,
} from './types';

// ---------------------------------------------------------------------------
// Restaurant queries — server-side data-fetching functions.
// Same pattern as lib/storefront/queries.ts (async, throws on DB error).
// ---------------------------------------------------------------------------

/**
 * Fetch a restaurant by its unique slug.
 * Used by the public storefront page `/r/[slug]`.
 */
export async function getRestaurantBySlug(
  slug: string
): Promise<Restaurant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch restaurant: ${error.message}`);
  return data as Restaurant | null;
}

/**
 * Fetch the restaurant owned by a specific user.
 * Used in the dashboard — one user = one restaurant (for now).
 */
export async function getRestaurantByUserId(
  userId: string
): Promise<Restaurant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`Failed to fetch restaurant by user: ${error.message}`);
  return data as Restaurant | null;
}

/**
 * Fetch all products for a restaurant.
 * Optionally filter to available-only (for public storefront).
 */
export async function getRestaurantProducts(
  restaurantId: string,
  { availableOnly = false }: { availableOnly?: boolean } = {}
): Promise<RestaurantProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from('restaurant_products')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('display_order', { ascending: true });

  if (availableOnly) {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query;

  if (error)
    throw new Error(`Failed to fetch restaurant products: ${error.message}`);
  return (data || []) as RestaurantProduct[];
}

/**
 * Fetch orders for a restaurant (dashboard view).
 * Returns most recent first with a configurable limit.
 */
export async function getRestaurantOrders(
  restaurantId: string,
  { limit = 50 }: { limit?: number } = {}
): Promise<RestaurantOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('restaurant_orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error)
    throw new Error(`Failed to fetch restaurant orders: ${error.message}`);
  return (data || []) as RestaurantOrder[];
}

/**
 * Fetch a single restaurant order by ID, including its line items
 * and the product snapshot for each item.
 */
export async function getRestaurantOrderById(
  orderId: string
): Promise<RestaurantOrderWithItems | null> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from('restaurant_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError)
    throw new Error(`Failed to fetch restaurant order: ${orderError.message}`);
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from('restaurant_order_items')
    .select('*, product:product_id (*)')
    .eq('order_id', orderId);

  if (itemsError)
    throw new Error(
      `Failed to fetch restaurant order items: ${itemsError.message}`
    );

  return {
    ...order,
    items: items || [],
  } as RestaurantOrderWithItems;
}

/**
 * Fetch all data needed to render the public restaurant storefront:
 * restaurant info + available products.
 * Equivalent to getFullStorefrontData() for caterers.
 */
export async function getRestaurantStorefrontData(
  slug: string
): Promise<RestaurantStorefrontData | null> {
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return null;

  const products = await getRestaurantProducts(restaurant.id, {
    availableOnly: true,
  });

  return { restaurant, products };
}
