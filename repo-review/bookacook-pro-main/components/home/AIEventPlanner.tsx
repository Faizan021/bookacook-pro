"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Sparkles, Loader2 } from "lucide-react";

export function AIEventPlanner() {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    // Simulate AI reasoning
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-[2rem] border border-[#eadfce] shadow-sm hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#faf6ee] rounded-full text-[#b28a3c]">
          <Sparkles size={20} />
        </div>
        <h3 className="text-xl font-serif text-[#16372f]">Speisely AI Concierge</h3>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-32 flex flex-col items-center justify-center text-[#5c6f68]"
          >
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#16372f]" />
            <p className="text-sm tracking-wide uppercase font-medium">Curating your event...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your event vision (e.g. 'A private summer dinner for 12 in Berlin, Mediterranean style')..."
              className="w-full h-32 p-4 rounded-2xl bg-[#fbf7ef] border border-[#eadfce] focus:border-[#b28a3c] outline-none transition-all placeholder:text-[#a0a0a0]"
            />
            <div className="flex justify-between items-center">
              <button className="p-3 rounded-full hover:bg-[#faf6ee] transition text-[#5c6f68] hover:text-[#16372f]">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                className="bg-[#16372f] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0f2f27] transition flex items-center gap-2"
              >
                Plan my event <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
