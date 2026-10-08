/* eslint-disable */
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { trackEvent } from "@/utils/posthog";
import {
  MapPin,
  Star,
  Clock,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Phone,
  ShoppingBag,
  Users,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ChefHat,
  MessageSquare,
  Sparkles,
  Camera,
  X,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { CategoryNav } from "@/components/ui/CategoryNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";
import { getCaterer, mockPromoCodes, PromoCode, fallbackCaterers } from "@/data/caterers";
import { getPublicCatererProfile, submitCateringBrief } from "@/lib/caterer/menu.functions";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { recordPageView } from "@/lib/vendor/analytics.functions";
import { UnifiedCustomerFields } from "@/components/UnifiedCustomerFields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";
import { getPublicCatererReviews } from "@/lib/reviews/public.functions";
import { supabase } from "@/integrations/supabase/client";

import { isValidCateringCity } from "@/data/geo/taxonomy";

function buildShowcaseProfile(fallback: any, cleanSlug: string) {
  return {
    id: fallback.id,
    owner_id: fallback.id,
    name: fallback.name,
    slug: fallback.slug || cleanSlug,
    custom_domain: null,
    certifications: fallback.certifications || null,
    description: fallback.about?.de || fallback.tagline?.de || "",
    logo_url: fallback.logo || null,
    banner_image_url: fallback.img || null,
    phone: fallback.phone || "",
    business_address: fallback.address || "",
    service_areas: fallback.area || "",
    min_delivery_cents: (fallback.minOrder || 0) * 100,
    delivery_fee_cents: 0,
    announcement_active: fallback.announcement_active || false,
    announcement_bg_color: fallback.announcement_bg_color || null,
    announcement_text: fallback.announcement_text || null,
    approval_status: "approved",
    menu: (fallback.menu || []).map((m: any) => ({
      id: m.id || String(Math.random()),
      category: m.category || "Menü",
      name: m.name,
      description: typeof m.desc === "object" ? m.desc?.de : m.desc || "",
      price_cents: m.price_cents || 0,
      unit: typeof m.unit === "object" ? m.unit?.de : m.unit || "Portion",
      serves: m.serves || 1,
      image_url: m.image_url || null,
      image_signed_url: m.image_url || null,
      is_available: true,
    })),
    packages: fallback.packages || [],
    gallery: fallback.gallery || [],
    tags: fallback.tags || [],
    dietary: fallback.dietary || [],
    promoCodes: [],
  };
}

const catererQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["catererProfile", slug],
    queryFn: async () => {
      const cleanSlug = (slug || "").toLowerCase().trim();
      const fallback = fallbackCaterers.find(
        (c) =>
          (c.slug && c.slug.toLowerCase() === cleanSlug) ||
          (c.id && c.id.toLowerCase() === cleanSlug),
      );
      if (fallback) {
        return buildShowcaseProfile(fallback, cleanSlug);
      }
      try {
        const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 2500));
        const res = await Promise.race([
          getPublicCatererProfile({ data: { slug } }),
          timeoutPromise,
        ]);
        if (res) return res;
      } catch (e) {
        console.error("Error in getPublicCatererProfile:", e);
      }
      return null;
    },
  });
export const Route = createFileRoute("/catering/$slug")({
  loader: async ({ params, context }) => {
    const cleanSlug = (params.slug || "").toLowerCase().trim();
    const fallback = fallbackCaterers.find(
      (c) =>
        (c.slug && c.slug.toLowerCase() === cleanSlug) ||
        (c.id && c.id.toLowerCase() === cleanSlug),
    );

    if (fallback) {
      const fullCaterer = { ...fallback, isShowcase: true };
      const profile = buildShowcaseProfile(fallback, cleanSlug);
      return { fullCaterer, reviewsData: null, profile };
    }

    let profile = null;
    let fullCaterer: any = undefined;
    try {
      const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 2500));
      const [fetchedProfile, fetchedCaterer] = await Promise.race([
        Promise.all([
          context.queryClient.ensureQueryData(catererQueryOptions(params.slug)).catch(() => null),
          getCaterer(params.slug).catch(() => undefined),
        ]),
        timeoutPromise.then(() => [null, undefined] as const),
      ]);
      profile = fetchedProfile;
      fullCaterer = fetchedCaterer;
    } catch (err) {
      console.error("Loader query error:", err);
    }

    if (!fullCaterer) {
      fullCaterer = await getCaterer(params.slug);
    }

    let reviewsData = null;
    if (profile?.id) {
      try {
        const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 1500));
        reviewsData = await Promise.race([
          getPublicCatererReviews({ data: { catererId: profile.id } }),
          timeoutPromise,
        ]);
      } catch (e) {}
    }
    if (profile?.custom_domain) {
      const cleanDomain = profile.custom_domain.toLowerCase().trim();
      if (!cleanDomain.endsWith("speisely.de") && !cleanDomain.includes("speisely")) {
        throw redirect({ href: `https://${cleanDomain}`, statusCode: 301 });
      }
    }
    return { fullCaterer, reviewsData, profile };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.fullCaterer;
    const city = c?.area ?? "Deutschland";
    const rawDesc = c
      ? `Professionelles Catering von ${c.name} in ${city}. Jetzt Anfrage stellen auf Speisely.`
      : "Caterer auf Speisely – Catering für Events, Firmen & Hochzeiten.";
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "..." : rawDesc;
    const title = c ? `${c.name} – Catering in ${city} | Speisely` : "Catering – Speisely";
    const ogImage = c?.img ?? "https://speisely.de/og-default.jpg";
    const canonicalUrl = (c as any)?.custom_domain
      ? `https://${(c as any).custom_domain}`
      : `https://speisely.de/catering/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: c ? `${c.name} – Catering auf Speisely` : title },
        {
          property: "og:description",
          content: "Catering für Events, Firmen & Hochzeiten. Jetzt Angebot anfordern.",
        },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FoodService",
                name: c.name,
                image: c.img,
                address: { "@type": "PostalAddress", addressLocality: city },
                areaServed: (c as any)?.seo_service_areas?.length
                  ? (c as any).seo_service_areas
                  : city,
                ...((c as any)?.seo_event_types_target?.length ||
                (c as any)?.seo_catering_styles?.length
                  ? {
                      knowsAbout: [
                        ...((c as any)?.seo_event_types_target || []),
                        ...((c as any)?.seo_catering_styles || []),
                      ],
                    }
                  : {}),
                ...((c as any)?.seo_menu_or_packages_intro
                  ? {
                      makesOffer: {
                        "@type": "Offer",
                        description: (c as any).seo_menu_or_packages_intro,
                      },
                    }
                  : {}),
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
  // moved to above head
  component: CatererPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-display text-forest">Caterer nicht gefunden</h1>
        <Link to="/catering" className="mt-6 inline-block text-forest underline">
          Zurück zu Catering
        </Link>
      </div>
    </SiteShell>
  ),
});

function CatererPage() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const loaderData = Route.useLoaderData() as any;
  const { fullCaterer: caterer, reviewsData, profile: initialProfile } = loaderData || {};
  const { data: dbCatererOrig } = useQuery(catererQueryOptions(slug));
  const dbCaterer = (dbCatererOrig || initialProfile) as any;

  const reviews = reviewsData?.reviews || [];
  const aggregates = reviewsData?.aggregates;
  const staticCaterer = caterer;

  const [cart, setCart] = useState<Record<string, number>>({});
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [guests, setGuests] = useState(staticCaterer?.minGuests || 10);

  const recordView = useServerFn(recordPageView);
  const submitBrief = useServerFn(submitCateringBrief);
  const [submittingBrief, setSubmittingBrief] = useState(false);

  const [userSession, setUserSession] = useState<any>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ url: string; caption?: string } | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    postalCodeCity: "",
    guestCount: 20,
    eventType: "Familienfeier / Event",
    notes: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserSession(session.user);
        setInquiryForm((prev) => ({
          ...prev,
          customerName:
            prev.customerName ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "",
          customerEmail: prev.customerEmail || session.user.email || "",
        }));
      }
    });
  }, []);

  const [b2bOpen, setB2bOpen] = useState(false);
  const handleB2bOpenChange = (open: boolean) => {
    setB2bOpen(open);
    if (open) {
      trackEvent("catering_brief_started", { catererId: dbCaterer?.id, isB2b: true });
    }
  };
  const [identity, setIdentity] = useState({
    name: "",
    email: "",
    phone: "",
    marketingOptIn: false,
    termsAccepted: false,
  });
  const [b2bForm, setB2bForm] = useState({
    companyName: "",
    employees: "50",
    pattern: "daily",
    startDate: "",
    notes: "",
  });
  const [submittingB2b, setSubmittingB2b] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState({ count: 0, total: 0 });
  const t = (de: string, en: string) => (lang === "de" ? de : en);

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.termsAccepted) {
      toast.error(
        t("Bitte akzeptieren Sie die Plattformbedingungen.", "Please accept the platform terms."),
      );
      return;
    }
    setSubmittingB2b(true);
    try {
      // 1. Process B2B Payload
      const notesWithContact = `[B2B INQUIRY]\nName: ${identity.name}\nEmail: ${identity.email}\nPhone: ${identity.phone}\n\nNotes:\n${b2bForm.notes}`;

      if (dbCaterer) {
        await submitBrief({
          data: {
            catererId: dbCaterer.id,
            eventType: "Corporate Daily Catering",
            eventDate: b2bForm.startDate || new Date().toISOString().split("T")[0],
            guestCount: parseInt(b2bForm.employees),
            budgetCents: parseInt(b2bForm.employees) * 15 * 100, // Estimate €15 per head per day
            location: "Corporate Office",
            notes: notesWithContact,
            isB2b: true,
            companyName: b2bForm.companyName,
            isRecurring: true,
            recurrencePattern: b2bForm.pattern,
          },
        });
      } else {
        // Mock submission for static caterers
        await new Promise((res) => setTimeout(res, 800));
      }

      trackEvent("reservation_submitted", {
        catererId: catererProfile?.id || "unknown",
        type: "catering",
        isB2b: true,
      });
      toast.success(
        t(
          "Unternehmensanfrage erfolgreich gesendet! Der Caterer wird sich melden.",
          "Corporate request sent successfully! The caterer will be in touch.",
        ),
      );
      setB2bOpen(false);
      setSuccessModalOpen(true);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmittingB2b(false);
    }
  };

  useEffect(() => {
    if (dbCaterer?.id && typeof window !== "undefined") {
      recordView({
        data: { vendorId: dbCaterer.id, vendorType: "caterer", url: window.location.pathname },
      }).catch((e) => console.error("Tracking error", e));
    }
  }, [dbCaterer?.id]);

  let dbImg = null;
  if (dbCaterer?.banner_image_url) {
    if (
      dbCaterer.banner_image_url.startsWith("http") ||
      dbCaterer.banner_image_url.startsWith("/")
    ) {
      dbImg = dbCaterer.banner_image_url;
    } else {
      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL || "https://athwccvgdovglcpluwnu.supabase.co";
      dbImg = `${supabaseUrl}/storage/v1/object/public/storefront-assets/${dbCaterer.banner_image_url}`;
    }
  }

  // Construct a unified caterer object
  let catererProfile: any = null;

  if (dbCaterer) {
    catererProfile = {
      id: dbCaterer.id,
      name: dbCaterer.name,
      slug: dbCaterer.slug,
      tagline: staticCaterer?.tagline || {
        de: dbCaterer.description || "Individuelle Catering-Erlebnisse",
        en: dbCaterer.description || "Custom catering experiences",
      },
      logo: dbCaterer.logo_url || staticCaterer?.logo || null,
      rating: staticCaterer?.rating || 5.0,
      reviewCount: staticCaterer?.reviewCount || 0,
      minOrder: dbCaterer.min_delivery_cents
        ? dbCaterer.min_delivery_cents / 100
        : staticCaterer?.minOrder || 0,
      minBudget: dbCaterer.min_delivery_cents
        ? dbCaterer.min_delivery_cents / 100
        : staticCaterer?.minOrder || 0,
      leadTimeDays: staticCaterer?.leadTimeDays || 7,
      time: staticCaterer?.time || "",
      minGuests: staticCaterer?.minGuests || 10,
      verified: staticCaterer?.verified ?? true,
      img:
        dbImg ||
        staticCaterer?.img ||
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
      area: dbCaterer.service_areas || staticCaterer?.area || "Berlin",
      address: dbCaterer.business_address || staticCaterer?.address || "",
      phone: dbCaterer.phone || staticCaterer?.phone || "",
      about: staticCaterer?.about || {
        de: dbCaterer.description || "",
        en: dbCaterer.description || "",
      },
      menu: staticCaterer?.menu
        ? staticCaterer.menu.map((m: any) => ({
            name: m.name,
            category: m.category || "Menü",
            desc: typeof m.desc === "object" ? m.desc : { de: m.desc || "", en: m.desc || "" },
            price: (m.price_cents || 0) / 100,
            unit:
              typeof m.unit === "object"
                ? m.unit
                : { de: m.unit || "Portion", en: m.unit || "Portion" },
            serves: m.serves || 1,
            image_signed_url: m.image_url || null,
          }))
        : (dbCaterer.menu || []).map((m: any) => ({
            name: m.name,
            category: m.category,
            desc: { de: m.description || "", en: m.description || "" },
            price: m.price_cents / 100,
            unit:
              typeof m.unit === "object"
                ? m.unit
                : { de: m.unit || "Portion", en: m.unit || "Portion" },
            serves: m.serves,
            image_signed_url: m.image_signed_url,
          })),
      packages: dbCaterer.packages || staticCaterer?.packages || [],
      gallery: staticCaterer?.gallery || [],
      dietary: staticCaterer?.dietary || [],
      tags: staticCaterer?.tags || [],
      announcement_active: dbCaterer.announcement_active ?? staticCaterer?.announcement_active,
      announcement_text: dbCaterer.announcement_text ?? staticCaterer?.announcement_text,
      announcement_bg_color:
        dbCaterer.announcement_bg_color ?? staticCaterer?.announcement_bg_color,
      certifications: dbCaterer.certifications || (staticCaterer as any)?.certifications || "",
    };
  } else if (staticCaterer) {
    catererProfile = {
      ...staticCaterer,
      time: staticCaterer.time || "",
      minBudget: staticCaterer.minOrder || 0,
      certifications: (staticCaterer as any).certifications || "",
      menu: (staticCaterer.menu || []).map((m: any) => ({
        name: m.name,
        category: m.category || "Menü",
        desc: typeof m.desc === "object" ? m.desc : { de: m.desc || "", en: m.desc || "" },
        price: (m.price_cents || 0) / 100,
        unit:
          typeof m.unit === "object"
            ? m.unit
            : { de: m.unit || "Portion", en: m.unit || "Portion" },
        serves: m.serves || 1,
        image_signed_url: m.image_url || null,
      })),
      packages: staticCaterer.packages || [],
      gallery: staticCaterer.gallery || [],
    };
  }

  const storefrontUrl = dbCaterer?.custom_domain
    ? `https://${dbCaterer.custom_domain}`
    : `https://${dbCaterer?.slug || slug}.speisely.de`;

  const categories = useMemo(() => {
    if (!catererProfile) return [];
    const seen = new Set<string>();
    const cats: string[] = [];
    (catererProfile.menu || []).forEach((m: any) => {
      const c = m.category || "Menü";
      if (!seen.has(c)) {
        seen.add(c);
        cats.push(c);
      }
    });
    return cats;
  }, [catererProfile]);

  const certBadges = useMemo(() => {
    if (!catererProfile?.certifications) return [];
    return String(catererProfile.certifications)
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
  }, [catererProfile?.certifications]);

  const maxBadges = 5;
  const visibleBadges = certBadges.slice(0, maxBadges);
  const remainingCount = certBadges.length - maxBadges;

  if (!catererProfile)
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-display text-forest">Caterer nicht gefunden</h1>
          <Link to="/catering" className="mt-6 inline-block text-forest underline">
            Zurück zu Catering
          </Link>
        </div>
      </SiteShell>
    );

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const updateQty = (name: string, qty: number) => {
    if (qty > 0 && Object.keys(cart).length === 0) {
      trackEvent("catering_brief_started", { catererId: dbCaterer?.id, isB2b: false });
    }
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[name];
      else next[name] = qty;
      return next;
    });
  };

  const cartItems = Object.entries(cart).map(([name, qty]) => {
    const item = catererProfile.menu.find((m: any) => m.name === name)!;
    return { ...item, qty };
  });
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const belowMin = subtotal > 0 && subtotal < catererProfile.minBudget;

  const handleApplyPromo = () => {
    setPromoError("");
    const codes = catererProfile.promoCodes || [];
    const validCode = codes.find(
      (c: any) => c.code.toUpperCase() === promoCodeInput.trim().toUpperCase(),
    );
    if (validCode) {
      const now = new Date();
      if (validCode.starts_at && new Date(validCode.starts_at) > now) {
        return setPromoError(t("Dieser Code ist noch nicht gültig", "This code is not valid yet"));
      }
      if (validCode.ends_at && new Date(validCode.ends_at) < now) {
        return setPromoError(t("Dieser Code ist abgelaufen", "This code has expired"));
      }
      if (validCode.min_order_value_cents && subtotal * 100 < validCode.min_order_value_cents) {
        return setPromoError(
          t(
            `Mindestbestellwert: €${(validCode.min_order_value_cents / 100).toFixed(2)}`,
            `You must spend at least €${(validCode.min_order_value_cents / 100).toFixed(2)} to use this code`,
          ),
        );
      }
      setAppliedPromo(validCode);
      setPromoCodeInput("");
    } else {
      setPromoError(t("Ungültiger Code", "Invalid code"));
    }
  };
  const handleRemovePromo = () => setAppliedPromo(null);

  let discountAmount = 0;
  if (appliedPromo) {
    if ((appliedPromo as any).discount_type === "free_delivery") {
      // Catering doesn't have delivery fee in the same way, but we handle it safely
    } else if ((appliedPromo as any).discount_type === "free_item") {
      const targetItem = cartItems.find((i) => i.name === (appliedPromo as any).free_item_name);
      if (targetItem) {
        discountAmount = targetItem.price;
      }
    } else if ((appliedPromo as any).discount_type === "bogo") {
      const rq = (appliedPromo as any).required_qty || 2;
      const appliesTo = (appliedPromo as any).applies_to_product_name;
      const targetItem = cartItems.find((i) => i.name === appliesTo);
      if (targetItem) {
        const freeItems = Math.floor(targetItem.qty / rq);
        discountAmount = freeItems * targetItem.price;
      }
    } else {
      let eligibleSubtotal = subtotal;
      if ((appliedPromo as any).applies_to_product_name) {
        const targetItem = cartItems.find(
          (i) => i.name === (appliedPromo as any).applies_to_product_name,
        );
        eligibleSubtotal = targetItem ? targetItem.price * targetItem.qty : 0;
      }

      if (appliedPromo.discount_type === "percentage") {
        discountAmount = eligibleSubtotal * (appliedPromo.discount_value / 100);
      } else {
        discountAmount = appliedPromo.discount_value;
      }
      discountAmount = Math.min(discountAmount, eligibleSubtotal);
    }
  }
  const finalTotal = subtotal - discountAmount;

  const renderSidebar = (isMobile = false) => (
    <>
      {!isMobile && (
        <div className="flex items-center gap-2 text-forest">
          <ShoppingBag className="h-5 w-5" />
          <h3 className="font-display text-xl">{t("Dynamisches Angebot", "Dynamic Quote")}</h3>
        </div>
      )}
      {cartItems.length === 0 ? (
        <p className="mt-4 text-sm text-forest/40 italic">
          {t(
            "👆 Füge Artikel hinzu, um dein Angebot zu starten",
            "👆 Add items to start your quote",
          )}
        </p>
      ) : (
        <>
          <div className="mt-4 divide-y divide-[oklch(0.85_0.05_152)]">
            {cartItems.map((i) => (
              <div key={i.name} className="py-3 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                <span className="h-6 min-w-6 px-2 grid place-items-center rounded-full bg-[oklch(0.88_0.06_152)] text-forest text-xs font-semibold">
                  {i.qty}
                </span>
                <span className="text-sm text-forest truncate">{i.name}</span>
                <span className="text-sm font-medium text-forest">
                  {i.price > 0
                    ? `€${(i.price * i.qty).toFixed(2)}`
                    : t("Preis auf Anfrage", "Price on request")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Zwischensumme", "Subtotal")}</span>
            <span>
              {subtotal > 0
                ? `€${subtotal.toFixed(2)}`
                : t("Preis auf Anfrage", "Price on request")}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-base font-semibold text-forest border-t border-[oklch(0.85_0.05_152)] pt-4">
            <span>{t("Gesamt", "Total")}</span>
            <span>
              {finalTotal > 0
                ? `€${finalTotal.toFixed(2)}`
                : t("Preis auf Anfrage", "Price on request")}
            </span>
          </div>

          {cartItems.length > 0 &&
            catererProfile?.announcement_active &&
            catererProfile?.announcement_text && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                {catererProfile.announcement_text}
              </div>
            )}

          <button
            disabled={submittingBrief}
            onClick={() => {
              const defaultDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
              setInquiryForm((prev) => ({
                ...prev,
                guestCount: guests > 0 ? guests : totalCount > 0 ? totalCount : 15,
                eventDate: prev.eventDate || defaultDate,
                postalCodeCity: prev.postalCodeCity || catererProfile?.area || "",
              }));
              setInquiryModalOpen(true);
            }}
            className="mt-5 w-full rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white py-3 font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {t("Unverbindliche Anfrage senden", "Send non-binding inquiry")}
          </button>
          <p className="mt-2 text-xs text-forest/60">
            {t("Der Caterer bestätigt deine Anfrage.", "The caterer confirms your request.")}
          </p>
        </>
      )}

      {/* B2B Corporate Catering Trigger */}
      <div className="mt-8 pt-6 border-t border-[oklch(0.85_0.05_152)]">
        <Dialog open={b2bOpen} onOpenChange={handleB2bOpenChange}>
          <DialogTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest/5 border-2 border-forest text-forest py-4 font-semibold hover:bg-forest/10 transition">
              <ShoppingBag className="h-4 w-4" />
              {t("B2B Firmen-Catering anfragen", "Request B2B Corporate Catering")}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#fdfaf5] text-forest border-[#eadfce]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-forest">
                {t("Corporate Catering", "Corporate Catering")}
              </DialogTitle>
              <p className="text-sm text-forest/70">
                {t(
                  "Richte regelmäßiges Catering für dein Büro ein. Ideal für Team-Lunches, Meetings und mehr.",
                  "Set up recurring catering for your office. Perfect for team lunches, meetings, and more.",
                )}
              </p>
            </DialogHeader>
            <form onSubmit={handleB2bSubmit} className="space-y-4 mt-4">
              <UnifiedCustomerFields
                value={identity}
                onChange={(fields) => setIdentity({ ...identity, ...fields })}
              />
              <div className="space-y-1.5 pt-4 border-t border-[oklch(0.85_0.05_152)]">
                <Label>{t("Firmenname", "Company Name")}</Label>
                <Input
                  required
                  className="bg-white border-[#eadfce]"
                  value={b2bForm.companyName}
                  onChange={(e) => setB2bForm((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t("Mitarbeiterzahl", "Employee Count")}</Label>
                  <Input
                    type="number"
                    required
                    min="1"
                    className="bg-white border-[#eadfce]"
                    value={b2bForm.employees}
                    onChange={(e) => setB2bForm((prev) => ({ ...prev, employees: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("Rhythmus", "Frequency")}</Label>
                  <Select
                    value={b2bForm.pattern}
                    onValueChange={(v) => setB2bForm((prev) => ({ ...prev, pattern: v }))}
                  >
                    <SelectTrigger className="bg-white border-[#eadfce]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                      <SelectItem value="daily">
                        {t("Täglich (Mo-Fr)", "Daily (Mon-Fri)")}
                      </SelectItem>
                      <SelectItem value="weekly">{t("Einmal pro Woche", "Once a week")}</SelectItem>
                      <SelectItem value="biweekly">{t("Alle zwei Wochen", "Bi-weekly")}</SelectItem>
                      <SelectItem value="monthly">
                        {t("Einmal pro Monat", "Once a month")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("Gewünschter Start", "Desired Start Date")}</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="bg-white border-[#eadfce]"
                  value={b2bForm.startDate}
                  onChange={(e) => setB2bForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("Zusätzliche Wünsche", "Additional Notes")}</Label>
                <Textarea
                  rows={3}
                  className="bg-white border-[#eadfce]"
                  value={b2bForm.notes}
                  onChange={(e) => setB2bForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder={t(
                    "z.B. 30% vegetarisch, 10% vegan...",
                    "e.g., 30% vegetarian, 10% vegan...",
                  )}
                />
              </div>
              <button
                disabled={submittingB2b}
                type="submit"
                className="mt-4 w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submittingB2b
                  ? t("Senden...", "Sending...")
                  : t("Anfrage absenden", "Submit B2B Request")}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8">
        {dbCaterer?.city ? (
          <Link
            to="/catering/ort/$city"
            params={{ city: dbCaterer.city.toLowerCase() }}
            className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" /> {t("Zurück", "Back")}
          </Link>
        ) : (
          <Link
            to="/catering"
            className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" /> {t("Zurück", "Back")}
          </Link>
        )}

        {/* Redesigned Responsive Hero Banner */}
        <div className="relative mt-4 sm:mt-6 w-full min-h-[340px] sm:min-h-[380px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg flex flex-col justify-between p-4 sm:p-6 md:p-8">
          <img
            src={
              catererProfile.img ||
              "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop"
            }
            alt={catererProfile.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={420}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";
            }}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.25) 100%)",
            }}
          />

          {/* Top Badge & Desktop Action Bar */}
          <div className="relative z-20 flex items-center justify-between w-full">
            {catererProfile.verified ? (
              <span className="rounded-full bg-[#10b981] px-3.5 py-1.5 text-xs md:text-sm font-bold text-white shadow-md flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {t("GEPRÜFT", "CHECKED")}
              </span>
            ) : (
              <div />
            )}

            {/* Desktop Top Right Actions */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="group flex items-center gap-1.5 rounded-full bg-[#10b981] hover:bg-[#10b981]/90 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("Anfrage an Speisely senden", "Send inquiry to Speisely")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Dialog open={b2bOpen} onOpenChange={handleB2bOpenChange}>
                <DialogTrigger asChild>
                  <button className="group flex items-center gap-1.5 rounded-full border border-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer">
                    {t("B2B Firmen-Catering", "B2B corporate catering")}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-[#fdfaf5] text-forest border-[#eadfce]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-forest">
                      {t("Corporate Catering", "Corporate Catering")}
                    </DialogTitle>
                    <p className="text-sm text-forest/70">
                      {t(
                        "Richte regelmäßiges Catering für dein Büro ein. Ideal für Team-Lunches, Meetings und mehr.",
                        "Set up recurring catering for your office. Perfect for team lunches, meetings, and more.",
                      )}
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleB2bSubmit} className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                      <Label>{t("Firmenname", "Company Name")}</Label>
                      <Input
                        required
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.companyName}
                        onChange={(e) =>
                          setB2bForm((prev) => ({ ...prev, companyName: e.target.value }))
                        }
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>{t("Mitarbeiterzahl", "Employee Count")}</Label>
                        <Input
                          type="number"
                          required
                          min="1"
                          className="bg-white border-[#eadfce]"
                          value={b2bForm.employees}
                          onChange={(e) =>
                            setB2bForm((prev) => ({ ...prev, employees: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t("Rhythmus", "Frequency")}</Label>
                        <Select
                          value={b2bForm.pattern}
                          onValueChange={(v) => setB2bForm((prev) => ({ ...prev, pattern: v }))}
                        >
                          <SelectTrigger className="bg-white border-[#eadfce]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                            <SelectItem value="daily">
                              {t("Täglich (Mo-Fr)", "Daily (Mon-Fri)")}
                            </SelectItem>
                            <SelectItem value="weekly">
                              {t("Einmal pro Woche", "Once a week")}
                            </SelectItem>
                            <SelectItem value="biweekly">
                              {t("Alle zwei Wochen", "Bi-weekly")}
                            </SelectItem>
                            <SelectItem value="monthly">
                              {t("Einmal pro Monat", "Once a month")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("Gewünschter Start", "Desired Start Date")}</Label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.startDate}
                        onChange={(e) =>
                          setB2bForm((prev) => ({ ...prev, startDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("Zusätzliche Wünsche", "Additional Notes")}</Label>
                      <Textarea
                        rows={3}
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.notes}
                        onChange={(e) => setB2bForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder={t(
                          "z.B. 30% vegetarisch, 10% vegan...",
                          "e.g., 30% vegetarian, 10% vegan...",
                        )}
                      />
                    </div>
                    <button
                      disabled={submittingB2b}
                      type="submit"
                      className="mt-4 w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {submittingB2b
                        ? t("Senden...", "Sending...")
                        : t("Anfrage absenden", "Submit B2B Request")}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Bottom Info & Text Overlay */}
          <div className="relative z-20 text-white flex flex-col items-center text-center gap-2 sm:gap-3 mt-4 sm:mt-6 mx-auto max-w-4xl px-2">
            {catererProfile.logo && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-3 sm:border-4 border-white shadow-2xl bg-white p-2 sm:p-2.5 flex items-center justify-center flex-shrink-0 mx-auto transition-transform hover:scale-105 duration-300">
                <img
                  src={catererProfile.logo}
                  alt={catererProfile.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold leading-tight drop-shadow-md break-words">
                {catererProfile.name}
              </h1>
              {catererProfile?.seo_event_types_target &&
                catererProfile.seo_event_types_target.length > 0 && (
                  <p className="text-xs sm:text-base md:text-lg font-medium drop-shadow-md text-white/90">
                    {catererProfile.seo_event_types_target.join(" · ")}
                  </p>
                )}
            </div>

            {catererProfile?.seo_catering_styles &&
              catererProfile.seo_catering_styles.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-0.5">
                  {catererProfile.seo_catering_styles.map((style: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30 text-white"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}

            {catererProfile.tagline && catererProfile.tagline[lang] && (
              <p className="text-xs sm:text-sm md:text-base text-mint font-semibold font-sans drop-shadow-md leading-relaxed max-w-2xl">
                {catererProfile.tagline[lang]}
              </p>
            )}

            {/* Direct inquiry focus */}

            {/* Mobile Only Clean Action Buttons Bar */}
            <div className="grid grid-cols-2 gap-2 md:hidden pt-3 border-t border-white/15 w-full max-w-md mx-auto">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#10b981] active:bg-[#10b981]/90 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("Anfrage senden", "Send request")}
              </button>
              <Dialog open={b2bOpen} onOpenChange={handleB2bOpenChange}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-1.5 rounded-full border border-white bg-white/20 active:bg-white/30 backdrop-blur-md py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer">
                    {t("B2B Firmen-Catering", "B2B catering")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-[#fdfaf5] text-forest border-[#eadfce]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-forest">
                      {t("Corporate Catering", "Corporate Catering")}
                    </DialogTitle>
                    <p className="text-sm text-forest/70">
                      {t(
                        "Richte regelmäßiges Catering für dein Büro ein. Ideal für Team-Lunches, Meetings und mehr.",
                        "Set up recurring catering for your office. Perfect for team lunches, meetings, and more.",
                      )}
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleB2bSubmit} className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                      <Label>{t("Firmenname", "Company Name")}</Label>
                      <Input
                        required
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.companyName}
                        onChange={(e) =>
                          setB2bForm((prev) => ({ ...prev, companyName: e.target.value }))
                        }
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>{t("Mitarbeiterzahl", "Employee Count")}</Label>
                        <Input
                          type="number"
                          required
                          min="1"
                          className="bg-white border-[#eadfce]"
                          value={b2bForm.employees}
                          onChange={(e) =>
                            setB2bForm((prev) => ({ ...prev, employees: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t("Rhythmus", "Frequency")}</Label>
                        <Select
                          value={b2bForm.pattern}
                          onValueChange={(v) => setB2bForm((prev) => ({ ...prev, pattern: v }))}
                        >
                          <SelectTrigger className="bg-white border-[#eadfce]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                            <SelectItem value="daily">
                              {t("Täglich (Mo-Fr)", "Daily (Mon-Fri)")}
                            </SelectItem>
                            <SelectItem value="weekly">
                              {t("Einmal pro Woche", "Once a week")}
                            </SelectItem>
                            <SelectItem value="biweekly">
                              {t("Alle zwei Wochen", "Bi-weekly")}
                            </SelectItem>
                            <SelectItem value="monthly">
                              {t("Einmal pro Monat", "Once a month")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("Gewünschter Start", "Desired Start Date")}</Label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.startDate}
                        onChange={(e) =>
                          setB2bForm((prev) => ({ ...prev, startDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("Zusätzliche Wünsche", "Additional Notes")}</Label>
                      <Textarea
                        rows={3}
                        className="bg-white border-[#eadfce]"
                        value={b2bForm.notes}
                        onChange={(e) => setB2bForm((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder={t(
                          "z.B. 30% vegetarisch, 10% vegan...",
                          "e.g., 30% vegetarian, 10% vegan...",
                        )}
                      />
                    </div>
                    <button
                      disabled={submittingB2b}
                      type="submit"
                      className="mt-4 w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {submittingB2b
                        ? t("Senden...", "Sending...")
                        : t("Anfrage absenden", "Submit B2B Request")}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Enhanced Trust & Info Bar */}
        <div className="mt-6 mb-2 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 sm:p-5 bg-white rounded-xl border border-[#eadfce] shadow-sm">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-start sm:items-center gap-3 sm:gap-x-6 sm:gap-y-4 m-0 w-full md:w-auto">
            <div className="flex items-center gap-2 text-forest">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#10b981]" />
              <span className="text-xs sm:text-sm font-bold">
                {t("Geprüftes Profil", "Checked Profile")}
              </span>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-[10px] sm:text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Mindestbestellung", "Min. Order")}
              </dt>
              <dd className="text-xs sm:text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Users className="h-4 w-4 text-forest/40 shrink-0" /> {catererProfile.minGuests}{" "}
                {t("Personen", "Guests")} / €{catererProfile.minBudget}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-[10px] sm:text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Vorlaufzeit", "Lead Time")}
              </dt>
              <dd className="text-xs sm:text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Clock className="h-4 w-4 text-forest/40 shrink-0" />{" "}
                {catererProfile.time
                  ? catererProfile.time
                  : `${catererProfile.leadTimeDays} ${t("Tage", "Days")}`}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-[10px] sm:text-xs text-forest/50 font-medium uppercase tracking-wider">
                {t("Liefergebiet", "Service Area")}
              </dt>
              <dd className="text-xs sm:text-sm font-semibold text-forest flex flex-col items-start gap-0.5 m-0">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-forest/40 shrink-0" />{" "}
                  <span className="truncate max-w-[200px]">
                    {catererProfile?.seo_service_areas?.join(", ") || catererProfile.area}
                  </span>
                </div>
                {catererProfile?.seo_service_radius_km && (
                  <span className="text-[10px] sm:text-xs text-forest/60">
                    Bis {catererProfile.seo_service_radius_km} km Radius
                  </span>
                )}
              </dd>
            </div>
          </dl>

          {visibleBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3 md:pt-0 border-t border-[#eadfce] md:border-0 w-full md:w-auto">
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

        {/* Catering Brochure Quick Banner if available */}
        {catererProfile.slug === "kampala-rolex-germany" && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#fdfaf5] to-emerald-50/60 rounded-xl border border-[#eadfce] shadow-sm">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-forest">
              <span className="text-xl">📄</span>
              <div>
                <span className="font-bold">
                  {t(
                    "Offizielle Catering-Broschüre von Kampala Rolex Germany",
                    "Official Kampala Rolex Germany Catering Brochure",
                  )}
                </span>
                <span className="text-forest/70 block sm:inline sm:ml-2 text-xs">
                  (
                  {t(
                    "Menü, Live-Station & Event-Konditionen als PDF",
                    "Menu, Live Station & Event Terms PDF",
                  )}
                  )
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setInquiryForm((prev) => ({
                  ...prev,
                  eventType: "Catering-Broschüre & Konditionen",
                  notes: "[ANFRAGE: Catering-Broschüre, Menü & Konditionen anfordern]\n\n",
                }));
                setInquiryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest hover:bg-forest/90 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#E6B84A]" />
              <span>
                {t("Konditionen über Speisely anfordern", "Request Details via Speisely")}
              </span>
            </button>
          </div>
        )}

        {/* About Text */}
        {(dbCaterer?.seo_local_intro || (catererProfile.about && catererProfile.about[lang])) && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {t(`Über ${catererProfile.name}`, `About ${catererProfile.name}`)}
            </h2>
            <p className="text-base text-forest/80 max-w-3xl leading-relaxed whitespace-pre-wrap">
              {dbCaterer?.seo_local_intro || catererProfile.about[lang]}
            </p>
            {dbCaterer?.seo_nearby_landmarks && dbCaterer.seo_nearby_landmarks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-forest/70">
                  {t("In der Nähe:", "Nearby:")}
                </span>
                {dbCaterer.seo_nearby_landmarks.map((lm: string, i: number) => (
                  <span key={i} className="text-sm text-forest/80 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {lm}
                  </span>
                ))}
              </div>
            )}
            {dbCaterer?.seo_logistics_details && (
              <div className="mt-6 p-4 bg-[oklch(0.95_0.05_152)] rounded-xl border border-[oklch(0.85_0.05_152)]">
                <h4 className="font-semibold text-forest text-sm mb-2">
                  {t("Catering & Logistik Details", "Catering & Logistics Details")}
                </h4>
                <p className="text-sm text-forest/80 whitespace-pre-wrap">
                  {dbCaterer.seo_logistics_details}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Signature Live Rolex Station Spotlight Banner (Exclusive for Kampala Rolex) */}
      {catererProfile.slug === "kampala-rolex-germany" && (
        <section id="live-station" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#083822] via-[#0d4a2f] to-[#083822] p-6 sm:p-8 md:p-10 text-white shadow-xl border border-[#E6B84A]/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Story & Highlights */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A]/40 text-[#E6B84A] text-xs font-bold uppercase tracking-wider w-fit">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t(
                      "Das Signature Live-Cooking Highlight",
                      "The Signature Live-Cooking Highlight",
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur-sm">
                    <Users className="h-3.5 w-3.5 text-[#E6B84A]" />
                    {t("Ab 20 Personen · Inkl. Koch vor Ort", "From 20 pax · Live Chef included")}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                  {t("Die Interaktive Live-Rolex-Station", "The Interactive Live Rolex Station")}
                </h2>

                <p className="text-sm sm:text-base text-cream/90 leading-relaxed">
                  {t(
                    "Unsere Köche bereiten die berühmten ugandischen Rolex-Wraps frisch vor den Augen Ihrer Gäste auf der heißen Platte zu. Frisch gebackenes, luftiges Chapati wird mit einem saftigen Omelett aus Eiern, Tomaten, Zwiebeln und feinem marinierten Fleisch gerollt. Ein multisensorisches Live-Erlebnis für Firmenevents, Sommerfeste und Hochzeiten!",
                    "Our chefs prepare the famous Ugandan Rolex wraps live right before your guests on the hot griddle. Freshly baked, flaky chapati rolled with a savory vegetable omelette, fresh tomatoes, onions, and tender marinated chicken. A multi-sensory culinary show for corporate events, festivals, and weddings!",
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                  <div className="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/15">
                    <div className="text-xl mb-1">👨‍🍳</div>
                    <div className="text-xs font-bold text-white">
                      {t("Live gerollt vor Ort", "Rolled Live On-Site")}
                    </div>
                    <div className="text-[11px] text-white/70">
                      {t("Warm & duftend in Sekunden", "Hot & fragrant in seconds")}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/15">
                    <div className="text-xl mb-1">🚚</div>
                    <div className="text-xs font-bold text-white">
                      {t("Indoor & Foodtruck", "Indoor & Food Truck")}
                    </div>
                    <div className="text-[11px] text-white/70">
                      {t("Mit DJ-Setup & mobiler Küche", "With DJ setup & mobile kitchen")}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/15">
                    <div className="text-xl mb-1">✨</div>
                    <div className="text-xs font-bold text-white">
                      {t("Frisch & Authentisch", "Fresh & Authentic")}
                    </div>
                    <div className="text-[11px] text-white/70">
                      {t("Wünsche flexibel anpassbar", "Customizable on request")}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setInquiryForm((prev) => ({
                        ...prev,
                        eventType: "Live Ugandan Rolex Experience",
                        notes: "[ANFRAGE: Interaktive Live-Rolex-Station vor Ort]\n\n",
                        guestCount: Math.max(prev.guestCount, 20),
                      }));
                      setInquiryModalOpen(true);
                    }}
                    className="rounded-full bg-[#10b981] hover:bg-[#10b981]/90 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {t("Live-Station bei Speisely anfragen", "Inquire Live Station via Speisely")}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setInquiryForm((prev) => ({
                        ...prev,
                        eventType: "Live-Rolex-Station Beratung",
                        notes: "[FRAGE / BERATUNGSWUNSCH ZUR LIVE-ROLEX-STATION]\n\n",
                        guestCount: Math.max(prev.guestCount, 20),
                      }));
                      setInquiryModalOpen(true);
                    }}
                    className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 text-[#E6B84A]" />
                    <span>{t("Frage an Speisely stellen", "Ask Speisely Concierge")}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual Framing */}
              <div className="lg:col-span-5 relative">
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#E6B84A]/40 bg-white/10 shadow-2xl p-2 aspect-[4/3] group">
                  <img
                    src="/caterers/kampala-rolex-muenchen/02_ugandan_rolex_signature.jpg"
                    alt="Ugandan Rolex Signature Wrap"
                    className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/75 backdrop-blur-md p-3 border border-white/20 text-white">
                    <div className="text-xs font-bold text-[#E6B84A]">
                      {t("Original Ugandan Rolex Wrap", "Original Ugandan Rolex Wrap")}
                    </div>
                    <div className="text-[11px] text-white/80">
                      {t(
                        "Frisch gebackenes Chapati & saftiges Omelett",
                        "Freshly baked chapati & savory omelette",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Packages Section */}
      {catererProfile.packages && catererProfile.packages.length > 0 && (
        <section
          id="packages"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-14 scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                {t("All-Inclusive Event-Pakete", "All-Inclusive Event Packages")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
                {t("Catering-Pakete & Live-Erlebnisse", "Catering Packages & Live Experiences")}
              </h2>
              <p className="mt-1 text-sm text-forest/70 max-w-2xl">
                {t(
                  "Komplett abgestimmte Menüs & Live-Stationen für Ihr Event – transparente Preise pro Person und unkomplizierte Buchung.",
                  "Curated menus & live cooking stations for your event – transparent per-person pricing and seamless booking.",
                )}
              </p>
            </div>
            <button
              onClick={() => {
                setInquiryForm((prev) => ({
                  ...prev,
                  eventType: "Individuelles Catering-Paket",
                  notes: "[INDIVIDUELLES CATERING / WUNSCHPAKET]\n\n",
                  guestCount: Math.max(prev.guestCount, 20),
                }));
                setInquiryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-forest hover:bg-forest/90 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition shrink-0 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-[#E6B84A]" />
              {t("Individuelle Anfrage an Speisely", "Custom inquiry via Speisely")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catererProfile.packages.map((pkg: any) => {
              const isBestseller = pkg.is_bestseller || false;
              return (
                <div
                  key={pkg.id || pkg.title}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-white border ${
                    isBestseller
                      ? "border-[#E6B84A] shadow-lg ring-2 ring-[#E6B84A]/30"
                      : "border-[#eadfce] shadow-sm"
                  } overflow-hidden hover:shadow-xl hover:border-forest/40 transition-all duration-300`}
                >
                  {/* Package Image Header if available */}
                  {pkg.image_url && (
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-forest/5">
                      <img
                        src={pkg.image_url}
                        alt={pkg.title}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Floating Badge on Top Left of Image */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {isBestseller ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest shadow-md">
                            <Sparkles className="h-3 w-3" />
                            {t("🔥 Bestseller", "🔥 Best Seller")}
                          </span>
                        ) : pkg.badge ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white border border-white/20">
                            {pkg.badge}
                          </span>
                        ) : null}
                      </div>

                      {/* Guest Count Pill on Top Right */}
                      {pkg.min_guests && (
                        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-forest shadow-sm">
                          {t(`Ab ${pkg.min_guests} Personen`, `Min. ${pkg.min_guests} guests`)}
                        </div>
                      )}

                      {/* Price Tag Overlay on Bottom Right of Image */}
                      <div className="absolute bottom-3 right-3 text-right text-white">
                        <div className="text-2xl font-bold font-display drop-shadow-md">
                          {pkg.price_amount > 0
                            ? `€${pkg.price_amount}`
                            : t("Auf Anfrage", "On Request")}
                        </div>
                        <div className="text-[11px] text-white/90 font-medium drop-shadow-sm">
                          {pkg.price_type === "per_person"
                            ? t("pro Gast", "per guest")
                            : t("Pauschal", "flat rate")}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {!pkg.image_url && (
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdfaf5] border border-[#eadfce] text-[11px] font-bold uppercase tracking-wide text-forest/80">
                            <ChefHat className="h-3.5 w-3.5 text-[#10b981]" />
                            {pkg.min_guests
                              ? t(`Ab ${pkg.min_guests} Personen`, `Min. ${pkg.min_guests} guests`)
                              : t("Event-Paket", "Event Package")}
                          </span>
                          <div className="text-right">
                            <div className="text-2xl font-bold font-display text-forest">
                              {pkg.price_amount > 0
                                ? `€${pkg.price_amount}`
                                : t("Auf Anfrage", "On Request")}
                            </div>
                            <div className="text-[11px] text-forest/60 font-medium">
                              {pkg.price_type === "per_person"
                                ? t("pro Gast", "per guest")
                                : t("Pauschal", "flat rate")}
                            </div>
                          </div>
                        </div>
                      )}

                      <h3 className="text-xl font-display font-bold text-forest group-hover:text-emerald-800 transition-colors">
                        {pkg.title}
                      </h3>

                      {pkg.short_summary && (
                        <p className="mt-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 rounded-lg px-2.5 py-1.5 border border-emerald-100">
                          {pkg.short_summary}
                        </p>
                      )}

                      <p className="mt-3 text-sm text-forest/80 leading-relaxed">
                        {pkg.description}
                      </p>

                      {pkg.included_items && pkg.included_items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#eadfce]/60">
                          <div className="text-xs font-bold text-forest/60 uppercase tracking-wider mb-2">
                            {t("Im Paket enthalten:", "Included in package:")}
                          </div>
                          <ul className="space-y-1.5">
                            {pkg.included_items.map((item: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-forest/80"
                              >
                                <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#eadfce]/60">
                      <button
                        onClick={() => {
                          setInquiryForm((prev) => ({
                            ...prev,
                            eventType: pkg.title,
                            notes: `[INTERESSE AN PAKET: ${pkg.title} (${pkg.price_amount > 0 ? `€${pkg.price_amount}/P` : "Auf Anfrage"})]\n\n`,
                            guestCount: Math.max(prev.guestCount, pkg.min_guests || 20),
                          }));
                          setInquiryModalOpen(true);
                        }}
                        className={`w-full flex items-center justify-center gap-2 rounded-full ${
                          isBestseller
                            ? "bg-[#083822] hover:bg-[#083822]/90 ring-2 ring-[#E6B84A]"
                            : "bg-forest hover:bg-forest/90"
                        } text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer`}
                      >
                        <span>{t("Dieses Paket anfragen", "Inquire this package")}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery Section with Lightbox */}
      {catererProfile.gallery && catererProfile.gallery.length > 0 && (
        <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-14">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/60 border border-[#eadfce] text-forest text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="h-3.5 w-3.5 text-forest/70" />
              {t("Live-Eindrücke & Buffets", "Live Impressions & Buffets")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
              {t("Impressionen & Catering-Setup", "Impressions & Catering Setup")}
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              {t(
                "Authentische Einblicke in unsere Live-Cooking-Stationen, warmen Buffets und Event-Momente. Klicken zum Vergrößern.",
                "Authentic insights into our live cooking stations, warm buffets, and event moments. Click to enlarge.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catererProfile.gallery.map((imgItem: any, idx: number) => (
              <div
                key={idx}
                onClick={() =>
                  setLightboxImg({
                    url: imgItem.url,
                    caption: imgItem.caption?.[lang] || imgItem.caption?.de || "",
                  })
                }
                className="group relative overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm hover:shadow-lg transition-all duration-300 aspect-[4/3] cursor-pointer"
              >
                <img
                  src={imgItem.url}
                  alt={imgItem.caption?.[lang] || "Catering Impression"}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/30">
                      🔍 {t("Vergrößern", "Zoom")}
                    </span>
                  </div>
                  <p className="text-white text-xs font-semibold leading-snug drop-shadow-md">
                    {imgItem.caption?.[lang] || imgItem.caption?.de || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          <Dialog open={!!lightboxImg} onOpenChange={(open) => !open && setLightboxImg(null)}>
            <DialogContent className="max-w-4xl p-2 bg-black/95 border-none text-white overflow-hidden rounded-2xl">
              <div className="relative flex flex-col items-center">
                {lightboxImg && (
                  <>
                    <img
                      src={lightboxImg.url}
                      alt={lightboxImg.caption || "Catering Impression"}
                      className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                    />
                    {lightboxImg.caption && (
                      <p className="mt-3 text-center text-sm font-medium text-cream/90 px-4 py-1">
                        {lightboxImg.caption}
                      </p>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </section>
      )}

      <section
        id="menu"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12 grid gap-8 lg:grid-cols-[1fr_22rem] pb-16 scroll-mt-24 w-full min-w-0 overflow-hidden"
      >
        <div className="min-w-0 w-full overflow-hidden">
          {dbCaterer?.seo_menu_or_packages_intro && (
            <div className="mb-6">
              <p className="text-base text-forest/80 max-w-3xl leading-relaxed whitespace-pre-wrap break-words">
                {dbCaterer.seo_menu_or_packages_intro}
              </p>
            </div>
          )}
          <h2 className="text-3xl font-display font-bold text-forest">
            {t("Speisekarte", "Menu")}
          </h2>
          <div className="mt-2 text-sm font-medium text-emerald-900 bg-emerald-50/90 px-3.5 py-2.5 rounded-xl border border-emerald-200/80 max-w-full flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <span>💡</span>
              <span>
                {t(
                  "Wunschgericht nicht gefunden? Vermerken Sie individuelle Speisenwünsche einfach in Ihrer Speisely-Anfrage.",
                  "Can't find a specific dish? Simply mention your custom requests in your Speisely inquiry.",
                )}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setInquiryForm((prev) => ({
                  ...prev,
                  notes: (prev.notes || "") + "[INDIVIDUELLES MENÜ / SONDERWUNSCH]\n\n",
                }));
                setInquiryModalOpen(true);
              }}
              className="text-xs font-bold text-forest underline hover:text-emerald-700 cursor-pointer transition-colors"
            >
              {t("Individuelle Anfrage stellen →", "Submit custom inquiry →")}
            </button>
          </div>
          <CategoryNav
            categories={categories}
            onSelect={(cat) => {
              document
                .getElementById(`category-${cat}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />

          <div className="mt-8 mb-8 p-4 sm:p-6 bg-[oklch(0.95_0.05_152)] rounded-xl border border-[oklch(0.85_0.05_152)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
            <div>
              <h3 className="font-display text-lg text-forest">
                {t("Gästeanzahl", "Guest Count")}
              </h3>
              <p className="text-sm text-forest/70">
                {t("Gästeanzahl für Ihre Anfrage", "Number of guests for your enquiry")}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white p-1 rounded-full shadow-sm border border-[oklch(0.85_0.05_152)] w-fit">
              <button
                onClick={() => setGuests(Math.max(1, guests - 5))}
                className="h-10 w-10 grid place-items-center rounded-full text-forest hover:bg-[#eadfce] transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-transparent border-none text-lg font-semibold text-forest focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setGuests(guests + 5)}
                className="h-10 w-10 grid place-items-center rounded-full text-forest hover:bg-[#eadfce] transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-8 space-y-10 w-full min-w-0">
            {categories.map((cat) => (
              <div key={cat} id={`category-${cat}`} className="scroll-mt-32 w-full min-w-0">
                <h3 className="font-display text-2xl text-forest">{cat}</h3>
                <div className="mt-4 grid gap-4 w-full min-w-0">
                  {catererProfile.menu
                    .filter((m: any) => (m.category || "Menü") === cat)
                    .map((m: any) => {
                      const qty = cart[m.name] || 0;
                      return (
                        <div
                          key={m.name}
                          className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-[#eadfce] rounded-xl shadow-sm hover:shadow-md hover:border-forest/30 transition-all duration-300 group items-start sm:items-center w-full min-w-0 overflow-hidden"
                        >
                          <div className="min-w-0 flex flex-row gap-3 sm:gap-4 items-start w-full">
                            {m.image_signed_url && (
                              <div className="shrink-0">
                                <img
                                  src={m.image_signed_url}
                                  alt=""
                                  className="h-20 w-20 sm:h-28 sm:w-28 object-cover rounded-lg border border-[#eadfce]/50"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 w-full">
                              <h4 className="font-display text-base sm:text-lg font-bold text-forest leading-snug break-words">
                                {m.name}
                              </h4>
                              {m.desc[lang] && (
                                <p className="text-xs sm:text-sm text-forest/70 mt-1 leading-relaxed max-w-xl break-words">
                                  {m.desc[lang]}
                                </p>
                              )}
                              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                <p className="text-sm sm:text-base font-semibold text-forest">
                                  {m.price > 0
                                    ? `€${m.price.toFixed(2)}`
                                    : t("Preis auf Anfrage", "Price on request")}
                                </p>
                                {m.price > 0 && m.serves && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fdfaf5] px-2 py-0.5 text-[11px] font-medium text-forest/70 border border-[#eadfce]/60">
                                    <Users className="h-3 w-3" />{" "}
                                    {t(`~${m.serves} Pers.`, `~${m.serves} pax`)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end sm:justify-center items-center pt-2 sm:pt-0 border-t border-[#eadfce]/30 sm:border-0 w-full sm:w-auto">
                            {qty === 0 ? (
                              <button
                                onClick={() =>
                                  updateQty(m.name, m.unit.en === "person" ? guests : 1)
                                }
                                className="h-10 px-5 rounded-full bg-[#eadfce] text-forest hover:bg-forest hover:text-white transition whitespace-nowrap text-sm font-semibold pulse-btn"
                              >
                                {t("Hinzufügen", "Add")}
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-1 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-1.5 h-10">
                                <button
                                  onClick={() => updateQty(m.name, qty - 1)}
                                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10"
                                  aria-label="-"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  value={qty}
                                  onChange={(e) => updateQty(m.name, parseInt(e.target.value) || 0)}
                                  className="w-10 text-center bg-transparent border-none text-sm font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white text-forest"
                                />
                                <button
                                  onClick={() => updateQty(m.name, qty + 1)}
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
            ))}
          </div>
        </div>

        {/* Sidebar Section */}
        <aside id="sidebar-section" className="hidden lg:block h-fit sticky top-24 w-full">
          <div className="bg-white rounded-2xl border border-[#eadfce] shadow-xl shadow-forest/5 p-6">
            {renderSidebar()}
            <div className="mt-6 flex flex-col gap-2 pt-6 border-t border-[#eadfce]/60">
              <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
                <ShieldCheck className="h-4 w-4 text-forest" />
                {t("100% sichere Buchung über Speisely", "100% secure booking via Speisely")}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                {t("Kostenlos anfragen, unverbindlich", "Request for free, no obligation")}
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
                  "Stelle dein Wunschmenü oder Paket aus dem Angebot zusammen.",
                  "Put together your desired menu or package from the selection.",
                )}
              </p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-forest mb-4 z-10">
                2
              </div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Anfragen", "Request")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">
                {t(
                  "Sende eine unverbindliche Anfrage direkt an den Caterer.",
                  "Send a non-binding request directly to the caterer.",
                )}
              </p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-forest mb-4 z-10">
                3
              </div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Genießen", "Enjoy")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">
                {t(
                  "Details klären, sicher buchen und ein tolles Event erleben.",
                  "Clarify details, book securely and enjoy a great event.",
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
              {finalTotal > 0
                ? `${t("Gesamt", "Total")}: ab €${finalTotal.toFixed(2)}`
                : t("Preis auf Anfrage", "Price on request")}
            </div>
          </div>
          <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
            <SheetTrigger asChild>
              <button className="rounded-full bg-[#22C55E] text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[#22C55E]/90 transition cursor-pointer">
                {t("Angebot anzeigen", "View order")}
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] bg-[#fdfaf5] text-forest border-t border-[#eadfce] rounded-t-2xl px-4 py-6 overflow-y-auto"
            >
              <SheetHeader className="text-left mb-4">
                <SheetTitle className="flex items-center gap-2 font-display text-xl text-forest">
                  <ShoppingBag className="h-5 w-5 text-forest" />
                  {t("Deine Anfrage", "Your Inquiry")}
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
                  <span className="text-forest/80">{t("Zuverlässigkeit", "Reliability")}</span>
                  <span className="font-semibold text-forest">
                    {aggregates.avgReliability.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/80">{t("Kommunikation", "Communication")}</span>
                  <span className="font-semibold text-forest">
                    {aggregates.avgCommunication.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest/80">{t("Preis-Leistung", "Value")}</span>
                  <span className="font-semibold text-forest">
                    {aggregates.avgValue.toFixed(1)}
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
                      <div className="flex items-center gap-2 text-xs text-forest/60">
                        <span>{new Date(r.created_at).toLocaleDateString()}</span>
                        {r.event_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{r.event_type}</span>
                          </>
                        )}
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
                        {catererProfile?.name}
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
                "Sei der Erste, der diesen Caterer bewertet.",
                "Be the first to review this caterer.",
              )}
            </p>
          </div>
        )}
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 mt-16 mb-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 px-3 py-1 text-xs font-semibold text-forest/80 uppercase tracking-wider mb-2 border border-forest/10">
            <HelpCircle className="w-3.5 h-3.5 text-[#E6B84A]" />
            {t("Häufig gestellte Fragen", "Frequently Asked Questions")}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-forest tracking-tight">
            {t(
              `FAQ & Buchungsablauf mit ${catererProfile?.name}`,
              `FAQ & Booking Process with ${catererProfile?.name}`,
            )}
          </h2>
          <p className="mt-2 text-sm text-forest/70 max-w-2xl mx-auto">
            {t(
              "Wichtige Informationen zu Equipment, Zubereitung vor Ort und der sicheren Buchungsabwicklung über Speisely.",
              "Key information regarding equipment, on-site catering prep, and secure booking management via Speisely.",
            )}
          </p>
        </div>

        <div className="space-y-3">
          {(catererProfile?.slug === "kampala-rolex-germany"
            ? [
                {
                  q: t(
                    "Wie viel Platz und welche Anschlüsse benötigt die Live-Rolex-Station vor Ort?",
                    "How much space and power connections does the Live Rolex Station require on-site?",
                  ),
                  a: t(
                    "Für die mobile Live-Cooking-Station wird eine ebene Stellfläche von ca. 2×2 Metern sowie ein gewöhnlicher 230V-Haushaltsstromanschluss benötigt. Kampala Rolex Germany bringt die traditionelle Chapati-Grillplatte (Tawa), Vorbereitungstische und professionelle Chafing Dishes direkt mit. Für Outdoor-Events oder Feiern ohne feste Kücheninfrastruktur kann das Catering alternativ auch autark über den Foodtruck realisiert werden.",
                    "For the mobile live cooking station, an even surface of approx. 2x2 meters and a standard 230V domestic power outlet are required. Kampala Rolex Germany brings the traditional chapati griddle (Tawa), prep tables, and professional chafing dishes directly to your location. For outdoor events or venues without kitchen facilities, catering can alternatively operate fully self-sufficiently from the food truck.",
                  ),
                },
                {
                  q: t(
                    "Welche Ernährungsformen (z.B. vegetarisch) können flexibel berücksichtigt werden?",
                    "Which dietary preferences (e.g. vegetarian) can be accommodated?",
                  ),
                  a: t(
                    "Auf Wunsch bereitet das Team frische vegetarische Rolex-Variationen mit verquirltem Ei, feingehacktem Gemüsekohl, Tomaten und roten Zwiebeln sowie rein pflanzliche Beilagen zu. Geben Sie besondere Ernährungswünsche oder Unverträglichkeiten einfach bei Ihrer unverbindlichen Speisely-Anfrage an – die Menüauswahl wird vor der finalen Bestätigung individuell abgestimmt.",
                    "Upon request, the team prepares freshly rolled vegetarian Rolex variations with eggs, shredded cabbage, tomatoes, and red onions, alongside plant-based sides. Simply specify any dietary requirements or allergies in your non-binding Speisely inquiry – the menu will be customized before final confirmation.",
                  ),
                },
                {
                  q: t(
                    "Bringt der Caterer Warmhaltebehälter & Equipment für das Buffet mit?",
                    "Does the caterer bring chafing dishes and equipment for the buffet?",
                  ),
                  a: t(
                    "Ja! Professionelle Chafing Dishes für den Warmhalteservice sowie passendes Vorlegebesteck sind bei den Buffet-Paketen inklusive. Speisen wie aromatisches Beef Stew, würziger Pilau-Reis und knusprige Samosas bleiben so über die gesamte Veranstaltungsdauer heiß, saftig und ansprechend präsentiert.",
                    "Yes! Professional chafing dishes for hot holding service as well as serving cutlery are included in the buffet packages. Dishes such as flavorful beef stew, spiced pilau rice, and crisp samosas stay hot, tender, and appetizing throughout your entire event.",
                  ),
                },
                {
                  q: t(
                    "Wie läuft die Buchung und Abstimmung über Speisely ab?",
                    "How does the booking and coordination process work via Speisely?",
                  ),
                  a: t(
                    "1. Unverbindliche Anfrage stellen (Datum, Gästezahl & Wunschpaket angeben).\n2. Das Speisely-Catering-Team prüft die Terminkapazität direkt mit Kampala Rolex Germany und klärt alle Details.\n3. Sie erhalten ein maßgeschneidertes Angebot mit verbindlichen Konditionen und Speisely-Käuferschutz.\n4. Nach Ihrer Freigabe ist Ihr Wunschtermin fest reserviert.",
                    "1. Submit a non-binding inquiry (enter date, guest count & preferred package).\n2. The Speisely concierge team verifies availability directly with Kampala Rolex Germany and aligns all details.\n3. You receive a tailored proposal with clear terms and Speisely buyer protection.\n4. Once confirmed, your event slot is securely locked in.",
                  ),
                },
              ]
            : [
                {
                  q: t(
                    "Wie läuft die Buchung und Abstimmung über Speisely ab?",
                    "How does the booking and coordination process work via Speisely?",
                  ),
                  a: t(
                    "Über Speisely stellen Sie Ihre Anfrage kostenfrei und unverbindlich. Unser Concierge-Team prüft die Verfügbarkeit beim Caterer, stimmt Menüwünsche und Logistik ab und übermittelt Ihnen ein transparentes Komplettangebot.",
                    "Submit your request through Speisely completely free and without obligation. Our concierge team confirms vendor availability, aligns logistics and dietary requests, and presents a transparent turnkey proposal.",
                  ),
                },
                {
                  q: t(
                    "Wie kurzfristig kann ich ein Catering anfragen?",
                    "How far in advance should I request catering?",
                  ),
                  a: t(
                    "Für größere Veranstaltungen und Live-Stationen empfehlen wir eine Vorlaufzeit von mindestens 7 bis 14 Tagen. Kurzfristige Anfragen prüfen wir nach individueller Kapazität gern im Express-Verfahren.",
                    "For larger events and live cooking setups, we recommend a lead time of at least 7 to 14 days. Express short-notice requests can also be accommodated depending on date availability.",
                  ),
                },
                {
                  q: t(
                    "Können Allergien und individuelle Sonderwünsche berücksichtigt werden?",
                    "Can allergies and customized requests be accommodated?",
                  ),
                  a: t(
                    "Selbstverständlich. Vermerken Sie Lebensmittelallergien, vegetarische oder vegane Anteile einfach im Notizfeld Ihrer Anfrage. Der Caterer passt die Menüs entsprechend an.",
                    "Absolutely. Simply note food allergies, vegetarian, or vegan guest portions in the inquiry notes. The caterer adjusts ingredients and portions accordingly.",
                  ),
                },
                {
                  q: t(
                    "Welche Sicherheit bietet die Buchung über Speisely?",
                    "What protection does booking through Speisely offer?",
                  ),
                  a: t(
                    "Mit Speisely genießen Sie volle Preistransparenz ohne versteckte Aufschläge, verbindliche Leistungszusagen und eine persönliche Ansprechperson im Kundensupport bis zum erfolgreichen Abschluss Ihres Events.",
                    "With Speisely you receive 100% price transparency with zero hidden markups, binding service assurances, and dedicated concierge support right through the conclusion of your event.",
                  ),
                },
              ]
          ).map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-[#eadfce] bg-white p-5 transition-all duration-200 hover:border-[#183B29]/30 open:border-[#183B29]/40 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-forest text-base sm:text-lg select-none">
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fdfaf5] text-xs font-bold text-forest/70 border border-[#eadfce]">
                    {idx + 1}
                  </span>
                  <span>{item.q}</span>
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-forest/50 transition-transform duration-200 group-open:rotate-180 ml-2" />
              </summary>
              <div className="mt-3 pt-3 border-t border-[#eadfce]/50 text-sm text-forest/80 leading-relaxed pl-10 whitespace-pre-line">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Inquiry Details Modal (Asks for Contact Info, Event Date & Delivery Location/Postal Code) */}
      <Dialog open={inquiryModalOpen} onOpenChange={setInquiryModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#fdfaf5] text-forest border-[#eadfce] p-6 rounded-3xl text-left max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-forest">
              {t(
                `Anfrage an ${catererProfile?.name} senden`,
                `Send Enquiry to ${catererProfile?.name}`,
              )}
            </DialogTitle>
            <p className="text-xs text-forest/70">
              {t(
                `Geben Sie Ihre Event- und Kontaktdaten an. Das Speisely-Catering-Team prüft Ihre Anfrage, stimmt die Verfügbarkeit ab und meldet sich persönlich bei Ihnen.`,
                `Provide your event details and contact info. The Speisely catering team will review your inquiry, verify availability, and get in touch with you.`,
              )}
            </p>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                !inquiryForm.customerEmail ||
                !inquiryForm.customerName ||
                !inquiryForm.customerPhone
              ) {
                toast.error(
                  t(
                    "Bitte geben Sie Ihren Namen, Ihre E-Mail-Adresse und Ihre Telefonnummer an.",
                    "Please provide your name, email address, and phone number.",
                  ),
                );
                return;
              }

              const currentTotalCount = totalCount;
              const currentTotalAmount = finalTotal;

              try {
                setSubmittingBrief(true);
                const itemsText = cartItems
                  .map((i) =>
                    i.price > 0
                      ? `- ${i.qty}x ${i.name} (€${(i.price * i.qty).toFixed(2)})`
                      : `- ${i.qty}x ${i.name}`,
                  )
                  .join("\n");

                const totalStr = "Preis auf Anfrage";
                const notes = `[ONLINE STOREFRONT ENQUIRY]\nCustomer Name: ${inquiryForm.customerName}\nCustomer Email: ${inquiryForm.customerEmail}\nCustomer Phone: ${inquiryForm.customerPhone || "N/A"}\nEvent Type: ${inquiryForm.eventType}\nDelivery Location: ${inquiryForm.postalCodeCity}\nSelected Items:\n${itemsText}\n\nNotes:\n${inquiryForm.notes || "None"}\n\nPreis: ${totalStr}`;

                let formattedDate =
                  inquiryForm.eventDate ||
                  new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
                if (formattedDate) {
                  const parts = formattedDate.split(/[\/\.-]/);
                  if (parts.length === 3 && parts[0].length <= 2 && parts[2].length === 4) {
                    formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
                  }
                }

                await submitBrief({
                  data: {
                    catererId: catererProfile?.id || slug || "veedos-kitchen",
                    eventType: inquiryForm.eventType || "Event / Feier",
                    eventDate: formattedDate,
                    guestCount: inquiryForm.guestCount || currentTotalCount || 10,
                    budgetCents: 0,
                    location:
                      inquiryForm.postalCodeCity || catererProfile?.area || "Berlin & Umgebung",
                    notes,
                    customerName: inquiryForm.customerName,
                    customerEmail: inquiryForm.customerEmail,
                    customerPhone: inquiryForm.customerPhone,
                  },
                });

                trackEvent("reservation_submitted", {
                  catererId: catererProfile?.id || "unknown",
                  type: "catering",
                  isB2b: false,
                  totalCount: currentTotalCount,
                  finalTotal: 0,
                });

                toast.success(
                  t(
                    "Catering-Anfrage erfolgreich an Speisely übermittelt! Unser Team prüft Ihre Anfrage und meldet sich zeitnah.",
                    "Catering inquiry sent successfully to Speisely! Our team will review your request and get back to you shortly.",
                  ),
                );
                setSubmittedSummary({ count: currentTotalCount, total: currentTotalAmount });
                setInquiryModalOpen(false);
                setSuccessModalOpen(true);
                setCart({});
                if (window.innerWidth < 768) setMobileCartOpen(false);
              } catch (err: any) {
                toast.error(
                  t("Fehler beim Senden der Anfrage: ", "Error sending inquiry: ") + err.message,
                );
              } finally {
                setSubmittingBrief(false);
              }
            }}
            className="space-y-4 mt-3"
          >
            {/* Customer Contact Section */}
            <div className="p-3.5 rounded-2xl bg-cream/30 border border-[#eadfce]/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/70">
                  👤 {t("Ihre Kontaktdaten", "Your Contact Info")}
                </span>
                {userSession ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ✓ {t("Angemeldet", "Logged In")}
                  </span>
                ) : (
                  <Link
                    to="/auth"
                    search={{
                      redirect:
                        typeof window !== "undefined" ? window.location.pathname : "/catering",
                    }}
                    className="text-[10px] text-forest underline hover:text-emerald-700 font-semibold"
                  >
                    {t("Bereits Kunde? Anmelden", "Already have an account? Sign In")}
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-forest">
                    {t("Vollständiger Name *", "Full Name *")}
                  </Label>
                  <Input
                    required
                    placeholder="z.B. Max Mustermann"
                    value={inquiryForm.customerName}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, customerName: e.target.value })
                    }
                    className="bg-white border-[#eadfce] text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-forest">
                    {t("E-Mail-Adresse *", "Email Address *")}
                  </Label>
                  <Input
                    type="email"
                    required
                    placeholder="max@beispiel.de"
                    value={inquiryForm.customerEmail}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, customerEmail: e.target.value })
                    }
                    className="bg-white border-[#eadfce] text-xs h-9"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-bold text-forest">
                    {t(
                      "Telefonnummer (für Speisely-Rückfragen) *",
                      "Phone Number (for Speisely inquiry coordination) *",
                    )}
                  </Label>
                  <Input
                    type="tel"
                    required
                    placeholder="+49 176 12345678"
                    value={inquiryForm.customerPhone}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, customerPhone: e.target.value })
                    }
                    className="bg-white border-[#eadfce] text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Event Logistics Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-forest">
                  {t("Event-Datum *", "Event Date *")}
                </Label>
                <Input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={inquiryForm.eventDate}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, eventDate: e.target.value })}
                  className="bg-white border-[#eadfce] text-xs h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-forest">
                  {t("PLZ / Lieferort *", "Postal Code / City *")}
                </Label>
                <Input
                  required
                  placeholder="z.B. 41061 Mönchengladbach"
                  value={inquiryForm.postalCodeCity}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, postalCodeCity: e.target.value })
                  }
                  className="bg-white border-[#eadfce] text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-forest">
                  {t("Gästeanzahl", "Guest Count")}
                </Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={inquiryForm.guestCount}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    setInquiryForm({
                      ...inquiryForm,
                      guestCount:
                        rawVal === "" ? ("" as any) : Math.max(1, parseInt(rawVal, 10) || 1),
                    });
                  }}
                  className="bg-white border-[#eadfce] text-xs h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-forest">
                  {t("Anlass / Event-Typ", "Occasion / Event Type")}
                </Label>
                <Select
                  value={inquiryForm.eventType}
                  onValueChange={(val) => setInquiryForm({ ...inquiryForm, eventType: val })}
                >
                  <SelectTrigger className="bg-white border-[#eadfce] text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                    <SelectItem value="Familienfeier / Event">Familienfeier / Event</SelectItem>
                    <SelectItem value="Geburtstag">Geburtstag</SelectItem>
                    <SelectItem value="Hochzeit">Hochzeit</SelectItem>
                    <SelectItem value="Firmen-Event">Firmen-Event</SelectItem>
                    <SelectItem value="Private Dinner">Private Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-forest">
                {t("Zusätzliche Wünsche (optional)", "Special Notes (Optional)")}
              </Label>
              <Textarea
                rows={2}
                placeholder={t(
                  "Besondere Hinweise zur Anlieferung, Allergien etc...",
                  "Delivery notes, dietary requests...",
                )}
                value={inquiryForm.notes}
                onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                className="bg-white border-[#eadfce] text-xs"
              />
            </div>

            <button
              disabled={submittingBrief}
              type="submit"
              className="mt-2 w-full rounded-full bg-forest text-white py-3 font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {submittingBrief ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("Anfrage jetzt verbindlich senden", "Confirm & Send Inquiry")}
                </>
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Premium Success Confirmation Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[460px] bg-[#fdfaf5] text-forest border-[#eadfce] text-center p-8 rounded-3xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#22C55E]/15 grid place-items-center mb-4 text-[#22C55E]">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <DialogTitle className="font-display text-2xl text-forest text-center">
            {t("Anfrage erfolgreich gesendet!", "Inquiry Successfully Sent!")}
          </DialogTitle>
          <p className="mt-2 text-sm text-forest/80 leading-relaxed text-center">
            {t(
              `Deine Anfrage wurde direkt an ${catererProfile?.name} übermittelt. Der Caterer prüft die Verfügbarkeit und meldet sich in Kürze bei dir.`,
              `Your inquiry has been sent directly to ${catererProfile?.name}. The caterer will confirm availability and get back to you shortly.`,
            )}
          </p>
          {submittedSummary.total > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#eadfce]/70 text-left text-xs space-y-1.5 shadow-sm">
              <div className="flex justify-between font-medium text-forest">
                <span>{t("Anzahl Artikel", "Item Count")}:</span>
                <span className="font-semibold">{submittedSummary.count}</span>
              </div>
              <div className="flex justify-between font-medium text-forest">
                <span>{t("Gesamtsumme (ca.)", "Total (approx.)")}:</span>
                <span className="font-semibold text-base text-[#22C55E]">
                  €{submittedSummary.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Account Onboarding Box for Customers */}
          <div className="mt-4 p-4 rounded-2xl bg-forest/5 border border-forest/15 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-forest">
              <span>✉️</span>
              <span>
                {t(
                  `Kunden-Konto hinterlegt für ${inquiryForm.customerEmail || "deine E-Mail"}`,
                  `Customer account linked for ${inquiryForm.customerEmail || "your email"}`,
                )}
              </span>
            </div>
            <p className="text-forest/75 text-[11px] leading-relaxed">
              {t(
                "Melde dich auf Speisely an, um den Bearbeitungsstand deiner Anfrage zu verfolgen, Angebote einzusehen und direkt mit dem Caterer zu chatten.",
                "Log into Speisely to track your inquiry status, review proposals, and message the caterer directly.",
              )}
            </p>
            <Link
              to="/auth"
              search={{ redirect: "/customer" } as any}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-forest underline hover:text-emerald-700"
            >
              <span>
                {t("Zum Kunden-Dashboard / Anmelden", "Go to Customer Dashboard / Sign In")}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            onClick={() => setSuccessModalOpen(false)}
            className="mt-6 w-full rounded-full bg-forest text-white py-3 font-semibold shadow-md hover:bg-forest/90 transition cursor-pointer"
          >
            {t("Super, danke!", "Awesome, thanks!")}
          </button>
        </DialogContent>
      </Dialog>

      <MarketplacePromiseCTA vertical="caterer" />
    </SiteShell>
  );
}
