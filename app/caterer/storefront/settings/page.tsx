'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateStorefrontSettings } from '@/lib/storefront/actions';

export default function StorefrontSettingsPage() {
  const [storefrontId, setStorefrontId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [minOrder, setMinOrder] = useState('15.00');
  const [deliveryFee, setDeliveryFee] = useState('2.50');
  const [prepTime, setPrepTime] = useState(30);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
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
          const { data: settings } = await supabase
            .from('storefront_settings')
            .select('*')
            .eq('caterer_id', caterer.id)
            .maybeSingle();

          if (settings) {
            setStorefrontId(settings.id);
            setIsActive(settings.is_active);
            setMinOrder(String(settings.min_order_amount));
            setDeliveryFee(String(settings.delivery_fee));
            setPrepTime(settings.estimated_prep_time_minutes || 30);
            setDescription(settings.description || '');
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storefrontId) return;
    
    setSaving(true);
    setMessage(null);

    const result = await updateStorefrontSettings(storefrontId, {
      is_active: isActive,
      min_order_amount: parseFloat(minOrder),
      delivery_fee: parseFloat(deliveryFee),
      estimated_prep_time_minutes: prepTime,
      description: description || null,
    });

    setSaving(false);
    if (result.success) {
      setMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Fehler beim Speichern.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-[#e8ddd1] p-6">
      <h1 className="text-3xl font-heading font-bold text-[#173f35] mb-6">Storefront Einstellungen</h1>
      
      {message && (
        <div className={`p-4 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#fbf7ef] rounded-lg border border-[#e8ddd1]">
          <div>
            <h3 className="font-bold text-[#173f35]">Storefront aktivieren</h3>
            <p className="text-sm text-[#5a5047]">Mache deinen Shop für Kunden sichtbar</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#173f35]"></div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#173f35] mb-1">Mindestbestellwert (€)</label>
            <input type="number" step="0.01" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full border border-[#e8ddd1] rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#173f35] mb-1">Liefergebühr (€)</label>
            <input type="number" step="0.01" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} className="w-full border border-[#e8ddd1] rounded p-2" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#173f35] mb-1">Zubereitungszeit (Minuten)</label>
          <input type="number" value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value))} className="w-full border border-[#e8ddd1] rounded p-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#173f35] mb-1">Beschreibung</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-[#e8ddd1] rounded p-2 text-sm" placeholder="Beschreibe deinen Storefront..."></textarea>
        </div>

        <button type="submit" disabled={saving || !storefrontId} className="w-full bg-[#173f35] text-white py-3 rounded-lg font-bold hover:bg-[#0d2220] disabled:opacity-50 transition">
          {saving ? 'Wird gespeichert...' : 'Einstellungen speichern'}
        </button>
      </form>
    </div>
  );
}
