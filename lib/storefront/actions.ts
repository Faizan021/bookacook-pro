'use server';

import { createClient } from '@/lib/supabase/server';

export async function createStorefrontOrder(payload: {
  caterer_id: string;
  items: Array<{ product_id: string; quantity: number; unit_price: number }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  deliveryFee: number;
  totalAmount: number;
}) {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        caterer_id: payload.caterer_id,
        customer_id: user?.id || null,
        source_type: 'direct_storefront',
        order_status: 'pending',
        service_type: payload.serviceType,
        total_amount: payload.totalAmount,
        delivery_fee: payload.deliveryFee,
        notes: payload.notes || null,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
        delivery_address: payload.deliveryAddress || null
      })
      .select()
      .single();
      
    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);
    
    const orderItems = payload.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Error creating storefront order:', error);
    return { success: false, error: error.message };
  }
}
