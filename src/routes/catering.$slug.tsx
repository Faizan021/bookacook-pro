import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { trackEvent } from "@/utils/posthog";
import { MapPin, Star, Clock, Plus, Minus, ArrowLeft, Phone, ShoppingBag, Users, Globe, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { CategoryNav } from "@/components/ui/CategoryNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/I18nProvider";
import { getCaterer, mockPromoCodes, PromoCode } from "@/data/caterers";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";

const catererQueryOptions = (slug: string) => queryOptions({
  queryKey: ["catererProfile", slug],
  queryFn: () => getPublicCatererProfile({ data: { slug } }),
});
export const Route = createFileRoute("/catering/$slug")({
  head: ({ loaderData, params }) => {
    const c = loaderData?.fullCaterer;
    const city = c?.area ?? "Deutschland";
    const rawDesc = c
      ? `Professionelles Catering von ${c.name} in ${city}. Jetzt Anfrage stellen auf Speisely.`
      : "Caterer auf Speisely – Catering für Events, Firmen & Hochzeiten.";
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "..." : rawDesc;
    const title = c
      ? `${c.name} – Catering in ${city} | Speisely`
      : "Catering – Speisely";
    const ogImage = c?.img ?? "https://speisely.de/og-default.jpg";
    const canonicalUrl = `https://speisely.de/catering/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: c ? `${c.name} – Catering auf Speisely` : title },
        { property: "og:description", content: "Catering für Events, Firmen & Hochzeiten. Jetzt Angebot anfordern." },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: c
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              name: c.name,
              image: c.img,
              address: { "@type": "PostalAddress", addressLocality: c.area },
            }),
          }]
        : undefined,
    };
  },
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(catererQueryOptions(params.slug));
    const fullCaterer = await getCaterer(params.slug);
    return { fullCaterer };
  },
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
  const q = useSuspenseQuery(catererQueryOptions(slug));

  const { fullCaterer } = Route.useLoaderData();
  const staticCaterer = fullCaterer;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [guests, setGuests] = useState(staticCaterer?.minGuests || 10);

  const recordView = useServerFn(recordPageView);
  const submitBrief = useServerFn(submitCateringBrief);

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
    notes: ""
  });
  const [submittingB2b, setSubmittingB2b] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  // TODO: Connect this mock review UI to the real Supabase reviews table later
  const reviews: any[] = [];

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  const dbCaterer = q.data as any;

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.termsAccepted) {
      alert(t("Bitte akzeptieren Sie die Plattformbedingungen.", "Please accept the platform terms."));
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
            eventDate: b2bForm.startDate || new Date().toISOString().split('T')[0],
            guestCount: parseInt(b2bForm.employees),
            budgetCents: parseInt(b2bForm.employees) * 15 * 100, // Estimate €15 per head per day
            location: "Corporate Office",
            notes: notesWithContact,
            isB2b: true,
            companyName: b2bForm.companyName,
            isRecurring: true,
            recurrencePattern: b2bForm.pattern,
          }
        });
      } else {
        // Mock submission for static caterers
        await new Promise(res => setTimeout(res, 800));
      }
      
      trackEvent("reservation_submitted", { catererId: caterer?.id || "unknown", type: "catering", isB2b: true });
      alert(t("Unternehmensanfrage erfolgreich gesendet! Der Caterer wird sich melden.", "Corporate request sent successfully! The caterer will be in touch."));
      setB2bOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingB2b(false);
    }
  };

  useEffect(() => {
    if (dbCaterer?.id) {
      recordView({ data: { vendorId: dbCaterer.id, vendorType: "caterer", url: window.location.pathname } })
        .catch(e => console.error("Tracking error", e));
    }
  }, [dbCaterer?.id]);
  
  let dbImg = null;
  if (dbCaterer?.banner_image_url) {
    if (dbCaterer.banner_image_url.startsWith("http")) {
      dbImg = dbCaterer.banner_image_url;
    } else {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://athwccvgdovglcpluwnu.supabase.co";
      dbImg = `${supabaseUrl}/storage/v1/object/public/storefront-assets/${dbCaterer.banner_image_url}`;
    }
  }

  // Construct a unified caterer object
  let caterer: any = null;
  
  if (dbCaterer) {
    caterer = {
      id: dbCaterer.id,
      name: dbCaterer.name,
      slug: dbCaterer.slug,
      tagline: { 
        de: dbCaterer.description || "Individuelle Catering-Erlebnisse", 
        en: dbCaterer.description || "Custom catering experiences" 
      },
      rating: 5.0,
      minOrder: dbCaterer.min_delivery_cents ? dbCaterer.min_delivery_cents / 100 : 0,
      minBudget: dbCaterer.min_delivery_cents ? dbCaterer.min_delivery_cents / 100 : 0,
      leadTimeDays: 7,
      minGuests: 10,
      img: dbImg || "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
      area: dbCaterer.service_areas || "Berlin",
      address: dbCaterer.business_address || "",
      phone: dbCaterer.phone || "",
      about: { 
        de: dbCaterer.description || "", 
        en: dbCaterer.description || "" 
      },
      menu: (dbCaterer.menu || []).map((m: any) => ({
        name: m.name,
        category: m.category,
        desc: { de: m.description || "", en: m.description || "" },
        price: m.price_cents / 100,
        unit: { de: m.unit, en: m.unit },
        serves: m.serves,
        image_signed_url: m.image_signed_url,
      })),
      announcement_active: dbCaterer.announcement_active,
      announcement_text: dbCaterer.announcement_text,
      announcement_bg_color: dbCaterer.announcement_bg_color,
      certifications: dbCaterer.certifications || "",
    };
  } else if (staticCaterer) {
    caterer = {
      ...staticCaterer,
      minBudget: staticCaterer.minOrder || 0,
      certifications: (staticCaterer as any).certifications || "",
      menu: staticCaterer.menu || [],
    };
  }

  const storefrontUrl = dbCaterer?.custom_domain 
    ? `https://${dbCaterer.custom_domain}` 
    : `https://${dbCaterer?.slug || slug}.speisely.de`;

  const categories = useMemo(() => {
    if (!caterer) return [];
    const seen = new Set<string>();
    const cats: string[] = [];
    (caterer.menu || []).forEach((m: any) => {
      const c = m.category || "Menü";
      if (!seen.has(c)) {
        seen.add(c);
        cats.push(c);
      }
    });
    return cats;
  }, [caterer]);

  const certBadges = useMemo(() => {
    if (!caterer?.certifications) return [];
    return String(caterer.certifications)
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
  }, [caterer?.certifications]);

  const maxBadges = 5;
  const visibleBadges = certBadges.slice(0, maxBadges);
  const remainingCount = certBadges.length - maxBadges;

  if (!caterer) return (
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
    const item = caterer.menu.find((m: any) => m.name === name)!;
    return { ...item, qty };
  });
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  
  const belowMin = subtotal > 0 && subtotal < caterer.minBudget;

  const handleApplyPromo = () => {
    setPromoError("");
    const codes = mockPromoCodes[caterer.id] || [];
    const validCode = codes.find(c => c.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (validCode) {
      setAppliedPromo(validCode);
      setPromoCodeInput("");
    } else {
      setPromoError(t("Ungültiger Code", "Invalid code"));
    }
  };
  const handleRemovePromo = () => setAppliedPromo(null);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === "percentage") {
      discountAmount = subtotal * (appliedPromo.discount_value / 100);
    } else {
      discountAmount = appliedPromo.discount_value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
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
          {t("👆 Füge Artikel hinzu, um dein Angebot zu starten", "👆 Add items to start your quote")}
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
                <span className="text-sm font-medium text-forest">€{(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Zwischensumme", "Subtotal")}</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          {appliedPromo ? (
            <div className="mt-3 flex items-center justify-between text-sm text-[oklch(0.55_0.15_30)] bg-[oklch(0.95_0.05_30)] p-2.5 rounded-lg border border-[oklch(0.85_0.15_30)]">
              <div className="flex flex-col">
                <span className="font-semibold">{t("Gutschein", "Voucher")}: {appliedPromo.code}</span>
                <span className="text-xs">
                  {appliedPromo.discount_type === "percentage" ? `-${appliedPromo.discount_value}%` : `-€${appliedPromo.discount_value.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">-€{discountAmount.toFixed(2)}</span>
                <button onClick={handleRemovePromo} className="text-[oklch(0.55_0.15_30)] hover:text-black">
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
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full rounded-md border border-[oklch(0.85_0.05_152)] px-3 py-1.5 text-sm focus:border-forest focus:outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="rounded-md bg-[#eadfce] px-3 py-1.5 text-sm font-semibold text-forest hover:bg-[#eadfce]/80 whitespace-nowrap"
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

          {belowMin && (
            <p className="mt-2 text-xs text-[oklch(0.55_0.15_30)]">
              {t(
                `Noch €${(caterer.minBudget - subtotal).toFixed(0)} bis zum Mindestbudget.`,
                `€${(caterer.minBudget - subtotal).toFixed(0)} more to reach the min. budget.`,
              )}
            </p>
          )}
          <button
            disabled={belowMin}
            onClick={() => {
              trackEvent("reservation_submitted", { catererId: caterer.id, type: "catering", isB2b: false, totalCount, finalTotal });
              alert(
                t(
                  `Anfrage über ${totalCount} Artikel gesendet. ${caterer.name} meldet sich in Kürze.`,
                  `Inquiry sent for ${totalCount} items. ${caterer.name} will get back to you shortly.`,
                ),
              );
              if (isMobile) setMobileCartOpen(false);
            }}
            className="mt-5 w-full rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white py-3 font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Anfrage senden", "Send inquiry")} · ab €{finalTotal.toFixed(2)}
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
                  "Set up recurring catering for your office. Perfect for team lunches, meetings, and more."
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
                  onChange={e => setB2bForm(prev => ({ ...prev, companyName: e.target.value }))}
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
                    onChange={e => setB2bForm(prev => ({ ...prev, employees: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("Rhythmus", "Frequency")}</Label>
                  <Select value={b2bForm.pattern} onValueChange={v => setB2bForm(prev => ({ ...prev, pattern: v }))}>
                    <SelectTrigger className="bg-white border-[#eadfce]"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                      <SelectItem value="daily">{t("Täglich (Mo-Fr)", "Daily (Mon-Fri)")}</SelectItem>
                      <SelectItem value="weekly">{t("Einmal pro Woche", "Once a week")}</SelectItem>
                      <SelectItem value="biweekly">{t("Alle zwei Wochen", "Bi-weekly")}</SelectItem>
                      <SelectItem value="monthly">{t("Einmal pro Monat", "Once a month")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("Gewünschter Start", "Desired Start Date")}</Label>
                <Input 
                  type="date" 
                  required 
                  className="bg-white border-[#eadfce]"
                  value={b2bForm.startDate} 
                  onChange={e => setB2bForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("Zusätzliche Wünsche", "Additional Notes")}</Label>
                <Textarea 
                  rows={3} 
                  className="bg-white border-[#eadfce]"
                  value={b2bForm.notes} 
                  onChange={e => setB2bForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={t("z.B. 30% vegetarisch, 10% vegan...", "e.g., 30% vegetarian, 10% vegan...")} 
                />
              </div>
              <button 
                disabled={submittingB2b} 
                type="submit" 
                className="mt-4 w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submittingB2b ? t("Senden...", "Sending...") : t("Anfrage absenden", "Submit B2B Request")}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

  return (
    <SiteShell>
      <AnnouncementBanner
        isActive={caterer.announcement_active ?? false}
        text={caterer.announcement_text ?? null}
        bgColor={caterer.announcement_bg_color ?? null}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8">
        <Link to="/catering" className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest">
          <ArrowLeft className="h-4 w-4" /> {t("Zurück zu Catering", "Back to catering")}
        </Link>

        {/* Redesigned Full-Width Hero Banner */}
        <div className="relative mt-6 w-full h-[300px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={caterer.img}
            alt={caterer.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={420}
          />
          {/* Dark gradient overlay */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}
          />

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 sm:gap-3">
            {caterer.verified && (
              <span className="rounded-full bg-[#10b981] px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-md flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {t("GEPRÜFT", "CHECKED")}
              </span>
            )}
            <button
              onClick={scrollToMenu}
              className="group flex items-center gap-1.5 rounded-full bg-[#10b981] hover:bg-[#10b981]/90 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              {t("Anfrage senden", "Send request")}
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
                      "Set up recurring catering for your office. Perfect for team lunches, meetings, and more."
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
                      onChange={e => setB2bForm(prev => ({ ...prev, companyName: e.target.value }))}
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
                        onChange={e => setB2bForm(prev => ({ ...prev, employees: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t("Rhythmus", "Frequency")}</Label>
                      <Select value={b2bForm.pattern} onValueChange={v => setB2bForm(prev => ({ ...prev, pattern: v }))}>
                        <SelectTrigger className="bg-white border-[#eadfce]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                          <SelectItem value="daily">{t("Täglich (Mo-Fr)", "Daily (Mon-Fri)")}</SelectItem>
                          <SelectItem value="weekly">{t("Einmal pro Woche", "Once a week")}</SelectItem>
                          <SelectItem value="biweekly">{t("Alle zwei Wochen", "Bi-weekly")}</SelectItem>
                          <SelectItem value="monthly">{t("Einmal pro Monat", "Once a month")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("Gewünschter Start", "Desired Start Date")}</Label>
                    <Input 
                      type="date" 
                      required 
                      className="bg-white border-[#eadfce]"
                      value={b2bForm.startDate} 
                      onChange={e => setB2bForm(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("Zusätzliche Wünsche", "Additional Notes")}</Label>
                    <Textarea 
                      rows={3} 
                      className="bg-white border-[#eadfce]"
                      value={b2bForm.notes} 
                      onChange={e => setB2bForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={t("z.B. 30% vegetarisch, 10% vegan...", "e.g., 30% vegetarian, 10% vegan...")} 
                    />
                  </div>
                  <button 
                    disabled={submittingB2b} 
                    type="submit" 
                    className="mt-4 w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {submittingB2b ? t("Senden...", "Sending...") : t("Anfrage absenden", "Submit B2B Request")}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white z-20 flex flex-col md:flex-row md:items-end justify-between w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]">
            <div className="flex flex-col gap-2 max-w-[80%] text-left">
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight drop-shadow-sm">
                {caterer.name}
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {caterer.tagline && caterer.tagline[lang] && (
                  <span className="text-sm md:text-base text-mint font-semibold font-sans drop-shadow-md">
                    {caterer.tagline[lang]}
                  </span>
                )}
              </div>
              {storefrontUrl && (
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-mint hover:text-white transition-colors mt-0.5 font-semibold drop-shadow-sm w-fit"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {t("Direkt-Storefront öffnen ↗", "Open Direct Storefront ↗")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Trust & Info Bar */}
        <div className="mt-6 mb-2 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-5 bg-white rounded-xl border border-[#eadfce] shadow-sm">
          <dl className="flex flex-wrap items-center gap-x-6 gap-y-4 m-0">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-bold">{t("Geprüftes Profil", "Checked Profile")}</span>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />
            
            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Mindestbestellung", "Min. Order")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Users className="h-4 w-4 text-forest/40" /> {caterer.minGuests} {t("Personen", "Guests")} / €{caterer.minBudget}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Vorlaufzeit", "Lead Time")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Clock className="h-4 w-4 text-forest/40" /> {caterer.leadTimeDays} {t("Tage", "Days")}
              </dd>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Standort", "Location")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <MapPin className="h-4 w-4 text-forest/40" /> <span className="truncate max-w-[200px]">{caterer.area}</span>
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
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* About Text */}
        {caterer.about && caterer.about[lang] && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {t(`Über ${caterer.name}`, `About ${caterer.name}`)}
            </h2>
            <p className="text-base text-forest/80 max-w-3xl leading-relaxed">
              {caterer.about[lang]}
            </p>
          </div>
        )}
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12 grid gap-8 lg:grid-cols-[1fr_22rem] pb-16 scroll-mt-24">
        <div>
          <h2 className="text-3xl font-display font-bold text-forest">{t("Speisekarte", "Menu")}</h2>
          <CategoryNav
            categories={categories}
            onSelect={(cat) => {
              document.getElementById(`category-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
          
          <div className="mt-8 mb-8 p-6 bg-[oklch(0.95_0.05_152)] rounded-xl border border-[oklch(0.85_0.05_152)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-forest">{t("Gästeanzahl", "Guest Count")}</h3>
              <p className="text-sm text-forest/70">{t("Basis für das dynamische Angebot", "Baseline for your dynamic quote")}</p>
            </div>
            <div className="flex items-center gap-4 bg-white p-1 rounded-full shadow-sm border border-[oklch(0.85_0.05_152)]">
              <button onClick={() => setGuests(Math.max(1, guests - 5))} className="h-10 w-10 grid place-items-center rounded-full text-forest hover:bg-[#eadfce] transition"><Minus className="h-4 w-4" /></button>
              <input 
                type="number" 
                value={guests} 
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-transparent border-none text-lg font-semibold text-forest focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button onClick={() => setGuests(guests + 5)} className="h-10 w-10 grid place-items-center rounded-full text-forest hover:bg-[#eadfce] transition"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-8 space-y-10">
            {categories.map((cat) => (
              <div key={cat} id={`category-${cat}`} className="scroll-mt-32">
                <h3 className="font-display text-2xl text-forest">{cat}</h3>
                <div className="mt-4 grid gap-4">
                  {caterer.menu.filter((m: any) => (m.category || "Menü") === cat).map((m: any) => {
                    const qty = cart[m.name] || 0;
                    return (
                      <div key={m.name} className="grid grid-cols-[1fr_auto] gap-4 p-5 bg-white border border-[#eadfce] rounded-xl shadow-sm hover:shadow-md hover:border-forest/30 transition-all duration-300 group">
                        <div className="min-w-0 flex flex-col md:flex-row gap-4">
                          {m.image_signed_url && (
                            <div className="shrink-0">
                              <img src={m.image_signed_url} alt="" className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-lg border border-[#eadfce]/50" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-display text-lg font-bold text-forest">{m.name}</h4>
                            {m.desc[lang] && <p className="text-sm text-forest/70 mt-1 leading-relaxed max-w-xl">{m.desc[lang]}</p>}
                            <div className="mt-3 flex items-center gap-3">
                              <p className="text-lg font-bold text-forest">
                                €{m.price.toFixed(2)}
                                <span className="text-sm font-medium text-forest/60 font-sans"> / {m.unit[lang]}</span>
                              </p>
                              {m.serves && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fdfaf5] px-2.5 py-0.5 text-xs font-medium text-forest/70 border border-[#eadfce]/60">
                                  <Users className="h-3 w-3" /> {t(`~${m.serves} Pers.`, `~${m.serves} pax`)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(m.name, m.unit.en === 'person' ? guests : 1)}
                            className="h-10 px-5 rounded-full bg-[#eadfce] text-forest hover:bg-forest hover:text-white transition whitespace-nowrap text-sm font-semibold pulse-btn"
                          >
                            {t("Hinzufügen", "Add")}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-1.5 h-10">
                            <button onClick={() => updateQty(m.name, qty - 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="-">
                              <Minus className="h-4 w-4" />
                            </button>
                            <input 
                              type="number" 
                              value={qty} 
                              onChange={(e) => updateQty(m.name, parseInt(e.target.value) || 0)}
                              className="w-10 text-center bg-transparent border-none text-sm font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white text-forest"
                            />
                            <button onClick={() => updateQty(m.name, qty + 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10 pulse-btn" aria-label="+">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
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
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {t("100% sichere Buchung über Speisely", "100% secure booking via Speisely")}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {t("Kostenlos anfragen, unverbindlich", "Request for free, no obligation")}
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Process Section */}
      <section className="bg-[#fdfaf5] border-y border-[#eadfce]/50 py-16 mt-8 mb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-display font-bold text-forest text-center mb-10">{t("So einfach funktioniert's", "How it works")}</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-forest/10" />
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-emerald-600 mb-4 z-10">1</div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Auswählen", "Choose")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">{t("Stelle dein Wunschmenü oder Paket aus dem Angebot zusammen.", "Put together your desired menu or package from the selection.")}</p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-emerald-600 mb-4 z-10">2</div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Anfragen", "Request")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">{t("Sende eine unverbindliche Anfrage direkt an den Caterer.", "Send a non-binding request directly to the caterer.")}</p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-emerald-600 mb-4 z-10">3</div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Genießen", "Enjoy")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">{t("Details klären, sicher buchen und ein tolles Event erleben.", "Clarify details, book securely and enjoy a great event.")}</p>
            </div>
          </div>
        </div>
      </section>



      {/* Mobile Sticky Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eadfce] p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between pb-safe">
          <div className="text-forest">
            <div className="font-semibold text-sm">{totalCount} {totalCount === 1 ? t("Artikel", "Item") : t("Artikel", "Items")}</div>
            <div className="text-xs text-forest/70">{t("Gesamt", "Total")}: ab €{finalTotal.toFixed(2)}</div>
          </div>
          <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
            <SheetTrigger asChild>
              <button className="rounded-full bg-[#22C55E] text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-[#22C55E]/90 transition cursor-pointer">
                {t("Angebot anzeigen", "View order")}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] bg-[#fdfaf5] text-forest border-t border-[#eadfce] rounded-t-2xl px-4 py-6 overflow-y-auto">
              <SheetHeader className="text-left mb-4">
                <SheetTitle className="flex items-center gap-2 font-display text-xl text-forest">
                  <ShoppingBag className="h-5 w-5 text-forest" />
                  {t("Deine Anfrage", "Your Inquiry")}
                </SheetTitle>
              </SheetHeader>
              <div className="py-2 pb-10">
                {renderSidebar(true)}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <MarketplacePromiseCTA vertical="caterer" />
    </SiteShell>
  );
}
