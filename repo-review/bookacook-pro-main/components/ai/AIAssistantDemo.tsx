"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export function AIAssistantDemo() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Willkommen bei Speisely. Ich bin Ihr persönlicher Hospitality-Assistent. Wie kann ich heute bei Ihrer Veranstaltung helfen?" }
  ]);
  const [input, setInput] = useState("");

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2rem] border border-[#eadfce] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#eadfce]">
        <Sparkles className="text-[#b28a3c]" />
        <h3 className="font-serif text-lg">Speisely AI Concierge</h3>
      </div>
      
      <div className="h-64 overflow-y-auto space-y-4 mb-6">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'ai' ? 'bg-[#faf6ee] text-[#16372f]' : 'bg-[#16372f] text-white ml-auto'}`}>
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Fragen Sie nach Catering oder Restaurant-Tipps..."
          className="flex-1 p-4 bg-[#fbf7ef] rounded-full border border-[#eadfce] outline-none focus:border-[#b28a3c]"
        />
        <button className="p-4 bg-[#16372f] text-white rounded-full hover:bg-[#0f2f27]">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
