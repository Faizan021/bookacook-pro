import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  ChevronDown,
} from "lucide-react";
import { sendContactEmail } from "@/lib/email.functions";

export const Route = createFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const reason = formData.get("reason") as string;
    const company = formData.get("company") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      const result = await sendContactEmail({
        data: { name, email, reason, company, phone, message },
      });
      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      setError(
        tt(
          "Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
          "An error occurred while sending the message. Please try again later.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteShell darkHero>
      {/* Cinematic Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center -mt-20 lg:-mt-24 pt-36 pb-24 lg:pt-44 lg:pb-36 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.png"
            fetchPriority="high"
            alt="Contact Us Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/80 to-forest/95" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 flex flex-col items-center">
          <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f2d896] shadow-xl mb-6">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4 drop-shadow-md">
            {tt("Kontakt", "Contact")}
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight drop-shadow-sm mb-6">
            {tt("Lassen Sie uns reden", "Let's get in touch")}
          </h1>
          <p className="text-lg text-white/80 max-w-xl leading-relaxed drop-shadow-sm">
            {tt(
              "Haben Sie Fragen zu unseren Partnerprogrammen für Restaurants, Caterer oder Event-Planer? Schreiben Sie uns eine Nachricht.",
              "Have questions about our partner programs for restaurants, caterers, or event planners? Send us a message.",
            )}
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-16 lg:-mt-24 mx-auto max-w-3xl px-4 sm:px-6 pb-24">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-forest/10 border border-forest/10">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display text-forest mb-2">
                {tt("Nachricht gesendet!", "Message sent!")}
              </h2>
              <p className="text-forest/70 mb-8">
                {tt(
                  "Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.",
                  "Thank you for your message. We will get back to you as soon as possible.",
                )}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-forest text-cream px-6 py-2 rounded-full font-medium hover:bg-forest/90 transition"
              >
                {tt("Weitere Nachricht senden", "Send another message")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium text-forest block">
                  {tt("Betreff / Grund", "Contact Reason")}
                </label>
                <div className="relative">
                  <select
                    name="reason"
                    id="reason"
                    required
                    className="block w-full px-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest appearance-none"
                  >
                    <option value="">{tt("Bitte wählen...", "Please select...")}</option>
                    <option value="Join Speisely">
                      {tt(
                        "Speisely beitreten (Restaurants, Caterer, Planer)",
                        "Join Speisely (Restaurants, Caterers, Planners)",
                      )}
                    </option>
                    <option value="Support or Complaint">
                      {tt("Support oder Beschwerde", "Support or Complaint")}
                    </option>
                    <option value="Partnership or Promotion">
                      {tt("Partnerschaft oder Promotion", "Partnership or Promotion")}
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-forest/40" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-forest block">
                    {tt("Name", "Name")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-forest/40" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest"
                      placeholder={tt("Ihr Name", "Your name")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-forest block">
                    {tt("E-Mail Adresse", "Email Address")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-forest/40" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest"
                      placeholder={tt("ihre@email.de", "your@email.com")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-forest block">
                    {tt("Unternehmen (optional)", "Company (optional)")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-forest/40" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full pl-11 pr-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest"
                      placeholder={tt("Ihr Unternehmen", "Your company")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-forest block">
                    {tt("Telefonnummer (optional)", "Phone (optional)")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-forest/40" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="block w-full pl-11 pr-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest"
                      placeholder={tt("+49 123 456789", "+49 123 456789")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-forest block">
                  {tt("Ihre Nachricht", "Your Message")}
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-forest/40" />
                  </div>
                  <textarea
                    name="message"
                    id="message"
                    required
                    minLength={10}
                    rows={5}
                    className="block w-full pl-11 pr-4 py-3 bg-[oklch(0.97_0.02_92)]/50 border border-forest/10 rounded-xl focus:ring-2 focus:ring-forest focus:border-forest transition outline-none text-forest resize-y"
                    placeholder={tt("Wie können wir Ihnen helfen?", "How can we help you?")}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-forest text-cream py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-forest/90 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {tt("Nachricht senden", "Send Message")}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
