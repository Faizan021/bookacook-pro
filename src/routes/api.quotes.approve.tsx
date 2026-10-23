import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { approveQuoteCheckpoint } from "@/lib/quotes/hitl.functions";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/api/quotes/approve")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Speisely Quote Approval" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QuoteApprovalPage,
});

function QuoteApprovalPage() {
  const { token } = Route.useSearch();
  const approve = useServerFn(approveQuoteCheckpoint);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMsg("Kein Freigabe-Token übergeben.");
      return;
    }

    approve({ data: { token } })
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setQuoteData(res.quote);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err.message || "Fehler beim Freigeben.");
      });
  }, [token]);

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5] min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-forest/10 shadow-2xl text-center space-y-6">
          {loading ? (
            <div className="py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-[#E6B84A] animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-forest">Prüfe Angebot & Rehydriere Status...</h2>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold font-display text-forest">
                Angebot erfolgreich freigegeben!
              </h2>
              <p className="text-xs text-forest/75 leading-relaxed">
                Der Status für <strong>{quoteData?.customer_name}</strong> wurde auf{" "}
                <span className="text-emerald-700 font-bold">APPROVED</span> gesetzt. Das Angebot
                ist jetzt verbindlich und der Kunde kann die 10% Anzahlung leisten.
              </p>

              <div className="p-4 rounded-2xl bg-forest/5 text-left text-xs space-y-1.5 border border-forest/10">
                <p><strong>Caterer:</strong> {quoteData?.caterer_name}</p>
                <p><strong>Event:</strong> {quoteData?.event_type} ({quoteData?.guest_count} Gäste)</p>
                <p><strong>Gesamtbetrag:</strong> €{((quoteData?.subtotal_cents || 0) / 100).toFixed(2)}</p>
                <p><strong>10% Anzahlung:</strong> €{((quoteData?.deposit_cents || 0) / 100).toFixed(2)}</p>
              </div>

              <a
                href="/admin"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-forest text-white font-bold text-xs hover:bg-[#1a382b] transition shadow-md"
              >
                <span>Zum Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold font-display text-forest">Freigabe fehlgeschlagen</h2>
              <p className="text-xs text-red-600">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
