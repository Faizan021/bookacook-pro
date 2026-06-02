'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/storefront/helpers';

// We fetch directly in component since this is a client component and getOrdersForCaterer was not exported in queries.ts yet
export default function StorefrontOrdersDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: caterer } = await supabase
          .from('caterers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (caterer) {
          const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('caterer_id', caterer.id)
            .order('created_at', { ascending: false });
          
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-center text-[#5a5047]">Bestellungen werden geladen...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-[#173f35] mb-6">Eingehende Bestellungen</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e8ddd1] p-12 text-center text-[#5a5047]">
          Noch keine Bestellungen über das Storefront erhalten.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e8ddd1] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf7ef] border-b border-[#e8ddd1] text-[#173f35] font-bold text-sm">
                <th className="p-4">Kunde</th>
                <th className="p-4">Typ</th>
                <th className="p-4">Betrag</th>
                <th className="p-4">Status</th>
                <th className="p-4">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddd1] text-sm text-[#5a5047]">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#fbf7ef]/50 transition">
                  <td className="p-4 font-medium text-[#173f35]">{order.customer_name}</td>
                  <td className="p-4 capitalize">{order.service_type}</td>
                  <td className="p-4 font-bold">{formatCurrency(order.total_amount)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.order_status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="p-4">{new Date(order.created_at).toLocaleDateString('de-DE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
