/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, startTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Play,
  Pause,
  Trash2,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import {
  createSurplusOffer,
  pauseSurplusOffer,
  resumeSurplusOffer,
  cancelSurplusOffer,
  getSurplusOffers,
} from "@/lib/restaurant/surplus.functions";

interface SurplusOffersSectionProps {
  restaurant: any;
}

export function SurplusOffersSection({ restaurant }: SurplusOffersSectionProps) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();

  // Server functions
  const fetchOffers = useServerFn(getSurplusOffers);
  const createOfferFn = useServerFn(createSurplusOffer);
  const pauseOfferFn = useServerFn(pauseSurplusOffer);
  const resumeOfferFn = useServerFn(resumeSurplusOffer);
  const cancelOfferFn = useServerFn(cancelSurplusOffer);

  // Queries
  const { data: offersData, isLoading } = useQuery({
    queryKey: ["restaurant", "surplus-offers"],
    queryFn: () => fetchOffers(),
  });

  // State
  const [offerType, setOfferType] = useState<"single" | "magic_bag">("single");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [magicBagValueCents, setMagicBagValueCents] = useState<number>(1500); // Default €15.00 original value
  const [surplusPriceCents, setSurplusPriceCents] = useState<number>(0);
  const [initialQuantity, setInitialQuantity] = useState<number>(5);

  // Set default times (start now, end in 2 hours)
  const [startTime, setStartTime] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState<string>(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [fulfillmentMode, setFulfillmentMode] = useState<"pickup" | "delivery_eligible">("pickup");

  // Get active menu items
  const products = restaurant?.restaurant_products || [];
  const selectedProduct = products.find((p: any) => p.id === selectedProductId);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (variables: any) => createOfferFn({ data: variables }),
    onSuccess: () => {
      toast.success(tt("Angebot erfolgreich erstellt!", "Offer created successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant", "surplus-offers"] });
      // Reset form
      setSelectedProductId("");
      setSurplusPriceCents(0);
      setInitialQuantity(5);
      setMagicBagValueCents(1500);
    },
    onError: (err: any) => {
      toast.error(err.message || tt("Fehler beim Erstellen des Angebots", "Error creating offer"));
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (variables: { offerId: string }) => pauseOfferFn({ data: variables }),
    onSuccess: () => {
      toast.success(tt("Angebot pausiert", "Offer paused"));
      qc.invalidateQueries({ queryKey: ["restaurant", "surplus-offers"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (variables: { offerId: string }) => resumeOfferFn({ data: variables }),
    onSuccess: () => {
      toast.success(tt("Angebot fortgesetzt", "Offer resumed"));
      qc.invalidateQueries({ queryKey: ["restaurant", "surplus-offers"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (variables: { offerId: string }) => cancelOfferFn({ data: variables }),
    onSuccess: () => {
      toast.success(tt("Angebot beendet", "Offer cancelled"));
      qc.invalidateQueries({ queryKey: ["restaurant", "surplus-offers"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // Calculate stats
  const offersList = offersData?.offers || [];
  const totalOffersCount = offersList.length;

  const portionsSold = offersList.reduce((sum: number, o: any) => {
    return sum + (o.initial_quantity - o.current_quantity);
  }, 0);

  const recoveredRevenue = offersList.reduce((sum: number, o: any) => {
    const sold = o.initial_quantity - o.current_quantity;
    return sum + sold * (o.surplus_price_cents / 100);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerType === "single" && !selectedProductId) {
      toast.error(tt("Bitte wählen Sie ein Produkt aus.", "Please select a product."));
      return;
    }
    if (offerType === "magic_bag" && magicBagValueCents <= 0) {
      toast.error(tt("Bitte geben Sie einen gültigen geschätzten Originalwert ein.", "Please enter a valid estimated original value."));
      return;
    }
    if (surplusPriceCents <= 0) {
      toast.error(tt("Bitte geben Sie einen gültigen Preis ein.", "Please enter a valid price."));
      return;
    }

    const originalPriceCents = offerType === "single"
      ? (selectedProduct?.price_cents || 0)
      : magicBagValueCents;

    const maxSurplusPriceCents = Math.floor(originalPriceCents * 0.5);
    if (surplusPriceCents > maxSurplusPriceCents) {
      toast.error(tt("Der Angebotspreis darf maximal 50% des Originalpreises betragen.", "The surplus price must be at least a 50% discount from the original price."));
      return;
    }

    // Convert local dateTime values back to UTC ISO format for backend
    const utcStart = new Date(startTime).toISOString();
    const utcEnd = new Date(endTime).toISOString();

    createMutation.mutate({
      menuItemId: offerType === "single" ? selectedProductId : undefined,
      isMagicBag: offerType === "magic_bag",
      magicBagOriginalPriceCents: offerType === "magic_bag" ? magicBagValueCents : undefined,
      surplusPriceCents,
      initialQuantity,
      startTime: utcStart,
      endTime: utcEnd,
      fulfillmentMode,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles =
      {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
        scheduled: "bg-blue-50 text-blue-700 border-blue-200/50",
        paused: "bg-amber-50 text-amber-700 border-amber-200/50",
        sold_out: "bg-purple-50 text-purple-700 border-purple-200/50",
        expired: "bg-gray-100 text-gray-700 border-gray-200",
        cancelled: "bg-rose-50 text-rose-700 border-rose-200/50",
      }[status] || "bg-gray-50 text-gray-700 border-gray-200";

    const labels =
      {
        active: tt("Aktiv", "Active"),
        scheduled: tt("Geplant", "Scheduled"),
        paused: tt("Pausiert", "Paused"),
        sold_out: tt("Ausverkauft", "Sold Out"),
        expired: tt("Abgelaufen", "Expired"),
        cancelled: tt("Storniert", "Cancelled"),
      }[status] || status;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}
      >
        {labels}
      </span>
    );
  };

  return (
    <div className="space-y-8 p-1">
      {/* Naming explanation header */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-2">
        <h2 className="font-display text-lg font-bold text-forest">
          {tt("Chef-Angebote (Überschuss-Rettung)", "Chef's Specials (Surplus Recovery)")}
        </h2>
        <p className="text-sm text-forest/80 leading-relaxed">
          {tt(
            "Verkaufen Sie überschüssige, frisch zubereitete Speisen am Ende des Tages als zeitlich begrenzte Sonderangebote direkt auf Ihrer Storefront. Retten Sie Lebensmittel vor der Verschwendung, gewinnen Sie neue Kunden und decken Sie Ihre Zutatenkosten.",
            "Sell surplus, freshly prepared meals at the end of the day as time-limited special offers directly on your storefront. Save food from going to waste, attract new customers, and recover your ingredient costs."
          )}
        </p>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-forest/60">
                {tt("Gerettete Portionen", "Surplus Portions Sold")}
              </p>
              <h3 className="text-2xl font-bold font-display mt-0.5">{portionsSold}</h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-forest/60">
                {tt("Geretteter Umsatz", "Recovered Revenue")}
              </p>
              <h3 className="text-2xl font-bold font-display mt-0.5">
                €{recoveredRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-forest/60">
                {tt("Erstellte Angebote", "Total Offers Created")}
              </p>
              <h3 className="text-2xl font-bold font-display mt-0.5">{totalOffersCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="lg:col-span-1 rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-[#e2e8e4] pb-4">
            <Sparkles className="h-5 w-5 text-forest" />
            <h2 className="font-display text-lg font-bold">
              {tt("Neues Angebot erstellen", "Create Surplus Offer")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Offer Type selector */}
            <div className="space-y-1.5">
              <Label>{tt("Angebots-Typ", "Offer Type")}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setOfferType("single");
                      setSurplusPriceCents(0);
                    });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    offerType === "single"
                      ? "bg-forest text-cream border-forest"
                      : "bg-cream/10 text-forest border-[#e2e8e4] hover:bg-cream/30"
                  }`}
                >
                  {tt("Einzelnes Produkt", "Menu Item")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setOfferType("magic_bag");
                      setSurplusPriceCents(Math.floor(magicBagValueCents * 0.5));
                    });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    offerType === "magic_bag"
                      ? "bg-forest text-cream border-forest"
                      : "bg-cream/10 text-forest border-[#e2e8e4] hover:bg-cream/30"
                  }`}
                >
                  {tt("Überraschungstüte", "Magic Bag")}
                </button>
              </div>
            </div>

            {offerType === "single" ? (
              <div className="space-y-1.5">
                <Label>{tt("Menü-Artikel", "Menu Item")}</Label>
                <Select
                  value={selectedProductId}
                  onValueChange={(val) => {
                    startTransition(() => {
                      setSelectedProductId(val);
                      const p = products.find((prod: any) => prod.id === val);
                      if (p) {
                        // Pre-fill with a default 50% discount suggestion
                        setSurplusPriceCents(Math.floor(p.price_cents * 0.5));
                      }
                    });
                  }}
                >
                  <SelectTrigger className="w-full bg-cream/10 border-[#e2e8e4]">
                    <SelectValue placeholder={tt("Artikel auswählen...", "Select item...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (€{(p.price_cents / 100).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProduct && (
                  <div className="p-3.5 bg-cream/30 rounded-xl border border-[#e2e8e4] text-xs space-y-1.5 mt-2">
                    <div className="flex justify-between text-forest/70">
                      <span>{tt("Originalpreis", "Original Price")}:</span>
                      <span className="font-semibold">
                        €{(selectedProduct.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-forest/70">
                      <span>
                        {tt("Max. erlaubter Angebotspreis (50% Rabatt)", "Max offer price (50% off)")}:
                      </span>
                      <span className="font-semibold text-rose-600">
                        €{(selectedProduct.price_cents / 200).toFixed(2)}
                      </span>
                    </div>
                    {/* Quick discount buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[#e2e8e4]/50">
                      {[50, 60, 70].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            const price = Math.floor(selectedProduct.price_cents * (1 - pct / 100));
                            setSurplusPriceCents(price);
                          }}
                          className="px-2 py-1 bg-forest/10 hover:bg-forest/20 text-forest rounded-lg text-xs font-semibold transition-colors"
                        >
                          -{pct}% Off
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>{tt("Schätzwert Originalpreis (€)", "Est. Original Value (€)")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="15.00"
                    value={magicBagValueCents ? (magicBagValueCents / 100).toFixed(2) : ""}
                    onChange={(e) => {
                      const val = Math.round(parseFloat(e.target.value) * 100) || 0;
                      setMagicBagValueCents(val);
                      // Auto-update price if custom value was set
                      setSurplusPriceCents(Math.floor(val * 0.5));
                    }}
                    className="bg-cream/10 border-[#e2e8e4]"
                  />
                </div>

                <div className="p-3.5 bg-cream/30 rounded-xl border border-[#e2e8e4] text-xs space-y-1.5">
                  <div className="flex justify-between text-forest/70">
                    <span>{tt("Max. erlaubter Angebotspreis (50% Rabatt)", "Max offer price (50% off)")}:</span>
                    <span className="font-semibold text-rose-600">
                      €{(magicBagValueCents / 200).toFixed(2)}
                    </span>
                  </div>
                  {/* Quick discount buttons */}
                  <div className="flex gap-2 pt-2 border-t border-[#e2e8e4]/50">
                    {[50, 60, 70].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          const price = Math.floor(magicBagValueCents * (1 - pct / 100));
                          setSurplusPriceCents(price);
                        }}
                        className="px-2 py-1 bg-forest/10 hover:bg-forest/20 text-forest rounded-lg text-xs font-semibold transition-colors"
                      >
                        -{pct}% Off
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Price input field with validation feedback */}
            <div className="space-y-1.5">
              <Label>{tt("Angebotspreis (€)", "Surplus Price (€)")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={surplusPriceCents ? (surplusPriceCents / 100).toFixed(2) : ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSurplusPriceCents(isNaN(val) ? 0 : Math.round(val * 100));
                }}
                className="bg-cream/10 border-[#e2e8e4]"
              />
              {(() => {
                const originalPriceCents = offerType === "single"
                  ? (selectedProduct?.price_cents || 0)
                  : magicBagValueCents;
                const maxSurplusPriceCents = Math.floor(originalPriceCents * 0.5);
                const isPriceInvalid = surplusPriceCents > maxSurplusPriceCents && originalPriceCents > 0;

                if (isPriceInvalid) {
                  return (
                    <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      {tt(
                        `Der Rabatt muss mindestens 50% betragen (Maximalpreis: €${(maxSurplusPriceCents / 100).toFixed(2)})`,
                        `Discount must be at least 50% (Max price: €${(maxSurplusPriceCents / 100).toFixed(2)})`
                      )}
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            <div className="space-y-1.5">
              <Label>{tt("Anzahl Portionen", "Portion Quantity")}</Label>
              <Input
                type="number"
                min="1"
                step="1"
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(parseInt(e.target.value) || 0)}
                className="bg-cream/10 border-[#e2e8e4]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{tt("Startzeit", "Start Time")}</Label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-cream/10 border-[#e2e8e4]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{tt("Endzeit", "End Time")}</Label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-cream/10 border-[#e2e8e4]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{tt("Fulfillment-Modus", "Fulfillment Mode")}</Label>
              <Select value={fulfillmentMode} onValueChange={(val: any) => setFulfillmentMode(val)}>
                <SelectTrigger className="w-full bg-cream/10 border-[#e2e8e4]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">{tt("Nur Abholung", "Pickup Only")}</SelectItem>
                  <SelectItem value="delivery_eligible">
                    {tt("Lieferung berechtigt", "Delivery Eligible")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(() => {
              const originalPriceCents = offerType === "single"
                ? (selectedProduct?.price_cents || 0)
                : magicBagValueCents;
              const maxSurplusPriceCents = Math.floor(originalPriceCents * 0.5);
              const isPriceInvalid = surplusPriceCents > maxSurplusPriceCents && originalPriceCents > 0;
              const isDisabled = createMutation.isPending || isPriceInvalid || surplusPriceCents <= 0 || (offerType === "single" && !selectedProductId);

              return (
                <Button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full mt-4 bg-forest hover:bg-forest/90 text-cream font-medium"
                >
                  {createMutation.isPending
                    ? tt("Wird erstellt...", "Creating...")
                    : tt("Angebot aktivieren", "Activate Offer")}
                </Button>
              );
            })()}
          </form>
        </div>

        {/* Offers Queue Table */}
        <div className="lg:col-span-2 rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#e2e8e4] pb-4">
            <h2 className="font-display text-lg font-bold">
              {tt("Angebote Queue", "Offers Queue")}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
            </div>
          ) : offersList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#e2e8e4] rounded-2xl text-forest/50 text-sm space-y-2">
              <AlertTriangle className="h-8 w-8 text-forest/30" />
              <p>{tt("Keine Angebote vorhanden", "No offers found")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8e4] text-left text-forest/60 font-semibold">
                    <th className="pb-3 pr-4">{tt("Menü-Artikel", "Item Name")}</th>
                    <th className="pb-3 pr-4">{tt("Preis", "Price")}</th>
                    <th className="pb-3 pr-4">{tt("Menge", "Stock")}</th>
                    <th className="pb-3 pr-4">{tt("Zeitfenster", "Time Window")}</th>
                    <th className="pb-3 pr-4">{tt("Status", "Status")}</th>
                    <th className="pb-3 text-right">{tt("Aktionen", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8e4]/50">
                  {offersList.map((off: any) => {
                    const formatTime = (iso: string) => {
                      const d = new Date(iso);
                      return d.toLocaleTimeString(lang === "de" ? "de-DE" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    };

                    const originalPrice = (off.original_price_cents / 100).toFixed(2);
                    const surplusPrice = (off.surplus_price_cents / 100).toFixed(2);

                    return (
                      <tr key={off.id} className="group hover:bg-cream/10 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-forest">
                          {off.item_name}
                          <div className="text-xs text-forest/50 font-normal">
                            {off.fulfillment_mode === "pickup"
                              ? tt("Abholung", "Pickup")
                              : tt("Lieferung", "Delivery")}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="font-semibold text-emerald-700">€{surplusPrice}</span>
                          <span className="text-xs text-forest/40 line-through ml-1.5">
                            €{originalPrice}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="font-semibold">{off.current_quantity}</span>
                          <span className="text-xs text-forest/40">/{off.initial_quantity}</span>
                        </td>
                        <td className="py-4 pr-4 text-xs text-forest/80">
                          {formatTime(off.start_time)} - {formatTime(off.end_time)}
                        </td>
                        <td className="py-4 pr-4">{getStatusBadge(off.status)}</td>
                        <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                          {off.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-[#e2e8e4] text-forest hover:bg-forest/5"
                                onClick={() => pauseMutation.mutate({ offerId: off.id })}
                                disabled={pauseMutation.isPending}
                              >
                                <Pause className="h-3.5 w-3.5 mr-1" />
                                {tt("Pause", "Pause")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                                onClick={() => cancelMutation.mutate({ offerId: off.id })}
                                disabled={cancelMutation.isPending}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                {tt("Stopp", "Stop")}
                              </Button>
                            </>
                          )}
                          {off.status === "paused" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-[#e2e8e4] text-forest hover:bg-forest/5"
                                onClick={() => resumeMutation.mutate({ offerId: off.id })}
                                disabled={resumeMutation.isPending}
                              >
                                <Play className="h-3.5 w-3.5 mr-1" />
                                {tt("Start", "Resume")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                                onClick={() => cancelMutation.mutate({ offerId: off.id })}
                                disabled={cancelMutation.isPending}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                {tt("Stopp", "Stop")}
                              </Button>
                            </>
                          )}
                          {off.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                              onClick={() => cancelMutation.mutate({ offerId: off.id })}
                              disabled={cancelMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              {tt("Löschen", "Cancel")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
