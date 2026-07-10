import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getBookingDetails, startDepositCheckout } from "@/lib/customer/mutations.functions";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Users, MapPin, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/checkout/deposit/$bookingId")({
  loader: async ({ params }) => {
    try {
      const res = await getBookingDetails({ data: { bookingId: params.bookingId } });
      return { booking: res.booking, error: null };
    } catch (e: any) {
      return { booking: null, error: e.message || "Failed to load booking details" };
    }
  },
  head: () => ({ meta: [{ title: "Pay Booking Deposit — Speisely" }] }),
  component: DepositCheckoutPage,
});

function DepositCheckoutPage() {
  const { booking, error } = Route.useLoaderData();
  const [loading, setLoading] = useState(false);
  const checkoutFn = useServerFn(startDepositCheckout);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handlePayDeposit = async () => {
    if (!booking) return;
    if (!termsAccepted) {
      alert("Please agree to the deposit terms to proceed.");
      return;
    }
    setLoading(true);
    try {
      // Record consent if needed
      if (marketingOptIn || termsAccepted) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user?.email) {
          const { upsertConsentRecord } = await import("@/lib/consent.functions");
          await upsertConsentRecord({
            data: {
              email: userData.user.email,
              audience_type: "customer",
              marketing_opt_in: marketingOptIn,
              terms_acknowledged: termsAccepted,
              source: "checkout_deposit",
              source_detail: window.location.pathname,
              metadata: { bookingId: booking.id, vendorName: booking.vendorName },
              user_id: userData.user.id,
              pref_language:
                typeof window !== "undefined" ? localStorage.getItem("lang") || "de" : "de",
              pref_interests: ["orders"],
            },
          });
        }
      }

      const res = await checkoutFn({
        data: {
          bookingId: booking.id,
          origin: window.location.origin,
        },
      });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        alert("Failed to create Stripe Checkout session");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error || !booking) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md px-6 py-24 text-center space-y-6">
          <div className="text-6xl text-rose-500">⚠️</div>
          <h1 className="text-2xl font-display text-forest font-bold">Error loading booking</h1>
          <p className="text-muted-foreground">
            {error || "The booking details could not be found."}
          </p>
          <Button asChild className="rounded-full bg-forest text-white">
            <Link to="/customer">Back to Activity</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  const isAlreadyPaid = booking.status === "confirmed";

  return (
    <SiteShell>
      <div className="min-h-[80vh] bg-mint-dotted py-12 px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/customer"
            className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Activity
          </Link>

          <div className="surface-card p-8 md:p-10 space-y-8 border-t-8 border-forest">
            {/* Header */}
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-forest/10 text-forest">
                Speisely Event Booking
              </span>
              <h1 className="text-3xl font-display font-bold text-forest mt-3">
                Secure your booking with {booking.vendorName}
              </h1>
              <p className="text-sm text-muted-foreground">
                To confirm this event, a 10% platform deposit is required. The remaining 90% will be
                settled directly with the vendor off-platform.
              </p>
            </div>

            {/* Event Details Card */}
            <div className="bg-[#eadfce]/20 border border-[#eadfce]/40 rounded-2xl p-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-forest text-sm uppercase tracking-wider">
                  Event Details
                </h3>
                <div className="space-y-2.5 text-sm text-forest/80">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-forest">Type:</span>{" "}
                    {booking.eventType || "Event"}
                  </p>
                  {booking.eventDate && (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-forest/60" />
                      {new Date(booking.eventDate).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {booking.guestCount != null && (
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-forest/60" />
                      {booking.guestCount} guests
                    </p>
                  )}
                  {booking.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-forest/60" />
                      {booking.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#eadfce]/40 pt-4 md:pt-0 md:pl-6">
                <h3 className="font-semibold text-forest text-sm uppercase tracking-wider">
                  Financial Summary
                </h3>
                <div className="space-y-2 text-sm text-forest/80">
                  <div className="flex justify-between">
                    <span>Quoted Amount:</span>
                    <span className="font-semibold">€{booking.quotedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-forest font-bold text-base border-t border-[#eadfce]/30 pt-2 mt-2">
                    <span>10% Speisely Deposit:</span>
                    <span>€{booking.depositAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic mt-2">
                    * The remaining €{(booking.quotedAmount - booking.depositAmount).toFixed(2)}{" "}
                    (90%) will be invoiced directly to you by {booking.vendorName} prior to the
                    event.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA/Status */}
            {isAlreadyPaid ? (
              <div className="flex flex-col items-center text-center p-6 bg-cream text-forest border border-forest/20 rounded-2xl space-y-3">
                <ShieldCheck className="h-12 w-12 text-forest" />
                <h3 className="text-lg font-bold">Deposit Paid & Booking Confirmed!</h3>
                <p className="text-sm max-w-md">
                  Thank you! Your 10% platform deposit of €{booking.depositAmount.toFixed(2)} has
                  been successfully captured. {booking.vendorName} has been notified and your event
                  is officially scheduled.
                </p>
                <Button
                  asChild
                  className="mt-2 bg-forest hover:bg-forest/90 text-white rounded-full"
                >
                  <Link to="/customer">Go to Activity Dashboard</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center pt-4 space-y-4">
                <div className="w-full text-left bg-white p-4 rounded-xl border border-[#eadfce] space-y-3 mb-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 rounded border-[#eadfce] text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-forest/80">
                      I agree to the deposit payment terms and platform service agreement.
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[#eadfce] text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-forest/80">
                      Yes, I want to receive product updates, offers, and promotional emails from
                      Speisely. I can unsubscribe at any time.
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handlePayDeposit}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-6 text-base font-bold bg-[#22C55E] hover:bg-[#22C55E]/90 text-white rounded-full shadow-lg transition-all flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    `Pay Deposit €${booking.depositAmount.toFixed(2)}`
                  )}
                </Button>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
                  🔒 Payments are secured by Stripe. Speisely handles escrow & security.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
