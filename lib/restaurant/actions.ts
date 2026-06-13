'use server';

import { createClient } from '@/lib/supabase/server';
import {
  restaurantOrderSchema,
  createRestaurantSchema,
  updateRestaurantSchema,
  restaurantProductSchema,
} from './schemas';
import {
  RESTAURANT_COMMISSION_RATE,
  calculateRestaurantPlatformFee,
} from './commission';

// ---------------------------------------------------------------------------
// Restaurant server actions
// Follows the same pattern as lib/storefront/actions.ts:
//   - Zod validation first
//   - Server-side price calculation (never trust client amounts)
//   - Typed return { success, error?, ... }
// ---------------------------------------------------------------------------

type ActionResult<T = Record<string, unknown>> =
  | ({ success: true } & T)
  | { success: false; error: string };

// ─── Restaurant CRUD ────────────────────────────────────────────────────────

/**
 * Create a new restaurant for the currently authenticated user.
 */
export async function createRestaurant(
  payload: unknown
): Promise<ActionResult<{ restaurant_id: string }>> {
  const supabase = await createClient();

  try {
    const validated = createRestaurantSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a restaurant.');

    // Ensure slug uniqueness across both caterer storefronts AND restaurants
    const { data: existingSlug } = await supabase
      .from('storefront_settings')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle();

    if (existingSlug) {
      throw new Error(
        'This slug is already taken by a caterer storefront. Please choose another.'
      );
    }

    const { data: existingRestaurantSlug } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle();

    if (existingRestaurantSlug) {
      throw new Error(
        'This slug is already taken by another restaurant. Please choose another.'
      );
    }

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        user_id: user.id,
        business_name: validated.business_name,
        slug: validated.slug,
        description: validated.description || null,
        phone: validated.phone || null,
        email: validated.email || null,
        business_address: validated.business_address || null,
        city: validated.city || null,
        postal_code: validated.postal_code || null,
        cuisine_type: validated.cuisine_type || null,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create restaurant: ${error.message}`);

    // Update the user's profile role
    await supabase
      .from('profiles')
      .update({ role: 'restaurant' })
      .eq('id', user.id);

    return { success: true, restaurant_id: restaurant.id };
  } catch (err: unknown) {
    console.error('Error creating restaurant:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Update an existing restaurant's profile / settings.
 */
export async function updateRestaurant(
  restaurantId: string,
  payload: unknown
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const validated = updateRestaurantSchema.parse(payload);

    const { error } = await supabase
      .from('restaurants')
      .update(validated)
      .eq('id', restaurantId);

    if (error) throw new Error(`Failed to update restaurant: ${error.message}`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Error updating restaurant:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

// ─── Product CRUD ───────────────────────────────────────────────────────────

/**
 * Add a product to a restaurant's menu.
 */
export async function createRestaurantProduct(
  restaurantId: string,
  payload: unknown
): Promise<ActionResult<{ product_id: string }>> {
  const supabase = await createClient();

  try {
    const validated = restaurantProductSchema.parse(payload);

    const { data: product, error } = await supabase
      .from('restaurant_products')
      .insert({
        restaurant_id: restaurantId,
        name: validated.name,
        description: validated.description || null,
        price: validated.price,
        image_url: validated.image_url || null,
        category: validated.category || null,
        dietary_tags: validated.dietary_tags || [],
        allergen_info: validated.allergen_info || null,
        is_available: validated.is_available ?? true,
        display_order: validated.display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create product: ${error.message}`);
    return { success: true, product_id: product.id };
  } catch (err: unknown) {
    console.error('Error creating restaurant product:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Update an existing restaurant product.
 */
export async function updateRestaurantProduct(
  productId: string,
  payload: unknown
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const validated = restaurantProductSchema.partial().parse(payload);

    const { error } = await supabase
      .from('restaurant_products')
      .update(validated)
      .eq('id', productId);

    if (error) throw new Error(`Failed to update product: ${error.message}`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Error updating restaurant product:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Soft-delete a restaurant product (marks as unavailable).
 * Hard-delete would break foreign keys on existing order items.
 */
export async function deleteRestaurantProduct(
  productId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('restaurant_products')
      .update({ is_available: false })
      .eq('id', productId);

    if (error) throw new Error(`Failed to delete product: ${error.message}`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting restaurant product:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

// ─── Order actions ──────────────────────────────────────────────────────────

/**
 * Create a new restaurant order.
 * Follows the same secure pattern as createStorefrontOrder():
 *   1. Zod validate payload
 *   2. Fetch products from DB for server-side price calc
 *   3. Enforce min order amount
 *   4. Apply 2% platform fee
 *   5. Insert order + items
 */
export async function createRestaurantOrder(
  payload: unknown
): Promise<ActionResult<{ order_id: string }>> {
  const supabase = await createClient();

  try {
    // 1. Validate
    const validated = restaurantOrderSchema.parse(payload);

    // 2. Fetch products for server-side pricing
    const productIds = validated.items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from('restaurant_products')
      .select('*')
      .in('id', productIds);

    if (productsError)
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    if (!products || products.length === 0)
      throw new Error('No valid products found for this order.');

    // 3. Server-side price calculation
    let calculatedSubtotal = 0;
    const finalItems = validated.items.map((item) => {
      const dbProduct = products.find((p) => p.id === item.product_id);
      if (!dbProduct) throw new Error(`Product ${item.product_id} not found.`);
      if (!dbProduct.is_available)
        throw new Error(`Product ${dbProduct.name} is currently unavailable.`);

      const lineTotal = dbProduct.price * item.quantity;
      calculatedSubtotal += lineTotal;

      return {
        product_id: item.product_id,
        product_name: dbProduct.name,
        quantity: item.quantity,
        unit_price: dbProduct.price,
        total_price: lineTotal,
      };
    });

    // 4. Fetch restaurant settings for delivery fee + min order check
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('min_order_amount, delivery_fee')
      .eq('id', validated.restaurant_id)
      .single();

    if (restError)
      throw new Error(`Failed to fetch restaurant settings: ${restError.message}`);

    if (calculatedSubtotal < restaurant.min_order_amount) {
      throw new Error(
        `Order subtotal (€${calculatedSubtotal.toFixed(2)}) is below the minimum order amount (€${restaurant.min_order_amount.toFixed(2)}).`
      );
    }

    const deliveryFee =
      validated.fulfillment_type === 'delivery' ? restaurant.delivery_fee : 0;
    const platformFee = calculateRestaurantPlatformFee(calculatedSubtotal);
    const finalTotal = calculatedSubtotal + deliveryFee;

    // 5. Insert order
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error: orderError } = await supabase
      .from('restaurant_orders')
      .insert({
        restaurant_id: validated.restaurant_id,
        customer_id: user?.id || null,
        order_status: 'pending',
        fulfillment_type: validated.fulfillment_type,
        subtotal: calculatedSubtotal,
        delivery_fee: deliveryFee,
        platform_fee_rate: RESTAURANT_COMMISSION_RATE * 100, // store as percentage (2.00)
        platform_fee_amount: platformFee,
        total_amount: finalTotal,
        notes: validated.notes || null,
        customer_name: validated.customer_name,
        customer_email: validated.customer_email || null,
        customer_phone: validated.customer_phone,
        delivery_address: validated.delivery_address || null,
        requested_time: validated.requested_time || null,
      })
      .select()
      .single();

    if (orderError)
      throw new Error(`Failed to create order: ${orderError.message}`);

    // 6. Insert order items
    const orderItemsToInsert = finalItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from('restaurant_order_items')
      .insert(orderItemsToInsert);

    if (itemsError)
      throw new Error(`Failed to create order items: ${itemsError.message}`);

    return { success: true, order_id: order.id };
  } catch (err: unknown) {
    console.error('Error creating restaurant order:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Update the status of a restaurant order (e.g. confirmed → preparing → ready).
 */
export async function updateRestaurantOrderStatus(
  orderId: string,
  newStatus: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const allowedStatuses = [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
    'cancelled',
  ];

  if (!allowedStatuses.includes(newStatus)) {
    return { success: false, error: `Invalid status: ${newStatus}` };
  }

  try {
    const { error } = await supabase
      .from('restaurant_orders')
      .update({ order_status: newStatus })
      .eq('id', orderId);

    if (error)
      throw new Error(`Failed to update order status: ${error.message}`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Error updating restaurant order status:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}
