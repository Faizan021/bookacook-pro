import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getRestaurantOrders, updateRestaurantOrderStatus, type OrderStatus } from "@/lib/restaurant/queries.functions";
import { printReceipt } from "@/utils/printReceipt";
import { useI18n } from "@/i18n/I18nProvider";
import { Printer, Clock, ArrowLeft, RotateCw, Play, CheckCircle2, ChevronRight, MessageSquareCode } from "lucide-react";

export const Route = createFileRoute("/_authenticated/restaurant/kitchen")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kitchen Display (KDS) — Speisely" }] }),
  component: KitchenDisplayPage,
});

function KitchenDisplayPage() {
  const fetchOrders = useServerFn(getRestaurantOrders);
  const updateStatus = useServerFn(updateRestaurantOrderStatus);
  const qc = useQueryClient();
  const { t, lang } = useI18n();

  const ordersQ = useQuery({
    queryKey: ["restaurant", "orders"],
    queryFn: () => fetchOrders(),
  });

  const statusMut = useMutation({
    mutationFn: (vars: { orderId: string; status: OrderStatus }) => updateStatus({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", "orders"] });
    },
  });

  // Real-time listener for KDS updates
  useEffect(() => {
    if (!ordersQ.data?.restaurant) return;

    const playAudio = () => {
      const audio = new Audio("/speisely_alert.mp3");
      audio.play().catch((e) => console.log("Audio blocked:", e));
    };

    const channel = supabase
      .channel("kitchen-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurant_orders",
          filter: `restaurant_id=eq.${ordersQ.data.restaurant.id}`,
        },
        () => {
          playAudio();
          ordersQ.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ordersQ.data?.restaurant]);

  // Elapsed time tracker hook to trigger render updates every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

  const getElapsedTime = (createdAt: string) => {
    const elapsedMs = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(elapsedMs / 60000);
    if (minutes < 1) return t("just now", "gerade eben");
    return lang === "de" ? `vor ${minutes} Min.` : `${minutes}m ago`;
  };

  if (ordersQ.isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center flex-col gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">{t("Loading kitchen screen...", "Lade KDS-Bildschirm...")}</p>
      </div>
    );
  }

  const data = ordersQ.data;
  if (!data?.restaurant) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center flex-col p-6 font-sans">
        <h2 className="text-xl font-bold text-rose-500">{t("Storefront Not Found", "Storefront nicht gefunden")}</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-sm">
          {t("Please configure your restaurant profile in the dashboard first.", "Bitte erstelle zuerst ein Restaurant-Profil im Dashboard.")}
        </p>
        <Link to="/restaurant" search={{ tab: undefined }} className="mt-6 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2 text-sm font-medium">
          {t("Back to Dashboard", "Zurück zum Dashboard")}
        </Link>
      </div>
    );
  }

  // Filter out delivered and cancelled orders for KDS
  const activeOrders = data.orders.filter((o: any) => o.status !== "delivered" && o.status !== "cancelled");

  // Columns classification
  const newOrders = activeOrders.filter((o: any) => {
    // If stripe/paypal, only show if confirmed or beyond
    if (o.payment_method === 'stripe' || o.payment_method === 'paypal') {
      return o.status === "confirmed";
    }
    // If cash or legacy without payment_method, show pending and confirmed
    return o.status === "pending" || o.status === "confirmed";
  });
  const cookingOrders = activeOrders.filter((o: any) => o.status === "preparing");
  const readyOrders = activeOrders.filter((o: any) => o.status === "ready" || o.status === "picked_up");

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Header bar */}
      <header className="h-16 shrink-0 bg-[#141620] border-b border-[#252836] px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            to="/restaurant"
            search={{ tab: undefined }}
            hash="orders"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 transition"
            title={t("Back to Dashboard", "Zurück zum Dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
              <span>{data.restaurant.name} KDS</span>
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
            </h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
              {t("Kitchen Display System", "Küchen-Bildschirm (Live)")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-[#22C55E]">{activeOrders.length}</span>
            <span className="text-xs text-muted-foreground ml-1.5 uppercase font-medium">
              {t("Active Orders", "Aktive Bestellungen")}
            </span>
          </div>

          <button
            onClick={() => ordersQ.refetch()}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 transition cursor-pointer"
            title={t("Refresh", "Aktualisieren")}
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Kanban Board columns */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden h-[calc(100vh-4rem)]">
        {/* Column 1: New/Pending */}
        <section className="bg-[#141620] rounded-xl flex flex-col overflow-hidden border border-[#252836] shadow-lg">
          <header className="h-12 bg-amber-500/10 border-b border-[#252836] px-4 flex items-center justify-between shrink-0">
            <h2 className="font-black text-sm uppercase tracking-widest text-amber-500">
              {t("New Orders", "Neue Bestellungen")}
            </h2>
            <span className="bg-amber-500 text-[#0c0d12] text-xs font-black px-2.5 py-0.5 rounded-full">
              {newOrders.length}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {newOrders.map((o: any) => (
              <OrderCard
                key={o.id}
                order={o}
                restaurantName={data.restaurant.name}
                formatPrice={formatPrice}
                getElapsedTime={getElapsedTime}
                t={t}
              >
                <button
                  onClick={() => statusMut.mutate({ orderId: o.id, status: "preparing" })}
                  disabled={statusMut.isPending}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg py-2.5 font-bold text-sm transition shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {t("Start Cooking", "Kochen starten")}
                </button>
              </OrderCard>
            ))}
            {newOrders.length === 0 && <EmptyColumnMessage text={t("No new orders", "Keine neuen Bestellungen")} />}
          </div>
        </section>

        {/* Column 2: In Preparation */}
        <section className="bg-[#141620] rounded-xl flex flex-col overflow-hidden border border-[#252836] shadow-lg">
          <header className="h-12 bg-indigo-500/10 border-b border-[#252836] px-4 flex items-center justify-between shrink-0">
            <h2 className="font-black text-sm uppercase tracking-widest text-indigo-400">
              {t("Preparing", "In Zubereitung")}
            </h2>
            <span className="bg-indigo-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {cookingOrders.length}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {cookingOrders.map((o: any) => (
              <OrderCard
                key={o.id}
                order={o}
                restaurantName={data.restaurant.name}
                formatPrice={formatPrice}
                getElapsedTime={getElapsedTime}
                t={t}
              >
                <button
                  onClick={() => statusMut.mutate({ orderId: o.id, status: "ready" })}
                  disabled={statusMut.isPending}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#1eb052] text-white rounded-lg py-2.5 font-bold text-sm transition shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("Mark Ready", "Fertig markieren")}
                </button>
              </OrderCard>
            ))}
            {cookingOrders.length === 0 && <EmptyColumnMessage text={t("No active cooking tasks", "Keine aktiven Aufgaben")} />}
          </div>
        </section>

        {/* Column 3: Ready */}
        <section className="bg-[#141620] rounded-xl flex flex-col overflow-hidden border border-[#252836] shadow-lg">
          <header className="h-12 bg-[#22C55E]/10 border-b border-[#252836] px-4 flex items-center justify-between shrink-0">
            <h2 className="font-black text-sm uppercase tracking-widest text-[#22C55E]">
              {t("Ready / Pickup", "Bereit zur Ausgabe")}
            </h2>
            <span className="bg-[#22C55E] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {readyOrders.map((o: any) => (
              <OrderCard
                key={o.id}
                order={o}
                restaurantName={data.restaurant.name}
                formatPrice={formatPrice}
                getElapsedTime={getElapsedTime}
                t={t}
              >
                <button
                  onClick={() => statusMut.mutate({ orderId: o.id, status: "delivered" })}
                  disabled={statusMut.isPending}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 font-bold text-sm transition cursor-pointer"
                >
                  {t("Complete Order", "Bestellung abschließen")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </OrderCard>
            ))}
            {readyOrders.length === 0 && <EmptyColumnMessage text={t("No completed items here", "Keine fertigen Gerichte")} />}
          </div>
        </section>
      </main>
    </div>
  );
}

function OrderCard({
  order,
  restaurantName,
  formatPrice,
  getElapsedTime,
  t,
  children,
}: {
  order: any;
  restaurantName: string;
  formatPrice: (cents: number) => string;
  getElapsedTime: (createdAt: string) => string;
  t: (k: string, fallback?: string) => string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <article className="bg-[#1f212f] rounded-lg border border-[#2d3043] p-4 flex flex-col shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-black text-base text-white">
            {order.customer_name ?? t("Guest", "Gast")}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase font-bold">
            #{order.id.slice(0, 8)} · {formatPrice(order.total_cents)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {getElapsedTime(order.created_at)}
          </span>
          <button
            onClick={() => printReceipt(order, restaurantName)}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/80 transition cursor-pointer"
            title={t("Print Ticket", "Bon drucken")}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="divider border-t border-[#2d3043] my-3"></div>

      <div className="flex-1">
        <ul className="space-y-1 text-sm font-mono text-white/90">
          {items.map((it: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span>{it.qty ?? 1}x {it.name}</span>
            </li>
          ))}
        </ul>

        {order.notes && (
          <div className="mt-3 p-2 bg-rose-500/10 border-l-2 border-rose-500 rounded text-xs text-rose-300 font-medium flex gap-1.5 items-start">
            <MessageSquareCode className="w-4 h-4 shrink-0 mt-0.5" />
            <span>"{order.notes}"</span>
          </div>
        )}
      </div>

      {children}
    </article>
  );
}

function EmptyColumnMessage({ text }: { text: string }) {
  return (
    <div className="h-full flex items-center justify-center p-6 text-center border-2 border-dashed border-[#252836] rounded-lg">
      <p className="text-muted-foreground/60 text-sm font-medium">{text}</p>
    </div>
  );
}
