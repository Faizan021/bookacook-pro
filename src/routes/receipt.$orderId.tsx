import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { getOrderReceiptDetails } from "@/lib/restaurant/public.functions";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/receipt/$orderId")({
  validateSearch: (search: Record<string, unknown>) => ({
    auto: search.auto === "true" || search.auto === true,
  }),
  loader: async ({ params }) => {
    try {
      const { order } = await getOrderReceiptDetails({ data: { orderId: params.orderId } });
      return { order, error: null };
    } catch (err: any) {
      return { order: null, error: err.message || "Bestellung nicht gefunden" };
    }
  },
  head: () => ({
    meta: [
      { title: "Speisely Küchen-Beleg (80mm)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { order, error } = Route.useLoaderData();
  const { auto } = Route.useSearch();

  useEffect(() => {
    if (auto && order && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [auto, order]);

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="text-4xl text-rose-500">⚠️</div>
          <h1 className="text-xl font-bold text-stone-900">Beleg nicht verfügbar</h1>
          <p className="text-sm text-stone-600">
            {error || "Der Beleg konnte nicht geladen werden."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        </div>
      </div>
    );
  }

  const shortId = order.id.slice(0, 8).toUpperCase();
  const dateStr = new Date(order.created_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = new Date(order.created_at).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderTypeLabel =
    order.order_type === "delivery"
      ? "🚗 LIEFERUNG"
      : order.order_type === "pickup"
        ? "🛍️ ABHOLUNG"
        : "🍽️ VOR ORT";

  const paymentLabel =
    order.payment_method === "cash"
      ? "Bar / EC an Haustür"
      : order.payment_method === "paypal"
        ? "PayPal Direkt"
        : "Kreditkarte";

  const items = Array.isArray(order.items) ? order.items : [];
  const totalStr = `€${(order.total_cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-stone-100 py-6 px-4 font-mono text-xs">
      {/* Action Bar (Hidden when printing) */}
      <div className="max-w-[340px] mx-auto mb-4 print:hidden flex items-center justify-between gap-3">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück
        </button>

        <button
          onClick={() => window.print()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c3823] text-white text-xs font-bold hover:bg-[#082618] transition shadow-md"
        >
          <Printer className="w-4 h-4" /> Beleg drucken (80mm)
        </button>
      </div>

      {/* 80mm Thermal Receipt Simulation */}
      <div className="receipt-paper max-w-[340px] w-full mx-auto bg-white p-6 shadow-lg border border-stone-200 print:shadow-none print:border-none print:p-0 print:w-[80mm] print:max-w-none">
        {/* Header */}
        <div className="text-center space-y-1 mb-4">
          <div className="text-base font-black tracking-widest uppercase">SPEISELY</div>
          <div className="text-sm font-bold uppercase text-stone-900">
            {(order.restaurant as any)?.name || "Restaurant"}
          </div>
          <div className="text-[11px] text-stone-600">
            {(order.restaurant as any)?.business_address || ""}{" "}
            {(order.restaurant as any)?.city || ""}
          </div>
          <div className="text-xs font-black mt-2 py-1 bg-stone-100 rounded print:bg-transparent">
            {orderTypeLabel}
          </div>
        </div>

        <div className="border-t-2 border-dashed border-stone-800 my-3" />

        {/* Order Meta */}
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Bestellung:</span>
            <span className="font-bold">#{shortId}</span>
          </div>
          <div className="flex justify-between">
            <span>Datum:</span>
            <span>
              {dateStr} {timeStr} Uhr
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-bold uppercase text-[#0c3823]">{order.status}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-stone-800 my-3" />

        {/* Customer Details */}
        <div className="space-y-1 text-[11px]">
          <div>
            <span className="text-stone-500">Kunde: </span>
            <span className="font-bold">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-stone-500">Tel: </span>
            <span className="font-bold">{order.customer_phone}</span>
          </div>
          {order.order_type === "delivery" && order.delivery_address && (
            <div className="mt-1 pt-1 border-t border-dotted border-stone-300">
              <span className="text-stone-500">Lieferadresse:</span>
              <div className="font-bold text-stone-900 mt-0.5 leading-snug">
                {order.delivery_address}
              </div>
            </div>
          )}
          {order.notes && (
            <div className="mt-1 pt-1 border-t border-dotted border-stone-300 bg-stone-50 p-1.5 rounded print:bg-transparent">
              <span className="font-bold">Hinweis: </span>
              <span>{order.notes}</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-stone-800 my-3" />

        {/* Line Items */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase border-b border-stone-200 pb-1">
            <span>Menge / Pos</span>
            <span>EUR</span>
          </div>

          {items.map((item: any, idx: number) => {
            const lineTotal = item.line_total_cents
              ? `€${(item.line_total_cents / 100).toFixed(2)}`
              : item.price_cents
                ? `€${((item.price_cents * (item.quantity || 1)) / 100).toFixed(2)}`
                : "";

            return (
              <div key={idx} className="flex justify-between items-start text-[11px] leading-snug">
                <div className="pr-2">
                  <span className="font-bold">{item.quantity || 1}x </span>
                  <span>{item.name}</span>
                </div>
                <div className="font-bold text-right shrink-0">{lineTotal}</div>
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-stone-800 my-3" />

        {/* Totals */}
        <div className="space-y-1.5 text-xs">
          {(order.delivery_fee_cents ?? 0) > 0 && (
            <div className="flex justify-between text-stone-600 text-[11px]">
              <span>Liefergebühr:</span>
              <span>€{((order.delivery_fee_cents ?? 0) / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black pt-1">
            <span>GESAMTBETRAG:</span>
            <span className="text-base">{totalStr}</span>
          </div>
          <div className="flex justify-between text-[11px] text-stone-700 pt-0.5">
            <span>Zahlungsart:</span>
            <span className="font-bold">{paymentLabel}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-stone-800 my-4" />

        {/* Footer */}
        <div className="text-center space-y-1 text-[10px] text-stone-500 pt-1">
          <div className="flex items-center justify-center gap-1 font-bold text-stone-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0c3823]" />
            <span>Bestellung bestätigt</span>
          </div>
          <div>Vielen Dank für Ihren Besuch!</div>
          <div className="font-mono text-[9px] text-stone-400">speisely.de • Provisionsfrei</div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .receipt-paper {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 8mm 6mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
