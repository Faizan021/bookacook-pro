import { createClient } from '@/lib/supabase/server';
import { StorefrontSettings, ProductCategory, Product, Order, OrderItem } from './types';

export interface OrderWithItems extends Order {
  items: (OrderItem & { product?: Product })[];
}

export async function getFullStorefrontData(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('storefront_settings')
    .select(`
      *,
      caterers:caterer_id (
        id,
        business_name,
        logo_url,
        phone,
        city
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) throw new Error(`Failed to fetch storefront: ${error.message}`);
  if (!data) return null;

  const storefront = data as StorefrontSettings;
  const caterer = data.caterers;

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('product_categories').select('*').eq('caterer_id', storefront.caterer_id).eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('products').select('*').eq('caterer_id', storefront.caterer_id).eq('is_available', true).eq('service_type', 'instant').order('display_order', { ascending: true })
  ]);

  return {
    storefront,
    caterer,
    categories: (categoriesResult.data || []) as ProductCategory[],
    products: (productsResult.data || []) as Product[]
  };
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();
  
  if (orderError) throw new Error(`Failed to fetch order: ${orderError.message}`);
  if (!order) return null;
  
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`*, product:product_id (*)`)
    .eq('order_id', orderId);
  
  if (itemsError) throw new Error(`Failed to fetch order items: ${itemsError.message}`);
  
  return {
    ...order,
    items: items || []
  } as OrderWithItems;
}
