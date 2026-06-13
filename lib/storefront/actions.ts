'use server';

import { createClient } from '@/lib/supabase/server';
import { storefrontOrderSchema } from './schemas';

/**
 * Creates a new storefront order.
 * Fix #1: Server-side price calculation and minimum order enforcement.
 * Fix #3: Server-side payload validation using Zod.
 */
export async function createStorefrontOrder(payload: unknown) {
  const supabase = await createClient();
  
  try {
    // 1. Zod Validation (Fix #3)
    const validatedData = storefrontOrderSchema.parse(payload);
    
    // 2. Fetch products to securely calculate prices (Fix #1)
    const productIds = validatedData.items.map(i => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
      
    if (productsError) throw new Error(`Failed to fetch products: ${productsError.message}`);
    if (!products || products.length === 0) throw new Error('No valid products found for this order.');
    
    // 3. Server-Side Price Calculation (Fix #1)
    let calculatedSubtotal = 0;
    const finalItems = validatedData.items.map(item => {
      const dbProduct = products.find(p => p.id === item.product_id);
      if (!dbProduct) throw new Error(`Product ${item.product_id} not found.`);
      if (!dbProduct.is_available) throw new Error(`Product ${dbProduct.name} is currently unavailable.`);
      
      calculatedSubtotal += dbProduct.price * item.quantity;
      
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: dbProduct.price // Never trust client unit_price
      };
    });
    
    // 4. Fetch settings to apply delivery fee and check minimum order amount (Fix #1)
    const { data: settings, error: settingsError } = await supabase
      .from('storefront_settings')
      .select('delivery_fee, min_order_amount')
      .eq('caterer_id', validatedData.caterer_id)
      .single();
      
    if (settingsError) throw new Error(`Failed to fetch settings: ${settingsError.message}`);
    
    if (calculatedSubtotal < settings.min_order_amount) {
      throw new Error(`Order subtotal (€${calculatedSubtotal.toFixed(2)}) is below the minimum order amount (€${settings.min_order_amount.toFixed(2)}).`);
    }
    
    const deliveryFee = validatedData.serviceType === 'delivery' ? settings.delivery_fee : 0;
    const finalTotalAmount = calculatedSubtotal + deliveryFee;
    
    // 5. Securely Insert Order
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        caterer_id: validatedData.caterer_id,
        customer_id: user?.id || null,
        source_type: 'direct_storefront',
        order_status: 'pending',
        service_type: validatedData.serviceType,
        total_amount: finalTotalAmount, // Server calculated
        delivery_fee: deliveryFee,      // Server calculated
        notes: validatedData.notes || null,
        customer_name: validatedData.customerName,
        customer_email: validatedData.customerEmail,
        customer_phone: validatedData.customerPhone,
        delivery_address: validatedData.deliveryAddress || null
      })
      .select()
      .single();
      
    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);
    
    // 6. Insert Order Items securely
    const orderItemsToInsert = finalItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);
      
    if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);
    
    return { success: true, order_id: order.id };
  } catch (error: unknown) {
    console.error('Error creating storefront order:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateStorefrontSettings(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('storefront_settings').update(updates).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
