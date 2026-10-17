import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Store, Heart, Check, ArrowRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface RestaurantClaimBridgeProps {
  restaurantName: string;
  city?: string;
}

export function RestaurantClaimBridge({
  restaurantName,
  city = "Berlin",
}: RestaurantClaimBridgeProps) {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const [recommended, setRecommended] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendEmail, setRecommendEmail] = useState("");
  const [recommendNote, setRecommendNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRecommendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setRecommended(true);
      setShowModal(false);
    }, 400);
  };

  return (
    <div className="not-prose my-12 rounded-3xl bg-gradient-to-br from-[#173C32]/5 via-[#FAF7F0] to-[#E6B84A]/10 border-2 border-[#173C32]/15 p-6 sm:p-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Restaurateur / Inhaber:in Bridge */}
        <div className="flex flex-col justify-between rounded-2xl bg-white border border-[#173C32]/10 p-6 shadow-sm hover:border-[#E6B84A] transition-all">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
              <Store className="w-3.5 h-3.5" />
              {isDe ? "Für Gastronomen" : "For Restaurant Owners"}
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#173C32] mb-2">
              {isDe ? `Inhaber:in von ${restaurantName}?` : `Owner of ${restaurantName}?`}
            </h4>
            <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed mb-6">
              {isDe
                ? "Sichere dir dein Profil mit 0 % Provision auf Direktbestellungen. Eigene Domain, Menü-Manager & direkte Auszahlung ohne Mittelsmänner."
                : "Claim your profile with 0% commission on direct orders. Custom domain, menu manager & direct payouts without middlemen."}
            </p>
          </div>
          <a
            href={`/partners?claim=${encodeURIComponent(restaurantName)}&city=${encodeURIComponent(city)}`}
            className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#173C32] text-white px-5 py-3 text-xs sm:text-sm font-bold shadow hover:bg-[#0c1813] transition"
          >
            <span>{isDe ? "Profil sichern" : "Claim Profile"}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Card 2: Foodie / Community Recommendation Bridge */}
        <div className="flex flex-col justify-between rounded-2xl bg-white border border-[#173C32]/10 p-6 shadow-sm hover:border-[#E6B84A] transition-all">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {isDe ? "Community-Empfehlung" : "Community Recommendation"}
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#173C32] mb-2">
              {isDe ? "Hier bestellen?" : "Want to order here?"}
            </h4>
            <p className="text-xs sm:text-sm text-[#173C32]/75 leading-relaxed mb-6">
              {isDe
                ? `Empfiehl ${restaurantName} für Speisely. Je mehr Stimmen ein Lokal sammelt, desto schneller schalten wir Direktbestellung und Tischreservierung frei.`
                : `Recommend ${restaurantName} for Speisely. The more foodies recommend a spot, the faster we onboard direct ordering and reservations.`}
            </p>
          </div>
          <div>
            {recommended ? (
              <div className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-5 py-3 text-xs sm:text-sm font-bold">
                <Check className="w-4 h-4" />
                <span>{isDe ? "Danke für deine Empfehlung!" : "Thank you for recommending!"}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#E6B84A] text-[#173C32] px-5 py-3 text-xs sm:text-sm font-bold shadow hover:bg-[#d4a538] transition"
              >
                <Heart className="w-4 h-4" />
                <span>{isDe ? "Restaurant empfehlen" : "Recommend Restaurant"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightweight Recommendation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-forest/15 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-forest/50 hover:text-forest p-1 rounded-full hover:bg-forest/5 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B84A] mb-2">
              <Sparkles className="w-4 h-4" />
              {isDe ? "Speisely Community Vote" : "Community Vote"}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-2">
              {isDe ? `${restaurantName} empfehlen` : `Recommend ${restaurantName}`}
            </h3>
            <p className="text-xs sm:text-sm text-forest/70 mb-5 leading-relaxed">
              {isDe
                ? "Wir kontaktieren das Team persönlich und laden sie ein, Speisely mit 0 % Provision für Direktbestellungen zu nutzen."
                : "We will contact the kitchen team and invite them to join Speisely with 0% commission on direct orders."}
            </p>

            <form onSubmit={handleRecommendSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  {isDe ? "Deine E-Mail-Adresse (optional)" : "Your email address (optional)"}
                </label>
                <input
                  type="email"
                  value={recommendEmail}
                  onChange={(e) => setRecommendEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest outline-none focus:border-[#E6B84A] focus:ring-1 focus:ring-[#E6B84A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  {isDe
                    ? "Dein Lieblingsgericht oder Notiz (optional)"
                    : "Your favorite dish or note (optional)"}
                </label>
                <textarea
                  rows={2}
                  value={recommendNote}
                  onChange={(e) => setRecommendNote(e.target.value)}
                  placeholder={
                    isDe
                      ? "z.B. Das Lammgericht ist unschlagbar..."
                      : "e.g. Their signature dish is incredible..."
                  }
                  className="w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest outline-none focus:border-[#E6B84A] focus:ring-1 focus:ring-[#E6B84A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-forest/70 hover:text-forest"
                >
                  {isDe ? "Abbrechen" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#173C32] text-white px-5 py-2.5 text-xs font-bold shadow hover:bg-[#0c1813] transition disabled:opacity-50"
                >
                  {submitting
                    ? isDe
                      ? "Wird gesendet..."
                      : "Submitting..."
                    : isDe
                      ? "Jetzt empfehlen"
                      : "Submit Recommendation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
