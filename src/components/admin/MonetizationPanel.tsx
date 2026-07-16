/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
  Star,
  Radio,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

type ListingRole = "restaurant" | "caterer" | "planner";

interface MonetizationListing {
  id: string;
  name: string;
  city: string;
  is_published: boolean;
  is_featured: boolean;
  is_sponsored: boolean;
  effective_sponsored: boolean;
  sponsored_expired: boolean;
  indexability_override: "index" | "noindex" | "default";
  ranking_boost: number;
  campaign_window_start: string | null;
  campaign_window_end: string | null;
  seasonal_boost_tags: string[] | null;
}

interface FeaturedSlotLimit {
  id: string;
  role: ListingRole;
  city_slug: string;
  event_type: string;
  max_slots: number;
}

interface MonetizationPanelProps {
  mutateVisibility: (args: any) => Promise<any>;
  mutateBoost: (args: any) => Promise<any>;
  mutateSlotLimit: (args: any) => Promise<any>;
  fetchListings: (args: any) => Promise<MonetizationListing[]>;
  fetchSlotLimits: () => Promise<FeaturedSlotLimit[]>;
}

export function MonetizationPanel({
  mutateVisibility,
  mutateBoost,
  mutateSlotLimit,
  fetchListings,
  fetchSlotLimits,
}: MonetizationPanelProps) {
  const [role, setRole] = useState<ListingRole>("caterer");
  const [listings, setListings] = useState<MonetizationListing[]>([]);
  const [slotLimits, setSlotLimits] = useState<FeaturedSlotLimit[]>([]);
  const [loading, setLoading] = useState(false);

  // Slot limits panel B state
  const [newLimit, setNewLimit] = useState({
    role: "caterer" as ListingRole,
    city_slug: "",
    event_type: "",
    max_slots: 3,
  });

  // Ranking boost per-listing state
  const [boostInputs, setBoostInputs] = useState<
    Record<string, { value: string; reason: string; open: boolean }>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [l, sl] = await Promise.all([fetchListings({ role }), fetchSlotLimits()]);
      setListings(l);
      setSlotLimits(sl);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [role, fetchListings, fetchSlotLimits]);

  useEffect(() => {
    load();
  }, [load]);

  const handleVisibility = async (
    listing: MonetizationListing,
    fields: Partial<MonetizationListing>,
    reason?: string,
  ) => {
    try {
      await mutateVisibility({ listingType: role, listingId: listing.id, fields, reason });
      toast.success("Updated");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleBoostSave = async (listingId: string) => {
    const state = boostInputs[listingId];
    if (!state) return;
    const val = parseFloat(state.value);
    if (isNaN(val)) {
      toast.error("Invalid boost value");
      return;
    }
    try {
      await mutateBoost({ listingType: role, listingId, ranking_boost: val, reason: state.reason });
      toast.success("Ranking boost saved");
      setBoostInputs((prev) => ({ ...prev, [listingId]: { ...prev[listingId], open: false } }));
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpsertSlotLimit = async () => {
    try {
      await mutateSlotLimit(newLimit);
      toast.success("Slot limit saved");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const indexabilityColors: Record<string, string> = {
    default: "bg-gray-100 text-gray-600",
    index: "bg-green-100 text-green-700",
    noindex: "bg-red-100 text-red-700",
  };

  return (
    <div className="mt-8 space-y-6">
      {/* ── Panel Header ── */}
      <div className="flex items-center gap-3 px-1">
        <Shield className="w-5 h-5 text-amber-600" />
        <h3 className="text-base font-bold text-gray-900">Monetization Controls</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Admin only
        </span>
      </div>

      {/* ── Role filter ── */}
      <div className="flex gap-2">
        {(["restaurant", "caterer", "planner"] as ListingRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              role === r ? "bg-forest text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}s
          </button>
        ))}
      </div>

      {/* ── Panel A: Listing Controls ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-800">
            Panel A — Listing Visibility & Promotion
          </span>
          {loading && <span className="text-xs text-gray-400 animate-pulse">Loading…</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Sponsored</th>
                <th className="px-4 py-3 text-center">Indexability</th>
                <th className="px-4 py-3 text-left">Campaign window</th>
                <th className="px-4 py-3 text-left">Seasonal tags</th>
                <th className="px-4 py-3 text-center">Boost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-400">
                    {loading ? "Loading listings…" : "No listings found."}
                  </td>
                </tr>
              )}
              {listings.map((l) => {
                const bi = boostInputs[l.id] ?? {
                  value: String(l.ranking_boost ?? 1.0),
                  reason: "",
                  open: false,
                };
                return (
                  <tr key={l.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {l.name}
                      {!l.is_published && (
                        <span className="ml-2 text-xs text-gray-400">(unpublished)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{l.city}</td>

                    {/* Featured toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        title={
                          !l.is_published ? "Cannot feature unpublished listing" : "Toggle featured"
                        }
                        disabled={!l.is_published && !l.is_featured}
                        onClick={() => handleVisibility(l, { is_featured: !l.is_featured })}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                          l.is_featured
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-500 hover:bg-amber-50"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        <Star className="w-3 h-3" />
                        {l.is_featured ? "Featured" : "Off"}
                      </button>
                    </td>

                    {/* Sponsored toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleVisibility(l, { is_sponsored: !l.is_sponsored })}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                          l.effective_sponsored
                            ? "bg-blue-100 text-blue-700"
                            : l.sponsored_expired
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-100 text-gray-500 hover:bg-blue-50"
                        }`}
                      >
                        <Radio className="w-3 h-3" />
                        {l.effective_sponsored
                          ? "Sponsored"
                          : l.sponsored_expired
                            ? "Expired"
                            : "Off"}
                      </button>
                    </td>

                    {/* Indexability dropdown */}
                    <td className="px-4 py-3 text-center">
                      <select
                        value={l.indexability_override}
                        onChange={(e) =>
                          handleVisibility(l, {
                            indexability_override: e.target.value as
                              | "index"
                              | "noindex"
                              | "default",
                          })
                        }
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${
                          indexabilityColors[l.indexability_override]
                        }`}
                      >
                        <option value="default">Default</option>
                        <option value="index">Index</option>
                        <option value="noindex">Noindex</option>
                      </select>
                    </td>

                    {/* Campaign window */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <input
                          type="date"
                          className="border border-gray-200 rounded px-1 py-0.5 text-xs"
                          value={l.campaign_window_start?.slice(0, 10) ?? ""}
                          onChange={(e) =>
                            handleVisibility(l, { campaign_window_start: e.target.value || null })
                          }
                        />
                        <span>→</span>
                        <input
                          type="date"
                          className="border border-gray-200 rounded px-1 py-0.5 text-xs"
                          value={l.campaign_window_end?.slice(0, 10) ?? ""}
                          onChange={(e) =>
                            handleVisibility(l, { campaign_window_end: e.target.value || null })
                          }
                        />
                      </div>
                    </td>

                    {/* Seasonal tags */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          className="border border-gray-200 rounded px-1.5 py-0.5 text-xs w-28"
                          placeholder="tag1, tag2"
                          defaultValue={(l.seasonal_boost_tags ?? []).join(", ")}
                          onBlur={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            handleVisibility(l, { seasonal_boost_tags: tags });
                          }}
                        />
                      </div>
                    </td>

                    {/* Ranking boost — advanced override accordion */}
                    <td className="px-4 py-3 text-center">
                      <div className="inline-block text-left">
                        <button
                          onClick={() =>
                            setBoostInputs((prev) => ({
                              ...prev,
                              [l.id]: { ...bi, open: !bi.open },
                            }))
                          }
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition"
                        >
                          <TrendingUp className="w-3 h-3" />
                          {l.ranking_boost?.toFixed(2) ?? "1.00"}
                          {bi.open ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                        {bi.open && (
                          <div className="mt-2 p-3 border border-amber-200 rounded-xl bg-amber-50 space-y-2 min-w-[200px] shadow-sm">
                            <p className="text-xs text-amber-700 font-medium">
                              ⚠ Exception tool — use sparingly
                            </p>
                            <input
                              type="number"
                              min={0.8}
                              max={1.5}
                              step={0.05}
                              value={bi.value}
                              onChange={(e) =>
                                setBoostInputs((prev) => ({
                                  ...prev,
                                  [l.id]: { ...bi, value: e.target.value },
                                }))
                              }
                              className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Reason (required)"
                              value={bi.reason}
                              onChange={(e) =>
                                setBoostInputs((prev) => ({
                                  ...prev,
                                  [l.id]: { ...bi, reason: e.target.value },
                                }))
                              }
                              className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                            />
                            <button
                              disabled={!bi.reason.trim()}
                              onClick={() => handleBoostSave(l.id)}
                              className="w-full bg-forest text-white text-xs py-1 rounded-lg disabled:opacity-40"
                            >
                              Save override
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Panel B: Featured Slot Limits ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <span className="font-semibold text-sm text-gray-800">
            Panel B — Featured Slot Limits
          </span>
          <p className="text-xs text-gray-400 mt-0.5">
            Controls how many "Featured" listings are allowed per city/event-type. Scarcity protects
            the badge's value.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Existing limits */}
          {slotLimits.length > 0 && (
            <table className="w-full text-xs">
              <thead className="text-gray-400 uppercase tracking-wide">
                <tr>
                  <th className="text-left py-1">Role</th>
                  <th className="text-left py-1">City slug</th>
                  <th className="text-left py-1">Event type</th>
                  <th className="text-left py-1">Max slots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {slotLimits.map((sl) => (
                  <tr key={sl.id}>
                    <td className="py-1.5 capitalize text-gray-700">{sl.role}</td>
                    <td className="py-1.5 text-gray-600">{sl.city_slug}</td>
                    <td className="py-1.5 text-gray-600">
                      {sl.event_type === "__city__" ? (
                        <span className="italic text-gray-400">City-wide</span>
                      ) : (
                        sl.event_type
                      )}
                    </td>
                    <td className="py-1.5 font-medium text-gray-800">{sl.max_slots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Add / update limit */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 font-medium mb-2">Add or update a limit</p>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={newLimit.role}
                onChange={(e) =>
                  setNewLimit((p) => ({ ...p, role: e.target.value as ListingRole }))
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
              >
                <option value="restaurant">Restaurant</option>
                <option value="caterer">Caterer</option>
                <option value="planner">Planner</option>
              </select>
              <input
                type="text"
                placeholder="city-slug (e.g. berlin)"
                value={newLimit.city_slug}
                onChange={(e) => setNewLimit((p) => ({ ...p, city_slug: e.target.value }))}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-40"
              />
              <input
                type="text"
                placeholder="event-type (blank = city-wide)"
                value={newLimit.event_type}
                onChange={(e) => setNewLimit((p) => ({ ...p, event_type: e.target.value }))}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-44"
              />
              <input
                type="number"
                min={1}
                max={20}
                value={newLimit.max_slots}
                onChange={(e) =>
                  setNewLimit((p) => ({ ...p, max_slots: parseInt(e.target.value) || 3 }))
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-20"
              />
              <button
                onClick={handleUpsertSlotLimit}
                disabled={!newLimit.city_slug.trim()}
                className="bg-forest text-white text-xs px-4 py-1.5 rounded-lg disabled:opacity-40"
              >
                Save limit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
