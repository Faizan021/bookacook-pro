import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { trackEvent } from "@/utils/posthog";
import { MapPin, Star, Clock, Plus, Minus, ArrowLeft, Phone, ClipboardCheck, Users, Sparkles, Globe, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { CategoryNav } from "@/components/ui/CategoryNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/i18n/I18nProvider";
import { getPlanner, mockPromoCodes, PromoCode, Planner } from "@/data/planners";
import { useServerFn, createServerFn } from "@tanstack/react-start";
import { recordPageView } from "@/lib/vendor/analytics.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";

export const getPublicPlannerProfileFn = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: planner, error: pErr } = await supabaseAdmin
      .from("planners")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    if (pErr || !planner) return null;

    // Fetch services
    const { data: services, error: sErr } = await supabaseAdmin
      .from("planner_services")
      .select("id, title, description, starting_price_cents, image_url, is_available")
      .eq("planner_id", planner.id)
      .eq("is_available", true);

    return { ...planner, services: services || [] };
  });

const plannerQueryOptions = (slug: string) => queryOptions({
  queryKey: ["plannerProfile", slug],
  queryFn: () => getPublicPlannerProfileFn({ data: { slug } }),
});

export const Route = createFileRoute("/planner/$slug")({
  head: ({ loaderData, params }) => {
    const p = loaderData?.fullPlanner;
    const city = p?.area ?? "Deutschland";
    const rawDesc = p
      ? `${p.name} organisiert Events in ${city}. Jetzt Anfrage senden über Speisely.`
      : "Event Planer auf Speisely – professionelle Eventplanung in Deutschland.";
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "..." : rawDesc;
    const title = p
      ? `${p.name} – Eventplanung in ${city} | Speisely`
      : "Event Planer – Speisely";
    const ogImage = (p && p.img) ? p.img : "https://speisely.de/og-default.jpg";
    const canonicalUrl = `https://speisely.de/planner/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: p ? `${p.name} – Eventplanung auf Speisely` : title },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: p
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: p.name,
              image: p.img,
              address: { "@type": "PostalAddress", addressLocality: p.area },
            }),
          }]
        : undefined,
    };
  },
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(plannerQueryOptions(params.slug));
    const fullPlanner = await getPlanner(params.slug);
    if (!fullPlanner) {
      throw new Error("Planner not found");
    }
    return { fullPlanner };
  },
  component: PlannerStorefront,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-display text-forest">Planner nicht gefunden</h1>
        <Link to="/planner" className="mt-6 inline-block text-forest underline">
          Zurück zum Event Planner
        </Link>
      </div>
    </SiteShell>
  ),
});


function PlannerStorefront() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const { fullPlanner } = Route.useLoaderData();
  const q = useSuspenseQuery(plannerQueryOptions(slug));
  const dbPlanner = q.data;
  const staticPlanner = fullPlanner;

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  // Construct a unified planner object
  const planner = {
    ...staticPlanner,
    name: dbPlanner?.name || staticPlanner.name,
    area: staticPlanner.area || "Deutschland",
    address: staticPlanner.address || "",
    phone: staticPlanner.phone || "",
    tagline: {
      de: staticPlanner.tagline?.de || "Professionelle Eventplanung",
      en: staticPlanner.tagline?.en || "Professional event planning",
    },
    about: {
      de: staticPlanner.about?.de || "",
      en: staticPlanner.about?.en || "",
    },
    packages: staticPlanner.packages || [],
  };

  const storefrontUrl = dbPlanner?.custom_domain 
    ? `https://${dbPlanner.custom_domain}` 
    : `https://${dbPlanner?.slug || slug}.speisely.de`;

  const [cart, setCart] = useState<Record<string, number>>({});
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [guests, setGuests] = useState(planner?.minGuests || 10);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const reviews: any[] = [];

  const recordView = useServerFn(recordPageView);

  useEffect(() => {
    if (planner?.id) {
      recordView({ data: { vendorId: planner.id, vendorType: "planner", url: window.location.pathname } })
        .catch(e => console.error("Tracking error", e));
    }
  }, [planner?.id]);

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = useMemo(() => {
    if (!planner) return [];
    const seen = new Set<string>();
    const cats: string[] = [];
    planner.packages.forEach((m: any) => {
      const c = m.category || "Pakete";
      if (!seen.has(c)) {
        seen.add(c);
        cats.push(c);
      }
    });
    return cats;
  }, [planner]);

  if (!planner) return null;

  const updateQty = (name: string, qty: number) => {
    if (qty > 0 && Object.keys(cart).length === 0) {
      trackEvent("planner_inquiry_started", { plannerId: planner?.id });
    }
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[name];
      else next[name] = qty;
      return next;
    });
  };

  const cartItems = Object.entries(cart).map(([name, qty]) => {
    const item = planner.packages.find((m: any) => m.name === name)!;
    return { ...item, qty };
  });
  const total = cartItems.reduce((sum, i) => sum + i.startingFrom * i.qty, 0);
  const totalCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = total;
  const belowMin = subtotal > 0 && subtotal < planner.minBudget;

  const handleApplyPromo = () => {
    setPromoError("");
    const codes = mockPromoCodes[planner.id] || [];
    const validCode = codes.find(c => c.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (validCode) {
      const now = new Date();
      if (validCode.starts_at && new Date(validCode.starts_at) > now) {
        return setPromoError(t("Dieser Code ist noch nicht gültig", "This code is not valid yet"));
      }
      if (validCode.ends_at && new Date(validCode.ends_at) < now) {
        return setPromoError(t("Dieser Code ist abgelaufen", "This code has expired"));
      }
      if (validCode.min_order_value_cents && (subtotal * 100) < validCode.min_order_value_cents) {
        return setPromoError(t(`Mindestbestellwert: €${(validCode.min_order_value_cents/100).toFixed(2)}`, `You must spend at least €${(validCode.min_order_value_cents/100).toFixed(2)} to use this code`));
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
      // Planner doesn't have delivery fee
    } else if ((appliedPromo as any).discount_type === "free_item") {
      const targetItem = cartItems.find(i => i.name === (appliedPromo as any).free_item_name);
      if (targetItem) {
        discountAmount = targetItem.startingFrom;
      }
    } else if ((appliedPromo as any).discount_type === "bogo") {
      const rq = (appliedPromo as any).required_qty || 2;
      const appliesTo = (appliedPromo as any).applies_to_product_name;
      const targetItem = cartItems.find(i => i.name === appliesTo);
      if (targetItem) {
        const freeItems = Math.floor(targetItem.qty / rq);
        discountAmount = freeItems * targetItem.startingFrom;
      }
    } else {
      let eligibleSubtotal = subtotal;
      if ((appliedPromo as any).applies_to_product_name) {
        const targetItem = cartItems.find(i => i.name === (appliedPromo as any).applies_to_product_name);
        eligibleSubtotal = targetItem ? targetItem.startingFrom * targetItem.qty : 0;
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
          <ClipboardCheck className="h-5 w-5" />
          <h3 className="font-display text-xl">{t("Dynamisches Angebot", "Dynamic Quote")}</h3>
        </div>
      )}
      {cartItems.length === 0 ? (
        <p className="mt-4 text-sm text-forest/40 italic">
          {t("👆 Füge Pakete hinzu, um deine Anfrage zu starten", "👆 Add packages to start your brief")}
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
                <span className="text-sm font-medium text-forest">€{(i.startingFrom * i.qty).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Vorlauf", "Lead time")}</span>
            <span>{planner.leadTimeDays}d</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm text-forest/70">
            <span>{t("Min. Budget", "Min. budget")}</span>
            <span>€{planner.minBudget}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-base font-semibold text-forest">
            <span>{t("Ab", "Starting from")}</span>
            <span>€{subtotal.toFixed(0)}</span>
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
            <span>€{finalTotal.toFixed(0)}</span>
          </div>

          {belowMin && (
            <p className="mt-2 text-xs text-[oklch(0.55_0.15_30)]">
              {t(
                `Noch €${(planner.minBudget - subtotal).toFixed(0)} bis zum Mindestbudget.`,
                `€${(planner.minBudget - subtotal).toFixed(0)} more to reach the min. budget.`,
              )}
            </p>
          )}
          <button
            disabled={belowMin}
            onClick={() => {
              trackEvent("reservation_submitted", { plannerId: planner.id, type: "planner", totalCount, finalTotal });
              alert(
                t(
                  `Anfrage über ${totalCount} Paket(e) gesendet. ${planner.name} meldet sich in Kürze.`,
                  `Inquiry sent for ${totalCount} package(s). ${planner.name} will get back to you shortly.`,
                ),
              );
              if (isMobile) setMobileCartOpen(false);
            }}
            className="mt-5 w-full rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white py-3 font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {t("Anfrage senden", "Inquire / Book")} · ab €{finalTotal.toFixed(0)}
          </button>
          <p className="mt-2 text-xs text-forest/60">
            {t("Unverbindlich — der Planner bestätigt deine Anfrage.", "Non-binding — the planner confirms your request.")}
          </p>
        </>
      )}
    </>
  );

  return (
    <SiteShell>
      <AnnouncementBanner
        isActive={planner.announcement_active ?? false}
        text={planner.announcement_text ?? null}
        bgColor={planner.announcement_bg_color ?? null}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8">
        <Link to="/planner" className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest">
          <ArrowLeft className="h-4 w-4" /> {t("Zurück zum Event Planner", "Back to Event Planner")}
        </Link>

        {/* Redesigned Full-Width Hero Banner */}
        <div className="relative mt-6 w-full h-[300px] md:h-[420px] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={planner.img || undefined}
            alt={planner.name}
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
            <span className="rounded-full bg-[#10b981] px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-md flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {t("GEPRÜFT", "CHECKED")}
            </span>
            <button
              onClick={scrollToMenu}
              className="group flex items-center gap-1.5 rounded-full bg-[#10b981] hover:bg-[#10b981]/90 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              {t("Anfrage senden", "Send request")}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white z-20 flex flex-col md:flex-row md:items-end justify-between w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]">
            <div className="flex flex-col gap-2 max-w-[80%] text-left">
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight drop-shadow-sm">
                {planner.name}
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {planner.tagline && planner.tagline[lang] && (
                  <span className="text-sm md:text-base text-mint font-semibold font-sans drop-shadow-md">
                    {planner.tagline[lang]}
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
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Eventgröße", "Event Size")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Users className="h-4 w-4 text-forest/40" /> {planner.minGuests} {t("Personen", "Guests")} / €{planner.minBudget}
              </dd>
            </div>

            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Vorlaufzeit", "Lead Time")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <Clock className="h-4 w-4 text-forest/40" /> {planner.leadTimeDays} {t("Tage", "Days")}
              </dd>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-[#eadfce]/60" />

            <div className="flex flex-col">
              <dt className="text-xs text-forest/50 font-medium uppercase tracking-wider">{t("Standort", "Location")}</dt>
              <dd className="text-sm font-semibold text-forest flex items-center gap-1 m-0">
                <MapPin className="h-4 w-4 text-forest/40" /> <span className="truncate max-w-[200px]">{planner.address}</span>
              </dd>
            </div>
          </dl>
          
          <div className="flex flex-wrap items-center gap-2 pt-4 md:pt-0 border-t border-[#eadfce] md:border-0 w-full md:w-auto">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fdfaf5] px-3 py-1 text-xs font-semibold text-forest border border-[#eadfce]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> {t("Verifizierter Partner", "Verified Partner")}
            </span>
          </div>
        </div>

        {/* About Text */}
        {planner.about && planner.about[lang] && (
          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {t(`Über ${planner.name}`, `About ${planner.name}`)}
            </h2>
            <p className="text-base text-forest/80 max-w-3xl leading-relaxed">
              {planner.about[lang]}
            </p>
          </div>
        )}
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12 grid gap-8 lg:grid-cols-[1fr_22rem] pb-16 scroll-mt-24">
        <div>
          <h2 className="text-3xl font-display font-bold text-forest">{t("Service-Pakete", "Service Packages")}</h2>
          <p className="mt-2 text-sm text-forest/70">
            {t(
              "Wähle Pakete aus und sende eine unverbindliche Anfrage — der Planner bestätigt innerhalb von 24 h.",
              "Pick packages and send a non-binding inquiry — the planner confirms within 24h.",
            )}
          </p>
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
                  {planner.packages.filter((m: any) => (m.category || "Pakete") === cat).map((m: any) => {
                    const qty = cart[m.name] || 0;
                    return (
                      <div key={m.name} className="grid grid-cols-[1fr_auto] gap-4 p-5 bg-white border border-[#eadfce] rounded-xl shadow-sm hover:shadow-md hover:border-forest/30 transition-all duration-300 group">
                        <div className="min-w-0">
                          <h4 className="font-display text-lg font-bold text-forest">{m.name}</h4>
                          <p className="text-sm text-forest/70 mt-1 leading-relaxed max-w-xl">{m.desc[lang]}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/60">
                              {t("Ab", "Starting from")}
                            </span>
                            <p className="text-lg font-bold text-forest">
                              €{m.startingFrom.toFixed(0)}
                              <span className="text-sm font-medium text-forest/60 font-sans"> / {m.unit[lang]}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(m.name, m.unit.en === 'person' ? guests : 1)}
                            className="h-10 px-5 inline-flex items-center gap-2 rounded-full bg-[#eadfce] text-forest hover:bg-forest hover:text-white transition whitespace-nowrap text-sm font-semibold pulse-btn shadow-sm hover:shadow-md"
                            aria-label={t("Anfragen", "Inquire")}
                          >
                            <Plus className="h-4 w-4" /> {t("Anfragen", "Add to quote")}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-1.5 h-10 shadow-md">
                            <button onClick={() => updateQty(m.name, qty - 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="-">
                              <Minus className="h-4 w-4" />
                            </button>
                            <input 
                              type="number" 
                              value={qty} 
                              onChange={(e) => updateQty(m.name, parseInt(e.target.value) || 0)}
                              className="w-10 text-center bg-transparent border-none text-sm font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white"
                            />
                            <button onClick={() => updateQty(m.name, qty + 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10 pulse-btn" aria-label="+">
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
              <p className="text-sm text-forest/70 max-w-xs">{t("Stelle dein Wunsch-Paket für dein Event zusammen.", "Put together your desired package for your event.")}</p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-emerald-600 mb-4 z-10">2</div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Anfragen", "Request")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">{t("Sende eine unverbindliche Anfrage direkt an den Planner.", "Send a non-binding request directly to the planner.")}</p>
            </div>
            <div className="relative text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full border border-[#eadfce] shadow-sm flex items-center justify-center text-xl font-bold text-emerald-600 mb-4 z-10">3</div>
              <h3 className="font-bold text-forest text-lg mb-2">{t("Planen & Genießen", "Plan & Enjoy")}</h3>
              <p className="text-sm text-forest/70 max-w-xs">{t("Details klären, sicher buchen und ein tolles Event erleben.", "Clarify details, book securely and enjoy a great event.")}</p>
            </div>
          </div>
        </div>
      </section>



      {/* Mobile Sticky Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eadfce] p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between pb-safe">
          <div className="text-forest">
            <div className="font-semibold text-sm">{totalCount} {totalCount === 1 ? t("Paket", "Package") : t("Pakete", "Packages")}</div>
            <div className="text-xs text-forest/70">{t("Gesamt", "Total")}: ab €{finalTotal.toFixed(0)}</div>
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
                  <ClipboardCheck className="h-5 w-5 text-forest" />
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

      <MarketplacePromiseCTA vertical="planner" />
    </SiteShell>
  );
}
