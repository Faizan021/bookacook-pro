"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import {
  createRestaurantProduct,
  updateRestaurantProduct,
  deleteRestaurantProduct,
} from "@/lib/restaurant/actions";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  dietary_tags: string[];
  allergen_info: string | null;
  display_order: number;
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  image_url: string;
  dietary_tags: string[];
  allergen_info: string;
  display_order: number;
};

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  is_available: true,
  image_url: "",
  dietary_tags: [],
  allergen_info: "",
  display_order: 0,
};

function formatEuro(value: number) {
  return `€${value.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;
}

export default function MenuPage() {
  const t = useT();
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!restaurant) return;
    setRestaurantId(restaurant.id);

    const { data } = await supabase
      .from("restaurant_products")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    setProducts(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description ?? "",
      price: product.price.toString(),
      category: product.category ?? "",
      is_available: product.is_available,
      image_url: product.image_url ?? "",
      dietary_tags: product.dietary_tags ?? [],
      allergen_info: product.allergen_info ?? "",
      display_order: product.display_order ?? 0,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!restaurantId || !formData.name || !formData.price) return;
    setSaving(true);

    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category || null,
      is_available: formData.is_available,
      image_url: formData.image_url || null,
      dietary_tags: formData.dietary_tags,
      allergen_info: formData.allergen_info || null,
      display_order: formData.display_order,
    };

    if (editingProduct) {
      await updateRestaurantProduct(editingProduct.id, payload);
    } else {
      await createRestaurantProduct(restaurantId, payload);
    }

    setSaving(false);
    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteRestaurantProduct(id);
    setDeleting(null);
    fetchProducts();
  };

  const toggleAvailability = async (product: Product) => {
    await supabase
      .from("restaurant_products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#b28a3c]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
          <UtensilsCrossed className="h-3.5 w-3.5" />
          Menu Management
        </div>

        <h1 className="premium-heading mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
          Your Menu
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
          Add, edit, and manage your products. Toggle availability to control
          what&apos;s visible on your storefront.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5c6f68]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-[1rem] border border-[#d8ccb9] bg-white py-3 pl-10 pr-4 text-sm text-[#173f35] shadow-sm transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Product Count */}
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#eadfce] bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35] shadow-sm">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "Product" : "Products"}
        </span>
        {filterCategory !== "all" && (
          <button
            onClick={() => setFilterCategory("all")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5c6f68] transition hover:text-[#173f35]"
          >
            <X className="h-3 w-3" />
            Clear filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-[#d8ccb9] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#173f35]">
            No products found
          </h3>
          <p className="mt-2 text-sm text-[#5c6f68]">
            {searchQuery || filterCategory !== "all"
              ? "Try changing your search or filter."
              : "Add your first menu item to get started."}
          </p>
          {!searchQuery && filterCategory === "all" && (
            <button
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
            >
              <Plus className="h-4 w-4" />
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-[1.75rem] border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                product.is_available
                  ? "border-[#eadfce] hover:border-[#c99a3d]/40"
                  : "border-[#eadfce] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {product.category && (
                    <span className="mb-2 inline-block rounded-full border border-[#eadfce] bg-[#faf6ee] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a6d35]">
                      {product.category}
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-[#173f35]">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#5c6f68]">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#eadfce] pt-4">
                <p className="text-xl font-semibold tracking-tight text-[#173f35]">
                  {formatEuro(product.price)}
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleAvailability(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] text-[#5c6f68] transition hover:bg-[#faf6ee] hover:text-[#173f35]"
                    title={
                      product.is_available
                        ? "Mark unavailable"
                        : "Mark available"
                    }
                  >
                    {product.is_available ? (
                      <ToggleRight className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] text-[#5c6f68] transition hover:bg-[#faf6ee] hover:text-[#173f35]"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] text-[#5c6f68] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-xl md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#173f35]">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c6f68] transition hover:bg-[#faf6ee] hover:text-[#173f35]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="Describe the dish..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                    placeholder="12.50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                    placeholder="e.g., Pizza"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Dietary Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {["vegan", "vegetarian", "gluten-free", "halal", "dairy-free"].map((tag) => (
                    <label key={tag} className="flex items-center gap-2 rounded-full border border-[#d8ccb9] px-3 py-1.5 text-sm text-[#173f35] cursor-pointer hover:bg-[#faf6ee] transition">
                      <input
                        type="checkbox"
                        checked={formData.dietary_tags.includes(tag)}
                        onChange={(e) => {
                          const newTags = e.target.checked
                            ? [...formData.dietary_tags, tag]
                            : formData.dietary_tags.filter((t) => t !== tag);
                          setFormData({ ...formData, dietary_tags: newTags });
                        }}
                        className="rounded border-[#d8ccb9] text-[#b28a3c] focus:ring-[#b28a3c]"
                      />
                      <span className="capitalize">{tag.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Allergen Info
                </label>
                <input
                  type="text"
                  value={formData.allergen_info}
                  onChange={(e) =>
                    setFormData({ ...formData, allergen_info: e.target.value })
                  }
                  className="w-full rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm text-[#173f35] transition placeholder:text-[#5c6f68] focus:border-[#b28a3c] focus:outline-none focus:ring-1 focus:ring-[#b28a3c]/30"
                  placeholder="e.g., Contains nuts, dairy, soy"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[1rem] border border-[#eadfce] bg-[#faf6ee] px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_available: !formData.is_available,
                    })
                  }
                  className="text-[#173f35]"
                >
                  {formData.is_available ? (
                    <ToggleRight className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-[#5c6f68]" />
                  )}
                </button>
                <span className="text-sm font-semibold text-[#173f35]">
                  {formData.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#5c6f68] shadow-sm transition hover:bg-[#faf6ee]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.price}
                className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27] disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
