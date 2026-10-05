import { useState, useRef, useEffect, useTransition } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Users,
  MapPin,
  Calculator,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Utensils,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  chatWithConcierge,
  type ConciergeChatMessage,
  type RecommendedPartnerCard,
  type ExtractedEventBrief,
} from "@/lib/search/concierge.functions";
import { toast } from "sonner";

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function AiConciergeModal({ isOpen, onClose, initialQuery = "" }: AiConciergeModalProps) {
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([
    {
      role: "assistant",
      content:
        "Willkommen beim **Speisely Event-Concierge**! Erzählen Sie mir kurz von Ihrem Anlass: Wie viele Gäste erwarten Sie, in welcher Stadt und gibt es besondere Wünsche (z.B. vegetarisch, Fingerfood oder Live-Cooking)?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [eventBrief, setEventBrief] = useState<ExtractedEventBrief>({});
  const [partners, setPartners] = useState<RecommendedPartnerCard[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "🏢 Sommerfest 40 Personen",
    "🍢 Fingerfood Buffet ab 25 Pers.",
    "💍 Hochzeit 70 Gäste",
  ]);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // When opened with an initialQuery from the hero bar, send immediately
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim().length > 0 && messages.length === 1) {
      sendMessage(initialQuery.trim());
    }
  }, [isOpen, initialQuery]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isPending) return;

    const newMessages: ConciergeChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputValue("");

    startTransition(async () => {
      try {
        const response = await chatWithConcierge({
          data: {
            messages: newMessages,
            currentBrief: eventBrief,
          },
        });

        setMessages((prev) => [...prev, { role: "assistant", content: response.reply }]);
        setEventBrief(response.eventBrief);
        if (response.recommendedPartners?.length > 0) {
          setPartners(response.recommendedPartners);
        }
        if (response.quickReplies?.length > 0) {
          setQuickReplies(response.quickReplies);
        }
      } catch (err) {
        console.error("Concierge chat failed:", err);
        setMessages((prev) => [
          prev[prev.length - 1],
          {
            role: "assistant",
            content:
              "Es gab ein kurzes Verbindungsproblem. Ich habe Ihre Angaben trotzdem erfasst. Schauen Sie gerne direkt in unsere verifizierten Caterer!",
          },
        ]);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0c1813]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#142820] border border-white/15 text-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#b28a3c] to-[#f4d58d] flex items-center justify-center shadow-lg shadow-[#b28a3c]/30 text-forest">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">
                    Speisely Concierge
                  </h3>
                  <span className="rounded-full bg-[#b28a3c]/20 border border-[#b28a3c]/40 text-[#f4d58d] text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                    Google Gemini AI
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  Intelligente Event- &amp; Catering-Beratung mit Live-Kalkulation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Calculation & Brief HUD (if guests or budget are known) */}
          {(eventBrief.guests || eventBrief.city || eventBrief.estimatedTotalBudget) && (
            <div className="bg-[#1b342a] border-b border-white/10 px-5 py-2.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#f4d58d] flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" /> Kalkulation:
              </span>
              {eventBrief.guests && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/90 font-medium flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#f4d58d]" /> {eventBrief.guests} Gäste
                </span>
              )}
              {eventBrief.city && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/90 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#f4d58d]" /> {eventBrief.city}
                </span>
              )}
              {eventBrief.budgetPerPerson && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white/90 font-medium">
                  ~{eventBrief.budgetPerPerson} € / Kopf
                </span>
              )}
              {eventBrief.estimatedTotalBudget && (
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 border border-emerald-500/30">
                  Gesamt: ca. {eventBrief.estimatedTotalBudget.toLocaleString("de-DE")} €
                </span>
              )}
            </div>
          )}

          {/* Chat Message Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[#b28a3c]/20 border border-[#b28a3c]/40 flex items-center justify-center shrink-0 mt-1 text-[#f4d58d]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#b28a3c] text-forest font-medium rounded-br-none shadow-md shadow-[#b28a3c]/20"
                      : "bg-white/[0.07] border border-white/10 text-white/90 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>
                        {para.split("**").map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong
                              key={cIdx}
                              className={
                                msg.role === "user" ? "text-forest" : "text-white font-bold"
                              }
                            >
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          ),
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#b28a3c]/20 border border-[#b28a3c]/40 flex items-center justify-center shrink-0 text-[#f4d58d]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white/[0.07] border border-white/10 rounded-2xl rounded-bl-none p-4 text-white/60 text-xs flex items-center gap-2">
                  <span>Speisely Concierge kalkuliert Menüs &amp; Partner...</span>
                </div>
              </div>
            )}

            {/* Embedded Partner Recommendations */}
            {partners.length > 0 && (
              <div className="pt-2 pb-1 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#f4d58d] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Empfohlene Speisely Partner:
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {partners.slice(0, 2).map((partner) => (
                    <div
                      key={partner.id}
                      className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 hover:border-[#b28a3c] transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-bold text-white text-sm group-hover:text-[#f4d58d] transition">
                            {partner.name}
                          </span>
                          <span className="text-[11px] font-bold text-[#f4d58d]">
                            ★ {partner.rating}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 mb-2">
                          {partner.headline}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {partner.specialtyTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="rounded-md bg-white/10 text-white/70 text-[9px] px-1.5 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#f4d58d]">
                          {partner.pricePerPersonEstimate}
                        </span>
                        <Link
                          to="/catering/$slug"
                          params={{ slug: partner.slug }}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-[#b28a3c] hover:text-forest text-white px-2.5 py-1 text-[11px] font-bold transition"
                        >
                          <span>Profil</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Pills */}
          {quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-white/50 shrink-0">Schnellwahl:</span>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(qr)}
                  disabled={isPending}
                  className="shrink-0 rounded-full bg-white/10 hover:bg-[#b28a3c] hover:text-forest text-white/90 border border-white/15 px-3 py-1 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="p-3 sm:p-4 border-t border-white/10 bg-[#0d1a15] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="z.B. '45 Personen in Köln, Budget ca. 30 € p.P., bitte mit vegetarischer Option...'"
              disabled={isPending}
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#b28a3c] transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPending || !inputValue.trim()}
              className="rounded-full bg-[#b28a3c] hover:bg-[#9a7633] text-forest p-2.5 font-bold transition disabled:opacity-40 cursor-pointer shadow-md"
              aria-label="Senden"
            >
              <Send className="w-4 h-4 text-forest" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
