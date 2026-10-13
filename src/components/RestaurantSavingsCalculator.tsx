import { useState, useId } from "react";
import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowRight, ShieldCheck, Sparkles, Percent, Euro, ShoppingBag } from "lucide-react";

interface Preset {
  labelDe: string;
  labelEn: string;
  orders: number;
  ticket: number;
}

const PRESETS: Preset[] = [
  {
    labelDe: "Bistro / Imbiss",
    labelEn: "Bistro / Snack",
    orders: 350,
    ticket: 18,
  },
  {
    labelDe: "Beliebtes Restaurant",
    labelEn: "Popular Restaurant",
    orders: 900,
    ticket: 26,
  },
  {
    labelDe: "Top-Lieferdienst",
    labelEn: "High-Volume Delivery",
    orders: 2200,
    ticket: 32,
  },
];

export function RestaurantSavingsCalculator() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const ordersInputId = useId();
  const ticketInputId = useId();

  // Core state
  const [orders, setOrders] = useState<number>(850);
  const [ticket, setTicket] = useState<number>(25);
  const [commissionRate, setCommissionRate] = useState<number>(30); // 15% own drivers vs 30% portal fleet

  // Calculations
  const monthlyGrossRevenue = orders * ticket;
  const portalMonthlyCost = (monthlyGrossRevenue * commissionRate) / 100;
  const speiselyMonthlyCost = 34.99; // €34.99/mo flat, 0% commission

  const monthlySavings = Math.max(0, portalMonthlyCost - speiselyMonthlyCost);
  const annualSavings = monthlySavings * 12;
  const portalAnnualCost = portalMonthlyCost * 12;
  const speiselyAnnualCost = speiselyMonthlyCost * 12;

  const handlePreset = (preset: Preset) => {
    setOrders(preset.orders);
    setTicket(preset.ticket);
    trackEvent("partner_savings_preset_clicked", {
      preset: preset.labelEn,
      orders: preset.orders,
      ticket: preset.ticket,
    });
  };

  const handleCtaClick = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "speisely_calculator_lead",
          JSON.stringify({
            orders,
            ticket,
            commissionRate,
            annualSavings,
            timestamp: Date.now(),
          }),
        );
      } catch {
        // Fallback gracefully if storage is restricted
      }
    }
    trackEvent("partner_savings_cta_clicked", {
      orders,
      ticket,
      commissionRate,
      annualSavings,
    });
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat(isDe ? "de-DE" : "en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="surface-card relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-300">
      {/* Decorative Brand Accent Background */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-72 w-72 rounded-full bg-[#f2d896]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-72 w-72 rounded-full bg-forest/5 blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 lg:mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 border border-forest/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-forest mb-4">
          <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
          {isDe ? "Interaktiver Ersparnis-Rechner" : "Interactive Savings Calculator"}
        </span>

        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest tracking-tight leading-[1.05]">
          {isDe
            ? "Wie viel verlierst du monatlich an Lieferportale?"
            : "How much are you losing to delivery portals each month?"}
        </h3>

        <p className="mt-3 text-base sm:text-lg text-forest/75 font-normal max-w-2xl mx-auto">
          {isDe
            ? "Lieferando, Wolt und Uber Eats verlangen bis zu 30 % Provision pro Bestellung. Bei Speisely zahlst du 0 % Provision und behältst deine Kunden."
            : "Portals like Lieferando and Wolt charge up to 30% per order. With Speisely, you pay 0% order commission and keep 100% of your customer relationships."}
        </p>

        {/* Quick Presets */}
        <div
          role="group"
          aria-label={isDe ? "Voreingestellte Profile" : "Preset Profiles"}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-forest/60 mr-1">
            {isDe ? "Typische Betriebe:" : "Quick Profiles:"}
          </span>
          {PRESETS.map((p, idx) => {
            const isSelected = orders === p.orders && ticket === p.ticket;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePreset(p)}
                aria-pressed={isSelected}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-forest text-cream shadow-sm scale-105"
                    : "bg-forest/5 text-forest/80 hover:bg-forest/10 border border-forest/10"
                }`}
              >
                {isDe ? p.labelDe : p.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls & Outcome Grid */}
      <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Sliders & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-cream/30 p-6 sm:p-8 rounded-2xl border border-forest/10">
          {/* Slider 1: Monthly Orders with Direct Input Option */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor={ordersInputId}
                className="text-sm font-bold text-forest flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#b28a3c]" />
                {isDe ? "Bestellungen pro Monat" : "Orders per month"}
              </label>

              {/* Editable Direct Input Badge */}
              <div className="flex items-center bg-white px-3 py-1 rounded-xl shadow-xs border border-forest/15 focus-within:border-[#b28a3c] focus-within:ring-2 focus-within:ring-[#b28a3c]/20 transition-all">
                <input
                  type="number"
                  min={10}
                  max={10000}
                  step={10}
                  value={orders}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setOrders(Math.max(0, val));
                  }}
                  className="w-20 text-right font-display font-bold text-forest text-xl bg-transparent focus:outline-none"
                  aria-label={
                    isDe
                      ? "Bestellungen pro Monat direkt eingeben"
                      : "Direct input orders per month"
                  }
                />
                <span className="ml-1.5 text-xs font-sans text-forest/60">
                  {isDe ? "Best." : "orders"}
                </span>
              </div>
            </div>

            <input
              id={ordersInputId}
              type="range"
              min={100}
              max={3000}
              step={50}
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
              aria-valuemin={100}
              aria-valuemax={3000}
              aria-valuenow={orders}
              aria-valuetext={`${orders} ${isDe ? "Bestellungen pro Monat" : "orders per month"}`}
              className="w-full h-2.5 bg-forest/20 rounded-lg appearance-none cursor-pointer accent-[#b28a3c] focus:outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#b28a3c] [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="flex justify-between text-[11px] font-medium text-forest/50 mt-1">
              <span>100</span>
              <span>1.500</span>
              <span>3.000+</span>
            </div>
          </div>

          {/* Slider 2: Average Ticket Size with Direct Input Option */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor={ticketInputId}
                className="text-sm font-bold text-forest flex items-center gap-2 cursor-pointer"
              >
                <Euro className="h-4 w-4 text-[#b28a3c]" />
                {isDe ? "Durchschnittlicher Bestellwert" : "Average order value"}
              </label>

              {/* Editable Direct Input Badge */}
              <div className="flex items-center bg-white px-3 py-1 rounded-xl shadow-xs border border-forest/15 focus-within:border-[#b28a3c] focus-within:ring-2 focus-within:ring-[#b28a3c]/20 transition-all">
                <input
                  type="number"
                  min={1}
                  max={500}
                  step={1}
                  value={ticket}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTicket(Math.max(0, val));
                  }}
                  className="w-16 text-right font-display font-bold text-forest text-xl bg-transparent focus:outline-none"
                  aria-label={
                    isDe
                      ? "Durchschnittlicher Bestellwert in Euro eingeben"
                      : "Direct input average order value in Euro"
                  }
                />
                <span className="ml-1 text-sm font-bold text-forest/70">€</span>
              </div>
            </div>

            <input
              id={ticketInputId}
              type="range"
              min={12}
              max={60}
              step={1}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              aria-valuemin={12}
              aria-valuemax={60}
              aria-valuenow={ticket}
              aria-valuetext={`${ticket} Euro ${isDe ? "durchschnittlicher Bestellwert" : "average order value"}`}
              className="w-full h-2.5 bg-forest/20 rounded-lg appearance-none cursor-pointer accent-[#b28a3c] focus:outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#b28a3c] [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="flex justify-between text-[11px] font-medium text-forest/50 mt-1">
              <span>12 €</span>
              <span>35 €</span>
              <span>60 €</span>
            </div>
          </div>

          {/* Commission Mode Toggle */}
          <div className="pt-2 border-t border-forest/10">
            <span className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2">
              {isDe ? "Lieferando-Modell Vergleich:" : "Portal commission rate:"}
            </span>
            <div
              role="group"
              aria-label={isDe ? "Lieferando Provisionsmodell" : "Portal Commission Model"}
              className="grid grid-cols-2 gap-2"
            >
              <button
                type="button"
                onClick={() => setCommissionRate(15)}
                aria-pressed={commissionRate === 15}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                  commissionRate === 15
                    ? "bg-forest text-cream border-forest shadow-xs font-bold"
                    : "bg-white text-forest/70 border-forest/15 hover:bg-forest/5"
                }`}
              >
                {isDe ? "15 % (Eigene Fahrer)" : "15% (Own drivers)"}
              </button>
              <button
                type="button"
                onClick={() => setCommissionRate(30)}
                aria-pressed={commissionRate === 30}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                  commissionRate === 30
                    ? "bg-forest text-cream border-forest shadow-xs font-bold"
                    : "bg-white text-forest/70 border-forest/15 hover:bg-forest/5"
                }`}
              >
                {isDe ? "30 % (Lieferdienst-Fahrer)" : "30% (Portal drivers)"}
              </button>
            </div>
          </div>

          <div className="text-[12px] text-forest/60 flex items-center gap-1.5 pt-1">
            <Percent className="h-3.5 w-3.5 text-[#b28a3c] shrink-0" />
            <span>
              {isDe
                ? `Berechneter Monatsumsatz: ${formatEuro(monthlyGrossRevenue)}`
                : `Calculated monthly gross: ${formatEuro(monthlyGrossRevenue)}`}
            </span>
          </div>
        </div>

        {/* Right Column: Comparative Results & Highlight Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-forest text-cream rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle Glow Ring */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#f2d896]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#f2d896] mb-2">
              {isDe ? "Deine Ersparnis mit Speisely" : "Your Speisely Savings"}
            </div>

            {/* Main Net Savings Display */}
            <div className="mt-2">
              <div className="text-4xl sm:text-5xl lg:text-5xl font-display font-bold text-white tracking-tight">
                {formatEuro(annualSavings)}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#f2d896] mt-1">
                {isDe ? "Mehr Gewinn in deiner Kasse / Jahr" : "extra net profit kept per year"}
              </div>
            </div>

            {/* Line-by-Line Breakdown (Monthly & Annual Contrast) */}
            <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-white/80">
                <span>
                  {isDe
                    ? `Lieferdienst-Gebühr (${commissionRate} %):`
                    : `Portal Commission (${commissionRate}%):`}
                </span>
                <span className="font-semibold text-rose-300">
                  -{formatEuro(portalMonthlyCost)} / Mo.
                </span>
              </div>

              <div className="flex justify-between items-center text-white/80">
                <span>
                  {isDe ? "Speisely Flatrate (0 % Prov.):" : "Speisely Flat Rate (0% comm.):"}
                </span>
                <span className="font-semibold text-[#f2d896]">€34,99 / Mo.</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 font-bold text-white text-base">
                <span>{isDe ? "Ersparnis pro Monat:" : "Monthly Savings:"}</span>
                <span className="text-[#f2d896] font-display text-lg">
                  +{formatEuro(monthlySavings)}
                </span>
              </div>

              {/* Annual Cumulative Proof Badge */}
              <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-white/75 flex justify-between items-center">
                <span>{isDe ? "Kosten auf 12 Monate:" : "12-Month Total Cost:"}</span>
                <div className="text-right">
                  <span className="text-rose-300 line-through mr-2">
                    {formatEuro(portalAnnualCost)}
                  </span>
                  <span className="text-[#f2d896] font-bold">{formatEuro(speiselyAnnualCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Inside Outcome Card */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <Link
              to="/auth"
              search={{ signup: "partner", message: undefined, logout: undefined }}
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-[#b28a3c]/30 hover:bg-[#9a7633] transition-all hover:scale-[1.02]"
            >
              {isDe ? "Jetzt 0 % Provision sichern" : "Claim 0% Commission Now"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/60">
              <ShieldCheck className="h-3.5 w-3.5 text-[#f2d896]" />
              <span>
                {isDe
                  ? "Monatlich kündbar · Keine Einrichtungsgebühr"
                  : "Cancel anytime · Zero setup fees"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
