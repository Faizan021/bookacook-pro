import { createClient } from "@/lib/supabase/server";

export async function updateOrderStatus(orderId: string, status: 'preparing' | 'on_the_way' | 'delivered') {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("orders")
    .update({ fulfillment_status: status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
