import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState, useEffect } from "react";
import { trackEvent } from "@/utils/posthog";
import {
  MapPin,
  Star,
  Clock,
  Plus,
  Minus,
  ArrowLeft,
  Phone,
  ShoppingBag,
  Check,
  Calendar,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { CategoryNav } from "@/components/ui/CategoryNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/I18nProvider";
import { getRestaurant } from "@/data/restaurants";
import { supabase } from "@/integrations/supabase/client";
import { upsertConsentRecord } from "@/lib/consent.functions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createTableReservation,
  getRestaurantBySlug,
  submitStorefrontOrder,
  validatePromoCode,
} from "@/lib/restaurant/public.functions";
import { useServerFn } from "@tanstack/react-start";
import { UnifiedCustomerFields } from "@/components/UnifiedCustomerFields";
import { recordPageView } from "@/lib/vendor/analytics.functions";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";
import { getPublicRestaurantReviews } from "@/lib/reviews/public.functions";

const searchSchema = z.object({
  order_success: z.string().optional(),
  order_cancel: z.string().optional(),
  claimable: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
});

export const Route = createFileRoute("/restaurant/$slug")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async ({ params }) => {
    let dbRestaurant = null;
    let reviewsData = null;
    try {
      const res = await getRestaurantBySlug({ data: { slug: params.slug } });
      dbRestaurant = res.restaurant;
      if (dbRestaurant) {
        reviewsData = await getPublicRestaurantReviews({ data: { restaurantId: dbRestaurant.id } });
      }
    } catch (e) {
      console.error("Error loading restaurant db record", e);
    }
    const fullRestaurant = await getRestaurant(params.slug);
    if (!fullRestaurant) {
      throw notFound();
    }
    return { dbRestaurant, fullRestaurant, reviewsData };
  },
  head: ({ loaderData, params }) => {
    const r = loaderData?.fullRestaurant;
    const cuisineType = r?.tags?.join(", ") ?? "";
    const city = r?.area ?? "Deutschland";
    const rawDesc = r
      ? `Bestelle direkt bei ${r.name} in ${city} – ohne Provision, ohne Umwege. ${cuisineType} Küche auf Speisely.`
      : "Restaurant auf Speisely – direkt bestellen ohne Provision.";
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "..." : rawDesc;
    const title = r
      ? `${r.name} – Online Bestellen in ${city} | Speisely`
      : "Restaurant – Online Bestellen | Speisely";
    const ogImage = r?.img ?? "https://speisely.de/og-default.jpg";
    const canonicalUrl = `https://speisely.de/restaurant/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: r ? `${r.name} – Speisely` : title },
        {
          property: "og:description",
          content: r ? `Jetzt direkt bei ${r.name} in ${city} bestellen.` : description,
        },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: r
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Restaurant",
                name: r.name,
                image: r.img || "https://speisely.de/og-default.jpg",
                description: description,
                url: canonicalUrl,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: r.area,
                  addressCountry: "DE",
                },
                servesCuisine: r.tags?.[0] ?? "",
                ...(loaderData?.reviewsData?.aggregates?.count &&
                loaderData.reviewsData.aggregates.count > 0
                  ? {
                      aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: loaderData.reviewsData.aggregates.avgOverall,
                        reviewCount: loaderData.reviewsData.aggregates.count,
                      },
                    }
                  : {}),
              }),
            },
          ]
        : undefined,
    };
  },
  component: RestaurantPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-display text-forest">Restaurant nicht gefunden</h1>
        <Link to="/instant-order" className="mt-6 inline-block text-forest underline">
          Zurück zu Sofort bestellen
        </Link>
      </div>
    </SiteShell>
  ),
});

function RestaurantPage() {
  const { slug } = Route.useParams();
  const { order_success, claimable, email, name: customerName } = Route.useSearch();
  const { lang } = useI18n();
  const loaderData = Route.useLoaderData() as any;
  const { dbRestaurant, fullRestaurant, reviewsData } = loaderData;
  const isGated = useMemo(() => {
    if (!dbRestaurant) return false;
    // Only gate ordering if NO payment method is available at all
    const hasStripe = dbRestaurant.stripe_connect_status === "connected";
    const acceptsCash = dbRestaurant.accepts_cash === true;
    const acceptsPaypal = dbRestaurant.accepts_paypal === true && !!dbRestaurant.paypal_email;
    return !(hasStripe || acceptsCash || acceptsPaypal);
  }, [dbRestaurant]);
  const restaurant = useMemo(() => {
    if (!fullRestaurant) return null;
    return {
      ...fullRestaurant,
      certifications: dbRestaurant?.certifications || (fullRestaurant as any).certifications || "",
    };
  }, [fullRestaurant, dbRestaurant]);

  const storefrontUrl = dbRestaurant?.custom_domain
    ? `https://${dbRestaurant.custom_domain}`
    : `https://${dbRestaurant?.slug || slug}.speisely.de`;

  const [cart, setCart] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>("all");
  
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    restaurant?.menu?.forEach((item: any) => {
      if (Array.isArray(item.dietary)) {
        item.dietary.forEach((tag: string) => {
          if (tag && tag.trim()) {
            tagsSet.add(tag.trim());
          }
        });
      }
    });
    return Array.from(tagsSet);
  }, [restaurant]);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountCents: number;
    freeDelivery: boolean;
    type: string;
    value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const validatePromoFn = useServerFn(validatePromoCode);
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "paypal" | "stripe" | null>(null);

  const [claimPassword, setClaimPassword] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  async function handleClaimAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !claimPassword) return;
    setClaimLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: claimPassword,
        options: {
          data: {
            full_name: customerName || "Customer",
          }
        }
      });
      if (error) throw error;
      setClaimSuccess(true);
    } catch (err: any) {
      alert(t("Fehler bei der Registrierung: ", "Failed to claim account: ") + (err.message || err));
    } finally {
      setClaimLoading(false);
    }
  }

  // Derive which payment methods this restaurant supports
  const paymentMethods = useMemo(
    () => ({
      cash: (dbRestaurant as any)?.accepts_cash === true,
      paypal: (dbRestaurant as any)?.accepts_paypal === true,
      stripe: dbRestaurant?.stripe_connect_status === "connected",
    }),
    [dbRestaurant],
  );

  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const recordView = useServerFn(recordPageView);
  const checkoutFn = useServerFn(submitStorefrontOrder);
  const upsertConsentFn = useServerFn(upsertConsentRecord);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [infoCorrect, setInfoCorrect] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setUserRole(data?.role || "customer");
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setUserRole(data?.role || "customer");
          });
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (restaurant?.id) {
      recordView({
        data: { vendorId: restaurant.id, vendorType: "restaurant", url: window.location.pathname },
      }).catch((e) => console.error("Tracking error", e));
    }
  }, [restaurant?.id]);

  useEffect(() => {
    const isOwner = dbRestaurant && currentUser && currentUser.id === dbRestaurant.owner_id;
    if (currentUser && userRole === "customer" && !isOwner) {
      setCheckoutIdentity((prev) => ({
        ...prev,
        email: prev.email || currentUser.email || "",
        name: prev.name || currentUser.user_metadata?.full_name || "",
        phone: prev.phone || currentUser.user_metadata?.phone || prev.phone || "",
      }));
    }
  }, [currentUser, userRole, dbRestaurant]);

  const [resModalOpen, setResModalOpen] = useState(false);
  const [identity, setIdentity] = useState({
    name: "",
    email: "",
    phone: "",
    marketingOptIn: false,
    termsAccepted: false,
  });
  const [resForm, setResForm] = useState({
    guestCount: 2,
    reservationDate: "",
    reservationTime: "19:00",
    notes: "",
  });
  const [checkoutIdentity, setCheckoutIdentity] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryAddress: "",
  });
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [resLoading, setResLoading] = useState(false);
  const [resSuccess, setResSuccess] = useState(false);
  const [resError, setResError] = useState("");

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  // If DB record exists and is not published, show friendly Coming Soon page
  if (dbRestaurant && !dbRestaurant.is_published) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center space-y-6">
          <div className="text-6xl">🏪</div>
          <h1 className="text-4xl font-display text-forest font-bold">
            {t("Demnächst verfügbar", "Coming Soon")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Dieser Speisely-Storefront befindet sich derzeit im Aufbau oder ist vorübergehend pausiert. Schauen Sie bald wieder vorbei!",
              "This Speisely storefront is currently under construction or temporarily paused. Check back soon!",
            )}
          </p>
          <Link
            to="/instant-order"
            className="inline-block mt-4 rounded-full bg-forest text-white px-6 py-3 font-semibold shadow-md hover:bg-forest/90 transition-colors"
          >
            {t("Entdecken Sie andere Restaurants", "Explore other restaurants")}
          </Link>
        </div>
      </SiteShell>
    );
  }

  const downloadIcsFile = () => {
    if (!restaurant) return;
    const { guestCount, reservationDate, reservationTime } = resForm;
    const { name } = identity;
    // Format date and time for ICS (e.g. 2026-06-17 and 19:00 -> 20260617T190000)
    const dateStr = reservationDate.replace(/-/g, "");
    const timeStr = reservationTime.replace(/:/g, "") + "00";
    const startDateTime = `${dateStr}T${timeStr}`;

    // Default duration 2 hours
    const [hours, minutes] = reservationTime.split(":").map(Number);
    const endHours = (hours + 2) % 24;
    const endHoursStr = String(endHours).padStart(2, "0");
    const endMinutesStr = String(minutes).padStart(2, "0");
    let endDateStr = dateStr;
    if (endHours < hours) {
      const d = new Date(reservationDate);
      d.setDate(d.getDate() + 1);
      endDateStr = d.toISOString().split("T")[0].replace(/-/g, "");
    }
    const endDateTime = `${endDateStr}T${endHoursStr}${endMinutesStr}00`;

    const summary = `Reservation at ${restaurant.name}`;
    const description = `Table reservation for ${guestCount} guest(s) under the name ${name}.`;
    const location = restaurant.address;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Speisely//Reservation Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `reservation_${restaurant.name.toLowerCase().replace(/\s+/g, "_")}.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.termsAccepted) {
      setResError(
        t(
          "Bitte akzeptieren Sie die Reservierungsbedingungen.",
          "Please accept the reservation terms.",
        ),
      );
      return;
    }
    setResLoading(true);
    setResError("");
    try {
      // Split name for legacy payload
      const [firstName, ...rest] = identity.name.trim().split(" ");
      const lastName = rest.join(" ") || " ";

      // 2. Submit Reservation
      if (dbRestaurant) {
        await createTableReservation({
          data: {
            restaurantId: restaurant!.id,
            locale: lang,
            firstName,
            lastName,
            email: identity.email,
            phone: identity.phone,
            guestCount: resForm.guestCount,
            reservationDate: resForm.reservationDate,
            reservationTime: resForm.reservationTime,
            notes: resForm.notes,
          },
        });
      } else {
        // Mock submission for static data
        await new Promise((res) => setTimeout(res, 800));
      }

      trackEvent("reservation_submitted", { restaurantId: restaurant!.id, type: "table" });
      setResSuccess(true);
      // Wait a moment then show the ICS download automatically or provide a button
    } catch (err: any) {
      setResError(err.message);
    } finally {
      setResLoading(false);
    }
  };

  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const reviews = reviewsData?.reviews || [];
  const aggregates = reviewsData?.aggregates;
  if (!restaurant) return null;

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: string[] = [];
    restaurant.menu.forEach((m: any) => {
      const c = m.category || "Menu";
      if (!seen.has(c)) {
        seen.add(c);
        cats.push(c);
      }
    });
    return cats;
  }, [restaurant]);

  const certBadges = useMemo(() => {
    if (!restaurant?.certifications) return [];
    return String(restaurant.certifications)
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
  }, [restaurant?.certifications]);

  const maxBadges = 5;
  const visibleBadges = certBadges.slice(0, maxBadges);
  const remainingCount = certBadges.length - maxBadges;

  const add = (name: string) => setCart((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
  const remove = (name: string) =>
    setCart((c) => {
      const next = { ...c };
      if (!next[name]) return next;
      next[name] -= 1;
      if (next[name] <= 0) delete next[name];
      return next;
    });

  const cartItems = Object.entries(cart).map(([name, qty]) => {
    const item = restaurant.menu.find((m: any) => m.name === name)!;
    return { ...item, qty };
  });
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const handleApplyPromo = async () => {
    setPromoError("");
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);

    try {
      const itemsPayload = Object.entries(cart)
        .map(([name, quantity]) => {
          const item = restaurant.menu.find((m: any) => m.name === name);
          return item?.id ? { productId: item.id, quantity } : null;
        })
        .filter(Boolean) as { productId: string; quantity: number }[];
      if (itemsPayload.length === 0) {
        setPromoError(t("Dein Warenkorb ist leer", "Your cart is empty"));
        setPromoLoading(false);
        return;
      }

      const res = await validatePromoFn({
        data: {
          restaurantId: dbRestaurant.id,
          promoCode: promoCodeInput.trim(),
          items: itemsPayload,
        },
      });
      if (res.success) {
        setAppliedPromo({
          code: res.code!,
          discountCents: res.discountCents!,
          freeDelivery: res.freeDelivery!,
          type: res.discount_type!,
          value: res.discount_value!,
        });
        setPromoCodeInput("");
      } else {
        setPromoError(res.error || t("Ungültiger Code", "Invalid code"));
      }
    } catch (e) {
      setPromoError(t("Fehler bei der Validierung", "Error validating code"));
    } finally {
      setPromoLoading(false);
    }
  };
  const handleRemovePromo = () => setAppliedPromo(null);

  let deliveryFee = parseFloat(restaurant.fee.replace("€", ""));
  if (appliedPromo?.freeDelivery) {
    deliveryFee = 0;
  }
  const subtotal = total;
  const discountAmount = appliedPromo ? appliedPromo.discountCents / 100 : 0;

  const finalTotal = subtotal - discountAmount + deliveryFee;

  const renderSidebar = (isMobile = false) => (
    <>
      {!isMobile && (
        <div className="flex items-center gap-2 text-forest">
          <ShoppingBag className="h-5 w-5" />
          <h3 className="font-display text-xl">{t("Deine Bestellung", "Your order")}</h3>
        </div>
      )}
      {isGated && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200 text-left font-medium">
          ⚠️{" "}
          {t(
            "Dieses Restaurant nimmt zurzeit keine Bestellungen entgegen.",
            "This restaurant is not taking orders at the moment.",
          )}
        </div>
      )}
      {cartItems.length === 0 ? (
        <>
          <p className="mt-4 text-sm text-forest/40 italic">
            {t(
              "👆 Füge Gerichte hinzu, um deine Bestellung zu starten",
              "👆 Add dishes to start your order",
            )}
          </p>
          <button
            disabled
            className="mt-5 w-full rounded-full bg-[#86EFAC]/50 text-white py-3 font-semibold shadow-md cursor-not-allowed"
          >
            {t("Zur Kasse", "Go to checkout")}
          </button>
        </>
      ) : (
        <>
          <div className="mt-3 p-2.5 bg-[#fdfaf5] border border-[#eadfce]/75 rounded-xl flex items-center justify-between text-left">
            <span className="text-[10px] font-bold text-forest/50 uppercase tracking-wider">
              {t("Zahlungsmethoden:", "Accepted Payments:")}
            </span>
            <div className="flex gap-1.5 items-center">
              {paymentMethods.cash && (
                <span title={t("Barzahlung", "Cash")} className="text-sm">💶</span>
              )}
              {paymentMethods.paypal && (
                <span title="PayPal" className="text-[8px] font-black text-[#003087] bg-blue-50 px-1 py-0.5 rounded border border-blue-200 leading-none">PayPal</span>
              )}
              {paymentMethods.stripe && (
                <span title={t("Kreditkarte", "Credit Card")} className="text-sm">💳</span>
              )}
            </div>
          </div>

          <div className="mt-3 mb-2 bg-[#fdfaf5] border border-[#eadfce] rounded-xl p-3 shadow-sm">
            <div className="flex items-center bg-white rounded-lg border border-[#eadfce]/60 p-1 mb-3 shadow-sm">
              <button
                type="button"
                onClick={() => setScheduleMode("now")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  scheduleMode === "now"
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "text-forest/60 hover:bg-[#eadfce]/30 hover:text-forest"
                }`}
              >
                {t("Jetzt", "ASAP")}
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode("later")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  scheduleMode === "later"
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "text-forest/60 hover:bg-[#eadfce]/30 hover:text-forest"
                }`}
              >
                {t("Später planen", "Schedule")}
              </button>
            </div>
            {scheduleMode === "later" && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-md border border-[#eadfce] bg-white px-2 py-1.5 text-xs text-forest focus:outline-none focus:border-[#10b981]"
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-md border border-[#eadfce] bg-white px-2 py-1.5 text-xs text-forest focus:outline-none focus:border-[#10b981]"
                />
              </div>
            )}
          </div>
          <div className="mt-2 divide-y divide-[oklch(0.85_0.05_152)]">
            {cartItems.map((i) => (
              <div key={i.name} className="py-3 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                <span className="h-6 min-w-6 px-2 grid place-items-center rounded-full bg-[oklch(0.88_0.06_152)] text-forest text-xs font-semibold">
                  {i.qty}
                </span>
                <span className="text-sm text-forest truncate">{i.name}</span>
                <span className="text-sm font-medium text-forest">
                  €{(i.price * i.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Zwischensumme", "Subtotal")}</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Liefergebühr", "Delivery fee")}</span>
            <span>{restaurant.fee}</span>
          </div>

          {appliedPromo ? (
            <div className="mt-3 flex items-center justify-between text-sm text-[oklch(0.55_0.15_30)] bg-[oklch(0.95_0.05_30)] p-2.5 rounded-lg border border-[oklch(0.85_0.15_30)]">
              <div className="flex flex-col">
                <span className="font-semibold">
                  {t("Gutschein", "Voucher")}: {appliedPromo.code}
                </span>
                <span className="text-xs">
                  {appliedPromo.type === "percentage"
                    ? `-${appliedPromo.value}%`
                    : appliedPromo.type === "free_delivery"
                      ? t("Kostenlose Lieferung", "Free delivery")
                      : `-€${appliedPromo.value.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">-€{discountAmount.toFixed(2)}</span>
                <button
                  onClick={handleRemovePromo}
                  className="text-[oklch(0.55_0.15_30)] hover:text-black"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("Promo Code", "Promo code")}
                  value={promoCodeInput}
                  disabled={isGated}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-1.5 text-sm focus:border-forest focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={isGated}
                  className="rounded-md bg-[#eadfce] px-3 py-1.5 text-sm font-semibold text-forest hover:bg-[#eadfce]/80 whitespace-nowrap disabled:opacity-50"
                >
                  {t("Einlösen", "Apply")}
                </button>
              </div>
              {promoError && <p className="mt-1 text-xs text-red-500">{promoError}</p>}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-base font-semibold text-forest border-t border-[oklch(0.85_0.05_152)] pt-4">
            <span>{t("Gesamt", "Total")}</span>
            <span>€{finalTotal.toFixed(2)}</span>
          </div>

          {/* ─── CUSTOMER DETAILS ─── */}
          <div className="mt-4 pt-4 border-t border-[oklch(0.85_0.05_152)] space-y-3">
            <p className="text-xs font-semibold text-forest/60 uppercase tracking-wide">
              {t("Ihre Daten", "Your Details")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrderType("pickup")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  orderType === "pickup"
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "bg-[#eadfce]/30 text-forest/60 hover:bg-[#eadfce]/50"
                }`}
              >
                {t("Abholung", "Pickup")}
              </button>
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  orderType === "delivery"
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "bg-[#eadfce]/30 text-forest/60 hover:bg-[#eadfce]/50"
                }`}
              >
                {t("Lieferung", "Delivery")}
              </button>
            </div>
            <input
              type="text"
              required
              placeholder={t("Name *", "Name *")}
              value={checkoutIdentity.name}
              onChange={(e) => setCheckoutIdentity({ ...checkoutIdentity, name: e.target.value })}
              className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-2 text-sm focus:border-forest focus:outline-none"
            />
            <input
              type="tel"
              required
              placeholder={t("Telefon *", "Phone *")}
              value={checkoutIdentity.phone}
              onChange={(e) => setCheckoutIdentity({ ...checkoutIdentity, phone: e.target.value })}
              className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-2 text-sm focus:border-forest focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder={t("Email *", "Email *")}
              value={checkoutIdentity.email}
              onChange={(e) => setCheckoutIdentity({ ...checkoutIdentity, email: e.target.value })}
              className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-2 text-sm focus:border-forest focus:outline-none"
            />
            {orderType === "delivery" && (
              <input
                type="text"
                required
                placeholder={t("Lieferadresse *", "Delivery Address *")}
                value={checkoutIdentity.deliveryAddress}
                onChange={(e) =>
                  setCheckoutIdentity({ ...checkoutIdentity, deliveryAddress: e.target.value })
                }
                className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-2 text-sm focus:border-forest focus:outline-none"
              />
            )}
             <input
              type="text"
              placeholder={t("Notizen (optional)", "Notes (optional)")}
              value={checkoutNotes}
              onChange={(e) => setCheckoutNotes(e.target.value)}
              className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-2 text-sm focus:border-forest focus:outline-none"
            />
            
            {/* Consent & Opt-ins Checkboxes */}
            <div className="space-y-2 mt-3 pt-2 border-t border-[oklch(0.85_0.05_152)]/30 text-left">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
                />
                <span className="text-[11px] text-forest/75 leading-snug">
                  {t(
                    "Ich stimme zu, dass meine Daten zur Bearbeitung der Bestellung verarbeitet werden (Double Opt-In). *",
                    "I consent to having my data processed to handle my order (Double Opt-in). *"
                  )}
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
                />
                <span className="text-[11px] text-forest/75 leading-snug">
                  {t(
                    "Ich möchte E-Mails über Angebote und Rabatte erhalten (Optional).",
                    "I would like to receive emails about offers and discounts (Optional)."
                  )}
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={infoCorrect}
                  onChange={(e) => setInfoCorrect(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
                />
                <span className="text-[11px] text-forest/75 leading-snug">
                  {t(
                    "Ich bestätige, dass alle von mir gemachten Angaben korrekt sind. *",
                    "I confirm that all information provided is correct. *"
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* ─── PAYMENT METHODS ─── */}
          {!isGated && (
            <div className="mt-4 pt-4 border-t border-[oklch(0.85_0.05_152)] space-y-2">
              <p className="text-xs font-semibold text-forest/60 uppercase tracking-wide">
                {t("Bezahlen mit:", "Pay with:")}
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.cash && (
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("cash")}
                    className={`flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-bold transition-all ${
                      selectedPayment === "cash"
                        ? "border-forest bg-forest text-white shadow"
                        : "border-[#aac4aa] bg-white text-forest hover:border-forest"
                    }`}
                  >
                    <span>💶</span> {t("BAR", "CASH")}
                  </button>
                )}
                {paymentMethods.paypal && (
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("paypal")}
                    className={`flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-bold transition-all ${
                      selectedPayment === "paypal"
                        ? "border-[#003087] bg-[#003087] text-white shadow"
                        : "border-[#009cde] bg-white text-[#003087] hover:border-[#003087]"
                    }`}
                  >
                    <span className="font-black text-sm">P</span> PAYPAL
                  </button>
                )}
                {paymentMethods.stripe && (
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("stripe")}
                    className={`flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-bold transition-all ${
                      selectedPayment === "stripe"
                        ? "border-[#6772e5] bg-[#6772e5] text-white shadow"
                        : "border-[#aab7c4] bg-white text-[#6772e5] hover:border-[#6772e5]"
                    }`}
                  >
                    <span>💳</span> {t("KREDITKARTE", "CREDIT CARD")}
                  </button>
                )}
              </div>
              {selectedPayment === "paypal" && (
                <p className="text-[10px] text-muted-foreground">
                  {t(
                    "Nach der Bestellung werden Sie zu PayPal weitergeleitet.",
                    "After placing your order you'll be redirected to PayPal.",
                  )}
                </p>
              )}
            </div>
          )}

          <button
            onClick={async () => {
              if (isGated || checkoutLoading) return;
              
              if (currentUser && userRole !== "customer") {
                setAuthPopupOpen(true);
                return;
              }

              if (!checkoutIdentity.name || !checkoutIdentity.phone) {
                alert(
                  t(
                    "Bitte füllen Sie Name und Telefonnummer aus.",
                    "Please fill out your name and phone number.",
                  ),
                );
                return;
              }
              if (!checkoutIdentity.email) {
                alert(
                  t(
                    "Bitte füllen Sie Ihre E-Mail-Adresse aus.",
                    "Please fill out your email address."
                  )
                );
                return;
              }
              if (orderType === "delivery" && !checkoutIdentity.deliveryAddress) {
                alert(
                  t("Bitte geben Sie eine Lieferadresse ein.", "Please enter a delivery address."),
                );
                return;
              }
              if (!termsAccepted) {
                alert(
                  t(
                    "Bitte akzeptieren Sie die Datenverarbeitung (Double Opt-In).",
                    "Please accept the data processing consent (Double Opt-in)."
                  )
                );
                return;
              }
              if (!infoCorrect) {
                alert(
                  t(
                    "Bitte bestätigen Sie, dass alle Ihre Angaben korrekt sind.",
                    "Please confirm that all your details are correct."
                  )
                );
                return;
              }
              if (!selectedPayment) {
                alert(
                  t("Bitte wählen Sie eine Zahlungsmethode.", "Please select a payment method."),
                );
                return;
              }

              setCheckoutLoading(true);
              try {
                // Upsert customer consent in parallel/background
                await upsertConsentFn({
                  data: {
                    email: checkoutIdentity.email || currentUser?.email || "",
                    audience_type: "customer",
                    marketing_opt_in: marketingAccepted,
                    terms_acknowledged: termsAccepted,
                    source: "storefront_checkout",
                    source_detail: slug,
                    user_id: currentUser?.id,
                  }
                }).catch(e => console.error("Error saving consent", e));

                const itemsPayload = cartItems.map((i) => ({ productId: i.id, quantity: i.qty }));
                const res = await checkoutFn({
                  data: {
                    restaurantId: dbRestaurant?.id ?? "",
                    slug: slug,
                    origin: window.location.origin,
                    paymentMethod: selectedPayment,
                    orderType: orderType,
                    items: itemsPayload,
                    promoCode: appliedPromo?.code,
                    customerName: checkoutIdentity.name,
                    customerPhone: checkoutIdentity.phone,
                    customerEmail: checkoutIdentity.email,
                    deliveryAddress:
                      orderType === "delivery" ? checkoutIdentity.deliveryAddress : undefined,
                    notes: checkoutNotes || undefined,
                    marketingConsent: marketingAccepted,
                  },
                });

                const successQuery = `?order_success=true&claimable=${res?.accountClaimable ? "true" : "false"}&email=${encodeURIComponent(checkoutIdentity.email)}&name=${encodeURIComponent(checkoutIdentity.name)}`;
                
                setCart({});
                if (isMobile) setMobileCartOpen(false);

                if (selectedPayment === "stripe") {
                  if (res?.url) {
                    window.location.href = res.url;
                  } else {
                    alert(
                      t(
                        "Fehler beim Erstellen der Zahlungssitzung.",
                        "Failed to create checkout session.",
                      ),
                    );
                  }
                } else if (selectedPayment === "paypal") {
                  if (res?.url) {
                    window.open(res.url, "_blank");
                  }
                  window.location.href = window.location.origin + window.location.pathname + successQuery;
                } else {
                  // Cash
                  window.location.href = window.location.origin + window.location.pathname + successQuery;
                }
              } catch (err: any) {
                alert(t("Fehler: ", "Error: ") + (err.message || err));
              } finally {
                setCheckoutLoading(false);
              }
            }}
            disabled={isGated || checkoutLoading}
            className={`mt-5 w-full rounded-full py-3 font-semibold shadow-md transition ${
              isGated || checkoutLoading
                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                : "bg-[#22C55E] hover:bg-[#22C55E]/90 text-white cursor-pointer"
            }`}
          >
            {checkoutLoading
              ? t("Wird geladen...", "Loading...")
              : `${t("Zur Kasse", "Go to checkout")} • €${finalTotal.toFixed(2)}`}
          </button>
        </>
      )}
    </>
  );

  if (order_success === "true") {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="bg-white border border-[#eadfce] rounded-2xl p-8 shadow-sm space-y-6 text-left">
            <div className="text-center space-y-2">
              <span className="text-5xl">🎉</span>
              <h1 className="text-3xl font-display font-bold text-forest mt-2">
                {t("Bestellung erfolgreich aufgegeben!", "Order placed successfully!")}
              </h1>
              <p className="text-sm text-forest/70 max-w-md mx-auto">
                {t(
                  `Vielen Dank für Ihre Bestellung bei ${restaurant?.name || "uns"}! Die Küche bereitet Ihre Speisen frisch zu.`,
                  `Thank you for your order at ${restaurant?.name || "us"}! The kitchen is preparing your fresh dishes.`
                )}
              </p>
            </div>

            {/* Account Claiming Section */}
            {claimable === "true" && email && (
              <div className="mt-8 p-6 bg-muted/40 border border-border rounded-xl space-y-4 text-left animate-in fade-in duration-300">
                {claimSuccess ? (
                  <div className="text-center py-4 space-y-2">
                    <span className="text-3xl">🛡️</span>
                    <h4 className="text-base font-bold text-foreground">
                      {t("Konto erfolgreich aktiviert!", "Account successfully claimed!")}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "Sie sind nun registriert. Sie können sich ab sofort mit Ihrem Passwort anmelden, um Bestellungen zu verfolgen.",
                        "You are now registered. You can log in using your password to track future orders."
                      )}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleClaimAccount} className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {t("Speisely-Konto aktivieren 🌟", "Claim your Speisely Account 🌟")}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(
                          `Für Ihre E-Mail (${email}) wurde ein CRM-Profil angelegt. Setzen Sie jetzt ein Passwort, um Ihr Konto zu aktivieren und Ihre Bestellungen zu speichern!`,
                          `A CRM profile has been created for your email (${email}). Set a password below to claim your account and save your order history!`
                        )}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="password"
                        required
                        placeholder={t("Passwort wählen *", "Choose a password *")}
                        value={claimPassword}
                        onChange={(e) => setClaimPassword(e.target.value)}
                        className="w-full rounded-md border border-[oklch(0.85_0.05_152)] bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={claimLoading}
                      className="w-full rounded-full bg-forest text-white py-2.5 text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {claimLoading
                        ? t("Wird aktiviert...", "Activating...")
                        : t("Konto jetzt aktivieren", "Activate Account Now")}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-center">
              <Link
                to="/restaurant/$slug"
                params={{ slug }}
                className="inline-flex items-center gap-2 rounded-full bg-[#eadfce] px-6 py-2.5 text-sm font-semibold text-forest hover:bg-[#eadfce]/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> {t("Zurück zum Restaurant", "Back to restaurant")}
              </Link>
            </div>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <AnnouncementBanner
        isActive={restaurant.announcement_active ?? false}
        text={restaurant.announcement_text ?? null}
        bgColor={restaurant.announcement_bg_color ?? null}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8">
        <Link
          to="/instant-order"
          className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4" /> {t("Zurück zu Restaurants", "Back to restaurants")}
        </Link>

        {/* Redesigned Full-Width Hero Banner */}
        <div className="relative mt-6 w-full h-[300px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={restaurant.img}
            alt={restaurant.name}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 30%" }}
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={420}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 sm:gap-3">
            <span className="rounded-full bg-[#10b981] px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-md flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {t("GEPRÜFT", "CHECKED")}
            </span>
            <button
              onClick={scrollToMenu}
              className="group flex items-center gap-1.5 rounded-full bg-[#10b981] hover:bg-[#10b981]/90 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              {restaurant.status === "Open"
                ? t("Zur Speisekarte", "See Menu")
                : t("Vorbestellen", "Pre-order")}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Dialog
              open={resModalOpen}
              onOpenChange={(open) => {
                setResModalOpen(open);
                if (open) {
                  trackEvent("reservation_form_started", { restaurantId: restaurant!.id });
                } else {
                  setResSuccess(false);
                  setResForm({
                    guestCount: 2,
                    reservationDate: "",
                    reservationTime: "19:00",
                    notes: "",
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <button className="group flex items-center gap-1.5 rounded-full border border-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer">
                  {t("Tisch Reservieren", "Book a Table")}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#fdfaf5] text-forest border-[#eadfce]">
                <DialogHeader>
                  <DialogTitle>
                    {t("Tisch reservieren bei ", "Book a table at ")}
                    {restaurant.name}
                  </DialogTitle>
                </DialogHeader>

                {resSuccess ? (
                  <div className="py-8 text-center text-forest flex flex-col items-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#22C55E]/10 text-[#22C55E] grid place-items-center">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-forest">
                      {t("Reservierung bestätigt!", "Reservation Confirmed!")}
                    </h3>
                    <p className="mt-2 text-sm text-forest/70 max-w-sm px-4">
                      {t(
                        "Ihre Reservierung wurde erfolgreich bestätigt. Wir freuen uns auf Ihren Besuch!",
                        "Your reservation has been successfully confirmed. We look forward to your visit!",
                      )}
                    </p>

                    <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={downloadIcsFile}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white py-2.5 px-4 font-bold text-sm hover:opacity-90 transition cursor-pointer"
                      >
                        <Calendar className="h-4 w-4" />
                        {t("In den Kalender eintragen", "Add to Calendar")}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResModalOpen(false);
                          setResSuccess(false);
                          setResForm({
                            guestCount: 2,
                            reservationDate: "",
                            reservationTime: "19:00",
                            notes: "",
                          });
                        }}
                        className="rounded-full border border-forest bg-transparent hover:bg-forest/5 py-2.5 px-4 font-bold text-sm text-forest transition cursor-pointer"
                      >
                        {t("Schließen", "Close")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="grid gap-4 mt-4">
                    {resError && <p className="text-sm text-red-600">{resError}</p>}

                    <UnifiedCustomerFields
                      value={identity}
                      onChange={(fields) => setIdentity({ ...identity, ...fields })}
                    />

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[oklch(0.85_0.05_152)]">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">{t("Personen", "Guests")} *</label>
                        <input
                          required
                          type="number"
                          min="1"
                          max="20"
                          className="w-full rounded-md border border-[#eadfce] bg-white px-3 py-2 text-sm"
                          value={resForm.guestCount}
                          onChange={(e) =>
                            setResForm({ ...resForm, guestCount: parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">{t("Datum", "Date")} *</label>
                        <input
                          required
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full rounded-md border border-[#eadfce] bg-white px-3 py-2 text-sm"
                          value={resForm.reservationDate}
                          onChange={(e) =>
                            setResForm({ ...resForm, reservationDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">{t("Uhrzeit", "Time")} *</label>
                        <input
                          required
                          type="time"
                          className="w-full rounded-md border border-[#eadfce] bg-white px-3 py-2 text-sm"
                          value={resForm.reservationTime}
                          onChange={(e) =>
                            setResForm({ ...resForm, reservationTime: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {t("Besondere Wünsche (Optional)", "Notes (Optional)")}
                      </label>
                      <textarea
                        className="w-full rounded-md border border-[#eadfce] bg-white px-3 py-2 text-sm min-h-[60px]"
                        value={resForm.notes}
                        onChange={(e) => setResForm({ ...resForm, notes: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resLoading}
                      className="mt-2 w-full rounded-full bg-forest py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {resLoading ? "..." : t("Reservierung anfragen", "Request Reservation")}
                    </button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white z-20 flex items-center gap-4 w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt="Logo"
                className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md bg-white object-cover flex-shrink-0"
              />
            )}
            <div className="flex flex-col gap-1 max-w-[80%] text-left">
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight drop-shadow-sm">
                {restaurant.name}
              </h1>
              {restaurant.id && (
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-mint hover:text-white transition-colors mt-0.5 font-semibold drop-shadow-sm w-fit"
                >
                  <Globe className="h-4 w-4" />
                  {t("Direkt-Storefront öffnen ↗", "Open Direct Storefront ↗")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Trust & Info Bar */}
        <div className="mt-6 mb-2 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-5 bg-white rounded-xl border border-[#eadfce] shadow-sm">
          <dl className="flex flex-wrap items-center gap-x-6 gap-y-4 m-0">
            <div className="flex items-center gap-2 text-forest">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-bold">{t("Geprüftes Profil", "Checked Profile")}</span>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Zahlungsarten", "Payments")}
              </dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-2 m-0 mt-0.5">
                {paymentMethods.cash && (
                  <span title={t("Barzahlung", "Cash")} className="cursor-help text-base">💶</span>
                )}
                {paymentMethods.paypal && (
                  <span title="PayPal" className="cursor-help text-xs font-black text-[#003087] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">PayPal</span>
                )}
                {paymentMethods.stripe && (
                  <span title={t("Kreditkarte", "Credit Card")} className="cursor-help text-base">💳</span>
                )}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Lieferung", "Delivery")}
              </dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <ShoppingBag className="h-4 w-4 text-forest/40" /> {restaurant.fee}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Dauer", "Time")}
              </dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Clock className="h-4 w-4 text-forest/40" /> {restaurant.time}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Standort", "Location")}
              </dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <MapPin className="h-4 w-4 text-forest/40" />{" "}
                <span className="truncate max-w-[200px]">{restaurant.address}</span>
              </dd>
            </div>
          </dl>

          {visibleBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 md:pt-0 border-t border-[#eadfce] md:border-0 w-full md:w-auto">
              {visibleBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fdfaf5] px-3 py-1 text-xs font-semibold text-forest border border-[#eadfce]"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-forest" /> {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* About Text */}
        {restaurant.about && restaurant.about[lang] && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {t(`Über ${restaurant.name}`, `About ${restaurant.name}`)}
            </h2>
            <p className="text-base text-forest/80 max-w-3xl leading-relaxed">
              {restaurant.about[lang]}
            </p>
          </div>
        )}
      </section>

      <section
        id="menu"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12 grid gap-8 lg:grid-cols-[1fr_22rem] pb-16 scroll-mt-24"
      >
        <div>
          <h2 className="text-3xl font-display font-bold text-forest">
            {t("Speisekarte", "Menu")}
          </h2>

          {availableTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "rounded-full bg-[#b28a3c] text-[#16372f] px-4 py-1.5 text-xs font-semibold shadow-sm"
                    : "rounded-full bg-[#eadfce]/60 text-[#16372f] px-4 py-1.5 text-xs font-medium border border-[#16372f]/15 hover:bg-[#eadfce]"
                }
              >
                {t("Alle", "All")}
              </button>
              {availableTags.map((tag) => {
                const active = filter.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilter(tag)}
                    className={
                      active
                        ? "rounded-full bg-[#b28a3c] text-[#16372f] px-4 py-1.5 text-xs font-semibold shadow-sm"
                        : "rounded-full bg-[#eadfce]/60 text-[#16372f] px-4 py-1.5 text-xs font-medium border border-[#16372f]/15 hover:bg-[#eadfce]"
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          <CategoryNav
            categories={categories}
            onSelect={(cat) => {
              document
                .getElementById(`category-${cat}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />

          <div className="mt-8 space-y-10">
            {categories.map((cat) => {
              const items = restaurant.menu.filter(
                (m: any) =>
                  (m.category || "Menu") === cat &&
                  (filter === "all" || (m.dietary ?? []).some((tag: string) => tag.toLowerCase() === filter.toLowerCase())),
              );
              if (items.length === 0) return null;
              return (
                <div key={cat} id={`category-${cat}`} className="scroll-mt-32">
                  <h3 className="font-display text-2xl text-forest">{cat}</h3>
                  <div className="mt-4 grid gap-4">
                    {items.map((m: any) => {
                      const qty = cart[m.name] || 0;
                      return (
                        <div
                          key={m.name}
                          className="grid grid-cols-[1fr_auto] gap-4 p-5 bg-white border border-[#eadfce] rounded-xl shadow-sm hover:shadow-md hover:border-forest/30 transition-all duration-300 group"
                        >
                          <div className="min-w-0 flex flex-col md:flex-row gap-4">
                            {m.img && (
                              <div className="shrink-0">
                                <img
                                  src={m.img}
                                  alt={m.name}
                                  loading="lazy"
                                  className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover border border-[#eadfce]/50"
                                />
                              </div>
                            )}
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-display text-lg font-bold text-forest">
                                  {m.name}
                                </h4>
                                {(m.dietary ?? []).map((d: any) => (
                                  <span
                                    key={d}
                                    className="inline-flex items-center rounded-full bg-[#fdfaf5] text-[#16372f] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border border-[#eadfce]/60"
                                    title={d}
                                  >
                                    {d === "vegan" ? "🌱 Vegan" : d === "vegetarian" ? "V" : "GF"}
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm text-forest/70 mt-1 leading-relaxed max-w-xl">
                                {m.desc[lang]}
                              </p>
                              <p className="mt-3 text-lg font-bold text-forest">
                                €{m.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {qty === 0 ? (
                              <button
                                onClick={() => add(m.name)}
                                className="h-10 w-10 grid place-items-center rounded-full bg-forest text-[oklch(0.97_0.02_92)] hover:opacity-90 pulse-btn shadow-md"
                                aria-label={t("Hinzufügen", "Add")}
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-3 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-1.5 h-10 shadow-md">
                                <button
                                  onClick={() => remove(m.name)}
                                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10"
                                  aria-label="-"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[1ch] text-sm font-semibold">{qty}</span>
                                <button
                                  onClick={() => add(m.name)}
                                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10 pulse-btn"
                                  aria-label="+"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Sidebar Section */}
        <aside id="sidebar-section" className="hidden lg:block h-fit sticky top-24 w-full">
          <div className="bg-white rounded-2xl border border-[#eadfce] shadow-xl shadow-forest/5 p-6 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            {renderSidebar()}
            <div className="mt-6 flex flex-col gap-2 pt-6 border-t border-[#eadfce]/60">
              <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
                <ShieldCheck className="h-4 w-4 text-forest" />
                {t("100% sichere Bestellung über Speisely", "100% secure order via Speisely")}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                {t("Schnelle Lieferung", "Fast delivery")}
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Process Section */}
      <section className="bg-[#fdfaf5] border-y border-[#eadfce]/50 py-16 mt-8 mb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-display font-bold text-forest text-center mb-10">
            {t("So einfach funktioniert's", "How it works")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-forest/10" />
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-forest mb-4 z-10">
                1
              </div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Auswählen", "Choose")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">
                {t(
                  "Leckere Gerichte aus der Speisekarte aussuchen.",
                  "Select delicious dishes from the menu.",
                )}
              </p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-forest mb-4 z-10">
                2
              </div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Bestellen", "Order")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">
                {t("Bequem und sicher online bezahlen.", "Pay conveniently and securely online.")}
              </p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-forest mb-4 z-10">
                3
              </div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Genießen", "Enjoy")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">
                {t(
                  "Entspannen und auf die schnelle Lieferung warten.",
                  "Relax and wait for the fast delivery.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eadfce] p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between pb-safe">
          <div className="text-forest">
            <div className="font-semibold text-sm">
              {totalCount} {totalCount === 1 ? t("Artikel", "Item") : t("Artikel", "Items")}
            </div>
            <div className="text-xs text-forest/70">
              {t("Gesamt", "Total")}: €{finalTotal.toFixed(2)}
            </div>
          </div>
          <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
            <SheetTrigger asChild>
              <button className="rounded-full bg-[#22C55E] text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[#22C55E]/90 transition cursor-pointer">
                {t("Bestellung anzeigen", "View order")}
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] bg-[#fdfaf5] text-forest border-t border-[#eadfce] rounded-t-2xl px-4 py-6 overflow-y-auto"
            >
              <SheetHeader className="text-left mb-4">
                <SheetTitle className="flex items-center gap-2 font-display text-xl text-forest">
                  <ShoppingBag className="h-5 w-5 text-forest" />
                  {t("Deine Bestellung", "Your order")}
                </SheetTitle>
              </SheetHeader>
              <div className="py-2 pb-10">{renderSidebar(true)}</div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Reviews Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mb-16">
        <h2 className="text-2xl font-display font-bold text-forest mb-8">
          {t("Bewertungen", "Reviews")}
        </h2>

        {aggregates && aggregates.count > 0 ? (
          <div className="grid lg:grid-cols-[300px_1fr] gap-10">
            <div className="bg-[#fdfaf5] p-6 rounded-2xl border border-[#eadfce]/50 h-fit">
              <div className="flex items-end gap-3 mb-4">
                <div className="text-5xl font-bold text-forest">
                  {aggregates.avgOverall.toFixed(1)}
                </div>
                <div className="text-forest/70 pb-1">/ 5</div>
              </div>
              <div className="flex text-yellow-400 mb-2 text-xl">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    fill={i < Math.round(aggregates.avgOverall) ? "currentColor" : "none"}
                    className="w-5 h-5"
                  />
                ))}
              </div>
              <div className="text-sm text-forest/70 mb-6">
                {aggregates.count}{" "}
                {aggregates.count === 1 ? t("Bewertung", "Review") : t("Bewertungen", "Reviews")}
              </div>

              <div className="space-y-3 pt-4 border-t border-[#eadfce]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/80">{t("Essen", "Food")}</span>
                  <span className="font-semibold text-forest">{aggregates.avgFood.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/80">{t("Schnelligkeit", "Speed")}</span>
                  <span className="font-semibold text-forest">
                    {aggregates.avgSpeed.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((r: any) => (
                <div key={r.id} className="pb-6 border-b border-[#eadfce]/50 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-forest">{r.customer_name}</div>
                      <div className="text-xs text-forest/60">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          fill={i < Math.round(r.overall_rating) ? "currentColor" : "none"}
                          className="w-4 h-4"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-forest/80 mt-2 whitespace-pre-wrap">{r.comment}</p>

                  {r.vendor_reply && (
                    <div className="mt-4 bg-[#fdfaf5] p-4 rounded-xl border border-[#eadfce]/40 ml-4">
                      <div className="text-xs font-semibold text-forest mb-1">
                        {fullRestaurant?.name}
                      </div>
                      <p className="text-sm text-forest/70">{r.vendor_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#fdfaf5] rounded-2xl border border-[#eadfce]/50">
            <Star className="w-10 h-10 text-forest/20 mx-auto mb-3" />
            <h3 className="font-semibold text-forest mb-1">
              {t("Noch keine Bewertungen", "No reviews yet")}
            </h3>
            <p className="text-sm text-forest/60 max-w-sm mx-auto">
              {t(
                "Bestelle jetzt und sei der Erste, der dieses Restaurant bewertet.",
                "Order now and be the first to review this restaurant.",
              )}
            </p>
          </div>
        )}
      </section>

      <MarketplacePromiseCTA vertical="restaurant" />

      <Dialog open={authPopupOpen} onOpenChange={setAuthPopupOpen}>
        <DialogContent className="sm:max-w-md bg-[#fdfaf5] text-forest border-[#eadfce] p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display text-forest flex items-center justify-center gap-2">
              🔒 {t("Anmeldung erforderlich", "Sign In Required")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-forest/80 leading-relaxed mt-4">
            {t(
              "Bitte melden Sie sich als Kunde an, um eine Bestellung aufzugeben. Partner-Konten können keine Bestellungen aufgeben.",
              "Please sign in as a customer to place an order. Partner accounts cannot place orders."
            )}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setAuthPopupOpen(false)}
              className="px-5 py-2 rounded-full border border-forest/30 text-forest font-bold text-sm hover:bg-forest/5 transition cursor-pointer"
            >
              {t("Abbrechen", "Cancel")}
            </button>
            <Link
              to="/auth"
              search={{ redirect: typeof window !== "undefined" ? window.location.href : undefined }}
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-forest text-white font-bold text-sm hover:opacity-90 transition cursor-pointer"
            >
              {t("Jetzt anmelden", "Sign In Now")}
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
