import { useState, lazy, Suspense } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

const AiConciergeModal = lazy(() =>
  import("@/components/search/AiConciergeModal").then((m) => ({
    default: m.AiConciergeModal,
  })),
);

interface AiConciergeFloatingButtonProps {
  initialQuery?: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AiConciergeFloatingButton({
  initialQuery = "",
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}: AiConciergeFloatingButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const { lang } = useI18n();
  const isDe = lang === "de";

  const handleToggle = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleToggle(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-forest via-[#1a382c] to-[#b28a3c] text-white p-3 sm:px-5 sm:py-3 shadow-2xl border border-white/20 hover:border-[#f4d58d] transition-all cursor-pointer group backdrop-blur-md ${className}`}
        title={isDe ? "KI Catering-Berater öffnen" : "Open AI Catering Concierge"}
        aria-label={isDe ? "KI Catering-Berater öffnen" : "Open AI Catering Concierge"}
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4d58d] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f4d58d]" />
        </span>

        <Sparkles className="w-4 h-4 text-[#f4d58d] group-hover:rotate-12 transition-transform" />

        <span className="hidden sm:inline text-xs sm:text-sm font-bold tracking-tight">
          {isDe ? "✨ KI Event-Berater" : "✨ AI Event Concierge"}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <Suspense fallback={null}>
            <AiConciergeModal
              isOpen={isOpen}
              onClose={() => handleToggle(false)}
              initialQuery={initialQuery}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
