"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Settings,
  Save,
  Loader2,
  Store,
  Truck,
  Clock,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { updateRestaurant } from "@/lib/restaurant/actions";

type RestaurantSettings = {
  id: string;
  business_name: string;
  description: string;
  business_address: string;
  phone: string;
  email: string;
  slug: string;
  logo_url: string;
  // Delivery
  accepts_delivery: boolean;
  accepts_pickup: boolean;
  delivery_radius_km: number;
  delivery_fee: number;
  min_order_amount: number;
  // Hours
  opening_hours: Record<string, { open: string; close: string; closed: boolean }>;
};

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DEFAULT_HOURS = DAYS.reduce(
  (acc, day) => {
    acc[day] = { open: "09:00", close: "22:00", closed: false };
    return acc;
  },
  {} as Record<string, { open: string; close: string; closed: boolean }>
);

const DEFAULT_SETTINGS: RestaurantSettings = {
  id: "",
  business_name: "",
  description: "",
  business_address: "",
  phone: "",
  email: "",
  slug: "",
  logo_url: "",
  accepts_delivery: false,
  accepts_pickup: true,
  delivery_radius_km: 5,
  delivery_fee: 3.5,
  min_order_amount: 15,
  opening_hours: DEFAULT_HOURS,
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function SettingsPage() {
  const t = useT();
  const supabase = createClient();

  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"business" | "delivery" | "hours">(
    "business"
  );

  const fetchSettings = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (restaurant) {
      setSettings({
        id: restaurant.id,
        business_name: restaurant.business_name ?? "",
        description: restaurant.description ?? "",
        business_address: restaurant.business_address ?? "",
        phone: restaurant.phone ?? "",
        email: restaurant.email ?? "",
        slug: restaurant.slug ?? "",
        logo_url: restaurant.logo_url ?? "",
        accepts_delivery: restaurant.accepts_delivery ?? false,
        accepts_pickup: restaurant.accepts_pickup ?? true,
        delivery_radius_km: restaurant.delivery_radius_km ?? 5,
        delivery_fee: restaurant.delivery_fee ?? 3.5,
        min_order_amount: restaurant.min_order_amount ?? 15,
        opening_hours: restaurant.opening_hours ?? DEFAULT_HOURS,
      });
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings.id) return;
    setSaving(true);
    setSaveSuccess(false);

    const { id, ...updateData } = settings;

    const result = await updateRestaurant(id, updateData);

    if (!result.success) {
      alert("Failed to save settings");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const updateField = (field: keyof RestaurantSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateHours = (
    day: string,
    field: "open" | "close" | "closed",
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [field]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#b28a3c]" />
      </div>
    );
  }

  const tabs = [
    {
      key: "business" as const,
      label: "Business Info",
      icon: <Store className="h-4 w-4" />,
    },
    {
      key: "delivery" as const,
      label: "Delivery",
      icon: <Truck className="h-4 w-4" />,
    },
    {
      key: "hours" as const,
      label: "Opening Hours",
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
              <Settings className="h-3.5 w-3.5" />
              Configuration
            </div>

            <h1 className="premium-heading mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
              Restaurant Settings
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
              Configure your restaurant profile, delivery options, and operating
              hours. Changes are saved directly to your storefront.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            ✓ Settings saved successfully
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              activeTab === tab.key
                ? "border-[#173f35] bg-[#173f35] text-white"
                : "border-[#eadfce] bg-white text-[#5c6f68] hover:border-[#d8ccb9] hover:text-[#173f35]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Info Tab */}
      {activeTab === "business" && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-[#173f35]">
            Business Information
          </h2>
          <p className="mt-1 text-sm text-[#5c6f68]">
            This information is displayed on your public storefront.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                Business Name
              </label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => updateField("business_name", e.target.value)}
                className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                placeholder="Your Restaurant Name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                Description
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                placeholder="Tell customers about your restaurant..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.business_address}
                  onChange={(e) => updateField("business_address", e.target.value)}
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="Street, City, ZIP"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="hello@restaurant.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Storefront Slug
                </label>
                <div className="flex items-center gap-0">
                  <span className="rounded-l-[1rem] border border-r-0 border-[#d8ccb9] bg-[#faf6ee] px-3 py-3 text-sm text-[#5c6f68]">
                    speisely.de/
                  </span>
                  <input
                    type="text"
                    value={settings.slug}
                    onChange={(e) =>
                      updateField(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                      )
                    }
                    className="w-full rounded-r-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                    placeholder="your-restaurant"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Tab */}
      {activeTab === "delivery" && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-[#173f35]">
            Delivery Settings
          </h2>
          <p className="mt-1 text-sm text-[#5c6f68]">
            Configure delivery options for your customers.
          </p>

          <div className="mt-6 space-y-5">
            {/* Toggle delivery */}
            <div className="flex items-center justify-between rounded-[1rem] border border-[#eadfce] bg-[#faf6ee] px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#173f35]">
                  Enable Delivery
                </p>
                <p className="mt-0.5 text-xs text-[#5c6f68]">
                  Allow customers to order delivery from your restaurant
                </p>
              </div>
              <button
                onClick={() =>
                  updateField("accepts_delivery", !settings.accepts_delivery)
                }
                className="text-[#173f35]"
              >
                {settings.accepts_delivery ? (
                  <div className="flex h-7 w-12 items-center rounded-full bg-emerald-500 px-0.5 transition">
                    <div className="ml-auto h-6 w-6 rounded-full bg-white shadow-sm" />
                  </div>
                ) : (
                  <div className="flex h-7 w-12 items-center rounded-full bg-gray-300 px-0.5 transition">
                    <div className="h-6 w-6 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            </div>

            {settings.accepts_delivery && (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={settings.delivery_radius_km}
                    onChange={(e) =>
                      updateField(
                        "delivery_radius_km",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Delivery Fee (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={settings.delivery_fee}
                    onChange={(e) =>
                      updateField(
                        "delivery_fee",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Minimum Order (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={settings.min_order_amount}
                    onChange={(e) =>
                      updateField(
                        "min_order_amount",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  />
                </div>


              </div>
            )}
          </div>
        </div>
      )}

      {/* Opening Hours Tab */}
      {activeTab === "hours" && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-[#173f35]">
            Opening Hours
          </h2>
          <p className="mt-1 text-sm text-[#5c6f68]">
            Set your operating hours for each day of the week.
          </p>

          <div className="mt-6 space-y-3">
            {DAYS.map((day) => {
              const hours = settings.opening_hours[day] ?? {
                open: "09:00",
                close: "22:00",
                closed: false,
              };

              return (
                <div
                  key={day}
                  className={`flex items-center gap-4 rounded-[1rem] border px-5 py-4 transition ${
                    hours.closed
                      ? "border-[#eadfce] bg-[#faf6ee]/50 opacity-60"
                      : "border-[#eadfce] bg-white"
                  }`}
                >
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-semibold text-[#173f35]">
                      {capitalize(day)}
                    </p>
                  </div>

                  <button
                    onClick={() => updateHours(day, "closed", !hours.closed)}
                    className="shrink-0"
                  >
                    {hours.closed ? (
                      <div className="flex h-6 w-11 items-center rounded-full bg-gray-300 px-0.5">
                        <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-11 items-center rounded-full bg-emerald-500 px-0.5">
                        <div className="ml-auto h-5 w-5 rounded-full bg-white shadow-sm" />
                      </div>
                    )}
                  </button>

                  {hours.closed ? (
                    <span className="text-sm font-semibold text-[#5c6f68]">
                      Closed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          updateHours(day, "open", e.target.value)
                        }
                        className="rounded-[0.75rem] border border-[#d8ccb9] bg-white px-3 py-2 text-sm text-[#173f35] transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                      />
                      <span className="text-sm text-[#5c6f68]">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          updateHours(day, "close", e.target.value)
                        }
                        className="rounded-[0.75rem] border border-[#d8ccb9] bg-white px-3 py-2 text-sm text-[#173f35] transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27] disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
